import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Progress,
  useColorModeValue,
  Icon,
  IconButton,
  Tooltip,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { FiMic, FiSquare, FiX, FiPlay, FiPause, FiCheck, FiCopy, FiEdit } from 'react-icons/fi';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface AudioRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: Error) => void;
  maxDuration?: number; // duração máxima em segundos
  autoStart?: boolean;
  showTranscricao?: boolean;
  placeholder?: string;
}

/**
 * Componente para gravação e transcrição de áudio
 */
const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptionComplete,
  onError,
  maxDuration = 300, // 5 minutos por padrão
  autoStart = false,
  showTranscricao = true,
  placeholder = 'Sua resposta será transcrita aqui...'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [transcricaoEditada, setTranscricaoEditada] = useState('');
  const [editandoTranscricao, setEditandoTranscricao] = useState(false);

  // Cores
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const progressColorScheme = useColorModeValue('blue', 'blue');
  const actionBtnBg = useColorModeValue('gray.100', 'gray.600');
  const actionBtnHoverBg = useColorModeValue('gray.200', 'gray.500');

  // Hook de gravação
  const {
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
  } = useAudioRecorder({
    onTranscriptionComplete: (text) => {
      setTranscricaoEditada(text);
      if (onTranscriptionComplete) {
        onTranscriptionComplete(text);
      }
    },
    onError
  });

  // Auto-iniciar gravação
  useEffect(() => {
    if (autoStart) {
      iniciarGravacao();
    }
  }, [autoStart]);

  // Criar elemento de áudio quando disponível
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
    }
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioUrl]);

  // Parar gravação quando atingir o tempo máximo
  useEffect(() => {
    if (isRecording && duracaoSegundos >= maxDuration) {
      pararGravacao();
    }
  }, [isRecording, duracaoSegundos, maxDuration]);

  // Reproduzir áudio
  const togglePlayback = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  // Copiar transcrição para a área de transferência
  const copiarTranscricao = () => {
    navigator.clipboard.writeText(transcricaoEditada || transcricao);
  };

  // Editar transcrição
  const confirmarEdicao = () => {
    if (onTranscriptionComplete) {
      onTranscriptionComplete(transcricaoEditada);
    }
    setEditandoTranscricao(false);
  };

  // Formatar tempo
  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculcar porcentagem da duração
  const porcentagemDuracao = Math.min((duracaoSegundos / maxDuration) * 100, 100);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={cardBg}
      p={4}
      shadow="sm"
    >
      {/* Barra de progresso / duração */}
      {isRecording && (
        <Box mb={4}>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="sm">Gravando...</Text>
            <Text fontSize="sm" fontWeight="medium">
              {formatarTempo(duracaoSegundos)} / {formatarTempo(maxDuration)}
            </Text>
          </Flex>
          <Progress
            value={porcentagemDuracao}
            size="sm"
            colorScheme={progressColorScheme}
            borderRadius="full"
          />
        </Box>
      )}

      {/* Botões de controle */}
      <Flex 
        justify="center" 
        align="center" 
        mb={audioUrl && showTranscricao ? 4 : 0}
        gap={4}
      >
        {!isRecording && !audioUrl && (
          <Button
            leftIcon={<FiMic />}
            colorScheme="blue"
            onClick={iniciarGravacao}
            w="full"
          >
            Iniciar Gravação
          </Button>
        )}

        {isRecording && (
          <>
            <IconButton
              aria-label="Cancelar gravação"
              icon={<FiX />}
              onClick={cancelarGravacao}
              colorScheme="red"
              variant="outline"
              size="lg"
              isRound
            />
            <IconButton
              aria-label="Parar gravação"
              icon={<FiSquare />}
              onClick={() => pararGravacao()}
              colorScheme="blue"
              size="lg"
              isRound
            />
          </>
        )}

        {audioUrl && (
          <Flex gap={2} align="center" width="100%">
            <IconButton
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              icon={isPlaying ? <FiPause /> : <FiPlay />}
              onClick={togglePlayback}
              colorScheme="blue"
              variant="outline"
              size="md"
              isRound
            />
            
            <Text fontSize="sm" fontWeight="medium" flex="1">
              Duração: {formatarTempo(duracaoSegundos)}
            </Text>

            <Tooltip label="Reiniciar gravação">
              <IconButton
                aria-label="Reiniciar gravação" 
                icon={<FiMic />}
                onClick={iniciarGravacao}
                size="md"
                variant="outline"
                colorScheme="blue"
              />
            </Tooltip>
          </Flex>
        )}
      </Flex>

      {/* Exibição de erro */}
      {erro && (
        <Alert status="error" mt={4} borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Erro!</AlertTitle>
          <AlertDescription>{erro}</AlertDescription>
          <CloseButton 
            position="absolute" 
            right="8px" 
            top="8px" 
            onClick={() => onError ? onError(new Error(erro)) : null} 
          />
        </Alert>
      )}

      {/* Área de transcrição */}
      {showTranscricao && (audioUrl || isTranscrevendo) && (
        <Box mt={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">Transcrição</Text>
            <Flex gap={2}>
              {!editandoTranscricao && transcricao && (
                <>
                  <Tooltip label="Copiar transcrição">
                    <IconButton
                      aria-label="Copiar transcrição"
                      icon={<FiCopy />}
                      onClick={copiarTranscricao}
                      size="xs"
                      bg={actionBtnBg}
                      _hover={{ bg: actionBtnHoverBg }}
                    />
                  </Tooltip>
                  <Tooltip label="Editar transcrição">
                    <IconButton
                      aria-label="Editar transcrição"
                      icon={<FiEdit />}
                      onClick={() => setEditandoTranscricao(true)}
                      size="xs"
                      bg={actionBtnBg}
                      _hover={{ bg: actionBtnHoverBg }}
                    />
                  </Tooltip>
                </>
              )}
              {editandoTranscricao && (
                <Tooltip label="Confirmar edição">
                  <IconButton
                    aria-label="Confirmar edição"
                    icon={<FiCheck />}
                    onClick={confirmarEdicao}
                    size="xs"
                    colorScheme="green"
                  />
                </Tooltip>
              )}
            </Flex>
          </Flex>

          {isTranscrevendo ? (
            <Flex direction="column" align="center" justify="center" p={4}>
              <Spinner size="md" mb={2} />
              <Text>Processando transcrição...</Text>
            </Flex>
          ) : editandoTranscricao ? (
            <Box
              as="textarea"
              value={transcricaoEditada}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTranscricaoEditada(e.target.value)}
              placeholder={placeholder}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              minH="100px"
              w="full"
              resize="vertical"
            />
          ) : (
            <Box
              p={3}
              borderWidth="1px"
              borderRadius="md"
              minH="100px"
              fontSize="md"
            >
              {transcricao || transcricaoEditada || (
                <Text color="gray.500">{placeholder}</Text>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AudioRecorder; 