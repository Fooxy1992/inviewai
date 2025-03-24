/**
 * InViewAI - Background Script Simplificado
 */

// Configurações
const SUPPORTED_DOMAINS = [
  'meet.google.com',
  'zoom.us',
  'teams.microsoft.com'
];

// Estado da extensão
let extensionState = {
  userLoggedIn: false,
  activeTabId: null,
  activePlatform: null,
  sessionInProgress: false,
  contentScriptTabs: {},  // Rastrear tabs onde o content script está ativo
  debugMode: true         // Modo de debug ativado para solução de problemas
};

// Função de log de debug
function debugLog(...args) {
  if (extensionState.debugMode) {
    console.log('[InViewAI Debug]', ...args);
  }
}

// Inicialização
chrome.runtime.onInstalled.addListener(() => {
  debugLog('InViewAI: Extensão instalada/atualizada');
  debugLog('Monitorando plataformas:', SUPPORTED_DOMAINS);
});

// Escutar mensagens de outros componentes da extensão
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return false;
  
  debugLog('Mensagem recebida no background script:', message.type, message);
  
  switch (message.type) {
    case 'INVIEWAI_CONTENT_LOADED':
      // Content script notificando que foi carregado
      if (sender.tab && sender.tab.id) {
        extensionState.contentScriptTabs[sender.tab.id] = {
          url: sender.tab.url || message.url,
          timestamp: Date.now()
        };
        debugLog('Content script carregado na tab:', sender.tab.id, sender.tab.url);
      }
      sendResponse({ success: true, acknowledged: true });
      return true;
      
    case 'INVIEWAI_GET_STATUS':
      sendResponse({
        userLoggedIn: extensionState.userLoggedIn,
        sessionInProgress: extensionState.sessionInProgress,
        activePlatform: extensionState.activePlatform,
        contentScriptActive: sender.tab ? 
          !!extensionState.contentScriptTabs[sender.tab.id] : false
      });
      return true;
      
    case 'INVIEWAI_START_ASSISTANT':
      debugLog('Recebido comando para iniciar assistente');
      sendResponse({ success: true });
      return true;
      
    case 'INVIEWAI_CHECK_CONTENT_SCRIPT':
      // Verificar se um content script está ativo em uma determinada aba
      if (message.tabId) {
        const isActive = !!extensionState.contentScriptTabs[message.tabId];
        debugLog('Verificação de content script para tab', message.tabId, 'resultado:', isActive);
        sendResponse({ 
          active: isActive, 
          info: extensionState.contentScriptTabs[message.tabId] 
        });
      } else {
        sendResponse({ active: false, error: 'ID da tab não especificado' });
      }
      return true;
  }
  
  return false;
});

// Gerenciar mudanças de abas
chrome.tabs.onActivated.addListener((activeInfo) => {
  extensionState.activeTabId = activeInfo.tabId;
  
  // Verificar se a nova aba ativa é uma plataforma de videoconferência
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    checkIfSupportedPlatform(tab);
  });
});

// Gerenciar navegação em abas
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Verificar se a URL foi atualizada
  if (changeInfo.url) {
    debugLog('URL de tab atualizada:', tabId, changeInfo.url);
    
    // Verificar se a nova URL é uma plataforma de videoconferência
    checkIfSupportedPlatform(tab);
    
    // Verificar se esta tab tinha um content script, mas a URL mudou
    if (extensionState.contentScriptTabs[tabId]) {
      debugLog('Tab mudou de URL após carregar content script:', 
        extensionState.contentScriptTabs[tabId].url, '->', changeInfo.url);
      
      // Remover do registro se a URL não é mais uma plataforma suportada
      const isSupportedPlatform = SUPPORTED_DOMAINS.some(domain => 
        changeInfo.url.includes(domain));
      
      if (!isSupportedPlatform) {
        debugLog('URL não é mais suportada, removendo registro de content script');
        delete extensionState.contentScriptTabs[tabId];
      }
    }
  } else if (changeInfo.status === 'complete') {
    // A página terminou de carregar completamente
    const url = tab.url || '';
    const isSupportedPlatform = SUPPORTED_DOMAINS.some(domain => 
      url.includes(domain));
    
    if (isSupportedPlatform) {
      debugLog('Página suportada carregada completamente:', tabId, url);
      
      // Verificar se o content script está ativo após alguns segundos
      setTimeout(() => {
        if (!extensionState.contentScriptTabs[tabId]) {
          debugLog('Content script não registrado após carregamento completo. Verificando status...');
          
          // Tentar se comunicar com o content script
          chrome.tabs.sendMessage(tabId, { type: 'INVIEWAI_TEST_CONNECTION' }, (response) => {
            if (chrome.runtime.lastError) {
              debugLog('Content script não está respondendo:', chrome.runtime.lastError.message);
              
              // Considerar injeção manual do script
              if (shouldInjectManually(tab)) {
                injectContentScriptsManually(tabId, url);
              }
            } else if (response && response.success) {
              debugLog('Content script está respondendo mas não registrou:', response);
              // Registrar o content script
              extensionState.contentScriptTabs[tabId] = {
                url: url,
                timestamp: Date.now(),
                autoDetected: true
              };
            }
          });
        }
      }, 3000); // Verificar após 3 segundos
    }
  }
});

// Função para verificar se estamos em uma plataforma suportada
function checkIfSupportedPlatform(tab) {
  if (!tab || !tab.url) return false;
  
  const url = tab.url;
  let detectedPlatform = null;
  
  // Detectar plataforma
  if (url.includes('meet.google.com')) {
    detectedPlatform = 'Google Meet';
  } else if (url.includes('zoom.us')) {
    detectedPlatform = 'Zoom';
  } else if (url.includes('teams.microsoft.com')) {
    detectedPlatform = 'Microsoft Teams';
  }
  
  // Atualizar estado
  extensionState.activePlatform = detectedPlatform;
  
  return !!detectedPlatform;
}

// Verificar se devemos injetar manualmente o content script
function shouldInjectManually(tab) {
  // Somente injetar em plataformas suportadas
  if (!checkIfSupportedPlatform(tab)) return false;
  
  // Verificar histórico de injeções para esta tab
  const tabInjectionHistory = extensionState.contentScriptTabs[tab.id];
  if (tabInjectionHistory && tabInjectionHistory.manualInjection) {
    // Já tentamos uma injeção manual, verificar quanto tempo passou
    const timeSinceLastInjection = Date.now() - tabInjectionHistory.manualInjection;
    
    // Não tentar novamente se faz menos de 5 minutos
    if (timeSinceLastInjection < 5 * 60 * 1000) {
      debugLog('Ignorando injeção manual, última tentativa foi há menos de 5 minutos');
      return false;
    }
  }
  
  return true;
}

// Injetar content scripts manualmente
function injectContentScriptsManually(tabId, url) {
  debugLog('Tentando injetar content scripts manualmente na tab:', tabId);
  
  // Registrar a tentativa
  extensionState.contentScriptTabs[tabId] = {
    url: url,
    manualInjection: Date.now(),
    successful: false
  };
  
  // Verificar se temos permissão para scripting
  if (!chrome.scripting) {
    debugLog('API scripting não disponível');
    return;
  }
  
  // Injetar os scripts
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['audio-capture.js', 'content.js']
  }, (results) => {
    if (chrome.runtime.lastError) {
      debugLog('Erro ao injetar scripts manualmente:', chrome.runtime.lastError);
      return;
    }
    
    debugLog('Scripts injetados manualmente com sucesso:', results);
    
    // Atualizar o registro
    extensionState.contentScriptTabs[tabId].successful = true;
    
    // Injetar CSS
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['overlay.css']
    }, () => {
      if (chrome.runtime.lastError) {
        debugLog('Erro ao injetar CSS manualmente:', chrome.runtime.lastError);
        return;
      }
      
      debugLog('CSS injetado manualmente com sucesso');
    });
  });
} 