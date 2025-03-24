import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Tooltip,
  Tag,
  TagLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { 
  FiSearch, FiMoreVertical, FiEye, FiEdit2, FiTrash2, 
  FiCalendar, FiClock, FiFilter, FiPlus 
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Tipos
type InterviewStatus = 'completed' | 'scheduled' | 'cancelled';

interface Interview {
  id: string;
  company: string;
  position: string;
  date: string;
  duration: number;
  score?: number;
  status: InterviewStatus;
  type: string;
  notes?: string;
  feedback?: string;
}

export default function Interviews() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  
  // Estado de filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Dados simulados de entrevistas
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      company: 'TechBrasil',
      position: 'Desenvolvedor Full Stack',
      date: '2023-05-15T14:00:00Z',
      duration: 60,
      score: 85,
      status: 'completed',
      type: 'Técnica',
      feedback: 'Demonstrou bom conhecimento técnico, mas poderia melhorar em arquitetura de sistemas.'
    },
    {
      id: '2',
      company: 'InnovaSoft',
      position: 'Front-end Developer',
      date: '2023-06-02T10:30:00Z',
      duration: 45,
      score: 78,
      status: 'completed',
      type: 'Técnica',
      feedback: 'Forte em React, mas precisa melhorar em otimização de performance.'
    },
    {
      id: '3',
      company: 'GlobalTech',
      position: 'Tech Lead',
      date: '2023-06-22T15:00:00Z',
      duration: 90,
      status: 'scheduled',
      type: 'Técnica',
      notes: 'Preparar perguntas sobre gestão de equipe e arquitetura de microsserviços.'
    },
    {
      id: '4',
      company: 'DataVision',
      position: 'Data Engineer',
      date: '2023-05-28T11:00:00Z',
      duration: 60,
      score: 92,
      status: 'completed',
      type: 'Técnica',
      feedback: 'Excelente conhecimento em pipelines de dados e SQL.'
    },
    {
      id: '5',
      company: 'StartupNexus',
      position: 'CTO',
      date: '2023-05-10T16:30:00Z',
      duration: 75,
      status: 'cancelled',
      type: 'Comportamental',
      notes: 'Empresa decidiu congelar contratações.'
    },
    {
      id: '6',
      company: 'TechBrasil',
      position: 'Desenvolvedor Full Stack Sr',
      date: '2023-07-05T13:00:00Z',
      duration: 60,
      status: 'scheduled',
      type: 'Comportamental',
      notes: 'Segunda entrevista após aprovação na técnica.'
    },
    {
      id: '7',
      company: 'BancoDigital',
      position: 'Arquiteto de Software',
      date: '2023-04-20T09:00:00Z',
      duration: 120,
      score: 88,
      status: 'completed',
      type: 'Técnica',
      feedback: 'Forte em design de sistemas e experiência com alta escala.'
    },
    {
      id: '8',
      company: 'EduTech',
      position: 'Desenvolvedor Back-end',
      date: '2023-07-12T11:30:00Z',
      duration: 60,
      status: 'scheduled',
      type: 'Técnica',
      notes: 'Revisar conhecimentos em Node.js e bancos de dados NoSQL.'
    }
  ]);
  
  // Cores para status
  const getStatusColor = (status: InterviewStatus) => {
    switch (status) {
      case 'completed': return 'green';
      case 'scheduled': return 'blue';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };
  
  // Tradução de status
  const getStatusText = (status: InterviewStatus) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'scheduled': return 'Agendada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };
  
  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Formatação de hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Aplicar filtros às entrevistas
  const filteredInterviews = interviews.filter(interview => {
    // Filtro de pesquisa
    const searchMatch = search === '' || 
      interview.company.toLowerCase().includes(search.toLowerCase()) ||
      interview.position.toLowerCase().includes(search.toLowerCase());
    
    // Filtro de status
    const statusMatch = statusFilter === '' || interview.status === statusFilter;
    
    // Filtro de tipo
    const typeMatch = typeFilter === '' || interview.type === typeFilter;
    
    // Filtro de data (simplificado - apenas mês/ano)
    let dateMatch = true;
    if (dateFilter) {
      const [year, month] = dateFilter.split('-');
      const interviewDate = new Date(interview.date);
      dateMatch = interviewDate.getFullYear() === parseInt(year) && 
                  interviewDate.getMonth() === parseInt(month) - 1;
    }
    
    return searchMatch && statusMatch && typeMatch && dateMatch;
  });
  
  // Ordenar por data (mais recentes primeiro)
  const sortedInterviews = [...filteredInterviews].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleViewInterview = (interview: Interview) => {
    router.push(`/dashboard/interviews/${interview.id}`);
  };
  
  const handleDeleteConfirm = (interview: Interview) => {
    setSelectedInterview(interview);
    onOpen();
  };
  
  const handleDelete = () => {
    if (selectedInterview) {
      setInterviews(interviews.filter(item => item.id !== selectedInterview.id));
    }
    onClose();
  };
  
  return (
    <>
      <Head>
        <title>Entrevistas - InViewAI</title>
        <meta name="description" content="Gerencie suas entrevistas e feedback" />
      </Head>
      
      <DashboardLayout pageTitle="Entrevistas">
        <Stack spacing={6}>
          {/* Cabeçalho com filtros */}
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            align={{ base: 'flex-start', md: 'center' }}
            gap={4}
          >
            <InputGroup maxW={{ base: '100%', md: '320px' }}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Pesquisar por empresa ou cargo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            
            <HStack spacing={4}>
              <Box>
                <Select 
                  placeholder="Status" 
                  size="md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  icon={<FiFilter />}
                >
                  <option value="">Todos</option>
                  <option value="completed">Concluídas</option>
                  <option value="scheduled">Agendadas</option>
                  <option value="cancelled">Canceladas</option>
                </Select>
              </Box>
              
              <Box>
                <Select 
                  placeholder="Tipo" 
                  size="md"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  icon={<FiFilter />}
                >
                  <option value="">Todos</option>
                  <option value="Técnica">Técnica</option>
                  <option value="Comportamental">Comportamental</option>
                  <option value="Case">Case</option>
                </Select>
              </Box>
              
              <Box>
                <Input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  placeholder="Selecione o mês"
                />
              </Box>
              
              <Button 
                leftIcon={<FiPlus />} 
                colorScheme="brand"
                onClick={() => router.push('/dashboard/interviews/new')}
              >
                Nova
              </Button>
            </HStack>
          </Flex>
          
          {/* Tabela de entrevistas */}
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            shadow="sm"
            rounded="lg"
            overflow="hidden"
          >
            <Table variant="simple">
              <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                <Tr>
                  <Th>Empresa</Th>
                  <Th>Cargo</Th>
                  <Th>Data</Th>
                  <Th>Hora</Th>
                  <Th>Duração</Th>
                  <Th>Tipo</Th>
                  <Th>Status</Th>
                  <Th>Pontuação</Th>
                  <Th width="80px">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedInterviews.length > 0 ? (
                  sortedInterviews.map((interview) => (
                    <Tr key={interview.id}>
                      <Td fontWeight="medium">{interview.company}</Td>
                      <Td>{interview.position}</Td>
                      <Td>
                        <HStack>
                          <FiCalendar size={14} />
                          <Text>{formatDate(interview.date)}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <FiClock size={14} />
                          <Text>{formatTime(interview.date)}</Text>
                        </HStack>
                      </Td>
                      <Td>{interview.duration} min</Td>
                      <Td>
                        <Tag
                          size="sm"
                          colorScheme={interview.type === 'Técnica' ? 'purple' : 'orange'}
                          borderRadius="full"
                        >
                          <TagLabel>{interview.type}</TagLabel>
                        </Tag>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={getStatusColor(interview.status)}
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {getStatusText(interview.status)}
                        </Badge>
                      </Td>
                      <Td>
                        {interview.score ? (
                          <Text fontWeight="bold" color={
                            interview.score >= 85 ? 'green.500' : 
                            interview.score >= 70 ? 'yellow.500' : 'red.500'
                          }>
                            {interview.score}%
                          </Text>
                        ) : (
                          <Text color="gray.400">-</Text>
                        )}
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            variant="ghost"
                            size="sm"
                            aria-label="Ações"
                          />
                          <MenuList>
                            <MenuItem 
                              icon={<FiEye />}
                              onClick={() => handleViewInterview(interview)}
                            >
                              Ver detalhes
                            </MenuItem>
                            <MenuItem 
                              icon={<FiEdit2 />}
                              onClick={() => router.push(`/dashboard/interviews/edit/${interview.id}`)}
                            >
                              Editar
                            </MenuItem>
                            <MenuItem 
                              icon={<FiTrash2 />} 
                              color="red.500"
                              onClick={() => handleDeleteConfirm(interview)}
                            >
                              Excluir
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={9} textAlign="center" py={10}>
                      <Text color="gray.500">
                        Nenhuma entrevista encontrada com os filtros selecionados
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Stack>
      </DashboardLayout>
      
      {/* Modal de confirmação de exclusão */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza que deseja excluir a entrevista com{' '}
            <Text as="span" fontWeight="bold">
              {selectedInterview?.company}
            </Text>{' '}
            para o cargo de{' '}
            <Text as="span" fontWeight="bold">
              {selectedInterview?.position}
            </Text>?
            
            <Text mt={4} color="red.500">
              Esta ação não pode ser desfeita.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 