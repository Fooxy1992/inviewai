import axios from 'axios';
import { Feedback, Pergunta, Resposta } from '@/models/types';
import { Timestamp } from 'firebase/firestore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Serviço para transcrição de áudio e geração de feedback usando OpenAI
 */

/**
 * Transcreve áudio usando a API OpenAI Whisper
 * @param audioBlob Blob de áudio para transcrição
 * @returns Texto transcrito
 */
export const transcreverAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Validar o formato e tamanho do blob
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Arquivo de áudio vazio ou inválido');
    }

    // Verificar tamanho máximo (Whisper aceita até 25MB)
    const MAX_SIZE_MB = 25;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    
    if (audioBlob.size > MAX_SIZE_BYTES) {
      throw new Error(`O arquivo de áudio excede o tamanho máximo de ${MAX_SIZE_MB}MB`);
    }

    // Criar FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');

    // Fazer requisição para API OpenAI
    const response = await axios.post('/api/openai/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response.status !== 200) {
      throw new Error(`Erro na transcrição: ${response.statusText}`);
    }

    return response.data.text;
  } catch (error) {
    console.error('Erro ao transcrever áudio:', error);
    throw new Error('Erro ao processar áudio: ' + 
      (error instanceof Error ? error.message : 'Formato de áudio inválido ou requisição mal formada'));
  }
};

/**
 * Gera feedback para uma resposta de entrevista usando a API OpenAI
 * @param pergunta Detalhes da pergunta
 * @param resposta Resposta do usuário
 * @returns Feedback gerado
 */
export const gerarFeedback = async (
  pergunta: string, 
  resposta: string,
  modeloIA: string = 'gpt-3.5-turbo'
): Promise<Feedback> => {
  try {
    const response = await axios.post('/api/openai/feedback', {
      pergunta,
      resposta,
      modelo: modeloIA
    });

    if (response.status !== 200) {
      throw new Error(`Erro ao gerar feedback: ${response.statusText}`);
    }

    return {
      texto: response.data.feedback,
      pontuacao: response.data.pontuacao,
      dataCriacao: Timestamp.now(),
      geradoPorIA: true
    };
  } catch (error) {
    console.error('Erro ao gerar feedback:', error);
    throw new Error('Não foi possível gerar o feedback para sua resposta. Tente novamente mais tarde.');
  }
};

/**
 * Corrige a resposta a uma pergunta de entrevista
 * @param pergunta Pergunta da entrevista
 * @param resposta Resposta do usuário
 * @returns Resposta corrigida
 */
export const corrigirResposta = async (
  pergunta: string,
  resposta: string
): Promise<string> => {
  try {
    const response = await axios.post('/api/openai/corrigir', {
      pergunta,
      resposta
    });

    if (response.status !== 200) {
      throw new Error(`Erro ao corrigir resposta: ${response.statusText}`);
    }

    return response.data.respostaCorrigida;
  } catch (error) {
    console.error('Erro ao corrigir resposta:', error);
    throw new Error('Não foi possível corrigir sua resposta. Por favor, tente novamente.');
  }
}; 