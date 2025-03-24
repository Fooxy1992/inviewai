# Especificação Técnica - InViewAI

## Pilha de Tecnologia

### Frontend

#### Extensão Chrome
- **Linguagens**: JavaScript, TypeScript
- **Framework**: React
- **Estado**: Redux ou Context API
- **Estilização**: TailwindCSS
- **Comunicação**: WebSockets, REST API
- **APIs do Navegador**:
  - Web Audio API (captura de áudio)
  - Chrome Extension Manifest V3
  - MediaStream Recording API
  - WebRTC (para integração com videoconferências)

#### Dashboard Web
- **Linguagens**: TypeScript
- **Framework**: Next.js
- **UI/UX**: Material UI ou Chakra UI
- **Gráficos/Visualização**: Chart.js, D3.js
- **Autenticação**: NextAuth.js
- **Estado**: Redux Toolkit ou Zustand
- **Testes**: Jest, React Testing Library

### Backend

#### API e Serviços
- **Linguagem**: Node.js (TypeScript) ou Python
- **Framework**: 
  - Node.js: Express ou NestJS 
  - Python: FastAPI ou Django (REST framework)
- **Autenticação**: JWT, OAuth 2.0
- **API Gateway**: AWS API Gateway ou Kong

#### Serviço de Análise de Áudio (ASR)
- **Tecnologias**:
  - OpenAI Whisper para transcrição de fala
  - WebSocket para streaming de áudio
  - FFmpeg para processamento de áudio

#### Serviço de NLP
- **Tecnologias**:
  - OpenAI GPT-4 para análise e geração de conteúdo
  - Hugging Face Transformers para NLP específico
  - SpaCy para análise linguística

#### Serviço de Análise de Código
- **Tecnologias**:
  - Prism ou CodeMirror para visualização de código
  - ESLint, Pylint para análise estática
  - Algoritmos personalizados para análise de eficiência

#### Serviço de Analytics
- **Tecnologias**:
  - Google Analytics 4 (client-side)
  - Mixpanel ou Amplitude para tracking avançado
  - Algoritmos personalizados para métricas específicas

### Armazenamento

#### Banco de Dados
- **Principal**: PostgreSQL
- **Cache**: Redis
- **NoSQL**: MongoDB (para dados não estruturados)
- **Time Series**: InfluxDB (para métricas e telemetria)

#### Storage
- **Blob Storage**: AWS S3 ou Google Cloud Storage
- **CDN**: Cloudflare ou AWS CloudFront

### Infraestrutura

#### Hospedagem
- **Extensão Chrome**: Chrome Web Store
- **Web App**: Vercel, Netlify ou AWS Amplify
- **Backend**: 
  - AWS Lambda ou Google Cloud Functions (serverless)
  - AWS ECS/EKS ou Google Kubernetes Engine (contêineres)

#### DevOps
- **CI/CD**: GitHub Actions ou GitLab CI
- **Contêineres**: Docker
- **Orquestração**: Kubernetes
- **IaC**: Terraform ou AWS CloudFormation
- **Monitoramento**: Prometheus, Grafana, Datadog

#### Segurança
- **SSL/TLS**: Let's Encrypt
- **WAF**: Cloudflare ou AWS WAF
- **DDOS Protection**: Cloudflare
- **Secrets Management**: AWS Secrets Manager ou HashiCorp Vault

## Requisitos de Sistema

### Requisitos de Extensão Chrome
- Chrome 90+ ou equivalente em navegadores baseados em Chromium
- Permissões: acesso ao microfone, tabs, storage, scripting

### Requisitos de Servidor
- Servidor com baixa latência para processamento em tempo real (<100ms)
- Capacidade de processar múltiplas conexões WebSocket simultâneas
- Escalabilidade automática para lidar com picos de tráfego

### Requisitos de Armazenamento
- Backup automático e redundância geográfica
- Políticas de retenção de dados configuráveis (GDPR)
- Criptografia AES-256 para dados em repouso

## API Endpoints (Principais)

### Autenticação
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`

### Sessões de Entrevista
- `POST /api/sessions/start`
- `POST /api/sessions/end`
- `GET /api/sessions/{id}`
- `GET /api/sessions/list`

### Análise de Áudio
- `WS /api/audio/stream`
- `POST /api/audio/analyze`

### Feedback
- `POST /api/feedback/save`
- `GET /api/feedback/{sessionId}`

### Analytics
- `GET /api/analytics/performance`
- `GET /api/analytics/progress`
- `GET /api/analytics/recommendations`

## Considerações de Arquitetura

### Latência
- Para garantir feedback em tempo real, a pipeline completa (áudio → ASR → NLP → feedback) deve completar em menos de 500ms
- Processamento parcial na extensão para reduzir latência de rede
- WebSockets para comunicação bidirecional eficiente

### Escalabilidade
- Arquitetura sem estado para facilitar escalabilidade horizontal
- Balanceamento de carga automático baseado em demanda
- Cache estratégico para reduzir carga no banco de dados

### Segurança
- Proteção contra CSRF, XSS, e SQL Injection
- Rate limiting para prevenir abuso de API
- Análise de vulnerabilidades automática no CI/CD
- Sanitização e validação de entrada em todos os endpoints

### Internacionalização
- Suporte a Unicode para múltiplos idiomas
- Estrutura de localização (i18n) no frontend
- Modelos ASR e NLP multilingues 