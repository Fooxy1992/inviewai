import { Timestamp } from 'firebase/firestore';

// Modelo de usuário
export interface Usuario {
  id: string;
  nome?: string;
  email: string;
  fotoPerfil?: string;
  dataCriacao: Timestamp;
  ultimoLogin?: Timestamp;
  configuracoes?: Configuracoes;
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
  usuarioId: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Timestamp;
  dataAtualizacao: Timestamp;
  tipo: TipoEntrevista;
  status: StatusEntrevista;
  perguntas: Pergunta[];
  duracao?: number; // em minutos
  pontuacao?: number; // 0-100
  feedback?: string;
}

// Tipos de entrevistas
export enum TipoEntrevista {
  COMPORTAMENTAL = 'comportamental',
  TECNICA = 'tecnica',
  MISTA = 'mista',
  CASE = 'case'
}

// Status da entrevista
export enum StatusEntrevista {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDA = 'concluida',
  ARQUIVADA = 'arquivada'
}

// Modelo de pergunta
export interface Pergunta {
  id: string;
  entrevistaId: string;
  texto: string;
  resposta?: string;
  feedback?: string;
  tempo?: number; // em segundos
  pontuacao?: number; // 0-10
  tipoPergunta: TipoPergunta;
}

// Tipos de perguntas
export enum TipoPergunta {
  ABERTA = 'aberta',
  MULTIPLA_ESCOLHA = 'multipla_escolha',
  TECNICA = 'tecnica',
  COMPORTAMENTAL = 'comportamental'
}

// Modelo para histórico de atividades
export interface Atividade {
  id: string;
  usuarioId: string;
  tipo: TipoAtividade;
  data: Timestamp;
  detalhe?: string;
  referencia?: {
    tipo: string;
    id: string;
  };
}

// Tipos de atividades
export enum TipoAtividade {
  LOGIN = 'login',
  ENTREVISTA_INICIADA = 'entrevista_iniciada',
  ENTREVISTA_CONCLUIDA = 'entrevista_concluida',
  CONFIGURACAO_ATUALIZADA = 'configuracao_atualizada',
  PERFIL_ATUALIZADO = 'perfil_atualizado'
} 