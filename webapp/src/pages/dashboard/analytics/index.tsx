import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiTrendingUp, 
  FiCalendar, 
  FiClock, 
  FiBarChart2, 
  FiPieChart,
  FiActivity
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Interface para o componente de cartão de estatística
interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  isIncrease: boolean;
  icon: IconType;
  description: string;
}

// Componente de cartão de estatística
const StatCard = ({ title, value, percentage, isIncrease, icon, description }: StatCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.500', 'gray.400');
  
  return (
    <Card bg={cardBg} shadow="sm" borderRadius="lg">
      <CardBody>
        <Flex justify="space-between">
          <Box>
            <Text color={textColor} fontSize="sm" fontWeight="medium">{title}</Text>
            <Heading size="lg" mt={1}>{value}</Heading>
            <HStack spacing={1} mt={2}>
              <StatArrow type={isIncrease ? 'increase' : 'decrease'} />
              <Text 
                fontSize="sm" 
                fontWeight="medium"
                color={isIncrease ? 'green.500' : 'red.500'}
              >
                {percentage}
              </Text>
              <Text fontSize="sm" color={textColor}>{description}</Text>
            </HStack>
          </Box>
          <Flex 
            h={10} 
            w={10} 
            align="center" 
            justify="center" 
            rounded="md"
            bg={useColorModeValue('brand.50', 'brand.900')}
            color="brand.500"
          >
            <Icon as={icon} boxSize={5} />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

// Componente principal da página Analytics
export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Dados simulados para o gráfico
  const performanceData = [
    { date: 'Jan', score: 67 },
    { date: 'Fev', score: 72 },
    { date: 'Mar', score: 76 },
    { date: 'Abr', score: 75 },
    { date: 'Mai', score: 79 },
    { date: 'Jun', score: 82 },
  ];
  
  return (
    <DashboardLayout>
      <Head>
        <title>Analytics | InViewAI</title>
      </Head>
      <Box p={5} bg={bgColor} minH="calc(100vh - 80px)">
        <Flex mb={6} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
          <Heading size="lg" mb={{ base: 4, md: 0 }}>Análise de Desempenho</Heading>
          <HStack spacing={4}>
            <Button
              size="sm"
              variant={timeRange === 'week' ? 'solid' : 'outline'}
              colorScheme="brand"
              onClick={() => setTimeRange('week')}
            >
              Semana
            </Button>
            <Button
              size="sm"
              variant={timeRange === 'month' ? 'solid' : 'outline'}
              colorScheme="brand"
              onClick={() => setTimeRange('month')}
            >
              Mês
            </Button>
            <Button
              size="sm"
              variant={timeRange === 'year' ? 'solid' : 'outline'}
              colorScheme="brand"
              onClick={() => setTimeRange('year')}
            >
              Ano
            </Button>
          </HStack>
        </Flex>
        
        {/* Cards de estatísticas */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
          <StatCard 
            title="Pontuação Média" 
            value="78/100" 
            percentage="12%" 
            isIncrease={true} 
            icon={FiBarChart2}
            description="vs. período anterior" 
          />
          <StatCard 
            title="Entrevistas Realizadas" 
            value="24" 
            percentage="8%" 
            isIncrease={true} 
            icon={FiCalendar}
            description="vs. período anterior" 
          />
          <StatCard 
            title="Tempo Médio de Resposta" 
            value="64s" 
            percentage="5%" 
            isIncrease={false} 
            icon={FiClock}
            description="vs. período anterior" 
          />
          <StatCard 
            title="Taxa de Aprovação" 
            value="67%" 
            percentage="15%" 
            isIncrease={true} 
            icon={FiTrendingUp}
            description="vs. período anterior" 
          />
        </SimpleGrid>
        
        {/* Gráficos e análises detalhadas */}
        <Tabs colorScheme="brand" mb={8}>
          <TabList>
            <Tab>Progresso Geral</Tab>
            <Tab>Habilidades</Tab>
            <Tab>Tipos de Entrevista</Tab>
            <Tab>Análise de Feedback</Tab>
          </TabList>
          
          <TabPanels mt={4}>
            <TabPanel p={0}>
              <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }} gap={5}>
                <GridItem colSpan={{ base: 1, lg: 2 }}>
                  <Card height="full">
                    <CardHeader pb={0}>
                      <Heading size="md">Evolução da Pontuação</Heading>
                    </CardHeader>
                    <CardBody>
                      <Flex h="300px" align="center" justify="center">
                        <Text>Gráfico de linha mostrando a evolução da pontuação ao longo do tempo</Text>
                        {/* Aqui seria inserido um componente de gráfico */}
                      </Flex>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card height="full">
                    <CardHeader pb={0}>
                      <Heading size="md">Áreas de Melhoria</Heading>
                    </CardHeader>
                    <CardBody>
                      <Flex h="300px" align="center" justify="center" direction="column">
                        <Box>
                          <Text>Gráfico de radar mostrando pontos fortes e fracos</Text>
                          {/* Aqui seria inserido um componente de gráfico */}
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>
            
            <TabPanel p={0}>
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Análise de Habilidades</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <Box>
                      <Heading size="sm" mb={4}>Habilidades Técnicas</Heading>
                      <Flex h="300px" align="center" justify="center">
                        <Text>Gráfico de barras mostrando habilidades técnicas</Text>
                        {/* Aqui seria inserido um componente de gráfico */}
                      </Flex>
                    </Box>
                    <Box>
                      <Heading size="sm" mb={4}>Habilidades Comportamentais</Heading>
                      <Flex h="300px" align="center" justify="center">
                        <Text>Gráfico de barras mostrando habilidades comportamentais</Text>
                        {/* Aqui seria inserido um componente de gráfico */}
                      </Flex>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel p={0}>
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Desempenho por Tipo de Entrevista</Heading>
                </CardHeader>
                <CardBody>
                  <Flex h="400px" align="center" justify="center">
                    <Text>Gráfico comparativo de desempenho por tipo de entrevista</Text>
                    {/* Aqui seria inserido um componente de gráfico */}
                  </Flex>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel p={0}>
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Análise de Feedback</Heading>
                </CardHeader>
                <CardBody>
                  <Flex h="400px" align="center" justify="center">
                    <Text>Visualização de nuvem de palavras e principais feedbacks recebidos</Text>
                    {/* Aqui seria inserido um componente de visualização */}
                  </Flex>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {/* Resumo de entrevista recente */}
        <Card mb={8}>
          <CardHeader>
            <Heading size="md">Análise da Última Entrevista</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              <Box>
                <Heading size="sm" mb={4}>Pontos Fortes</Heading>
                <Box p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="md">
                  <Text mb={2}>• Comunicação clara e articulada</Text>
                  <Text mb={2}>• Estruturação lógica das respostas</Text>
                  <Text mb={2}>• Bom uso de exemplos práticos</Text>
                  <Text>• Demonstração de conhecimento técnico</Text>
                </Box>
              </Box>
              <Box>
                <Heading size="sm" mb={4}>Áreas para Melhoria</Heading>
                <Box p={4} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="md">
                  <Text mb={2}>• Tempo médio de resposta acima do ideal</Text>
                  <Text mb={2}>• Uso excessivo de palavras de preenchimento</Text>
                  <Text mb={2}>• Contato visual pode ser aprimorado</Text>
                  <Text>• Aprofundar respostas em questões comportamentais</Text>
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </Box>
    </DashboardLayout>
  );
} 