import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Flex,
  Badge,
  Progress,
} from '@chakra-ui/react';
import {
  FiUser,
  FiVideo,
  FiMic,
  FiMessageSquare,
  FiBook,
  FiTrello,
  FiAward,
  FiActivity,
  FiArrowRight,
  FiLock,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Componente para card de prática
interface PracticeCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  imageSrc?: string;
  href: string;
  isPremium?: boolean;
  isNew?: boolean;
  completion?: number;
}

const PracticeCard = ({ 
  title, 
  description, 
  icon, 
  imageSrc, 
  href, 
  isPremium = false, 
  isNew = false,
  completion
}: PracticeCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card 
      bg={cardBg} 
      borderWidth="1px" 
      borderColor={borderColor} 
      borderRadius="lg" 
      overflow="hidden" 
      transition="all 0.3s"
      _hover={{ 
        transform: 'translateY(-4px)', 
        shadow: 'md',
        borderColor: 'brand.500' 
      }}
      height="100%"
    >
      {imageSrc && (
        <Box position="relative">
          <Image src={imageSrc} alt={title} height="140px" width="100%" objectFit="cover" />
          {isPremium && (
            <Badge 
              position="absolute" 
              top="8px" 
              right="8px" 
              colorScheme="yellow" 
              fontSize="0.8em"
              px={2}
              py={1}
              borderRadius="md"
            >
              Premium
            </Badge>
          )}
          {isNew && (
            <Badge 
              position="absolute" 
              top="8px" 
              left="8px" 
              colorScheme="green" 
              fontSize="0.8em"
              px={2}
              py={1}
              borderRadius="md"
            >
              Novo
            </Badge>
          )}
        </Box>
      )}
      
      <CardHeader pb={2}>
        <Flex align="center" mb={2}>
          <Icon as={icon} boxSize={6} color="brand.500" mr={2} />
          <Heading size="md">{title}</Heading>
        </Flex>
      </CardHeader>
      
      <CardBody pt={0}>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
          {description}
        </Text>
        
        {completion !== undefined && (
          <Box mt={4}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="xs" color="gray.500">Progresso</Text>
              <Text fontSize="xs" fontWeight="bold">{completion}%</Text>
            </Flex>
            <Progress value={completion} size="sm" colorScheme="brand" borderRadius="full" />
          </Box>
        )}
      </CardBody>
      
      <CardFooter pt={0}>
        <NextLink href={href} passHref legacyBehavior>
          <Button 
            as="a" 
            rightIcon={<FiArrowRight />} 
            colorScheme="brand" 
            variant="outline" 
            size="sm" 
            width="full"
            isDisabled={isPremium}
          >
            {isPremium ? 'Disponível no Plano Premium' : 'Iniciar Prática'}
          </Button>
        </NextLink>
      </CardFooter>
    </Card>
  );
};

// Dados para o card de estatísticas
const statsData = [
  { label: 'Práticas Completas', value: 7 },
  { label: 'Horas de Prática', value: '4.5' },
  { label: 'Pontuação Média', value: '76/100' },
  { label: 'Desafios Concluídos', value: 3 },
];

// Componente principal
export default function PracticePage() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gradientStart = useColorModeValue('brand.50', 'gray.700');
  const gradientEnd = useColorModeValue('white', 'gray.800');
  
  return (
    <>
      <Head>
        <title>Prática de Entrevistas - InViewAI</title>
        <meta name="description" content="Pratique para suas entrevistas com diversas ferramentas" />
      </Head>
      
      <DashboardLayout pageTitle="Prática de Entrevistas">
        <Box py={4}>
          {/* Header e estatísticas */}
          <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor} 
            borderRadius="lg" 
            overflow="hidden"
            mb={6}
          >
            <Box 
              bgGradient={`linear(to-r, ${gradientStart}, ${gradientEnd})`} 
              pt={8} 
              pb={12} 
              px={8}
              position="relative"
            >
              <Heading size="lg" mb={2}>Bem-vindo à sua área de prática</Heading>
              <Text fontSize="md" maxW="700px">
                Apriimore suas habilidades com práticas personalizadas, feedbacks em tempo real e análises 
                detalhadas que vão preparar você para se destacar em qualquer entrevista.
              </Text>
              
              <Box 
                position="absolute" 
                right="20px" 
                bottom="-30px"
                w="120px"
                h="120px"
                display={{ base: 'none', md: 'block' }}
              >
                <Image 
                  src="/images/practice-illustration.svg" 
                  alt="Practice" 
                  fallbackSrc="https://via.placeholder.com/120" 
                />
              </Box>
            </Box>
            
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} px={6} py={8}>
              {statsData.map((stat, index) => (
                <VStack key={index} align="flex-start" spacing={0}>
                  <Text fontSize="xs" color="gray.500">{stat.label}</Text>
                  <Text fontSize="2xl" fontWeight="bold">{stat.value}</Text>
                </VStack>
              ))}
            </SimpleGrid>
          </Card>
          
          {/* Cards de práticas */}
          <Heading size="md" mb={4}>Opções de Prática</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
            <PracticeCard
              title="Assistente Virtual de Entrevista"
              description="Pratique com nosso entrevistador virtual baseado em IA que simula entrevistas reais e fornece feedback em tempo real."
              icon={FiUser}
              imageSrc="/images/virtual-assistant.jpg"
              href="/dashboard/practice/virtual-assistant"
              isNew={true}
              completion={65}
            />
            
            <PracticeCard
              title="Perguntas Técnicas"
              description="Pratique com perguntas técnicas específicas para sua área, desde algoritmos até conhecimentos de framework."
              icon={FiBook}
              imageSrc="/images/technical-questions.jpg"
              href="/dashboard/practice/technical"
              completion={30}
            />
            
            <PracticeCard
              title="Perguntas Comportamentais"
              description="Aprimore suas respostas para perguntas comportamentais usando o método STAR e receba feedback detalhado."
              icon={FiMessageSquare}
              imageSrc="/images/behavioral-questions.jpg"
              href="/dashboard/practice/behavioral"
            />
            
            <PracticeCard
              title="Simulação em Vídeo"
              description="Grave respostas em vídeo e receba análise detalhada sobre sua comunicação verbal e não-verbal."
              icon={FiVideo}
              imageSrc="/images/video-simulation.jpg"
              href="/dashboard/practice/video"
              isPremium={true}
            />
            
            <PracticeCard
              title="Desafios Semanais"
              description="Participe de desafios semanais focados em tipos específicos de entrevistas e problemas comuns."
              icon={FiTrello}
              imageSrc="/images/weekly-challenges.jpg"
              href="/dashboard/practice/challenges"
            />
            
            <PracticeCard
              title="Análise de Voz e Discurso"
              description="Obtenha análises detalhadas sobre sua voz, dicção, ritmo e outros aspectos da comunicação verbal."
              icon={FiMic}
              imageSrc="/images/voice-analysis.jpg"
              href="/dashboard/practice/voice-analysis"
              isPremium={true}
            />
          </SimpleGrid>
          
          {/* Seção de plano de estudos */}
          <Heading size="md" mb={4}>Seu Plano de Estudos</Heading>
          
          <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor} 
            borderRadius="lg" 
            overflow="hidden"
            mb={6}
          >
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: '1fr 250px' }} gap={6}>
                <GridItem>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="sm" mb={2}>Próximas atividades recomendadas</Heading>
                    
                    <Box p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                      <Flex justify="space-between" align="center">
                        <Flex align="center">
                          <Icon as={FiUser} mr={3} color="blue.500" />
                          <Box>
                            <Text fontWeight="medium">Entrevista Comportamental Completa</Text>
                            <Text fontSize="sm" color="gray.500">15-20 minutos • Nível Intermediário</Text>
                          </Box>
                        </Flex>
                        <NextLink href="/dashboard/practice/virtual-assistant" passHref legacyBehavior>
                          <Button as="a" size="sm" colorScheme="brand" variant="ghost">
                            Iniciar
                          </Button>
                        </NextLink>
                      </Flex>
                    </Box>
                    
                    <Box p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                      <Flex justify="space-between" align="center">
                        <Flex align="center">
                          <Icon as={FiBook} mr={3} color="green.500" />
                          <Box>
                            <Text fontWeight="medium">Revisão de Algoritmos e Estruturas de Dados</Text>
                            <Text fontSize="sm" color="gray.500">10 perguntas • Nível Avançado</Text>
                          </Box>
                        </Flex>
                        <NextLink href="/dashboard/practice/technical" passHref legacyBehavior>
                          <Button as="a" size="sm" colorScheme="brand" variant="ghost">
                            Iniciar
                          </Button>
                        </NextLink>
                      </Flex>
                    </Box>
                    
                    <Box p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                      <Flex justify="space-between" align="center">
                        <Flex align="center">
                          <Icon as={FiActivity} mr={3} color="purple.500" />
                          <Box>
                            <Text fontWeight="medium">Desafio: Resolução de Problema em Tempo Real</Text>
                            <Text fontSize="sm" color="gray.500">30 minutos • Nível Desafiador</Text>
                          </Box>
                        </Flex>
                        <NextLink href="/dashboard/practice/challenges" passHref legacyBehavior>
                          <Button as="a" size="sm" colorScheme="brand" variant="ghost">
                            Iniciar
                          </Button>
                        </NextLink>
                      </Flex>
                    </Box>
                  </VStack>
                </GridItem>
                
                <GridItem>
                  <VStack align="stretch" spacing={4} height="100%">
                    <Heading size="sm" mb={2}>Suas Conquistas</Heading>
                    
                    <Flex 
                      direction="column" 
                      justify="center" 
                      align="center" 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      borderColor={borderColor}
                      height="100%"
                    >
                      <Icon as={FiAward} boxSize={12} color="yellow.500" mb={3} />
                      <Heading size="md" mb={1}>Nível 2</Heading>
                      <Text fontSize="sm" color="gray.500" mb={4} textAlign="center">
                        Entrevistador Iniciante
                      </Text>
                      
                      <Flex justify="space-between" w="100%" mb={2}>
                        <Text fontSize="xs">Próximo nível</Text>
                        <Text fontSize="xs" fontWeight="bold">60%</Text>
                      </Flex>
                      <Progress value={60} size="sm" colorScheme="yellow" w="100%" borderRadius="full" />
                      
                      <Button 
                        leftIcon={<FiLock />} 
                        size="sm" 
                        variant="outline" 
                        mt={4}
                        colorScheme="yellow"
                      >
                        Desbloquear Premium
                      </Button>
                    </Flex>
                  </VStack>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </Box>
      </DashboardLayout>
    </>
  );
} 