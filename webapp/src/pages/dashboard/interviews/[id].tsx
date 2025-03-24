import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Badge,
  VStack,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tag,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FiClock, FiCalendar, FiFileText, FiBarChart2, 
  FiArrowLeft, FiDownload, FiShare2, FiPrinter,
  FiMic, FiVideo, FiEdit, FiMessageSquare
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Tipos
type InterviewStatus = 'completed' | 'scheduled' | 'cancelled';

interface Interview {
  id: string;
  company: string;
  position: string;
  date: string;
  duration: number;
  score?: number;
  status: InterviewStatus;
  type: string;
  notes?: string;
  feedback?: string;
}

interface Metric {
  name: string;
  value: number;
  category: string;
  feedback?: string;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  timeSpent: number;
  score: number;
  feedback: string;
}

interface Feedback {
  id: string;
  type: 'strength' | 'improvement' | 'suggestion';
  content: string;
}

export default function InterviewDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [interview, setInterview] = useState<Interview | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cores para status
  const getStatusColor = (status: InterviewStatus) => {
    switch (status) {
      case 'completed': return 'green';
      case 'scheduled': return 'blue';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };
  
  // Tradução de status
  const getStatusText = (status: InterviewStatus) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'scheduled': return 'Agendada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };
  
  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Formatação de hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Carregar dados da entrevista
  useEffect(() => {
    if (id) {
      // Simulação de carregamento de dados
      setTimeout(() => {
        // Dados de exemplo para uma entrevista específica
        const mockInterview: Interview = {
          id: id as string,
          company: 'TechBrasil',
          position: 'Desenvolvedor Full Stack',
          date: '2023-05-15T14:00:00Z',
          duration: 60,
          score: 85,
          status: 'completed',
          type: 'Técnica',
          feedback: 'Demonstrou bom conhecimento técnico, mas poderia melhorar em arquitetura de sistemas.'
        };
        
        // Métricas de exemplo
        const mockMetrics: Metric[] = [
          { name: 'Conhecimento Técnico', value: 88, category: 'Técnico', feedback: 'Demonstrou excelente conhecimento em React e Node.js.' },
          { name: 'Resolução de Problemas', value: 82, category: 'Técnico', feedback: 'Abordagem estruturada, mas poderia explorar mais alternativas.' },
          { name: 'Arquitetura de Software', value: 75, category: 'Técnico', feedback: 'Precisa aprofundar conhecimentos em padrões de projeto.' },
          { name: 'Comunicação', value: 90, category: 'Comportamental', feedback: 'Explicou conceitos complexos de forma clara e concisa.' },
          { name: 'Foco nas Respostas', value: 85, category: 'Comportamental', feedback: 'Respostas objetivas e relevantes.' },
          { name: 'Linguagem Corporal', value: 78, category: 'Comportamental', feedback: 'Manteve bom contato visual, mas apresentou alguma tensão.' },
          { name: 'Raciocínio Lógico', value: 87, category: 'Analítico', feedback: 'Demonstrou boa capacidade analítica.' },
          { name: 'Qualidade das Respostas', value: 84, category: 'Analítico', feedback: 'Respostas bem estruturadas, mas poderia fornecer mais exemplos práticos.' }
        ];
        
        // Perguntas e respostas de exemplo
        const mockQuestions: Question[] = [
          {
            id: '1',
            question: 'Explique como você implementaria um sistema de autenticação seguro em uma aplicação web.',
            answer: 'Eu utilizaria JWT para gerenciar tokens, implementaria refresh tokens para segurança, armazenaria senhas com hash usando bcrypt, e utilizaria HTTPS para todas as comunicações. Também implementaria autenticação em duas etapas e limitaria tentativas de login para prevenir ataques de força bruta.',
            timeSpent: 120,
            score: 90,
            feedback: 'Resposta completa abordando diversos aspectos de segurança. Poderia ter mencionado CSRF e XSS.'
          },
          {
            id: '2',
            question: 'Como você lidaria com um banco de dados que precisa ser escalado para suportar milhões de usuários?',
            answer: 'Eu implementaria sharding para distribuir os dados, utilizaria caching com Redis para reduzir a carga no banco, criaria índices eficientes, e otimizaria consultas. Para escalabilidade, também consideraria uma arquitetura de microserviços com bancos de dados dedicados para diferentes domínios.',
            timeSpent: 135,
            score: 85,
            feedback: 'Boa resposta sobre escalabilidade horizontal e vertical. Poderia ter explorado mais sobre replicação.'
          },
          {
            id: '3',
            question: 'Descreva um projeto desafiador em que você trabalhou e como você superou os obstáculos.',
            answer: 'Trabalhei em um sistema de processamento de pagamentos que precisava processar 10.000 transações por minuto. O principal desafio foi manter a consistência e performance. Implementei uma arquitetura baseada em filas com RabbitMQ, criamos um sistema de retry com backoff exponencial, e utilizamos cache distribuído para informações recorrentes. Também implementamos monitoramento extensivo para identificar gargalos.',
            timeSpent: 180,
            score: 92,
            feedback: 'Excelente resposta com detalhes concretos e soluções específicas.'
          },
          {
            id: '4',
            question: 'Quais são as diferenças entre REST e GraphQL? Quando você usaria cada um?',
            answer: 'REST é baseado em endpoints que retornam dados pré-definidos, enquanto GraphQL permite ao cliente especificar exatamente quais dados deseja receber. Usaria REST para APIs simples e quando o consumo de dados é previsível. GraphQL é mais vantajoso para aplicações complexas onde diferentes clientes precisam de dados diferentes, reduzindo overfetching e underfetching de dados.',
            timeSpent: 95,
            score: 80,
            feedback: 'Boa comparação. Poderia ter mencionado considerações de cache e versionamento.'
          }
        ];
        
        // Feedback de exemplo
        const mockFeedback: Feedback[] = [
          { id: '1', type: 'strength', content: 'Conhecimento técnico sólido em React, Node.js e arquiteturas front-end.' },
          { id: '2', type: 'strength', content: 'Excelente capacidade de comunicação e explicação de conceitos complexos.' },
          { id: '3', type: 'improvement', content: 'Poderia aprofundar conhecimentos em arquitetura de sistemas distribuídos.' },
          { id: '4', type: 'improvement', content: 'Algumas respostas poderiam incluir mais exemplos práticos de projetos anteriores.' },
          { id: '5', type: 'suggestion', content: 'Recomendamos estudar mais sobre padrões de design e microserviços.' },
          { id: '6', type: 'suggestion', content: 'Participar de projetos open-source poderia enriquecer seu portfólio.' }
        ];
        
        setInterview(mockInterview);
        setMetrics(mockMetrics);
        setQuestions(mockQuestions);
        setFeedback(mockFeedback);
        setIsLoading(false);
      }, 1000);
    }
  }, [id]);
  
  if (isLoading || !interview) {
    return (
      <DashboardLayout pageTitle="Carregando...">
        <VStack spacing={4} align="stretch">
          <Text>Carregando dados da entrevista...</Text>
        </VStack>
      </DashboardLayout>
    );
  }
  
  // Calcular média global e por categoria
  const overallScore = metrics.reduce((acc, metric) => acc + metric.value, 0) / metrics.length;
  
  const categoryScores = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = { total: 0, count: 0 };
    }
    acc[metric.category].total += metric.value;
    acc[metric.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);
  
  const averageByCategory = Object.entries(categoryScores).map(([category, { total, count }]) => ({
    category,
    average: Math.round(total / count)
  }));
  
  return (
    <>
      <Head>
        <title>{`Entrevista: ${interview.company} - ${interview.position}`}</title>
        <meta name="description" content={`Detalhes da entrevista para ${interview.position} na ${interview.company}`} />
      </Head>
      
      <DashboardLayout pageTitle="Detalhes da Entrevista">
        <Stack spacing={6}>
          {/* Cabeçalho com informações básicas e ações */}
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            align={{ base: 'flex-start', md: 'center' }}
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            borderRadius="lg"
            shadow="sm"
          >
            <HStack spacing={4} mb={{ base: 4, md: 0 }}>
              <IconButton
                aria-label="Voltar"
                icon={<FiArrowLeft />}
                variant="ghost"
                onClick={() => router.push('/dashboard/interviews')}
              />
              <Box>
                <Heading size="md">{interview.company}</Heading>
                <Text color="gray.600">{interview.position}</Text>
              </Box>
            </HStack>
            
            <HStack spacing={4}>
              <Badge 
                colorScheme={getStatusColor(interview.status)}
                px={3}
                py={2}
                borderRadius="full"
                fontSize="sm"
              >
                {getStatusText(interview.status)}
              </Badge>
              
              <Tooltip label="Baixar relatório PDF">
                <IconButton
                  aria-label="Baixar relatório"
                  icon={<FiDownload />}
                  variant="ghost"
                  onClick={() => alert('Download de relatório iniciado')}
                />
              </Tooltip>
              
              <Tooltip label="Compartilhar">
                <IconButton
                  aria-label="Compartilhar"
                  icon={<FiShare2 />}
                  variant="ghost"
                  onClick={() => alert('Abrir modal de compartilhamento')}
                />
              </Tooltip>
              
              <Tooltip label="Imprimir">
                <IconButton
                  aria-label="Imprimir"
                  icon={<FiPrinter />}
                  variant="ghost"
                  onClick={() => window.print()}
                />
              </Tooltip>
            </HStack>
          </Flex>
          
          {/* Detalhes e resumo da entrevista */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={6}>
            {/* Coluna de informações gerais */}
            <GridItem>
              <Card>
                <CardHeader>
                  <Heading size="md">Informações da Entrevista</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack>
                      <FiCalendar />
                      <Text fontWeight="medium">Data:</Text>
                      <Text>{formatDate(interview.date)}</Text>
                    </HStack>
                    
                    <HStack>
                      <FiClock />
                      <Text fontWeight="medium">Hora:</Text>
                      <Text>{formatTime(interview.date)}</Text>
                    </HStack>
                    
                    <HStack>
                      <FiClock />
                      <Text fontWeight="medium">Duração:</Text>
                      <Text>{interview.duration} minutos</Text>
                    </HStack>
                    
                    <HStack>
                      <FiFileText />
                      <Text fontWeight="medium">Tipo:</Text>
                      <Tag colorScheme={interview.type === 'Técnica' ? 'purple' : 'orange'}>
                        {interview.type}
                      </Tag>
                    </HStack>
                    
                    {interview.notes && (
                      <Box>
                        <Text fontWeight="medium" mb={2}>Anotações:</Text>
                        <Text bg={useColorModeValue('gray.50', 'gray.700')} p={3} borderRadius="md">
                          {interview.notes}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </CardBody>
              </Card>
              
              {/* Pontuação Geral */}
              <Card mt={6}>
                <CardHeader>
                  <Heading size="md">Pontuação Geral</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    {interview.score ? (
                      <>
                        <Box textAlign="center">
                          <Text fontSize="sm" color="gray.500">Pontuação Total</Text>
                          <Heading 
                            size="xl" 
                            color={
                              interview.score >= 85 ? 'green.500' : 
                              interview.score >= 70 ? 'yellow.500' : 'red.500'
                            }
                          >
                            {interview.score}%
                          </Heading>
                          <Progress 
                            value={interview.score} 
                            colorScheme={
                              interview.score >= 85 ? 'green' : 
                              interview.score >= 70 ? 'yellow' : 'red'
                            }
                            size="lg"
                            borderRadius="md"
                            mt={2}
                          />
                        </Box>
                        
                        <Divider />
                        
                        {/* Pontuação por categoria */}
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={3}>Por Categoria</Text>
                          <Stack spacing={4}>
                            {averageByCategory.map((cat) => (
                              <Box key={cat.category}>
                                <Flex justify="space-between" mb={1}>
                                  <Text fontSize="sm">{cat.category}</Text>
                                  <Text 
                                    fontSize="sm" 
                                    fontWeight="bold"
                                    color={
                                      cat.average >= 85 ? 'green.500' : 
                                      cat.average >= 70 ? 'yellow.500' : 'red.500'
                                    }
                                  >
                                    {cat.average}%
                                  </Text>
                                </Flex>
                                <Progress 
                                  value={cat.average} 
                                  colorScheme={
                                    cat.average >= 85 ? 'green' : 
                                    cat.average >= 70 ? 'yellow' : 'red'
                                  }
                                  size="sm"
                                  borderRadius="md"
                                />
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      </>
                    ) : (
                      <Alert status="info">
                        <AlertIcon />
                        <AlertDescription>Esta entrevista ainda não possui pontuação.</AlertDescription>
                      </Alert>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
            
            {/* Coluna de conteúdo principal */}
            <GridItem>
              <Card>
                <CardBody p={0}>
                  <Tabs colorScheme="brand" isLazy>
                    <TabList px={6} pt={4}>
                      <Tab><Box as={FiBarChart2} mr={2} /> Métricas</Tab>
                      <Tab><Box as={FiMessageSquare} mr={2} /> Perguntas</Tab>
                      <Tab><Box as={FiFileText} mr={2} /> Feedback</Tab>
                    </TabList>
                    
                    <TabPanels>
                      {/* Painel de Métricas */}
                      <TabPanel>
                        <Stack spacing={6}>
                          {metrics.length > 0 ? metrics.map((metric) => (
                            <Box key={metric.name} p={4} borderWidth="1px" borderRadius="md">
                              <Flex justify="space-between" mb={2}>
                                <Box>
                                  <Text fontWeight="bold">{metric.name}</Text>
                                  <Tag size="sm" colorScheme="gray" mt={1}>{metric.category}</Tag>
                                </Box>
                                <Text 
                                  fontWeight="bold" 
                                  fontSize="xl"
                                  color={
                                    metric.value >= 85 ? 'green.500' : 
                                    metric.value >= 70 ? 'yellow.500' : 'red.500'
                                  }
                                >
                                  {metric.value}%
                                </Text>
                              </Flex>
                              <Progress 
                                value={metric.value} 
                                colorScheme={
                                  metric.value >= 85 ? 'green' : 
                                  metric.value >= 70 ? 'yellow' : 'red'
                                }
                                size="sm"
                                borderRadius="md"
                                mb={3}
                              />
                              {metric.feedback && (
                                <Text fontSize="sm" color="gray.600">{metric.feedback}</Text>
                              )}
                            </Box>
                          )) : (
                            <Alert status="info">
                              <AlertIcon />
                              <AlertDescription>Não há métricas disponíveis para esta entrevista.</AlertDescription>
                            </Alert>
                          )}
                        </Stack>
                      </TabPanel>
                      
                      {/* Painel de Perguntas e Respostas */}
                      <TabPanel>
                        <Stack spacing={6}>
                          {questions.length > 0 ? questions.map((q, index) => (
                            <Box key={q.id} p={4} borderWidth="1px" borderRadius="md">
                              <Flex justify="space-between" mb={2}>
                                <Text fontWeight="bold" fontSize="md">Pergunta {index + 1}</Text>
                                <HStack>
                                  <Tag size="sm" colorScheme="gray">
                                    <Box as={FiClock} mr={1} />
                                    {q.timeSpent}s
                                  </Tag>
                                  <Tag 
                                    size="sm" 
                                    colorScheme={
                                      q.score >= 85 ? 'green' : 
                                      q.score >= 70 ? 'yellow' : 'red'
                                    }
                                  >
                                    {q.score}%
                                  </Tag>
                                </HStack>
                              </Flex>
                              
                              <Text fontWeight="medium" mb={3}>{q.question}</Text>
                              
                              <Box bg={useColorModeValue('gray.50', 'gray.700')} p={3} borderRadius="md" mb={3}>
                                <HStack mb={2}>
                                  <FiMic />
                                  <Text fontWeight="medium">Sua Resposta:</Text>
                                </HStack>
                                <Text>{q.answer}</Text>
                              </Box>
                              
                              <Box bg={useColorModeValue('blue.50', 'blue.900')} p={3} borderRadius="md">
                                <HStack mb={2}>
                                  <FiEdit />
                                  <Text fontWeight="medium">Feedback:</Text>
                                </HStack>
                                <Text>{q.feedback}</Text>
                              </Box>
                            </Box>
                          )) : (
                            <Alert status="info">
                              <AlertIcon />
                              <AlertDescription>Não há perguntas registradas para esta entrevista.</AlertDescription>
                            </Alert>
                          )}
                        </Stack>
                      </TabPanel>
                      
                      {/* Painel de Feedback Geral */}
                      <TabPanel>
                        <Stack spacing={6}>
                          {/* Feedback geral */}
                          {interview.feedback && (
                            <Box p={4} borderWidth="1px" borderRadius="md">
                              <Text fontWeight="bold" mb={3}>Resumo Geral</Text>
                              <Text>{interview.feedback}</Text>
                            </Box>
                          )}
                          
                          {/* Pontos fortes */}
                          <Box>
                            <Heading size="sm" mb={3}>Pontos Fortes</Heading>
                            <Stack spacing={3}>
                              {feedback
                                .filter(item => item.type === 'strength')
                                .map(item => (
                                  <Alert key={item.id} status="success" variant="left-accent" borderRadius="md">
                                    <AlertIcon />
                                    <AlertDescription>{item.content}</AlertDescription>
                                  </Alert>
                                ))}
                            </Stack>
                          </Box>
                          
                          {/* Áreas de melhoria */}
                          <Box>
                            <Heading size="sm" mb={3}>Áreas de Melhoria</Heading>
                            <Stack spacing={3}>
                              {feedback
                                .filter(item => item.type === 'improvement')
                                .map(item => (
                                  <Alert key={item.id} status="warning" variant="left-accent" borderRadius="md">
                                    <AlertIcon />
                                    <AlertDescription>{item.content}</AlertDescription>
                                  </Alert>
                                ))}
                            </Stack>
                          </Box>
                          
                          {/* Sugestões */}
                          <Box>
                            <Heading size="sm" mb={3}>Sugestões</Heading>
                            <Stack spacing={3}>
                              {feedback
                                .filter(item => item.type === 'suggestion')
                                .map(item => (
                                  <Alert key={item.id} status="info" variant="left-accent" borderRadius="md">
                                    <AlertIcon />
                                    <AlertDescription>{item.content}</AlertDescription>
                                  </Alert>
                                ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </Stack>
      </DashboardLayout>
    </>
  );
} 