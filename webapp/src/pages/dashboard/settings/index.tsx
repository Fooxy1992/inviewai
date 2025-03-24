import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Switch,
  Avatar,
  IconButton,
  Divider,
  FormHelperText,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { FiUser, FiCamera, FiLock, FiSave } from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

export default function Settings() {
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Cores para o tema
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Manipulação de formulários
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulação de envio de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulação de envio de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulação de envio de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Configurações - InViewAI</title>
        <meta name="description" content="Gerencie suas configurações de conta" />
      </Head>
      
      <DashboardLayout pageTitle="Configurações">
        <Box py={4}>
          <Tabs 
            isFitted 
            variant="enclosed" 
            index={tabIndex} 
            onChange={(index) => setTabIndex(index)}
            colorScheme="brand"
          >
            <TabList mb="1em">
              <Tab>Perfil</Tab>
              <Tab>Segurança</Tab>
              <Tab>Notificações</Tab>
              <Tab>Privacidade</Tab>
            </TabList>
            
            <TabPanels>
              {/* Painel de Perfil */}
              <TabPanel>
                <Card bg={bg} borderWidth="1px" borderColor={borderColor} shadow="sm">
                  <CardBody>
                    <form onSubmit={handleProfileSubmit}>
                      <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={8}>
                        {/* Coluna da foto */}
                        <GridItem>
                          <Stack spacing={6} align="center">
                            <Heading size="md">Foto de Perfil</Heading>
                            <Box position="relative">
                              <Avatar 
                                size="2xl" 
                                name="João Silva" 
                                src="/images/user-avatar.jpg" 
                              />
                              <IconButton
                                aria-label="Alterar foto"
                                icon={<FiCamera />}
                                size="sm"
                                colorScheme="brand"
                                rounded="full"
                                position="absolute"
                                bottom={0}
                                right={0}
                              />
                            </Box>
                            <Text fontSize="sm" color="gray.500" textAlign="center">
                              Clique no ícone da câmera para alterar sua foto
                            </Text>
                          </Stack>
                        </GridItem>
                        
                        {/* Coluna de informações */}
                        <GridItem>
                          <Stack spacing={5}>
                            <Heading size="md">Informações Pessoais</Heading>
                            
                            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                              <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <Input defaultValue="João" />
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel>Sobrenome</FormLabel>
                                <Input defaultValue="Silva" />
                              </FormControl>
                            </Grid>
                            
                            <FormControl>
                              <FormLabel>Email</FormLabel>
                              <Input defaultValue="joao.silva@exemplo.com" isReadOnly />
                              <FormHelperText>
                                Para alterar seu email, acesse a aba Segurança
                              </FormHelperText>
                            </FormControl>
                            
                            <FormControl>
                              <FormLabel>Telefone</FormLabel>
                              <Input defaultValue="+55 (11) 98765-4321" />
                            </FormControl>
                            
                            <FormControl>
                              <FormLabel>Cargo atual</FormLabel>
                              <Input defaultValue="Desenvolvedor Full Stack" />
                            </FormControl>
                            
                            <FormControl>
                              <FormLabel>Empresa</FormLabel>
                              <Input defaultValue="TechBrasil" />
                            </FormControl>
                            
                            <FormControl>
                              <FormLabel>Bio</FormLabel>
                              <Textarea 
                                defaultValue="Desenvolvedor Full Stack com experiência em React, Node.js e TypeScript. Apaixonado por criar experiências de usuário intuitivas e escaláveis."
                                rows={4}
                              />
                            </FormControl>
                            
                            <Flex justify="flex-end">
                              <Button
                                type="submit"
                                colorScheme="brand"
                                isLoading={isLoading}
                                leftIcon={<FiSave />}
                              >
                                Salvar Alterações
                              </Button>
                            </Flex>
                          </Stack>
                        </GridItem>
                      </Grid>
                    </form>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* Painel de Segurança */}
              <TabPanel>
                <Card bg={bg} borderWidth="1px" borderColor={borderColor} shadow="sm">
                  <CardBody>
                    <form onSubmit={handleSecuritySubmit}>
                      <Stack spacing={6}>
                        <Heading size="md">Alterar Senha</Heading>
                        
                        <FormControl>
                          <FormLabel>Senha Atual</FormLabel>
                          <Input type="password" placeholder="Digite sua senha atual" />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Nova Senha</FormLabel>
                          <Input type="password" placeholder="Digite sua nova senha" />
                          <FormHelperText>
                            A senha deve ter pelo menos 8 caracteres, incluindo números e caracteres especiais.
                          </FormHelperText>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <Input type="password" placeholder="Confirme sua nova senha" />
                        </FormControl>
                        
                        <Divider />
                        
                        <Heading size="md">Verificação em Duas Etapas</Heading>
                        
                        <FormControl display="flex" alignItems="center">
                          <Switch id="two-factor" colorScheme="brand" size="lg" />
                          <FormLabel htmlFor="two-factor" mb="0" ml={3}>
                            Ativar verificação em duas etapas
                          </FormLabel>
                        </FormControl>
                        
                        <Text color="gray.500" fontSize="sm">
                          A verificação em duas etapas adiciona uma camada extra de segurança à sua conta.
                          Além da sua senha, você precisará fornecer um código enviado para seu telefone.
                        </Text>
                        
                        <Divider />
                        
                        <Heading size="md">Sessões Ativas</Heading>
                        
                        <Text>
                          Você está logado em 2 dispositivos. Você pode encerrar todas as outras sessões,
                          exceto a atual.
                        </Text>
                        
                        <Button
                          colorScheme="red"
                          variant="outline"
                          width="fit-content"
                        >
                          Encerrar Outras Sessões
                        </Button>
                        
                        <Flex justify="flex-end">
                          <Button
                            type="submit"
                            colorScheme="brand"
                            isLoading={isLoading}
                            leftIcon={<FiSave />}
                          >
                            Salvar Alterações
                          </Button>
                        </Flex>
                      </Stack>
                    </form>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* Painel de Notificações */}
              <TabPanel>
                <Card bg={bg} borderWidth="1px" borderColor={borderColor} shadow="sm">
                  <CardBody>
                    <form onSubmit={handleNotificationsSubmit}>
                      <Stack spacing={6}>
                        <Heading size="md">Preferências de Notificação</Heading>
                        
                        <Heading size="sm">Email</Heading>
                        
                        <FormControl display="flex" alignItems="center">
                          <Switch id="email-interviews" colorScheme="brand" defaultChecked size="lg" />
                          <FormLabel htmlFor="email-interviews" mb="0" ml={3}>
                            Lembretes de entrevistas
                          </FormLabel>
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <Switch id="email-feedback" colorScheme="brand" defaultChecked size="lg" />
                          <FormLabel htmlFor="email-feedback" mb="0" ml={3}>
                            Relatórios de feedback
                          </FormLabel>
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <Switch id="email-tips" colorScheme="brand" defaultChecked size="lg" />
                          <FormLabel htmlFor="email-tips" mb="0" ml={3}>
                            Dicas de preparação
                          </FormLabel>
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <Switch id="email-marketing" colorScheme="brand" size="lg" />
                          <FormLabel htmlFor="email-marketing" mb="0" ml={3}>
                            Novidades e promoções
                          </FormLabel>
                        </FormControl>
                        
                        <Divider />
                        
                        <Heading size="sm">Aplicação</Heading>
                        
                        <FormControl display="flex" alignItems="center">
                          <Switch id="app-interviews" colorScheme="brand" defaultChecked size="lg" />
                          <FormLabel htmlFor="app-interviews" mb="0" ml={3}>
                            Lembretes de entrevistas
                          </FormLabel>
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <Switch id="app-feedback" colorScheme="brand" defaultChecked size="lg" />
                          <FormLabel htmlFor="app-feedback" mb="0" ml={3}>
                            Notificações de feedback
                          </FormLabel>
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <Switch id="app-messages" colorScheme="brand" defaultChecked size="lg" />
                          <FormLabel htmlFor="app-messages" mb="0" ml={3}>
                            Mensagens
                          </FormLabel>
                        </FormControl>
                        
                        <Flex justify="flex-end">
                          <Button
                            type="submit"
                            colorScheme="brand"
                            isLoading={isLoading}
                            leftIcon={<FiSave />}
                          >
                            Salvar Alterações
                          </Button>
                        </Flex>
                      </Stack>
                    </form>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* Painel de Privacidade */}
              <TabPanel>
                <Card bg={bg} borderWidth="1px" borderColor={borderColor} shadow="sm">
                  <CardBody>
                    <Stack spacing={6}>
                      <Heading size="md">Configurações de Privacidade</Heading>
                      
                      <FormControl>
                        <FormLabel>Visibilidade do Perfil</FormLabel>
                        <Select defaultValue="registered">
                          <option value="public">Público - Visível para todos</option>
                          <option value="registered">Registrados - Apenas usuários registrados</option>
                          <option value="connections">Conexões - Apenas minhas conexões</option>
                          <option value="private">Privado - Apenas eu</option>
                        </Select>
                      </FormControl>
                      
                      <FormControl display="flex" alignItems="center">
                        <Switch id="data-collection" colorScheme="brand" defaultChecked size="lg" />
                        <FormLabel htmlFor="data-collection" mb="0" ml={3}>
                          Coleta de dados para melhorar a experiência
                        </FormLabel>
                      </FormControl>
                      
                      <Text color="gray.500" fontSize="sm">
                        Permitimos que coletemos dados sobre seu uso para aprimorar nossos algoritmos de IA e melhorar sua experiência.
                        Seus dados são sempre tratados com segurança e nunca compartilhados com terceiros.
                      </Text>
                      
                      <FormControl display="flex" alignItems="center">
                        <Switch id="show-progress" colorScheme="brand" defaultChecked size="lg" />
                        <FormLabel htmlFor="show-progress" mb="0" ml={3}>
                          Mostrar meu progresso para conexões
                        </FormLabel>
                      </FormControl>
                      
                      <Divider />
                      
                      <Heading size="md" color="red.500">Zona de Perigo</Heading>
                      
                      <Text>
                        Esta ação é irreversível e removerá permanentemente todos os seus dados, incluindo histórico de entrevistas,
                        feedback e configurações pessoais.
                      </Text>
                      
                      <Button
                        colorScheme="red"
                        variant="outline"
                        width="fit-content"
                      >
                        Excluir Minha Conta
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </DashboardLayout>
    </>
  );
} 