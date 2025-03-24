import axios from 'axios';

// Configura a chave da API (em uma aplicação real, isso deveria ser armazenado em variáveis de ambiente)
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
// Verificar se a chave da API foi fornecida
if (!OPENAI_API_KEY) {
  console.warn('Chave da API OpenAI não configurada. Configure a variável de ambiente NEXT_PUBLIC_OPENAI_API_KEY');
}

// Configura o cliente HTTP com o header de autorização
const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Interface para o feedback de uma entrevista
 */
export interface InterviewFeedback {
  id: string;
  timestamp: string;
  content: string;
  type: 'improvement' | 'suggestion' | 'warning';
}

/**
 * Interface para transcrição de fala
 */
export interface Transcription {
  text: string;
  speaker?: 'you' | 'interviewer';
}

/**
 * Função para converter áudio em texto usando o modelo Whisper da OpenAI
 * @param audioBlob - O áudio a ser transcrito
 * @returns A transcrição do áudio
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<Transcription> => {
  try {
    // Criar um FormData para enviar o arquivo de áudio
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    
    // Verificar se a API key está configurada
    if (!OPENAI_API_KEY) {
      throw new Error('Chave da API OpenAI não configurada');
    }

    // Verificar se o tamanho do blob de áudio é válido
    if (audioBlob.size < 1024) { // Menos de 1KB é provavelmente muito pequeno
      throw new Error('Arquivo de áudio muito pequeno para transcrição');
    }
    
    // Enviar a requisição para a API de transcrição
    const response = await openaiClient.post('/audio/transcriptions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Verificar se a resposta contém texto transcrito
    if (!response.data.text) {
      throw new Error('A API retornou uma resposta vazia');
    }
    
    return {
      text: response.data.text,
    };
  } catch (error) {
    console.error('Erro ao transcrever áudio:', error);
    
    // Oferecer mensagens de erro mais específicas
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // A API respondeu com um status de erro
        const status = error.response.status;
        if (status === 401) {
          throw new Error('Falha na autenticação com a API OpenAI. Verifique sua chave API.');
        } else if (status === 400) {
          throw new Error('Formato de áudio inválido ou requisição mal formada.');
        } else if (status === 429) {
          throw new Error('Limite de requisições excedido na API OpenAI.');
        } else {
          throw new Error(`Erro na API OpenAI: ${error.response.data?.error?.message || 'Erro desconhecido'}`);
        }
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta
        throw new Error('Sem resposta da API OpenAI. Verifique sua conexão com a internet.');
      }
    }
    
    // Erro genérico se nenhum dos casos acima for aplicável
    throw new Error('Falha ao transcrever o áudio: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
  }
};

/**
 * Função para determinar o orador com base no contexto da conversa
 * Esta é uma implementação simplificada, uma real usaria NLP mais sofisticada
 * @param text - O texto a ser analisado
 * @param previousSpeaker - O orador anterior (se disponível)
 * @returns O orador provável ('you' ou 'interviewer')
 */
export const determineSpeaker = (text: string, previousSpeaker?: 'you' | 'interviewer'): 'you' | 'interviewer' => {
  // Se for a primeira fala, assumir que é o entrevistador fazendo a primeira pergunta
  if (!previousSpeaker) {
    return text.endsWith('?') ? 'interviewer' : 'you';
  }
  
  // Alternar o orador (implementação simples)
  return previousSpeaker === 'you' ? 'interviewer' : 'you';
};

/**
 * Função para obter feedback sobre a entrevista usando o GPT-4
 * @param transcript - O texto transcrito da entrevista
 * @param context - Contexto adicional (cargo, empresa, etc.)
 * @returns Feedback com sugestões de melhoria
 */
export const getInterviewFeedback = async (
  transcript: string, 
  context: { position: string; company: string; }
): Promise<InterviewFeedback[]> => {
  try {
    // Sistema de prompt para orientar o modelo
    const systemPrompt = `Você é um assistente especializado em entrevistas de emprego, ajudando candidatos em tempo real.
Analise a transcrição da entrevista fornecida abaixo para a posição de ${context.position} na empresa ${context.company}.
Forneça feedback útil, específico e construtivo sobre as respostas do candidato.

Categorize cada feedback como:
- "improvement" (o que precisa ser melhorado)
- "suggestion" (recomendações positivas)
- "warning" (problemas importantes a serem evitados)

Analise aspectos como:
- Clareza e objetividade nas respostas
- Uso de exemplos concretos e relevantes
- Comportamento profissional e linguagem
- Maneira de abordar tópicos técnicos
- Muletas linguísticas ou padrões de fala a evitar

Retorne sua resposta no seguinte formato JSON:
[
  {
    "type": "improvement|suggestion|warning",
    "content": "Feedback específico sobre a resposta"
  }
]
`;

    // Solicitar o feedback
    const response = await openaiClient.post('/chat/completions', {
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcript }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    // Processar a resposta e converter para o formato esperado
    const content = response.data.choices[0].message.content;
    const parsedFeedback = JSON.parse(content);
    
    // Formatar e retornar o feedback
    return parsedFeedback.map((item: any, index: number) => ({
      id: `feedback-${index}`,
      timestamp: new Date().toISOString(),
      content: item.content,
      type: item.type
    }));
  } catch (error) {
    console.error('Erro ao obter feedback da entrevista:', error);
    throw new Error('Falha ao analisar a entrevista');
  }
};

/**
 * Interface para sugestão de resposta
 */
export interface SuggestionResult {
  response: string;
  keyPoints: string[];
  feedback?: string[];
}

/**
 * Função para obter sugestões de resposta para perguntas de entrevista
 * @param params Parâmetros para gerar a sugestão
 * @returns Sugestão estruturada para a pergunta
 */
export const getSuggestionForQuestion = async (
  params: {
    question: string, 
    userResponse?: string,
    jobTitle: string,
    context: string
  }
): Promise<SuggestionResult> => {
  try {
    const { question, userResponse, jobTitle, context } = params;
    
    const systemPrompt = `Você é um assistente especializado em entrevistas de emprego.
O usuário está em uma entrevista para a posição de ${jobTitle}.
Contexto: ${context}

${userResponse ? 'O usuário já respondeu à pergunta, mas deseja feedback e melhorias.' : 'Forneça uma sugestão de resposta para a pergunta do entrevistador.'}

Forneça uma resposta CONCISA e OBJETIVA, destacando:
1. Como estruturar a resposta de forma profissional
2. Pontos-chave a abordar (adaptados ao cargo)
3. Exemplos relevantes a mencionar (se aplicável)
4. O que evitar na resposta

IMPORTANTE:
- Mantenha a resposta natural, como seria em uma conversa real
- Não use jargão excessivo, mas demonstre conhecimento técnico relevante
- Estruture a resposta em português claro e acessível
- Personalize a resposta com base no contexto fornecido
- Foque em responder diretamente à pergunta feita

Retorne sua resposta em formato JSON com os seguintes campos:
{
  "response": "Resposta completa sugerida", 
  "keyPoints": ["Ponto-chave 1", "Ponto-chave 2", ...],
  "feedback": ["Feedback 1", "Feedback 2", ...] (apenas quando userResponse estiver presente)
}`;

    const response = await openaiClient.post('/chat/completions', {
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Pergunta do entrevistador: "${question}"${userResponse ? `\n\nMinha resposta atual: "${userResponse}"` : ''}` }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    // Processar a resposta e converter para o formato esperado
    const content = response.data.choices[0].message.content;
    try {
      const parsedResponse = JSON.parse(content);
      return {
        response: parsedResponse.response,
        keyPoints: parsedResponse.keyPoints || [],
        feedback: parsedResponse.feedback || []
      };
    } catch (error) {
      console.error('Erro ao processar resposta JSON:', error);
      // Fallback para formato de texto simples
      return {
        response: content,
        keyPoints: []
      };
    }
  } catch (error) {
    console.error('Erro ao obter sugestão para pergunta:', error);
    throw new Error('Falha ao gerar sugestão de resposta');
  }
};

export default {
  transcribeAudio,
  determineSpeaker,
  getInterviewFeedback,
  getSuggestionForQuestion
}; 