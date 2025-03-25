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
  TipoPergunta,
  Resposta,
  Feedback
} from '@/models/types';
import { v4 as uuidv4 } from 'uuid';

const COLECAO_ENTREVISTAS = 'entrevistas';
const COLECAO_PERGUNTAS = 'perguntas';

/**
 * Criar uma nova entrevista
 */
export async function criarEntrevista(
  userId: string,
  titulo: string,
  tipo: TipoEntrevista,
  descricao?: string
): Promise<string> {
  const entrevistasRef = collection(db, COLECAO_ENTREVISTAS);
  
  const novaEntrevista: Entrevista = {
    id: uuidv4(),
    userId,
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
}

/**
 * Obter uma entrevista pelo ID
 */
export async function obterEntrevistaPorId(id: string): Promise<Entrevista | null> {
  try {
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, id);
    const entrevistaDoc = await getDoc(entrevistaRef);
    
    if (!entrevistaDoc.exists()) {
      return null;
    }
    
    return entrevistaDoc.data() as Entrevista;
  } catch (error) {
    console.error('Erro ao obter entrevista:', error);
    return null;
  }
}

/**
 * Lista todas as entrevistas de um usuário
 */
export async function listarEntrevistasDoUsuario(userId: string): Promise<Entrevista[]> {
  const entrevistasRef = collection(db, COLECAO_ENTREVISTAS);
  const q = query(
    entrevistasRef, 
    where('userId', '==', userId),
    orderBy('dataAtualizacao', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const entrevistas: Entrevista[] = [];
  
  querySnapshot.forEach((doc) => {
    entrevistas.push(doc.data() as Entrevista);
  });
  
  return entrevistas;
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
    const dadosAtualizados = {
      ...dados,
      dataAtualizacao: Timestamp.now()
    };
    
    await updateDoc(entrevistaRef, dadosAtualizados);
  } catch (error) {
    console.error('Erro ao atualizar entrevista:', error);
    throw error;
  }
}

/**
 * Adicionar uma nova pergunta à entrevista
 */
export async function adicionarPergunta(
  entrevistaId: string,
  texto: string,
  tipo: TipoPergunta
): Promise<string> {
  try {
    // Obter a entrevista atual
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    const entrevistaDoc = await getDoc(entrevistaRef);
    
    if (!entrevistaDoc.exists()) {
      throw new Error(`Entrevista com ID ${entrevistaId} não encontrada`);
    }
    
    const entrevista = entrevistaDoc.data() as Entrevista;
    
    // Criar nova pergunta
    const novaPergunta: Pergunta = {
      id: uuidv4(),
      texto,
      tipo,
      entrevistaId,
      dataCriacao: Timestamp.now()
    };
    
    // Atualizar a entrevista com a nova pergunta
    const perguntas = entrevista.perguntas || [];
    
    await updateDoc(entrevistaRef, {
      perguntas: [...perguntas, novaPergunta],
      dataAtualizacao: Timestamp.now()
    });
    
    return novaPergunta.id;
  } catch (error) {
    console.error('Erro ao adicionar pergunta:', error);
    throw error;
  }
}

/**
 * Salvar resposta para uma pergunta
 */
export async function salvarResposta(
  entrevistaId: string,
  perguntaId: string,
  textoResposta: string
): Promise<void> {
  try {
    // Obter a entrevista atual
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    const entrevistaDoc = await getDoc(entrevistaRef);
    
    if (!entrevistaDoc.exists()) {
      throw new Error(`Entrevista com ID ${entrevistaId} não encontrada`);
    }
    
    const entrevista = entrevistaDoc.data() as Entrevista;
    const perguntas = entrevista.perguntas || [];
    
    // Encontrar a pergunta específica
    const perguntaIndex = perguntas.findIndex(p => p.id === perguntaId);
    
    if (perguntaIndex === -1) {
      throw new Error(`Pergunta com ID ${perguntaId} não encontrada na entrevista`);
    }
    
    // Criar ou atualizar a resposta
    const resposta: Resposta = {
      texto: textoResposta,
      dataCriacao: Timestamp.now()
    };
    
    // Atualizar a pergunta com a resposta
    perguntas[perguntaIndex].resposta = resposta;
    
    // Atualizar a entrevista
    await updateDoc(entrevistaRef, {
      perguntas,
      dataAtualizacao: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    throw error;
  }
}

/**
 * Adicionar feedback para uma pergunta
 */
export async function adicionarFeedback(
  entrevistaId: string,
  perguntaId: string,
  feedbackTexto: string,
  pontuacao?: number
): Promise<void> {
  try {
    // Obter a entrevista atual
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    const entrevistaDoc = await getDoc(entrevistaRef);
    
    if (!entrevistaDoc.exists()) {
      throw new Error(`Entrevista com ID ${entrevistaId} não encontrada`);
    }
    
    const entrevista = entrevistaDoc.data() as Entrevista;
    const perguntas = entrevista.perguntas || [];
    
    // Encontrar a pergunta específica
    const perguntaIndex = perguntas.findIndex(p => p.id === perguntaId);
    
    if (perguntaIndex === -1) {
      throw new Error(`Pergunta com ID ${perguntaId} não encontrada na entrevista`);
    }
    
    // Criar feedback
    const feedback: Feedback = {
      texto: feedbackTexto,
      pontuacao: pontuacao || 0,
      dataCriacao: Timestamp.now(),
      geradoPorIA: true
    };
    
    // Atualizar a pergunta com o feedback
    perguntas[perguntaIndex].feedback = feedback;
    
    // Atualizar a entrevista
    await updateDoc(entrevistaRef, {
      perguntas,
      dataAtualizacao: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao adicionar feedback:', error);
    throw error;
  }
}

/**
 * Remover uma pergunta da entrevista
 */
export async function removerPergunta(
  entrevistaId: string,
  perguntaId: string
): Promise<void> {
  try {
    // Obter a entrevista atual
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    const entrevistaDoc = await getDoc(entrevistaRef);
    
    if (!entrevistaDoc.exists()) {
      throw new Error(`Entrevista com ID ${entrevistaId} não encontrada`);
    }
    
    const entrevista = entrevistaDoc.data() as Entrevista;
    const perguntas = entrevista.perguntas || [];
    
    // Filtrar a pergunta a ser removida
    const perguntasAtualizadas = perguntas.filter(p => p.id !== perguntaId);
    
    // Atualizar a entrevista
    await updateDoc(entrevistaRef, {
      perguntas: perguntasAtualizadas,
      dataAtualizacao: Timestamp.now()
    });
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
    
    // Dados adicionais com base no status
    const dadosAdicionais: any = {};
    
    if (status === StatusEntrevista.EM_ANDAMENTO) {
      dadosAdicionais.dataInicio = Timestamp.now();
    } else if (status === StatusEntrevista.CONCLUIDA) {
      dadosAdicionais.dataConclusao = Timestamp.now();
    }
    
    await updateDoc(entrevistaRef, {
      status,
      dataAtualizacao: Timestamp.now(),
      ...dadosAdicionais
    });
  } catch (error) {
    console.error('Erro ao atualizar status da entrevista:', error);
    throw error;
  }
}

/**
 * Adicionar feedback geral para uma entrevista
 */
export async function adicionarFeedbackGeral(
  entrevistaId: string,
  feedbackTexto: string,
  pontuacao?: number
): Promise<void> {
  try {
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    
    const feedback: Feedback = {
      texto: feedbackTexto,
      pontuacao: pontuacao || 0,
      dataCriacao: Timestamp.now(),
      geradoPorIA: true
    };
    
    await updateDoc(entrevistaRef, {
      feedbackGeral: feedback,
      dataAtualizacao: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao adicionar feedback geral:', error);
    throw error;
  }
}

/**
 * Excluir uma entrevista
 */
export async function excluirEntrevista(entrevistaId: string): Promise<void> {
  try {
    const entrevistaRef = doc(db, COLECAO_ENTREVISTAS, entrevistaId);
    await deleteDoc(entrevistaRef);
  } catch (error) {
    console.error('Erro ao excluir entrevista:', error);
    throw error;
  }
} 