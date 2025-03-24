/**
 * InViewAI - Overlay Script
 * 
 * Este script gerencia a interface de sobreposição da extensão InViewAI
 * durante sessões de entrevista.
 */

// Estado da aplicação
const appState = {
  isRecording: false,
  isPaused: false,
  isMinimized: false,
  feedbackInterval: null,
  positionClass: 'bottom-right',
  authenticated: false,
  userId: null,
  token: null,
  currentTranscription: null,
  settings: {
    realtime: true,
    contentSuggestions: true,
    nonverbal: true,
    fillerWords: true,
    feedbackFormat: 'icons-text',
    overlayPosition: 'bottom-right',
    sensitivity: 50
  }
};

// Configuração global - autenticação opcional
const LOGIN_REQUIRED = false; // Defina como true para voltar a exigir login

// Elementos da UI
const overlay = document.getElementById('inviewai-overlay');
const settingsPanel = document.getElementById('inviewai-settings-panel');
const feedbackList = document.getElementById('inviewai-feedback-list');
const suggestionBox = document.getElementById('inviewai-suggestion');
const transcriptionBox = document.getElementById('inviewai-transcription');
const loginPanel = document.getElementById('inviewai-login-panel');
const connectingIndicator = document.getElementById('inviewai-connecting');

// Botões e controles
const settingsBtn = document.getElementById('inviewai-settings-btn');
const minimizeBtn = document.getElementById('inviewai-minimize-btn');
const closeBtn = document.getElementById('inviewai-close-btn');
const configBtn = document.getElementById('inviewai-config-btn');
const pauseBtn = document.getElementById('inviewai-pause-btn');
const loginBtn = document.getElementById('inviewai-login-btn');
const emailInput = document.getElementById('inviewai-email');
const passwordInput = document.getElementById('inviewai-password');
const loginErrorMsg = document.getElementById('inviewai-login-error');

// Configurações
const settingRealtime = document.getElementById('setting-realtime');
const settingContentSuggestions = document.getElementById('setting-content-suggestions');
const settingNonverbal = document.getElementById('setting-nonverbal');
const settingFillerWords = document.getElementById('setting-filler-words');
const formatOptions = document.querySelectorAll('input[name="feedback-format"]');
const positionOptions = document.querySelectorAll('input[name="overlay-position"]');
const saveSettingsBtn = document.getElementById('settings-save-btn');
const restoreSettingsBtn = document.getElementById('settings-restore-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initEventListeners();
  updateUIFromSettings();
  
  // Carregar dados de autenticação salvos
  loadAuthData();
  
  // Notificar o content script que o overlay está pronto
  window.parent.postMessage({ type: 'INVIEWAI_OVERLAY_READY' }, '*');
});

// Event Listeners
function initEventListeners() {
  // Botões principais
  settingsBtn.addEventListener('click', toggleSettingsPanel);
  minimizeBtn.addEventListener('click', toggleMinimize);
  closeBtn.addEventListener('click', closeOverlay);
  configBtn.addEventListener('click', toggleSettingsPanel);
  pauseBtn.addEventListener('click', togglePause);

  // Botões de configurações
  saveSettingsBtn.addEventListener('click', saveSettings);
  restoreSettingsBtn.addEventListener('click', restoreDefaultSettings);
  
  // Botões de autenticação
  loginBtn.addEventListener('click', handleLogin);
  
  // Tornar a sobreposição arrastável
  makeOverlayDraggable();
  
  // Escuta de mensagens do content script
  window.addEventListener('message', handleContentScriptMessages);
}

// Autenticação
function loadAuthData() {
  // Na implementação real, usar chrome.storage.local
  const authData = localStorage.getItem('inviewai-auth');
  if (authData) {
    try {
      const data = JSON.parse(authData);
      if (data.userId && data.token) {
        appState.userId = data.userId;
        appState.token = data.token;
        appState.authenticated = true;
        
        // Esconder painel de login e mostrar UI principal
        toggleLoginPanel(false);
        
        // Enviar dados de autenticação para o content script
        sendMessageToParent({
          type: 'INVIEWAI_AUTH_DATA',
          userId: appState.userId,
          token: appState.token
        });
      } else {
        toggleLoginPanel(true);
      }
    } catch (e) {
      console.error('Erro ao carregar dados de autenticação:', e);
      toggleLoginPanel(true);
    }
  } else {
    toggleLoginPanel(true);
  }
}

function handleLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!email || !password) {
    showLoginError('Por favor, preencha todos os campos');
    return;
  }
  
  // Mostrar indicador de carregamento
  loginBtn.textContent = 'Conectando...';
  loginBtn.disabled = true;
  loginErrorMsg.textContent = '';
  
  // Na implementação real, fazer chamada ao backend para autenticar
  // Para esta demonstração, simulamos uma chamada de API bem-sucedida
  setTimeout(() => {
    // Simulação de resposta da API
    const mockUserId = 'user_' + Math.floor(Math.random() * 10000);
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    // Salvar dados de autenticação
    appState.userId = mockUserId;
    appState.token = mockToken;
    appState.authenticated = true;
    
    // Salvar no armazenamento local
    localStorage.setItem('inviewai-auth', JSON.stringify({
      userId: mockUserId,
      token: mockToken
    }));
    
    // Enviar dados de autenticação para o content script
    sendMessageToParent({
      type: 'INVIEWAI_AUTH_DATA',
      userId: mockUserId,
      token: mockToken
    });
    
    // Esconder painel de login
    toggleLoginPanel(false);
    
    // Resetar botão
    loginBtn.textContent = 'Entrar';
    loginBtn.disabled = false;
  }, 1500);
}

function showLoginError(message) {
  loginErrorMsg.textContent = message;
  loginErrorMsg.style.display = 'block';
}

function toggleLoginPanel(show) {
  if (show) {
    loginPanel.style.display = 'flex';
    overlay.classList.add('login-mode');
  } else {
    loginPanel.style.display = 'none';
    overlay.classList.remove('login-mode');
  }
}

// Funções de controle da UI
function toggleSettingsPanel() {
  settingsPanel.classList.toggle('hidden');
}

function toggleMinimize() {
  appState.isMinimized = !appState.isMinimized;
  overlay.classList.toggle('minimized', appState.isMinimized);
  
  if (appState.isMinimized) {
    pauseBtn.textContent = 'Expandir';
  } else {
    pauseBtn.textContent = appState.isPaused ? 'Retomar feedback' : 'Pausar feedback';
  }
}

function closeOverlay() {
  // Para gravação se estiver ativa
  if (appState.isRecording) {
    stopRecording();
  }
  
  overlay.style.display = 'none';
  
  // Notifica o content script que a sobreposição foi fechada
  window.parent.postMessage({ type: 'INVIEWAI_OVERLAY_CLOSED' }, '*');
}

function togglePause() {
  if (appState.isMinimized) {
    toggleMinimize();
    return;
  }
  
  appState.isPaused = !appState.isPaused;
  pauseBtn.textContent = appState.isPaused ? 'Retomar feedback' : 'Pausar feedback';
  
  if (appState.isPaused) {
    stopRecording();
  } else {
    startRecording();
  }
}

// Controle de posicionamento
function updatePosition() {
  // Remover todas as classes de posição
  overlay.classList.remove('top-right', 'top-left', 'bottom-right', 'bottom-left');
  
  // Adicionar a classe correspondente à configuração atual
  overlay.classList.add(appState.settings.overlayPosition);
}

// Função para tornar a sobreposição arrastável
function makeOverlayDraggable() {
  let isDragging = false;
  let offsetX, offsetY;
  
  const header = document.querySelector('.inviewai-header');
  
  header.addEventListener('mousedown', (e) => {
    // Ativar somente quando a opção "floating" estiver selecionada
    if (appState.settings.overlayPosition === 'floating') {
      isDragging = true;
      overlay.classList.add('draggable');
      
      offsetX = e.clientX - overlay.getBoundingClientRect().left;
      offsetY = e.clientY - overlay.getBoundingClientRect().top;
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      overlay.style.left = `${e.clientX - offsetX}px`;
      overlay.style.top = `${e.clientY - offsetY}px`;
      overlay.style.bottom = 'auto';
      overlay.style.right = 'auto';
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    overlay.classList.remove('draggable');
  });
}

// Gerenciamento de configurações
function loadSettings() {
  // Na implementação real, carregar do chrome.storage
  const savedSettings = localStorage.getItem('inviewai-settings');
  if (savedSettings) {
    try {
      appState.settings = JSON.parse(savedSettings);
    } catch (e) {
      console.error('Erro ao carregar configurações:', e);
    }
  }
}

function saveSettings() {
  // Coletar configurações do form
  appState.settings.realtime = settingRealtime.checked;
  appState.settings.contentSuggestions = settingContentSuggestions.checked;
  appState.settings.nonverbal = settingNonverbal.checked;
  appState.settings.fillerWords = settingFillerWords.checked;
  
  // Format
  formatOptions.forEach(option => {
    if (option.checked) {
      appState.settings.feedbackFormat = option.id.replace('format-', '');
    }
  });
  
  // Position
  positionOptions.forEach(option => {
    if (option.checked) {
      appState.settings.overlayPosition = option.id.replace('position-', '');
    }
  });
  
  // Salvar no armazenamento local (na implementação real, usar chrome.storage)
  localStorage.setItem('inviewai-settings', JSON.stringify(appState.settings));
  
  // Atualizar a UI
  updateUIFromSettings();
  
  // Fechar o painel de configurações
  toggleSettingsPanel();
}

function restoreDefaultSettings() {
  // Configurações padrão
  appState.settings = {
    realtime: true,
    contentSuggestions: true,
    nonverbal: true,
    fillerWords: true,
    feedbackFormat: 'icons-text',
    overlayPosition: 'bottom-right',
    sensitivity: 50
  };
  
  // Atualizar UI
  updateUIFromSettings();
  
  // Salvar no armazenamento
  localStorage.setItem('inviewai-settings', JSON.stringify(appState.settings));
}

function updateUIFromSettings() {
  // Atualizar checkboxes
  settingRealtime.checked = appState.settings.realtime;
  settingContentSuggestions.checked = appState.settings.contentSuggestions;
  settingNonverbal.checked = appState.settings.nonverbal;
  settingFillerWords.checked = appState.settings.fillerWords;
  
  // Atualizar opções de formato
  document.getElementById(`format-${appState.settings.feedbackFormat}`).checked = true;
  
  // Atualizar opções de posição
  document.getElementById(`position-${appState.settings.overlayPosition}`).checked = true;
  
  // Aplicar posição
  updatePosition();
}

// Comunicação com o script de conteúdo
function sendMessageToParent(message) {
  window.parent.postMessage(message, '*');
}

function handleContentScriptMessages(event) {
  // Verificar se a mensagem vem do pai (content script)
  if (event.source !== window.parent) return;
  
  const message = event.data;
  if (!message || !message.type) return;
  
  console.log('Mensagem recebida do content script:', message.type);
  
  switch (message.type) {
    case 'INVIEWAI_INIT':
      // Content script inicializou o overlay
      break;
      
    case 'INVIEWAI_RECORDING_STARTED':
      updateRecordingStatus(true);
      break;
      
    case 'INVIEWAI_RECORDING_STOPPED':
      updateRecordingStatus(false);
      break;
      
    case 'INVIEWAI_TRANSCRIPTION_UPDATE':
      updateTranscription(message.transcription);
      break;
      
    case 'INVIEWAI_FEEDBACK_UPDATE':
      updateFeedback(message.feedback);
      break;
      
    case 'INVIEWAI_SUGGESTION_UPDATE':
      updateSuggestion(message.suggestion);
      break;
      
    case 'INVIEWAI_ERROR':
      showError(message.error);
      break;
  }
}

// Funções de manipulação de gravação
function startRecording() {
  if (LOGIN_REQUIRED && !appState.authenticated) {
    showError('Faça login para iniciar a captura de áudio');
    return;
  }
  
  // Mostrar indicador de conexão
  connectingIndicator.style.display = 'block';
  
  // Enviar comando para iniciar gravação
  sendMessageToParent({
    type: 'INVIEWAI_START_RECORDING',
    userId: appState.userId || 'anonymous_user',
    token: appState.token || 'anonymous_token'
  });
}

function stopRecording() {
  // Esconder indicador de conexão
  connectingIndicator.style.display = 'none';
  
  // Enviar comando para parar gravação
  sendMessageToParent({
    type: 'INVIEWAI_STOP_RECORDING'
  });
}

function updateRecordingStatus(isRecording) {
  appState.isRecording = isRecording;
  
  if (isRecording) {
    overlay.classList.add('recording');
    pauseBtn.textContent = 'Pausar feedback';
    // Esconder indicador de conexão
    connectingIndicator.style.display = 'none';
  } else {
    overlay.classList.remove('recording');
    pauseBtn.textContent = 'Iniciar feedback';
  }
}

// Funções de atualização da UI
function updateTranscription(transcription) {
  if (!transcription || !transcription.text) return;
  
  appState.currentTranscription = transcription;
  
  // Atualizar área de transcrição
  if (transcriptionBox) {
    const speaker = transcription.speaker === 'interviewer' ? 'Entrevistador' : 'Você';
    transcriptionBox.innerHTML = `<strong>${speaker}:</strong> ${transcription.text}`;
    transcriptionBox.style.display = 'block';
    
    // Scroll para o final
    transcriptionBox.scrollTop = transcriptionBox.scrollHeight;
  }
}

function updateFeedback(feedback) {
  if (!feedback) return;
  
  // Determinar classe baseada no tipo de feedback
  let feedbackClass = 'neutral';
  let icon = '';
  
  if (typeof feedback === 'string') {
    // Feedback é apenas texto
    addFeedbackItem(feedback, feedbackClass, icon);
  } else if (Array.isArray(feedback)) {
    // Feedback é um array de itens
    feedback.forEach(item => {
      if (typeof item === 'string') {
        addFeedbackItem(item, 'neutral', '');
      } else if (typeof item === 'object') {
        const type = item.type || 'neutral';
        const text = item.text || item.message || '';
        const itemIcon = item.icon || getIconForType(type);
        addFeedbackItem(text, type, itemIcon);
      }
    });
  } else if (typeof feedback === 'object') {
    // Feedback é um objeto
    const type = feedback.type || 'neutral';
    const text = feedback.text || feedback.message || '';
    const itemIcon = feedback.icon || getIconForType(type);
    addFeedbackItem(text, type, itemIcon);
  }
}

function getIconForType(type) {
  switch (type) {
    case 'positive':
      return '👍';
    case 'negative':
      return '⚠️';
    case 'suggestion':
      return '💡';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '';
  }
}

function addFeedbackItem(text, type, icon) {
  if (!text) return;
  
  // Criar elemento de feedback
  const feedbackItem = document.createElement('div');
  feedbackItem.className = `feedback-item ${type || 'neutral'}`;
  
  // Determinar formato baseado nas configurações
  const format = appState.settings.feedbackFormat;
  
  let content = '';
  if (format === 'icons-text' && icon) {
    content = `<span class="feedback-icon">${icon}</span> ${text}`;
  } else if (format === 'icons-only' && icon) {
    content = `<span class="feedback-icon" title="${text}">${icon}</span>`;
  } else {
    content = text;
  }
  
  feedbackItem.innerHTML = content;
  
  // Adicionar ao início da lista
  if (feedbackList.firstChild) {
    feedbackList.insertBefore(feedbackItem, feedbackList.firstChild);
  } else {
    feedbackList.appendChild(feedbackItem);
  }
  
  // Limitar o número de itens de feedback
  while (feedbackList.children.length > 10) {
    feedbackList.removeChild(feedbackList.lastChild);
  }
  
  // Animação de entrada
  setTimeout(() => {
    feedbackItem.classList.add('show');
  }, 50);
}

function updateSuggestion(suggestion) {
  if (!suggestion) return;
  
  // Determinar se é texto simples ou objeto
  const sugText = typeof suggestion === 'string' ? suggestion : suggestion.text || suggestion.message || '';
  
  if (!sugText) return;
  
  if (suggestionBox) {
    suggestionBox.innerHTML = sugText;
    suggestionBox.style.display = 'block';
    
    // Adicionar classe para animação
    suggestionBox.classList.add('new-suggestion');
    setTimeout(() => {
      suggestionBox.classList.remove('new-suggestion');
    }, 1000);
    
    // Reproduzir som de notificação (opcional)
    playNotificationSound();
  }
}

function showError(errorMessage) {
  if (!errorMessage) return;
  
  // Adicionar ao feedbackList com estilo de erro
  addFeedbackItem(errorMessage, 'error', '❌');
  
  // Esconder indicador de conexão
  connectingIndicator.style.display = 'none';
}

function playNotificationSound() {
  // Som simples de notificação
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.2);
    
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    console.error('Erro ao reproduzir som:', e);
  }
} 