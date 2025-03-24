import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Icon,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  List,
  ListItem,
  Badge,
  Divider,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiBarChart2, 
  FiActivity, 
  FiCalendar, 
  FiMessageCircle,
  FiCheckCircle,
  FiClock,
  FiStar
} from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useUsuario } from '@/hooks/useUsuario';
import { useEntrevistas } from '@/hooks/useEntrevistas';
import { Entrevista, TipoAtividade, TipoEntrevista, StatusEntrevista } from '@/models/types';

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { 
    usuario, 
    atividades, 
    carregando: carregandoUsuario 
  } = useUsuario();
  const { 
    entrevistas, 
    carregando: carregandoEntrevistas 
  } = useEntrevistas();
  
  const [estatisticas, setEstatisticas] = useState({
    totalEntrevistas: 0,
    entrevistasCompletas: 0,
    entrevistasPendentes: 0,
    proximasEntrevistas: [] as Entrevista[]
  });

  // Cores para o modo claro/escuro
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Calcular estatísticas
  useEffect(() => {
    if (entrevistas && entrevistas.length > 0) {
      const completas = entrevistas.filter(e => e.status === StatusEntrevista.CONCLUIDA).length;
      const pendentes = entrevistas.filter(e => e.status === StatusEntrevista.PENDENTE).length;
      
      // Próximas entrevistas (pendentes, ordenadas por data de criação)
      const proximas = [...entrevistas]
        .filter(e => e.status === StatusEntrevista.PENDENTE)
        .sort((a, b) => a.dataCriacao.toMillis() - b.dataCriacao.toMillis())
        .slice(0, 3);

      setEstatisticas({
        totalEntrevistas: entrevistas.length,
        entrevistasCompletas: completas,
        entrevistasPendentes: pendentes,
        proximasEntrevistas: proximas
      });
    }
  }, [entrevistas]);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Formatar tipo de entrevista para exibição
  const formatarTipoEntrevista = (tipo: TipoEntrevista) => {
    const tipos = {
      [TipoEntrevista.COMPORTAMENTAL]: 'Comportamental',
      [TipoEntrevista.TECNICA]: 'Técnica',
      [TipoEntrevista.MISTA]: 'Mista'
    };
    return tipos[tipo];
  };

  // Formatar tipo de atividade para exibição
  const formatarTipoAtividade = (tipo: TipoAtividade) => {
    const tipos = {
      [TipoAtividade.LOGIN]: 'Login',
      [TipoAtividade.CRIACAO_ENTREVISTA]: 'Criação de entrevista',
      [TipoAtividade.INICIO_ENTREVISTA]: 'Início de entrevista',
      [TipoAtividade.CONCLUSAO_ENTREVISTA]: 'Conclusão de entrevista',
      [TipoAtividade.SOLICITACAO_FEEDBACK]: 'Solicitação de feedback',
      [TipoAtividade.ATUALIZACAO_PERFIL]: 'Atualização de perfil',
      [TipoAtividade.ATUALIZACAO_CONFIGURACOES]: 'Atualização de configurações'
    };
    return tipos[tipo];
  };

  // Obter ícone para tipo de atividade
  const getIconForActivity = (tipo: TipoAtividade) => {
    const icons = {
      [TipoAtividade.LOGIN]: FiActivity,
      [TipoAtividade.CRIACAO_ENTREVISTA]: FiPlus,
      [TipoAtividade.INICIO_ENTREVISTA]: FiClock,
      [TipoAtividade.CONCLUSAO_ENTREVISTA]: FiCheckCircle,
      [TipoAtividade.SOLICITACAO_FEEDBACK]: FiMessageCircle,
      [TipoAtividade.ATUALIZACAO_PERFIL]: FiActivity,
      [TipoAtividade.ATUALIZACAO_CONFIGURACOES]: FiActivity
    };
    return icons[tipo] || FiActivity;
  };

  // Loading skeleton
  if (carregandoUsuario || carregandoEntrevistas) {
    return (
      <DashboardLayout>
        <Box>
          <Skeleton height="40px" width="200px" mb={6} />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
          </SimpleGrid>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            <Skeleton height="300px" />
            <Skeleton height="300px" />
          </Grid>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">
            Olá, {usuario?.nome || 'Usuário'}
          </Heading>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="blue" 
            onClick={() => router.push('/dashboard/entrevistas/nova')}
          >
            Nova Entrevista
          </Button>
        </Flex>

        {/* Cards de estatísticas */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
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
            <StatNumber color={textColor} fontSize="3xl">{estatisticas.totalEntrevistas}</StatNumber>
            <StatHelpText>
              <Flex align="center">
                <Icon as={FiBarChart2} mr={1} />
                <Text>Criadas até o momento</Text>
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
            <StatNumber color={textColor} fontSize="3xl">{estatisticas.entrevistasCompletas}</StatNumber>
            <StatHelpText>
              <Flex align="center">
                <Icon as={FiCheckCircle} mr={1} />
                <Text>Com feedback</Text>
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
            <StatLabel color={mutedColor} fontWeight="medium">Pendentes</StatLabel>
            <StatNumber color={textColor} fontSize="3xl">{estatisticas.entrevistasPendentes}</StatNumber>
            <StatHelpText>
              <Flex align="center">
                <Icon as={FiClock} mr={1} />
                <Text>Aguardando início</Text>
              </Flex>
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Conteúdo principal */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          {/* Próximas entrevistas */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm">
            <CardHeader pb={2}>
              <Heading size="md">
                <Flex align="center">
                  <Icon as={FiCalendar} mr={2} />
                  Próximas Entrevistas
                </Flex>
              </Heading>
            </CardHeader>
            <CardBody>
              {estatisticas.proximasEntrevistas.length > 0 ? (
                <List spacing={3}>
                  {estatisticas.proximasEntrevistas.map((entrevista) => (
                    <ListItem key={entrevista.id}>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Flex align="center">
                          <Box mr={3}>
                            <Badge colorScheme={
                              entrevista.tipo === TipoEntrevista.COMPORTAMENTAL ? 'purple' :
                              entrevista.tipo === TipoEntrevista.TECNICA ? 'green' : 'blue'
                            }>
                              {formatarTipoEntrevista(entrevista.tipo)}
                            </Badge>
                          </Box>
                          <Box>
                            <Text fontWeight="medium">{entrevista.titulo}</Text>
                            <Text fontSize="sm" color={mutedColor}>
                              Criada em {format(entrevista.dataCriacao.toDate(), 'dd MMM yyyy', { locale: ptBR })}
                            </Text>
                          </Box>
                        </Flex>
                        <Button 
                          size="sm" 
                          colorScheme="blue" 
                          variant="outline"
                          onClick={() => router.push(`/dashboard/entrevistas/${entrevista.id}`)}
                        >
                          Iniciar
                        </Button>
                      </Flex>
                      {entrevista !== estatisticas.proximasEntrevistas[estatisticas.proximasEntrevistas.length - 1] && (
                        <Divider my={2} />
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Flex direction="column" align="center" justify="center" py={6}>
                  <Text color={mutedColor} mb={4}>Você não possui entrevistas pendentes.</Text>
                  <Button 
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => router.push('/dashboard/entrevistas/nova')}
                  >
                    Criar Nova Entrevista
                  </Button>
                </Flex>
              )}
            </CardBody>
          </Card>

          {/* Atividades recentes */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm">
            <CardHeader pb={2}>
              <Heading size="md">
                <Flex align="center">
                  <Icon as={FiActivity} mr={2} />
                  Atividades Recentes
                </Flex>
              </Heading>
            </CardHeader>
            <CardBody>
              {atividades.length > 0 ? (
                <List spacing={3}>
                  {atividades.slice(0, 5).map((atividade) => (
                    <ListItem key={atividade.id}>
                      <Flex align="center">
                        <Box 
                          p={2}
                          bg="blue.50"
                          color="blue.500"
                          rounded="full"
                          mr={3}
                          _dark={{
                            bg: 'blue.900',
                            color: 'blue.200'
                          }}
                        >
                          <Icon as={getIconForActivity(atividade.tipo)} />
                        </Box>
                        <Box flex="1">
                          <Text fontWeight="medium">
                            {formatarTipoAtividade(atividade.tipo)}
                          </Text>
                          <Text fontSize="sm" color={mutedColor}>
                            {format(atividade.data.toDate(), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                          </Text>
                        </Box>
                      </Flex>
                      {atividade !== atividades[atividades.length - 1] && (
                        <Divider my={2} />
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Flex direction="column" align="center" justify="center" py={6}>
                  <Text color={mutedColor}>Nenhuma atividade registrada</Text>
                </Flex>
              )}
            </CardBody>
          </Card>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard; 