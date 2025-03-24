import { Timestamp } from 'firebase/firestore';

// Modelo de usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  imagemUrl: string | null;
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
  configuracoes: ConfiguracoesUsuario;
}

// Configurações do usuário
export interface Configuracoes {
  temaEscuro?: boolean;
  idiomaPreferido?: string;
  notificacoesAtivadas?: boolean;
  chaveOpenAI?: string;
}

// Modelo de entrevista
export interface Entrevista {
  id: string;
  userId: string;
  titulo: string;
  descricao: string;
  tipo: TipoEntrevista;
  status: StatusEntrevista;
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
  dataInicio?: Timestamp;
  dataConclusao?: Timestamp;
  feedbackGeral?: Feedback;
  perguntas?: Pergunta[];
}

// Tipos de entrevistas
export enum TipoEntrevista {
  COMPORTAMENTAL = 'COMPORTAMENTAL',
  TECNICA = 'TECNICA',
  MISTA = 'MISTA',
}

// Status da entrevista
export enum StatusEntrevista {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

// Modelo de pergunta
export interface Pergunta {
  id: string;
  texto: string;
  tipo: TipoPergunta;
  tempoMaximo?: number;
  entrevistaId: string;
  dataCriacao: Timestamp;
  resposta?: Resposta;
  feedback?: Feedback;
}

// Tipos de perguntas
export enum TipoPergunta {
  COMPORTAMENTAL = 'COMPORTAMENTAL',
  TECNICA = 'TECNICA',
  GERAL = 'GERAL',
}

// Modelo para histórico de atividades
export interface Atividade {
  id: string;
  userId: string;
  tipo: TipoAtividade;
  data: Timestamp;
  metadados?: Record<string, any>;
}

// Tipos de atividades
export enum TipoAtividade {
  LOGIN = 'LOGIN',
  CRIACAO_ENTREVISTA = 'CRIACAO_ENTREVISTA',
  INICIO_ENTREVISTA = 'INICIO_ENTREVISTA',
  CONCLUSAO_ENTREVISTA = 'CONCLUSAO_ENTREVISTA',
  SOLICITACAO_FEEDBACK = 'SOLICITACAO_FEEDBACK',
  ATUALIZACAO_PERFIL = 'ATUALIZACAO_PERFIL',
  ATUALIZACAO_CONFIGURACOES = 'ATUALIZACAO_CONFIGURACOES',
}

// Interface para Estatísticas
export interface Estatisticas {
  totalEntrevistas: number;
  entrevistasCompletas: number;
  entrevistasPendentes: number;
  mediaTempoResposta: number;
  distribuicaoTipos: Record<TipoEntrevista, number>;
  pontuacaoMedia: number;
  pontuacaoPorCategoria: Record<TipoPergunta, number>;
  ultimaAtualizacao: Timestamp;
}

// Interface para Modelo de Entrevista
export interface ModeloEntrevista {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoEntrevista;
  perguntas: {
    texto: string;
    tipoPergunta: TipoPergunta;
  }[];
  popularidade: number;
  categoria: string;
  dataCriacao: Date | any;
}

// Interface para configurações do usuário
export interface ConfiguracoesUsuario {
  temaEscuro: boolean;
  receberNotificacoes: boolean;
  idioma: string;
  modeloIA: string;
}

// Interface para feedback
export interface Feedback {
  id?: string;
  texto: string;
  pontuacao: number;
  dataCriacao: Timestamp;
  geradoPorIA: boolean;
}

// Interface para resposta
export interface Resposta {
  texto: string;
  audioUrl?: string;
  duracao?: number;
  dataCriacao: Timestamp;
} 