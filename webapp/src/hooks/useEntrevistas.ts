import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  criarEntrevista,
  listarEntrevistasDoUsuario,
  obterEntrevistaPorId,
  adicionarPergunta,
  atualizarEntrevista,
  finalizarEntrevista,
  removerEntrevista
} from '@/services/entrevistaService';
import { 
  Entrevista, 
  TipoEntrevista, 
  StatusEntrevista,
  TipoPergunta
} from '@/models/types';
import { 
  registrarInicioEntrevista, 
  registrarConclusaoEntrevista 
} from '@/services/atividadeService';

export const useEntrevistas = () => {
  const { data: session } = useSession();
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [entrevistaAtual, setEntrevistaAtual] = useState<Entrevista | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar entrevistas do usuário
  const carregarEntrevistas = async () => {
    if (!session?.user?.id) {
      setEntrevistas([]);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);
      
      const listaEntrevistas = await listarEntrevistasDoUsuario(session.user.id);
      setEntrevistas(listaEntrevistas);
    } catch (error) {
      console.error('Erro ao carregar entrevistas:', error);
      setErro('Não foi possível carregar as entrevistas');
    } finally {
      setCarregando(false);
    }
  };

  // Carregar entrevistas quando o usuário estiver autenticado
  useEffect(() => {
    if (session?.user?.id) {
      carregarEntrevistas();
    }
  }, [session]);

  // Obter uma entrevista específica
  const obterEntrevista = async (id: string) => {
    try {
      setCarregando(true);
      setErro(null);
      
      const entrevista = await obterEntrevistaPorId(id);
      setEntrevistaAtual(entrevista);
      return entrevista;
    } catch (error) {
      console.error('Erro ao obter entrevista:', error);
      setErro('Não foi possível obter a entrevista');
      return null;
    } finally {
      setCarregando(false);
    }
  };

  // Criar nova entrevista
  const novaEntrevista = async (
    titulo: string,
    tipo: TipoEntrevista,
    descricao?: string
  ) => {
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setCarregando(true);
      setErro(null);
      
      const entrevistaId = await criarEntrevista(
        session.user.id,
        titulo,
        tipo,
        descricao
      );
      
      // Registrar atividade
      await registrarInicioEntrevista(session.user.id, entrevistaId, titulo);
      
      // Atualizar a lista de entrevistas
      await carregarEntrevistas();
      
      return entrevistaId;
    } catch (error) {
      console.error('Erro ao criar entrevista:', error);
      setErro('Não foi possível criar a entrevista');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  // Adicionar pergunta a uma entrevista
  const adicionarNovaPergunta = async (
    entrevistaId: string,
    texto: string,
    tipoPergunta: TipoPergunta
  ) => {
    try {
      setCarregando(true);
      setErro(null);
      
      const perguntaId = await adicionarPergunta(entrevistaId, texto, tipoPergunta);
      
      // Atualizar a entrevista atual se estiver carregada
      if (entrevistaAtual && entrevistaAtual.id === entrevistaId) {
        const entrevistaAtualizada = await obterEntrevistaPorId(entrevistaId);
        setEntrevistaAtual(entrevistaAtualizada);
      }
      
      return perguntaId;
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
      setErro('Não foi possível adicionar a pergunta');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  // Atualizar dados de uma entrevista
  const atualizarDadosEntrevista = async (
    id: string,
    dados: Partial<Entrevista>
  ) => {
    try {
      setCarregando(true);
      setErro(null);
      
      await atualizarEntrevista(id, dados);
      
      // Atualizar a entrevista atual se estiver carregada
      if (entrevistaAtual && entrevistaAtual.id === id) {
        const entrevistaAtualizada = await obterEntrevistaPorId(id);
        setEntrevistaAtual(entrevistaAtualizada);
      }
      
      // Atualizar a lista de entrevistas
      await carregarEntrevistas();
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar entrevista:', error);
      setErro('Não foi possível atualizar a entrevista');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  // Finalizar uma entrevista com feedback
  const concluirEntrevista = async (
    id: string,
    feedback: string,
    pontuacao: number,
    duracao: number
  ) => {
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setCarregando(true);
      setErro(null);
      
      await finalizarEntrevista(id, feedback, pontuacao, duracao);
      
      // Registrar atividade
      const entrevista = await obterEntrevistaPorId(id);
      if (entrevista) {
        await registrarConclusaoEntrevista(
          session.user.id,
          id,
          entrevista.titulo,
          pontuacao
        );
      }
      
      // Atualizar estado
      setEntrevistaAtual(entrevista);
      await carregarEntrevistas();
      
      return true;
    } catch (error) {
      console.error('Erro ao finalizar entrevista:', error);
      setErro('Não foi possível finalizar a entrevista');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  // Excluir uma entrevista
  const excluirEntrevista = async (id: string) => {
    try {
      setCarregando(true);
      setErro(null);
      
      await removerEntrevista(id);
      
      // Se a entrevista atual for excluída, limpar o estado
      if (entrevistaAtual && entrevistaAtual.id === id) {
        setEntrevistaAtual(null);
      }
      
      // Atualizar a lista de entrevistas
      await carregarEntrevistas();
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir entrevista:', error);
      setErro('Não foi possível excluir a entrevista');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  return {
    entrevistas,
    entrevistaAtual,
    carregando,
    erro,
    carregarEntrevistas,
    obterEntrevista,
    novaEntrevista,
    adicionarNovaPergunta,
    atualizarDadosEntrevista,
    concluirEntrevista,
    excluirEntrevista
  };
}; 