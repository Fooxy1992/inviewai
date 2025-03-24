# Arquitetura do InViewAI

## Diagrama de Arquitetura

```
+-------------------------+     +----------------------+
|                         |     |                      |
|   Extensão Chrome       |     |   Aplicação Web      |
|   (React/JavaScript)    |<--->|   (React/Next.js)    |
|                         |     |                      |
+--+-------------------+--+     +----------+-----------+
   |                   |                    |
   |                   |                    |
   |                   v                    v
   |           +-------+--------------------+-------+
   |           |                                    |
   |           |            API Gateway             |
   |           |                                    |
   |           +--+-------------+-------------+-----+
   |              |             |             |
   |              |             |             |
   v              v             v             v
+--+-----------+  +--------+  +-+----------+  +----------+
|              |  |        |  |            |  |          |
| Serviço de   |  | Serviço|  | Serviço de |  | Serviço  |
| Análise de   |  | de NLP |  | Análise de |  | de       |
| Áudio (ASR)  |  | (GPT-4)|  | Código     |  | Analytics|
|              |  |        |  |            |  |          |
+--------------+  +---+----+  +------------+  +-----+----+
                      |                             |
                      |                             |
                      v                             v
                 +----+--------------------------+--+---+
                 |                               |      |
                 |           Banco de Dados      |      |
                 |           & Storage           |      |
                 |                               |      |
                 +-------------------------------+------+
```

## Componentes Principais

### Frontend:

1. **Extensão Chrome**
   - Interface sobreposta para videoconferências
   - Módulo de captura de áudio
   - Motor de análise em tempo real
   - Sistema de alertas e notificações

2. **Aplicação Web (Dashboard)**
   - Perfil de usuário e configurações
   - Histórico de entrevistas e métricas
   - Planejamento e agendamento de sessões
   - Relatórios detalhados e análises

### Backend:

1. **API Gateway**
   - Gerenciamento de autenticação
   - Balanceamento de carga
   - Roteamento de serviços
   - Gestão de comunicação em tempo real (WebSockets)

2. **Microsserviços**
   - **Serviço de Análise de Áudio (ASR)**
     - Processamento de fala para texto (Whisper ou similar)
     - Detecção de tom e sentimento
     - Identificação de palavras de enchimento

   - **Serviço de NLP**
     - Análise de conteúdo e relevância
     - Geração de sugestões baseadas em contexto
     - Adaptação de perguntas baseadas em respostas

   - **Serviço de Análise de Código**
     - Verificação de sintaxe
     - Análise de eficiência
     - Comparação com soluções ótimas

   - **Serviço de Analytics**
     - Rastreamento de progresso
     - Identificação de padrões
     - Geração de insights personalizados

### Armazenamento:

1. **Banco de Dados**
   - Perfis de usuários
   - Histórico de entrevistas
   - Métricas de desempenho
   - Configurações e preferências

2. **Armazenamento de Objetos**
   - Gravações de áudio (opcional/temporário)
   - Transcrições
   - Modelos pré-treinados
   - Relatórios gerados

## Fluxo de Dados

1. Usuário inicia sessão de entrevista via Extensão Chrome durante uma chamada de videoconferência
2. Extensão captura áudio e envia para o serviço de ASR
3. Serviço ASR transcreve o áudio e envia para o serviço NLP
4. NLP analisa conteúdo e gera feedback em tempo real
5. Feedback é exibido na interface da extensão
6. Dados são processados pelo serviço de Analytics
7. Dashboard Web exibe métricas e recomendações
8. Usuário pode revisar entrevistas passadas e visualizar progresso

## Considerações Técnicas

### Segurança
- Criptografia de dados em trânsito e em repouso
- Autenticação via OAuth 2.0 e MFA
- Conformidade com GDPR e CCPA

### Escalabilidade
- Arquitetura baseada em microsserviços
- Infraestrutura serverless onde aplicável
- Balanceamento de carga automático

### Latência
- Edge computing para análise preliminar
- Otimização para feedback em tempo real (<200ms)
- Caching estratégico de informações frequentes 