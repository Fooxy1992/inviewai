import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  IconButton,
  Tooltip,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { Timestamp } from 'firebase/firestore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEntrevistas } from '@/hooks/useEntrevistas';
import { Entrevista, TipoEntrevista, StatusEntrevista } from '@/models/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EntrevistasPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    entrevistas, 
    carregando, 
    erro, 
    carregarEntrevistas, 
    novaEntrevista, 
    excluirEntrevista 
  } = useEntrevistas();
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: TipoEntrevista.COMPORTAMENTAL,
    descricao: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [entrevistaParaExcluir, setEntrevistaParaExcluir] = useState<string | null>(null);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  
  // Cores
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600');

  // Carregar entrevistas quando o componente montar
  useEffect(() => {
    carregarEntrevistas();
  }, []);

  // Tratamento do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo) {
      toast({
        title: 'Erro no formulário',
        description: 'O título da entrevista é obrigatório',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      await novaEntrevista(
        formData.titulo,
        formData.tipo as TipoEntrevista,
        formData.descricao
      );
      
      toast({
        title: 'Entrevista criada',
        description: 'A entrevista foi criada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Resetar formulário e fechar modal
      setFormData({
        titulo: '',
        tipo: TipoEntrevista.COMPORTAMENTAL,
        descricao: ''
      });
      onClose();
      
      // Recarregar lista de entrevistas
      carregarEntrevistas();
    } catch (error) {
      console.error('Erro ao criar entrevista:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a entrevista',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Navegação para detalhes da entrevista
  const irParaEntrevista = (id: string) => {
    router.push(`/dashboard/entrevistas/${id}`);
  };

  // Iniciar uma entrevista
  const iniciarEntrevista = (id: string) => {
    router.push(`/dashboard/entrevistas/${id}/sessao`);
  };

  // Confirmação para excluir entrevista
  const confirmarExclusao = (id: string) => {
    setEntrevistaParaExcluir(id);
    setConfirmacaoAberta(true);
  };

  // Excluir entrevista
  const handleExcluirEntrevista = async () => {
    if (!entrevistaParaExcluir) return;
    
    try {
      await excluirEntrevista(entrevistaParaExcluir);
      
      toast({
        title: 'Entrevista excluída',
        description: 'A entrevista foi excluída com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      setConfirmacaoAberta(false);
      setEntrevistaParaExcluir(null);
      
      // Recarregar lista de entrevistas
      carregarEntrevistas();
    } catch (error) {
      console.error('Erro ao excluir entrevista:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a entrevista',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Renderizar o cartão de entrevista
  const renderEntrevistaCard = (entrevista: Entrevista) => {
    // Formatação de data relativa (ex: "há 2 dias")
    const dataAtualizada = entrevista.dataAtualizacao instanceof Timestamp 
      ? entrevista.dataAtualizacao.toDate() 
      : new Date();
    
    const tempoRelativo = formatDistanceToNow(dataAtualizada, {
      addSuffix: true,
      locale: ptBR
    });
    
    // Definindo a cor do status
    let statusColor = 'gray';
    switch (entrevista.status) {
      case StatusEntrevista.EM_ANDAMENTO:
        statusColor = 'orange';
        break;
      case StatusEntrevista.CONCLUIDA:
        statusColor = 'green';
        break;
      case StatusEntrevista.CANCELADA:
        statusColor = 'purple';
        break;
    }
    
    // Definindo a cor do tipo
    let tipoColor = 'blue';
    switch (entrevista.tipo) {
      case TipoEntrevista.TECNICA:
        tipoColor = 'cyan';
        break;
      case TipoEntrevista.COMPORTAMENTAL:
        tipoColor = 'teal';
        break;
      case TipoEntrevista.MISTA:
        tipoColor = 'purple';
        break;
      default:
        tipoColor = 'gray';
    }

    return (
      <Card 
        key={entrevista.id} 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden"
        bg={cardBgColor}
        borderColor={cardBorderColor}
        _hover={{ borderColor: 'brand.500', transform: 'translateY(-2px)' }}
        transition="all 0.2s"
        boxShadow="sm"
      >
        <CardHeader pb={2}>
          <Flex justify="space-between" align="flex-start">
            <Heading size="md" cursor="pointer" onClick={() => irParaEntrevista(entrevista.id)}>
              {entrevista.titulo}
            </Heading>
            <Flex>
              <Tooltip label="Editar entrevista">
                <IconButton
                  aria-label="Editar entrevista"
                  icon={<FaEdit />}
                  size="sm"
                  mr={2}
                  onClick={() => irParaEntrevista(entrevista.id)}
                  variant="ghost"
                />
              </Tooltip>
              <Tooltip label="Excluir entrevista">
                <IconButton
                  aria-label="Excluir entrevista"
                  icon={<FaTrash />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => confirmarExclusao(entrevista.id)}
                  variant="ghost"
                />
              </Tooltip>
            </Flex>
          </Flex>
          <Flex mt={2} wrap="wrap" gap={2}>
            <Badge colorScheme={statusColor} borderRadius="full" px={2}>
              {entrevista.status}
            </Badge>
            <Badge colorScheme={tipoColor} borderRadius="full" px={2}>
              {entrevista.tipo}
            </Badge>
          </Flex>
        </CardHeader>
        
        <CardBody py={2}>
          <Text noOfLines={2} fontSize="sm" color="gray.500">
            {entrevista.descricao || 'Sem descrição'}
          </Text>
        </CardBody>
        
        <CardFooter pt={0} justifyContent="space-between" alignItems="center">
          <Text fontSize="xs" color="gray.500">
            Atualizado {tempoRelativo}
          </Text>
          
          <Button
            rightIcon={<FaPlay />}
            colorScheme="brand"
            size="sm"
            onClick={() => iniciarEntrevista(entrevista.id)}
            isDisabled={entrevista.status === StatusEntrevista.CANCELADA}
          >
            {entrevista.status === StatusEntrevista.PENDENTE ? 'Iniciar' : 'Continuar'}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <Container maxW="container.xl" py={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Suas Entrevistas</Heading>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="brand"
            onClick={onOpen}
          >
            Nova Entrevista
          </Button>
        </Flex>

        {erro && (
          <Box p={4} bg="red.50" color="red.700" borderRadius="md" mb={6}>
            <Text>Erro ao carregar entrevistas: {erro}</Text>
          </Box>
        )}

        {carregando ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[...Array(6)].map((_, index) => (
              <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                <Skeleton height="24px" width="70%" mb={2} />
                <Skeleton height="16px" width="40%" mb={4} />
                <Skeleton height="12px" width="90%" mb={2} />
                <Skeleton height="12px" width="80%" mb={4} />
                <Flex justifyContent="space-between">
                  <Skeleton height="10px" width="30%" />
                  <Skeleton height="30px" width="80px" />
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        ) : entrevistas.length === 0 ? (
          <Box textAlign="center" py={10} px={6}>
            <Text fontSize="lg" mb={4}>
              Você ainda não tem nenhuma entrevista.
            </Text>
            <Button
              colorScheme="brand"
              onClick={onOpen}
            >
              Criar minha primeira entrevista
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {entrevistas.map(renderEntrevistaCard)}
          </SimpleGrid>
        )}

        {/* Modal para criar nova entrevista */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleSubmit}>
              <ModalHeader>Nova Entrevista</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Título</FormLabel>
                    <Input
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Entrevista para Desenvolvedor Frontend"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Tipo de Entrevista</FormLabel>
                    <Select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                    >
                      <option value={TipoEntrevista.COMPORTAMENTAL}>Comportamental</option>
                      <option value={TipoEntrevista.TECNICA}>Técnica</option>
                      <option value={TipoEntrevista.MISTA}>Mista</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <Textarea
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      placeholder="Entrevista focada em perguntas sobre React, NextJS e TypeScript"
                      resize="vertical"
                    />
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  colorScheme="brand" 
                  isLoading={submitting}
                >
                  Criar Entrevista
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Modal de confirmação para exclusão */}
        <Modal isOpen={confirmacaoAberta} onClose={() => setConfirmacaoAberta(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar Exclusão</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Tem certeza que deseja excluir esta entrevista? Esta ação não pode ser desfeita.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setConfirmacaoAberta(false)}>
                Cancelar
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleExcluirEntrevista}
              >
                Excluir
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default EntrevistasPage; 