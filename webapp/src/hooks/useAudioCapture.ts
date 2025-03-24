import { useState, useRef, useCallback, useEffect } from 'react';
import openaiService, { Transcription, InterviewFeedback } from '../services/openai-service';

interface AudioCaptureProps {
  onTranscriptionComplete?: (transcription: Transcription) => void;
  onFeedbackReceived?: (feedback: InterviewFeedback[]) => void;
  interviewContext: {
    position: string;
    company: string;
  };
  enabled?: boolean;
}

interface AudioCaptureResult {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
  isProcessing: boolean;
}

/**
 * Hook personalizado para capturar e processar o áudio em tempo real
 */
export function useAudioCapture({
  onTranscriptionComplete,
  onFeedbackReceived,
  interviewContext,
  enabled = true
}: AudioCaptureProps): AudioCaptureResult {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Refs para gerenciar o gravador e os chunks de áudio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const lastSpeakerRef = useRef<'you' | 'interviewer' | undefined>(undefined);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Buffer de transcrição para análise
  const transcriptionBufferRef = useRef<string>('');
  
  // Função para iniciar a gravação
  const startRecording = useCallback(async () => {
    if (!enabled) {
      setError('A captura de áudio está desativada');
      return;
    }
    
    try {
      // Resetar erros anteriores
      setError(null);
      
      // Solicitar permissão para acessar o microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Criar uma nova instância do MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Limpar chunks anteriores
      audioChunksRef.current = [];
      
      // Configurar evento para capturar os dados quando disponíveis
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          
          // Processar o áudio capturado
          const audioBlob = new Blob([event.data], { type: 'audio/wav' });
          await processAudioChunk(audioBlob);
        }
      };
      
      // Iniciar gravação, capturando chunks a cada 5 segundos
      mediaRecorder.start(5000);
      setIsRecording(true);
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
      setError('Falha ao acessar o microfone. Verifique as permissões do navegador.');
    }
  }, [enabled, onTranscriptionComplete]);
  
  // Função para processar o chunk de áudio
  const processAudioChunk = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Transcrever o áudio
      const transcription = await openaiService.transcribeAudio(audioBlob);
      
      // Determinar o orador
      const speaker = openaiService.determineSpeaker(transcription.text, lastSpeakerRef.current);
      lastSpeakerRef.current = speaker;
      
      // Adicionar à transcrição
      const fullTranscription: Transcription = {
        ...transcription,
        speaker
      };
      
      // Notificar sobre a transcrição completa
      if (onTranscriptionComplete) {
        onTranscriptionComplete(fullTranscription);
      }
      
      // Adicionar ao buffer para análise
      transcriptionBufferRef.current += `${speaker === 'interviewer' ? 'Entrevistador' : 'Você'}: ${transcription.text}\n`;
      
      // Se temos conteúdo suficiente e é a fala do candidato, analisar para feedback
      if (transcriptionBufferRef.current.length > 100 && speaker === 'you') {
        // Analisar a transcrição para feedback
        const feedback = await openaiService.getInterviewFeedback(
          transcriptionBufferRef.current,
          interviewContext
        );
        
        // Notificar sobre o feedback
        if (onFeedbackReceived && feedback.length > 0) {
          onFeedbackReceived(feedback);
        }
      }
    } catch (err) {
      console.error('Erro ao processar áudio:', err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Função para parar a gravação
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Parar todas as trilhas de áudio
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Resetar estados
      setIsRecording(false);
      mediaRecorderRef.current = null;
      streamRef.current = null;
      
      // Limpar buffer de transcrição
      transcriptionBufferRef.current = '';
    }
  }, [isRecording]);
  
  // Limpar recursos quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, stopRecording]);
  
  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
    isProcessing
  };
} 