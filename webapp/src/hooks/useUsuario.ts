import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  obterUsuarioPorId, 
  atualizarUsuario, 
  atualizarConfiguracoesUsuario 
} from '@/services/usuarioService';
import { obterAtividadesRecentes } from '@/services/atividadeService';
import { Usuario, Atividade } from '@/models/types';

export const useUsuario = () => {
  const { data: session } = useSession();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar dados do usuário
  const carregarUsuario = useCallback(async () => {
    if (!session?.user?.id) return;

    setCarregando(true);
    setErro(null);

    try {
      const dadosUsuario = await obterUsuarioPorId(session.user.id);
      setUsuario(dadosUsuario);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setErro('Não foi possível carregar os dados do usuário. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id]);

  // Carregar atividades recentes do usuário
  const carregarAtividades = useCallback(async () => {
    if (!session?.user?.id) return;

    setCarregando(true);
    setErro(null);

    try {
      const atividadesRecentes = await obterAtividadesRecentes(session.user.id);
      setAtividades(atividadesRecentes);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      setErro('Não foi possível carregar as atividades recentes. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id]);

  // Atualizar dados do perfil do usuário
  const atualizarPerfil = useCallback(async (
    dados: { nome?: string; imagemUrl?: string }
  ) => {
    if (!session?.user?.id) return false;

    setCarregando(true);
    setErro(null);

    try {
      await atualizarUsuario(session.user.id, dados);
      await carregarUsuario(); // Recarregar dados atualizados
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setErro('Não foi possível atualizar o perfil. Tente novamente mais tarde.');
      return false;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, carregarUsuario]);

  // Atualizar configurações do usuário
  const atualizarConfiguracoes = useCallback(async (
    configuracoes: Usuario['configuracoes']
  ) => {
    if (!session?.user?.id || !usuario) return false;

    setCarregando(true);
    setErro(null);

    try {
      await atualizarConfiguracoesUsuario(session.user.id, configuracoes);
      await carregarUsuario(); // Recarregar dados atualizados
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      setErro('Não foi possível atualizar as configurações. Tente novamente mais tarde.');
      return false;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, usuario, carregarUsuario]);

  // Carregar dados do usuário quando a sessão estiver disponível
  useEffect(() => {
    if (session?.user?.id) {
      carregarUsuario();
      carregarAtividades();
    }
  }, [session?.user?.id, carregarUsuario, carregarAtividades]);

  return {
    usuario,
    atividades,
    carregando,
    erro,
    carregarUsuario,
    carregarAtividades,
    atualizarPerfil,
    atualizarConfiguracoes
  };
}; 