import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  IconButton,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaGoogle, FaLinkedin, FaGithub } from 'react-icons/fa';
import NextLink from 'next/link';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FcGoogle } from 'react-icons/fc';

export default function Signup() {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const toast = useToast();
  
  // Cores do tema
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erros quando o usuário começa a digitar novamente
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validar campos obrigatórios
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.sobrenome) newErrors.sobrenome = 'Sobrenome é obrigatório';
    
    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
    }
    
    // Validar confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Erro no formulário',
        description: 'Por favor, verifique os campos destacados.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de cadastro
    setTimeout(() => {
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você será redirecionado para o dashboard.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirecionamento para o dashboard após cadastro bem-sucedido
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSocialSignup = (provider: string) => {
    setIsLoading(true);
    
    // Simulação de cadastro com provedor social
    setTimeout(() => {
      toast({
        title: 'Cadastro com provedor social',
        description: `Cadastro com ${provider} iniciado.`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <>
      <Head>
        <title>Cadastro - InViewAI</title>
        <meta name="description" content="Crie sua conta na plataforma InViewAI" />
      </Head>
      
      <Header />
      
      <Box 
        as="main" 
        minH="calc(100vh - 80px)" 
        py={12}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Container maxW="lg" px={{ base: 4, md: 8 }}>
          <Stack spacing={8}>
            <VStack spacing={6}>
              <Heading 
                fontSize={{ base: '2xl', md: '3xl' }}
                textAlign="center"
                color={textColor}
              >
                Crie sua conta
              </Heading>
              <Text fontSize="lg" color={secondaryTextColor} textAlign="center">
                Comece sua jornada de preparação para entrevistas
              </Text>
            </VStack>
            
            <Box
              py={8}
              px={10}
              bg={bgColor}
              boxShadow="md"
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <HStack>
                    <FormControl id="nome" isRequired isInvalid={!!errors.nome}>
                      <FormLabel>Nome</FormLabel>
                      <Input 
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        size="lg"
                      />
                      <FormErrorMessage>{errors.nome}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl id="sobrenome" isRequired isInvalid={!!errors.sobrenome}>
                      <FormLabel>Sobrenome</FormLabel>
                      <Input 
                        name="sobrenome"
                        value={formData.sobrenome}
                        onChange={handleChange}
                        placeholder="Seu sobrenome"
                        size="lg"
                      />
                      <FormErrorMessage>{errors.sobrenome}</FormErrorMessage>
                    </FormControl>
                  </HStack>
                  
                  <FormControl id="email" isRequired isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      size="lg"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl id="password" isRequired isInvalid={!!errors.password}>
                    <FormLabel>Senha</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Sua senha"
                      />
                      <InputRightElement width="3rem">
                        <IconButton
                          h="1.5rem"
                          size="sm"
                          aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl id="confirmPassword" isRequired isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirme sua senha"
                      />
                      <InputRightElement width="3rem">
                        <IconButton
                          h="1.5rem"
                          size="sm"
                          aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                          icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          variant="ghost"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                  
                  <Stack spacing={5}>
                    <FormControl>
                      <Checkbox colorScheme="brand">
                        Concordo com os{' '}
                        <NextLink href="/terms" passHref>
                          <Link color="brand.500">termos</Link>
                        </NextLink>
                        {' '}e{' '}
                        <NextLink href="/privacy" passHref>
                          <Link color="brand.500">política de privacidade</Link>
                        </NextLink>
                      </Checkbox>
                    </FormControl>
                    
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      colorScheme="brand"
                      size="lg"
                      fontSize="md"
                    >
                      Criar Conta
                    </Button>
                  </Stack>
                </Stack>
              </form>
              
              <Box mt={8}>
                <HStack>
                  <Divider />
                  <Text px={3} color={secondaryTextColor} fontSize="sm">
                    ou continue com
                  </Text>
                  <Divider />
                </HStack>
                
                <Flex mt={4} justifyContent="center" gap={4}>
                  <IconButton
                    aria-label="Cadastro com Google"
                    icon={<FcGoogle size="1.5em" />}
                    size="lg"
                    isRound
                    onClick={() => handleSocialSignup('Google')}
                    variant="outline"
                  />
                  <IconButton
                    aria-label="Cadastro com GitHub"
                    icon={<FaGithub size="1.5em" />}
                    size="lg"
                    isRound
                    onClick={() => handleSocialSignup('GitHub')}
                    variant="outline"
                  />
                  <IconButton
                    aria-label="Cadastro com LinkedIn"
                    icon={<FaLinkedin size="1.5em" color="#0077B5" />}
                    size="lg"
                    isRound
                    onClick={() => handleSocialSignup('LinkedIn')}
                    variant="outline"
                  />
                </Flex>
              </Box>
            </Box>
            
            <Text align="center" color={secondaryTextColor}>
              Já tem uma conta?{' '}
              <NextLink href="/login" passHref>
                <Link color={'brand.500'} fontWeight="semibold">
                  Entre agora
                </Link>
              </NextLink>
            </Text>
          </Stack>
        </Container>
      </Box>
      
      <Footer />
    </>
  );
} 