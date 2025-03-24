(function() {
  // Evita inicialização múltipla
  if (window.inviewAIInitialized) {
    console.log('InViewAI já inicializado nesta página. Ignorando...');
    return;
  }
  
  window.inviewAIInitialized = true;
  console.log('Content script carregado na URL:', window.location.href);

  // Variáveis para controlar o estado do assistente
  let assistantState = {
    isActive: false,
    overlayInjected: false,
    isRecording: false,
    debugMode: true,
    initialized: false,
    platform: null,
    userId: null,
    userToken: null,
    autoStart: false,
    detectedSpeech: false,
    questionTimer: null,
    overlayError: null
  };

  // Função para log condicional
  function debugLog(...args) {
    if (assistantState.debugMode) {
      console.log('[InViewAI Debug]', ...args);
    }
  }

  // Tenta notificar o background script que o content script está ativo
  function notifyContentScriptActive() {
    try {
      chrome.runtime.sendMessage({
        type: 'INVIEWAI_CONTENT_LOADED', 
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }, response => {
        debugLog('Resposta do background script para notificação de carregamento:', response);
      });
    } catch (e) {
      console.error('Erro ao notificar background script:', e);
    }
  }

  // Tentar registrar imediatamente
  notifyContentScriptActive();

  // Adicionar um listener para evento de inicialização direta
  document.addEventListener('INVIEWAI_SCRIPT_LOADED', () => {
    debugLog('Recebido evento de carregamento direto do script');
    notifyContentScriptActive();
  });

  // Função mais robusta para escutar mensagens
  function setupMessageListener() {
    try {
      chrome.runtime.onMessage.addListener(function messageHandler(message, sender, sendResponse) {
        debugLog('Content script recebeu mensagem:', message);
        
        // Sempre responder a testes de conexão imediatamente
        if (message.type === 'INVIEWAI_TEST_CONNECTION') {
          debugLog('Teste de conexão com content script - Respondendo...');
          sendResponse({ 
            success: true, 
            location: window.location.href,
            initialized: assistantState.initialized,
            platform: 'Google Meet'
          });
          return true;
        }
        
        if (message.type === 'INVIEWAI_START_ASSISTANT' || message.action === "startAssistant") {
          debugLog('Inicializando assistente de entrevista');
          try {
            initAssistant();
            sendResponse({ success: true });
          } catch (error) {
            debugLog('Erro ao inicializar assistente:', error);
            sendResponse({ success: false, error: error.message });
          }
          return true;
        }
        
        // Responder a qualquer mensagem não tratada para evitar erros de conexão
        sendResponse({ 
          success: false, 
          message: 'Comando não reconhecido pelo content script',
          initialized: assistantState.initialized
        });
        return true;
      });
      debugLog('Listener de mensagens configurado com sucesso');
    } catch (e) {
      console.error('Erro ao configurar listener de mensagens:', e);
    }
  }

  // Configurar o listener de mensagens
  setupMessageListener();

  // Função para inicializar o assistente
  function initAssistant() {
    if (assistantState.isActive) {
      debugLog('Assistente já está ativo');
      return;
    }
    
    debugLog('Inicializando assistente de entrevista');
    assistantState.isActive = true;
    
    // Injetar o overlay se ainda não foi injetado
    if (!assistantState.overlayInjected) {
      injectOverlay();
    } else {
      // Se já injetado, apenas torná-lo visível
      const overlayFrame = document.getElementById('inviewai-overlay-frame');
      if (overlayFrame) {
        overlayFrame.style.display = 'block';
      }
    }
    
    // Notificar o usuário
    showNotification('Assistente de Entrevista Ativado', 'O assistente agora está monitorando a entrevista.');
  }

  // Função para injetar o overlay
  function injectOverlay() {
    debugLog('Injetando overlay de assistente');
    
    return new Promise((resolve, reject) => {
      // Verificar se já existe
      if (document.getElementById('inviewai-overlay-frame')) {
        debugLog('Overlay já injetado');
        resolve(true);
        return;
      }
      
      try {
        // Criar iframe para o overlay
        const overlayFrame = document.createElement('iframe');
        overlayFrame.id = 'inviewai-overlay-frame';
        overlayFrame.src = chrome.runtime.getURL('overlay.html');
        overlayFrame.style.position = 'fixed';
        overlayFrame.style.right = '20px';
        overlayFrame.style.bottom = '20px';
        overlayFrame.style.width = '350px';
        overlayFrame.style.height = '400px';
        overlayFrame.style.border = 'none';
        overlayFrame.style.zIndex = '9999';
        
        document.body.appendChild(overlayFrame);
        assistantState.overlayInjected = true;
        
        // Configurar listeners para mensagens do overlay
        window.addEventListener('message', handleOverlayMessages);
        
        debugLog('Overlay injetado com sucesso');
        resolve(true);
      } catch (error) {
        console.error('Erro ao injetar overlay:', error);
        reject(error);
      }
    });
  }

  // Função para lidar com mensagens do overlay
  function handleOverlayMessages(event) {
    // Verificar se a mensagem vem do nosso overlay
    if (!event.data || !event.data.type || !event.data.type.startsWith('INVIEWAI_')) return;
    
    debugLog('Mensagem recebida do overlay:', event.data.type);
    
    switch (event.data.type) {
      case 'INVIEWAI_OVERLAY_READY':
        // O overlay foi carregado e está pronto
        debugLog('Overlay está pronto');
        break;
        
      case 'INVIEWAI_START_RECORDING':
        // Iniciar captura de áudio
        startAudioCapture(event.data.userId, event.data.token);
        break;
        
      case 'INVIEWAI_STOP_RECORDING':
        // Parar captura de áudio
        stopAudioCapture();
        break;
        
      case 'INVIEWAI_OVERLAY_CLOSED':
        // O overlay foi fechado
        assistantState.isActive = false;
        break;
    }
  }

  // Função para injetar o script de captura de áudio
  function injectAudioCaptureScript() {
    debugLog('Injetando módulo de captura de áudio');
    
    return new Promise((resolve, reject) => {
      // Verificar se já existe
      if (window.AudioCaptureModule) {
        debugLog('Módulo de captura de áudio já carregado');
        resolve(true);
        return;
      }
      
      // Obter URL do script
      const audioScriptURL = chrome.runtime.getURL('audio-capture.js');
      
      // Criar elemento do script
      const scriptElement = document.createElement('script');
      scriptElement.src = audioScriptURL;
      scriptElement.type = 'text/javascript';
      scriptElement.id = 'inviewai-audio-script';
      
      // Definir callbacks
      scriptElement.onload = () => {
        debugLog('Script de captura de áudio carregado com sucesso');
        
        // Verificar se o módulo está disponível
        if (window.AudioCaptureModule) {
          debugLog('Módulo de áudio disponível após carregamento');
          
          // Ativar debug no módulo se necessário
          if (assistantState.debugMode) {
            try {
              window.AudioCaptureModule.setDebug(true);
            } catch (e) {
              console.error('Erro ao ativar debug no módulo de áudio:', e);
            }
          }
          
          resolve(true);
        } else {
          const error = new Error('Módulo de áudio não disponível após carregamento do script');
          console.error(error);
          reject(error);
        }
      };
      
      scriptElement.onerror = (error) => {
        console.error('Erro ao carregar script de captura de áudio:', error);
        reject(error);
      };
      
      // Injetar no documento
      (document.head || document.documentElement).appendChild(scriptElement);
    });
  }

  // Função para iniciar a captura de áudio
  function startAudioCapture(userId, token) {
    debugLog('Iniciando captura de áudio para o usuário:', userId);
    
    if (assistantState.isRecording) {
      debugLog('Captura de áudio já está ativa');
      return;
    }
    
    // Verificar se o módulo de áudio está disponível
    if (!window.AudioCaptureModule) {
      console.error('Módulo de captura de áudio não encontrado');
      showNotification('Erro na captura de áudio', 'Não foi possível iniciar a captura de áudio. Tente recarregar a página.');
      return;
    }
    
    // Função para processar os dados de áudio
    const processAudioData = (audioData) => {
      // Registrar dados recebidos em log se debug estiver ativado
      if (assistantState.debugMode) {
        debugLog('Dados de áudio recebidos:', 
          `Timestamp: ${audioData.timestamp}, ` +
          `Volume: ${audioData.volume.toFixed(2)}, ` +
          `Amostra: ${audioData.buffer.length} amostras`
        );
      }
      
      // Detectar se há fala com base no volume (simulação simples)
      const isSpeaking = audioData.volume > 30; // Threshold arbitrário
      
      // Atualizar estado de detecção
      if (isSpeaking && !assistantState.detectedSpeech) {
        assistantState.detectedSpeech = true;
        debugLog('Fala detectada, iniciando transcrição');
        
        // Após alguns segundos de fala, simular que detectamos uma pergunta
        if (!assistantState.questionTimer) {
          assistantState.questionTimer = setTimeout(() => {
            debugLog('Pergunta detectada, gerando resposta');
            simulateTranscriptionUpdates();
          }, 3000);
        }
      } else if (!isSpeaking && assistantState.detectedSpeech) {
        assistantState.detectedSpeech = false;
        debugLog('Pausa na fala detectada');
      }
    };
    
    // Iniciar captura usando o módulo
    try {
      const result = window.AudioCaptureModule.start(processAudioData);
      
      if (result === false) {
        debugLog('Falha ao iniciar captura. O módulo pode já estar gravando ou ocorreu um erro.');
        return;
      }
      
      // Adicionar listeners para eventos do módulo de áudio
      window.addEventListener('audiocapture:started', (e) => {
        debugLog('Evento de início de captura recebido:', e.detail);
        assistantState.isRecording = true;
        assistantState.detectedSpeech = false;
        assistantState.questionTimer = null;
        
        // Notificar o overlay que a gravação começou
        sendMessageToOverlay({
          type: 'INVIEWAI_RECORDING_STARTED'
        });
      });
      
      window.addEventListener('audiocapture:error', (e) => {
        console.error('Erro na captura de áudio:', e.detail);
        showNotification('Erro na captura de áudio', 
          `Falha ao iniciar gravação: ${e.detail.error || 'Erro desconhecido'}`);
      });
      
      // Inicializar o estado de detecção
      assistantState.detectedSpeech = false;
      assistantState.questionTimer = null;
      
      debugLog('Solicitação de captura de áudio enviada ao módulo');
    } catch (error) {
      console.error('Erro ao iniciar captura de áudio:', error);
      
      // Como fallback, usamos a simulação existente para demonstração
      debugLog('Usando simulação como fallback');
      assistantState.isRecording = true;
      
      // Notificar o overlay que a gravação começou
      sendMessageToOverlay({
        type: 'INVIEWAI_RECORDING_STARTED'
      });
      
      // Simular recebimento de uma pergunta após alguns segundos
      setTimeout(() => {
        if (assistantState.isRecording) {
          simulateTranscriptionUpdates();
        }
      }, 5000);
    }
  }

  // Função para parar a captura de áudio
  function stopAudioCapture() {
    debugLog('Parando captura de áudio');
    
    if (!assistantState.isRecording) return;
    
    // Limpar timers e estado
    if (assistantState.questionTimer) {
      clearTimeout(assistantState.questionTimer);
      assistantState.questionTimer = null;
    }
    assistantState.detectedSpeech = false;
    
    // Tentar usar o módulo de captura de áudio se disponível
    if (window.AudioCaptureModule) {
      try {
        window.AudioCaptureModule.stop();
      } catch (e) {
        console.error('Erro ao parar captura de áudio:', e);
      }
    }
    
    assistantState.isRecording = false;
    
    // Notificar o overlay que a gravação parou
    sendMessageToOverlay({
      type: 'INVIEWAI_RECORDING_STOPPED'
    });
  }

  // Função para enviar mensagem para o overlay
  function sendMessageToOverlay(message) {
    const overlayFrame = document.getElementById('inviewai-overlay-frame');
    if (overlayFrame) {
      overlayFrame.contentWindow.postMessage(message, '*');
    }
  }

  // Função para mostrar notificação ao usuário
  function showNotification(title, message) {
    // Verificar se as notificações da web são suportadas
    if (!("Notification" in window)) {
      debugLog('Notificações não são suportadas neste navegador');
      return;
    }
    
    // Verificar permissão de notificação
    if (Notification.permission === "granted") {
      new Notification(title, { body: message, icon: 'icons/icon48.png' });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body: message, icon: 'icons/icon48.png' });
        }
      });
    }
  }

  // Função para simular atualizações de transcrição (para demonstração)
  function simulateTranscriptionUpdates() {
    if (!assistantState.isRecording) return;
    
    // Simular uma transcrição do entrevistador
    sendMessageToOverlay({
      type: 'INVIEWAI_TRANSCRIPTION_UPDATE',
      transcription: {
        speaker: 'interviewer',
        text: 'Me fale sobre suas experiências com desenvolvimento web e quais tecnologias você domina.',
        timestamp: Date.now()
      }
    });
    
    // Após 1 segundo, enviar uma sugestão de resposta
    setTimeout(() => {
      if (!assistantState.isRecording) return;
      
      sendMessageToOverlay({
        type: 'INVIEWAI_SUGGESTION_UPDATE',
        suggestion: 'Tenho 5 anos de experiência com desenvolvimento web, trabalhando principalmente com React, Node.js e TypeScript. Desenvolvi aplicações completas desde o frontend até o backend, com foco em criar interfaces responsivas e APIs eficientes. Minha experiência inclui implementação de autenticação, testes automatizados e integração com diversos serviços.'
      });
      
      // Enviar alguns feedbacks úteis
      sendMessageToOverlay({
        type: 'INVIEWAI_FEEDBACK_UPDATE',
        feedback: [
          { type: 'info', text: 'Mencione projetos específicos' },
          { type: 'suggestion', text: 'Destaque sua experiência com trabalho em equipe' }
        ]
      });
    }, 1000);
  }

  // Registrar presença ao carregar
  debugLog('Content script COMPLETAMENTE carregado em:', window.location.href);

  // Testar se o runtime da extensão está disponível
  if (chrome.runtime) {
    debugLog('Runtime da extensão está acessível');
  } else {
    console.error('Runtime da extensão NÃO está acessível!');
  }
  
  // Verificar periodicamente se o runtime da extensão ainda está acessível
  setInterval(() => {
    try {
      if (chrome.runtime) {
        // Enviar heartbeat para o background script
        chrome.runtime.sendMessage({
          type: 'INVIEWAI_HEARTBEAT',
          url: window.location.href,
          timestamp: Date.now()
        });
      }
    } catch (e) {
      console.warn('Exceção no heartbeat:', e);
    }
  }, 30000); // A cada 30 segundos

  // Inicialização principal da extensão
  function initializeExtension() {
    debugLog('Inicializando extensão no Google Meet');
    
    // Verificar se já inicializado
    if (assistantState.initialized) {
      debugLog('Extensão já inicializada');
      return;
    }
    
    // Configurar detecção de plataforma
    detectMeetingPlatform();
    
    // Se não for uma plataforma suportada, sair
    if (!assistantState.platform) {
      debugLog('Plataforma não suportada');
      return;
    }
    
    // Registrar eventos para comunicação com o popup
    setupMessageHandlers();
    
    // Injetar módulo de captura de áudio
    injectAudioCaptureScript()
      .then(() => {
        debugLog('Módulo de áudio carregado com sucesso');
        
        // Verificar se deve iniciar automaticamente
        if (assistantState.autoStart && assistantState.userId) {
          debugLog('Iniciando assistente automaticamente');
          startAssistant(assistantState.userId, assistantState.userToken);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar módulo de áudio:', error);
        showNotification('Erro de inicialização', 
          'Não foi possível carregar o módulo de captura de áudio. A funcionalidade pode estar limitada.');
      });
    
    // Injetar overlay UI
    injectOverlay()
      .then(() => {
        debugLog('Overlay injetado com sucesso');
        
        // Estabelecer comunicação com o overlay
        setupOverlayCommunication();
        
        // Marcar como inicializado
        assistantState.initialized = true;
        
        // Registrar no log que a extensão está pronta
        console.log('🎙️ InViewAI inicializado com sucesso no Google Meet!');
        
        // Notificar popup sobre o status
        sendStatusToPlatform();
      })
      .catch(error => {
        console.error('Erro ao injetar overlay:', error);
        assistantState.overlayError = error.message;
        
        // Notificar popup sobre o erro
        sendStatusToPlatform();
      });
  }

  // Iniciar a extensão quando o documento estiver totalmente carregado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    // Se o documento já estiver carregado, iniciar imediatamente
    initializeExtension();
  }
  
  // Também tentar inicializar quando a janela estiver totalmente carregada
  window.addEventListener('load', () => {
    debugLog('Evento load detectado, verificando inicialização');
    if (!assistantState.initialized) {
      debugLog('Extensão ainda não inicializada, tentando novamente');
      initializeExtension();
    }
  });

  // Função para detectar a plataforma de reunião atual
  function detectMeetingPlatform() {
    // Detectar o Google Meet
    if (window.location.hostname.includes('meet.google.com')) {
      assistantState.platform = 'google-meet';
      debugLog('Plataforma detectada: Google Meet');
      return;
    }
    
    // Sem plataforma reconhecida
    assistantState.platform = null;
    debugLog('Nenhuma plataforma de reunião suportada foi detectada');
  }
  
  // Configurar comunicação bidirecional com o overlay
  function setupOverlayCommunication() {
    debugLog('Configurando comunicação com o overlay');
    // Já configurado em handleOverlayMessages, mas podemos adicionar mais aqui se necessário
    
    // Enviar estado inicial para o overlay
    setTimeout(() => {
      sendMessageToOverlay({
        type: 'INVIEWAI_INIT_STATE',
        state: {
          isRecording: assistantState.isRecording,
          debugMode: assistantState.debugMode,
          platform: assistantState.platform
        }
      });
    }, 1000); // Dar tempo para o iframe carregar
  }
  
  // Configurar handlers adicionais para mensagens entre popup e content script
  function setupMessageHandlers() {
    debugLog('Configurando handlers de mensagens adicionais');
    
    // Já existem handlers em setupMessageListener(), mas podemos adicionar mais específicos
    try {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // Mensagens específicas da plataforma
        if (message.type === 'INVIEWAI_GET_PLATFORM_STATUS') {
          sendResponse({
            success: true,
            platform: assistantState.platform,
            isActive: assistantState.isActive,
            isRecording: assistantState.isRecording,
            overlayInjected: assistantState.overlayInjected,
            error: assistantState.overlayError || null
          });
          return true;
        }
        
        // Iniciar assistente com credenciais
        if (message.type === 'INVIEWAI_START_WITH_CREDENTIALS') {
          if (message.userId && assistantState.platform) {
            startAssistant(message.userId, message.token);
            sendResponse({ success: true });
          } else {
            sendResponse({ 
              success: false, 
              error: 'Plataforma não suportada ou credenciais inválidas' 
            });
          }
          return true;
        }
        
        // Alternar modo de debug
        if (message.type === 'INVIEWAI_TOGGLE_DEBUG') {
          assistantState.debugMode = !!message.enabled;
          debugLog('Modo debug ' + (assistantState.debugMode ? 'ativado' : 'desativado'));
          
          // Atualizar também no módulo de áudio se disponível
          if (window.AudioCaptureModule && typeof window.AudioCaptureModule.setDebug === 'function') {
            window.AudioCaptureModule.setDebug(assistantState.debugMode);
          }
          
          sendResponse({ success: true, debugEnabled: assistantState.debugMode });
          return true;
        }
      });
    } catch (e) {
      console.error('Erro ao configurar handlers de mensagens adicionais:', e);
    }
  }
  
  // Enviar status atual para popup/plataforma
  function sendStatusToPlatform() {
    try {
      chrome.runtime.sendMessage({
        type: 'INVIEWAI_PLATFORM_STATUS',
        status: {
          platform: assistantState.platform,
          isActive: assistantState.isActive,
          isRecording: assistantState.isRecording,
          overlayInjected: assistantState.overlayInjected,
          timestamp: Date.now(),
          error: assistantState.overlayError || null
        }
      });
    } catch (e) {
      console.error('Erro ao enviar status para a plataforma:', e);
    }
  }
  
  // Função para iniciar o assistente com credenciais
  function startAssistant(userId, token) {
    debugLog('Iniciando assistente com ID de usuário:', userId);
    
    // Ativar o assistente
    if (!assistantState.isActive) {
      initAssistant();
    }
    
    // Armazenar credenciais para uso futuro
    assistantState.userId = userId;
    assistantState.userToken = token;
    
    // Se o overlay já estiver injetado, enviar comando para iniciar gravação
    if (assistantState.overlayInjected) {
      sendMessageToOverlay({
        type: 'INVIEWAI_START_ASSISTANT',
        userId: userId,
        token: token
      });
    } else {
      // Se não estiver, injetar overlay e depois iniciar
      injectOverlay()
        .then(() => {
          setTimeout(() => {
            sendMessageToOverlay({
              type: 'INVIEWAI_START_ASSISTANT',
              userId: userId,
              token: token
            });
          }, 1000); // Dar tempo para o iframe carregar
        })
        .catch(error => {
          console.error('Erro ao injetar overlay para iniciar assistente:', error);
          assistantState.overlayError = error.message;
        });
    }
  }
})();
