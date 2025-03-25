import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  Heading,
  Icon,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Avatar,
  AvatarBadge,
  FormHelperText,
  Skeleton,
  Badge
} from '@chakra-ui/react';
import { 
  FiUser, 
  FiSettings, 
  FiSave, 
  FiEdit3, 
  FiShield, 
  FiCamera, 
  FiGlobe,
  FiBell,
  FiSliders,
  FiCode
} from 'react-icons/fi';
import { useSession } from 'next-auth/react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useUsuario } from '@/hooks/useUsuario';
import { ConfiguracoesUsuario } from '@/models/types';

const ConfiguracoesPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { data: session, status } = useSession();
  const { 
    usuario, 
    carregando, 
    erro, 
    atualizarPerfil, 
    atualizarConfiguracoes 
  } = useUsuario();

  // Gestão de estados para formulários
  const [nomePerfil, setNomePerfil] = useState('');
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesUsuario>({
    temaEscuro: false,
    receberNotificacoes: true,
    idioma: 'pt-BR',
    modeloIA: 'gpt-3.5-turbo'
  });
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  // Cores para o modo claro/escuro
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Carregar dados do usuário quando disponíveis
  useEffect(() => {
    if (usuario) {
      setNomePerfil(usuario.nome || '');
      if (usuario.configuracoes) {
        setConfiguracoes({
          ...usuario.configuracoes
        });
      }
    }
  }, [usuario]);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Atualizar preferências de tema
  const alterarTema = (novoValor: boolean) => {
    setConfiguracoes(prev => ({
      ...prev,
      temaEscuro: novoValor
    }));
  };

  // Atualizar preferências de notificações
  const alterarNotificacoes = (novoValor: boolean) => {
    setConfiguracoes(prev => ({
      ...prev,
      receberNotificacoes: novoValor
    }));
  };

  // Salvar alterações do perfil
  const salvarPerfil = async () => {
    if (!session?.user?.id) return;
    
    setSalvandoPerfil(true);
    try {
      const sucesso = await atualizarPerfil({ 
        nome: nomePerfil 
      });
      
      if (sucesso) {
        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações de perfil foram atualizadas com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar seu perfil. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setSalvandoPerfil(false);
    }
  };

  // Salvar alterações de configurações
  const salvarConfiguracoes = async () => {
    if (!session?.user?.id || !usuario) return;
    
    setSalvandoConfig(true);
    try {
      const sucesso = await atualizarConfiguracoes(configuracoes);
      
      if (sucesso) {
        toast({
          title: 'Configurações atualizadas',
          description: 'Suas preferências foram salvas com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar suas configurações. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Erro ao atualizar configurações:', error);
    } finally {
      setSalvandoConfig(false);
    }
  };

  // Mostrar esqueleto durante carregamento
  if (carregando) {
    return (
      <DashboardLayout>
        <Box>
          <Skeleton height="40px" width="250px" mb={8} />
          <Stack spacing={8}>
            <Skeleton height="200px" />
            <Skeleton height="350px" />
          </Stack>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Heading size="lg" mb={8}>Configurações</Heading>
        
        {/* Seção de Perfil */}
        <Card 
          bg={cardBg} 
          borderWidth="1px" 
          borderColor={borderColor}
          shadow="sm"
          mb={8}
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FiUser} mr={2} />
              <Heading size="md">Perfil</Heading>
            </Flex>
          </CardHeader>
          <Divider borderColor={borderColor} />
          <CardBody>
            <Flex direction={{ base: 'column', md: 'row' }} align="start" gap={8}>
              {/* Avatar do usuário */}
              <Flex 
                direction="column" 
                align="center" 
                justify="center"
                minW={{ base: 'full', md: '200px' }}
              >
                <Avatar 
                  size="2xl" 
                  name={usuario?.nome} 
                  src={usuario?.imagemUrl || undefined}
                  mb={4}
                  position="relative"
                >
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    bg="blue.500"
                    p="1"
                    rounded="full"
                    cursor="pointer"
                    _hover={{ bg: 'blue.600' }}
                  >
                    <Icon as={FiCamera} color="white" />
                  </Box>
                </Avatar>
                
                <Text fontWeight="medium">{usuario?.email}</Text>
                <Badge colorScheme="green" mt={2}>Conta Ativa</Badge>
              </Flex>
              
              {/* Formulário de perfil */}
              <VStack spacing={4} align="start" w="full">
                <FormControl>
                  <FormLabel color={labelColor}>Nome</FormLabel>
                  <Input 
                    placeholder="Seu nome completo" 
                    value={nomePerfil} 
                    onChange={(e) => setNomePerfil(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel color={labelColor}>E-mail</FormLabel>
                  <Input 
                    isReadOnly
                    value={usuario?.email || ''}
                    bg={useColorModeValue('gray.50', 'gray.600')}
                  />
                  <FormHelperText>O e-mail não pode ser alterado</FormHelperText>
                </FormControl>
                
                <Button 
                  leftIcon={<FiSave />} 
                  colorScheme="blue"
                  isLoading={salvandoPerfil}
                  onClick={salvarPerfil}
                  alignSelf="flex-end"
                  mt={4}
                >
                  Salvar Alterações
                </Button>
              </VStack>
            </Flex>
          </CardBody>
        </Card>
        
        {/* Seção de Preferências */}
        <Card 
          bg={cardBg} 
          borderWidth="1px" 
          borderColor={borderColor}
          shadow="sm"
        >
          <CardHeader>
            <Flex align="center">
              <Icon as={FiSettings} mr={2} />
              <Heading size="md">Preferências</Heading>
            </Flex>
          </CardHeader>
          <Divider borderColor={borderColor} />
          <CardBody>
            <Stack spacing={6}>
              {/* Aparência */}
              <FormControl>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Flex align="center">
                      <Icon as={FiSliders} mr={2} color={mutedColor} />
                      <FormLabel color={labelColor} htmlFor="tema" mb={0}>Tema Escuro</FormLabel>
                    </Flex>
                    <Text fontSize="sm" color={mutedColor} ml={6}>
                      Ative o tema escuro para reduzir o cansaço visual
                    </Text>
                  </Box>
                  <Switch 
                    id="tema"
                    isChecked={configuracoes.temaEscuro}
                    onChange={(e) => alterarTema(e.target.checked)}
                    colorScheme="blue"
                    size="lg"
                  />
                </Flex>
              </FormControl>
              
              <Divider />
              
              {/* Notificações */}
              <FormControl>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Flex align="center">
                      <Icon as={FiBell} mr={2} color={mutedColor} />
                      <FormLabel color={labelColor} htmlFor="notificacoes" mb={0}>Notificações</FormLabel>
                    </Flex>
                    <Text fontSize="sm" color={mutedColor} ml={6}>
                      Receba avisos sobre suas entrevistas e feedbacks
                    </Text>
                  </Box>
                  <Switch 
                    id="notificacoes"
                    isChecked={configuracoes.receberNotificacoes}
                    onChange={(e) => alterarNotificacoes(e.target.checked)}
                    colorScheme="blue"
                    size="lg"
                  />
                </Flex>
              </FormControl>
              
              <Divider />
              
              {/* Idioma */}
              <FormControl>
                <Flex align="center" mb={2}>
                  <Icon as={FiGlobe} mr={2} color={mutedColor} />
                  <FormLabel color={labelColor} htmlFor="idioma" mb={0}>Idioma</FormLabel>
                </Flex>
                <Select 
                  id="idioma"
                  value={configuracoes.idioma}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, idioma: e.target.value }))}
                  ml={6}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (USA)</option>
                  <option value="es">Español</option>
                </Select>
              </FormControl>
              
              <Divider />
              
              {/* Modelo de IA */}
              <FormControl>
                <Flex align="center" mb={2}>
                  <Icon as={FiCode} mr={2} color={mutedColor} />
                  <FormLabel color={labelColor} htmlFor="modelo-ia" mb={0}>Modelo de IA</FormLabel>
                </Flex>
                <Select 
                  id="modelo-ia"
                  value={configuracoes.modeloIA}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, modeloIA: e.target.value }))}
                  ml={6}
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Rápido)</option>
                  <option value="gpt-4">GPT-4 (Mais preciso)</option>
                </Select>
                <FormHelperText ml={6}>
                  O modelo escolhido será usado para gerar feedback das suas entrevistas
                </FormHelperText>
              </FormControl>
              
              <Button 
                leftIcon={<FiSave />} 
                colorScheme="blue"
                isLoading={salvandoConfig}
                onClick={salvarConfiguracoes}
                alignSelf="flex-end"
                mt={4}
              >
                Salvar Preferências
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default ConfiguracoesPage; 