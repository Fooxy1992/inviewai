import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Container,
  Stack,
  Button,
  Image,
  Link,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Collapse,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

// Links de navegação
const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: 'Como Funciona', href: '/how-it-works' },
  { label: 'Recursos', href: '/resources' },
  { label: 'Preços', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
];

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box as="header" position="relative" zIndex="10">
      <Container maxW="container.xl">
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={'center'}
          justify={'space-between'}
        >
          {/* Logo */}
          <Flex flex={{ base: 1 }} justify="flex-start">
            <Link as={NextLink} href="/">
              <Image
                src="/images/logo.png"
                alt="InViewAI Logo"
                h="40px"
                fallbackSrc="/images/logo-placeholder.png"
              />
            </Link>
          </Flex>

          {/* Menu Hamburguer (Mobile) */}
          <Flex
            flex={{ base: 'auto', md: 'none' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>

          {/* Links de navegação (Desktop) */}
          <Flex display={{ base: 'none', md: 'flex' }} flex={{ base: 1 }} justify="center">
            <Stack direction={'row'} spacing={6} align={'center'}>
              {NAV_ITEMS.map((navItem) => (
                <Link
                  key={navItem.label}
                  as={NextLink}
                  href={navItem.href}
                  p={2}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={useColorModeValue('gray.600', 'gray.200')}
                  _hover={{
                    textDecoration: 'none',
                    color: useColorModeValue('brand.500', 'white'),
                  }}
                >
                  {navItem.label}
                </Link>
              ))}
            </Stack>
          </Flex>

          {/* Botões de autenticação (Desktop) */}
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            display={{ base: 'none', md: 'flex' }}
          >
            <Button
              as={NextLink}
              fontSize={'sm'}
              fontWeight={400}
              variant={'link'}
              href={'/login'}
            >
              Entrar
            </Button>
            <Button
              as={NextLink}
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              colorScheme={'brand'}
              href={'/register'}
            >
              Criar Conta
            </Button>
          </Stack>
        </Flex>

        {/* Menu Mobile */}
        <Collapse in={isOpen} animateOpacity>
          <Stack
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{ md: 'none' }}
            shadow="md"
            borderRadius="md"
          >
            {NAV_ITEMS.map((navItem) => (
              <Link
                key={navItem.label}
                as={NextLink}
                href={navItem.href}
                py={2}
                fontWeight={500}
                color={useColorModeValue('gray.600', 'gray.200')}
                _hover={{
                  textDecoration: 'none',
                  color: useColorModeValue('brand.500', 'white'),
                }}
              >
                {navItem.label}
              </Link>
            ))}
            <Stack spacing={4} pt={4} align="start">
              <Button
                as={NextLink}
                w="full"
                fontSize={'sm'}
                fontWeight={600}
                variant="outline"
                colorScheme="brand"
                href={'/login'}
              >
                Entrar
              </Button>
              <Button
                as={NextLink}
                w="full"
                fontSize={'sm'}
                fontWeight={600}
                colorScheme={'brand'}
                href={'/register'}
              >
                Criar Conta
              </Button>
            </Stack>
          </Stack>
        </Collapse>
      </Container>
    </Box>
  );
} 