import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import Header from '../components/Header';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  
  // Cores do tema
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email obrigatório',
        description: 'Por favor, informe seu email.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de envio de email de redefinição de senha
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <>
      <Head>
        <title>Redefinir Senha - InViewAI</title>
        <meta name="description" content="Recupere o acesso à sua conta InViewAI" />
      </Head>
      
      <Header />
      
      <Box 
        as="main" 
        minH="calc(100vh - 80px)" 
        py={12}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Container maxW="md" px={{ base: 4, md: 8 }}>
          <Stack spacing={8}>
            <VStack spacing={6}>
              <Heading 
                fontSize={{ base: '2xl', md: '3xl' }}
                textAlign="center"
                color={textColor}
              >
                Redefinir sua senha
              </Heading>
              <Text fontSize="lg" color={secondaryTextColor} textAlign="center">
                {!isSubmitted 
                  ? 'Informe seu email para receber instruções de redefinição de senha' 
                  : 'Enviamos instruções para redefinir sua senha'}
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
              {!isSubmitted ? (
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
                    
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      colorScheme="brand"
                      size="lg"
                      fontSize="md"
                      w="full"
                    >
                      Enviar instruções
                    </Button>
                  </Stack>
                </form>
              ) : (
                <Stack spacing={6}>
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    Enviamos um email para {email} com instruções para redefinir sua senha.
                  </Alert>
                  
                  <Text color={secondaryTextColor}>
                    Verifique sua caixa de entrada e spam. O link expira em 24 horas.
                  </Text>
                  
                  <Button
                    as={NextLink}
                    href="/login"
                    colorScheme="brand"
                    size="lg"
                    fontSize="md"
                    variant="outline"
                    w="full"
                  >
                    Voltar para o login
                  </Button>
                </Stack>
              )}
            </Box>
            
            <Text align="center" color={secondaryTextColor}>
              Lembrou sua senha?{' '}
              <NextLink href="/login" passHref>
                <Link color={'brand.500'} fontWeight="semibold">
                  Voltar para o login
                </Link>
              </NextLink>
            </Text>
          </Stack>
        </Container>
      </Box>
    </>
  );
} 