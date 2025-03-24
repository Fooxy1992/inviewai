import { useState, useEffect, useRef } from 'react';
import { transcreverAudio } from '@/services/openai/feedbackService';

interface UseAudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: Error) => void;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  audioUrl: string | null;
  audioBlob: Blob | null;
  transcricao: string;
  duracaoSegundos: number;
  iniciarGravacao: () => void;
  pararGravacao: () => Promise<void>;
  cancelarGravacao: () => void;
  isTranscrevendo: boolean;
  erro: string | null;
}

/**
 * Hook para gravação e transcrição de áudio
 */
export const useAudioRecorder = ({
  onTranscriptionComplete,
  onError
}: UseAudioRecorderProps = {}): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcricao, setTranscricao] = useState('');
  const [isTranscrevendo, setIsTranscrevendo] = useState(false);
  const [duracaoSegundos, setDuracaoSegundos] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Limpar recursos quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording, audioUrl]);
  
  // Iniciar gravação de áudio
  const iniciarGravacao = async () => {
    try {
      setErro(null);
      audioChunksRef.current = [];
      setTranscricao('');
      
      // Verificar se o navegador suporta a API de gravação
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        throw new Error('Seu navegador não suporta gravação de áudio');
      }
      
      // Obter permissão de acesso ao microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Configurar o MediaRecorder com os melhores parâmetros para o Whisper
      const options = { 
        mimeType: getBestMimeType(),
        audioBitsPerSecond: 128000 // 128 kbps
      };
      
      // Criar um novo MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      // Configurar handler para dados de áudio
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Configurar handler para fim da gravação
      mediaRecorder.onstop = () => {
        // Parar todos os tracks do stream
        stream.getTracks().forEach(track => track.stop());
        
        // Parar o timer
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        
        // Criar blob e URL para reprodução
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
          setAudioBlob(audioBlob);
          
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        }
        
        setIsRecording(false);
      };
      
      // Iniciar a gravação
      mediaRecorder.start(1000); // Obtém chunks a cada segundo
      setIsRecording(true);
      
      // Configurar timer
      startTimeRef.current = Date.now();
      timerIntervalRef.current = setInterval(() => {
        const segundosDecorridos = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuracaoSegundos(segundosDecorridos);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao iniciar gravação');
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };
  
  // Parar gravação de áudio e transcrever
  const pararGravacao = async () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return;
    }
    
    try {
      // Parar o MediaRecorder
      mediaRecorderRef.current.stop();
      
      // Aguardar a criação do blob (usando setTimeout para aguardar o evento onstop)
      await new Promise<void>(resolve => {
        setTimeout(async () => {
          if (audioBlob) {
            try {
              setIsTranscrevendo(true);
              
              // Transcrever o áudio
              const texto = await transcreverAudio(audioBlob);
              setTranscricao(texto);
              
              if (onTranscriptionComplete) {
                onTranscriptionComplete(texto);
              }
            } catch (error) {
              console.error('Erro ao transcrever áudio:', error);
              setErro(error instanceof Error ? error.message : 'Erro ao transcrever áudio');
              if (onError && error instanceof Error) {
                onError(error);
              }
            } finally {
              setIsTranscrevendo(false);
            }
          }
          resolve();
        }, 500); // Pequeno atraso para garantir que o evento onstop foi processado
      });
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao parar gravação');
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };
  
  // Cancelar gravação
  const cancelarGravacao = () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return;
    }
    
    try {
      // Parar o MediaRecorder
      mediaRecorderRef.current.stop();
      
      // Limpar a URL do áudio
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      
      // Limpar o blob e chunks
      setAudioBlob(null);
      audioChunksRef.current = [];
      
      // Limpar a transcrição
      setTranscricao('');
      
    } catch (error) {
      console.error('Erro ao cancelar gravação:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao cancelar gravação');
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };
  
  // Determinar o melhor formato de áudio suportado
  const getBestMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/mpeg',
      ''  // Fallback para o formato padrão
    ];
    
    for (const type of types) {
      if (type === '' || MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return '';
  };
  
  return {
    isRecording,
    audioUrl,
    audioBlob,
    transcricao,
    duracaoSegundos,
    iniciarGravacao,
    pararGravacao,
    cancelarGravacao,
    isTranscrevendo,
    erro
  };
}; 