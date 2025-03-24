#!/bin/bash

# Obter a chave da OpenAI do arquivo .env.local
OPENAI_KEY=$(grep NEXT_PUBLIC_OPENAI_API_KEY .env.local | cut -d'=' -f2-)

# Adicionar a variável no Vercel
echo "Adicionando NEXT_PUBLIC_OPENAI_API_KEY ao Vercel..."
echo "OPENAI_KEY=$OPENAI_KEY"

# Criar um arquivo temporário para o comando
echo '#!/bin/bash
echo "Adicionando variável de ambiente NEXT_PUBLIC_OPENAI_API_KEY"
vercel env add NEXT_PUBLIC_OPENAI_API_KEY production '$OPENAI_KEY'
echo "Variável adicionada com sucesso!"
' > add-env-vercel.sh

# Tornar o arquivo executável
chmod +x add-env-vercel.sh

echo "Arquivo add-env-vercel.sh criado. Execute-o para adicionar a variável ao Vercel." 