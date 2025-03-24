import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaChrome, FaVideo, FaComments, FaChartLine } from 'react-icons/fa';
import { ReactElement } from 'react';

interface StepItemProps {
  title: string;
  description: string;
  icon: ReactElement;
  step: number;
}

function StepItem({ title, description, icon, step }: StepItemProps) {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={4}
      align={{ base: 'flex-start', md: 'center' }}
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'brand.500'}
        mb={{ base: 2, md: 0 }}
        position="relative"
        _after={{
          content: `"${step}"`,
          w: '100%',
          h: '100%',
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'xl',
          fontWeight: 'bold',
        }}
      >
        <Box zIndex={2}>{icon}</Box>
      </Flex>
      <Stack spacing={1}>
        <Heading fontSize={'xl'} fontWeight={600}>
          {title}
        </Heading>
        <Text color={'gray.600'}>{description}</Text>
      </Stack>
    </Stack>
  );
}

export default function HowItWorksSection() {
  return (
    <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
      <Container maxW={'container.xl'}>
        <Stack spacing={4} as={Container} maxW={'4xl'} textAlign={'center'} mb={16}>
          <Heading
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            fontWeight={'bold'}
            color={useColorModeValue('gray.800', 'white')}
          >
            Como Funciona
          </Heading>
          <Text color={'gray.600'} fontSize={{ base: 'md', sm: 'lg' }}>
            Nosso processo é simples, eficaz e projetado para melhorar suas habilidades
            em entrevistas de forma constante. Veja como começar em poucos passos:
          </Text>
        </Stack>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={10}
          mb={20}
          alignItems="center"
        >
          <Stack spacing={8}>
            <StepItem
              icon={<Icon as={FaChrome} w={8} h={8} />}
              title="Instale a Extensão"
              description="Adicione a extensão InViewAI ao Chrome. É gratuita e leva menos de um minuto para instalar."
              step={1}
            />
            <Divider display={{ base: 'block', md: 'none' }} />
            <StepItem
              icon={<Icon as={FaVideo} w={8} h={8} />}
              title="Conecte a Entrevistas Online"
              description="Durante sua próxima entrevista via Zoom, Teams ou Google Meet, ative a extensão para começar a análise."
              step={2}
            />
            <Divider display={{ base: 'block', md: 'none' }} />
            <StepItem
              icon={<Icon as={FaComments} w={8} h={8} />}
              title="Receba Feedback Discreto"
              description="Receba sugestões em tempo real sobre sua linguagem corporal, tom de voz e conteúdo enquanto você fala."
              step={3}
            />
            <Divider display={{ base: 'block', md: 'none' }} />
            <StepItem
              icon={<Icon as={FaChartLine} w={8} h={8} />}
              title="Revise e Melhore"
              description="Após a entrevista, acesse um relatório detalhado com insights específicos e sugestões de melhoria."
              step={4}
            />
          </Stack>
          <Flex justify={'center'} align={'center'}>
            <Box
              bg={useColorModeValue('white', 'gray.700')}
              p={6}
              rounded={'xl'}
              boxShadow={'2xl'}
              position="relative"
              overflow="hidden"
            >
              <Box
                as="video"
                controls
                autoPlay={false}
                muted
                width="full"
                height="auto"
                rounded="md"
                poster="/images/demo-poster.jpg"
                src="/videos/inviewai-demo.mp4"
              />
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={4}
                bg="rgba(0,0,0,0.7)"
                color="white"
                fontSize="sm"
                roundedBottomLeft="md"
                roundedBottomRight="md"
              >
                <Text fontWeight="bold">Demo do InViewAI em ação</Text>
              </Box>
            </Box>
          </Flex>
        </SimpleGrid>
      </Container>
    </Box>
  );
} 