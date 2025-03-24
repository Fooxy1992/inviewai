import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
  obterEntrevistasDoUsuario, 
  obterEntrevista, 
  criarEntrevista, 
  atualizarEntrevista, 
  excluirEntrevista, 
  adicionarPergunta,
  salvarResposta,
  adicionarFeedback
} from '@/services/entrevistaService';
import { 
  registrarCriacaoEntrevista, 
  registrarInicioEntrevista, 
  registrarConclusaoEntrevista,
  registrarSolicitacaoFeedback
} from '@/services/atividadeService';
import { Entrevista, TipoEntrevista, StatusEntrevista, TipoPergunta } from '@/models/types';

export const useEntrevistas = () => {
  const { data: session } = useSession();
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [entrevistaAtual, setEntrevistaAtual] = useState<Entrevista | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar todas as entrevistas do usuário
  const carregarEntrevistas = useCallback(async () => {
    if (!session?.user?.id) return;

    setCarregando(true);
    setErro(null);

    try {
      const entrevistasDoUsuario = await obterEntrevistasDoUsuario(session.user.id);
      setEntrevistas(entrevistasDoUsuario);
    } catch (error) {
      console.error('Erro ao carregar entrevistas:', error);
      setErro('Não foi possível carregar suas entrevistas. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id]);

  // Obter uma entrevista específica pelo ID
  const obterEntrevistaDetalhada = useCallback(async (entrevistaId: string) => {
    if (!session?.user?.id) return null;

    setCarregando(true);
    setErro(null);

    try {
      const entrevistaDetalhada = await obterEntrevista(entrevistaId);
      
      if (!entrevistaDetalhada) {
        setErro('Entrevista não encontrada');
        return null;
      }
      
      if (entrevistaDetalhada.userId !== session.user.id) {
        setErro('Você não tem permissão para acessar esta entrevista');
        return null;
      }
      
      setEntrevistaAtual(entrevistaDetalhada);
      return entrevistaDetalhada;
    } catch (error) {
      console.error('Erro ao obter entrevista:', error);
      setErro('Não foi possível carregar os detalhes da entrevista. Tente novamente mais tarde.');
      return null;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id]);

  // Criar uma nova entrevista
  const novaEntrevista = useCallback(async (
    titulo: string,
    tipo: TipoEntrevista,
    descricao?: string
  ) => {
    if (!session?.user?.id) return null;

    setCarregando(true);
    setErro(null);

    try {
      const entrevistaId = await criarEntrevista(session.user.id, titulo, tipo, descricao);
      
      // Registrar atividade
      await registrarCriacaoEntrevista(session.user.id, entrevistaId, titulo);
      
      await carregarEntrevistas();
      return entrevistaId;
    } catch (error) {
      console.error('Erro ao criar entrevista:', error);
      setErro('Não foi possível criar a entrevista. Tente novamente mais tarde.');
      return null;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, carregarEntrevistas]);

  // Atualizar dados de uma entrevista
  const atualizarDadosEntrevista = useCallback(async (
    entrevistaId: string,
    dados: Partial<Omit<Entrevista, 'id' | 'userId' | 'dataCriacao' | 'perguntas'>>
  ) => {
    if (!session?.user?.id) return false;

    setCarregando(true);
    setErro(null);

    try {
      await atualizarEntrevista(entrevistaId, dados);
      
      // Se estiver atualizando para Em Andamento, registrar início
      if (dados.status === StatusEntrevista.EM_ANDAMENTO) {
        await registrarInicioEntrevista(
          session.user.id, 
          entrevistaId, 
          entrevistaAtual?.titulo || 'Entrevista'
        );
      }
      
      // Se estiver atualizando para Concluída, registrar conclusão
      if (dados.status === StatusEntrevista.CONCLUIDA) {
        await registrarConclusaoEntrevista(
          session.user.id, 
          entrevistaId, 
          entrevistaAtual?.titulo || 'Entrevista',
          dados.pontuacaoGeral
        );
      }
      
      // Recarregar a entrevista para atualizar os dados
      if (entrevistaAtual) {
        await obterEntrevistaDetalhada(entrevistaId);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar entrevista:', error);
      setErro('Não foi possível atualizar a entrevista. Tente novamente mais tarde.');
      return false;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, entrevistaAtual, obterEntrevistaDetalhada]);

  // Excluir uma entrevista
  const excluirEntrevistaAtual = useCallback(async (entrevistaId: string) => {
    if (!session?.user?.id) return false;

    setCarregando(true);
    setErro(null);

    try {
      await excluirEntrevista(entrevistaId);
      await carregarEntrevistas();
      return true;
    } catch (error) {
      console.error('Erro ao excluir entrevista:', error);
      setErro('Não foi possível excluir a entrevista. Tente novamente mais tarde.');
      return false;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, carregarEntrevistas]);

  // Adicionar uma nova pergunta à entrevista
  const adicionarNovaPergunta = useCallback(async (
    entrevistaId: string,
    texto: string,
    tipoPergunta: TipoPergunta
  ) => {
    if (!session?.user?.id) return null;

    setCarregando(true);
    setErro(null);

    try {
      const perguntaId = await adicionarPergunta(entrevistaId, texto, tipoPergunta);
      
      // Recarregar a entrevista para atualizar os dados
      if (entrevistaAtual) {
        await obterEntrevistaDetalhada(entrevistaId);
      }
      
      return perguntaId;
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
      setErro('Não foi possível adicionar a pergunta. Tente novamente mais tarde.');
      return null;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, entrevistaAtual, obterEntrevistaDetalhada]);

  // Salvar resposta para uma pergunta
  const salvarRespostaAtual = useCallback(async (
    entrevistaId: string,
    perguntaId: string,
    resposta: string
  ) => {
    if (!session?.user?.id) return false;

    setCarregando(true);
    setErro(null);

    try {
      await salvarResposta(perguntaId, resposta);
      
      // Recarregar a entrevista para atualizar os dados
      if (entrevistaAtual) {
        await obterEntrevistaDetalhada(entrevistaId);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      setErro('Não foi possível salvar a resposta. Tente novamente mais tarde.');
      return false;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, entrevistaAtual, obterEntrevistaDetalhada]);

  // Gerar feedback usando IA para uma resposta
  const gerarFeedbackAI = useCallback(async (
    entrevistaId: string,
    perguntaId: string
  ) => {
    if (!session?.user?.id) return false;

    setCarregando(true);
    setErro(null);

    try {
      // Encontrar a pergunta no estado atual
      const pergunta = entrevistaAtual?.perguntas?.find(p => p.id === perguntaId);
      
      if (!pergunta || !pergunta.resposta) {
        setErro('É necessário fornecer uma resposta antes de solicitar feedback.');
        return false;
      }
      
      // Aqui seria implementada a chamada para a API de IA para gerar o feedback
      // Por enquanto, vamos simular um feedback genérico
      const feedbackGerado = "Sua resposta está clara e bem estruturada. Você abordou os pontos principais da questão, mas poderia fornecer mais exemplos específicos para ilustrar sua experiência.";
      const pontuacao = Math.floor(Math.random() * 4) + 7; // Pontuação aleatória entre 7 e 10
      
      // Salvar o feedback gerado
      await adicionarFeedback(perguntaId, feedbackGerado, pontuacao);
      
      // Registrar a atividade
      await registrarSolicitacaoFeedback(session.user.id, entrevistaId, perguntaId);
      
      // Recarregar a entrevista para atualizar os dados
      if (entrevistaAtual) {
        await obterEntrevistaDetalhada(entrevistaId);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao gerar feedback:', error);
      setErro('Não foi possível gerar o feedback. Tente novamente mais tarde.');
      return false;
    } finally {
      setCarregando(false);
    }
  }, [session?.user?.id, entrevistaAtual, obterEntrevistaDetalhada]);

  // Carregar entrevistas quando o componente for montado
  useEffect(() => {
    if (session?.user?.id) {
      carregarEntrevistas();
    }
  }, [session?.user?.id, carregarEntrevistas]);

  return {
    entrevistas,
    entrevistaAtual,
    carregando,
    erro,
    carregarEntrevistas,
    obterEntrevista: obterEntrevistaDetalhada,
    novaEntrevista,
    atualizarDadosEntrevista,
    excluirEntrevista: excluirEntrevistaAtual,
    adicionarNovaPergunta,
    salvarResposta: salvarRespostaAtual,
    gerarFeedback: gerarFeedbackAI
  };
}; 