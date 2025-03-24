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
  const entrevistaRef = doc(collection(db, COLECAO_ENTREVISTAS));
  const id = entrevistaRef.id;
  
  const novaEntrevista: Entrevista = {
    id,
    usuarioId,
    titulo,
    descricao: descricao || '',
    dataCriacao: Timestamp.now(),
    dataAtualizacao: Timestamp.now(),
    tipo,
    status: StatusEntrevista.PENDENTE,
    perguntas: []
  };
  
  await setDoc(entrevistaRef, novaEntrevista);
  return id;
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