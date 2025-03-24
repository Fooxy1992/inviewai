import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Avatar,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  HStack,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronRight,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiX,
  FiChevronDown,
} from 'react-icons/fi';
import NextLink from 'next/link';

// Interface para props do Header
export interface HeaderProps {
  showSidebar: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobileView: boolean;
  title?: string;
}

export default function DashboardHeader({
  showSidebar,
  toggleSidebar,
  isSidebarOpen,
  isMobileView,
  title = 'Dashboard',
}: HeaderProps) {
  // Cores de tema
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  
  // Estado para o menu de notificações
  const { isOpen, onToggle } = useDisclosure();
  
  // Notificações de exemplo
  const notifications = [
    { id: 1, text: 'Nova entrevista agendada com TechSoft', isRead: false },
    { id: 2, text: 'Feedback da entrevista na DataCorp disponível', isRead: false },
    { id: 3, text: 'Lembrete: Preparação para entrevista amanhã', isRead: true },
  ];
  
  // Número de notificações não lidas
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      py={2}
      px={4}
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      h="60px"
      position="sticky"
      top={0}
      zIndex={100}
    >
      {/* Menu mobile e toggle para sidebar */}
      <HStack spacing={2}>
        {isMobileView ? (
          <IconButton
            aria-label="Abrir menu"
            icon={<FiMenu />}
            size="md"
            variant="ghost"
            onClick={showSidebar}
          />
        ) : (
          <IconButton
            aria-label="Alternar barra lateral"
            icon={isSidebarOpen ? <FiChevronRight /> : <FiMenu />}
            size="md"
            variant="ghost"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Breadcrumbs para navegação */}
        <Breadcrumb separator={<FiChevronRight color="gray.500" />} display={{ base: 'none', md: 'flex' }}>
          <BreadcrumbItem>
            <NextLink href="/dashboard" passHref legacyBehavior>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>
          
          {title !== 'Dashboard' && (
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">{title}</BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </Breadcrumb>
        
        <Text display={{ base: 'block', md: 'none' }} fontSize="lg" fontWeight="bold">
          {title}
        </Text>
      </HStack>
      
      {/* Busca, notificações e perfil */}
      <HStack spacing={2}>
        {/* Busca */}
        <Box display={{ base: 'none', md: 'block' }} width="300px">
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Buscar..." rounded="md" />
            <InputRightElement display={{ base: 'none', lg: 'flex' }}>
              <Text fontSize="xs" color="gray.500" pr={2}>⌘K</Text>
            </InputRightElement>
          </InputGroup>
        </Box>
        
        <IconButton
          aria-label="Buscar"
          icon={<FiSearch />}
          size="sm"
          variant="ghost"
          display={{ base: 'flex', md: 'none' }}
        />
        
        {/* Notificações */}
        <Menu>
          <MenuButton
            as={IconButton}
            size="sm"
            variant="ghost"
            aria-label="Notificações"
            icon={
              <>
                <FiBell />
                {unreadCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-5px"
                    right="-5px"
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="0.6em"
                    minW="1.4em"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </>
            }
          />
          <MenuList zIndex={100} minW="320px" p={2}>
            <Flex justify="space-between" align="center" p={2}>
              <Text fontWeight="medium">Notificações</Text>
              <Button size="xs" variant="ghost">
                Marcar todas como lidas
              </Button>
            </Flex>
            <MenuDivider />
            
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <MenuItem key={notification.id} py={2} _hover={{ bg: 'gray.50' }}>
                    <Flex align="start" w="100%">
                      <Box mr={2} mt={1}>
                        <Badge 
                          borderRadius="full" 
                          bg={notification.isRead ? 'gray.100' : 'brand.500'} 
                          w="8px" 
                          h="8px"
                        />
                      </Box>
                      <Text fontSize="sm" noOfLines={2}>
                        {notification.text}
                      </Text>
                    </Flex>
                  </MenuItem>
                ))}
                <MenuDivider />
                <MenuItem justifyContent="center">
                  <Text fontSize="sm" color="brand.500">
                    Ver todas as notificações
                  </Text>
                </MenuItem>
              </>
            ) : (
              <Box p={4} textAlign="center">
                <Text color="gray.500" fontSize="sm">
                  Sem notificações
                </Text>
              </Box>
            )}
          </MenuList>
        </Menu>
        
        {/* Perfil de usuário */}
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            p={0}
            rightIcon={<FiChevronDown size="1em" />}
            _hover={{ bg: 'transparent' }}
          >
            <Avatar size="sm" name="Ana Silva" src="/images/ana-profile.jpg" />
          </MenuButton>
          <MenuList zIndex={100}>
            <MenuItem icon={<FiUser />}>Perfil</MenuItem>
            <MenuItem icon={<FiSettings />}>Configurações</MenuItem>
            <MenuItem icon={<FiHelpCircle />}>Suporte</MenuItem>
            <MenuDivider />
            <MenuItem icon={<FiLogOut />} color="red.500">
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
} 