import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp, 
  Timestamp,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  DocumentReference
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  Entrevista, 
  StatusEntrevista, 
  TipoEntrevista, 
  Pergunta,
  TipoPergunta 
} from '@/models/types';
import { v4 as uuidv4 } from 'uuid';

const COLECAO_ENTREVISTAS = 'entrevistas';
const COLECAO_PERGUNTAS = 'perguntas';

/**
 * Cria uma nova entrevista no Firestore
 */
export const criarEntrevista = async (
  usuarioId: string,
  titulo: string,
  tipo: TipoEntrevista,
  descricao?: string
): Promise<string> => {
  const entrevistasRef = collection(db, COLECAO_ENTREVISTAS);
  
  const novaEntrevista: Entrevista = {
    id: uuidv4(),
    usuarioId,
    titulo,
    descricao: descricao || '',
    dataCriacao: Timestamp.now(),
    dataAtualizacao: Timestamp.now(),
    tipo,
    status: StatusEntrevista.PENDENTE,
    perguntas: []
  };
  
  await setDoc(doc(entrevistasRef, novaEntrevista.id), novaEntrevista);
  return novaEntrevista.id;
};

/**
 * Obtém uma entrevista pelo ID
 */
export const obterEntrevistaPorId = async (id: string): Promise<Entrevista | null> => {
  const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, id);
  const entrevistaDoc = await getDoc(entrevistaRef);
  
  if (entrevistaDoc.exists()) {
    const entrevista = entrevistaDoc.data() as Entrevista;
    
    // Buscar perguntas associadas
    const perguntasRef = collection(db, COLECAO_PERGUNTAS);
    const q = query(perguntasRef, where('entrevistaId', '==', id));
    const querySnapshot = await getDocs(q);
    
    const perguntas: Pergunta[] = [];
    querySnapshot.forEach((doc) => {
      perguntas.push({ id: doc.id, ...doc.data() } as Pergunta);
    });
    
    return { ...entrevista, perguntas };
  }
  
  return null;
};

/**
 * Lista todas as entrevistas de um usuário
 */
export const listarEntrevistasDoUsuario = async (usuarioId: string): Promise<Entrevista[]> => {
  const entrevistasRef = collection(db, COLECAO_ENTREVISTAS);
  const q = query(
    entrevistasRef, 
    where('usuarioId', '==', usuarioId),
    orderBy('dataAtualizacao', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const entrevistas: Entrevista[] = [];
  
  querySnapshot.forEach((doc) => {
    entrevistas.push({ ...doc.data(), id: doc.id } as Entrevista);
  });
  
  return entrevistas;
};

/**
 * Atualiza os detalhes de uma entrevista
 */
export const atualizarEntrevista = async (
  id: string,
  dados: Partial<Entrevista>
): Promise<void> => {
  const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, id);
  
  await updateDoc(entrevistaRef, {
    ...dados,
    dataAtualizacao: serverTimestamp()
  });
};

/**
 * Adiciona uma pergunta a uma entrevista
 */
export const adicionarPergunta = async (
  entrevistaId: string,
  texto: string,
  tipoPergunta: TipoPergunta
): Promise<string> => {
  // Primeiro verifica se a entrevista existe
  const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
  const entrevistaDoc = await getDoc(entrevistaRef);
  
  if (!entrevistaDoc.exists()) {
    throw new Error('Entrevista não encontrada');
  }
  
  const perguntaRef = doc(collection(db, COLECAO_PERGUNTAS));
  const id = perguntaRef.id;
  
  const novaPergunta: Pergunta = {
    id,
    entrevistaId,
    texto,
    tipoPergunta
  };
  
  await setDoc(perguntaRef, novaPergunta);
  
  // Atualiza a data de atualização da entrevista
  await updateDoc(entrevistaRef, {
    dataAtualizacao: serverTimestamp()
  });
  
  return id;
};

/**
 * Adiciona resposta a uma pergunta
 */
export const adicionarResposta = async (
  perguntaId: string,
  resposta: string,
  tempo?: number
): Promise<void> => {
  const perguntaRef = doc(db, COLECAO_PERGUNTAS, perguntaId);
  
  await updateDoc(perguntaRef, {
    resposta,
    tempo
  });
};

/**
 * Adiciona feedback a uma pergunta
 */
export const adicionarFeedbackPergunta = async (
  perguntaId: string,
  feedback: string,
  pontuacao?: number
): Promise<void> => {
  const perguntaRef = doc(db, COLECAO_PERGUNTAS, perguntaId);
  
  await updateDoc(perguntaRef, {
    feedback,
    pontuacao
  });
};

/**
 * Finaliza uma entrevista
 */
export const finalizarEntrevista = async (
  entrevistaId: string,
  feedback: string,
  pontuacao: number,
  duracao: number
): Promise<void> => {
  const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
  
  await updateDoc(entrevistaRef, {
    status: StatusEntrevista.CONCLUIDA,
    feedback,
    pontuacao,
    duracao,
    dataAtualizacao: serverTimestamp()
  });
};

/**
 * Remove uma entrevista e suas perguntas associadas
 */
export const removerEntrevista = async (entrevistaId: string): Promise<void> => {
  // Primeiro, remove todas as perguntas associadas
  const perguntasRef = collection(db, COLECAO_PERGUNTAS);
  const q = query(perguntasRef, where('entrevistaId', '==', entrevistaId));
  const querySnapshot = await getDocs(q);
  
  const batch: Promise<void>[] = [];
  querySnapshot.forEach((doc) => {
    batch.push(deleteDoc(doc.ref));
  });
  
  await Promise.all(batch);
  
  // Em seguida, remove a entrevista
  const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
  await deleteDoc(entrevistaRef);
};

/**
 * Obter todas as entrevistas de um usuário
 */
export async function obterEntrevistasDoUsuario(userId: string): Promise<Entrevista[]> {
  try {
    const entrevistasRef = collection(db, COLECAO_ENTREVISTAS);
    const q = query(
      entrevistasRef, 
      where('userId', '==', userId),
      orderBy('dataAtualizacao', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const entrevistas: Entrevista[] = [];
    
    querySnapshot.forEach((doc) => {
      entrevistas.push({ id: doc.id, ...doc.data() } as Entrevista);
    });
    
    return entrevistas;
  } catch (error) {
    console.error('Erro ao obter entrevistas:', error);
    throw error;
  }
}

/**
 * Obter uma entrevista específica com suas perguntas
 */
export async function obterEntrevista(entrevistaId: string): Promise<Entrevista | null> {
  try {
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    const entrevistaDoc = await getDoc(entrevistaRef);
    
    if (!entrevistaDoc.exists()) {
      return null;
    }
    
    const entrevista = { id: entrevistaDoc.id, ...entrevistaDoc.data() } as Entrevista;
    
    // Buscar perguntas relacionadas
    const perguntasRef = collection(db, COLECAO_PERGUNTAS);
    const q = query(
      perguntasRef,
      where('entrevistaId', '==', entrevistaId),
      orderBy('dataCriacao', 'asc')
    );
    
    const perguntasSnapshot = await getDocs(q);
    const perguntas: Pergunta[] = [];
    
    perguntasSnapshot.forEach((doc) => {
      perguntas.push({ id: doc.id, ...doc.data() } as Pergunta);
    });
    
    entrevista.perguntas = perguntas;
    
    return entrevista;
  } catch (error) {
    console.error('Erro ao obter entrevista:', error);
    throw error;
  }
}

/**
 * Atualizar dados de uma entrevista
 */
export async function atualizarEntrevista(
  entrevistaId: string,
  dados: Partial<Omit<Entrevista, 'id' | 'userId' | 'dataCriacao' | 'perguntas'>>
): Promise<void> {
  try {
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    
    await updateDoc(entrevistaRef, {
      ...dados,
      dataAtualizacao: serverTimestamp()
    });
  } catch (error) {
    console.error('Erro ao atualizar entrevista:', error);
    throw error;
  }
}

/**
 * Excluir uma entrevista e suas perguntas
 */
export async function excluirEntrevista(entrevistaId: string): Promise<void> {
  try {
    // Primeiro excluir todas as perguntas relacionadas
    const perguntasRef = collection(db, COLECAO_PERGUNTAS);
    const q = query(perguntasRef, where('entrevistaId', '==', entrevistaId));
    const perguntasSnapshot = await getDocs(q);
    
    const deletePromises: Promise<void>[] = [];
    
    perguntasSnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    
    // Depois excluir a entrevista
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    await deleteDoc(entrevistaRef);
  } catch (error) {
    console.error('Erro ao excluir entrevista:', error);
    throw error;
  }
}

/**
 * Adicionar uma nova pergunta à entrevista
 */
export async function adicionarPergunta(
  entrevistaId: string,
  texto: string,
  tipoPergunta: TipoPergunta
): Promise<string> {
  try {
    // Atualizar dataAtualizacao da entrevista
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    await updateDoc(entrevistaRef, {
      dataAtualizacao: serverTimestamp()
    });
    
    // Adicionar nova pergunta
    const perguntasRef = collection(db, COLECAO_PERGUNTAS);
    
    const novaPergunta = {
      entrevistaId,
      texto,
      tipoPergunta,
      dataCriacao: serverTimestamp()
    };
    
    const docRef = await addDoc(perguntasRef, novaPergunta);
    
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar pergunta:', error);
    throw error;
  }
}

/**
 * Salvar resposta para uma pergunta
 */
export async function salvarResposta(
  perguntaId: string,
  resposta: string
): Promise<void> {
  try {
    const perguntaRef = doc(db, COLECAO_PERGUNTAS, perguntaId);
    
    await updateDoc(perguntaRef, {
      resposta,
      dataResposta: serverTimestamp()
    });
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    throw error;
  }
}

/**
 * Adicionar feedback a uma pergunta
 */
export async function adicionarFeedback(
  perguntaId: string,
  feedback: string,
  pontuacao?: number
): Promise<void> {
  try {
    const perguntaRef = doc(db, COLECAO_PERGUNTAS, perguntaId);
    
    const dadosUpdate: Record<string, any> = {
      feedback,
      dataFeedback: serverTimestamp()
    };
    
    if (pontuacao !== undefined) {
      dadosUpdate.pontuacao = pontuacao;
    }
    
    await updateDoc(perguntaRef, dadosUpdate);
  } catch (error) {
    console.error('Erro ao adicionar feedback:', error);
    throw error;
  }
}

/**
 * Remover uma pergunta
 */
export async function removerPergunta(perguntaId: string): Promise<void> {
  try {
    const perguntaRef = doc(db, COLECAO_PERGUNTAS, perguntaId);
    await deleteDoc(perguntaRef);
  } catch (error) {
    console.error('Erro ao remover pergunta:', error);
    throw error;
  }
}

/**
 * Atualizar o status de uma entrevista
 */
export async function atualizarStatusEntrevista(
  entrevistaId: string,
  status: StatusEntrevista
): Promise<void> {
  try {
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    
    const dadosUpdate: Record<string, any> = {
      status,
      dataAtualizacao: serverTimestamp()
    };
    
    // Se estiver sendo concluída, adicionar a data de conclusão
    if (status === StatusEntrevista.CONCLUIDA) {
      dadosUpdate.dataConclusao = serverTimestamp();
    }
    
    await updateDoc(entrevistaRef, dadosUpdate);
  } catch (error) {
    console.error('Erro ao atualizar status da entrevista:', error);
    throw error;
  }
}

/**
 * Adicionar feedback geral a uma entrevista
 */
export async function adicionarFeedbackGeral(
  entrevistaId: string,
  feedbackGeral: string,
  pontuacaoGeral?: number
): Promise<void> {
  try {
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    
    const dadosUpdate: Record<string, any> = {
      feedbackGeral,
      dataAtualizacao: serverTimestamp()
    };
    
    if (pontuacaoGeral !== undefined) {
      dadosUpdate.pontuacaoGeral = pontuacaoGeral;
    }
    
    await updateDoc(entrevistaRef, dadosUpdate);
  } catch (error) {
    console.error('Erro ao adicionar feedback geral:', error);
    throw error;
  }
} 