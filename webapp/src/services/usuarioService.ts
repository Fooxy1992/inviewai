import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Usuario, Configuracoes } from '@/models/types';

const COLECAO_USUARIOS = 'usuarios';

/**
 * Cria um novo usuário no Firestore
 */
export const criarUsuario = async (uid: string, email: string, nome?: string, fotoPerfil?: string): Promise<void> => {
  const usuarioRef = doc(db, COLECAO_USUARIOS, uid);
  const novoUsuario: Usuario = {
    id: uid,
    email,
    nome: nome || '',
    fotoPerfil: fotoPerfil || '',
    dataCriacao: Timestamp.now(),
    configuracoes: {
      temaEscuro: false,
      idiomaPreferido: 'pt-BR',
      notificacoesAtivadas: true
    }
  };
  
  await setDoc(usuarioRef, novoUsuario);
};

/**
 * Obtém um usuário pelo ID
 */
export const obterUsuarioPorId = async (uid: string): Promise<Usuario | null> => {
  const usuarioRef = doc(db, COLECAO_USUARIOS, uid);
  const usuarioDoc = await getDoc(usuarioRef);
  
  if (usuarioDoc.exists()) {
    return usuarioDoc.data() as Usuario;
  }
  
  return null;
};

/**
 * Busca usuário por email
 */
export const buscarUsuarioPorEmail = async (email: string): Promise<Usuario | null> => {
  const usuariosRef = collection(db, COLECAO_USUARIOS);
  const q = query(usuariosRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { ...doc.data(), id: doc.id } as Usuario;
  }
  
  return null;
};

/**
 * Atualiza o último login do usuário
 */
export const atualizarUltimoLogin = async (uid: string): Promise<void> => {
  const usuarioRef = doc(db, COLECAO_USUARIOS, uid);
  await updateDoc(usuarioRef, {
    ultimoLogin: serverTimestamp()
  });
};

/**
 * Atualiza o perfil do usuário
 */
export const atualizarPerfilUsuario = async (
  uid: string, 
  dados: { nome?: string, fotoPerfil?: string }
): Promise<void> => {
  const usuarioRef = doc(db, COLECAO_USUARIOS, uid);
  await updateDoc(usuarioRef, { ...dados });
};

/**
 * Atualiza as configurações do usuário
 */
export const atualizarConfiguracoesUsuario = async (
  uid: string,
  configuracoes: Partial<Configuracoes>
): Promise<void> => {
  const usuarioRef = doc(db, COLECAO_USUARIOS, uid);
  const usuarioDoc = await getDoc(usuarioRef);
  
  if (usuarioDoc.exists()) {
    const dadosUsuario = usuarioDoc.data() as Usuario;
    const configAtualizadas = {
      ...dadosUsuario.configuracoes,
      ...configuracoes
    };
    
    await updateDoc(usuarioRef, {
      configuracoes: configAtualizadas
    });
  }
}; 