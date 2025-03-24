import React, { useState } from 'react';
import Head from 'next/head';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  SimpleGrid,
  TabPanel,
  TabPanels,
  Tabs,
  TabList,
  Tab,
  Text,
  VStack,
  Image,
  HStack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import {
  FiHelpCircle,
  FiBookOpen,
  FiMessageCircle,
  FiSearch,
  FiVideo,
  FiFileText,
  FiSettings,
  FiPlayCircle,
  FiArrowRight,
  FiSend,
  FiChevronRight,
  FiBook,
  FiCpu,
  FiUsers,
  FiShield,
} from 'react-icons/fi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

// Componente principal da página de Ajuda
export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // FAQs para a seção de perguntas frequentes
  const faqs = [
    {
      question: 'Como posso preparar para minha primeira entrevista?',
      answer: `Recomendamos que você siga estes passos:
      
      1. Pratique com nosso assistente virtual no modo prática
      2. Revise seu currículo e prepare exemplos de experiências anteriores
      3. Pesquise a empresa e a posição
      4. Utilize nossa ferramenta de transcrição para analisar suas respostas
      5. Peça feedback personalizado após cada sessão de prática`
    },
    {
      question: 'Quais tipos de entrevistas a plataforma suporta?',
      answer: `A InViewAI oferece suporte a diversos tipos de entrevistas, incluindo:
      
      • Entrevistas técnicas (desenvolvimento de software, análise de dados, etc.)
      • Entrevistas comportamentais
      • Entrevistas de cultura organizacional
      • Entrevistas de verificação de experiência
      • Entrevistas em painel
      
      Nosso assistente de IA pode ser personalizado para qualquer tipo de entrevista.`
    },
    {
      question: 'Como funciona o feedback em tempo real?',
      answer: `O feedback em tempo real é ativado durante as sessões de entrevista simulada ou ao usar a extensão do Google Meet. O sistema:
      
      1. Captura seu áudio e, opcionalmente, vídeo
      2. Analisa sua comunicação verbal (conteúdo, tom, ritmo)
      3. Oferece sugestões sutis no momento da entrevista
      4. Compila um relatório detalhado após a conclusão da sessão
      
      Você pode ajustar o nível de feedback nas configurações da conta.`
    },
    {
      question: 'É possível usar a plataforma em dispositivos móveis?',
      answer: `Sim, a InViewAI é totalmente responsiva e funciona em dispositivos móveis. No entanto, recomendamos usar um computador com câmera e microfone para uma experiência completa, especialmente para:
      
      • Sessões de prática de entrevista
      • Análise de comunicação não verbal
      • Extensão para Google Meet
      
      O aplicativo móvel está disponível para iOS e Android com recursos limitados.`
    },
    {
      question: 'Como posso cancelar minha assinatura?',
      answer: `Você pode cancelar sua assinatura a qualquer momento seguindo estes passos:
      
      1. Acesse suas Configurações de Conta
      2. Selecione "Assinatura"
      3. Clique em "Gerenciar Assinatura"
      4. Selecione "Cancelar Assinatura"
      
      Sua assinatura permanecerá ativa até o final do período atual. Entre em contato com nosso suporte se precisar de ajuda adicional.`
    },
    {
      question: 'Meus dados estão seguros na plataforma?',
      answer: `Sim, a segurança e privacidade dos seus dados são nossa prioridade. Implementamos:
      
      • Criptografia de ponta a ponta para todas as sessões de entrevista
      • Armazenamento temporário de gravações, que são excluídas após 30 dias
      • Conformidade com LGPD e GDPR
      • Opção para excluir permanentemente seus dados a qualquer momento
      • Política clara de não-compartilhamento com terceiros
      
      Consulte nossa Política de Privacidade para mais detalhes.`
    }
  ];
  
  // Tutoriais e recursos de aprendizado
  const tutorials = [
    {
      title: 'Primeiros passos com a InViewAI',
      description: 'Um guia completo para iniciar sua jornada de preparação para entrevistas',
      icon: FiBook,
      link: '/resources/getting-started'
    },
    {
      title: 'Dominando entrevistas técnicas',
      description: 'Estratégias e práticas para se destacar em entrevistas de tecnologia',
      icon: FiCpu,
      link: '/resources/technical-interviews'
    },
    {
      title: 'Usando o assistente de IA efetivamente',
      description: 'Tire o máximo proveito do nosso assistente de entrevistas com IA',
      icon: FiPlayCircle,
      link: '/resources/ai-assistant'
    },
    {
      title: 'Analisando seu feedback',
      description: 'Como interpretar e aplicar o feedback recebido após práticas',
      icon: FiFileText,
      link: '/resources/feedback'
    },
    {
      title: 'Estratégias para entrevistas comportamentais',
      description: 'Aprenda a estruturar respostas convincentes usando o método STAR',
      icon: FiUsers,
      link: '/resources/behavioral'
    },
    {
      title: 'Segurança e privacidade',
      description: 'Entenda como protegemos seus dados durante o uso da plataforma',
      icon: FiShield,
      link: '/resources/privacy'
    }
  ];
  
  // Submeter formulário de contato
  const handleSubmitContactForm = (e) => {
    e.preventDefault();
    
    // Simulação de envio do formulário
    console.log('Enviando formulário:', { contactName, contactEmail, contactSubject, contactMessage });
    
    toast({
      title: 'Mensagem enviada',
      description: 'Entraremos em contato em breve.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Limpar formulário
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
  };
  
  // Filtrar FAQs com base na busca
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <Head>
        <title>Ajuda & Suporte | InViewAI</title>
      </Head>
      <Box p={5} bg={bgColor} minH="calc(100vh - 80px)">
        <Flex mb={6} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
          <Box mb={{ base: 4, md: 0 }}>
            <Heading size="lg">Central de Ajuda</Heading>
            <Text color="gray.500">Encontre recursos e suporte para usar a plataforma</Text>
          </Box>
        </Flex>
        
        {/* Barra de pesquisa */}
        <Card mb={6}>
          <CardBody>
            <VStack spacing={4} align="center" py={6}>
              <Heading size="md">Como podemos ajudar hoje?</Heading>
              <InputGroup size="lg" maxW="600px">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Buscar por tópicos, tutoriais ou perguntas..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <HStack spacing={6} mt={2}>
                <Button leftIcon={<FiMessageCircle />} variant="ghost" onClick={() => setTabIndex(2)}>
                  Fale Conosco
                </Button>
                <Button leftIcon={<FiBookOpen />} variant="ghost" onClick={() => setTabIndex(1)}>
                  Tutoriais
                </Button>
                <Button leftIcon={<FiVideo />} variant="ghost" onClick={() => setTabIndex(1)}>
                  Vídeos
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
        
        {/* Tabs para diferentes seções de ajuda */}
        <Tabs colorScheme="brand" index={tabIndex} onChange={setTabIndex}>
          <TabList mb={6}>
            <Tab><Icon as={FiHelpCircle} mr={2} /> Perguntas Frequentes</Tab>
            <Tab><Icon as={FiBookOpen} mr={2} /> Recursos & Tutoriais</Tab>
            <Tab><Icon as={FiMessageCircle} mr={2} /> Contato</Tab>
          </TabList>
          
          <TabPanels>
            {/* Painel de FAQs */}
            <TabPanel p={0}>
              <Card mb={6}>
                <CardBody>
                  {searchQuery && (
                    <Heading size="sm" mb={4}>
                      {filteredFaqs.length} {filteredFaqs.length === 1 ? 'resultado' : 'resultados'} para "{searchQuery}"
                    </Heading>
                  )}
                  
                  <Accordion allowMultiple>
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} border="none" mb={2}>
                          <AccordionButton py={3} px={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md" _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                              {faq.question}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel py={4} px={6}>
                            <Text whiteSpace="pre-line">{faq.answer}</Text>
                          </AccordionPanel>
                        </AccordionItem>
                      ))
                    ) : (
                      <Box textAlign="center" py={10}>
                        <Icon as={FiHelpCircle} boxSize={10} color="gray.400" mb={4} />
                        <Heading size="md" mb={2}>Nenhum resultado encontrado</Heading>
                        <Text color="gray.500" mb={4}>
                          Não encontramos respostas correspondentes a "{searchQuery}".
                        </Text>
                        <Button 
                          colorScheme="brand" 
                          rightIcon={<FiArrowRight />}
                          onClick={() => setTabIndex(2)}
                        >
                          Enviar uma pergunta
                        </Button>
                      </Box>
                    )}
                  </Accordion>
                </CardBody>
              </Card>
              
              <Heading size="md" mb={4}>Categorias populares</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
                <Card cursor="pointer" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <CardBody>
                    <Flex align="center" mb={3}>
                      <Icon as={FiSettings} boxSize={5} color="brand.500" mr={3} />
                      <Heading size="sm">Configuração da Conta</Heading>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      Aprenda a configurar seu perfil, preferências e notificações.
                    </Text>
                  </CardBody>
                </Card>
                
                <Card cursor="pointer" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <CardBody>
                    <Flex align="center" mb={3}>
                      <Icon as={FiPlayCircle} boxSize={5} color="brand.500" mr={3} />
                      <Heading size="sm">Usando o Assistente</Heading>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      Guias de uso do assistente virtual para prática de entrevistas.
                    </Text>
                  </CardBody>
                </Card>
                
                <Card cursor="pointer" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <CardBody>
                    <Flex align="center" mb={3}>
                      <Icon as={FiFileText} boxSize={5} color="brand.500" mr={3} />
                      <Heading size="sm">Feedback & Análise</Heading>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      Como interpretar os resultados e melhorar seu desempenho.
                    </Text>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            {/* Painel de Recursos */}
            <TabPanel p={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
                <Card>
                  <CardHeader pb={0}>
                    <Heading size="md">Tutoriais</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {tutorials.map((tutorial, index) => (
                        <Link key={index} href={tutorial.link} _hover={{ textDecoration: 'none' }}>
                          <Box
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{
                              bg: useColorModeValue('gray.50', 'gray.700'),
                              borderColor: 'brand.300'
                            }}
                            transition="all 0.2s"
                          >
                            <Flex align="center" mb={1}>
                              <Icon as={tutorial.icon} boxSize={5} color="brand.500" mr={3} />
                              <Text fontWeight="medium">{tutorial.title}</Text>
                            </Flex>
                            <Text fontSize="sm" color="gray.500" ml={8}>
                              {tutorial.description}
                            </Text>
                          </Box>
                        </Link>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardHeader pb={0}>
                    <Heading size="md">Vídeos de Treinamento</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Box
                        borderRadius="md"
                        overflow="hidden"
                        position="relative"
                        h="200px"
                      >
                        <Image 
                          src="/images/video-thumbnail-1.jpg" 
                          alt="Guia para usar a InViewAI"
                          fallbackSrc="https://via.placeholder.com/600x400?text=Introdução+à+InViewAI"
                          objectFit="cover"
                          w="100%"
                          h="100%"
                        />
                        <Flex
                          position="absolute"
                          top="0"
                          left="0"
                          right="0"
                          bottom="0"
                          bg="blackAlpha.600"
                          align="center"
                          justify="center"
                          cursor="pointer"
                          transition="all 0.2s"
                          _hover={{ bg: "blackAlpha.700" }}
                        >
                          <Icon as={FiPlayCircle} color="white" boxSize={12} />
                        </Flex>
                        <Text
                          position="absolute"
                          bottom="0"
                          left="0"
                          right="0"
                          p={3}
                          bg="blackAlpha.700"
                          color="white"
                          fontWeight="medium"
                        >
                          Introdução à InViewAI
                        </Text>
                      </Box>
                      
                      <HStack spacing={4}>
                        <Box
                          borderRadius="md"
                          overflow="hidden"
                          position="relative"
                          h="100px"
                          w="50%"
                        >
                          <Image 
                            src="/images/video-thumbnail-2.jpg" 
                            alt="Preparação para Entrevistas Técnicas"
                            fallbackSrc="https://via.placeholder.com/300x200?text=Entrevistas+Técnicas"
                            objectFit="cover"
                            w="100%"
                            h="100%"
                          />
                          <Flex
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            bottom="0"
                            bg="blackAlpha.600"
                            align="center"
                            justify="center"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ bg: "blackAlpha.700" }}
                          >
                            <Icon as={FiPlayCircle} color="white" boxSize={8} />
                          </Flex>
                          <Text
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            p={2}
                            bg="blackAlpha.700"
                            color="white"
                            fontSize="sm"
                            fontWeight="medium"
                            noOfLines={1}
                          >
                            Entrevistas Técnicas
                          </Text>
                        </Box>
                        
                        <Box
                          borderRadius="md"
                          overflow="hidden"
                          position="relative"
                          h="100px"
                          w="50%"
                        >
                          <Image 
                            src="/images/video-thumbnail-3.jpg" 
                            alt="Utilizando Feedback de IA"
                            fallbackSrc="https://via.placeholder.com/300x200?text=Feedback+de+IA"
                            objectFit="cover"
                            w="100%"
                            h="100%"
                          />
                          <Flex
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            bottom="0"
                            bg="blackAlpha.600"
                            align="center"
                            justify="center"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ bg: "blackAlpha.700" }}
                          >
                            <Icon as={FiPlayCircle} color="white" boxSize={8} />
                          </Flex>
                          <Text
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            p={2}
                            bg="blackAlpha.700"
                            color="white"
                            fontSize="sm"
                            fontWeight="medium"
                            noOfLines={1}
                          >
                            Feedback de IA
                          </Text>
                        </Box>
                      </HStack>
                      
                      <Button rightIcon={<FiChevronRight />} variant="outline" alignSelf="flex-end">
                        Ver mais vídeos
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
              
              <Card>
                <CardHeader>
                  <Heading size="md">Modelos e Exemplos</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={2}>
                    <Box p={4} borderWidth="1px" borderRadius="md" borderColor="brand.100">
                      <Heading size="sm" mb={2}>Modelo de Currículo</Heading>
                      <Text fontSize="sm" color="gray.500" mb={3}>
                        Template profissional baseado em dados reais de contratação.
                      </Text>
                      <Button colorScheme="brand" size="sm" variant="outline" rightIcon={<FiChevronRight />}>
                        Baixar modelo
                      </Button>
                    </Box>
                    
                    <Box p={4} borderWidth="1px" borderRadius="md" borderColor="brand.100">
                      <Heading size="sm" mb={2}>Checklist de Entrevista</Heading>
                      <Text fontSize="sm" color="gray.500" mb={3}>
                        Lista completa de verificação para antes, durante e após a entrevista.
                      </Text>
                      <Button colorScheme="brand" size="sm" variant="outline" rightIcon={<FiChevronRight />}>
                        Baixar checklist
                      </Button>
                    </Box>
                    
                    <Box p={4} borderWidth="1px" borderRadius="md" borderColor="brand.100">
                      <Heading size="sm" mb={2}>Exemplos de Respostas</Heading>
                      <Text fontSize="sm" color="gray.500" mb={3}>
                        Respostas estruturadas para as perguntas mais comuns em entrevistas.
                      </Text>
                      <Button colorScheme="brand" size="sm" variant="outline" rightIcon={<FiChevronRight />}>
                        Ver exemplos
                      </Button>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Painel de Contato */}
            <TabPanel p={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Envie sua Mensagem</Heading>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleSubmitContactForm}>
                      <VStack spacing={4} align="stretch">
                        <FormControl isRequired>
                          <FormLabel>Nome</FormLabel>
                          <Input 
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Seu nome completo"
                          />
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input 
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="Seu email de contato"
                          />
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel>Assunto</FormLabel>
                          <Input 
                            value={contactSubject}
                            onChange={(e) => setContactSubject(e.target.value)}
                            placeholder="Assunto da mensagem"
                          />
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel>Mensagem</FormLabel>
                          <Textarea 
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Descreva sua dúvida ou solicitação em detalhes"
                            rows={5}
                          />
                        </FormControl>
                        
                        <Button 
                          mt={2} 
                          colorScheme="brand" 
                          type="submit" 
                          leftIcon={<FiSend />}
                        >
                          Enviar Mensagem
                        </Button>
                      </VStack>
                    </form>
                  </CardBody>
                </Card>
                
                <Box>
                  <Card mb={6}>
                    <CardHeader>
                      <Heading size="md">Informações de Contato</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Box>
                          <Text fontWeight="medium">Horário de Atendimento</Text>
                          <Text color="gray.500">Segunda a Sexta: 8h às 20h</Text>
                          <Text color="gray.500">Sábado: 9h às 15h</Text>
                        </Box>
                        
                        <Box>
                          <Text fontWeight="medium">Email de Suporte</Text>
                          <Link href="mailto:suporte@inviewai.com" color="brand.500">
                            suporte@inviewai.com
                          </Link>
                        </Box>
                        
                        <Box>
                          <Text fontWeight="medium">Chat ao Vivo</Text>
                          <Text color="gray.500">Disponível durante o horário comercial</Text>
                          <Button mt={2} size="sm" leftIcon={<FiMessageCircle />} colorScheme="brand" variant="outline">
                            Iniciar Chat
                          </Button>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <Heading size="md">Tempo de Resposta</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text color="gray.500" mb={4}>
                        Nossa equipe normalmente responde em até:
                      </Text>
                      
                      <VStack spacing={3} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Text fontWeight="medium">Email</Text>
                          <Text>24 horas</Text>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <Text fontWeight="medium">Chat ao Vivo</Text>
                          <Text>Poucos minutos</Text>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <Text fontWeight="medium">Formulário de Contato</Text>
                          <Text>48 horas</Text>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </DashboardLayout>
  );
} 