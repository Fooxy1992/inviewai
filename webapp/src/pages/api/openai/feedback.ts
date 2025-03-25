import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { getSession } from 'next-auth/react';

/**
 * API para geração de feedback usando a API OpenAI
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Verificar autenticação (opcional, dependendo da sua configuração)
    // const session = await getSession({ req });
    // if (!session) {
    //   return res.status(401).json({ error: 'Não autorizado' });
    // }

    // Verificar corpo da requisição
    const { pergunta, resposta, modelo = 'gpt-3.5-turbo' } = req.body;

    if (!pergunta || !resposta) {
      return res.status(400).json({ error: 'Pergunta e resposta são obrigatórias' });
    }

    // Configurar OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Chave da API OpenAI não configurada' });
    }

    // Preparar o prompt para a API
    const prompt = `
Você é um avaliador especialista em entrevistas de emprego.

PERGUNTA DA ENTREVISTA:
${pergunta}

RESPOSTA DO CANDIDATO:
${resposta}

Por favor, analise a resposta fornecida pelo candidato e forneça:
1. Um feedback construtivo sobre a resposta (pontos fortes e áreas para melhoria)
2. Uma pontuação de 1 a 10, sendo 10 a melhor possível

Seu feedback deve ser específico, considerar a clareza, relevância e estrutura da resposta. 
Avalie se o candidato abordou todos os pontos necessários e demonstrou as habilidades ou experiências relevantes.

Formato de saída:
{
  "feedback": "Seu feedback detalhado aqui",
  "pontuacao": número entre 1 e 10,
  "pontos_fortes": ["lista", "de", "pontos", "fortes"],
  "areas_melhoria": ["lista", "de", "áreas", "para", "melhoria"]
}
`;

    // Fazer a chamada para a API OpenAI
    const completion = await openai.chat.completions.create({
      model: modelo,
      messages: [
        { role: "system", content: "Você é um avaliador especialista em entrevistas de emprego." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extrair e parsear a resposta
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Resposta vazia da API OpenAI');
    }

    // Tentar parsear a resposta JSON
    try {
      // Extrair o JSON da resposta (caso venha com texto adicional)
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseContent;
      const feedbackData = JSON.parse(jsonString);
      
      // Verificar se os campos necessários estão presentes
      if (!feedbackData.feedback || !feedbackData.pontuacao) {
        throw new Error('Resposta incompleta da API');
      }
      
      // Retornar os dados de feedback
      return res.status(200).json(feedbackData);
    } catch (parseError) {
      console.error('Erro ao parsear resposta JSON:', parseError);
      
      // Se não for possível parsear como JSON, retornar o texto bruto
      return res.status(200).json({
        feedback: responseContent,
        pontuacao: 5, // valor padrão
        pontos_fortes: [],
        areas_melhoria: []
      });
    }
  } catch (error: any) {
    console.error('Erro na geração de feedback:', error);
    
    // Tratamento específico para erros comuns
    if (error.response) {
      // Erro da API OpenAI
      const status = error.response.status || 500;
      const message = error.response.data?.error?.message || 'Erro na API OpenAI';
      return res.status(status).json({ error: message });
    }
    
    return res.status(500).json({ 
      error: 'Erro ao gerar feedback',
      message: error.message || 'Erro desconhecido'
    });
  }
} 