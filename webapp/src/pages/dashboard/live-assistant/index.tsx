import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
  Badge,
  HStack,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  Collapse,
  Spinner,
  CloseButton,
} from '@chakra-ui/react';
import { 
  FiMic, FiMicOff, FiPlay, FiPause, FiSettings, 
  FiSlash, FiCopy, FiBell, FiThumbsUp, FiThumbsDown,
  FiVideo, FiUpload, FiFileText, FiMessageSquare,
  FiMessageCircle, FiChevronsDown, FiChevronsUp,
  FiAlertCircle, FiCheck
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAudioCapture } from '../../../hooks/useAudioCapture';
import { Transcription, InterviewFeedback } from '../../../services/openai-service';
import { getSuggestionForQuestion } from '../../../services/openai-service';

// Interfaces locais
interface Transcript {
  id: string;
  speaker: 'you' | 'interviewer';
  content: string;
  timestamp: string;
}

interface SuggestionResponse {
  id: string;
  question: string;
  suggestion: string;
  keyPoints: string[];
  timestamp: string;
}

export default function LiveAssistant() {
  // Estados
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<InterviewFeedback[]>([]);
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [useVoiceFeedback, setUseVoiceFeedback] = useState(false);
  const [useAlertSounds, setUseAlertSounds] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<SuggestionResponse | null>(null);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(true);
  const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);
  const [userExperience, setUserExperience] = useState('');
  const lastInterviewerMessageRef = useRef<string>('');
  const toast = useToast();
  
  // Cores para o tema
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const feedbackBg = useColorModeValue('gray.50', 'gray.700');
  const suggestionBg = useColorModeValue('yellow.50', 'yellow.900');
  const suggestionBorder = useColorModeValue('yellow.200', 'yellow.700');
  
  // Usar o hook personalizado de captura de áudio
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    error, 
    isProcessing 
  } = useAudioCapture({
    interviewContext: {
      position: jobPosition,
      company: companyName
    },
    onTranscriptionComplete: handleTranscriptionReceived,
    onFeedbackReceived: handleFeedbackReceived,
    enabled: isConnected
  });
  
  // Mostrar erros de captura de áudio
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);
  
  // Função para processar nova transcrição recebida
  async function handleTranscriptionReceived(transcription: Transcription) {
    if (!transcription.text.trim() || !transcription.speaker) return;
    
    const newTranscript: Transcript = {
      id: `transcript-${Date.now()}`,
      speaker: transcription.speaker,
      content: transcription.text,
      timestamp: new Date().toISOString()
    };
    
    setTranscript(prev => [...prev, newTranscript]);
    
    // Se for uma mensagem do entrevistador, vamos buscar uma sugestão de resposta
    if (transcription.speaker === 'interviewer') {
      const questionText = transcription.text;
      lastInterviewerMessageRef.current = questionText;
      
      // Verifica se parece uma pergunta
      const isLikelyQuestion = isQuestion(questionText);
      
      if (isLikelyQuestion) {
        setIsFetchingSuggestion(true);
        try {
          // Abrir o painel de sugestão
          setIsSuggestionOpen(true);
          
          // Buscar sugestão de resposta para a pergunta
          const suggestionData = await getSuggestionForQuestion({
            question: questionText,
            userResponse: '', // Não temos resposta ainda
            jobTitle: jobPosition || 'esta posição',
            context: `Entrevista para ${jobPosition} ${companyName ? `na ${companyName}` : ''}. Experiência: ${userExperience}`
          });
          
          // Atualizar o estado com a sugestão
          setCurrentSuggestion({
            id: `suggestion-${Date.now()}`,
            question: questionText,
            suggestion: suggestionData.response,
            keyPoints: suggestionData.keyPoints || [],
            timestamp: new Date().toISOString()
          });
          
          // Alertar o usuário sobre a nova sugestão
          if (useAlertSounds) {
            playAlertSound(700); // Frequência diferente para diferenciar do feedback
          }
        } catch (error) {
          console.error('Erro ao obter sugestão:', error);
          toast({
            title: 'Erro na sugestão',
            description: 'Não foi possível obter uma sugestão para esta pergunta.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsFetchingSuggestion(false);
        }
      }
    }
  }
  
  // Função para verificar se um texto parece ser uma pergunta
  function isQuestion(text: string): boolean {
    // Verificar se termina com ponto de interrogação
    if (text.trim().endsWith('?')) return true;
    
    // Verificar palavras interrogativas comuns em português
    const questionWords = [
      'como', 'qual', 'quais', 'quem', 'quando', 'onde', 'por que', 'porque',
      'o que', 'me diga', 'poderia', 'pode', 'você poderia', 'explique',
      'descreva', 'fale sobre', 'conte', 'me conte', 'me fale'
    ];
    
    const lowerText = text.toLowerCase();
    return questionWords.some(word => lowerText.includes(word));
  }
  
  // Função para processar novo feedback recebido
  function handleFeedbackReceived(newFeedback: InterviewFeedback[]) {
    // Adicionar apenas feedbacks que ainda não existem
    const existingIds = new Set(feedback.map(f => f.content));
    const uniqueNewFeedback = newFeedback.filter(f => !existingIds.has(f.content));
    
    if (uniqueNewFeedback.length > 0) {
      setFeedback(prev => [...uniqueNewFeedback, ...prev]);
      
      // Alerta sonoro se ativado
      if (useAlertSounds) {
        playAlertSound(520);
      }
      
      // Síntese de voz se ativada
      if (useVoiceFeedback) {
        speakFeedback(uniqueNewFeedback[0].content);
      }
    }
  }
  
  // Função para iniciar o assistente
  const handleStartAssistant = async () => {
    if (!selectedPlatform) {
      toast({
        title: 'Selecione uma plataforma',
        description: 'Por favor, selecione a plataforma que você está usando para a entrevista.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!jobPosition || !companyName) {
      toast({
        title: 'Informações incompletas',
        description: 'Por favor, preencha o cargo e a empresa para começar.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsConnected(true);
    await startRecording();
    
    toast({
      title: 'Assistente iniciado',
      description: 'O assistente de IA está escutando sua entrevista.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Função para parar o assistente
  const handleStopAssistant = () => {
    stopRecording();
    setIsConnected(false);
    
    toast({
      title: 'Assistente finalizado',
      description: 'O assistente de IA foi desativado.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Função para salvar notas
  const saveNotes = () => {
    localStorage.setItem('interview-notes', notes);
    
    toast({
      title: 'Notas salvas',
      description: 'Suas anotações foram salvas com sucesso.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Função para exportar transcrição
  const exportTranscript = () => {
    const transcriptText = transcript
      .map(t => `[${new Date(t.timestamp).toLocaleTimeString()}] ${t.speaker === 'you' ? 'Você' : 'Entrevistador'}: ${t.content}`)
      .join('\n\n');
    
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entrevista-${companyName}-${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Transcrição exportada',
      description: 'A transcrição foi exportada com sucesso.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Função para copiar feedback
  const copyFeedback = () => {
    const feedbackText = feedback
      .map(f => `• ${f.content}`)
      .join('\n');
    
    navigator.clipboard.writeText(feedbackText);
    
    toast({
      title: 'Feedback copiado',
      description: 'Feedback copiado para a área de transferência.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Função para copiar sugestão
  const copySuggestion = () => {
    if (!currentSuggestion) return;
    
    navigator.clipboard.writeText(currentSuggestion.suggestion);
    
    toast({
      title: 'Sugestão copiada',
      description: 'Sugestão copiada para a área de transferência.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Funções de síntese de voz e sons
  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.volume = 0.8;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const playAlertSound = (frequency: number = 520) => {
    // Sons simples com Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.2;
    
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
    }, 200);
  };
  
  // Renderizar o badge de tipos de feedback
  const renderFeedbackBadge = (type: string) => {
    let color;
    let text;
    
    switch (type) {
      case 'improvement':
        color = 'blue';
        text = 'Melhoria';
        break;
      case 'suggestion':
        color = 'green';
        text = 'Sugestão';
        break;
      case 'warning':
        color = 'orange';
        text = 'Cuidado';
        break;
      default:
        color = 'gray';
        text = type;
    }
    
    return <Badge colorScheme={color}>{text}</Badge>;
  };
  
  return (
    <>
      <Head>
        <title>Assistente em Tempo Real - InViewAI</title>
        <meta name="description" content="Assistente de IA para entrevistas em tempo real" />
      </Head>
      
      <DashboardLayout pageTitle="Assistente em Tempo Real">
        <Box py={4}>
          {/* Cabeçalho e configuração */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" mb={6}>
            <CardHeader pb={0}>
              <Heading size="md">Configuração do Assistente</Heading>
            </CardHeader>
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                <GridItem>
                  <FormControl mb={4}>
                    <FormLabel>Plataforma de Reunião</FormLabel>
                    <Select 
                      placeholder="Selecione a plataforma" 
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      isDisabled={isRecording}
                    >
                      <option value="google-meet">Google Meet</option>
                      <option value="ms-teams">Microsoft Teams</option>
                      <option value="zoom">Zoom</option>
                      <option value="other">Outra plataforma</option>
                    </Select>
                  </FormControl>
                  
                  <HStack spacing={4} mb={4}>
                    <FormControl>
                      <FormLabel>Cargo</FormLabel>
                      <Input 
                        placeholder="Ex: Desenvolvedor Full Stack" 
                        value={jobPosition}
                        onChange={(e) => setJobPosition(e.target.value)}
                        isDisabled={isRecording}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Empresa</FormLabel>
                      <Input 
                        placeholder="Ex: TechBrasil" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        isDisabled={isRecording}
                      />
                    </FormControl>
                  </HStack>
                  
                  <FormControl mb={4}>
                    <FormLabel>Experiência Relevante (opcional)</FormLabel>
                    <Textarea 
                      placeholder="Descreva brevemente sua experiência relevante para esta vaga" 
                      value={userExperience}
                      onChange={(e) => setUserExperience(e.target.value)}
                      isDisabled={isRecording}
                      size="sm"
                      rows={3}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center" mb={2}>
                    <Switch 
                      id="voice-feedback" 
                      colorScheme="brand" 
                      isDisabled={isRecording}
                      isChecked={useVoiceFeedback}
                      onChange={(e) => setUseVoiceFeedback(e.target.checked)}
                    />
                    <FormLabel htmlFor="voice-feedback" mb="0" ml={3}>
                      Feedback por voz (Text-to-Speech)
                    </FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center" mb={2}>
                    <Switch 
                      id="alert-sounds" 
                      colorScheme="brand" 
                      isDisabled={isRecording}
                      isChecked={useAlertSounds}
                      onChange={(e) => setUseAlertSounds(e.target.checked)}
                    />
                    <FormLabel htmlFor="alert-sounds" mb="0" ml={3}>
                      Sons de alerta
                    </FormLabel>
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <VStack spacing={4} alignItems="flex-start" h="100%">
                    <Box>
                      <Text fontWeight="medium" mb={2}>Instruções:</Text>
                      <Text fontSize="sm">
                        1. Selecione a plataforma de videoconferência que você está utilizando.
                      </Text>
                      <Text fontSize="sm">
                        2. Preencha as informações sobre o cargo e a empresa.
                      </Text>
                      <Text fontSize="sm">
                        3. Opcionalmente, adicione informações sobre sua experiência para melhorar as sugestões.
                      </Text>
                      <Text fontSize="sm">
                        4. Clique em "Iniciar Assistente" para começar a receber feedback e sugestões em tempo real.
                      </Text>
                      <Text fontSize="sm">
                        5. Quando o entrevistador fizer uma pergunta, você receberá sugestões de resposta.
                      </Text>
                      <Text fontSize="sm">
                        6. Conceda permissão ao navegador para acessar seu microfone quando solicitado.
                      </Text>
                    </Box>
                    
                    <Flex justify="center" w="100%" grow={1} align="flex-end">
                      <Button
                        leftIcon={isRecording ? <FiMicOff /> : <FiMic />}
                        colorScheme={isRecording ? "red" : "brand"}
                        size="lg"
                        onClick={isRecording ? handleStopAssistant : handleStartAssistant}
                        isLoading={isProcessing}
                        loadingText="Processando..."
                        w="full"
                      >
                        {isRecording ? "Parar Assistente" : "Iniciar Assistente"}
                      </Button>
                    </Flex>
                  </VStack>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
          
          {/* Área de sugestão de resposta */}
          {isConnected && (
            <Collapse in={isSuggestionOpen} animateOpacity>
              <Card 
                bg={suggestionBg} 
                borderWidth="1px" 
                borderColor={suggestionBorder} 
                shadow="sm" 
                mb={6}
              >
                <CardBody p={4}>
                  <Flex justify="space-between" align="center" mb={3}>
                    <HStack>
                      <Icon as={FiMessageCircle} color="yellow.600" boxSize={5} />
                      <Heading size="sm" color="yellow.800">
                        Sugestão de Resposta
                      </Heading>
                    </HStack>
                    <HStack>
                      <IconButton
                        aria-label="Copiar sugestão"
                        icon={<FiCopy size="1em" />}
                        size="sm"
                        variant="ghost"
                        colorScheme="yellow"
                        onClick={copySuggestion}
                        isDisabled={!currentSuggestion || isFetchingSuggestion}
                      />
                      <IconButton
                        aria-label="Fechar sugestão"
                        icon={<FiChevronsUp size="1em" />}
                        size="sm"
                        variant="ghost"
                        colorScheme="yellow"
                        onClick={() => setIsSuggestionOpen(false)}
                      />
                    </HStack>
                  </Flex>
                  
                  {isFetchingSuggestion ? (
                    <Flex direction="column" align="center" justify="center" py={4}>
                      <Spinner size="md" color="yellow.600" mb={2} />
                      <Text fontSize="sm" color="yellow.700">
                        Elaborando sugestão para a pergunta...
                      </Text>
                    </Flex>
                  ) : currentSuggestion ? (
                    <Box>
                      <HStack mb={1}>
                        <Badge colorScheme="yellow">Pergunta do Entrevistador</Badge>
                        <Text fontSize="xs" color="yellow.600">
                          {new Date(currentSuggestion.timestamp).toLocaleTimeString()}
                        </Text>
                      </HStack>
                      <Text fontWeight="medium" fontSize="sm" mb={2} color="yellow.800">
                        "{currentSuggestion.question}"
                      </Text>
                      <Divider borderColor="yellow.300" mb={2} />
                      
                      <Tabs variant="soft-rounded" size="sm" colorScheme="yellow" mb={2}>
                        <TabList mb={2}>
                          <Tab>Resposta Sugerida</Tab>
                          <Tab>Pontos-Chave</Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel px={2} py={1}>
                            <Text fontSize="sm" whiteSpace="pre-wrap" color="yellow.900">
                              {currentSuggestion.suggestion}
                            </Text>
                          </TabPanel>
                          <TabPanel px={2} py={1}>
                            {currentSuggestion.keyPoints.length > 0 ? (
                              <VStack align="stretch" spacing={1}>
                                {currentSuggestion.keyPoints.map((point, index) => (
                                  <HStack key={index} align="flex-start">
                                    <Icon as={FiCheck} color="green.500" mt={1} flexShrink={0} />
                                    <Text fontSize="sm" color="yellow.900">{point}</Text>
                                  </HStack>
                                ))}
                              </VStack>
                            ) : (
                              <Text fontSize="sm" color="yellow.700">
                                Não há pontos-chave específicos para esta resposta.
                              </Text>
                            )}
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </Box>
                  ) : (
                    <Flex direction="column" align="center" justify="center" py={4}>
                      <Icon as={FiMessageSquare} color="yellow.600" boxSize={8} mb={2} />
                      <Text fontSize="sm" color="yellow.700" textAlign="center">
                        Quando o entrevistador fizer uma pergunta, você verá sugestões de resposta aqui.
                      </Text>
                    </Flex>
                  )}
                </CardBody>
              </Card>
            </Collapse>
          )}
          
          {!isSuggestionOpen && isConnected && (
            <Button
              leftIcon={<FiChevronsDown />}
              variant="outline"
              size="sm"
              mb={4}
              onClick={() => setIsSuggestionOpen(true)}
              colorScheme="yellow"
            >
              {currentSuggestion ? "Mostrar sugestão de resposta" : "Mostrar área de sugestões"}
            </Button>
          )}
          
          {isConnected && (
            <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6}>
              {/* Coluna principal - Transcrição e Feedback */}
              <GridItem>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm">
                  <CardBody p={0}>
                    <Tabs colorScheme="brand" isLazy>
                      <TabList px={6} pt={4}>
                        <Tab><Icon as={FiFileText} mr={2} /> Transcrição</Tab>
                        <Tab><Icon as={FiBell} mr={2} /> Feedback</Tab>
                      </TabList>
                      
                      <TabPanels>
                        {/* Painel de Transcrição */}
                        <TabPanel>
                          <Box mb={4}>
                            <Flex justify="flex-end">
                              <Button 
                                leftIcon={<FiUpload />} 
                                size="sm" 
                                variant="outline"
                                onClick={exportTranscript}
                                isDisabled={transcript.length === 0}
                              >
                                Exportar Transcrição
                              </Button>
                            </Flex>
                          </Box>
                          
                          <Box maxH="500px" overflowY="auto" pr={2}>
                            {transcript.length > 0 ? (
                              <VStack spacing={4} align="stretch">
                                {transcript.map((item) => (
                                  <Box 
                                    key={item.id} 
                                    bg={feedbackBg} 
                                    p={3} 
                                    borderRadius="md"
                                    borderLeftWidth="4px"
                                    borderLeftColor={item.speaker === 'you' ? 'brand.500' : 'gray.500'}
                                  >
                                    <HStack mb={1}>
                                      <Text fontWeight="bold" fontSize="sm">
                                        {item.speaker === 'you' ? 'Você' : 'Entrevistador'}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                      </Text>
                                    </HStack>
                                    <Text>{item.content}</Text>
                                  </Box>
                                ))}
                              </VStack>
                            ) : (
                              <Text color="gray.500" textAlign="center" my={8}>
                                A transcrição aparecerá aqui durante a entrevista.
                              </Text>
                            )}
                          </Box>
                        </TabPanel>
                        
                        {/* Painel de Feedback */}
                        <TabPanel>
                          <Box mb={4}>
                            <Flex justify="flex-end">
                              <Button 
                                leftIcon={<FiCopy />} 
                                size="sm" 
                                variant="outline"
                                onClick={copyFeedback}
                                isDisabled={feedback.length === 0}
                              >
                                Copiar Feedback
                              </Button>
                            </Flex>
                          </Box>
                          
                          <Box maxH="500px" overflowY="auto" pr={2}>
                            {feedback.length > 0 ? (
                              <VStack spacing={4} align="stretch">
                                {feedback.map((item) => (
                                  <Box 
                                    key={item.id} 
                                    bg={feedbackBg} 
                                    p={3} 
                                    borderRadius="md" 
                                    position="relative"
                                  >
                                    <HStack mb={2} justify="space-between">
                                      {renderFeedbackBadge(item.type)}
                                      <Text fontSize="xs" color="gray.500">
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                      </Text>
                                    </HStack>
                                    <Text>{item.content}</Text>
                                    <HStack position="absolute" bottom={1} right={1}>
                                      <IconButton
                                        aria-label="Feedback útil"
                                        icon={<FiThumbsUp size="0.85em" />}
                                        size="xs"
                                        variant="ghost"
                                      />
                                      <IconButton
                                        aria-label="Feedback não útil"
                                        icon={<FiThumbsDown size="0.85em" />}
                                        size="xs"
                                        variant="ghost"
                                      />
                                    </HStack>
                                  </Box>
                                ))}
                              </VStack>
                            ) : (
                              <Text color="gray.500" textAlign="center" my={8}>
                                O feedback aparecerá aqui durante a entrevista.
                              </Text>
                            )}
                          </Box>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </CardBody>
                </Card>
              </GridItem>
              
              {/* Coluna de notas */}
              <GridItem>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm">
                  <CardHeader pb={0}>
                    <Heading size="md">Suas Anotações</Heading>
                  </CardHeader>
                  <CardBody>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Faça suas anotações aqui durante a entrevista..."
                      size="md"
                      minH="400px"
                      resize="vertical"
                    />
                    
                    <Flex justify="flex-end" mt={4}>
                      <Button
                        colorScheme="brand"
                        onClick={saveNotes}
                        isDisabled={!notes.trim()}
                      >
                        Salvar Anotações
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          )}
          
          {!isConnected && (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              Configure o assistente e clique em "Iniciar Assistente" para começar a receber feedback e sugestões em tempo real durante sua entrevista.
            </Alert>
          )}
        </Box>
      </DashboardLayout>
    </>
  );
} 