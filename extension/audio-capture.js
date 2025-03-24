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
    
    if (!audioElements || audioElements.length === 0) {
      debugLog('Nenhum elemento de áudio do Meet encontrado');
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
   * Inicia a captura de áudio
   * @param {Function} processingCallback - Função para processar os dados de áudio
   * @returns {boolean} - true se iniciado com sucesso, false caso contrário
   */
  async function startCapture(processingCallback) {
    if (isCapturing) {
      debugLog('Captura já está ativa');
      return false;
    }
    
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
      const meetStream = await tryGetMeetAudioStream();
      
      // Se não conseguimos capturar do Meet, tentar o microfone local
      if (!meetStream) {
        debugLog('Não foi possível capturar áudio do Meet, tentando microfone local');
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        });
        debugLog('Microfone local capturado com sucesso');
      } else {
        mediaStream = meetStream;
        debugLog('Stream do Google Meet capturado com sucesso');
      }
      
      // Conectar stream ao contexto de áudio
      audioInput = audioContext.createMediaStreamSource(mediaStream);
      
      // Criar analisador de áudio para volume
      audioAnalyser = audioContext.createAnalyser();
      audioAnalyser.fftSize = FFT_SIZE;
      audioInput.connect(audioAnalyser);
      
      // Criar processador de script para análise
      audioProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
      
      audioProcessor.addEventListener('audioprocess', processAudioEvent);
      
      // Conectar nós
      audioAnalyser.connect(audioProcessor);
      audioProcessor.connect(audioContext.destination);
      
      isCapturing = true;
      
      // Disparar evento
      dispatchEvent(new CustomEvent('audiocapture:started', {
        detail: { source: meetStream ? 'google-meet' : 'microphone' }
      }));
      
      return true;
    } catch (error) {
      console.error('Erro ao iniciar captura de áudio:', error);
      dispatchEvent(new CustomEvent('audiocapture:error', {
        detail: { error: error.message || error.toString() }
      }));
      
      // Limpar recursos em caso de erro
      stopCapture();
      return false;
    }
  }
  
  /**
   * Processa eventos de áudio
   */
  function processAudioEvent(event) {
    if (!isCapturing || !callback) return;
    
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
    
    // Invocar callback com os dados processados
    callback({
      timestamp: Date.now(),
      volume: averageVolume,
      buffer: audioBuffer
    });
  }
  
  /**
   * Para a captura de áudio
   */
  function stopCapture() {
    if (!isCapturing) return;
    
    debugLog('Parando captura de áudio');
    
    // Limpar processador
    if (audioProcessor) {
      audioProcessor.removeEventListener('audioprocess', processAudioEvent);
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
