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
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  VStack,
  Divider,
  HStack,
  Skeleton,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaEdit, FaPlay, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEntrevistas } from '@/hooks/useEntrevistas';
import { 
  Entrevista, 
  TipoEntrevista, 
  StatusEntrevista, 
  Pergunta, 
  TipoPergunta 
} from '@/models/types';

const EntrevistaDetalhesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const { 
    entrevistaAtual, 
    carregando, 
    erro, 
    obterEntrevista, 
    atualizarDadosEntrevista,
    adicionarNovaPergunta
  } = useEntrevistas();
  
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: TipoEntrevista.COMPORTAMENTAL,
    descricao: '',
    status: StatusEntrevista.PENDENTE
  });
  const [salvando, setSalvando] = useState(false);
  
  // Modal para adicionar pergunta
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [novaPergunta, setNovaPergunta] = useState({
    texto: '',
    tipoPergunta: TipoPergunta.COMPORTAMENTAL
  });
  const [adicionandoPergunta, setAdicionandoPergunta] = useState(false);
  
  // Estados para confirmação de exclusão de pergunta
  const [perguntaParaExcluir, setPerguntaParaExcluir] = useState<string | null>(null);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  
  // Cores
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const statusBgColor = useColorModeValue('gray.100', 'gray.700');

  // Carregar detalhes da entrevista
  useEffect(() => {
    if (id && typeof id === 'string') {
      obterEntrevista(id);
    }
  }, [id]);

  // Atualizar formulário quando entrevista for carregada
  useEffect(() => {
    if (entrevistaAtual) {
      setFormData({
        titulo: entrevistaAtual.titulo,
        tipo: entrevistaAtual.tipo,
        descricao: entrevistaAtual.descricao || '',
        status: entrevistaAtual.status
      });
    }
  }, [entrevistaAtual]);

  // Manipuladores para o formulário de edição
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSalvarAlteracoes = async () => {
    if (!id || typeof id !== 'string') return;
    
    try {
      setSalvando(true);
      
      await atualizarDadosEntrevista(id, {
        titulo: formData.titulo,
        tipo: formData.tipo as TipoEntrevista,
        descricao: formData.descricao,
        status: formData.status as StatusEntrevista
      });
      
      toast({
        title: 'Entrevista atualizada',
        description: 'As alterações foram salvas com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      setModoEdicao(false);
    } catch (error) {
      console.error('Erro ao atualizar entrevista:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSalvando(false);
    }
  };

  // Manipuladores para o formulário de nova pergunta
  const handlePerguntaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovaPergunta({
      ...novaPergunta,
      [name]: value
    });
  };

  const handleAdicionarPergunta = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || typeof id !== 'string') return;
    
    if (!novaPergunta.texto) {
      toast({
        title: 'Erro no formulário',
        description: 'O texto da pergunta é obrigatório',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    try {
      setAdicionandoPergunta(true);
      
      await adicionarNovaPergunta(
        id,
        novaPergunta.texto,
        novaPergunta.tipoPergunta as TipoPergunta
      );
      
      toast({
        title: 'Pergunta adicionada',
        description: 'A pergunta foi adicionada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Resetar formulário e fechar modal
      setNovaPergunta({
        texto: '',
        tipoPergunta: TipoPergunta.COMPORTAMENTAL
      });
      onClose();
      
      // Recarregar entrevista
      obterEntrevista(id);
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a pergunta',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setAdicionandoPergunta(false);
    }
  };

  // Voltar para a listagem de entrevistas
  const voltar = () => {
    router.push('/dashboard/entrevistas');
  };

  // Iniciar sessão de entrevista
  const iniciarEntrevista = () => {
    if (id && typeof id === 'string') {
      router.push(`/dashboard/entrevistas/${id}/sessao`);
    }
  };

  // Renderizar conteúdo da página baseado no status de carregamento
  if (carregando) {
    return (
      <DashboardLayout>
        <Container maxW="container.lg" py={5}>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            mb={6}
            onClick={voltar}
          >
            Voltar
          </Button>
          
          <Skeleton height="40px" mb={6} />
          <Skeleton height="20px" width="60%" mb={2} />
          <Skeleton height="20px" width="40%" mb={6} />
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </SimpleGrid>
          
          <Skeleton height="30px" mt={8} mb={4} />
          
          <Stack spacing={4}>
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} height="80px" />
            ))}
          </Stack>
        </Container>
      </DashboardLayout>
    );
  }

  if (erro) {
    return (
      <DashboardLayout>
        <Container maxW="container.lg" py={5}>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            mb={6}
            onClick={voltar}
          >
            Voltar
          </Button>
          
          <Box p={4} bg="red.50" color="red.700" borderRadius="md">
            <Heading size="md" mb={2}>Erro ao carregar entrevista</Heading>
            <Text>{erro}</Text>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  if (!entrevistaAtual) {
    return (
      <DashboardLayout>
        <Container maxW="container.lg" py={5}>
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="outline" 
            mb={6}
            onClick={voltar}
          >
            Voltar
          </Button>
          
          <Box p={4} textAlign="center">
            <Heading size="md" mb={2}>Entrevista não encontrada</Heading>
            <Text mb={4}>A entrevista solicitada não existe ou foi excluída.</Text>
            <Button colorScheme="brand" onClick={voltar}>
              Voltar para a lista de entrevistas
            </Button>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  // Definindo cor do status
  let statusColor = 'gray';
  switch (entrevistaAtual.status) {
    case StatusEntrevista.EM_ANDAMENTO:
      statusColor = 'orange';
      break;
    case StatusEntrevista.CONCLUIDA:
      statusColor = 'green';
      break;
    case StatusEntrevista.ARQUIVADA:
      statusColor = 'purple';
      break;
  }
  
  // Definindo cor do tipo
  let tipoColor = 'blue';
  switch (entrevistaAtual.tipo) {
    case TipoEntrevista.TECNICA:
      tipoColor = 'cyan';
      break;
    case TipoEntrevista.COMPORTAMENTAL:
      tipoColor = 'teal';
      break;
    case TipoEntrevista.MISTA:
      tipoColor = 'purple';
      break;
    case TipoEntrevista.CASE:
      tipoColor = 'pink';
      break;
  }

  return (
    <DashboardLayout>
      <Container maxW="container.lg" py={5}>
        <Button 
          leftIcon={<FaArrowLeft />} 
          variant="outline" 
          mb={6}
          onClick={voltar}
        >
          Voltar
        </Button>
        
        {modoEdicao ? (
          <Box mb={6}>
            <HStack mb={4}>
              <Heading size="lg">Editar Entrevista</Heading>
            </HStack>
            
            <Card 
              p={4} 
              bg={cardBgColor} 
              borderColor={cardBorderColor} 
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
            >
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
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
                    <option value={TipoEntrevista.CASE}>Case</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value={StatusEntrevista.PENDENTE}>Pendente</option>
                    <option value={StatusEntrevista.EM_ANDAMENTO}>Em Andamento</option>
                    <option value={StatusEntrevista.CONCLUIDA}>Concluída</option>
                    <option value={StatusEntrevista.ARQUIVADA}>Arquivada</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    resize="vertical"
                    rows={4}
                  />
                </FormControl>
                
                <HStack justifyContent="flex-end" spacing={4} pt={2}>
                  <Button 
                    variant="outline" 
                    onClick={() => setModoEdicao(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    colorScheme="brand" 
                    onClick={handleSalvarAlteracoes}
                    isLoading={salvando}
                  >
                    Salvar Alterações
                  </Button>
                </HStack>
              </Stack>
            </Card>
          </Box>
        ) : (
          <Box mb={6}>
            <Flex justify="space-between" align="flex-start" mb={4}>
              <VStack align="flex-start" spacing={1}>
                <Heading size="lg">{entrevistaAtual.titulo}</Heading>
                <HStack>
                  <Badge colorScheme={statusColor} px={2} py={1} borderRadius="full">
                    {entrevistaAtual.status}
                  </Badge>
                  <Badge colorScheme={tipoColor} px={2} py={1} borderRadius="full">
                    {entrevistaAtual.tipo}
                  </Badge>
                </HStack>
              </VStack>
              <HStack>
                <Tooltip label="Editar entrevista">
                  <IconButton
                    aria-label="Editar entrevista"
                    icon={<FaEdit />}
                    onClick={() => setModoEdicao(true)}
                  />
                </Tooltip>
                <Button
                  rightIcon={<FaPlay />}
                  colorScheme="brand"
                  onClick={iniciarEntrevista}
                  isDisabled={entrevistaAtual.status === StatusEntrevista.ARQUIVADA}
                >
                  {entrevistaAtual.status === StatusEntrevista.PENDENTE ? 'Iniciar' : 'Continuar'}
                </Button>
              </HStack>
            </Flex>
            
            <Box 
              p={4} 
              bg={statusBgColor} 
              borderRadius="md" 
              mb={4}
            >
              <Text>{entrevistaAtual.descricao || 'Sem descrição'}</Text>
            </Box>
          </Box>
        )}
        
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Perguntas</Heading>
            <Button
              leftIcon={<FaPlus />}
              size="sm"
              colorScheme="brand"
              onClick={onOpen}
            >
              Adicionar Pergunta
            </Button>
          </Flex>
          
          {entrevistaAtual.perguntas && entrevistaAtual.perguntas.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {entrevistaAtual.perguntas.map((pergunta, index) => (
                <Card 
                  key={pergunta.id} 
                  p={4} 
                  bg={cardBgColor}
                  borderColor={cardBorderColor}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <Flex justify="space-between" align="flex-start">
                    <VStack align="flex-start" spacing={2}>
                      <HStack>
                        <Text fontWeight="bold">#{index + 1}</Text>
                        <Badge colorScheme={pergunta.tipoPergunta === TipoPergunta.COMPORTAMENTAL ? 'teal' : 'cyan'}>
                          {pergunta.tipoPergunta}
                        </Badge>
                      </HStack>
                      <Text>{pergunta.texto}</Text>
                    </VStack>
                    <HStack>
                      <Tooltip label="Editar pergunta">
                        <IconButton
                          aria-label="Editar pergunta"
                          icon={<FaEdit />}
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            // Implementar edição de pergunta
                            toast({
                              title: 'Funcionalidade em desenvolvimento',
                              status: 'info',
                              duration: 3000,
                              isClosable: true
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Excluir pergunta">
                        <IconButton
                          aria-label="Excluir pergunta"
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => {
                            // Implementar exclusão de pergunta
                            toast({
                              title: 'Funcionalidade em desenvolvimento',
                              status: 'info',
                              duration: 3000,
                              isClosable: true
                            });
                          }}
                        />
                      </Tooltip>
                    </HStack>
                  </Flex>
                  
                  {pergunta.resposta && (
                    <>
                      <Divider my={3} />
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Resposta:</Text>
                      <Text fontSize="sm" color="gray.600">{pergunta.resposta}</Text>
                    </>
                  )}
                  
                  {pergunta.feedback && (
                    <>
                      <Divider my={3} />
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Feedback:</Text>
                      <Text fontSize="sm" color="gray.600">{pergunta.feedback}</Text>
                      {pergunta.pontuacao !== undefined && (
                        <Badge colorScheme={pergunta.pontuacao >= 7 ? 'green' : pergunta.pontuacao >= 4 ? 'yellow' : 'red'} mt={2}>
                          Pontuação: {pergunta.pontuacao}/10
                        </Badge>
                      )}
                    </>
                  )}
                </Card>
              ))}
            </VStack>
          ) : (
            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg" borderStyle="dashed">
              <Text mb={4}>Esta entrevista ainda não tem perguntas.</Text>
              <Button colorScheme="brand" size="sm" onClick={onOpen}>
                Adicionar primeira pergunta
              </Button>
            </Box>
          )}
        </Box>
        
        {/* Modal para adicionar pergunta */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleAdicionarPergunta}>
              <ModalHeader>Adicionar Pergunta</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Texto da Pergunta</FormLabel>
                    <Textarea
                      name="texto"
                      value={novaPergunta.texto}
                      onChange={handlePerguntaInputChange}
                      placeholder="Digite a pergunta..."
                      resize="vertical"
                      rows={4}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Tipo de Pergunta</FormLabel>
                    <Select
                      name="tipoPergunta"
                      value={novaPergunta.tipoPergunta}
                      onChange={handlePerguntaInputChange}
                    >
                      <option value={TipoPergunta.COMPORTAMENTAL}>Comportamental</option>
                      <option value={TipoPergunta.TECNICA}>Técnica</option>
                      <option value={TipoPergunta.MULTIPLA_ESCOLHA}>Múltipla Escolha</option>
                      <option value={TipoPergunta.ABERTA}>Aberta</option>
                    </Select>
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
                  isLoading={adicionandoPergunta}
                >
                  Adicionar
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default EntrevistaDetalhesPage; 