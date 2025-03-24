import React from 'react';
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  Text,
  BoxProps,
  useColorModeValue,
  Image,
  Link,
  VStack,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  FiHome,
  FiTrendingUp,
  FiCalendar,
  FiSettings,
  FiUsers,
  FiClipboard,
  FiMessageSquare,
  FiCreditCard,
  FiHelpCircle,
  FiLogOut,
} from 'react-icons/fi';
import { IconType } from 'react-icons';

interface NavItemProps extends BoxProps {
  icon: IconType;
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  isLargeScreen?: boolean;
  isPermanentlyOpen?: boolean;
}

// Item de navegação
const NavItem = ({ icon, children, href, isActive, isCollapsed, ...rest }: NavItemProps) => {
  return (
    <Tooltip 
      label={isCollapsed ? children : ''} 
      placement="right" 
      hasArrow 
      isDisabled={!isCollapsed}
    >
      <Box>
        <NextLink href={href} passHref legacyBehavior>
          <Box
            as="a"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
          >
            <Flex
              align="center"
              p="4"
              mx={isCollapsed ? "1" : "4"}
              borderRadius="lg"
              role="group"
              cursor="pointer"
              bg={isActive ? 'brand.500' : 'transparent'}
              color={isActive ? 'white' : useColorModeValue('gray.600', 'gray.400')}
              _hover={{
                bg: isActive ? 'brand.600' : useColorModeValue('brand.50', 'gray.700'),
                color: isActive ? 'white' : useColorModeValue('brand.600', 'white'),
              }}
              {...rest}
            >
              <Icon
                mr={isCollapsed ? "0" : "4"}
                fontSize="16"
                as={icon}
              />
              {!isCollapsed && (
                <Text>{children}</Text>
              )}
            </Flex>
          </Box>
        </NextLink>
      </Box>
    </Tooltip>
  );
};

// Componente da barra lateral
export default function DashboardSidebar({ onClose, isLargeScreen, isPermanentlyOpen = true, ...rest }: SidebarProps) {
  const router = useRouter();
  const isCollapsed = isLargeScreen && !isPermanentlyOpen;
  
  // Verifica se o item da navegação está ativo
  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  
  // Itens de navegação
  const navItems = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'Entrevistas', icon: FiClipboard, href: '/dashboard/interviews' },
    { name: 'Análise', icon: FiTrendingUp, href: '/dashboard/analytics' },
    { name: 'Praticar', icon: FiMessageSquare, href: '/dashboard/practice' },
    { name: 'Agenda', icon: FiCalendar, href: '/dashboard/calendar' },
    { name: 'Conexões', icon: FiUsers, href: '/dashboard/connections' },
  ];
  
  // Itens de configuração
  const configItems = [
    { name: 'Configurações', icon: FiSettings, href: '/dashboard/settings' },
    { name: 'Assinatura', icon: FiCreditCard, href: '/dashboard/billing' },
    { name: 'Ajuda', icon: FiHelpCircle, href: '/dashboard/help' },
  ];

  return (
    <Box
      transition="width 0.3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={isCollapsed ? '70px' : '280px'}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent={isCollapsed ? "center" : "space-between"} mx={isCollapsed ? "0" : "8"}>
        {!isCollapsed ? (
          <>
            <NextLink href="/" passHref legacyBehavior>
              <Box as="a">
                <Image
                  src="/images/logo.png"
                  alt="InViewAI Logo"
                  h="30px"
                  fallbackSrc="/images/logo-placeholder.png"
                />
              </Box>
            </NextLink>
            {!isLargeScreen && <CloseButton onClick={onClose} />}
          </>
        ) : (
          <NextLink href="/" passHref legacyBehavior>
            <Box as="a">
              <Image
                src="/images/logo-icon.png"
                alt="InViewAI"
                h="30px"
                fallbackSrc="/images/logo-placeholder.png"
              />
            </Box>
          </NextLink>
        )}
      </Flex>

      <VStack align="stretch" spacing={1} mt={4}>
        {/* Seção principal de navegação */}
        {navItems.map((item) => (
          <NavItem 
            key={item.name} 
            icon={item.icon} 
            href={item.href} 
            isActive={isActive(item.href)}
            isCollapsed={isCollapsed}
          >
            {item.name}
          </NavItem>
        ))}
        
        <Divider my={4} borderColor={useColorModeValue('gray.200', 'gray.700')} />
        
        {/* Seção de configurações */}
        {configItems.map((item) => (
          <NavItem 
            key={item.name} 
            icon={item.icon} 
            href={item.href} 
            isActive={isActive(item.href)}
            isCollapsed={isCollapsed}
          >
            {item.name}
          </NavItem>
        ))}
        
        {/* Botão de logout */}
        <Box mt="auto" mb={8} px={isCollapsed ? 1 : 4}>
          <Tooltip 
            label={isCollapsed ? "Sair" : ''} 
            placement="right" 
            hasArrow 
            isDisabled={!isCollapsed}
          >
            <Flex
              align="center"
              p="4"
              mx={isCollapsed ? "1" : "0"}
              borderRadius="lg"
              role="group"
              cursor="pointer"
              color={useColorModeValue('red.500', 'red.300')}
              _hover={{
                bg: useColorModeValue('red.50', 'rgba(254, 178, 178, 0.16)'),
              }}
              onClick={() => console.log('Logout')}
            >
              <Icon
                mr={isCollapsed ? "0" : "4"}
                fontSize="16"
                as={FiLogOut}
              />
              {!isCollapsed && (
                <Text>Sair</Text>
              )}
            </Flex>
          </Tooltip>
        </Box>
      </VStack>
    </Box>
  );
} 