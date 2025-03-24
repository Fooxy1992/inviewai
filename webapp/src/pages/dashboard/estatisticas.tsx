import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Icon,
  Select,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import { 
  FiBarChart2, 
  FiPieChart, 
  FiTrendingUp, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiStar
} from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEntrevistas } from '@/hooks/useEntrevistas';
import { TipoEntrevista, TipoPergunta, StatusEntrevista } from '@/models/types';

// Interface para dados agregados
interface DadosEstatisticas {
  totalEntrevistas: number;
  concluidas: number;
  emAndamento: number;
  pendentes: number;
  tempoMedioResposta: number;
  distribuicaoTipos: {
    [key in TipoEntrevista]: number;
  };
  perguntasPorTipo: {
    [key in TipoPergunta]: number;
  };
  pontuacaoMedia: number;
  entrevistasMaisRecentes: {
    id: string;
    titulo: string;
    data: Date;
    tipo: TipoEntrevista;
    status: StatusEntrevista;
    pontuacao?: number;
  }[];
}

const EstatisticasPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { entrevistas, carregando } = useEntrevistas();
  const [periodoFiltro, setPeriodoFiltro] = useState('todos');
  const [dadosEstatisticas, setDadosEstatisticas] = useState<DadosEstatisticas>({
    totalEntrevistas: 0,
    concluidas: 0,
    emAndamento: 0,
    pendentes: 0,
    tempoMedioResposta: 0,
    distribuicaoTipos: {
      [TipoEntrevista.COMPORTAMENTAL]: 0,
      [TipoEntrevista.TECNICA]: 0,
      [TipoEntrevista.MISTA]: 0
    },
    perguntasPorTipo: {
      [TipoPergunta.COMPORTAMENTAL]: 0,
      [TipoPergunta.TECNICA]: 0,
      [TipoPergunta.GERAL]: 0
    },
    pontuacaoMedia: 0,
    entrevistasMaisRecentes: []
  });

  // Cores para modo claro/escuro
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.600');

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Calcular estatísticas com base nos dados das entrevistas
  useEffect(() => {
    if (!entrevistas || entrevistas.length === 0) return;

    // Filtrar entrevistas por período, se necessário
    let entrevistasFiltradas = [...entrevistas];
    
    if (periodoFiltro !== 'todos') {
      const hoje = new Date();
      const limiteDias = periodoFiltro === 'ultimos-30' ? 30 : 
                        periodoFiltro === 'ultimos-90' ? 90 : 
                        periodoFiltro === 'ultimos-7' ? 7 : 0;
      
      const dataLimite = new Date();
      dataLimite.setDate(hoje.getDate() - limiteDias);
      
      entrevistasFiltradas = entrevistas.filter(e => {
        const dataCriacao = e.dataCriacao.toDate();
        return dataCriacao >= dataLimite;
      });
    }

    // Calcular estatísticas básicas
    const concluidas = entrevistasFiltradas.filter(e => e.status === StatusEntrevista.CONCLUIDA).length;
    const emAndamento = entrevistasFiltradas.filter(e => e.status === StatusEntrevista.EM_ANDAMENTO).length;
    const pendentes = entrevistasFiltradas.filter(e => e.status === StatusEntrevista.PENDENTE).length;

    // Calcular distribuição por tipo de entrevista
    const distribuicaoTipos = {
      [TipoEntrevista.COMPORTAMENTAL]: 0,
      [TipoEntrevista.TECNICA]: 0,
      [TipoEntrevista.MISTA]: 0
    };

    entrevistasFiltradas.forEach(e => {
      distribuicaoTipos[e.tipo]++;
    });

    // Calcular perguntas por tipo
    const perguntasPorTipo = {
      [TipoPergunta.COMPORTAMENTAL]: 0,
      [TipoPergunta.TECNICA]: 0,
      [TipoPergunta.GERAL]: 0
    };

    entrevistasFiltradas.forEach(e => {
      if (e.perguntas) {
        e.perguntas.forEach(p => {
          perguntasPorTipo[p.tipo]++;
        });
      }
    });

    // Calcular pontuação média
    let somaNotas = 0;
    let totalEntrevistasComNota = 0;

    entrevistasFiltradas.forEach(e => {
      if (e.feedbackGeral && typeof e.feedbackGeral.pontuacao === 'number') {
        somaNotas += e.feedbackGeral.pontuacao;
        totalEntrevistasComNota++;
      }
    });

    const pontuacaoMedia = totalEntrevistasComNota > 0 
      ? Math.round((somaNotas / totalEntrevistasComNota) * 10) / 10
      : 0;

    // Tempo médio de resposta (em segundos)
    let somaTempos = 0;
    let totalRespostas = 0;

    entrevistasFiltradas.forEach(e => {
      if (e.perguntas) {
        e.perguntas.forEach(p => {
          if (p.resposta && p.resposta.duracao) {
            somaTempos += p.resposta.duracao;
            totalRespostas++;
          }
        });
      }
    });

    const tempoMedioResposta = totalRespostas > 0 
      ? Math.round(somaTempos / totalRespostas) 
      : 0;

    // Entrevistas mais recentes (top 5)
    const entrevistasMaisRecentes = entrevistasFiltradas
      .sort((a, b) => b.dataCriacao.toMillis() - a.dataCriacao.toMillis())
      .slice(0, 5)
      .map(e => ({
        id: e.id,
        titulo: e.titulo,
        data: e.dataCriacao.toDate(),
        tipo: e.tipo,
        status: e.status,
        pontuacao: e.feedbackGeral?.pontuacao
      }));

    // Atualizar estado com os dados calculados
    setDadosEstatisticas({
      totalEntrevistas: entrevistasFiltradas.length,
      concluidas,
      emAndamento,
      pendentes,
      tempoMedioResposta,
      distribuicaoTipos,
      perguntasPorTipo,
      pontuacaoMedia,
      entrevistasMaisRecentes
    });
  }, [entrevistas, periodoFiltro]);

  // Formatar tipo de entrevista para exibição
  const formatarTipoEntrevista = (tipo: TipoEntrevista) => {
    const tipos = {
      [TipoEntrevista.COMPORTAMENTAL]: 'Comportamental',
      [TipoEntrevista.TECNICA]: 'Técnica',
      [TipoEntrevista.MISTA]: 'Mista'
    };
    return tipos[tipo];
  };

  // Formatar status da entrevista
  const formatarStatus = (status: StatusEntrevista) => {
    const statusMap = {
      [StatusEntrevista.PENDENTE]: { text: 'Pendente', color: 'yellow' },
      [StatusEntrevista.EM_ANDAMENTO]: { text: 'Em andamento', color: 'blue' },
      [StatusEntrevista.CONCLUIDA]: { text: 'Concluída', color: 'green' },
      [StatusEntrevista.CANCELADA]: { text: 'Cancelada', color: 'red' }
    };
    return statusMap[status];
  };

  // Formato de segundos para minutos:segundos
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos}:${segsRestantes.toString().padStart(2, '0')}`;
  };

  // Esqueleto durante o carregamento
  if (carregando) {
    return (
      <DashboardLayout>
        <Box>
          <Skeleton height="40px" width="250px" mb={8} />
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
          </SimpleGrid>
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
            <Skeleton height="300px" />
            <Skeleton height="300px" />
          </Grid>
        </Box>
      </DashboardLayout>
    );
  }

  // Mensagem quando não há dados disponíveis
  if (!entrevistas || entrevistas.length === 0) {
    return (
      <DashboardLayout>
        <Box>
          <Heading size="lg" mb={8}>Estatísticas</Heading>
          <Alert status="info" borderRadius="md" mb={4}>
            <AlertIcon />
            Você ainda não possui entrevistas registradas. Crie sua primeira entrevista para começar a acompanhar suas estatísticas.
          </Alert>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Estatísticas</Heading>
          <Select 
            value={periodoFiltro}
            onChange={(e) => setPeriodoFiltro(e.target.value)}
            w={{ base: 'full', md: '200px' }}
          >
            <option value="todos">Todos os períodos</option>
            <option value="ultimos-7">Últimos 7 dias</option>
            <option value="ultimos-30">Últimos 30 dias</option>
            <option value="ultimos-90">Últimos 90 dias</option>
          </Select>
        </Flex>

        {/* Cards de métricas principais */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
          <Stat
            px={4}
            py={5}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            rounded="lg"
            shadow="sm"
          >
            <StatLabel color={mutedColor} fontWeight="medium">Total de Entrevistas</StatLabel>
            <StatNumber color={textColor} fontSize="3xl">{dadosEstatisticas.totalEntrevistas}</StatNumber>
            <StatHelpText>
              <Flex align="center">
                <Icon as={FiBarChart2} mr={1} />
                <Text>{periodoFiltro !== 'todos' ? 'No período selecionado' : 'De todos os tempos'}</Text>
              </Flex>
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            rounded="lg"
            shadow="sm"
          >
            <StatLabel color={mutedColor} fontWeight="medium">Entrevistas Concluídas</StatLabel>
            <StatNumber color={textColor} fontSize="3xl">{dadosEstatisticas.concluidas}</StatNumber>
            <StatHelpText>
              <Flex align="center">
                <Icon as={FiCheckCircle} mr={1} />
                <Text>{Math.round((dadosEstatisticas.concluidas / dadosEstatisticas.totalEntrevistas) * 100) || 0}% do total</Text>
              </Flex>
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            rounded="lg"
            shadow="sm"
          >
            <StatLabel color={mutedColor} fontWeight="medium">Tempo Médio de Resposta</StatLabel>
            <StatNumber color={textColor} fontSize="3xl">{formatarTempo(dadosEstatisticas.tempoMedioResposta)}</StatNumber>
            <StatHelpText>
              <Flex align="center">
                <Icon as={FiClock} mr={1} />
                <Text>Minutos por pergunta</Text>
              </Flex>
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={5}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            rounded="lg"
            shadow="sm"
          >
            <StatLabel color={mutedColor} fontWeight="medium">Pontuação Média</StatLabel>
            <StatNumber color={textColor} fontSize="3xl">{dadosEstatisticas.pontuacaoMedia}/10</StatNumber>
            <StatHelpText>
              <Flex align="center">
                <Icon as={FiStar} mr={1} />
                <Text>Nas entrevistas concluídas</Text>
              </Flex>
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Conteúdo principal */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Gráficos e dados detalhados */}
          <Box>
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={borderColor}
              shadow="sm"
              mb={6}
            >
              <CardHeader pb={2}>
                <Flex align="center">
                  <Icon as={FiBarChart2} mr={2} />
                  <Heading size="md">Distribuição por Tipo</Heading>
                </Flex>
              </CardHeader>
              <Divider borderColor={borderColor} />
              <CardBody>
                <Box mb={6}>
                  <Text fontWeight="medium" mb={4}>Entrevistas por Tipo</Text>
                  {Object.entries(dadosEstatisticas.distribuicaoTipos).map(([tipo, quantidade]) => {
                    const tipoFormatado = formatarTipoEntrevista(tipo as TipoEntrevista);
                    const porcentagem = Math.round((quantidade / dadosEstatisticas.totalEntrevistas) * 100) || 0;
                    
                    return (
                      <Box key={tipo} mb={3}>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">{tipoFormatado}</Text>
                          <Text fontSize="sm" fontWeight="medium">{quantidade} ({porcentagem}%)</Text>
                        </Flex>
                        <Progress 
                          value={porcentagem} 
                          size="sm" 
                          colorScheme={
                            tipo === TipoEntrevista.COMPORTAMENTAL ? 'purple' : 
                            tipo === TipoEntrevista.TECNICA ? 'green' : 'blue'
                          } 
                          borderRadius="full" 
                        />
                      </Box>
                    );
                  })}
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={4}>Perguntas por Tipo</Text>
                  {Object.entries(dadosEstatisticas.perguntasPorTipo).map(([tipo, quantidade]) => {
                    const totalPerguntas = Object.values(dadosEstatisticas.perguntasPorTipo).reduce((acc, curr) => acc + curr, 0);
                    const porcentagem = Math.round((quantidade / totalPerguntas) * 100) || 0;
                    
                    // Mapeamento de nomes e cores
                    const tipoInfo = {
                      [TipoPergunta.COMPORTAMENTAL]: { nome: 'Comportamentais', cor: 'purple' },
                      [TipoPergunta.TECNICA]: { nome: 'Técnicas', cor: 'green' },
                      [TipoPergunta.GERAL]: { nome: 'Gerais', cor: 'blue' }
                    };
                    
                    const info = tipoInfo[tipo as TipoPergunta];
                    
                    return (
                      <Box key={tipo} mb={3}>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">{info.nome}</Text>
                          <Text fontSize="sm" fontWeight="medium">{quantidade} ({porcentagem}%)</Text>
                        </Flex>
                        <Progress 
                          value={porcentagem} 
                          size="sm" 
                          colorScheme={info.cor as any} 
                          borderRadius="full" 
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardBody>
            </Card>

            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={borderColor}
              shadow="sm"
            >
              <CardHeader pb={2}>
                <Flex align="center">
                  <Icon as={FiCalendar} mr={2} />
                  <Heading size="md">Status das Entrevistas</Heading>
                </Flex>
              </CardHeader>
              <Divider borderColor={borderColor} />
              <CardBody>
                <Box mb={6}>
                  <Flex justify="space-between" mb={4}>
                    <HStack spacing={4}>
                      <Badge colorScheme="green" p={1} borderRadius="md">
                        {dadosEstatisticas.concluidas} Concluídas
                      </Badge>
                      <Badge colorScheme="blue" p={1} borderRadius="md">
                        {dadosEstatisticas.emAndamento} Em andamento
                      </Badge>
                      <Badge colorScheme="yellow" p={1} borderRadius="md">
                        {dadosEstatisticas.pendentes} Pendentes
                      </Badge>
                    </HStack>
                  </Flex>

                  <Box>
                    <Text fontWeight="medium" mb={2}>Progresso Geral</Text>
                    <Progress 
                      value={Math.round((dadosEstatisticas.concluidas / dadosEstatisticas.totalEntrevistas) * 100) || 0}
                      size="md" 
                      colorScheme="green" 
                      borderRadius="full" 
                      mb={2}
                    />
                    <Text fontSize="sm" color={mutedColor} textAlign="center">
                      {dadosEstatisticas.concluidas} de {dadosEstatisticas.totalEntrevistas} entrevistas concluídas
                    </Text>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* Entrevistas recentes */}
          <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor}
            shadow="sm"
          >
            <CardHeader pb={2}>
              <Flex align="center">
                <Icon as={FiTrendingUp} mr={2} />
                <Heading size="md">Entrevistas Recentes</Heading>
              </Flex>
            </CardHeader>
            <Divider borderColor={borderColor} />
            <CardBody>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th bg={tableHeaderBg}>Entrevista</Th>
                    <Th bg={tableHeaderBg}>Data</Th>
                    <Th bg={tableHeaderBg} isNumeric>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dadosEstatisticas.entrevistasMaisRecentes.map((entrevista) => {
                    const statusInfo = formatarStatus(entrevista.status);
                    
                    return (
                      <Tr key={entrevista.id} 
                        _hover={{ bg: useColorModeValue('gray.50', 'gray.600'), cursor: 'pointer' }}
                        onClick={() => router.push(`/dashboard/entrevistas/${entrevista.id}`)}
                      >
                        <Td>
                          <Box>
                            <Text fontWeight="medium">{entrevista.titulo}</Text>
                            <Text fontSize="xs" color={mutedColor}>
                              {formatarTipoEntrevista(entrevista.tipo)}
                            </Text>
                          </Box>
                        </Td>
                        <Td fontSize="sm">
                          {format(entrevista.data, 'dd MMM yyyy', { locale: ptBR })}
                        </Td>
                        <Td isNumeric>
                          <Badge colorScheme={statusInfo.color}>
                            {statusInfo.text}
                          </Badge>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              
              {dadosEstatisticas.entrevistasMaisRecentes.length === 0 && (
                <Text color={mutedColor} textAlign="center" mt={4}>
                  Nenhuma entrevista encontrada para o período selecionado
                </Text>
              )}
            </CardBody>
          </Card>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default EstatisticasPage; 