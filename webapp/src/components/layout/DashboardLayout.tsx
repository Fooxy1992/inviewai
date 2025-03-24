import React, { ReactNode, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Avatar,
  Link,
  Icon,
  useColorModeValue,
  useColorMode,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  HStack,
  CloseButton,
  Tooltip,
  Button,
  useBreakpointValue
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import {
  FiMenu,
  FiHome,
  FiUser,
  FiMic,
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSun,
  FiFileText,
  FiBarChart2,
  FiChevronDown
} from 'react-icons/fi';
import { IconType } from 'react-icons';

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ icon, children, href, isActive, ...rest }: NavItemProps) => {
  const activeColor = useColorModeValue('brand.500', 'brand.300');
  const activeBg = useColorModeValue('brand.50', 'gray.700');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <NextLink href={href} passHref legacyBehavior>
      <Link style={{ textDecoration: 'none' }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? activeBg : 'transparent'}
          color={isActive ? activeColor : inactiveColor}
          fontWeight={isActive ? 'bold' : 'normal'}
          _hover={{
            bg: hoverBg,
            color: isActive ? activeColor : inactiveColor,
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              as={icon}
              color={isActive ? activeColor : inactiveColor}
            />
          )}
          {children}
        </Flex>
      </Link>
    </NextLink>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { data: session } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontWeight="bold"
        color={useColorModeValue('brand.500', 'brand.300')}
      >
        InViewAI
      </Text>

      <HStack spacing={{ base: '0', md: '3' }}>
        <IconButton
          aria-label="Alternar modo escuro"
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          variant="ghost"
          onClick={toggleColorMode}
        />

        <Menu>
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: 'none' }}
          >
            <HStack spacing="4">
              <Avatar
                size={'sm'}
                src={session?.user?.image || undefined}
                name={session?.user?.name || undefined}
              />
              <VStack
                display={{ base: 'none', md: 'flex' }}
                alignItems="flex-start"
                spacing="1px"
                ml="2"
              >
                <Text fontSize="sm">{session?.user?.name || 'Usuário'}</Text>
                <Text fontSize="xs" color="gray.600">
                  {session?.user?.email || ''}
                </Text>
              </VStack>
              <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList
            bg={useColorModeValue('white', 'gray.900')}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <MenuItem onClick={() => router.push('/dashboard/perfil')}>
              <HStack>
                <Icon as={FiUser} mr="2" />
                <Text>Perfil</Text>
              </HStack>
            </MenuItem>
            <MenuItem onClick={() => router.push('/dashboard/configuracoes')}>
              <HStack>
                <Icon as={FiSettings} mr="2" />
                <Text>Configurações</Text>
              </HStack>
            </MenuItem>
            <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>
              <HStack>
                <Icon as={FiLogOut} mr="2" />
                <Text>Sair</Text>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={useColorModeValue('brand.500', 'brand.300')}
        >
          InViewAI
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <NavItem 
        icon={FiHome} 
        href="/dashboard" 
        isActive={router.pathname === '/dashboard'}
      >
        Dashboard
      </NavItem>
      <NavItem 
        icon={FiMic} 
        href="/dashboard/entrevistas" 
        isActive={isActive('/dashboard/entrevistas')}
      >
        Entrevistas
      </NavItem>
      <NavItem 
        icon={FiFileText} 
        href="/dashboard/modelos" 
        isActive={isActive('/dashboard/modelos')}
      >
        Modelos
      </NavItem>
      <NavItem 
        icon={FiBarChart2} 
        href="/dashboard/estatisticas" 
        isActive={isActive('/dashboard/estatisticas')}
      >
        Estatísticas
      </NavItem>
      <NavItem 
        icon={FiSettings} 
        href="/dashboard/configuracoes" 
        isActive={isActive('/dashboard/configuracoes')}
      >
        Configurações
      </NavItem>

      <Box position="absolute" bottom="4" width="100%">
        <Button
          leftIcon={<FiLogOut />}
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="ghost"
          width="80%"
          mx="8"
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 