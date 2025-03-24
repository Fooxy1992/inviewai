import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPlayCircle } from 'react-icons/fa';
import NextLink from 'next/link';

export default function HeroSection() {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} position="relative" overflow="hidden">
      {/* Fundo decorativo */}
      <Box
        position="absolute"
        top="0"
        left="0"
        height="100%"
        width="100%"
        zIndex="0"
        bgGradient="linear(to-r, brand.50, brand.100)"
        opacity="0.4"
      />
      
      {/* Círculos decorativos */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        height="300px"
        width="300px"
        bg="brand.100"
        borderRadius="full"
        opacity="0.2"
        zIndex="0"
      />
      <Box
        position="absolute"
        bottom="-50px"
        left="-50px"
        height="200px"
        width="200px"
        bg="secondary.100"
        borderRadius="full"
        opacity="0.3"
        zIndex="0"
      />
      
      <Container maxW="container.xl" py={{ base: 16, md: 24 }} position="relative" zIndex="1">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 10, md: 28 }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            >
              <Text
                as="span"
                position="relative"
                color="brand.600"
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'brand.100',
                  zIndex: -1,
                }}
              >
                InViewAI
              </Text>
              <br />
              <Text as="span" color={useColorModeValue('gray.700', 'gray.200')}>
                Prepare-se para entrevistas com IA
              </Text>
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize={{ base: 'lg', md: 'xl' }}>
              Receba feedback em tempo real durante suas entrevistas online. 
              Nossa extensão para Chrome analisa sua linguagem corporal, tom de voz
              e conteúdo para ajudá-lo a se destacar em suas próximas entrevistas.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                as={NextLink}
                href="/signup"
                rounded="full"
                size="lg"
                fontWeight="bold"
                px={6}
                colorScheme="brand"
                bg="brand.500"
                _hover={{ bg: 'brand.600' }}
              >
                Comece Gratuitamente
              </Button>
              <Button
                as={NextLink}
                href="/demo"
                rounded="full"
                size="lg"
                fontWeight="normal"
                px={6}
                leftIcon={<Icon as={FaPlayCircle} w={5} h={5} />}
                colorScheme="gray"
                variant="outline"
              >
                Ver Demo
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="full"
          >
            <Box
              position="relative"
              height={{ base: '300px', md: '400px' }}
              width="full"
              overflow="hidden"
              rounded="2xl"
              boxShadow="2xl"
            >
              <Image
                alt="Hero Image"
                fit="cover"
                align="center"
                w="100%"
                h="100%"
                src="/images/interview-hero.jpg"
              />
            </Box>
          </Flex>
        </Stack>
        
        {/* Métricas/Logos de empresas */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 4, md: 8 }}
          align="center"
          justify="center"
          mt={{ base: 5, md: 0 }}
          mb={{ base: 10, md: 0 }}
        >
          <Text fontWeight="semibold" fontSize="sm" color="gray.500">
            Utilizado por candidatos aplicando para:
          </Text>
          <Flex justify="center" align="center" wrap="wrap" gap={8}>
            <Image src="/images/company-logo1.png" alt="Company Logo" height="30px" opacity={0.7} />
            <Image src="/images/company-logo2.png" alt="Company Logo" height="30px" opacity={0.7} />
            <Image src="/images/company-logo3.png" alt="Company Logo" height="30px" opacity={0.7} />
            <Image src="/images/company-logo4.png" alt="Company Logo" height="30px" opacity={0.7} />
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
} 