/**
 * InViewAI - Popup Script
 * 
 * Script para controlar a interface do popup da extensão.
 */

// Elementos da UI
const supportedContent = document.getElementById('supported-content');
const unsupportedContent = document.getElementById('unsupported-content');

// Status elements
const platformStatusDot = document.getElementById('platform-status-dot');
const platformStatusText = document.getElementById('platform-status-text');
const authStatusDot = document.getElementById('authentication-status-dot');
const authStatusText = document.getElementById('authentication-status-text');

// Buttons
const startInterviewBtn = document.getElementById('start-interview-btn');
const loginBtn = document.getElementById('login-btn');
const openSupportedBtn = document.getElementById('open-supported-btn');

// Links
const profileLink = document.getElementById('profile-link');
const dashboardLink = document.getElementById('dashboard-link');
const practiceLink = document.getElementById('practice-link');
const settingsLink = document.getElementById('settings-link');
const helpLink = document.getElementById('help-link');

// Constante para controlar se o login é obrigatório
const LOGIN_REQUIRED = false; // Defina como true para voltar a exigir login

// URLs - Usando a aplicação deployada no Vercel
// Substitua 'inviewai.vercel.app' pelo seu domínio de produção no Vercel
const BASE_URL = 'https://inviewai.vercel.app';
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const PROFILE_URL = `${BASE_URL}/dashboard/settings`;
const SETTINGS_URL = `${BASE_URL}/dashboard/settings`;
const HELP_URL = `${BASE_URL}/help`;
const PRACTICE_URL = `${BASE_URL}/dashboard/practice`;
const LOGIN_URL = `${BASE_URL}/login`;

// Log de URLs para depuração
console.log('URLs configuradas para ambiente de produção:', { 
  BASE_URL,
  LOGIN_URL,
  DASHBOARD_URL
});

// Estado da aplicação
let appState = {
  isPlatformSupported: false,
  platform: null,
  isLoggedIn: false
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup inicializado');
  console.log('Modo de login temporariamente desativado');
  
  // Verificar o estado atual
  checkCurrentTab();
  
  // Configurar event listeners
  setupEventListeners();
  
  // Verificar se o servidor de teste está acessível
  checkServerStatus();
  
  updateAuthStatus();
});

// Verificar status do servidor
function checkServerStatus() {
  console.log('Verificando status do servidor de teste em:', BASE_URL);
  
  fetch(BASE_URL + '/users')
    .then(response => {
      console.log(`API de teste respondeu com status:`, response.status);
      if (response.ok) {
        console.log('API está acessível. Usando JSONPlaceholder como ambiente de teste.');
        updateServerStatus(true);
      } else {
        console.warn('API respondeu, mas com erro:', response.status);
        updateServerStatus(false);
      }
    })
    .catch(error => {
      console.error('Erro ao conectar com o servidor de teste:', error);
      updateServerStatus(false);
    });
}

// Atualizar status do servidor na UI
function updateServerStatus(isOnline) {
  if (isOnline) {
    platformStatusText.textContent = 'Servidor de teste: Online';
    platformStatusDot.className = 'status-dot active';
  } else {
    platformStatusText.textContent = 'Servidor de teste: Offline';
    platformStatusDot.className = 'status-dot inactive';
  }
}

// Verificar a aba atual
function checkCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const currentTab = tabs[0];
      console.log('Tab atual:', currentTab.url);
      checkIfSupportedPlatform(currentTab.url);
    }
  });
  
  // Verificar estado de login (simplificado para demo)
  appState.isLoggedIn = false;
  updateAuthStatus();
}

// Verificar se a URL atual é uma plataforma suportada
function checkIfSupportedPlatform(url) {
  const supportedPlatforms = [
    { name: 'Google Meet', pattern: 'meet.google.com' },
    { name: 'Zoom', pattern: 'zoom.us' },
    { name: 'Microsoft Teams', pattern: 'teams.microsoft.com' }
  ];
  
  for (const platform of supportedPlatforms) {
    if (url && url.includes(platform.pattern)) {
      appState.isPlatformSupported = true;
      appState.platform = platform.name;
      console.log('Plataforma suportada detectada:', platform.name);
      break;
    }
  }
  
  // Atualizar a interface com base no estado
  updateUI();
}

// Atualizar status de autenticação
function updateAuthStatus() {
  if (appState.isLoggedIn) {
    authStatusDot.className = 'status-dot active';
    authStatusText.textContent = 'Autenticado';
    loginBtn.innerHTML = '<span class="btn-icon">🔑</span> Logout';
  } else {
    authStatusDot.className = 'status-dot inactive';
    if (LOGIN_REQUIRED) {
      authStatusText.textContent = 'Não autenticado. Faça login para usar o assistente.';
    } else {
      authStatusText.textContent = 'Autenticação opcional. O assistente pode ser utilizado sem login.';
    }
    loginBtn.innerHTML = '<span class="btn-icon">🔑</span> Fazer Login';
  }
}

// Atualizar a interface com base no estado atual
function updateUI() {
  if (appState.isPlatformSupported) {
    supportedContent.style.display = 'block';
    unsupportedContent.style.display = 'none';
    
    // O texto da plataforma agora é atualizado pela função updateServerStatus
  } else {
    supportedContent.style.display = 'none';
    unsupportedContent.style.display = 'block';
  }
}

// Função para testar explicitamente a conexão com o content script
function testContentScriptConnection(tabId) {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(
        tabId,
        { type: 'INVIEWAI_TEST_CONNECTION' },
        response => {
          if (chrome.runtime.lastError) {
            console.error('Erro no teste de conexão:', chrome.runtime.lastError.message);
            reject({
              error: chrome.runtime.lastError.message,
              isContentScriptError: true
            });
            return;
          }
          
          if (response && response.success) {
            console.log('Conexão com content script estabelecida com sucesso:', response);
            resolve(response);
          } else {
            reject({
              error: 'Resposta inválida do content script',
              response: response
            });
          }
        }
      );
    } catch (error) {
      console.error('Exceção ao testar conexão:', error);
      reject({ error: error.message, isException: true });
    }
  });
}

// Configurar event listeners
function setupEventListeners() {
  // Botão de iniciar assistente
  startInterviewBtn.addEventListener('click', () => {
    console.log('Botão de iniciar assistente clicado');
    
    // Verificação de login desativada temporariamente
    if (LOGIN_REQUIRED && !appState.isLoggedIn) {
      alert('Por favor, faça login primeiro.');
      return;
    }
    
    // Mostrar feedback visual de que o botão foi clicado
    startInterviewBtn.textContent = 'Iniciando...';
    startInterviewBtn.disabled = true;
    
    // Obter a aba ativa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const activeTab = tabs[0];
        
        // Verificar primeiro se estamos numa URL de plataforma suportada
        const url = activeTab.url || '';
        const isGoogleMeet = url.includes('meet.google.com');
        const isZoom = url.includes('zoom.us');
        const isTeams = url.includes('teams.microsoft.com');
        
        if (!isGoogleMeet && !isZoom && !isTeams) {
          startInterviewBtn.textContent = 'Iniciar Assistente';
          startInterviewBtn.disabled = false;
          alert('Esta página não é uma plataforma suportada. O assistente funciona apenas no Google Meet, Zoom ou Microsoft Teams.');
          return;
        }
        
        // Primeiro testar a conexão com o content script
        testContentScriptConnection(activeTab.id)
          .then(() => {
            // Se a conexão funcionar, enviar comando para iniciar o assistente
            chrome.tabs.sendMessage(
              activeTab.id,
              { type: 'INVIEWAI_START_ASSISTANT', action: 'startAssistant' },
              (response) => {
                // Restaurar estado do botão
                startInterviewBtn.textContent = 'Iniciar Assistente';
                startInterviewBtn.disabled = false;
                
                if (chrome.runtime.lastError) {
                  console.error('Erro ao iniciar assistente:', chrome.runtime.lastError.message);
                  alert(`Erro ao iniciar o assistente: ${chrome.runtime.lastError.message}`);
                  return;
                }
                
                if (response && response.success) {
                  console.log('Assistente iniciado com sucesso!');
                  alert('Assistente iniciado com sucesso!');
                } else if (response && response.error) {
                  console.error('Erro reportado pelo content script:', response.error);
                  alert(`Erro: ${response.error}`);
                } else {
                  console.log('Resposta indefinida, assumindo modo de teste');
                  alert('Assistente iniciado! (Modo de teste)');
                }
              }
            );
          })
          .catch(error => {
            // Restaurar estado do botão
            startInterviewBtn.textContent = 'Iniciar Assistente';
            startInterviewBtn.disabled = false;
            
            console.error('Falha no teste de conexão:', error);
            
            // Verificar problema de permissão
            if (error.isContentScriptError) {
              if (isGoogleMeet || isZoom || isTeams) {
                // Estamos em uma plataforma suportada, mas o content script não está disponível
                // Tentaremos injetar o script programaticamente
                injectContentScripts(activeTab.id, url);
              } else {
                alert('O content script não está disponível nesta página. Recarregue a extensão ou verifique as permissões.');
              }
            } else {
              alert(`Erro ao conectar com o content script: ${error.error}`);
            }
          });
      } else {
        startInterviewBtn.textContent = 'Iniciar Assistente';
        startInterviewBtn.disabled = false;
        alert('Não foi possível acessar a aba atual.');
      }
    });
  });
  
  // Botão de login
  loginBtn.addEventListener('click', () => {
    console.log('Botão de login clicado');
    
    if (appState.isLoggedIn) {
      // Se já estiver logado, fazer logout
      appState.isLoggedIn = false;
      updateAuthStatus();
      alert('Logout realizado com sucesso!');
    } else {
      // Abrir página de login de teste
      console.log('Abrindo página de teste:', LOGIN_URL);
      
      chrome.tabs.create({ url: LOGIN_URL }, (tab) => {
        console.log('Página de teste aberta com sucesso:', tab);
        
        // Simulando login bem-sucedido após 2 segundos
        setTimeout(() => {
          appState.isLoggedIn = true;
          updateAuthStatus();
          alert('Login simulado realizado com sucesso!');
        }, 2000);
      });
    }
  });
  
  // Botão para abrir plataforma suportada
  openSupportedBtn.addEventListener('click', () => {
    console.log('Botão para abrir plataforma suportada clicado');
    chrome.tabs.create({ url: 'https://meet.google.com/' });
  });
  
  // Links
  profileLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Link de perfil clicado, abrindo:', PROFILE_URL);
    chrome.tabs.create({ url: PROFILE_URL });
  });
  
  dashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Link de dashboard clicado, abrindo:', DASHBOARD_URL);
    chrome.tabs.create({ url: DASHBOARD_URL });
  });

  practiceLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Link de prática clicado, abrindo:', PRACTICE_URL);
    chrome.tabs.create({ url: PRACTICE_URL });
  });
  
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Link de configurações clicado, abrindo:', SETTINGS_URL);
    chrome.tabs.create({ url: SETTINGS_URL });
  });
  
  helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Link de ajuda clicado, abrindo:', HELP_URL);
    chrome.tabs.create({ url: HELP_URL });
  });
}

// Função para injetar os scripts programaticamente
function injectContentScripts(tabId, url) {
  console.log('Tentando injetar scripts programaticamente na aba:', tabId);
  
  // Verificar se temos permissão para scripting
  if (!chrome.scripting) {
    alert('Esta versão do Chrome não suporta injeção de scripts programática. Por favor, recarregue a página ou reinstale a extensão.');
    return;
  }
  
  // Mostrar alerta de que estamos tentando corrigir o problema
  alert('O content script não foi carregado automaticamente. Tentando injetar os scripts manualmente...');
  
  // Injetar os scripts de content
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['audio-capture.js', 'content.js']
  }, (results) => {
    if (chrome.runtime.lastError) {
      console.error('Erro ao injetar scripts:', chrome.runtime.lastError);
      alert(`Falha ao injetar scripts: ${chrome.runtime.lastError.message}`);
      return;
    }
    
    console.log('Scripts injetados com sucesso:', results);
    
    // Injetar CSS
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['overlay.css']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Erro ao injetar CSS:', chrome.runtime.lastError);
        return;
      }
      
      console.log('CSS injetado com sucesso');
      
      // Tentar iniciar o assistente após injeção
      setTimeout(() => {
        alert('Scripts injetados com sucesso. Tente iniciar o assistente novamente.');
      }, 500);
    });
  });
}
