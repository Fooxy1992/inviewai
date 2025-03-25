import { firestore } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { Usuario } from '@/models/types';

const COLECAO_USUARIOS = 'usuarios';

/**
 * Obtém os dados de um usuário por ID
 * @param userId ID do usuário
 * @returns Dados do usuário
 */
export const obterUsuarioPorId = async (userId: string): Promise<Usuario> => {
  try {
    const docRef = doc(firestore, COLECAO_USUARIOS, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Usuário com ID ${userId} não encontrado`);
    }

    return { id: docSnap.id, ...docSnap.data() } as Usuario;
  } catch (error) {
    console.error('Erro ao obter usuário por ID:', error);
    throw error;
  }
};

/**
 * Obtém usuário por e-mail
 * @param email E-mail do usuário
 * @returns Dados do usuário ou null se não encontrado
 */
export const obterUsuarioPorEmail = async (email: string): Promise<Usuario | null> => {
  try {
    const usuariosRef = collection(firestore, COLECAO_USUARIOS);
    const q = query(usuariosRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Usuario;
  } catch (error) {
    console.error('Erro ao obter usuário por e-mail:', error);
    throw error;
  }
};

/**
 * Cria um novo usuário ou atualiza um existente após autenticação
 * @param userId ID do usuário
 * @param userData Dados do usuário
 * @returns ID do usuário
 */
export const criarOuAtualizarUsuario = async (
  userId: string, 
  userData: { 
    nome: string; 
    email: string; 
    imagemUrl?: string;
  }
): Promise<string> => {
  try {
    const docRef = doc(firestore, COLECAO_USUARIOS, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Criar novo usuário
      const novoUsuario: Omit<Usuario, 'id'> = {
        nome: userData.nome,
        email: userData.email,
        imagemUrl: userData.imagemUrl || null,
        dataCriacao: Timestamp.now(),
        dataAtualizacao: Timestamp.now(),
        configuracoes: {
          temaEscuro: false,
          receberNotificacoes: true,
          idioma: 'pt-BR',
          modeloIA: 'gpt-3.5-turbo'
        }
      };
      
      await setDoc(docRef, novoUsuario);
      console.log(`Novo usuário criado: ${userId}`);
    } else {
      // Atualizar apenas dados básicos se usuário já existe
      await updateDoc(docRef, {
        nome: userData.nome,
        email: userData.email,
        imagemUrl: userData.imagemUrl || docSnap.data().imagemUrl,
        dataAtualizacao: Timestamp.now()
      });
      console.log(`Usuário atualizado: ${userId}`);
    }
    
    return userId;
  } catch (error) {
    console.error('Erro ao criar ou atualizar usuário:', error);
    throw error;
  }
};

/**
 * Atualiza dados de um usuário existente
 * @param userId ID do usuário
 * @param dados Dados a serem atualizados
 */
export const atualizarUsuario = async (
  userId: string, 
  dados: { 
    nome?: string; 
    imagemUrl?: string;
  }
): Promise<void> => {
  try {
    const docRef = doc(firestore, COLECAO_USUARIOS, userId);
    const dadosAtualizacao = {
      ...dados,
      dataAtualizacao: Timestamp.now()
    };
    
    await updateDoc(docRef, dadosAtualizacao);
    console.log(`Dados do usuário ${userId} atualizados`);
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    throw error;
  }
};

/**
 * Atualiza as configurações de um usuário
 * @param userId ID do usuário
 * @param configuracoes Configurações a serem atualizadas
 */
export const atualizarConfiguracoesUsuario = async (
  userId: string, 
  configuracoes: Partial<Usuario['configuracoes']>
): Promise<void> => {
  try {
    const docRef = doc(firestore, COLECAO_USUARIOS, userId);
    const userData = await getDoc(docRef);
    
    if (!userData.exists()) {
      throw new Error('Usuário não encontrado');
    }
    
    const configuracoesAtuais = userData.data().configuracoes || {};
    const configuracoesAtualizadas = {
      ...configuracoesAtuais,
      ...configuracoes
    };
    
    await updateDoc(docRef, {
      configuracoes: configuracoesAtualizadas,
      dataAtualizacao: Timestamp.now()
    });
    
    console.log(`Configurações do usuário ${userId} atualizadas`);
  } catch (error) {
    console.error('Erro ao atualizar configurações do usuário:', error);
    throw error;
  }
}; 