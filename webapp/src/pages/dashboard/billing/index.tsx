import React, { useState } from 'react';
import Head from 'next/head';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  List,
  ListIcon,
  ListItem,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  FiCreditCard,
  FiCheck,
  FiDownload,
  FiCalendar,
  FiClock,
  FiUser,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiMessageCircle,
  FiAlertCircle,
  FiHelpCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Interface para planos de assinatura
interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  monthlyPrice: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
}

// Dados de faturas simulados
const invoices = [
  {
    id: 'INV-2023-005',
    date: new Date(2023, 8, 15),
    amount: 'R$ 99,90',
    status: 'paid',
    plan: 'Profissional (Anual)',
  },
  {
    id: 'INV-2023-004',
    date: new Date(2023, 7, 15),
    amount: 'R$ 99,90',
    status: 'paid',
    plan: 'Profissional (Anual)',
  },
  {
    id: 'INV-2023-003',
    date: new Date(2023, 6, 15),
    amount: 'R$ 99,90',
    status: 'paid',
    plan: 'Profissional (Anual)',
  },
  {
    id: 'INV-2023-002',
    date: new Date(2023, 5, 15),
    amount: 'R$ 89,90',
    status: 'paid',
    plan: 'Padrão (Anual)',
  },
  {
    id: 'INV-2023-001',
    date: new Date(2023, 4, 15),
    amount: 'R$ 89,90',
    status: 'paid',
    plan: 'Padrão (Anual)',
  },
];

// Componente principal da página de Assinatura
export default function Billing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState('professional');
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Planos de assinatura
  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: isAnnual ? 49.90 : 59.90,
      monthlyPrice: 59.90,
      description: 'Para quem está começando a praticar entrevistas',
      features: [
        { name: 'Prática com assistente virtual', included: true, limit: '5 sessões/mês' },
        { name: 'Análise de comunicação verbal', included: true },
        { name: 'Perguntas técnicas e comportamentais', included: true },
        { name: 'Feedback pós-entrevista', included: true },
        { name: 'Extensão para Google Meet', included: false },
        { name: 'Análise de linguagem corporal', included: false },
        { name: 'Banco de dados de perguntas premium', included: false },
        { name: 'Prioridade no suporte', included: false },
      ]
    },
    {
      id: 'standard',
      name: 'Padrão',
      price: isAnnual ? 89.90 : 99.90,
      monthlyPrice: 99.90,
      description: 'Para quem busca se preparar com mais profundidade',
      features: [
        { name: 'Prática com assistente virtual', included: true, limit: '15 sessões/mês' },
        { name: 'Análise de comunicação verbal', included: true },
        { name: 'Perguntas técnicas e comportamentais', included: true },
        { name: 'Feedback pós-entrevista', included: true },
        { name: 'Extensão para Google Meet', included: true },
        { name: 'Análise de linguagem corporal', included: true },
        { name: 'Banco de dados de perguntas premium', included: false },
        { name: 'Prioridade no suporte', included: false },
      ]
    },
    {
      id: 'professional',
      name: 'Profissional',
      price: isAnnual ? 99.90 : 119.90,
      monthlyPrice: 119.90,
      description: 'Para profissionais que desejam se destacar',
      popular: true,
      features: [
        { name: 'Prática com assistente virtual', included: true, limit: 'Ilimitado' },
        { name: 'Análise de comunicação verbal', included: true },
        { name: 'Perguntas técnicas e comportamentais', included: true },
        { name: 'Feedback pós-entrevista', included: true },
        { name: 'Extensão para Google Meet', included: true },
        { name: 'Análise de linguagem corporal', included: true },
        { name: 'Banco de dados de perguntas premium', included: true },
        { name: 'Prioridade no suporte', included: true },
      ]
    }
  ];
  
  // Encontrar o plano selecionado
  const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
  
  // Simular atualização de plano
  const handleUpdatePlan = () => {
    toast({
      title: 'Plano atualizado',
      description: `Você mudou para o plano ${selectedPlan?.name}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  // Simular cancelamento de assinatura
  const handleCancelSubscription = () => {
    toast({
      title: 'Assinatura cancelada',
      description: 'Sua assinatura será válida até o final do período atual',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };
  
  return (
    <DashboardLayout>
      <Head>
        <title>Assinatura | InViewAI</title>
      </Head>
      <Box p={5} bg={bgColor} minH="calc(100vh - 80px)">
        <Flex mb={6} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
          <Box mb={{ base: 4, md: 0 }}>
            <Heading size="lg">Assinatura</Heading>
            <Text color="gray.500">Gerencie seu plano e métodos de pagamento</Text>
          </Box>
        </Flex>
        
        <Tabs colorScheme="brand" mb={8}>
          <TabList>
            <Tab><Icon as={FiCreditCard} mr={2} /> Meu Plano</Tab>
            <Tab><Icon as={FiDownload} mr={2} /> Faturas</Tab>
          </TabList>
          
          <TabPanels mt={4}>
            <TabPanel p={0}>
              {/* Resumo da assinatura atual */}
              <Card mb={8}>
                <CardHeader pb={0}>
                  <Heading size="md">Resumo da Assinatura</Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
                    <GridItem>
                      <Text color="gray.500" fontSize="sm">Plano Atual</Text>
                      <HStack>
                        <Heading size="md">Profissional</Heading>
                        <Badge colorScheme="green">Anual</Badge>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <Text color="gray.500" fontSize="sm">Próxima Cobrança</Text>
                      <HStack>
                        <Icon as={FiCalendar} color="gray.500" />
                        <Text fontWeight="medium">15 de Outubro de 2023</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        R$ 99,90 será cobrado automaticamente
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text color="gray.500" fontSize="sm">Método de Pagamento</Text>
                      <HStack>
                        <Icon as={FiCreditCard} color="gray.500" />
                        <Text fontWeight="medium">Cartão terminando em 4242</Text>
                      </HStack>
                      <Button size="sm" mt={2} variant="link" colorScheme="brand">
                        Atualizar método de pagamento
                      </Button>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>
              
              {/* Comparação de planos */}
              <Box mb={6}>
                <Flex 
                  direction={{ base: 'column', sm: 'row' }} 
                  align={{ base: 'start', sm: 'center' }} 
                  justify="space-between"
                  mb={4}
                >
                  <Heading size="md">Nossos Planos</Heading>
                  <HStack mt={{ base: 4, sm: 0 }}>
                    <Text>Mensal</Text>
                    <Switch 
                      colorScheme="brand" 
                      isChecked={isAnnual} 
                      onChange={() => setIsAnnual(!isAnnual)}
                    />
                    <Text>Anual</Text>
                    {isAnnual && (
                      <Badge colorScheme="green">Economize 20%</Badge>
                    )}
                  </HStack>
                </Flex>
                
                <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
                  {plans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      bg={cardBg}
                      borderWidth={selectedPlanId === plan.id ? "2px" : "1px"}
                      borderColor={selectedPlanId === plan.id ? "brand.500" : "gray.200"}
                      position="relative"
                      overflow="visible"
                    >
                      {plan.popular && (
                        <Badge
                          colorScheme="brand"
                          position="absolute"
                          top="-12px"
                          right="-10px"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="sm"
                          textTransform="uppercase"
                          fontWeight="bold"
                        >
                          Mais Popular
                        </Badge>
                      )}
                      
                      <CardHeader pb={0}>
                        <VStack align="start">
                          <Heading size="md">{plan.name}</Heading>
                          <Text color="gray.500" fontSize="sm">
                            {plan.description}
                          </Text>
                        </VStack>
                      </CardHeader>
                      
                      <CardBody>
                        <VStack align="start" spacing={6}>
                          <Box>
                            <HStack>
                              <Heading size="xl">R$ {plan.price.toFixed(2)}</Heading>
                              <Text color="gray.500">/mês</Text>
                            </HStack>
                            {isAnnual && (
                              <Text fontSize="sm" color="gray.500">
                                Faturado anualmente (R$ {(plan.price * 12).toFixed(2)})
                              </Text>
                            )}
                            {!isAnnual && plan.monthlyPrice > plan.price && (
                              <Text fontSize="sm" color="gray.500">
                                R$ {plan.monthlyPrice.toFixed(2)} por mês sem compromisso anual
                              </Text>
                            )}
                          </Box>
                          
                          <List spacing={2} w="100%">
                            {plan.features.map((feature, idx) => (
                              <ListItem key={idx}>
                                <HStack>
                                  <ListIcon 
                                    as={feature.included ? FiCheck : FiAlertCircle} 
                                    color={feature.included ? 'green.500' : 'gray.400'} 
                                  />
                                  <Text color={feature.included ? 'inherit' : 'gray.400'}>
                                    {feature.name}
                                  </Text>
                                  {feature.limit && (
                                    <Text fontSize="xs" color="gray.500" ml={1}>
                                      ({feature.limit})
                                    </Text>
                                  )}
                                </HStack>
                              </ListItem>
                            ))}
                          </List>
                          
                          <RadioGroup 
                            value={selectedPlanId} 
                            onChange={setSelectedPlanId} 
                            w="100%"
                          >
                            <Radio value={plan.id} w="100%">
                              {selectedPlanId === plan.id ? 'Selecionado' : 'Selecionar plano'}
                            </Radio>
                          </RadioGroup>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
                
                <Flex justify="flex-end" mt={6}>
                  <Button 
                    colorScheme="brand"
                    onClick={handleUpdatePlan}
                    isDisabled={selectedPlanId === 'professional'}
                  >
                    Atualizar Plano
                  </Button>
                </Flex>
              </Box>
              
              {/* Recursos adicionais */}
              <Card mb={6}>
                <CardHeader pb={0}>
                  <Heading size="md">Recursos do Seu Plano</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box>
                      <Heading size="sm" mb={3}>Sessões de Prática</Heading>
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Icon as={FiTrendingUp} color="gray.500" />
                          <Text>Ilimitadas sessões de prática</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiUsers} color="gray.500" />
                          <Text>Entrevistas personalizadas por setor</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiAward} color="gray.500" />
                          <Text>Acesso a perguntas premium</Text>
                        </HStack>
                      </VStack>
                    </Box>
                    
                    <Box>
                      <Heading size="sm" mb={3}>Análise e Feedback</Heading>
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Icon as={FiMessageCircle} color="gray.500" />
                          <Text>Feedback detalhado em tempo real</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiUser} color="gray.500" />
                          <Text>Análise de linguagem corporal</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiClock} color="gray.500" />
                          <Text>Histórico completo de desempenho</Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </Card>
              
              {/* Cancelamento de assinatura */}
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Cancelamento</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Text color="gray.500">
                      Se decidir cancelar sua assinatura, você continuará tendo acesso ao serviço até o final do período pago.
                    </Text>
                    
                    <HStack>
                      <Icon as={FiCheckCircle} color="green.500" />
                      <Text>Acesso garantido até 15 de Outubro de 2023</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={FiHelpCircle} color="gray.500" />
                      <Text>Precisa de ajuda? Entre em contato com nosso suporte.</Text>
                    </HStack>
                    
                    <Button 
                      colorScheme="red" 
                      variant="outline"
                      onClick={handleCancelSubscription}
                    >
                      Cancelar Assinatura
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel p={0}>
              {/* Histórico de faturas */}
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Histórico de Faturas</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={4} divider={<Divider />}>
                    {invoices.map((invoice) => (
                      <Flex 
                        key={invoice.id} 
                        justify="space-between" 
                        align="center"
                        direction={{ base: 'column', sm: 'row' }}
                      >
                        <Box mb={{ base: 3, sm: 0 }}>
                          <HStack mb={1}>
                            <Heading size="sm">{invoice.id}</Heading>
                            <Badge 
                              colorScheme={invoice.status === 'paid' ? 'green' : 'orange'}
                              textTransform="capitalize"
                            >
                              {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            {invoice.date.toLocaleDateString('pt-BR')} • {invoice.plan}
                          </Text>
                        </Box>
                        
                        <HStack>
                          <Text fontWeight="medium">{invoice.amount}</Text>
                          <Button size="sm" variant="outline" leftIcon={<FiDownload />}>
                            Baixar
                          </Button>
                        </HStack>
                      </Flex>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </DashboardLayout>
  );
} 