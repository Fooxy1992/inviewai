/**
 * Módulo de captura de áudio para InViewAI
 * Responsável por capturar e processar áudio das reuniões do Google Meet
 */
(function() {
  'use strict';

  // Estado da captura
  let isCapturing = false;
  let audioContext = null;
  let mediaStream = null;
  let audioInput = null;
  let audioProcessor = null;
  let audioAnalyser = null;
  let callback = null;
  let debugMode = false;
  
  // Configurações
  const BUFFER_SIZE = 4096;
  const FFT_SIZE = 2048;
  
  // Constantes
  const MEET_AUDIO_SOURCE_SELECTORS = [
    'audio[id^="meeting-audio"]',     // Seletor para o áudio da reunião
    'audio[data-audio-type="meeting"]', // Alternativa para áudio da reunião
    'audio[src*="blob"]'              // Qualquer blob de áudio (menos específico)
  ];
  
  /**
   * Função para registrar mensagens de debug
   */
  function debugLog(...args) {
    if (debugMode) {
      console.log('[InViewAI AudioCapture]', ...args);
    }
  }
  
  /**
   * Ativa/desativa modo de debug
   */
  function setDebugMode(enabled) {
    debugMode = !!enabled;
    debugLog('Modo debug ' + (debugMode ? 'ativado' : 'desativado'));
  }
  
  /**
   * Encontra elementos de áudio no Google Meet
   */
  function findMeetAudioElements() {
    for (const selector of MEET_AUDIO_SOURCE_SELECTORS) {
      const elements = document.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        debugLog(`Encontrados ${elements.length} elementos de áudio usando seletor: ${selector}`);
        return Array.from(elements);
      }
    }
    return null;
  }
  
  /**
   * Tenta obter stream de áudio dos elementos do Meet
   */
  async function tryGetMeetAudioStream() {
    const audioElements = findMeetAudioElements();
    
    debugLog('Buscando elementos de áudio do Meet. Resultado:', 
             audioElements ? `Encontrados ${audioElements.length} elementos` : 'Nenhum elemento encontrado');
    
    if (!audioElements || audioElements.length === 0) {
      debugLog('Nenhum elemento de áudio do Meet encontrado. Tentando consulta DOM mais ampla.');
      
      // Log de todos os elementos de áudio na página para diagnóstico
      const allAudioElements = document.querySelectorAll('audio');
      debugLog(`Total de elementos <audio> na página: ${allAudioElements.length}`);
      allAudioElements.forEach((el, i) => {
        debugLog(`Áudio ${i+1}:`, {
          id: el.id,
          src: el.src,
          paused: el.paused,
          muted: el.muted,
          volume: el.volume,
          duration: el.duration,
          attributes: Array.from(el.attributes).map(a => `${a.name}="${a.value}"`).join(' ')
        });
      });
      
      return null;
    }
    
    // Tentar capturar áudio usando captureStream dos elementos de áudio
    for (const audio of audioElements) {
      try {
        debugLog('Tentando capturar stream do elemento:', audio);
        
        // Verificar se o elemento está tocando
        if (audio.paused) {
          debugLog('Elemento de áudio pausado, tentando reproduzir');
          // Tentar reproduzir silenciosamente
          audio.volume = 0.001;
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            await playPromise;
          }
        }
        
        // Tentar diferentes métodos de captura
        let stream = null;
        
        if (typeof audio.captureStream === 'function') {
          stream = audio.captureStream();
          debugLog('Capturou stream usando captureStream()');
        } else if (typeof audio.mozCaptureStream === 'function') {
          stream = audio.mozCaptureStream();
          debugLog('Capturou stream usando mozCaptureStream()');
        }
        
        if (stream && stream.getAudioTracks().length > 0) {
          debugLog('Stream capturado com sucesso, tracks:', stream.getTracks());
          return stream;
        }
      } catch (e) {
        debugLog('Erro ao capturar stream do elemento:', e);
      }
    }
    
    return null;
  }

  /**
   * Tenta obter áudio através de captura de tela
   * Este método tenta capturar o áudio do sistema que está sendo reproduzido
   */
  async function getDisplayMediaAudio() {
    try {
      debugLog('Tentando capturar áudio via getDisplayMedia');
      
      // Verificar suporte
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        debugLog('getDisplayMedia não é suportado neste navegador');
        return null;
      }
      
      // Solicitar acesso à tela com áudio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      // Verificar se temos faixas de áudio
      if (stream.getAudioTracks().length === 0) {
        debugLog('Stream de captura de tela não tem faixas de áudio');
        stream.getTracks().forEach(track => track.stop());
        return null;
      }
      
      debugLog('Captura de áudio via getDisplayMedia bem-sucedida');
      return stream;
    } catch (error) {
      debugLog('Erro ao capturar áudio via getDisplayMedia:', error);
      return null;
    }
  }

  /**
   * Gera um stream de áudio simulado para testes
   * Útil quando não conseguimos capturar áudio real
   */
  function createSimulatedAudioStream() {
    debugLog('Criando stream de áudio simulado para testes');
    
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Configurar o oscilador para frequência de voz humana e volume baixo
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime); // 440Hz é Lá padrão
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime); // Volume muito baixo
    
    // Conectar os nós
    oscillator.connect(gainNode);
    
    // Criar um stream a partir do nó de ganho
    const destination = ctx.createMediaStreamDestination();
    gainNode.connect(destination);
    
    // Iniciar o oscilador
    oscillator.start();
    
    debugLog('Stream de áudio simulado criado com sucesso');
    return destination.stream;
  }

  /**
   * Emite um evento de status de captura de áudio
   */
  function emitStatusEvent(statusData) {
    const event = new CustomEvent('audiocapture:status', {
      detail: {
        isCapturing,
        source: statusData.source || 'none',
        timestamp: Date.now(),
        ...statusData
      }
    });
    
    dispatchEvent(event);
    debugLog('Evento de status emitido:', event.detail);
  }

  /**
   * Emite um evento de nível de áudio
   */
  function emitAudioLevelEvent(level) {
    const event = new CustomEvent('audiocapture:level', {
      detail: {
        level,
        timestamp: Date.now()
      }
    });
    
    dispatchEvent(event);
  }

  /**
   * Calcula o nível de áudio a partir de um buffer de áudio
   */
  function calculateAudioLevel(audioBuffer) {
    if (!audioBuffer || !audioBuffer.length) return 0;
    
    // Calcular RMS (Root Mean Square) do buffer
    let sum = 0;
    for (let i = 0; i < audioBuffer.length; i++) {
      sum += audioBuffer[i] * audioBuffer[i];
    }
    
    const rms = Math.sqrt(sum / audioBuffer.length);
    
    // Normalizar para um valor entre 0 e 1
    // Valores típicos de RMS são muito pequenos, então aplicamos uma escala
    const normalizedLevel = Math.min(1, Math.max(0, rms * 5));
    
    return normalizedLevel;
  }

  /**
   * Inicia a captura de áudio
   * @param {Function} processingCallback - Função para processar os dados de áudio
   * @returns {boolean} - true se iniciado com sucesso, false caso contrário
   */
  async function startCapture(processingCallback) {
    if (isCapturing) {
      debugLog('Captura já está ativa');
      return false;
    }
    
    debugLog('=== INICIANDO DIAGNÓSTICO DE CAPTURA DE ÁUDIO ===');
    debugLog('Informações do navegador:', {
      userAgent: navigator.userAgent,
      plataforma: navigator.platform,
      vendor: navigator.vendor
    });
    
    debugLog('Verificando suporte a APIs de áudio:', {
      AudioContext: typeof AudioContext !== 'undefined',
      webkitAudioContext: typeof webkitAudioContext !== 'undefined',
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!navigator.mediaDevices?.getUserMedia,
      captureStream: typeof HTMLAudioElement.prototype.captureStream === 'function',
      mozCaptureStream: typeof HTMLAudioElement.prototype.mozCaptureStream === 'function'
    });
    
    if (typeof processingCallback !== 'function') {
      console.error('Callback de processamento inválido');
      dispatchEvent(new CustomEvent('audiocapture:error', {
        detail: { error: 'Callback inválido' }
      }));
      return false;
    }
    
    callback = processingCallback;
    
    try {
      debugLog('Iniciando captura de áudio');
      
      // Criar contexto de áudio
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Primeiro tentar capturar áudio do Meet
      let meetStream = await tryGetMeetAudioStream();
      let audioSource = 'none';
      
      // Se não conseguimos capturar do Meet, tentar captura de tela
      if (!meetStream) {
        debugLog('Não foi possível capturar áudio do Meet, tentando captura de tela');
        meetStream = await getDisplayMediaAudio();
        audioSource = meetStream ? 'display' : 'none';
      } else {
        audioSource = 'meet';
      }
      
      // Se não conseguimos capturar da tela, tentar o microfone local
      if (!meetStream) {
        debugLog('Não foi possível capturar áudio da tela, tentando microfone local');
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            },
            video: false
          });
          debugLog('Captura de microfone bem-sucedida:', mediaStream);
          audioSource = 'mic';
        } catch (micError) {
          debugLog('Erro ao capturar microfone:', micError);
          
          // Último recurso: criar um stream simulado para testes
          debugLog('Usando stream de áudio simulado como último recurso');
          mediaStream = createSimulatedAudioStream();
          audioSource = 'simulated';
        }
      } else {
        mediaStream = meetStream;
        debugLog('Usando stream do Meet/Captura:', mediaStream);
      }
      
      // Conectar stream ao contexto de áudio
      audioInput = audioContext.createMediaStreamSource(mediaStream);
      
      // Criar analisador de áudio para volume
      audioAnalyser = audioContext.createAnalyser();
      audioAnalyser.fftSize = FFT_SIZE;
      audioInput.connect(audioAnalyser);
      
      // Criar processador de script para análise
      audioProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
      
      audioProcessor.addEventListener('audioprocess', processAudio);
      
      // Conectar nós
      audioAnalyser.connect(audioProcessor);
      audioProcessor.connect(audioContext.destination);
      
      isCapturing = true;
      
      // Emitir evento de status
      emitStatusEvent({ 
        source: audioSource,
        error: null
      });
      
      // Disparar evento
      dispatchEvent(new CustomEvent('audiocapture:started', {
        detail: { source: audioSource }
      }));
      
      return true;
    } catch (error) {
      console.error('Erro ao iniciar captura de áudio:', error);
      emitStatusEvent({ 
        error: error.message || 'Erro desconhecido ao iniciar captura de áudio'
      });
      dispatchEvent(new CustomEvent('audiocapture:error', {
        detail: { error: error.message || error.toString() }
      }));
      
      // Limpar recursos em caso de erro
      stopCapture();
      return false;
    }
  }
  
  /**
   * Processa os dados de áudio
   * Esta função é chamada com dados de áudio brutos
   */
  function processAudio(event) {
    if (!isCapturing || !callback) {
      return;
    }
    
    // Obter dados de volume
    const bufferLength = audioAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    audioAnalyser.getByteFrequencyData(dataArray);
    
    // Calcular volume médio (0-255)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const averageVolume = sum / bufferLength;
    
    // Criar cópia do buffer de áudio para processamento
    const inputBuffer = event.inputBuffer;
    const audioBuffer = {
      sampleRate: inputBuffer.sampleRate,
      length: inputBuffer.length,
      duration: inputBuffer.duration,
      numberOfChannels: inputBuffer.numberOfChannels,
      buffer: new Float32Array(inputBuffer.getChannelData(0))
    };
    
    // Calcular o nível de áudio
    const level = calculateAudioLevel(audioBuffer.buffer);
    
    // Emitir evento de nível de áudio a cada 5 chamadas para não sobrecarregar
    if (Math.random() < 0.2) { // ~20% das chamadas
      emitAudioLevelEvent(level);
    }
    
    // Chamar o callback com os dados de áudio
    if (typeof callback === 'function') {
      try {
        callback(audioBuffer, { level });
      } catch (e) {
        console.error('Erro no callback de processamento de áudio:', e);
      }
    }
  }
  
  /**
   * Para a captura de áudio
   */
  function stopCapture() {
    if (!isCapturing) return;
    
    debugLog('Parando captura de áudio');
    
    // Limpar processador
    if (audioProcessor) {
      audioProcessor.removeEventListener('audioprocess', processAudio);
      audioProcessor.disconnect();
      audioProcessor = null;
    }
    
    // Limpar outras conexões
    if (audioAnalyser) {
      audioAnalyser.disconnect();
      audioAnalyser = null;
    }
    
    if (audioInput) {
      audioInput.disconnect();
      audioInput = null;
    }
    
    // Parar stream
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    
    // Fechar contexto
    if (audioContext && audioContext.state !== 'closed') {
      if (typeof audioContext.close === 'function') {
        audioContext.close();
      }
      audioContext = null;
    }
    
    isCapturing = false;
    callback = null;
    
    // Disparar evento
    dispatchEvent(new CustomEvent('audiocapture:stopped'));
    
    return true;
  }

  // Exportar módulo
  window.AudioCaptureModule = {
    start: startCapture,
    stop: stopCapture,
    setDebug: setDebugMode,
    isCapturing: () => isCapturing
  };
  
  debugLog('Módulo de captura de áudio carregado');
})();
