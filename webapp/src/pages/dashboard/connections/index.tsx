import React, { useState } from 'react';
import Head from 'next/head';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
  useDisclosure,
  Badge,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiMessageSquare,
  FiCalendar,
  FiLink,
  FiMail,
  FiMoreVertical,
  FiGlobe,
  FiCheck,
  FiX,
  FiLinkedin,
  FiGithub,
  FiClipboard,
  FiSend,
  FiPhone,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Interface para conexões
interface Connection {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  tags: string[];
  notes?: string;
  status: 'connected' | 'pending' | 'received';
  lastInteraction?: Date;
}

// Dados simulados
const connectionsData: Connection[] = [
  {
    id: '1',
    name: 'Amanda Silva',
    role: 'Recrutadora Senior',
    company: 'TechBrasil',
    avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
    location: 'São Paulo, SP',
    email: 'amanda.silva@techbrasil.com',
    linkedin: 'linkedin.com/in/amandasilva',
    tags: ['Recrutamento', 'Tech', 'RH'],
    status: 'connected',
    lastInteraction: new Date(2023, 5, 15),
    notes: 'Recrutadora especializada em vagas de desenvolvimento web e mobile'
  },
  {
    id: '2',
    name: 'Ricardo Gomes',
    role: 'Gerente de Produto',
    company: 'Inovação Digital',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'Rio de Janeiro, RJ',
    email: 'ricardo.gomes@inovacaodigital.com',
    linkedin: 'linkedin.com/in/ricardogomes',
    tags: ['Produto', 'Gestão', 'Agile'],
    status: 'connected',
    lastInteraction: new Date(2023, 6, 10)
  },
  {
    id: '3',
    name: 'Juliana Martins',
    role: 'CTO',
    company: 'Startup Hub',
    avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
    location: 'Florianópolis, SC',
    email: 'juliana.martins@startuphub.com',
    linkedin: 'linkedin.com/in/julianamartins',
    github: 'github.com/julianamt',
    tags: ['Liderança', 'Desenvolvimento', 'CTO'],
    status: 'pending',
    notes: 'Conversei com ela no evento de tecnologia em março'
  },
  {
    id: '4',
    name: 'Fernando Costa',
    role: 'Desenvolvedor Sênior',
    company: 'CodeMasters',
    avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    location: 'Porto Alegre, RS',
    email: 'fernando.costa@codemasters.com',
    linkedin: 'linkedin.com/in/fernandocosta',
    github: 'github.com/fecosta',
    tags: ['Fullstack', 'React', 'Node'],
    status: 'received',
    lastInteraction: new Date(2023, 7, 5)
  },
  {
    id: '5',
    name: 'Luiza Mendes',
    role: 'UX/UI Designer',
    company: 'Design Labs',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    location: 'Belo Horizonte, MG',
    email: 'luiza.mendes@designlabs.com',
    website: 'luizamendes.design',
    linkedin: 'linkedin.com/in/luizamendes',
    tags: ['Design', 'UX', 'UI'],
    status: 'connected',
    lastInteraction: new Date(2023, 4, 28)
  },
  {
    id: '6',
    name: 'Gabriel Santos',
    role: 'DevOps Engineer',
    company: 'CloudTech',
    avatarUrl: 'https://randomuser.me/api/portraits/men/92.jpg',
    location: 'São Paulo, SP',
    email: 'gabriel.santos@cloudtech.com',
    github: 'github.com/gabsantos',
    tags: ['DevOps', 'AWS', 'Kubernetes'],
    status: 'connected',
    lastInteraction: new Date(2023, 3, 12)
  }
];

// Componente para exibir um cartão de conexão
const ConnectionCard: React.FC<{
  connection: Connection;
  onMessage: (connection: Connection) => void;
  onSchedule: (connection: Connection) => void;
  onViewProfile: (connection: Connection) => void;
}> = ({ connection, onMessage, onSchedule, onViewProfile }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const tagBg = useColorModeValue('gray.100', 'gray.700');
  
  let statusColor = 'gray.500';
  let statusText = '';
  
  switch (connection.status) {
    case 'connected':
      statusColor = 'green.500';
      statusText = 'Conectado';
      break;
    case 'pending':
      statusColor = 'orange.500';
      statusText = 'Pendente';
      break;
    case 'received':
      statusColor = 'blue.500';
      statusText = 'Solicitação recebida';
      break;
  }
  
  return (
    <Card bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden">
      <CardBody p={4}>
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'start' }}>
          <Avatar 
            size="lg" 
            name={connection.name} 
            src={connection.avatarUrl} 
            mb={{ base: 3, md: 0 }} 
            mr={{ base: 0, md: 4 }}
          />
          
          <Box flex="1" textAlign={{ base: 'center', md: 'left' }}>
            <Flex 
              align={{ base: 'center', md: 'start' }}
              direction={{ base: 'column', md: 'row' }}
              justify={{ base: 'center', md: 'space-between' }}
              mb={2}
            >
              <Box>
                <Heading size="md" fontWeight="bold" mb={1}>
                  {connection.name}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {connection.role} • {connection.company}
                </Text>
              </Box>
              
              <Badge colorScheme={connection.status === 'connected' ? 'green' : (connection.status === 'pending' ? 'orange' : 'blue')} 
                px={2} py={1} borderRadius="full" mt={{ base: 2, md: 0 }}>
                {statusText}
              </Badge>
            </Flex>
            
            {connection.location && (
              <Text fontSize="sm" mb={2}>
                <Icon as={FiGlobe} mr={1} color="gray.500" />
                {connection.location}
              </Text>
            )}
            
            <HStack flexWrap="wrap" spacing={2} justify={{ base: 'center', md: 'start' }} mb={3}>
              {connection.tags.map((tag, index) => (
                <Tag key={index} size="sm" bg={tagBg} borderRadius="full" mt={1}>
                  {tag}
                </Tag>
              ))}
            </HStack>
            
            <Flex 
              mt={3} 
              justify={{ base: 'center', md: 'start' }} 
              align="center"
              wrap="wrap"
              gap={2}
            >
              {connection.status === 'connected' && (
                <>
                  <Button
                    size="sm"
                    leftIcon={<FiMessageSquare />}
                    colorScheme="brand"
                    variant="outline"
                    onClick={() => onMessage(connection)}
                  >
                    Mensagem
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<FiCalendar />}
                    colorScheme="brand"
                    variant="outline"
                    onClick={() => onSchedule(connection)}
                  >
                    Agendar
                  </Button>
                </>
              )}
              
              {connection.status === 'received' && (
                <HStack>
                  <IconButton
                    aria-label="Aceitar conexão"
                    icon={<FiCheck />}
                    colorScheme="green"
                    size="sm"
                  />
                  <IconButton
                    aria-label="Recusar conexão"
                    icon={<FiX />}
                    colorScheme="red"
                    size="sm"
                  />
                </HStack>
              )}
              
              <IconButton
                aria-label="Ver perfil"
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
                onClick={() => onViewProfile(connection)}
              />
            </Flex>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

// Componente de Sugestões de Conexão
const ConnectionSuggestions: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // Dados simulados para sugestões
  const suggestions = [
    {
      id: 's1',
      name: 'Marcos Oliveira',
      role: 'Senior Frontend Developer',
      company: 'WebDevPro',
      avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
      mutualConnections: 4
    },
    {
      id: 's2',
      name: 'Camila Rodrigues',
      role: 'Tech Recruiter',
      company: 'Global Talent',
      avatarUrl: 'https://randomuser.me/api/portraits/women/54.jpg',
      mutualConnections: 2
    },
    {
      id: 's3',
      name: 'Paulo Silveira',
      role: 'CTO',
      company: 'Alura',
      avatarUrl: 'https://randomuser.me/api/portraits/men/39.jpg',
      mutualConnections: 8
    }
  ];
  
  return (
    <Card bg={cardBg}>
      <CardHeader pb={0}>
        <Heading size="md">Pessoas que você pode conhecer</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {suggestions.map(suggestion => (
            <Flex key={suggestion.id} justify="space-between" align="center">
              <Flex align="center">
                <Avatar size="sm" name={suggestion.name} src={suggestion.avatarUrl} mr={3} />
                <Box>
                  <Text fontWeight="medium">{suggestion.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {suggestion.role} • {suggestion.company}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {suggestion.mutualConnections} conexões em comum
                  </Text>
                </Box>
              </Flex>
              <Button size="sm" leftIcon={<FiUserPlus />} colorScheme="brand" variant="outline">
                Conectar
              </Button>
            </Flex>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};

// Página principal de Conexões
export default function Connections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'connected' | 'pending' | 'received'>('all');
  const [connections, setConnections] = useState<Connection[]>(connectionsData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Filtrar conexões com base na busca e filtro ativo
  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          connection.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          connection.role.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesFilter = activeFilter === 'all' || connection.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  // Funções para manipular interações com conexões
  const handleMessage = (connection: Connection) => {
    console.log('Mensagem para', connection.name);
    // Implementação de envio de mensagem
  };
  
  const handleSchedule = (connection: Connection) => {
    console.log('Agendar com', connection.name);
    // Redirecionar para a página de agendamento
  };
  
  const handleViewProfile = (connection: Connection) => {
    setSelectedConnection(connection);
    onOpen();
  };
  
  // Modal de detalhes do perfil
  const ProfileModal = () => {
    if (!selectedConnection) return null;
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Perfil da Conexão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" mb={6}>
              <Avatar
                size="xl"
                name={selectedConnection.name}
                src={selectedConnection.avatarUrl}
                mb={4}
              />
              <Heading size="lg">{selectedConnection.name}</Heading>
              <Text color="gray.500" mb={2}>
                {selectedConnection.role} • {selectedConnection.company}
              </Text>
              <Text fontSize="sm">
                <Icon as={FiGlobe} mr={1} />
                {selectedConnection.location || 'Localização não informada'}
              </Text>
            </Flex>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={6}>
              <Box>
                <Heading size="sm" mb={3}>Informações de Contato</Heading>
                <VStack align="start" spacing={2}>
                  {selectedConnection.email && (
                    <HStack>
                      <Icon as={FiMail} color="gray.500" />
                      <Text>{selectedConnection.email}</Text>
                    </HStack>
                  )}
                  {selectedConnection.phone && (
                    <HStack>
                      <Icon as={FiPhone} color="gray.500" />
                      <Text>{selectedConnection.phone}</Text>
                    </HStack>
                  )}
                  {selectedConnection.website && (
                    <HStack>
                      <Icon as={FiLink} color="gray.500" />
                      <Link href={`https://${selectedConnection.website}`} isExternal color="brand.500">
                        {selectedConnection.website}
                      </Link>
                    </HStack>
                  )}
                </VStack>
              </Box>
              
              <Box>
                <Heading size="sm" mb={3}>Redes Sociais</Heading>
                <VStack align="start" spacing={2}>
                  {selectedConnection.linkedin && (
                    <HStack>
                      <Icon as={FiLinkedin} color="gray.500" />
                      <Link href={`https://${selectedConnection.linkedin}`} isExternal color="brand.500">
                        LinkedIn
                      </Link>
                    </HStack>
                  )}
                  {selectedConnection.github && (
                    <HStack>
                      <Icon as={FiGithub} color="gray.500" />
                      <Link href={`https://${selectedConnection.github}`} isExternal color="brand.500">
                        GitHub
                      </Link>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </SimpleGrid>
            
            <Box mb={6}>
              <Heading size="sm" mb={3}>Tags</Heading>
              <HStack flexWrap="wrap">
                {selectedConnection.tags.map((tag, index) => (
                  <Tag key={index} size="md" borderRadius="full" colorScheme="brand" my={1}>
                    {tag}
                  </Tag>
                ))}
              </HStack>
            </Box>
            
            {selectedConnection.notes && (
              <Box mb={6}>
                <Heading size="sm" mb={3}>Anotações</Heading>
                <Box p={3} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md">
                  <Text>{selectedConnection.notes}</Text>
                </Box>
              </Box>
            )}
            
            <Divider my={4} />
            
            <Box mb={4}>
              <Heading size="sm" mb={3}>Enviar mensagem</Heading>
              <InputGroup>
                <Input placeholder="Escreva uma mensagem..." pr="4.5rem" />
                <Button
                  h="1.75rem"
                  size="sm"
                  colorScheme="brand"
                  position="absolute"
                  right="8px"
                  top="8px"
                  leftIcon={<FiSend />}
                >
                  Enviar
                </Button>
              </InputGroup>
            </Box>
          </ModalBody>
          
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                leftIcon={<FiCalendar />}
                colorScheme="brand"
                onClick={() => {
                  onClose();
                  handleSchedule(selectedConnection);
                }}
              >
                Agendar Entrevista
              </Button>
              <Button
                leftIcon={<FiClipboard />}
                variant="outline"
              >
                Adicionar Nota
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  return (
    <DashboardLayout>
      <Head>
        <title>Conexões | InViewAI</title>
      </Head>
      <Box p={5} bg={bgColor} minH="calc(100vh - 80px)">
        <Flex mb={6} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
          <Box mb={{ base: 4, md: 0 }}>
            <Heading size="lg">Conexões</Heading>
            <Text color="gray.500">Gerencie seu network profissional</Text>
          </Box>
          
          <HStack spacing={3}>
            <Button
              leftIcon={<FiUserPlus />}
              colorScheme="brand"
            >
              Nova Conexão
            </Button>
          </HStack>
        </Flex>
        
        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={6}>
          <GridItem>
            <Card mb={6}>
              <CardBody>
                <HStack mb={4} justify="space-between" wrap="wrap" spacing={3}>
                  <InputGroup maxW={{ base: '100%', md: '320px' }}>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar conexões..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                  
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant={activeFilter === 'all' ? 'solid' : 'outline'}
                      colorScheme="brand"
                      onClick={() => setActiveFilter('all')}
                    >
                      Todas
                    </Button>
                    <Button
                      size="sm"
                      variant={activeFilter === 'connected' ? 'solid' : 'outline'}
                      colorScheme="brand"
                      onClick={() => setActiveFilter('connected')}
                    >
                      Conectadas
                    </Button>
                    <Button
                      size="sm"
                      variant={activeFilter === 'pending' ? 'solid' : 'outline'}
                      colorScheme="brand"
                      onClick={() => setActiveFilter('pending')}
                    >
                      Pendentes
                    </Button>
                    <Button
                      size="sm"
                      variant={activeFilter === 'received' ? 'solid' : 'outline'}
                      colorScheme="brand"
                      onClick={() => setActiveFilter('received')}
                    >
                      Recebidas
                    </Button>
                  </HStack>
                </HStack>
                
                {filteredConnections.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {filteredConnections.map(connection => (
                      <ConnectionCard
                        key={connection.id}
                        connection={connection}
                        onMessage={handleMessage}
                        onSchedule={handleSchedule}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Flex direction="column" align="center" justify="center" py={10}>
                    <Icon as={FiUsers} boxSize={10} color="gray.400" mb={4} />
                    <Heading size="md" mb={2}>Nenhuma conexão encontrada</Heading>
                    <Text textAlign="center" color="gray.500">
                      {searchQuery 
                        ? `Não encontramos conexões correspondentes a "${searchQuery}".` 
                        : 'Comece a adicionar conexões para expandir sua rede profissional.'}
                    </Text>
                    
                    {searchQuery && (
                      <Button
                        mt={4}
                        leftIcon={<FiUserPlus />}
                        colorScheme="brand"
                      >
                        Adicionar Nova Conexão
                      </Button>
                    )}
                  </Flex>
                )}
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <ConnectionSuggestions />
            
            <Card mt={6}>
              <CardHeader pb={0}>
                <Heading size="md">Estatísticas</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Total de Conexões</Text>
                    <Heading size="lg">{connections.filter(c => c.status === 'connected').length}</Heading>
                  </Box>
                  
                  <Box>
                    <Text color="gray.500" fontSize="sm">Pendentes</Text>
                    <Heading size="lg">{connections.filter(c => c.status === 'pending').length}</Heading>
                  </Box>
                  
                  <Box>
                    <Text color="gray.500" fontSize="sm">Recebidas</Text>
                    <Heading size="lg">{connections.filter(c => c.status === 'received').length}</Heading>
                  </Box>
                  
                  <Divider />
                  
                  <Text fontSize="sm" color="gray.500">
                    Uma boa rede de contatos aumenta suas chances de conseguir entrevistas em até 70%.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
      
      <ProfileModal />
    </DashboardLayout>
  );
} 