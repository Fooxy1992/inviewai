import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  serverTimestamp, 
  Timestamp,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  Atividade, 
  TipoAtividade 
} from '@/models/types';

const COLECAO_ATIVIDADES = 'atividades';

/**
 * Registra uma nova atividade no sistema
 */
export const registrarAtividade = async (
  usuarioId: string,
  tipo: TipoAtividade,
  detalhe?: string,
  referencia?: { tipo: string; id: string }
): Promise<string> => {
  const atividadeRef = doc(collection(db, COLECAO_ATIVIDADES));
  const id = atividadeRef.id;
  
  const novaAtividade: Atividade = {
    id,
    usuarioId,
    tipo,
    data: Timestamp.now(),
    detalhe,
    referencia
  };
  
  await setDoc(atividadeRef, novaAtividade);
  return id;
};

/**
 * Lista as atividades recentes de um usuário
 */
export const listarAtividadesDoUsuario = async (
  usuarioId: string,
  limite: number = 10
): Promise<Atividade[]> => {
  const atividadesRef = collection(db, COLECAO_ATIVIDADES);
  const q = query(
    atividadesRef, 
    where('usuarioId', '==', usuarioId),
    orderBy('data', 'desc'),
    limit(limite)
  );
  
  const querySnapshot = await getDocs(q);
  const atividades: Atividade[] = [];
  
  querySnapshot.forEach((doc) => {
    atividades.push({ ...doc.data(), id: doc.id } as Atividade);
  });
  
  return atividades;
};

/**
 * Registra atividade de login
 */
export const registrarLogin = async (usuarioId: string): Promise<void> => {
  await registrarAtividade(
    usuarioId,
    TipoAtividade.LOGIN,
    'Usuário realizou login no sistema'
  );
};

/**
 * Registra início de entrevista
 */
export const registrarInicioEntrevista = async (
  usuarioId: string,
  entrevistaId: string,
  titulo: string
): Promise<void> => {
  await registrarAtividade(
    usuarioId,
    TipoAtividade.ENTREVISTA_INICIADA,
    `Iniciou a entrevista: ${titulo}`,
    { tipo: 'entrevista', id: entrevistaId }
  );
};

/**
 * Registra conclusão de entrevista
 */
export const registrarConclusaoEntrevista = async (
  usuarioId: string,
  entrevistaId: string,
  titulo: string,
  pontuacao?: number
): Promise<void> => {
  let detalhe = `Concluiu a entrevista: ${titulo}`;
  if (pontuacao !== undefined) {
    detalhe += ` com pontuação ${pontuacao}`;
  }
  
  await registrarAtividade(
    usuarioId,
    TipoAtividade.ENTREVISTA_CONCLUIDA,
    detalhe,
    { tipo: 'entrevista', id: entrevistaId }
  );
};

/**
 * Registra atualização de configurações
 */
export const registrarAtualizacaoConfiguracoes = async (
  usuarioId: string,
  configuracaoAtualizada: string
): Promise<void> => {
  await registrarAtividade(
    usuarioId,
    TipoAtividade.CONFIGURACAO_ATUALIZADA,
    `Atualizou a configuração: ${configuracaoAtualizada}`
  );
};

/**
 * Registra atualização de perfil
 */
export const registrarAtualizacaoPerfil = async (
  usuarioId: string
): Promise<void> => {
  await registrarAtividade(
    usuarioId,
    TipoAtividade.PERFIL_ATUALIZADO,
    'Atualizou o perfil'
  );
}; 