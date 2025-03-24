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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaGoogle, FaLinkedin, FaGithub } from 'react-icons/fa';
import NextLink from 'next/link';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  
  // Cores do tema
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Login bem-sucedido',
        description: 'Você será redirecionado para o dashboard.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro de autenticação',
        description: error instanceof Error ? error.message : 'Falha na autenticação',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    
    try {
      await signIn(provider.toLowerCase(), { callbackUrl: '/dashboard' });
    } catch (error) {
      toast({
        title: 'Erro de autenticação',
        description: error instanceof Error ? error.message : `Falha no login com ${provider}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - InViewAI</title>
        <meta name="description" content="Faça login na plataforma InViewAI" />
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
                Entre em sua conta
              </Heading>
              <Text fontSize="lg" color={secondaryTextColor} textAlign="center">
                Acesse feedback personalizado para suas entrevistas
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
                  <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      size="lg"
                    />
                  </FormControl>
                  
                  <FormControl id="password" isRequired>
                    <FormLabel>Senha</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </FormControl>
                  
                  <Stack spacing={5}>
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align={'start'}
                      justify={'space-between'}>
                      <Checkbox colorScheme="brand">Lembrar de mim</Checkbox>
                      <NextLink href="/reset-password" passHref>
                        <Link color={'brand.500'}>Esqueceu a senha?</Link>
                      </NextLink>
                    </Stack>
                    
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      colorScheme="brand"
                      size="lg"
                      fontSize="md"
                    >
                      Entrar
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
                    aria-label="Login com Google"
                    icon={<FcGoogle size="1.5em" />}
                    size="lg"
                    isRound
                    onClick={() => handleSocialLogin('Google')}
                    variant="outline"
                  />
                  <IconButton
                    aria-label="Login com GitHub"
                    icon={<FaGithub size="1.5em" />}
                    size="lg"
                    isRound
                    onClick={() => handleSocialLogin('GitHub')}
                    variant="outline"
                  />
                  <IconButton
                    aria-label="Login com LinkedIn"
                    icon={<FaLinkedin size="1.5em" color="#0077B5" />}
                    size="lg"
                    isRound
                    onClick={() => handleSocialLogin('LinkedIn')}
                    variant="outline"
                  />
                </Flex>
              </Box>
            </Box>
            
            <Text align="center" color={secondaryTextColor}>
              Não tem uma conta?{' '}
              <NextLink href="/signup" passHref>
                <Link color={'brand.500'} fontWeight="semibold">
                  Registre-se agora
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