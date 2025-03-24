# InViewAI - Assistente de Entrevistas com IA

InViewAI é uma solução completa para ajudar candidatos a empregos a se prepararem para entrevistas utilizando análise em tempo real baseada em IA.

O projeto consiste em dois componentes principais:
1. Uma aplicação web Next.js (frontend e backend)
2. Uma extensão do Google Chrome que integra com plataformas de videoconferência

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente de Desenvolvimento](#configuração-do-ambiente-de-desenvolvimento)
  - [Aplicação Web](#aplicação-web)
  - [Extensão do Chrome](#extensão-do-chrome)
- [Implantação](#implantação)
  - [Implantação com Vercel](#implantação-com-vercel)
  - [Publicação da Extensão do Chrome](#publicação-da-extensão-do-chrome)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuições](#contribuições)
- [Licença](#licença)

## Pré-requisitos

- Node.js v16+ e npm
- Git
- Conta GitHub (para implantação)
- Conta Vercel (para hospedagem)
- Chrome (para desenvolvimento e teste da extensão)

## Configuração do Ambiente de Desenvolvimento

### Aplicação Web

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/inviewai.git
cd inviewai
```

2. Instale as dependências:
```bash
cd webapp
npm install
```

3. Configure o arquivo de ambiente:
```bash
cp .env.example .env.local
```
Edite `.env.local` e adicione as variáveis de ambiente necessárias.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse a aplicação em `http://localhost:3000`

### Extensão do Chrome

1. Navegue até a pasta da extensão:
```bash
cd extension
```

2. Para testar a extensão no Chrome:
   - Abra o Chrome e vá para `chrome://extensions`
   - Ative o "Modo desenvolvedor"
   - Clique em "Carregar sem compactação" e selecione a pasta `extension`

3. A extensão será carregada e estará pronta para testes

## Implantação

### Implantação com Vercel

1. Faça o commit das alterações e envie para o GitHub:
```bash
git add .
git commit -m "Preparação para implantação"
git push origin master
```

2. Conecte sua conta Vercel ao GitHub:
   - Acesse [Vercel](https://vercel.com)
   - Faça login ou crie uma conta
   - Clique em "Add New" > "Project"
   - Selecione seu repositório GitHub
   - Configure conforme necessário:
     - Framework Preset: Next.js
     - Root Directory: webapp
     - Build Command: npm run build (detectado automaticamente)
     - Output Directory: .next (detectado automaticamente)
   - Adicione as variáveis de ambiente necessárias
   - Clique em "Deploy"

3. O Vercel fornecerá URLs para seu projeto:
   - URL de Produção: https://seu-projeto.vercel.app
   - URLs para preview de branches e PRs (criadas automaticamente)

### Publicação da Extensão do Chrome

1. Atualize a URL do backend na extensão:
   - Edite `extension/popup.js` para apontar para sua aplicação no Vercel
   - Substitua a URL de `localhost` ou `jsonplaceholder` pela URL do seu projeto Vercel

2. Empacote a extensão:
```powershell
# No PowerShell (Windows)
Compress-Archive -Path ./extension/* -DestinationPath ./extension-v0.1.0.zip -Force

# Alternativa: use a interface gráfica para criar o ZIP
```

3. Publique na Chrome Web Store:
   - Crie uma conta de desenvolvedor: [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Clique em "Novo item" e faça o upload do arquivo ZIP
   - Preencha as informações necessárias
   - Envie para revisão

## Estrutura do Projeto

```
inviewai/
├── extension/            # Código-fonte da extensão Chrome
│   ├── icons/            # Ícones da extensão
│   ├── manifest.json     # Manifesto da extensão
│   ├── popup.html        # Interface do popup
│   ├── popup.js          # Lógica do popup
│   ├── content.js        # Script de conteúdo (injetado nas páginas)
│   └── ...
├── webapp/               # Aplicação Next.js
│   ├── public/           # Arquivos estáticos
│   ├── src/              # Código-fonte da aplicação
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Rotas e páginas Next.js
│   │   └── ...
│   └── ...
└── ...
```

## Contribuições

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona funcionalidade X'`)
4. Faça push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 