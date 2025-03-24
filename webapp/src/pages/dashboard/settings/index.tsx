import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
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
} from '@chakra-ui/react';
import {
  FiUser,
  FiEdit2,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSettings,
  FiSave,
  FiBell,
  FiTrash2,
  FiUpload,
  FiGlobe,
  FiShield,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiDownload,
  FiCpu,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Componente principal da página de Configurações
export default function Settings() {
  // Estados para formulários
  const [firstName, setFirstName] = useState('João');
  const [lastName, setLastName] = useState('Silva');
  const [email, setEmail] = useState('joao.silva@example.com');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [location, setLocation] = useState('São Paulo, SP');
  const [bio, setBio] = useState('Desenvolvedor de software com 5 anos de experiência, especializado em frontend com React e TypeScript.');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [githubUrl, setGithubUrl] = useState('https://github.com/joaosilva');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/joaosilva');
  const [twitterUrl, setTwitterUrl] = useState('');
  
  // Estados para API Keys
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingApiKey, setIsSavingApiKey] = useState(false);
  
  // Estados para notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [interviewNotifications, setInterviewNotifications] = useState(true);
  const [feedbackNotifications, setFeedbackNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Estados para preferências
  const [language, setLanguage] = useState('pt-BR');
  const [colorMode, setColorMode] = useState('light');
  const [showTips, setShowTips] = useState(true);
  const [audioTranscription, setAudioTranscription] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Carregar a chave da API do localStorage quando a página carregar
  useEffect(() => {
    // Recuperar a chave da API salva no localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setOpenaiApiKey(savedApiKey);
    }
  }, []);
  
  // Função para salvar perfil
  const handleSaveProfile = () => {
    toast({
      title: 'Perfil atualizado',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Função para alterar senha
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: 'Senha alterada com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  // Função para salvar notificações
  const handleSaveNotifications = () => {
    toast({
      title: 'Notificações atualizadas',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Função para salvar preferências
  const handleSavePreferences = () => {
    toast({
      title: 'Preferências atualizadas',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Função para salvar a configuração da API
  const handleSaveApiConfig = async () => {
    try {
      setIsSavingApiKey(true);
      
      // Em uma implementação real, você enviaria isto para um backend seguro
      // Aqui, estamos apenas simulando o armazenamento no localStorage
      if (openaiApiKey) {
        localStorage.setItem('openai_api_key', openaiApiKey);
        
        // Recarregar a página para aplicar a nova chave
        toast({
          title: 'Chave da API salva',
          description: 'A chave da API OpenAI foi configurada. A página será recarregada para aplicar as alterações.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast({
          title: 'Chave inválida',
          description: 'Por favor, insira uma chave de API válida.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a chave da API.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Erro ao salvar a chave da API:', error);
    } finally {
      setIsSavingApiKey(false);
    }
  };
  
  return (
    <DashboardLayout>
      <Head>
        <title>Configurações | InViewAI</title>
      </Head>
      <Box p={5} bg={bgColor} minH="calc(100vh - 80px)">
        <Flex mb={6} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
          <Box mb={{ base: 4, md: 0 }}>
            <Heading size="lg">Configurações</Heading>
            <Text color="gray.500">Gerencie seu perfil e preferências da conta</Text>
          </Box>
        </Flex>
        
        <Tabs colorScheme="brand" variant="enclosed" mb={8}>
          <TabList>
            <Tab><Icon as={FiUser} mr={2} /> Perfil</Tab>
            <Tab><Icon as={FiLock} mr={2} /> Segurança</Tab>
            <Tab><Icon as={FiBell} mr={2} /> Notificações</Tab>
            <Tab><Icon as={FiSettings} mr={2} /> Preferências</Tab>
            <Tab><Icon as={FiCpu} mr={2} /> API</Tab>
          </TabList>
          
          <TabPanels mt={4}>
            {/* Painel de Perfil */}
            <TabPanel p={0}>
              <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={6}>
                <GridItem>
                  <Card mb={6}>
                    <CardHeader pb={0}>
                      <Heading size="md">Informações Pessoais</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                          <FormControl>
                            <FormLabel>Nome</FormLabel>
                            <Input 
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>Sobrenome</FormLabel>
                            <Input 
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </FormControl>
                        </Grid>
                        
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <FormHelperText>Este email será usado para login e notificações</FormHelperText>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Telefone</FormLabel>
                          <Input 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Localização</FormLabel>
                          <Input 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Cidade, Estado"
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Biografia</FormLabel>
                          <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            placeholder="Uma breve descrição sobre você"
                          />
                        </FormControl>
                        
                        <Divider my={2} />
                        
                        <Heading size="sm" mb={2}>Redes Sociais</Heading>
                        
                        <FormControl>
                          <InputGroup>
                            <InputRightElement pointerEvents="none">
                              <Icon as={FiGithub} color="gray.500" />
                            </InputRightElement>
                            <Input 
                              value={githubUrl}
                              onChange={(e) => setGithubUrl(e.target.value)}
                              placeholder="URL do GitHub"
                            />
                          </InputGroup>
                        </FormControl>
                        
                        <FormControl>
                          <InputGroup>
                            <InputRightElement pointerEvents="none">
                              <Icon as={FiLinkedin} color="gray.500" />
                            </InputRightElement>
                            <Input 
                              value={linkedinUrl}
                              onChange={(e) => setLinkedinUrl(e.target.value)}
                              placeholder="URL do LinkedIn"
                            />
                          </InputGroup>
                        </FormControl>
                        
                        <FormControl>
                          <InputGroup>
                            <InputRightElement pointerEvents="none">
                              <Icon as={FiTwitter} color="gray.500" />
                            </InputRightElement>
                            <Input 
                              value={twitterUrl}
                              onChange={(e) => setTwitterUrl(e.target.value)}
                              placeholder="URL do Twitter"
                            />
                          </InputGroup>
                        </FormControl>
                        
                        <Button 
                          leftIcon={<FiSave />} 
                          colorScheme="brand" 
                          alignSelf="flex-end"
                          onClick={handleSaveProfile}
                        >
                          Salvar Alterações
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
                
                <GridItem>
                  <Card mb={6}>
                    <CardHeader pb={0}>
                      <Heading size="md">Foto de Perfil</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={6}>
                        <Flex 
                          direction="column" 
                          align="center" 
                          justify="center"
                          p={6}
                        >
                          <Avatar 
                            size="2xl" 
                            name={`${firstName} ${lastName}`} 
                            src="https://bit.ly/broken-link"
                            mb={4}
                          >
                            <AvatarBadge 
                              bg="brand.500" 
                              boxSize="1.2em" 
                              borderWidth="3px"
                              borderColor={useColorModeValue('white', 'gray.800')}
                            >
                              <Icon as={FiEdit2} color="white" boxSize={4} />
                            </AvatarBadge>
                          </Avatar>
                          
                          <Text 
                            fontWeight="bold" 
                            fontSize="xl"
                            mb={1}
                          >
                            {firstName} {lastName}
                          </Text>
                          <Text color="gray.500" fontSize="sm" mb={4}>
                            {location}
                          </Text>
                          
                          <HStack spacing={4}>
                            <Button leftIcon={<FiUpload />} colorScheme="brand">
                              Carregar Foto
                            </Button>
                            <Button leftIcon={<FiTrash2 />} variant="outline">
                              Remover
                            </Button>
                          </HStack>
                          
                          <Text fontSize="xs" color="gray.500" mt={3} textAlign="center">
                            Formatos aceitos: JPG, PNG. Tamanho máximo: 1MB
                          </Text>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="md">Conta e Dados</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Box p={4} borderWidth="1px" borderRadius="md" borderColor="red.300">
                          <Heading size="sm" color="red.500" mb={2}>Excluir Conta</Heading>
                          <Text fontSize="sm" mb={3}>
                            A exclusão da sua conta é permanente e irá remover todos os seus dados.
                          </Text>
                          <Button size="sm" colorScheme="red" leftIcon={<FiTrash2 />}>
                            Excluir minha conta
                          </Button>
                        </Box>
                        
                        <Box p={4} borderWidth="1px" borderRadius="md">
                          <Heading size="sm" mb={2}>Exportar Dados</Heading>
                          <Text fontSize="sm" mb={3}>
                            Baixe uma cópia de todos os seus dados e histórico de entrevistas.
                          </Text>
                          <Button size="sm" leftIcon={<FiDownload />} variant="outline">
                            Exportar Dados
                          </Button>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>
            
            {/* Painel de Segurança */}
            <TabPanel p={0}>
              <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                <GridItem>
                  <Card mb={{ base: 6, lg: 0 }}>
                    <CardHeader pb={0}>
                      <Heading size="md">Alterar Senha</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <FormControl isRequired>
                          <FormLabel>Senha Atual</FormLabel>
                          <InputGroup>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <InputRightElement>
                              <Icon
                                as={showPassword ? FiEyeOff : FiEye}
                                color="gray.500"
                                cursor="pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel>Nova Senha</FormLabel>
                          <InputGroup>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <InputRightElement>
                              <Icon
                                as={showPassword ? FiEyeOff : FiEye}
                                color="gray.500"
                                cursor="pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            </InputRightElement>
                          </InputGroup>
                          <FormHelperText>
                            Sua senha deve ter pelo menos 8 caracteres e incluir letras, números e caracteres especiais
                          </FormHelperText>
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <InputGroup>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <InputRightElement>
                              <Icon
                                as={showPassword ? FiEyeOff : FiEye}
                                color="gray.500"
                                cursor="pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                        
                        <Button 
                          leftIcon={<FiSave />} 
                          colorScheme="brand" 
                          mt={2}
                          onClick={handleChangePassword}
                          disabled={!currentPassword || !newPassword || !confirmPassword}
                        >
                          Alterar Senha
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
                
                <GridItem>
                  <Card>
                    <CardHeader pb={0}>
                      <Heading size="md">Segurança da Conta</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Box p={4} borderWidth="1px" borderRadius="md">
                          <Flex justify="space-between" align="center" mb={2}>
                            <Heading size="sm">Autenticação de dois fatores</Heading>
                            <Switch colorScheme="brand" />
                          </Flex>
                          <Text fontSize="sm">
                            Adicione uma camada extra de segurança à sua conta exigindo um código além da senha.
                          </Text>
                        </Box>
                        
                        <Box p={4} borderWidth="1px" borderRadius="md">
                          <Flex justify="space-between" align="center" mb={2}>
                            <Heading size="sm">Alertas de login</Heading>
                            <Switch colorScheme="brand" defaultChecked />
                          </Flex>
                          <Text fontSize="sm">
                            Receba alertas por email quando sua conta for acessada de um novo dispositivo ou local.
                          </Text>
                        </Box>
                        
                        <Box p={4} borderWidth="1px" borderRadius="md">
                          <Flex justify="space-between" align="center" mb={2}>
                            <Heading size="sm">Sessões ativas</Heading>
                          </Flex>
                          <Text fontSize="sm" mb={3}>
                            Você tem 2 sessões ativas em diferentes dispositivos.
                          </Text>
                          <Button size="sm" variant="outline" leftIcon={<FiShield />}>
                            Gerenciar Sessões
                          </Button>
                        </Box>
                        
                        <Divider my={1} />
                        
                        <Text fontSize="sm" color="gray.500">
                          Último login: 12 de setembro de 2023, 15:32
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>
            
            {/* Painel de Notificações */}
            <TabPanel p={0}>
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Preferências de Notificação</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Flex justify="space-between" align="center" mb={3}>
                        <Heading size="sm">Email de Notificações</Heading>
                        <Switch 
                          colorScheme="brand" 
                          isChecked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                      </Flex>
                      <Text color="gray.500" fontSize="sm">
                        Permitir envio de notificações para {email}
                      </Text>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Heading size="sm" mb={4}>Tipos de Notificação</Heading>
                      <Stack spacing={4}>
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="medium">Lembretes de Prática</Text>
                            <Text fontSize="sm" color="gray.500">
                              Lembretes para sessões de prática agendadas
                            </Text>
                          </Box>
                          <Switch 
                            colorScheme="brand" 
                            isChecked={practiceReminders}
                            onChange={() => setPracticeReminders(!practiceReminders)}
                            isDisabled={!emailNotifications}
                          />
                        </Flex>
                        
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="medium">Entrevistas Agendadas</Text>
                            <Text fontSize="sm" color="gray.500">
                              Notificações sobre entrevistas próximas
                            </Text>
                          </Box>
                          <Switch 
                            colorScheme="brand" 
                            isChecked={interviewNotifications}
                            onChange={() => setInterviewNotifications(!interviewNotifications)}
                            isDisabled={!emailNotifications}
                          />
                        </Flex>
                        
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="medium">Feedback e Análises</Text>
                            <Text fontSize="sm" color="gray.500">
                              Resumos e análises após sessões de prática
                            </Text>
                          </Box>
                          <Switch 
                            colorScheme="brand" 
                            isChecked={feedbackNotifications}
                            onChange={() => setFeedbackNotifications(!feedbackNotifications)}
                            isDisabled={!emailNotifications}
                          />
                        </Flex>
                        
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="medium">Emails de Marketing</Text>
                            <Text fontSize="sm" color="gray.500">
                              Novidades, dicas e ofertas sobre a plataforma
                            </Text>
                          </Box>
                          <Switch 
                            colorScheme="brand" 
                            isChecked={marketingEmails}
                            onChange={() => setMarketingEmails(!marketingEmails)}
                            isDisabled={!emailNotifications}
                          />
                        </Flex>
                      </Stack>
                    </Box>
                    
                    <Divider />
                    
                    <Button 
                      leftIcon={<FiSave />} 
                      colorScheme="brand" 
                      alignSelf="flex-end"
                      onClick={handleSaveNotifications}
                    >
                      Salvar Preferências
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Painel de Preferências */}
            <TabPanel p={0}>
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Preferências da Aplicação</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Idioma</FormLabel>
                          <Select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                          >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es">Español</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                      
                      <GridItem>
                        <FormControl>
                          <FormLabel>Modo de Cores</FormLabel>
                          <Select 
                            value={colorMode}
                            onChange={(e) => setColorMode(e.target.value)}
                          >
                            <option value="light">Claro</option>
                            <option value="dark">Escuro</option>
                            <option value="system">Sistema (Automático)</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                    </Grid>
                    
                    <Divider />
                    
                    <Box>
                      <Heading size="sm" mb={4}>Interface e Comportamento</Heading>
                      <Stack spacing={4}>
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="medium">Mostrar Dicas</Text>
                            <Text fontSize="sm" color="gray.500">
                              Exibir dicas e sugestões ao usar a plataforma
                            </Text>
                          </Box>
                          <Switch 
                            colorScheme="brand" 
                            isChecked={showTips}
                            onChange={() => setShowTips(!showTips)}
                          />
                        </Flex>
                        
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="medium">Transcrição de Áudio</Text>
                            <Text fontSize="sm" color="gray.500">
                              Mostrar transcrição em tempo real durante entrevistas
                            </Text>
                          </Box>
                          <Switch 
                            colorScheme="brand" 
                            isChecked={audioTranscription}
                            onChange={() => setAudioTranscription(!audioTranscription)}
                          />
                        </Flex>
                        
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="medium">Salvamento Automático</Text>
                            <Text fontSize="sm" color="gray.500">
                              Salvar automaticamente os rascunhos de anotações e respostas
                            </Text>
                          </Box>
                          <Switch 
                            colorScheme="brand" 
                            isChecked={autoSave}
                            onChange={() => setAutoSave(!autoSave)}
                          />
                        </Flex>
                      </Stack>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Heading size="sm" mb={4}>Acessibilidade</Heading>
                      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Tamanho da Fonte</FormLabel>
                            <Select defaultValue="medium">
                              <option value="small">Pequeno</option>
                              <option value="medium">Médio</option>
                              <option value="large">Grande</option>
                            </Select>
                          </FormControl>
                        </GridItem>
                        
                        <GridItem>
                          <FormControl>
                            <FormLabel>Contraste</FormLabel>
                            <Select defaultValue="normal">
                              <option value="normal">Normal</option>
                              <option value="high">Alto</option>
                            </Select>
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>
                    
                    <Button 
                      leftIcon={<FiSave />} 
                      colorScheme="brand" 
                      alignSelf="flex-end"
                      onClick={handleSavePreferences}
                    >
                      Salvar Preferências
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Painel de API */}
            <TabPanel p={0}>
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Configuração de API</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4}>OpenAI API</Heading>
                      <Text color="gray.500" mb={4}>
                        Configure sua chave de API da OpenAI para usar os recursos de transcrição de áudio e análise de entrevistas.
                        Você pode obter sua chave em <Link href="https://platform.openai.com/account/api-keys" isExternal color="brand.500">platform.openai.com</Link>.
                      </Text>
                      
                      <FormControl mb={4}>
                        <FormLabel>Chave da API OpenAI</FormLabel>
                        <InputGroup>
                          <Input
                            type={showApiKey ? 'text' : 'password'}
                            value={openaiApiKey}
                            onChange={(e) => setOpenaiApiKey(e.target.value)}
                            placeholder="sk-..."
                          />
                          <InputRightElement>
                            <Icon
                              as={showApiKey ? FiEyeOff : FiEye}
                              color="gray.500"
                              cursor="pointer"
                              onClick={() => setShowApiKey(!showApiKey)}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormHelperText>
                          Esta chave é armazenada localmente e não é compartilhada com outros usuários.
                        </FormHelperText>
                      </FormControl>
                      
                      <Button 
                        colorScheme="brand"
                        leftIcon={<FiSave />}
                        onClick={handleSaveApiConfig}
                        isLoading={isSavingApiKey}
                        loadingText="Salvando..."
                      >
                        Salvar Chave
                      </Button>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Heading size="sm" mb={4}>Uso da API</Heading>
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        A API da OpenAI é um serviço pago. Você será cobrado conforme o uso. 
                        Para saber mais sobre os preços, visite a <Link href="https://openai.com/pricing" isExternal color="brand.500">página de preços da OpenAI</Link>.
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Importante: Nunca compartilhe sua chave de API com terceiros. A chave dá acesso à sua conta e créditos.
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </DashboardLayout>
  );
} 