import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Button,
  useColorModeValue,
  Link,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEye, FiDownload, FiTrash2, FiExternalLink } from 'react-icons/fi';
import NextLink from 'next/link';

type InterviewStatus = 'completed' | 'scheduled' | 'cancelled';

interface Interview {
  id: string;
  company: string;
  position: string;
  date: string;
  duration: string;
  score: number;
  status: InterviewStatus;
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    company: 'TechCorp Brasil',
    position: 'Desenvolvedor Full Stack',
    date: '10/11/2023',
    duration: '52m',
    score: 85,
    status: 'completed',
  },
  {
    id: '2',
    company: 'Startup XYZ',
    position: 'Product Manager',
    date: '05/11/2023',
    duration: '45m',
    score: 78,
    status: 'completed',
  },
  {
    id: '3',
    company: 'Consultoria ABC',
    position: 'Analista de Dados',
    date: '15/11/2023',
    duration: '60m',
    score: 0,
    status: 'scheduled',
  },
  {
    id: '4',
    company: 'Empresa Global',
    position: 'Gerente de Marketing',
    date: '01/11/2023',
    duration: '48m',
    score: 92,
    status: 'completed',
  },
  {
    id: '5',
    company: 'Tech Innovations',
    position: 'UX Designer',
    date: '18/11/2023',
    duration: '30m',
    score: 0,
    status: 'cancelled',
  },
];

// Componente para exibir o status da entrevista
const StatusBadge = ({ status }: { status: InterviewStatus }) => {
  let color;
  let text;
  
  switch (status) {
    case 'completed':
      color = 'green';
      text = 'Concluída';
      break;
    case 'scheduled':
      color = 'blue';
      text = 'Agendada';
      break;
    case 'cancelled':
      color = 'red';
      text = 'Cancelada';
      break;
    default:
      color = 'gray';
      text = 'Desconhecido';
  }
  
  return <Badge colorScheme={color}>{text}</Badge>;
};

// Componente para exibir a pontuação
const ScoreDisplay = ({ score }: { score: number }) => {
  if (score === 0) return <Text color="gray.500">-</Text>;
  
  let color;
  if (score >= 90) color = 'green.500';
  else if (score >= 75) color = 'blue.500';
  else if (score >= 60) color = 'orange.500';
  else color = 'red.500';
  
  return <Text fontWeight="bold" color={color}>{score}/100</Text>;
};

export default function RecentInterviews() {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.800');
  
  return (
    <Box mb={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h3" size="md">
          Entrevistas Recentes
        </Heading>
        <Button
          as={NextLink}
          href="/dashboard/interviews"
          size="sm"
          colorScheme="brand"
          variant="outline"
          rightIcon={<FiExternalLink />}
        >
          Ver Todas
        </Button>
      </Flex>
      
      <Box
        overflowX="auto"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
      >
        <Table variant="simple" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th>Empresa/Posição</Th>
              <Th>Data</Th>
              <Th>Duração</Th>
              <Th isNumeric>Pontuação</Th>
              <Th>Status</Th>
              <Th width="50px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockInterviews.map((interview) => (
              <Tr key={interview.id}>
                <Td>
                  <Box>
                    <Text fontWeight="medium">{interview.company}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {interview.position}
                    </Text>
                  </Box>
                </Td>
                <Td>{interview.date}</Td>
                <Td>{interview.duration}</Td>
                <Td isNumeric>
                  <ScoreDisplay score={interview.score} />
                </Td>
                <Td>
                  <StatusBadge status={interview.status} />
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Opções"
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        as={NextLink}
                        href={`/dashboard/interviews/${interview.id}`}
                        icon={<Icon as={FiEye} />}
                      >
                        Ver detalhes
                      </MenuItem>
                      <MenuItem 
                        icon={<Icon as={FiDownload} />}
                        isDisabled={interview.status !== 'completed'}
                      >
                        Baixar relatório
                      </MenuItem>
                      <MenuItem 
                        icon={<Icon as={FiTrash2} color="red.500" />} 
                        color="red.500"
                      >
                        Excluir
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
} 