import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { Configuration, OpenAIApi } from 'openai';

// Desabilitar o bodyParser padrão para permitir o upload de arquivos
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * API para transcrição de áudio usando OpenAI Whisper
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

    // Configurar OpenAI
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Chave da API OpenAI não configurada' });
    }

    // Processar o arquivo de áudio
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 25 * 1024 * 1024, // 25MB (limite do Whisper)
    });

    // Processar o formulário de forma personalizada
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Verificar se o arquivo foi enviado
    if (!files.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de áudio enviado' });
    }

    const audioFile = files.file;
    const audioPath = audioFile.filepath;
    
    // Ler o arquivo
    const audioData = await fs.readFile(audioPath);
    
    // Enviar para a API do OpenAI Whisper
    const transcriptionResponse = await openai.createTranscription(
      audioData as any,
      "whisper-1",
      undefined,
      undefined,
      undefined,
      fields.language || "pt",
    );

    // Remover o arquivo temporário
    await fs.unlink(audioPath);

    // Retornar a transcrição
    return res.status(200).json({ 
      text: transcriptionResponse.data.text,
      success: true 
    });
    
  } catch (error: any) {
    console.error('Erro na transcrição de áudio:', error);
    
    // Tratamento específico para erros comuns
    if (error.response) {
      // Erro da API OpenAI
      const status = error.response.status || 500;
      const message = error.response.data?.error?.message || 'Erro na API OpenAI';
      return res.status(status).json({ error: message });
    } else if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. O limite é 25MB.' });
    }
    
    return res.status(500).json({ 
      error: 'Erro ao processar transcrição',
      message: error.message || 'Erro desconhecido'
    });
  }
} 