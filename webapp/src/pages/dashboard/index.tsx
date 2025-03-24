import React from 'react';
import Head from 'next/head';
import {
  Box,
  Grid,
  GridItem,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Icon,
  Flex,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AnalyticsSummary from '../../components/dashboard/AnalyticsSummary';
import RecentInterviews from '../../components/dashboard/RecentInterviews';
import { FiCalendar, FiClock, FiPlay, FiBarChart2 } from 'react-icons/fi';
import NextLink from 'next/link';

// Componente para próxima entrevista agendada
const NextInterview = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card 
      bg={cardBg} 
      borderWidth="1px" 
      borderColor={borderColor} 
      shadow="sm" 
      borderRadius="lg"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <CardHeader pb={0}>
        <Flex justify="space-between" align="center">
          <Heading size="md" fontWeight="semibold">Próxima Entrevista</Heading>
          <Icon as={FiCalendar} color="brand.500" boxSize={5} />
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" gap={3}>
          <Box>
            <Text fontWeight="bold" fontSize="lg">Consultoria ABC</Text>
            <Text color="gray.500">Analista de Dados</Text>
          </Box>
          
          <HStack>
            <Icon as={FiCalendar} color="gray.500" />
            <Text>15 de Novembro, 2023</Text>
          </HStack>
          
          <HStack>
            <Icon as={FiClock} color="gray.500" />
            <Text>14:00 - 15:00</Text>
          </HStack>
          
          <Box pt={2}>
            <Button
              as={NextLink}
              href="/dashboard/interviews/3"
              colorScheme="brand"
              size="sm"
              w="full"
              leftIcon={<FiPlay />}
              mt={2}
            >
              Preparar Agora
            </Button>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

// Componente para progresso de preparação
const PrepProgress = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card 
      bg={cardBg} 
      borderWidth="1px" 
      borderColor={borderColor} 
      shadow="sm" 
      borderRadius="lg"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <CardHeader pb={0}>
        <Flex justify="space-between" align="center">
          <Heading size="md" fontWeight="semibold">Progresso de Preparação</Heading>
          <Icon as={FiBarChart2} color="brand.500" boxSize={5} />
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" gap={4}>
          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="medium">Entrevistas técnicas</Text>
              <Text fontSize="sm" fontWeight="medium">5/8</Text>
            </Flex>
            <Progress value={62.5} size="sm" colorScheme="green" borderRadius="full" />
          </Box>
          
          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="medium">Comunicação não-verbal</Text>
              <Text fontSize="sm" fontWeight="medium">3/5</Text>
            </Flex>
            <Progress value={60} size="sm" colorScheme="blue" borderRadius="full" />
          </Box>
          
          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="medium">Perguntas comportamentais</Text>
              <Text fontSize="sm" fontWeight="medium">7/10</Text>
            </Flex>
            <Progress value={70} size="sm" colorScheme="purple" borderRadius="full" />
          </Box>
          
          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="medium">Progresso geral</Text>
              <Text fontSize="sm" fontWeight="medium">65%</Text>
            </Flex>
            <Progress value={65} size="sm" colorScheme="brand" borderRadius="full" />
          </Box>
          
          <Box pt={2}>
            <Button
              as={NextLink}
              href="/dashboard/practice"
              colorScheme="brand"
              variant="outline"
              size="sm"
              w="full"
              mt={2}
            >
              Continuar Prática
            </Button>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - InViewAI</title>
        <meta name="description" content="Dashboard de preparação para entrevistas da InViewAI" />
      </Head>
      
      <DashboardLayout pageTitle="Dashboard">
        <Box py={4}>
          {/* Resumo de Analytics */}
          <AnalyticsSummary />
          
          {/* Informações de Próxima Entrevista e Progresso */}
          <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={6} mb={8}>
            <GridItem>
              <NextInterview />
            </GridItem>
            <GridItem>
              <PrepProgress />
            </GridItem>
          </Grid>
          
          {/* Lista de Entrevistas Recentes */}
          <RecentInterviews />
        </Box>
      </DashboardLayout>
    </>
  );
} 