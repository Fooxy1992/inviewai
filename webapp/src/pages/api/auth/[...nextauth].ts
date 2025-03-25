import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/config/firebase';
import { Session } from 'next-auth';
import { criarOuAtualizarUsuario, obterUsuarioPorId } from '@/services/usuarioService';
import { registrarLogin } from '@/services/atividadeService';

// Estender a interface User para incluir o campo id
declare module "next-auth" {
  interface User {
    id: string;
  }
  
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        try {
          // Autenticar com Firebase
          const { user } = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          
          // Verificar se o usuário já existe no Firestore
          const firestoreUser = await obterUsuarioPorId(user.uid);
          
          // Se o usuário não existir no Firestore, criar novo registro
          if (!firestoreUser) {
            await criarOuAtualizarUsuario(
              user.uid,
              { 
                nome: user.displayName || 'Usuário', 
                email: user.email || '',
                imagemUrl: user.photoURL || undefined
              }
            );
          }
          
          // Registrar atividade de login
          await registrarLogin(user.uid);
          
          // Retornar o usuário em um formato compatível com NextAuth
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL,
          };
        } catch (error) {
          console.error('Erro de autenticação:', error);
          // Tratar erros específicos do Firebase
          if (error instanceof FirebaseError) {
            throw new Error(error.message);
          }
          throw new Error('Falha na autenticação');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adicionar dados do usuário ao token JWT
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      // Adicionar dados do token à sessão
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
}); 