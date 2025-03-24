import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Flex,
  Icon,
  Heading,
} from '@chakra-ui/react';
import { FiUsers, FiClock, FiCalendar, FiTrendingUp } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  stat: string;
  icon: React.ElementType;
  change?: number;
  changeText?: string;
  color?: string;
}

function StatCard({ title, stat, icon, change, changeText, color }: StatCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  
  const statColor = color || 'brand.500';
  
  return (
    <Stat
      px={4}
      py={5}
      bg={bgColor}
      shadow="sm"
      rounded="lg"
      borderWidth="1px"
      borderColor={borderColor}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Box pl={2}>
          <StatLabel fontWeight="medium" color={textColor} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" color={statColor}>
            {stat}
          </StatNumber>
          {change && (
            <StatHelpText fontSize="sm">
              <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
              {Math.abs(change)}% {changeText || (change > 0 ? 'de aumento' : 'de diminuição')}
            </StatHelpText>
          )}
        </Box>
        <Box
          my={-2}
          color={statColor}
          backgroundColor={`${statColor}15`}
          borderRadius="full"
          p={2}
        >
          <Icon as={icon} w={6} h={6} />
        </Box>
      </Flex>
    </Stat>
  );
}

export default function AnalyticsSummary() {
  return (
    <Box mb={8}>
      <Heading as="h3" size="md" mb={4}>
        Resumo da Análise
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
        <StatCard
          title="Entrevistas Realizadas"
          stat="12"
          icon={FiCalendar}
          change={23}
          changeText="desde o último mês"
        />
        <StatCard
          title="Pontuação Média"
          stat="82/100"
          icon={FiTrendingUp}
          change={5}
          color="green.500"
        />
        <StatCard
          title="Tempo Médio de Resposta"
          stat="2m 45s"
          icon={FiClock}
          change={-12}
          color="blue.500"
        />
        <StatCard
          title="Contatos Feitos"
          stat="8"
          icon={FiUsers}
          change={15}
          color="purple.500"
        />
      </SimpleGrid>
    </Box>
  );
} 