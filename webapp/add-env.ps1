# Obter a chave da OpenAI do arquivo .env.local
$envContent = Get-Content .env.local
$openaiKeyLine = $envContent | Where-Object { $_ -like "NEXT_PUBLIC_OPENAI_API_KEY=*" }
$openaiKey = $openaiKeyLine -replace "NEXT_PUBLIC_OPENAI_API_KEY=", ""

# Mostrar a chave (apenas para verificação)
Write-Host "Adicionando NEXT_PUBLIC_OPENAI_API_KEY ao Vercel..."
Write-Host "OPENAI_KEY=$openaiKey"

# Criar um arquivo de instrução
$instructionContent = @"
Para adicionar sua variável de ambiente ao Vercel, execute os seguintes comandos:

vercel login (se ainda não estiver logado)
vercel link (se o projeto ainda não estiver vinculado)
vercel env add NEXT_PUBLIC_OPENAI_API_KEY

Quando solicitado, cole a seguinte chave:
$openaiKey

Em seguida, implante novamente seu projeto:
vercel --prod

"@

# Salvar as instruções em um arquivo
$instructionContent | Out-File -FilePath "vercel-env-instructions.txt"

Write-Host "Instruções criadas em vercel-env-instructions.txt" 