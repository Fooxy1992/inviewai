import React, { useState, useEffect } from 'react';
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({ children, pageTitle = 'Dashboard' }: DashboardLayoutProps) {
  // Estados para controlar a visibilidade da barra lateral
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Detectar tamanho da tela
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  
  // Atualizar estados com base no tamanho da tela
  useEffect(() => {
    if (isDesktop !== undefined) {
      setIsMobileView(!isDesktop);
      setIsSidebarOpen(isDesktop);
    }
  }, [isDesktop]);
  
  // Função para alternar a barra lateral
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Função para mostrar a barra lateral (útil para navegação mobile)
  const showSidebar = () => {
    setIsSidebarOpen(true);
  };
  
  return (
    <Flex h="100vh" flexDirection="column">
      {/* Header do Dashboard */}
      <DashboardHeader 
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isMobileView={isMobileView}
        title={pageTitle}
      />
      
      {/* Área principal com sidebar e conteúdo */}
      <Flex flex="1" overflow="hidden">
        {/* Sidebar do Dashboard */}
        <DashboardSidebar 
          onClose={() => setIsSidebarOpen(false)}
          isLargeScreen={!isMobileView}
          isPermanentlyOpen={isSidebarOpen}
        />
        
        {/* Área de conteúdo principal */}
        <Box
          flex="1"
          overflowY="auto"
          transition="margin-left 0.3s ease"
          ml={isSidebarOpen && !isMobileView ? '250px' : 0}
          p={{ base: 3, md: 6 }}
          className="dashboard-content"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
} 