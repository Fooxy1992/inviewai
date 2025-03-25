import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Timestamp } from 'firebase/firestore';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  Skeleton,
  Divider,
  Textarea,
  useToast,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Badge,
  Icon
} from '@chakra-ui/react';
import { FiMic, FiMessageSquare, FiArrowLeft, FiArrowRight, FiCheck, FiFileText } from 'react-icons/fi';

import { useEntrevistas } from '@/hooks/useEntrevistas';
import { TipoEntrevista, TipoPergunta, StatusEntrevista } from '@/models/types';
import AudioRecorder from '@/components/entrevista/AudioRecorder';
import DashboardLayout from '@/components/layout/DashboardLayout';

const ResponderEntrevistaPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { id } = router.query;
  const entrevistaId = typeof id === 'string' ? id : '';
  
  const {
    entrevistaAtual,
    carregando,
    erro,
    obterEntrevista,
    salvarResposta,
    gerarFeedback,
    atualizarDadosEntrevista
  } = useEntrevistas();

  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [resposta, setResposta] = useState('');
  const [modoAudio, setModoAudio] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [gerandoFeedback, setGerandoFeedback] = useState(false);
  const [concluindo, setConcluindo] = useState(false);

  // Carregar entrevista
  useEffect(() => {
    if (session?.user?.id && entrevistaId) {
      obterEntrevista(entrevistaId);
    }
  }, [session?.user?.id, entrevistaId]);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Atualizar status da entrevista para EM_ANDAMENTO
  useEffect(() => {
    if (entrevistaAtual && entrevistaAtual.status === StatusEntrevista.PENDENTE) {
      atualizarDadosEntrevista(entrevistaId, {
        status: StatusEntrevista.EM_ANDAMENTO,
        dataInicio: Timestamp.fromDate(new Date())
      });
    }
  }, [entrevistaAtual]);

  // Verificar se resposta já existe para a pergunta atual
  useEffect(() => {
    const textoResposta = entrevistaAtual?.perguntas?.[perguntaAtual]?.resposta?.texto;
    if (textoResposta) {
      setResposta(textoResposta);
    } else {
      setResposta('');
    }
  }, [entrevistaAtual, perguntaAtual]);

  // Lidar com transcrição de áudio
  const handleTranscriptionComplete = (texto: string) => {
    setResposta(texto);
  };

  // Lidar com erro no áudio
  const handleAudioError = (error: Error) => {
    toast({
      title: 'Erro ao processar áudio',
      description: error.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  // Salvar resposta atual
  const salvarRespostaAtual = async () => {
    if (!entrevistaAtual || !entrevistaAtual.perguntas) return;
    
    const pergunta = entrevistaAtual.perguntas[perguntaAtual];
    if (!pergunta || !resposta.trim()) {
      toast({
        title: 'Resposta vazia',
        description: 'Por favor, forneça uma resposta antes de salvar.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setSalvando(true);
    try {
      await salvarResposta(entrevistaId, pergunta.id, resposta);
      toast({
        title: 'Resposta salva',
        description: 'Sua resposta foi salva com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Se for a última pergunta, perguntar se deseja concluir a entrevista
      if (perguntaAtual === entrevistaAtual.perguntas.length - 1) {
        onOpen();
      } else {
        // Avançar para próxima pergunta
        setPerguntaAtual(perguntaAtual + 1);
      }
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar sua resposta. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Erro ao salvar resposta:', error);
    } finally {
      setSalvando(false);
    }
  };

  // Gerar feedback com IA
  const solicitarFeedback = async () => {
    if (!entrevistaAtual || !entrevistaAtual.perguntas) return;
    
    const pergunta = entrevistaAtual.perguntas[perguntaAtual];
    if (!pergunta) return;
    
    setGerandoFeedback(true);
    try {
      await gerarFeedback(entrevistaId, pergunta.id);
      toast({
        title: 'Feedback gerado',
        description: 'O feedback para sua resposta foi gerado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Recarregar entrevista para mostrar feedback
      await obterEntrevista(entrevistaId);
    } catch (error) {
      toast({
        title: 'Erro ao gerar feedback',
        description: 'Não foi possível gerar o feedback. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Erro ao gerar feedback:', error);
    } finally {
      setGerandoFeedback(false);
    }
  };

  // Concluir entrevista
  const concluirEntrevista = async () => {
    if (!entrevistaAtual) return;
    
    setConcluindo(true);
    try {
      await atualizarDadosEntrevista(entrevistaId, {
        status: StatusEntrevista.CONCLUIDA,
        dataConclusao: Timestamp.fromDate(new Date())
      });
      
      toast({
        title: 'Entrevista concluída',
        description: 'Sua entrevista foi concluída com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirecionar para página de resultado
      router.push(`/dashboard/entrevistas/${entrevistaId}/resultado`);
    } catch (error) {
      toast({
        title: 'Erro ao concluir',
        description: 'Não foi possível concluir a entrevista. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Erro ao concluir entrevista:', error);
    } finally {
      setConcluindo(false);
      onClose();
    }
  };

  // Formatar tipo de pergunta
  const formatarTipoPergunta = (tipo: TipoPergunta) => {
    const tipos = {
      [TipoPergunta.COMPORTAMENTAL]: { label: 'Comportamental', color: 'purple' },
      [TipoPergunta.TECNICA]: { label: 'Técnica', color: 'green' },
      [TipoPergunta.GERAL]: { label: 'Geral', color: 'blue' },
      [TipoPergunta.MULTIPLA_ESCOLHA]: { label: 'Múltipla Escolha', color: 'orange' },
      [TipoPergunta.ABERTA]: { label: 'Aberta', color: 'teal' }
    };
    return tipos[tipo] || { label: tipo, color: 'gray' };
  };

  // Verificar se a pergunta já tem resposta
  const perguntaRespondida = (index: number) => {
    return !!(entrevistaAtual?.perguntas && 
      entrevistaAtual.perguntas[index]?.resposta?.texto);
  };

  // Loading skeleton
  if (carregando && !entrevistaAtual) {
    return (
      <DashboardLayout>
        <Container maxW="container.md" py={8}>
          <Skeleton height="50px" mb={6} />
          <Skeleton height="30px" mb={8} />
          <Skeleton height="200px" mb={5} />
          <Skeleton height="150px" />
        </Container>
      </DashboardLayout>
    );
  }

  // Mensagem de erro
  if (erro || !entrevistaAtual) {
    return (
      <DashboardLayout>
        <Container maxW="container.md" py={8}>
          <Heading size="lg" mb={4}>Erro ao carregar entrevista</Heading>
          <Text>{erro || 'Entrevista não encontrada'}</Text>
          <Button 
            mt={4} 
            leftIcon={<FiArrowLeft />} 
            onClick={() => router.push('/dashboard/entrevistas')}
          >
            Voltar para entrevistas
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  // Se não houver perguntas
  if (!entrevistaAtual.perguntas || entrevistaAtual.perguntas.length === 0) {
    return (
      <DashboardLayout>
        <Container maxW="container.md" py={8}>
          <Heading size="lg" mb={4}>{entrevistaAtual.titulo}</Heading>
          <Text mb={8}>Esta entrevista não possui perguntas cadastradas.</Text>
          <Button 
            leftIcon={<FiArrowLeft />} 
            onClick={() => router.push(`/dashboard/entrevistas/${entrevistaId}`)}
          >
            Voltar para detalhes
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxW="container.md" py={6}>
        <Box mb={8}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading size="lg">{entrevistaAtual.titulo}</Heading>
            <Tag size="md" colorScheme={
              entrevistaAtual.tipo === TipoEntrevista.COMPORTAMENTAL ? 'purple' :
              entrevistaAtual.tipo === TipoEntrevista.TECNICA ? 'green' : 'blue'
            }>
              {entrevistaAtual.tipo}
            </Tag>
          </Flex>
          <Text color="gray.500">
            Questão {perguntaAtual + 1} de {entrevistaAtual.perguntas.length}
          </Text>
        </Box>

        {/* Navegação de perguntas */}
        <Flex mb={6} overflowX="auto" py={2}>
          <HStack spacing={2}>
            {entrevistaAtual.perguntas.map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant={perguntaAtual === index ? 'solid' : 'outline'}
                colorScheme={perguntaAtual === index ? 'blue' : perguntaRespondida(index) ? 'green' : 'gray'}
                onClick={() => setPerguntaAtual(index)}
                minW="40px"
                h="40px"
                borderRadius="full"
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
        </Flex>

        {/* Pergunta atual */}
        <Box mb={8}>
          <HStack mb={2}>
            <Badge colorScheme={formatarTipoPergunta(entrevistaAtual.perguntas[perguntaAtual].tipo).color}>
              {formatarTipoPergunta(entrevistaAtual.perguntas[perguntaAtual].tipo).label}
            </Badge>
            {entrevistaAtual.perguntas[perguntaAtual].tempoMaximo && (
              <Badge colorScheme="blue">
                {entrevistaAtual.perguntas[perguntaAtual].tempoMaximo}s
              </Badge>
            )}
          </HStack>
          <Heading size="md" mb={4}>
            {entrevistaAtual.perguntas[perguntaAtual].texto}
          </Heading>
        </Box>

        {/* Alternância entre texto e áudio */}
        <Flex mb={4} justify="flex-end">
          <Button
            size="sm"
            leftIcon={modoAudio ? <FiMessageSquare /> : <FiMic />}
            onClick={() => setModoAudio(!modoAudio)}
            variant="outline"
          >
            {modoAudio ? 'Modo Texto' : 'Modo Áudio'}
          </Button>
        </Flex>

        {/* Área de resposta */}
        <Box mb={8}>
          {modoAudio ? (
            <AudioRecorder
              onTranscriptionComplete={handleTranscriptionComplete}
              onError={handleAudioError}
              maxDuration={entrevistaAtual.perguntas[perguntaAtual].tempoMaximo || 300}
              placeholder="Sua resposta será transcrita aqui..."
            />
          ) : (
            <Textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              minH="200px"
              resize="vertical"
              mb={4}
            />
          )}
        </Box>

        {/* Feedback (se disponível) */}
        {entrevistaAtual.perguntas[perguntaAtual].feedback && (
          <Box
            mb={8}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            borderColor="green.200"
            bg="green.50"
            _dark={{
              borderColor: "green.700",
              bg: "green.900"
            }}
          >
            <Flex align="center" mb={2}>
              <Icon as={FiFileText} mr={2} color="green.500" />
              <Heading size="sm">Feedback</Heading>
            </Flex>
            <Text>{entrevistaAtual?.perguntas?.[perguntaAtual]?.feedback?.texto}</Text>
            {entrevistaAtual?.perguntas?.[perguntaAtual]?.feedback?.pontuacao && (
              <Text mt={2} fontWeight="bold">
                Pontuação: {entrevistaAtual?.perguntas?.[perguntaAtual]?.feedback?.pontuacao}/10
              </Text>
            )}
          </Box>
        )}

        {/* Botões de ação */}
        <Flex justify="space-between" mt={6}>
          <Button
            leftIcon={<FiArrowLeft />}
            onClick={() => {
              if (perguntaAtual > 0) {
                setPerguntaAtual(perguntaAtual - 1);
              } else {
                router.push(`/dashboard/entrevistas/${entrevistaId}`);
              }
            }}
            variant="outline"
          >
            {perguntaAtual > 0 ? 'Anterior' : 'Voltar'}
          </Button>
          
          <HStack>
            {perguntaRespondida(perguntaAtual) && !entrevistaAtual.perguntas[perguntaAtual].feedback && (
              <Button
                leftIcon={<FiFileText />}
                onClick={solicitarFeedback}
                colorScheme="green"
                variant="outline"
                isLoading={gerandoFeedback}
              >
                Solicitar Feedback
              </Button>
            )}
            
            <Button
              rightIcon={
                perguntaAtual < entrevistaAtual.perguntas.length - 1 
                  ? <FiArrowRight /> 
                  : <FiCheck />
              }
              onClick={salvarRespostaAtual}
              colorScheme="blue"
              isLoading={salvando}
            >
              {perguntaAtual < entrevistaAtual.perguntas.length - 1 
                ? 'Salvar e Avançar' 
                : 'Salvar Resposta'
              }
            </Button>
          </HStack>
        </Flex>
      </Container>

      {/* Modal de conclusão */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Concluir Entrevista</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Você completou todas as perguntas da entrevista. Deseja concluí-la agora?
            </Text>
            <Text mt={2}>
              Você ainda pode revisar e editar suas respostas antes de concluir.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Revisar respostas
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={concluirEntrevista}
              isLoading={concluindo}
            >
              Concluir Entrevista
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
};

export default ResponderEntrevistaPage; 