import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Atividade, TipoAtividade } from '@/models/types';

const COLECAO_ATIVIDADES = 'atividades';

/**
 * Registrar uma nova atividade do usuário
 */
export async function registrarAtividade(
  userId: string,
  tipo: TipoAtividade,
  metadados?: Record<string, any>
): Promise<string> {
  try {
    const atividadesRef = collection(db, COLECAO_ATIVIDADES);
    
    const novaAtividade = {
      userId,
      tipo,
      data: serverTimestamp(),
      metadados: metadados || {}
    };
    
    const docRef = await addDoc(atividadesRef, novaAtividade);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    throw error;
  }
}

/**
 * Registrar login do usuário
 */
export async function registrarLogin(userId: string): Promise<string> {
  return registrarAtividade(userId, TipoAtividade.LOGIN);
}

/**
 * Registrar criação de entrevista
 */
export async function registrarCriacaoEntrevista(
  userId: string,
  entrevistaId: string,
  titulo: string
): Promise<string> {
  return registrarAtividade(
    userId,
    TipoAtividade.ENTREVISTA_CRIADA,
    { entrevistaId, titulo }
  );
}

/**
 * Registrar início de entrevista
 */
export async function registrarInicioEntrevista(
  userId: string,
  entrevistaId: string,
  titulo: string
): Promise<string> {
  return registrarAtividade(
    userId,
    TipoAtividade.ENTREVISTA_INICIADA,
    { entrevistaId, titulo }
  );
}

/**
 * Registrar conclusão de entrevista
 */
export async function registrarConclusaoEntrevista(
  userId: string,
  entrevistaId: string,
  titulo: string,
  pontuacao?: number
): Promise<string> {
  return registrarAtividade(
    userId,
    TipoAtividade.ENTREVISTA_CONCLUIDA,
    { entrevistaId, titulo, pontuacao }
  );
}

/**
 * Registrar solicitação de feedback
 */
export async function registrarSolicitacaoFeedback(
  userId: string,
  entrevistaId: string,
  perguntaId: string
): Promise<string> {
  return registrarAtividade(
    userId,
    TipoAtividade.FEEDBACK_SOLICITADO,
    { entrevistaId, perguntaId }
  );
}

/**
 * Obter atividades recentes do usuário
 */
export async function obterAtividadesRecentes(
  userId: string,
  quantidade: number = 10
): Promise<Atividade[]> {
  try {
    const atividadesRef = collection(db, COLECAO_ATIVIDADES);
    const q = query(
      atividadesRef,
      where('userId', '==', userId),
      orderBy('data', 'desc'),
      limit(quantidade)
    );
    
    const querySnapshot = await getDocs(q);
    const atividades: Atividade[] = [];
    
    querySnapshot.forEach((doc) => {
      atividades.push({ id: doc.id, ...doc.data() } as Atividade);
    });
    
    return atividades;
  } catch (error) {
    console.error('Erro ao obter atividades recentes:', error);
    throw error;
  }
} 