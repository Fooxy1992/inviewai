import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiClock, 
  FiPlus, 
  FiChevronLeft, 
  FiChevronRight,
  FiVideo, 
  FiUser, 
  FiStar,
  FiTrash,
  FiEdit,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Interface para eventos do calendário
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'entrevista' | 'pratica' | 'feedback' | 'outro';
  description?: string;
  participants?: string[];
}

// Componente calendário mensal
const MonthlyCalendar: React.FC<{ 
  events: CalendarEvent[],
  currentDate: Date,
  onEventClick: (event: CalendarEvent) => void,
  onDateClick: (date: Date) => void
}> = ({ events, currentDate, onEventClick, onDateClick }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const todayBgColor = useColorModeValue('brand.50', 'brand.900');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Obter dias do mês atual
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  // Obter primeiro dia da semana do mês
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  
  // Preparar array com os dias do mês
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => 0);
  
  // Função para verificar se é o dia atual
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Função para obter eventos de um dia específico
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };
  
  // Nomes dos dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Obter nome do mês e ano atuais
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return (
    <Box>
      <Grid
        templateColumns="repeat(7, 1fr)"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        bg={bgColor}
      >
        {/* Dias da semana */}
        {weekDays.map((day, index) => (
          <GridItem
            key={index}
            p={2}
            textAlign="center"
            fontWeight="bold"
            borderBottomWidth="1px"
            borderColor={borderColor}
            bg={useColorModeValue('gray.50', 'gray.700')}
          >
            <Text fontSize="sm">{day}</Text>
          </GridItem>
        ))}
        
        {/* Dias em branco antes do início do mês */}
        {blanks.map((_, index) => (
          <GridItem
            key={`blank-${index}`}
            p={2}
            borderWidth="0.5px"
            borderColor={borderColor}
            minHeight="100px"
          />
        ))}
        
        {/* Dias do mês */}
        {days.map((day) => (
          <GridItem
            key={`day-${day}`}
            p={2}
            borderWidth="0.5px"
            borderColor={borderColor}
            bg={isToday(day) ? todayBgColor : bgColor}
            minHeight="100px"
            onClick={() => {
              const clickedDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              onDateClick(clickedDate);
            }}
            cursor="pointer"
            _hover={{ bg: hoverBgColor }}
            transition="background-color 0.2s"
          >
            <Text fontSize="sm" fontWeight={isToday(day) ? "bold" : "normal"} mb={2}>
              {day}
            </Text>
            
            {/* Eventos do dia */}
            <VStack spacing={1} align="stretch">
              {getEventsForDay(day).map((event) => {
                let bgEventColor;
                switch (event.type) {
                  case 'entrevista':
                    bgEventColor = useColorModeValue('blue.100', 'blue.700');
                    break;
                  case 'pratica':
                    bgEventColor = useColorModeValue('green.100', 'green.700');
                    break;
                  case 'feedback':
                    bgEventColor = useColorModeValue('purple.100', 'purple.700');
                    break;
                  default:
                    bgEventColor = useColorModeValue('gray.100', 'gray.700');
                }
                
                return (
                  <Tooltip key={event.id} label={event.title} placement="top">
                    <Box
                      p={1}
                      bg={bgEventColor}
                      borderRadius="md"
                      fontSize="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      cursor="pointer"
                      _hover={{ filter: "brightness(0.9)" }}
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      {event.title}
                    </Box>
                  </Tooltip>
                );
              })}
            </VStack>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

// Componente principal da página de Calendário
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Dados simulados de eventos
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Entrevista Amazon',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 14, 0),
      type: 'entrevista',
      description: 'Entrevista para posição de desenvolvedor fullstack',
      participants: ['João (Recrutador)', 'Maria (Tech Lead)']
    },
    {
      id: '2',
      title: 'Prática Comportamental',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 10, 10, 0),
      type: 'pratica',
      description: 'Sessão de prática para questões comportamentais'
    },
    {
      id: '3',
      title: 'Feedback de CV',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 11, 30),
      type: 'feedback',
      description: 'Sessão de feedback sobre currículo e LinkedIn'
    },
    {
      id: '4',
      title: 'Entrevista Microsoft',
      date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5, 15, 0),
      type: 'entrevista',
      description: 'Entrevista técnica para posição de backend developer',
      participants: ['Ana (HR)', 'Carlos (Senior Developer)']
    }
  ]);

  // Navegação no calendário
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onOpen();
  };

  // Modal para criar/editar evento
  const EventModal = () => {
    const [title, setTitle] = useState(selectedEvent?.title || '');
    const [type, setType] = useState<'entrevista' | 'pratica' | 'feedback' | 'outro'>(selectedEvent?.type || 'entrevista');
    const [description, setDescription] = useState(selectedEvent?.description || '');
    const [eventDate, setEventDate] = useState<string>(() => {
      if (selectedEvent) {
        return new Date(selectedEvent.date).toISOString().split('T')[0];
      }
      if (selectedDate) {
        return selectedDate.toISOString().split('T')[0];
      }
      return new Date().toISOString().split('T')[0];
    });
    const [eventTime, setEventTime] = useState<string>(() => {
      if (selectedEvent) {
        const hours = new Date(selectedEvent.date).getHours().toString().padStart(2, '0');
        const minutes = new Date(selectedEvent.date).getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      return '09:00';
    });

    const handleSave = () => {
      const [year, month, day] = eventDate.split('-').map(Number);
      const [hours, minutes] = eventTime.split(':').map(Number);
      const newEventDate = new Date(year, month - 1, day, hours, minutes);
      
      if (selectedEvent) {
        // Atualiza evento existente
        const updatedEvents = events.map(event => {
          if (event.id === selectedEvent.id) {
            return {
              ...event,
              title,
              type: type as 'entrevista' | 'pratica' | 'feedback' | 'outro',
              description,
              date: newEventDate
            };
          }
          return event;
        });
        setEvents(updatedEvents);
      } else {
        // Cria novo evento
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title,
          date: newEventDate,
          type: type as 'entrevista' | 'pratica' | 'feedback' | 'outro',
          description
        };
        setEvents([...events, newEvent]);
      }
      
      onClose();
    };

    const handleDelete = () => {
      if (selectedEvent) {
        const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
        setEvents(updatedEvents);
        onClose();
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Título do evento" 
                />
              </FormControl>
              
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Data</FormLabel>
                  <Input 
                    type="date" 
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Hora</FormLabel>
                  <Input 
                    type="time" 
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </FormControl>
              </HStack>
              
              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as 'entrevista' | 'pratica' | 'feedback' | 'outro')}
                >
                  <option value="entrevista">Entrevista</option>
                  <option value="pratica">Prática</option>
                  <option value="feedback">Feedback</option>
                  <option value="outro">Outro</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Adicione mais detalhes sobre o evento"
                  rows={3}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          
          <ModalFooter>
            <HStack spacing={3}>
              {selectedEvent && (
                <Button colorScheme="red" leftIcon={<FiTrash />} onClick={handleDelete}>
                  Excluir
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button colorScheme="brand" onClick={handleSave}>
                {selectedEvent ? 'Atualizar' : 'Criar'}
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
        <title>Calendário | InViewAI</title>
      </Head>
      <Box p={5} bg={bgColor} minH="calc(100vh - 80px)">
        <Flex mb={6} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
          <Box mb={{ base: 4, md: 0 }}>
            <Heading size="lg">Calendário</Heading>
            <Text color="gray.500">Gerencie suas entrevistas e práticas</Text>
          </Box>
          
          <HStack spacing={4}>
            <Button
              leftIcon={<FiChevronLeft />}
              variant="outline"
              onClick={prevMonth}
            />
            <Heading size="md">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Heading>
            <Button
              rightIcon={<FiChevronRight />}
              variant="outline"
              onClick={nextMonth}
            />
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              onClick={() => {
                setSelectedEvent(null);
                setSelectedDate(new Date());
                onOpen();
              }}
            >
              Novo Evento
            </Button>
          </HStack>
        </Flex>
        
        <Card mb={6}>
          <CardBody p={4}>
            <HStack spacing={4} mb={4}>
              <Button
                size="sm"
                variant={viewType === 'month' ? 'solid' : 'outline'}
                colorScheme="brand"
                onClick={() => setViewType('month')}
              >
                Mensal
              </Button>
              <Button
                size="sm"
                variant={viewType === 'week' ? 'solid' : 'outline'}
                colorScheme="brand"
                onClick={() => setViewType('week')}
              >
                Semanal
              </Button>
              <Button
                size="sm"
                variant={viewType === 'day' ? 'solid' : 'outline'}
                colorScheme="brand"
                onClick={() => setViewType('day')}
              >
                Diário
              </Button>
            </HStack>
            
            {viewType === 'month' && (
              <MonthlyCalendar
                events={events}
                currentDate={currentDate}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}
            
            {/* Outras visualizações seriam implementadas aqui */}
            {viewType !== 'month' && (
              <Flex h="400px" align="center" justify="center">
                <Text>Visualização {viewType === 'week' ? 'semanal' : 'diária'} em desenvolvimento</Text>
              </Flex>
            )}
          </CardBody>
        </Card>
        
        {/* Próximos eventos */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Próximos Eventos</Heading>
            </CardHeader>
            <CardBody>
              {events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 3)
                .map(event => {
                  const eventDate = new Date(event.date);
                  return (
                    <Box 
                      key={event.id} 
                      p={3} 
                      mb={3} 
                      borderWidth="1px" 
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                      cursor="pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <Flex justify="space-between" align="start">
                        <Box>
                          <Text fontWeight="bold">{event.title}</Text>
                          <HStack mt={1}>
                            <Icon as={FiCalendar} color="gray.500" />
                            <Text fontSize="sm" color="gray.500">
                              {eventDate.toLocaleDateString('pt-BR')}
                            </Text>
                            <Icon as={FiClock} color="gray.500" />
                            <Text fontSize="sm" color="gray.500">
                              {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </HStack>
                        </Box>
                        <HStack>
                          <IconButton
                            aria-label="Editar evento"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          />
                        </HStack>
                      </Flex>
                    </Box>
                  );
                })}
                
                {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                  <Text color="gray.500">Não há eventos agendados</Text>
                )}
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <Heading size="md">Dicas para Entrevistas</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box p={3} borderWidth="1px" borderRadius="md">
                  <HStack mb={2}>
                    <Icon as={FiVideo} color="brand.500" />
                    <Text fontWeight="bold">Para entrevistas online</Text>
                  </HStack>
                  <Text fontSize="sm">
                    Teste sua conexão e equipamento com antecedência. Escolha um ambiente
                    tranquilo e bem iluminado. Prepare-se para compartilhar sua tela se necessário.
                  </Text>
                </Box>
                
                <Box p={3} borderWidth="1px" borderRadius="md">
                  <HStack mb={2}>
                    <Icon as={FiUser} color="brand.500" />
                    <Text fontWeight="bold">Pesquise sobre o entrevistador</Text>
                  </HStack>
                  <Text fontSize="sm">
                    Se você souber quem vai te entrevistar, pesquise sobre a pessoa no LinkedIn.
                    Isso pode ajudar a estabelecer uma conexão e mostrar seu interesse.
                  </Text>
                </Box>
                
                <Box p={3} borderWidth="1px" borderRadius="md">
                  <HStack mb={2}>
                    <Icon as={FiStar} color="brand.500" />
                    <Text fontWeight="bold">Use o método STAR</Text>
                  </HStack>
                  <Text fontSize="sm">
                    Para perguntas comportamentais, estruture suas respostas usando o método STAR:
                    Situação, Tarefa, Ação e Resultado. Isso torna suas histórias mais claras e eficazes.
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
      
      {/* Modal para criar/editar evento */}
      <EventModal />
    </DashboardLayout>
  );
} 