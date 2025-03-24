import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import NextLink from 'next/link';

export default function CtaSection() {
  return (
    <Box bg={useColorModeValue('brand.500', 'brand.600')} color="white">
      <Container maxW={'container.xl'} py={16}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={8}
          position="relative"
          zIndex={1}
        >
          {/* Elementos decorativos em SVG ou componentes geométricos */}
          <Box
            position="absolute"
            top="-30px"
            right="10%"
            width="150px"
            height="150px"
            bg="rgba(255,255,255,0.1)"
            borderRadius="full"
            zIndex={-1}
          />
          <Box
            position="absolute"
            bottom="-20px"
            left="5%"
            width="100px"
            height="100px"
            bg="rgba(255,255,255,0.1)"
            borderRadius="full"
            zIndex={-1}
          />
          
          <Stack spacing={4} maxW={{ base: 'full', md: '60%' }} textAlign={{ base: 'center', md: 'left' }}>
            <Heading
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              fontWeight="bold"
            >
              Pronto para Transformar suas Entrevistas?
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} opacity={0.9}>
              Junte-se a milhares de profissionais que já estão se destacando em entrevistas
              com a ajuda do InViewAI. Comece hoje e aumente suas chances de conquistar a vaga dos seus sonhos.
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="semibold">
              ✓ Instalação em 1 minuto  ✓ 14 dias de garantia  ✓ Suporte prioritário
            </Text>
          </Stack>
          
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            w={{ base: 'full', md: 'auto' }}
            justifyContent={{ base: 'center', md: 'flex-end' }}
          >
            <Button
              as={NextLink}
              href="/signup"
              bg="white"
              color="brand.600"
              _hover={{ bg: 'gray.100' }}
              size="lg"
              height="60px"
              px={8}
              fontSize="md"
              fontWeight="bold"
              rounded="full"
            >
              Comece Gratuitamente
            </Button>
            <Button
              as={NextLink}
              href="/demo"
              variant="outline"
              colorScheme="whiteAlpha"
              size="lg"
              height="60px"
              px={8}
              fontSize="md"
              fontWeight="semibold"
              rounded="full"
              rightIcon={<Icon as={FaArrowRight} />}
            >
              Ver Demo
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
} 