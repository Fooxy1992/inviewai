import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  Card,
  CardBody,
  Badge,
  Divider,
  IconButton,
  Textarea,
  Progress,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Skeleton
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaMicrophone, FaMicrophoneSlash, FaSave, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEntrevistas } from '@/hooks/useEntrevistas';
import { TipoPergunta, StatusEntrevista } from '@/models/types';
import { Timestamp } from 'firebase/firestore';

const EntrevistaSessaoPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const { 
    entrevistaAtual, 
    carregando, 
    erro, 
    obterEntrevista,
    salvarResposta,
    atualizarDadosEntrevista,
    gerarFeedback
  } = useEntrevistas();
  
  // Referência para rolagem automática
  const respostaRef = useRef<HTMLTextAreaElement>(null);
  
  // Estados para controle da sessão
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [resposta, setResposta] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [gerandoFeedback, setGerandoFeedback] = useState(false);
  
  // Estado para gravação de áudio
  const [gravando, setGravando] = useState(false);
  const [reconhecimentoVoz, setReconhecimentoVoz] = useState<any>(null);
  
  // Modal de confirmação para finalizar entrevista
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Carregar entrevista
  useEffect(() => {
    if (id && typeof id === 'string') {
      obterEntrevista(id);
    }
  }, [id]);
  
  // Atualizar status da entrevista para "EM_ANDAMENTO" quando iniciar a sessão
  useEffect(() => {
    const atualizarStatus = async () => {
      if (entrevistaAtual && entrevistaAtual.status === StatusEntrevista.PENDENTE && id) {
        try {
          await atualizarDadosEntrevista(id as string, {
            ...entrevistaAtual,
            status: StatusEntrevista.EM_ANDAMENTO
          });
        } catch (error) {
          console.error('Erro ao atualizar status da entrevista:', error);
        }
      }
    };
    
    atualizarStatus();
  }, [entrevistaAtual, id]);
  
  // Configurar reconhecimento de voz
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'pt-BR';
        
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript + ' ';
            }
          }
          
          if (transcript) {
            setResposta(prev => prev + transcript);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Erro no reconhecimento de voz:', event.error);
          setGravando(false);
          toast({
            title: 'Erro no reconhecimento de voz',
            description: `Erro: ${event.error}`,
            status: 'error',
            duration: 3000,
            isClosable: true
          });
        };
        
        setReconhecimentoVoz(recognition);
      }
    }
    
    return () => {
      if (reconhecimentoVoz) {
        try {
          reconhecimentoVoz.stop();
        } catch (e) {
          // Ignora erros ao parar o reconhecimento de voz
        }
      }
    };
  }, []);
  
  // Voltar para a página de detalhes da entrevista
  const voltar = () => {
    router.push(`/dashboard/entrevistas/${id}`);
  };
  
  // Iniciar/parar gravação de áudio
  const toggleGravacao = () => {
    if (!reconhecimentoVoz) {
      toast({
        title: 'Reconhecimento de voz não suportado',
        description: 'Seu navegador não suporta reconhecimento de voz.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    if (gravando) {
      reconhecimentoVoz.stop();
      setGravando(false);
    } else {
      try {
        reconhecimentoVoz.start();
        setGravando(true);
      } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
        toast({
          title: 'Erro ao iniciar gravação',
          description: 'Não foi possível iniciar a gravação de áudio.',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    }
  };
  
  // Salvar resposta atual
  const handleSalvarResposta = async () => {
    if (!entrevistaAtual || !entrevistaAtual.perguntas || perguntaAtual >= entrevistaAtual.perguntas.length || !id) {
      return;
    }
    
    const perguntaId = entrevistaAtual.perguntas[perguntaAtual].id;
    
    try {
      setSalvando(true);
      
      await salvarResposta(id as string, perguntaId, resposta);
      
      toast({
        title: 'Resposta salva',
        description: 'Sua resposta foi salva com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Recarregar entrevista para obter dados atualizados
      await obterEntrevista(id as string);
      
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar sua resposta.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSalvando(false);
    }
  };
  
  // Solicitar feedback da IA para a resposta atual
  const handleSolicitarFeedback = async () => {
    if (!entrevistaAtual || !entrevistaAtual.perguntas || perguntaAtual >= entrevistaAtual.perguntas.length || !id) {
      return;
    }
    
    const perguntaId = entrevistaAtual.perguntas[perguntaAtual].id;
    
    // Verificar se já existe uma resposta
    if (!resposta || resposta.trim() === '') {
      toast({
        title: 'Resposta vazia',
        description: 'É necessário fornecer uma resposta para receber feedback.',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    try {
      setGerandoFeedback(true);
      
      // Primeiro, salvar a resposta atual (caso tenha sido modificada)
      await salvarResposta(id as string, perguntaId, resposta);
      
      // Solicitar feedback da IA
      await gerarFeedback(id as string, perguntaId);
      
      // Recarregar entrevista para obter dados atualizados com o feedback
      await obterEntrevista(id as string);
      
      toast({
        title: 'Feedback gerado',
        description: 'O feedback para sua resposta foi gerado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
    } catch (error) {
      console.error('Erro ao gerar feedback:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o feedback para sua resposta.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setGerandoFeedback(false);
    }
  };
  
  // Navegar para a próxima pergunta
  const proximaPergunta = async () => {
    // Salvar resposta atual antes de avançar
    if (resposta && resposta.trim() !== '') {
      await handleSalvarResposta();
    }
    
    if (entrevistaAtual && entrevistaAtual.perguntas && perguntaAtual < entrevistaAtual.perguntas.length - 1) {
      setPerguntaAtual(prev => prev + 1);
      setResposta(''); // Limpar campo de resposta
      
      // Se a próxima pergunta já tiver uma resposta, pré-carregá-la
      const proximaPerguntaIndex = perguntaAtual + 1;
      if (entrevistaAtual.perguntas[proximaPerguntaIndex]?.resposta) {
        setResposta(entrevistaAtual.perguntas[proximaPerguntaIndex]?.resposta?.texto || '');
      }
    }
  };
  
  // Navegar para a pergunta anterior
  const perguntaAnterior = async () => {
    // Salvar resposta atual antes de voltar
    if (resposta && resposta.trim() !== '') {
      await handleSalvarResposta();
    }
    
    if (entrevistaAtual && entrevistaAtual.perguntas && perguntaAtual > 0) {
      setPerguntaAtual(prev => prev - 1);
      
      // Se a pergunta anterior já tiver uma resposta, pré-carregá-la
      const perguntaAnteriorIndex = perguntaAtual - 1;
      if (entrevistaAtual.perguntas[perguntaAnteriorIndex]?.resposta) {
        setResposta(entrevistaAtual.perguntas[perguntaAnteriorIndex]?.resposta?.texto || '');
      }
    }
  };
  
  // Finalizar a entrevista
  const finalizarEntrevista = async () => {
    if (!id) return;
    
    try {
      // Salvar resposta atual antes de finalizar
      if (resposta && resposta.trim() !== '') {
        await handleSalvarResposta();
      }
      
      // Atualizar status da entrevista para "CONCLUIDA"
      await atualizarDadosEntrevista(id as string, {
        ...entrevistaAtual,
        status: StatusEntrevista.CONCLUIDA
      });
      
      toast({
        title: 'Entrevista finalizada',
        description: 'A entrevista foi finalizada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Redirecionar para a página de detalhes da entrevista
      router.push(`/dashboard/entrevistas/${id}`);
      
    } catch (error) {
      console.error('Erro ao finalizar entrevista:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível finalizar a entrevista.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  // Atualizar resposta quando a pergunta atual mudar
  useEffect(() => {
    if (entrevistaAtual && entrevistaAtual.perguntas && entrevistaAtual.perguntas[perguntaAtual]) {
      setResposta(entrevistaAtual.perguntas[perguntaAtual].resposta?.texto || '');
    }
  }, [perguntaAtual, entrevistaAtual]);
  
  // Renderizar página de carregamento
  if (carregando) {
    return (
      <DashboardLayout>
        <Container maxW="container.lg" py={5}>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            mb={6}
            onClick={voltar}
          >
            Voltar
          </Button>
          
          <Skeleton height="40px" mb={6} />
          <Skeleton height="20px" width="60%" mb={4} />
          
          <Skeleton height="150px" mb={6} />
          
          <Skeleton height="200px" mb={4} />
          
          <HStack justify="space-between" mt={4}>
            <Skeleton height="40px" width="100px" />
            <Skeleton height="40px" width="100px" />
          </HStack>
        </Container>
      </DashboardLayout>
    );
  }
  
  // Renderizar página de erro
  if (erro || !entrevistaAtual) {
    return (
      <DashboardLayout>
        <Container maxW="container.lg" py={5}>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            mb={6}
            onClick={voltar}
          >
            Voltar
          </Button>
          
          <Box p={4} bg="red.50" color="red.700" borderRadius="md">
            <Heading size="md" mb={2}>Erro ao carregar entrevista</Heading>
            <Text>{erro || 'Entrevista não encontrada'}</Text>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }
  
  // Verificar se existem perguntas na entrevista
  if (!entrevistaAtual.perguntas || entrevistaAtual.perguntas.length === 0) {
    return (
      <DashboardLayout>
        <Container maxW="container.lg" py={5}>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            mb={6}
            onClick={voltar}
          >
            Voltar
          </Button>
          
          <Box p={4} textAlign="center" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Esta entrevista não possui perguntas</Heading>
            <Text mb={4}>
              É necessário adicionar perguntas à entrevista antes de iniciar a sessão.
            </Text>
            <Button colorScheme="brand" onClick={voltar}>
              Voltar para adicionar perguntas
            </Button>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }
  
  const perguntaCorrente = entrevistaAtual.perguntas[perguntaAtual];
  const totalPerguntas = entrevistaAtual.perguntas.length;
  const progresso = ((perguntaAtual + 1) / totalPerguntas) * 100;
  
  return (
    <DashboardLayout>
      <Container maxW="container.lg" py={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline"
            onClick={voltar}
          >
            Voltar
          </Button>
          
          <HStack spacing={2}>
            <Text fontWeight="medium">
              Pergunta {perguntaAtual + 1} de {totalPerguntas}
            </Text>
            <Badge colorScheme="brand" fontSize="0.8em" px={2} py={1} borderRadius="full">
              {entrevistaAtual.titulo}
            </Badge>
          </HStack>
          
          <Button 
            colorScheme="brand" 
            variant="outline"
            onClick={onOpen}
          >
            Finalizar Entrevista
          </Button>
        </Flex>
        
        <Progress 
          value={progresso} 
          size="sm" 
          colorScheme="brand" 
          borderRadius="full" 
          mb={6}
        />
        
        <Card mb={6} borderRadius="lg" boxShadow="md">
          <CardBody>
            <VStack align="start" spacing={4}>
              <HStack width="100%" justifyContent="space-between">
                <Badge colorScheme={
                  perguntaCorrente.tipo === TipoPergunta.COMPORTAMENTAL ? 'teal' : 
                  perguntaCorrente.tipo === TipoPergunta.TECNICA ? 'cyan' : 
                  perguntaCorrente.tipo === TipoPergunta.MULTIPLA_ESCOLHA ? 'purple' : 'blue'
                }>
                  {perguntaCorrente.tipo}
                </Badge>
              </HStack>
              
              <Text fontSize="xl" fontWeight="medium">
                {perguntaCorrente.texto}
              </Text>
            </VStack>
          </CardBody>
        </Card>
        
        <Box mb={6}>
          <HStack mb={2} justifyContent="space-between">
            <Text fontWeight="medium">Sua resposta:</Text>
            <HStack>
              <Tooltip label={gravando ? 'Parar gravação' : 'Iniciar gravação de voz'}>
                <IconButton
                  aria-label="Gravação de voz"
                  icon={gravando ? <FaMicrophoneSlash /> : <FaMicrophone />}
                  colorScheme={gravando ? 'red' : 'gray'}
                  onClick={toggleGravacao}
                />
              </Tooltip>
              <Tooltip label="Salvar resposta">
                <IconButton
                  aria-label="Salvar resposta"
                  icon={<FaSave />}
                  onClick={handleSalvarResposta}
                  isLoading={salvando}
                />
              </Tooltip>
            </HStack>
          </HStack>
          
          <Textarea
            ref={respostaRef}
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite sua resposta aqui..."
            resize="vertical"
            rows={8}
            mb={4}
          />
          
          <Button
            rightIcon={gerandoFeedback ? <Spinner size="sm" /> : <FaThumbsUp />}
            colorScheme="green"
            isLoading={gerandoFeedback}
            onClick={handleSolicitarFeedback}
            mb={4}
            width="100%"
          >
            Solicitar Feedback da IA
          </Button>
        
          {perguntaCorrente.feedback && (
            <Card borderColor="green.200" borderWidth="1px" mb={4}>
              <CardBody>
                <Text fontWeight="medium" mb={2}>Feedback da IA:</Text>
                <Text mb={4}>{perguntaCorrente.feedback.texto}</Text>
                
                {perguntaCorrente.feedback.pontuacao !== undefined && (
                  <HStack justifyContent="flex-end">
                    <Badge 
                      colorScheme={
                        perguntaCorrente.feedback.pontuacao >= 7 ? 'green' : 
                        perguntaCorrente.feedback.pontuacao >= 4 ? 'yellow' : 'red'
                      }
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="0.9em"
                    >
                      {perguntaCorrente.feedback.pontuacao}/10
                    </Badge>
                  </HStack>
                )}
              </CardBody>
            </Card>
          )}
        </Box>
        
        <Flex justifyContent="space-between" mt={6}>
          <Button 
            onClick={perguntaAnterior} 
            isDisabled={perguntaAtual === 0}
          >
            Pergunta Anterior
          </Button>
          
          {perguntaAtual < totalPerguntas - 1 ? (
            <Button 
              colorScheme="brand" 
              onClick={proximaPergunta}
            >
              Próxima Pergunta
            </Button>
          ) : (
            <Button 
              colorScheme="green" 
              onClick={onOpen}
            >
              Finalizar Entrevista
            </Button>
          )}
        </Flex>
        
        {/* Modal de confirmação para finalizar entrevista */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Finalizar Entrevista</ModalHeader>
            <ModalBody>
              <Text>
                Você tem certeza que deseja finalizar esta entrevista? 
                Todas as respostas serão salvas e a entrevista será marcada como concluída.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="brand" onClick={finalizarEntrevista}>
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default EntrevistaSessaoPage; 