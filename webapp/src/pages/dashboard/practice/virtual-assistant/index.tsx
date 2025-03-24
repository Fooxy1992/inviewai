import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
  Avatar,
  AvatarBadge,
  Badge,
  Tooltip,
  Progress,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Switch,
} from '@chakra-ui/react';
import {
  FiMic,
  FiMicOff,
  FiPause,
  FiPlay,
  FiUser,
  FiPlus,
  FiRefreshCw,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageSquare,
  FiSkipForward,
  FiClock,
  FiChevronRight,
  FiAlertTriangle,
  FiInfo,
  FiDownload,
} from 'react-icons/fi';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { getSuggestionForQuestion } from '../../../../services/openai-service';
import { useAudioCapture } from '../../../../hooks/useAudioCapture';
import { Transcription } from '../../../../services/openai-service';

// Interfaces
interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: string[];
}

interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  questions: string[];
}

// Componente principal
export default function VirtualAssistant() {
  // Estados
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [pauseAfterQuestion, setPauseAfterQuestion] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<InterviewTemplate | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  
  // Cores do tema
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const messageBgUser = useColorModeValue('blue.50', 'blue.900');
  const messageBgAssistant = useColorModeValue('gray.100', 'gray.700');
  
  // Hook de captura de áudio
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    error, 
    isProcessing 
  } = useAudioCapture({
    interviewContext: {
      position: jobTitle,
      company: companyName
    },
    onTranscriptionComplete: handleTranscriptionReceived,
    onFeedbackReceived: () => {}, // Não estamos usando o feedback em tempo real aqui
    enabled: isInterviewActive
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
  
  // Mock para templates de entrevista
  useEffect(() => {
    // Simular uma chamada de API para buscar templates
    const mockTemplates: InterviewTemplate[] = [
      {
        id: '1',
        name: 'Entrevista para Desenvolvedor Full Stack',
        description: 'Perguntas comuns para desenvolvedores full stack com foco em React, Node.js e arquitetura de sistemas.',
        category: 'Desenvolvimento',
        difficulty: 'Médio',
        questions: [
          'Conte um pouco sobre sua experiência como desenvolvedor?',
          'Quais tecnologias e frameworks você tem utilizado nos últimos projetos?',
          'Como você gerencia o estado em aplicações React?',
          'Explique como você implementaria autenticação em uma API RESTful.',
          'Descreva um problema técnico desafiador que você resolveu recentemente.',
          'Como você lida com requisitos que mudam frequentemente?',
          'Quais práticas de segurança você considera essenciais em desenvolvimento web?',
          'Qual sua abordagem para testes automatizados?',
          'Como você estruturaria um projeto full-stack do zero?',
          'Você tem alguma pergunta sobre a empresa ou a posição?'
        ]
      },
      {
        id: '2',
        name: 'Entrevista Comportamental',
        description: 'Perguntas comportamentais e situacionais para avaliar soft skills e adequação cultural.',
        category: 'Comportamental',
        difficulty: 'Médio',
        questions: [
          'Conte um pouco sobre você e sua trajetória profissional.',
          'Descreva uma situação em que você teve que trabalhar sob pressão. Como você lidou com isso?',
          'Fale sobre um conflito que você teve com um colega de trabalho. Como você o resolveu?',
          'Qual foi seu maior erro profissional e o que você aprendeu com ele?',
          'Como você estabelece e acompanha suas metas profissionais?',
          'Descreva uma situação onde você demonstrou liderança.',
          'Como você reage a críticas ao seu trabalho?',
          'Qual é sua maior força e sua maior fraqueza?',
          'Por que você quer trabalhar nesta empresa?',
          'Onde você se vê profissionalmente em 5 anos?'
        ]
      },
      {
        id: '3',
        name: 'Entrevista para Cientista de Dados',
        description: 'Perguntas para avaliar conhecimentos em análise de dados, estatística e machine learning.',
        category: 'Ciência de Dados',
        difficulty: 'Difícil',
        questions: [
          'Fale sobre sua formação e experiência em Ciência de Dados.',
          'Quais projetos de análise de dados você já realizou?',
          'Explique a diferença entre aprendizado supervisionado e não supervisionado.',
          'Como você lida com dados desbalanceados em problemas de classificação?',
          'Explique o conceito de overfitting e como evitá-lo.',
          'Quais técnicas você usa para feature selection?',
          'Como você avalia a performance de um modelo de classificação?',
          'Explique como você implementaria um sistema de recomendação.',
          'Quais ferramentas e linguagens você domina para análise de dados?',
          'Como você comunica resultados técnicos para stakeholders não técnicos?'
        ]
      }
    ];
    
    setTemplates(mockTemplates);
  }, []);
  
  // Função para iniciar a entrevista
  const startInterview = () => {
    if (!selectedTemplate) {
      toast({
        title: 'Selecione um template',
        description: 'Por favor, selecione um template de entrevista para começar.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;
    
    setCurrentTemplate(template);
    setMessages([]);
    setCurrentQuestionIndex(0);
    setIsInterviewActive(true);
    
    // Adicionar mensagem de boas-vindas
    const welcomeMessage: Message = {
      id: 'welcome',
      sender: 'assistant',
      content: `Olá! Sou seu entrevistador virtual para esta simulação de entrevista para ${jobTitle || 'a vaga'} ${companyName ? `na ${companyName}` : ''}. Vamos começar com algumas perguntas para conhecer melhor suas habilidades e experiências. Responda naturalmente como faria em uma entrevista real.`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Enviar a primeira pergunta após 2 segundos
    setTimeout(() => {
      askNextQuestion();
    }, 2000);
  };
  
  // Função para finalizar a entrevista
  const endInterview = () => {
    setIsInterviewActive(false);
    stopRecording();
    
    // Adicionar mensagem de conclusão
    const conclusionMessage: Message = {
      id: `conclusion-${Date.now()}`,
      sender: 'assistant',
      content: 'Obrigado por participar desta entrevista simulada. Você pode revisar suas respostas e o feedback abaixo. Lembre-se que este é um ambiente de prática para ajudar você a se preparar para entrevistas reais.',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, conclusionMessage]);
  };
  
  // Função para fazer a próxima pergunta
  const askNextQuestion = () => {
    if (!currentTemplate || currentQuestionIndex >= currentTemplate.questions.length) {
      endInterview();
      return;
    }
    
    setIsTyping(true);
    
    // Simular o tempo de digitação do entrevistador
    setTimeout(() => {
      const newMessage: Message = {
        id: `question-${currentQuestionIndex}`,
        sender: 'assistant',
        content: currentTemplate.questions[currentQuestionIndex],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Se estiver configurado para pausar após a pergunta, não iniciar gravação automática
      if (!pauseAfterQuestion) {
        startRecording();
      }
    }, 1500);
  };
  
  // Função para processar a transcrição recebida
  async function handleTranscriptionReceived(transcription: Transcription) {
    // Ignorar se não tivermos texto ou se a entrevista não estiver ativa
    if (!transcription.text || !isInterviewActive) return;
    
    // Garantir que temos um speaker (default para 'you' se não especificado)
    const speaker = transcription.speaker || 'you';
    
    // Adicionar a transcrição à conversa
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: transcription.text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Se for o usuário falando, processar a resposta
    if (speaker === 'you') {
      setIsTyping(true);
      
      try {
        // Gerar feedback usando a API do OpenAI
        const suggestionResult = await getSuggestionForQuestion({
          question: currentTemplate?.questions[currentQuestionIndex] || '',
          userResponse: transcription.text,
          jobTitle: jobTitle || 'Candidato',
          context: `Entrevista para ${jobTitle} ${companyName ? `na ${companyName}` : ''}`
        });
        
        // Adicionar feedback como anotações na mensagem do usuário
        if (suggestionResult.feedback && suggestionResult.feedback.length > 0) {
          setMessages(prev => {
            const updated = [...prev];
            const lastUserMessageIndex = updated.findIndex(m => m.id === userMessage.id);
            
            if (lastUserMessageIndex !== -1) {
              updated[lastUserMessageIndex] = {
                ...updated[lastUserMessageIndex],
                feedback: suggestionResult.feedback
              };
            }
            
            return updated;
          });
        }
        
      } catch (err) {
        console.error('Erro ao processar resposta:', err);
      } finally {
        setIsTyping(false);
        
        // Se não estiver pausado, avançar para a próxima pergunta após um delay
        if (!pauseAfterQuestion) {
          setTimeout(() => {
            continueInterview();
          }, 2000);
        }
      }
    }
  }
  
  // Rolar para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Função para continuar a entrevista após pausa
  const continueInterview = () => {
    if (isInterviewActive && !isRecording) {
      startRecording();
    }
  };
  
  // Função para pular a pergunta atual
  const skipQuestion = () => {
    if (isInterviewActive) {
      stopRecording();
      
      // Adicionar resposta de "pulou a pergunta"
      const skipMessage: Message = {
        id: `skip-${Date.now()}`,
        sender: 'user',
        content: '(Pergunta pulada)',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, skipMessage]);
      
      // Ir para a próxima pergunta
      setTimeout(() => {
        askNextQuestion();
      }, 500);
    }
  };
  
  // Função para baixar o histórico da entrevista
  const downloadInterviewHistory = () => {
    const interviewText = messages
      .map(msg => {
        const header = `[${msg.timestamp.toLocaleTimeString()}] ${msg.sender === 'assistant' ? 'Entrevistador' : 'Você'}:\n`;
        const content = msg.content;
        const feedback = msg.feedback ? `\n\nFeedback:\n${msg.feedback.join('\n')}` : '';
        return header + content + feedback + '\n';
      })
      .join('\n');
    
    const blob = new Blob([interviewText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entrevista-simulada-${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Entrevista exportada',
      description: 'O histórico da entrevista foi exportado com sucesso.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Função para renderizar uma mensagem
  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const bgColor = isUser ? messageBgUser : messageBgAssistant;
    
    return (
      <Box
        key={message.id}
        alignSelf={isUser ? 'flex-end' : 'flex-start'}
        maxW={{ base: '90%', md: '70%' }}
        bg={bgColor}
        p={3}
        borderRadius="md"
        mb={4}
        position="relative"
      >
        <HStack mb={2} align="center">
          <Avatar 
            size="xs" 
            name={isUser ? 'Você' : 'Entrevistador'} 
            src={isUser ? undefined : '/images/ai-interviewer.png'}
          >
            {isUser && <AvatarBadge boxSize="1em" bg="green.500" />}
          </Avatar>
          <Text fontWeight="bold" fontSize="sm">
            {isUser ? 'Você' : 'Entrevistador'}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {message.timestamp.toLocaleTimeString()}
          </Text>
        </HStack>
        
        <Text whiteSpace="pre-wrap">{message.content}</Text>
        
        {isUser && message.feedback && feedbackVisible && (
          <Box mt={3} p={2} bg="yellow.50" borderRadius="sm" borderLeftWidth="3px" borderLeftColor="yellow.400">
            <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.700">
              <Icon as={FiInfo} mr={1} /> Feedback da resposta:
            </Text>
            <VStack align="stretch" spacing={1}>
              {message.feedback.map((item, index) => (
                <Text key={index} fontSize="xs" color="gray.700">
                  • {item}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </Box>
    );
  };
  
  // Calcular progresso da entrevista
  const progressPercentage = currentTemplate 
    ? Math.min(100, Math.floor((currentQuestionIndex / currentTemplate.questions.length) * 100))
    : 0;
  
  return (
    <>
      <Head>
        <title>Assistente Virtual - InViewAI</title>
        <meta name="description" content="Pratique entrevistas com nosso assistente virtual" />
      </Head>
      
      <DashboardLayout pageTitle="Assistente Virtual de Entrevista">
        <Box py={4}>
          {/* Setup da entrevista ou interface da entrevista */}
          {!isInterviewActive ? (
            <Card bg={cardBg}>
              <CardHeader pb={0}>
                <Heading size="md">Configurar Nova Entrevista</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                  <GridItem>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>Template de Entrevista</FormLabel>
                        <Select 
                          placeholder="Selecione um template" 
                          value={selectedTemplate}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                        >
                          {templates.map(template => (
                            <option key={template.id} value={template.id}>
                              {template.name} ({template.difficulty})
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {selectedTemplate && (
                        <Box p={3} borderWidth="1px" borderRadius="md" borderColor="gray.200">
                          <Text fontWeight="medium" mb={1}>
                            {templates.find(t => t.id === selectedTemplate)?.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={2}>
                            {templates.find(t => t.id === selectedTemplate)?.description}
                          </Text>
                          <HStack>
                            <Badge>
                              {templates.find(t => t.id === selectedTemplate)?.category}
                            </Badge>
                            <Badge colorScheme={
                              templates.find(t => t.id === selectedTemplate)?.difficulty === 'Fácil' 
                                ? 'green' 
                                : templates.find(t => t.id === selectedTemplate)?.difficulty === 'Médio'
                                  ? 'yellow'
                                  : 'red'
                            }>
                              {templates.find(t => t.id === selectedTemplate)?.difficulty}
                            </Badge>
                            <Badge colorScheme="blue">
                              {templates.find(t => t.id === selectedTemplate)?.questions.length} perguntas
                            </Badge>
                          </HStack>
                        </Box>
                      )}
                      
                      <HStack>
                        <FormControl>
                          <FormLabel>Cargo</FormLabel>
                          <Input 
                            placeholder="Ex: Desenvolvedor Full Stack" 
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Empresa</FormLabel>
                          <Input 
                            placeholder="Ex: TechBrasil" 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </FormControl>
                      </HStack>
                      
                      <FormControl display="flex" alignItems="center" mb={2}>
                        <Switch 
                          id="pause-after-question" 
                          colorScheme="brand" 
                          isChecked={pauseAfterQuestion}
                          onChange={(e) => setPauseAfterQuestion(e.target.checked)}
                        />
                        <FormLabel htmlFor="pause-after-question" mb="0" ml={3}>
                          Pausar após cada pergunta (controle manual)
                        </FormLabel>
                      </FormControl>
                    </VStack>
                  </GridItem>
                  
                  <GridItem>
                    <VStack spacing={4} align="stretch" h="full">
                      <Box>
                        <Text fontWeight="medium" mb={2}>Como funciona:</Text>
                        <Text fontSize="sm">
                          1. Selecione um template de entrevista de acordo com sua área de interesse.
                        </Text>
                        <Text fontSize="sm">
                          2. Opcionalmente, informe o cargo e a empresa para personalizar a experiência.
                        </Text>
                        <Text fontSize="sm">
                          3. Quando estiver pronto, clique em "Iniciar Entrevista" e responda às perguntas como se estivesse em uma entrevista real.
                        </Text>
                        <Text fontSize="sm">
                          4. O assistente virtual irá ouvir suas respostas e fornecer feedback.
                        </Text>
                        <Text fontSize="sm">
                          5. Ao final, você poderá revisar suas respostas e o feedback recebido.
                        </Text>
                      </Box>
                      
                      <Divider />
                      
                      <Box>
                        <Text fontWeight="medium" mb={2}>Dicas para uma boa prática:</Text>
                        <Text fontSize="sm">
                          • Esteja em um ambiente tranquilo e sem ruídos.
                        </Text>
                        <Text fontSize="sm">
                          • Responda da maneira mais natural possível, como faria em uma entrevista real.
                        </Text>
                        <Text fontSize="sm">
                          • Reflita sobre o feedback recebido para melhorar em futuras entrevistas.
                        </Text>
                      </Box>
                      
                      <Box flexGrow={1} />
                      
                      <Button 
                        colorScheme="brand" 
                        size="lg" 
                        leftIcon={<FiPlay />}
                        onClick={startInterview}
                        isDisabled={!selectedTemplate}
                      >
                        Iniciar Entrevista
                      </Button>
                    </VStack>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          ) : (
            <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={4}>
              <GridItem>
                <Card bg={cardBg} height="75vh" display="flex" flexDirection="column">
                  <CardHeader pb={0}>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">
                        Entrevista Simulada {jobTitle && `- ${jobTitle}`} {companyName && `(${companyName})`}
                      </Heading>
                      <HStack>
                        <Tooltip label={feedbackVisible ? 'Ocultar feedback' : 'Mostrar feedback'}>
                          <IconButton
                            aria-label="Alternar feedback"
                            icon={<FiInfo />}
                            variant="ghost"
                            colorScheme={feedbackVisible ? 'blue' : 'gray'}
                            onClick={() => setFeedbackVisible(!feedbackVisible)}
                          />
                        </Tooltip>
                        <Tooltip label="Baixar entrevista">
                          <IconButton
                            aria-label="Baixar entrevista"
                            icon={<FiDownload />}
                            variant="ghost"
                            onClick={downloadInterviewHistory}
                          />
                        </Tooltip>
                      </HStack>
                    </Flex>
                    
                    {currentTemplate && (
                      <Box mt={3}>
                        <Progress 
                          value={progressPercentage} 
                          colorScheme="brand" 
                          size="sm" 
                          borderRadius="full"
                        />
                        <Flex justify="space-between" mt={1}>
                          <Text fontSize="sm" color="gray.500">
                            Progresso: {currentQuestionIndex - 1}/{currentTemplate.questions.length} perguntas
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {progressPercentage}%
                          </Text>
                        </Flex>
                      </Box>
                    )}
                  </CardHeader>
                  
                  <CardBody overflowY="auto" flex="1" py={4} px={2}>
                    <VStack spacing={4} align="stretch">
                      {messages.map((message) => renderMessage(message))}
                      
                      {isTyping && (
                        <Box 
                          alignSelf="flex-start" 
                          maxW={{ base: '90%', md: '70%' }} 
                          bg={messageBgAssistant} 
                          p={3} 
                          borderRadius="md"
                        >
                          <HStack mb={2}>
                            <Avatar size="xs" name="Entrevistador" src="/images/ai-interviewer.png" />
                            <Text fontWeight="bold" fontSize="sm">Entrevistador</Text>
                          </HStack>
                          <Text>Digitando<span className="typing-animation">...</span></Text>
                        </Box>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </VStack>
                  </CardBody>
                  
                  <Box p={4} borderTopWidth="1px" borderColor="gray.200">
                    <HStack spacing={3}>
                      <Tooltip label={isRecording ? 'Parar de gravar' : 'Começar a gravar'}>
                        <IconButton
                          aria-label={isRecording ? 'Parar de gravar' : 'Começar a gravar'}
                          icon={isRecording ? <FiMicOff /> : <FiMic />}
                          colorScheme={isRecording ? 'red' : 'brand'}
                          isRound
                          size="lg"
                          isLoading={isProcessing}
                          onClick={isRecording ? stopRecording : continueInterview}
                          isDisabled={!isInterviewActive || isTyping}
                        />
                      </Tooltip>
                      
                      <Tooltip label="Pular pergunta">
                        <IconButton
                          aria-label="Pular pergunta"
                          icon={<FiSkipForward />}
                          variant="outline"
                          onClick={skipQuestion}
                          isDisabled={!isInterviewActive || isTyping || isRecording}
                        />
                      </Tooltip>
                      
                      <Button
                        colorScheme="red"
                        variant="outline"
                        ml="auto"
                        onClick={endInterview}
                      >
                        Finalizar Entrevista
                      </Button>
                    </HStack>
                    
                    {isRecording && (
                      <Box mt={2} p={1} bg="red.50" borderRadius="md" textAlign="center">
                        <Text fontSize="sm" color="red.500">
                          <Icon as={FiMic} mr={1} /> Gravando... Fale sua resposta naturalmente.
                        </Text>
                      </Box>
                    )}
                    
                    {pauseAfterQuestion && !isRecording && !isTyping && isInterviewActive && (
                      <Box mt={2} p={1} bg="yellow.50" borderRadius="md" textAlign="center">
                        <Text fontSize="sm" color="yellow.700">
                          <Icon as={FiInfo} mr={1} /> Clique no botão do microfone quando estiver pronto para responder.
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Card>
              </GridItem>
              
              <GridItem display={{ base: 'none', lg: 'block' }}>
                <Card bg={cardBg} height="75vh">
                  <CardHeader pb={0}>
                    <Heading size="md">Informações</Heading>
                  </CardHeader>
                  
                  <CardBody>
                    <Tabs variant="soft-rounded" colorScheme="brand" size="sm" isFitted>
                      <TabList mb={4}>
                        <Tab>Dicas</Tab>
                        <Tab>Estatísticas</Tab>
                      </TabList>
                      
                      <TabPanels>
                        <TabPanel px={0}>
                          <VStack align="stretch" spacing={3}>
                            <Box p={3} bg="blue.50" borderRadius="md">
                              <Text fontWeight="bold" fontSize="sm" mb={1}>
                                <Icon as={FiInfo} mr={1} /> Estrutura STAR
                              </Text>
                              <Text fontSize="xs">
                                Para responder perguntas comportamentais, use a estrutura STAR:
                                <br />
                                <strong>S</strong>ituação - Descreva o contexto
                                <br />
                                <strong>T</strong>arefa - Explique seu papel
                                <br />
                                <strong>A</strong>ção - Detalhe o que você fez
                                <br />
                                <strong>R</strong>esultado - Compartilhe o impacto
                              </Text>
                            </Box>
                            
                            <Box p={3} bg="green.50" borderRadius="md">
                              <Text fontWeight="bold" fontSize="sm" mb={1}>
                                <Icon as={FiThumbsUp} mr={1} /> O que fazer
                              </Text>
                              <Text fontSize="xs">
                                • Forneça exemplos concretos
                                <br />
                                • Quantifique resultados quando possível
                                <br />
                                • Fale com clareza e objetividade
                                <br />
                                • Demonstre autenticidade
                                <br />
                                • Conecte suas respostas ao cargo
                              </Text>
                            </Box>
                            
                            <Box p={3} bg="red.50" borderRadius="md">
                              <Text fontWeight="bold" fontSize="sm" mb={1}>
                                <Icon as={FiThumbsDown} mr={1} /> O que evitar
                              </Text>
                              <Text fontSize="xs">
                                • Respostas vagas ou genéricas
                                <br />
                                • Criticar empregos ou chefes anteriores
                                <br />
                                • Exagerar qualificações
                                <br />
                                • Usar muitas muletas linguísticas
                                <br />
                                • Respostas muito longas ou curtas demais
                              </Text>
                            </Box>
                          </VStack>
                        </TabPanel>
                        
                        <TabPanel px={0}>
                          <VStack align="stretch" spacing={3}>
                            <Box p={3} borderWidth="1px" borderRadius="md">
                              <Text fontSize="sm" fontWeight="medium" mb={2}>
                                Entrevista atual
                              </Text>
                              <Grid templateColumns="1fr 1fr" gap={2}>
                                <Box>
                                  <Text fontSize="xs" color="gray.500">Perguntas</Text>
                                  <Text fontWeight="bold">
                                    {Math.max(0, currentQuestionIndex - 1)} / {currentTemplate?.questions.length || 0}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" color="gray.500">Duração</Text>
                                  <Text fontWeight="bold">
                                    {Math.floor(messages.length * 1.5)} min
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" color="gray.500">Mensagens</Text>
                                  <Text fontWeight="bold">{messages.length}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="xs" color="gray.500">Feedback</Text>
                                  <Text fontWeight="bold">
                                    {messages.filter(m => m.feedback && m.feedback.length > 0).length}
                                  </Text>
                                </Box>
                              </Grid>
                            </Box>
                            
                            <Box p={3} borderWidth="1px" borderRadius="md">
                              <Text fontSize="sm" fontWeight="medium" mb={2}>
                                Suas estatísticas gerais
                              </Text>
                              <VStack align="stretch" spacing={1}>
                                <HStack justify="space-between">
                                  <Text fontSize="xs">Entrevistas completadas</Text>
                                  <Text fontSize="xs" fontWeight="bold">12</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="xs">Tempo médio por resposta</Text>
                                  <Text fontSize="xs" fontWeight="bold">1m 23s</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="xs">Pontuação média</Text>
                                  <Text fontSize="xs" fontWeight="bold">78/100</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="xs">Área mais forte</Text>
                                  <Text fontSize="xs" fontWeight="bold">Técnica</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="xs">Área para melhorar</Text>
                                  <Text fontSize="xs" fontWeight="bold">Comunicação</Text>
                                </HStack>
                              </VStack>
                            </Box>
                          </VStack>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          )}
        </Box>
      </DashboardLayout>
    </>
  );
} 