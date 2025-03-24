import {
  Avatar,
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
import { FaQuoteLeft } from 'react-icons/fa';
import { ReactNode } from 'react';

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

function TestimonialCard({ name, role, company, content, avatar }: TestimonialProps) {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={8}
      rounded="xl"
      boxShadow="lg"
      position="relative"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      <Icon
        as={FaQuoteLeft}
        color={useColorModeValue('brand.200', 'brand.400')}
        fontSize="3xl"
        position="absolute"
        top={4}
        left={4}
        opacity={0.4}
      />
      <Text
        textAlign="center"
        color={useColorModeValue('gray.600', 'gray.400')}
        fontSize="md"
        fontStyle="italic"
      >
        {content}
      </Text>
      <Flex align="center" mt={8} direction="column">
        <Avatar
          src={avatar}
          mb={2}
          size="lg"
          name={name}
          border="4px solid"
          borderColor={useColorModeValue('brand.50', 'brand.900')}
        />
        <Stack spacing={-1} align="center">
          <Text fontWeight={600} fontSize="lg">
            {name}
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            {role} • {company}
          </Text>
        </Stack>
      </Flex>
    </Stack>
  );
}

export default function TestimonialsSection() {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')}>
      <Container maxW="container.xl" py={16}>
        <Stack spacing={4} as={Container} maxW="4xl" textAlign="center" mb={16}>
          <Heading
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'white')}
          >
            O Que Nossos Usuários Dizem
          </Heading>
          <Text color="gray.600" fontSize={{ base: 'md', sm: 'lg' }}>
            Milhares de profissionais já usaram o InViewAI para melhorar sua performance em entrevistas
            e conseguir emprego em empresas de destaque.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <TestimonialCard
            name="Ana Silva"
            role="Desenvolvedora de Software"
            company="TechBrasil"
            content="O InViewAI me ajudou a identificar um padrão de que eu nem estava ciente: eu cruzava os braços quando ficava nervosa durante entrevistas. Graças ao feedback em tempo real, corrigi isso e consegui uma oferta na empresa dos meus sonhos!"
            avatar="/images/testimonials/user1.jpg"
          />
          <TestimonialCard
            name="Carlos Mendes"
            role="Gerente de Produto"
            company="StartupX"
            content="Depois de 4 rejeições consecutivas, utilizei o InViewAI para praticar e receber feedback. A análise detalhada de como eu respondia às perguntas difíceis foi crucial. Agora sou gerente de produto em uma startup de destaque."
            avatar="/images/testimonials/user2.jpg"
          />
          <TestimonialCard
            name="Juliana Costa"
            role="Analista de Dados"
            company="DataCorp"
            content="A função de simulação de entrevista com IA é incrível! Pratiquei dezenas de vezes antes da minha entrevista real, e me senti completamente preparada. A extensão durante a entrevista online me deu aquela confiança extra para brilhar."
            avatar="/images/testimonials/user3.jpg"
          />
          <TestimonialCard
            name="Roberto Almeida"
            role="Engenheiro de Machine Learning"
            company="BigTech Inc."
            content="Como profissional introvertido, sempre tive dificuldade com entrevistas. O InViewAI me ajudou a manter contato visual consistente e a melhorar minha comunicação não-verbal. Foi um diferencial que me ajudou a conseguir uma vaga internacional."
            avatar="/images/testimonials/user4.jpg"
          />
          <TestimonialCard
            name="Fernanda Lima"
            role="Designer UX/UI"
            company="CreativeStudios"
            content="O relatório pós-entrevista é extremamente detalhado e útil. Consegui identificar exatamente onde estava falhando e melhorar a cada prática. Sem dúvida, é a melhor ferramenta para quem está em busca de emprego hoje."
            avatar="/images/testimonials/user5.jpg"
          />
          <TestimonialCard
            name="Marcos Oliveira"
            role="Consultor de Negócios"
            company="Consultoria Global"
            content="Vale cada centavo! A extensão me ajudou durante entrevistas importantes, dando feedback discreto sobre minha postura e tom de voz. Os relatórios detalhados me permitiram evoluir rapidamente. Recomendo para qualquer profissional."
            avatar="/images/testimonials/user6.jpg"
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
} 