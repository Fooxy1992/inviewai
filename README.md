# InViewAI - Assistente de Entrevistas

O InViewAI é uma extensão para o Google Chrome que ajuda candidatos durante entrevistas de emprego no Google Meet, fornecendo sugestões de respostas, feedbacks e monitoramento em tempo real.

## Estrutura do Projeto

- `extension/`: Código fonte da extensão para Chrome
- `webapp/`: Aplicação web Next.js para autenticação e dashboard do usuário
- `functions/`: Funções serverless do Firebase (para processamento de áudio e IA)
- `design/`: Arquivos de design e protótipos
- `docs/`: Documentação do projeto

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, Chakra UI
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Infraestrutura**: Vercel, GitHub
- **Extensão**: JavaScript, Chrome Extensions API
- **Processamento de Áudio**: Web Audio API

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Firebase
- Conta no Vercel
- Conta no GitHub

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/inviewai.git
   cd inviewai
   ```

2. Instale as dependências da webapp:
   ```bash
   cd webapp
   npm install
   cd ..
   ```

3. Instale as ferramentas do Firebase:
   ```bash
   npm install -g firebase-tools
   ```

4. Faça login no Firebase:
   ```bash
   firebase login
   ```

5. Inicialize seu projeto Firebase:
   ```bash
   firebase use --add
   ```

## Configuração do Firebase

1. Crie um novo projeto no [Console do Firebase](https://console.firebase.google.com/)
2. Ative a Autenticação (Email/Senha e Google)
3. Crie um banco de dados Firestore
4. Configure o Storage
5. Configure o projeto para hospedagem web

## Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta `webapp/` com as seguintes variáveis:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Desenvolvimento Local

### Webapp

1. Execute o servidor de desenvolvimento:
   ```bash
   cd webapp
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:3000`

### Extensão Chrome

1. Abra o Chrome e navegue até `chrome://extensions/`
2. Ative o "Modo do desenvolvedor"
3. Clique em "Carregar sem compactação" e selecione a pasta `extension/`

## Deploy

### Deploy no Firebase e Vercel

1. Configure o GitHub Actions para CI/CD editando o arquivo `.github/workflows/deploy.yml`

2. Configure o Vercel para deploy automático:
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   vercel env pull
   ```

3. Deploy no Firebase (funções e regras):
   ```bash
   firebase deploy
   ```

### Publicação da Extensão no Chrome Web Store

1. Compacte a pasta `extension/` em um arquivo ZIP
2. Acesse o [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Clique em "Novo item" e faça upload do arquivo ZIP
4. Preencha as informações da extensão e publique

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes. 