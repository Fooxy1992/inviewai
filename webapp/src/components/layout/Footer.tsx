import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Link,
  Image,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import NextLink from 'next/link';

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box
      bg="gray.50"
      color="gray.700"
      borderTop="1px"
      borderColor="gray.200"
    >
      <Container as={Stack} maxW={'container.xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Link as={NextLink} href="/">
                <Image src="/images/logo.png" alt="InViewAI Logo" height="40px" />
              </Link>
            </Box>
            <Text fontSize={'sm'}>
              © 2024 InViewAI. Todos os direitos reservados.
            </Text>
            <HStack spacing={4}>
              <IconButton
                aria-label="Twitter"
                variant="ghost"
                size="md"
                colorScheme="gray"
                icon={<FaTwitter />}
                as="a"
                href="https://twitter.com/inviewai"
                target="_blank"
              />
              <IconButton
                aria-label="LinkedIn"
                variant="ghost"
                size="md"
                colorScheme="gray"
                icon={<FaLinkedin />}
                as="a"
                href="https://linkedin.com/company/inviewai"
                target="_blank"
              />
              <IconButton
                aria-label="GitHub"
                variant="ghost"
                size="md"
                colorScheme="gray"
                icon={<FaGithub />}
                as="a"
                href="https://github.com/inviewai"
                target="_blank"
              />
              <IconButton
                aria-label="Instagram"
                variant="ghost"
                size="md"
                colorScheme="gray"
                icon={<FaInstagram />}
                as="a"
                href="https://instagram.com/inviewai"
                target="_blank"
              />
            </HStack>
          </Stack>
          
          <Stack align={'flex-start'}>
            <ListHeader>Produto</ListHeader>
            <Link as={NextLink} href="/features">Recursos</Link>
            <Link as={NextLink} href="/pricing">Preços</Link>
            <Link as={NextLink} href="/extension">Extensão Chrome</Link>
            <Link as={NextLink} href="/roadmap">Roadmap</Link>
            <Link as={NextLink} href="/release-notes">Notas de Lançamento</Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <ListHeader>Empresa</ListHeader>
            <Link as={NextLink} href="/about">Sobre Nós</Link>
            <Link as={NextLink} href="/careers">Carreiras</Link>
            <Link as={NextLink} href="/blog">Blog</Link>
            <Link as={NextLink} href="/contact">Contato</Link>
            <Link as={NextLink} href="/press">Imprensa</Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <ListHeader>Suporte</ListHeader>
            <Link as={NextLink} href="/help">Central de Ajuda</Link>
            <Link as={NextLink} href="/faq">Perguntas Frequentes</Link>
            <Link as={NextLink} href="/privacy">Política de Privacidade</Link>
            <Link as={NextLink} href="/terms">Termos de Serviço</Link>
            <Link as={NextLink} href="/accessibility">Acessibilidade</Link>
          </Stack>
        </SimpleGrid>
      </Container>
      
      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor="gray.200"
      >
        <Container
          as={Stack}
          maxW={'container.xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}
        >
          <Text fontSize="sm">
            Feito com ❤️ no Brasil para ajudar candidatos em todo o mundo.
          </Text>
          <Stack direction={'row'} spacing={6}>
            <Link href="/privacy" fontSize="sm">Privacidade</Link>
            <Link href="/terms" fontSize="sm">Termos</Link>
            <Link href="/cookies" fontSize="sm">Cookies</Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
} 