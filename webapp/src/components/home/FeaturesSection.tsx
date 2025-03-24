import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaAi, FaLock, FaClock, FaChartLine, FaComments, FaRobot } from 'react-icons/fa';
import { ReactElement } from 'react';

interface FeatureProps {
  title: string;
  text: string;
  icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="lg"
      rounded="xl"
      p={8}
      spacing={4}
      height="full"
      borderTop="4px solid"
      borderColor="brand.400"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'brand.500'}
        rounded={'full'}
        bg={'brand.50'}
        mb={2}
      >
        {icon}
      </Flex>
      <Heading fontSize={'xl'} fontWeight={600}>
        {title}
      </Heading>
      <Text color={'gray.600'} fontSize={'md'}>
        {text}
      </Text>
    </Stack>
  );
};

export default function FeaturesSection() {
  return (
    <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW={'container.xl'}>
        <Stack spacing={4} as={Container} maxW={'4xl'} textAlign={'center'} mb={16}>
          <Heading
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            fontWeight={'bold'}
            color={useColorModeValue('gray.800', 'white')}
          >
            Recursos que Transformam Entrevistas
          </Heading>
          <Text color={'gray.600'} fontSize={{ base: 'md', sm: 'lg' }}>
            Nossa plataforma utiliza tecnologia avançada de IA para oferecer insights 
            valiosos para suas entrevistas, ajudando você a se destacar e conquistar 
            a vaga dos seus sonhos.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          <Feature
            icon={<Icon as={FaAi} w={10} h={10} />}
            title={'Análise de IA'}
            text={
              'Nossa tecnologia de ponta analisa sua linguagem corporal, expressões faciais e tom de voz para fornecer feedback abrangente sobre sua apresentação.'
            }
          />
          <Feature
            icon={<Icon as={FaLock} w={10} h={10} />}
            title={'Privacidade Garantida'}
            text={
              'Seus dados são processados localmente e nunca compartilhados. Mantemos sua privacidade como prioridade máxima com criptografia de ponta a ponta.'
            }
          />
          <Feature
            icon={<Icon as={FaClock} w={10} h={10} />}
            title={'Feedback em Tempo Real'}
            text={
              'Receba dicas discretas durante sua entrevista para ajustar sua postura, tom de voz e melhorar suas chances de sucesso imediatamente.'
            }
          />
          <Feature
            icon={<Icon as={FaChartLine} w={10} h={10} />}
            title={'Relatórios Detalhados'}
            text={
              'Após cada sessão, obtenha um relatório completo com métricas e sugestões específicas para melhorar em futuras entrevistas.'
            }
          />
          <Feature
            icon={<Icon as={FaComments} w={10} h={10} />}
            title={'Prática com IA'}
            text={
              'Treine com nosso simulador de entrevistas alimentado por IA que adapta perguntas com base em seu perfil e na vaga desejada.'
            }
          />
          <Feature
            icon={<Icon as={FaRobot} w={10} h={10} />}
            title={'Compatível com Plataformas'}
            text={
              'Funciona perfeitamente com Zoom, Google Meet, Microsoft Teams e outras plataformas populares de videoconferência.'
            }
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
} 