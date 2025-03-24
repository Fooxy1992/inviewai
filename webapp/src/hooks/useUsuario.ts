import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  obterUsuarioPorId, 
  atualizarPerfilUsuario, 
  atualizarConfiguracoesUsuario 
} from '@/services/usuarioService';
import { Usuario, Configuracoes } from '@/models/types';
import { registrarAtualizacaoPerfil, registrarAtualizacaoConfiguracoes } from '@/services/atividadeService';

export const useUsuario = () => {
  const { data: session } = useSession();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar dados do usuário
  useEffect(() => {
    const carregarUsuario = async () => {
      if (session?.user?.id) {
        try {
          setCarregando(true);
          setErro(null);
          
          const dadosUsuario = await obterUsuarioPorId(session.user.id);
          setUsuario(dadosUsuario);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          setErro('Não foi possível carregar os dados do usuário');
        } finally {
          setCarregando(false);
        }
      } else {
        setUsuario(null);
        setCarregando(false);
      }
    };

    carregarUsuario();
  }, [session]);

  // Atualizar perfil do usuário
  const atualizarPerfil = async (dados: { nome?: string; fotoPerfil?: string }) => {
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setCarregando(true);
      await atualizarPerfilUsuario(session.user.id, dados);
      
      // Registrar atividade
      await registrarAtualizacaoPerfil(session.user.id);
      
      // Atualizar estado local
      setUsuario((usuarioAtual) => {
        if (!usuarioAtual) return null;
        return { ...usuarioAtual, ...dados };
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setErro('Não foi possível atualizar o perfil');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  // Atualizar configurações do usuário
  const atualizarConfiguracoes = async (configuracoes: Partial<Configuracoes>) => {
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setCarregando(true);
      await atualizarConfiguracoesUsuario(session.user.id, configuracoes);
      
      // Identificar qual configuração foi atualizada
      const configNomes = Object.keys(configuracoes).join(', ');
      await registrarAtualizacaoConfiguracoes(session.user.id, configNomes);
      
      // Atualizar estado local
      setUsuario((usuarioAtual) => {
        if (!usuarioAtual) return null;
        return {
          ...usuarioAtual,
          configuracoes: {
            ...usuarioAtual.configuracoes,
            ...configuracoes
          }
        };
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      setErro('Não foi possível atualizar as configurações');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  return {
    usuario,
    carregando,
    erro,
    atualizarPerfil,
    atualizarConfiguracoes
  };
}; 