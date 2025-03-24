import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  List,
  ListIcon,
  ListItem,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ReactNode, useState } from 'react';
import NextLink from 'next/link';

interface PriceWrapperProps {
  children: ReactNode;
}

function PriceWrapper({ children }: PriceWrapperProps) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}
      overflow="hidden"
      bg={useColorModeValue('white', 'gray.800')}
      position="relative"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        shadow: 'xl',
      }}
    >
      {children}
    </Box>
  );
}

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const toggleBilling = () => {
    setAnnual(!annual);
  };

  return (
    <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')} id="pricing">
      <Container maxW="container.xl">
        <Stack spacing={4} as={Container} maxW="4xl" textAlign="center" mb={16}>
          <Heading
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'white')}
          >
            Planos Acessíveis para Todos
          </Heading>
          <Text color="gray.600" fontSize={{ base: 'md', sm: 'lg' }}>
            Escolha o plano perfeito para suas necessidades. Todos os planos incluem a extensão
            de feedback em tempo real e recursos essenciais para melhorar suas entrevistas.
          </Text>

          <Flex justify="center" align="center" mt={6}>
            <Text
              fontWeight={annual ? 'normal' : 'bold'}
              color={annual ? 'gray.500' : 'gray.800'}
              mr={2}
            >
              Mensal
            </Text>
            <Switch
              size="lg"
              colorScheme="brand"
              isChecked={annual}
              onChange={toggleBilling}
            />
            <Text
              fontWeight={annual ? 'bold' : 'normal'}
              color={annual ? 'gray.800' : 'gray.500'}
              ml={2}
              display="flex"
              alignItems="center"
            >
              Anual
              <Box
                as="span"
                bg="green.100"
                color="green.800"
                fontSize="xs"
                fontWeight="bold"
                px={2}
                py={1}
                rounded="md"
                ml={2}
              >
                ECONOMIA DE 20%
              </Box>
            </Text>
          </Flex>
        </Stack>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          textAlign="center"
          justify="center"
          spacing={{ base: 4, lg: 10 }}
          py={10}
        >
          <PriceWrapper>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                Grátis
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="5xl" fontWeight="900">
                  R$0
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                para sempre
              </Text>
            </Box>
            <VStack
              bg={useColorModeValue('gray.50', 'gray.700')}
              py={4}
              px={12}
              spacing={3}
              borderBottomRadius={'xl'}
              height="350px"
            >
              <Text fontWeight="bold" textAlign="center" fontSize="md" w="full">
                Funcionalidades:
              </Text>
              <List spacing={3} textAlign="start" w="full">
                <ListItem>
                  <ListIcon as={FaCheck} color="green.500" />
                  Extensão para Chrome
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color="green.500" />
                  Até 3 sessões por mês
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color="green.500" />
                  Feedback básico em tempo real
                </ListItem>
                <ListItem>
                  <ListIcon as={FaTimes} color="red.500" />
                  Relatórios detalhados
                </ListItem>
                <ListItem>
                  <ListIcon as={FaTimes} color="red.500" />
                  Práticas com IA
                </ListItem>
              </List>
              <Button
                w="full"
                mt="auto"
                colorScheme="gray"
                variant="outline"
                as={NextLink}
                href="/signup"
              >
                Começar Grátis
              </Button>
            </VStack>
          </PriceWrapper>

          <PriceWrapper>
            <Box position="relative">
              <Box
                position="absolute"
                top="-16px"
                left="50%"
                transform="translateX(-50%)"
                bg="brand.500"
                color="white"
                rounded="full"
                fontSize="sm"
                fontWeight="bold"
                px={3}
                py={1}
                boxShadow="md"
              >
                MAIS POPULAR
              </Box>
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  Pro
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="5xl" fontWeight="900">
                    {annual ? 'R$39' : 'R$49'}
                  </Text>
                  <Text fontSize="xl" fontWeight="500" color="gray.500">
                    /{annual ? 'mês' : 'mês'}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {annual ? 'cobrado anualmente' : 'cobrado mensalmente'}
                </Text>
              </Box>
              <VStack
                bg={useColorModeValue('gray.50', 'gray.700')}
                py={4}
                px={12}
                spacing={3}
                borderBottomRadius={'xl'}
                height="350px"
              >
                <Text fontWeight="bold" textAlign="center" fontSize="md" w="full">
                  Todas as funcionalidades do Grátis, mais:
                </Text>
                <List spacing={3} textAlign="start" w="full">
                  <ListItem>
                    <ListIcon as={FaCheck} color="green.500" />
                    Entrevistas ilimitadas
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="green.500" />
                    Análise avançada de linguagem corporal
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="green.500" />
                    Relatórios detalhados
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="green.500" />
                    20 práticas com IA por mês
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheck} color="green.500" />
                    Suporte por e-mail
                  </ListItem>
                </List>
                <Button
                  w="full"
                  mt="auto"
                  colorScheme="brand"
                  as={NextLink}
                  href="/signup?plan=pro"
                >
                  Comece Agora
                </Button>
              </VStack>
            </Box>
          </PriceWrapper>

          <PriceWrapper>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                Enterprise
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="5xl" fontWeight="900">
                  {annual ? 'R$99' : 'R$129'}
                </Text>
                <Text fontSize="xl" fontWeight="500" color="gray.500">
                  /{annual ? 'mês' : 'mês'}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                {annual ? 'cobrado anualmente' : 'cobrado mensalmente'}
              </Text>
            </Box>
            <VStack
              bg={useColorModeValue('gray.50', 'gray.700')}
              py={4}
              px={12}
              spacing={3}
              borderBottomRadius={'xl'}
              height="350px"
            >
              <Text fontWeight="bold" textAlign="center" fontSize="md" w="full">
                Todas as funcionalidades do Pro, mais:
              </Text>
              <List spacing={3} textAlign="start" w="full">
                <ListItem>
                  <ListIcon as={FaCheck} color="green.500" />
                  Simulador de entrevistas personalizado
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color="green.500" />
                  Práticas ilimitadas com IA
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color="green.500" />
                  Feedback específico para indústria
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color="green.500" />
                  Coach pessoal (2 sessões/mês)
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color="green.500" />
                  Suporte prioritário
                </ListItem>
              </List>
              <Button
                w="full"
                mt="auto"
                colorScheme="brand"
                variant="outline"
                as={NextLink}
                href="/signup?plan=enterprise"
              >
                Escolha Enterprise
              </Button>
            </VStack>
          </PriceWrapper>
        </Stack>
      </Container>
    </Box>
  );
} 