'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Produto,
  Lote,
  Movimentacao,
  Venda,
  Alerta,
  ChatMessage,
  EstabelecimentoConfig,
  DashboardMetrics,
  TipoMovimentacao,
  FormaPagamento
} from '../types';

interface StoreContextType {
  produtos: Produto[];
  lotes: Lote[];
  movimentacoes: Movimentacao[];
  vendas: Venda[];
  alertas: Alerta[];
  chatMessages: ChatMessage[];
  config: EstabelecimentoConfig;
  metrics: DashboardMetrics;

  // Modais globais
  isNovaVendaOpen: boolean;
  setIsNovaVendaOpen: (open: boolean) => void;
  isNovaEntradaOpen: boolean;
  setIsNovaEntradaOpen: (open: boolean) => void;
  isNovoProdutoOpen: boolean;
  setIsNovoProdutoOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;

  // Ações de negócio
  adicionarProduto: (produto: Omit<Produto, 'id' | 'status'>) => void;
  editarProduto: (id: string, dados: Partial<Produto>) => void;
  desativarProduto: (id: string) => void;
  registrarMovimentacao: (
    produtoId: string,
    tipo: TipoMovimentacao,
    quantidade: number,
    motivo: string,
    custoUnitario?: number,
    loteId?: string | null
  ) => void;
  registrarVenda: (
    itens: { produtoId: string; quantidade: number; precoUnitario: number }[],
    formaPagamento: FormaPagamento
  ) => { sucesso: boolean; mensagem: string };
  enviarMensagemChat: (texto: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Dados Iniciais Fidedignos ao Briefing do Projeto Integrador II
const PRODUTOS_INICIAIS: Produto[] = [
  { id: 'p1', codigo: '001', sku: 'ALM-ARR-001', nome: 'Arroz Nobre Tipo 1 5kg', categoria: 'Alimentos', estoque: 145, estoqueMinimo: 30, precoCusto: 22.50, precoVenda: 32.90, unidade: 'UN', status: 'normal', ativo: true },
  { id: 'p2', codigo: '002', sku: 'ALM-FEJ-002', nome: 'Feijão Carioca Especial 1kg', categoria: 'Alimentos', estoque: 18, estoqueMinimo: 25, precoCusto: 6.20, precoVenda: 9.80, unidade: 'UN', status: 'baixo', ativo: true },
  { id: 'p3', codigo: '003', sku: 'ALM-OLE-003', nome: 'Óleo de Soja Refinado 900ml', categoria: 'Alimentos', estoque: 64, estoqueMinimo: 20, precoCusto: 5.10, precoVenda: 7.90, unidade: 'UN', status: 'normal', ativo: true },
  { id: 'p4', codigo: '004', sku: 'LMP-DET-004', nome: 'Detergente Líquido Neutro 500ml', categoria: 'Limpeza', estoque: 12, estoqueMinimo: 30, precoCusto: 1.80, precoVenda: 2.99, unidade: 'UN', status: 'baixo', ativo: true },
  { id: 'p5', codigo: '005', sku: 'HIG-SAB-005', nome: 'Sabonete Antibacteriano 90g', categoria: 'Higiene', estoque: 180, estoqueMinimo: 40, precoCusto: 2.10, precoVenda: 3.85, unidade: 'UN', status: 'normal', ativo: true },
  { id: 'p6', codigo: '006', sku: 'BEB-REF-006', nome: 'Refrigerante Cola Pet 2L', categoria: 'Bebidas', estoque: 48, estoqueMinimo: 15, precoCusto: 6.50, precoVenda: 9.99, unidade: 'UN', status: 'normal', ativo: true },
  { id: 'p7', codigo: '007', sku: 'ALM-CAF-007', nome: 'Café Torrado e Moído 500g', categoria: 'Alimentos', estoque: 8, estoqueMinimo: 20, precoCusto: 14.20, precoVenda: 21.50, unidade: 'UN', status: 'baixo', ativo: true },
  { id: 'p8', codigo: '008', sku: 'BEB-LEI-008', nome: 'Leite Integral Longa Vida 1L', categoria: 'Bebidas', estoque: 110, estoqueMinimo: 30, precoCusto: 4.10, precoVenda: 5.89, unidade: 'UN', status: 'normal', ativo: true },
  { id: 'p9', codigo: '009', sku: 'ALM-IOG-009', nome: 'Iogurte Morango Garrafa 850g', categoria: 'Alimentos', estoque: 22, estoqueMinimo: 15, precoCusto: 4.80, precoVenda: 7.50, unidade: 'UN', status: 'normal', ativo: true },
  { id: 'p10', codigo: '010', sku: 'PAD-PAO-010', nome: 'Pão de Forma Tradicional 500g', categoria: 'Padaria', estoque: 35, estoqueMinimo: 15, precoCusto: 5.50, precoVenda: 8.90, unidade: 'UN', status: 'normal', ativo: true },
  { id: 'p11', codigo: '011', sku: 'BEB-SUC-011', nome: 'Suco de Laranja Integral 1L', categoria: 'Bebidas', estoque: 28, estoqueMinimo: 10, precoCusto: 7.90, precoVenda: 12.90, unidade: 'UN', status: 'normal', ativo: true },
  { id: 'p12', codigo: '012', sku: 'LMP-DES-012', nome: 'Desinfetante Lavanda 1L', categoria: 'Limpeza', estoque: 5, estoqueMinimo: 20, precoCusto: 4.30, precoVenda: 6.99, unidade: 'UN', status: 'baixo', ativo: true }
];

const LOTES_INICIAIS: Lote[] = [
  { id: 'l1', produtoId: 'p8', codigoLote: 'LOT-2026-08', quantidade: 35, quantidadeInicial: 40, dataEntrada: '2026-09-10', dataValidade: '2026-10-31', status: 'proximo_vencimento' },
  { id: 'l2', produtoId: 'p9', codigoLote: 'LOT-2026-09', quantidade: 5, quantidadeInicial: 20, dataEntrada: '2026-08-25', dataValidade: '2026-10-20', status: 'vencido' },
  { id: 'l3', produtoId: 'p10', codigoLote: 'LOT-2026-10', quantidade: 35, quantidadeInicial: 50, dataEntrada: '2026-10-02', dataValidade: '2026-11-15', status: 'normal' },
  { id: 'l4', produtoId: 'p11', codigoLote: 'LOT-2026-11', quantidade: 28, quantidadeInicial: 30, dataEntrada: '2026-10-01', dataValidade: '2026-12-10', status: 'normal' },
  { id: 'l5', produtoId: 'p7', codigoLote: 'LOT-2026-07', quantidade: 8, quantidadeInicial: 25, dataEntrada: '2026-08-15', dataValidade: '2026-11-05', status: 'proximo_vencimento' },
  { id: 'l6', produtoId: 'p1', codigoLote: 'LOT-2026-01', quantidade: 145, quantidadeInicial: 150, dataEntrada: '2026-09-28', dataValidade: '2027-04-30', status: 'normal' },
  { id: 'l7', produtoId: 'p2', codigoLote: 'LOT-2026-02', quantidade: 18, quantidadeInicial: 50, dataEntrada: '2026-09-20', dataValidade: '2027-02-15', status: 'normal' },
  { id: 'l8', produtoId: 'p4', codigoLote: 'LOT-2026-04', quantidade: 12, quantidadeInicial: 40, dataEntrada: '2026-09-15', dataValidade: '2027-09-15', status: 'normal' }
];

const MOVIMENTACOES_INICIAIS: Movimentacao[] = [
  { id: 'm1', dataHora: '2026-10-15 14:32', produtoId: 'p1', tipo: 'entrada', quantidade: 50, custoUnitario: 22.50, motivo: 'Compra de Reposição', loteId: 'l6', usuario: 'Brayan Garrido', referencia: 'NF-e 84920' },
  { id: 'm2', dataHora: '2026-10-15 11:15', produtoId: 'p7', tipo: 'saida', quantidade: 5, motivo: 'Venda Balcão', loteId: 'l5', usuario: 'Mylenna Paula', referencia: 'Venda #1092' },
  { id: 'm3', dataHora: '2026-10-14 16:47', produtoId: 'p8', tipo: 'entrada', quantidade: 40, custoUnitario: 4.10, motivo: 'Compra de Reposição', loteId: 'l1', usuario: 'Brayan Garrido', referencia: 'NF-e 84890' },
  { id: 'm4', dataHora: '2026-10-14 10:20', produtoId: 'p4', tipo: 'saida', quantidade: 8, motivo: 'Venda Balcão', loteId: 'l8', usuario: 'Mylenna Paula', referencia: 'Venda #1085' },
  { id: 'm5', dataHora: '2026-10-13 17:05', produtoId: 'p9', tipo: 'perda', quantidade: 5, motivo: 'Vencimento no Estoque', loteId: 'l2', usuario: 'Brayan Garrido', referencia: 'Descarte Sanitário' },
  { id: 'm6', dataHora: '2026-10-13 15:30', produtoId: 'p6', tipo: 'saida', quantidade: 12, motivo: 'Venda Balcão', loteId: null, usuario: 'Mylenna Paula', referencia: 'Venda #1078' },
  { id: 'm7', dataHora: '2026-10-12 14:10', produtoId: 'p3', tipo: 'avaria', quantidade: 2, motivo: 'Embalagem Rompida no Transporte', loteId: null, usuario: 'Brayan Garrido', referencia: 'Laudo Avaria #02' },
  { id: 'm8', dataHora: '2026-10-11 09:40', produtoId: 'p5', tipo: 'saida', quantidade: 20, motivo: 'Venda Balcão', loteId: null, usuario: 'Mylenna Paula', referencia: 'Venda #1064' }
];

const VENDAS_INICIAIS: Venda[] = [
  { id: 'v1', codigo: 'VND-1092', dataHora: '2026-10-15 11:15', itens: [{ produtoId: 'p7', quantidade: 5, precoUnitario: 21.50, subtotal: 107.50 }], valorTotal: 107.50, formaPagamento: 'PIX', status: 'concluida' },
  { id: 'v2', codigo: 'VND-1085', dataHora: '2026-10-14 10:20', itens: [{ produtoId: 'p4', quantidade: 8, precoUnitario: 2.99, subtotal: 23.92 }, { produtoId: 'p5', quantidade: 4, precoUnitario: 3.85, subtotal: 15.40 }], valorTotal: 39.32, formaPagamento: 'Cartão de Crédito', status: 'concluida' },
  { id: 'v3', codigo: 'VND-1078', dataHora: '2026-10-13 15:30', itens: [{ produtoId: 'p6', quantidade: 12, precoUnitario: 9.99, subtotal: 119.88 }, { produtoId: 'p1', quantidade: 4, precoUnitario: 32.90, subtotal: 131.60 }], valorTotal: 251.48, formaPagamento: 'Cartão de Débito', status: 'concluida' },
  { id: 'v4', codigo: 'VND-1064', dataHora: '2026-10-11 09:40', itens: [{ produtoId: 'p5', quantidade: 20, precoUnitario: 3.85, subtotal: 77.00 }, { produtoId: 'p8', quantidade: 15, precoUnitario: 5.89, subtotal: 88.35 }], valorTotal: 165.35, formaPagamento: 'PIX', status: 'concluida' },
  { id: 'v5', codigo: 'VND-1050', dataHora: '2026-10-10 16:10', itens: [{ produtoId: 'p1', quantidade: 10, precoUnitario: 32.90, subtotal: 329.00 }], valorTotal: 329.00, formaPagamento: 'Dinheiro', status: 'concluida' }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);
  const [lotes, setLotes] = useState<Lote[]>(LOTES_INICIAIS);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(MOVIMENTACOES_INICIAIS);
  const [vendas, setVendas] = useState<Venda[]>(VENDAS_INICIAIS);

  // Modais de Controle
  const [isNovaVendaOpen, setIsNovaVendaOpen] = useState(false);
  const [isNovaEntradaOpen, setIsNovaEntradaOpen] = useState(false);
  const [isNovoProdutoOpen, setIsNovoProdutoOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Configuração
  const [config] = useState<EstabelecimentoConfig>({
    nome: 'SpeedToBox — Minimercado & Conveniência',
    cnpj: '45.892.103/0001-92',
    email: 'contato@speedtobox.com.br',
    cidade: 'São Paulo',
    uf: 'SP',
    gestores: 'Brayan Alexandre & Mylenna Paula',
    janelaAlertaValidadeDias: 15
  });

  // Mensagens do Chatbot IA SpeedToBox
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'bot',
      texto: 'Olá! Sou o assistente inteligente do SpeedToBox. Como posso ajudar com seu estoque, validades ou vendas hoje?',
      dataHora: '10:00',
      sugestoes: [
        'Quais produtos estão acabando?',
        'O que está perto de vencer?',
        'Qual o faturamento registrado?'
      ]
    }
  ]);

  // Alertas calculados dinamicamente
  const alertas: Alerta[] = [];

  // Alertas de estoque baixo
  produtos.forEach(p => {
    if (p.estoque <= 0) {
      alertas.push({
        id: `alt-zero-${p.id}`,
        tipo: 'estoque_zerado',
        prioridade: 'alta',
        titulo: `Estoque Esgotado: ${p.nome}`,
        mensagem: `O produto atingiu 0 ${p.unidade}. Vendas bloqueadas até reposição.`,
        produtoId: p.id,
        dataGeracao: 'Hoje'
      });
    } else if (p.estoque <= p.estoqueMinimo) {
      alertas.push({
        id: `alt-baixo-${p.id}`,
        tipo: 'estoque_baixo',
        prioridade: 'media',
        titulo: `Estoque Baixo: ${p.nome}`,
        mensagem: `Saldo atual de ${p.estoque} ${p.unidade} está abaixo do mínimo configurado (${p.estoqueMinimo} ${p.unidade}).`,
        produtoId: p.id,
        dataGeracao: 'Hoje'
      });
    }
  });

  // Alertas de validade
  lotes.forEach(l => {
    const prod = produtos.find(p => p.id === l.produtoId);
    const nomeProd = prod ? prod.nome : l.codigoLote;
    if (l.status === 'vencido') {
      alertas.push({
        id: `alt-venc-${l.id}`,
        tipo: 'lote_vencido',
        prioridade: 'alta',
        titulo: `Lote Vencido: ${l.codigoLote}`,
        mensagem: `${nomeProd} venceu em ${l.dataValidade}. Deve ser recolhido imediatamente.`,
        produtoId: l.produtoId,
        loteId: l.id,
        dataGeracao: 'Recente'
      });
    } else if (l.status === 'proximo_vencimento') {
      alertas.push({
        id: `alt-prox-${l.id}`,
        tipo: 'lote_proximo_vencimento',
        prioridade: 'media',
        titulo: `Vencimento Próximo: ${l.codigoLote}`,
        mensagem: `${nomeProd} (${l.quantidade} un) vence em ${l.dataValidade}. Priorizar saída (FIFO).`,
        produtoId: l.produtoId,
        loteId: l.id,
        dataGeracao: 'Hoje'
      });
    }
  });

  // Métricas do Dashboard
  const totalProdutos = produtos.length;
  const totalEmEstoque = produtos.reduce((acc, p) => acc + p.estoque, 0);
  const totalEstoqueBaixo = produtos.filter(p => p.estoque <= p.estoqueMinimo).length;
  const totalLotesProximosVencimento = lotes.filter(l => l.status === 'proximo_vencimento' || l.status === 'vencido').length;
  const vendasPeriodoValor = vendas.reduce((acc, v) => acc + v.valorTotal, 0);
  const vendasPeriodoQtd = vendas.reduce((acc, v) => acc + v.itens.reduce((iAcc, item) => iAcc + item.quantidade, 0), 0);
  const ticketMedio = vendas.length > 0 ? vendasPeriodoValor / vendas.length : 0;

  const metrics: DashboardMetrics = {
    totalProdutos,
    totalEmEstoque,
    totalEstoqueBaixo,
    totalLotesProximosVencimento,
    vendasPeriodoValor,
    vendasPeriodoQtd,
    ticketMedio,
    variacaoProdutos: '+12% no catálogo',
    variacaoEstoque: '+4.2% esta semana',
    variacaoVendas: '+18.4% vs anterior'
  };

  // Funções de Negócio
  const adicionarProduto = (novo: Omit<Produto, 'id' | 'status'>) => {
    const id = `p_${Date.now()}`;
    const status: 'normal' | 'baixo' | 'esgotado' =
      novo.estoque <= 0 ? 'esgotado' : novo.estoque <= novo.estoqueMinimo ? 'baixo' : 'normal';
    setProdutos(prev => [...prev, { ...novo, id, status }]);
  };

  const editarProduto = (id: string, dados: Partial<Produto>) => {
    setProdutos(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const atualizado = { ...p, ...dados };
        atualizado.status =
          atualizado.estoque <= 0 ? 'esgotado' : atualizado.estoque <= atualizado.estoqueMinimo ? 'baixo' : 'normal';
        return atualizado;
      })
    );
  };

  const desativarProduto = (id: string) => {
    editarProduto(id, { ativo: false });
  };

  const registrarMovimentacao = (
    produtoId: string,
    tipo: TipoMovimentacao,
    quantidade: number,
    motivo: string,
    custoUnitario?: number,
    loteId?: string | null
  ) => {
    const novaMov: Movimentacao = {
      id: `mov_${Date.now()}`,
      dataHora: new Date().toISOString().replace('T', ' ').slice(0, 16),
      produtoId,
      tipo,
      quantidade,
      custoUnitario,
      motivo,
      loteId,
      usuario: 'Brayan Garrido',
      referencia: `Reg #${Math.floor(1000 + Math.random() * 9000)}`
    };

    setMovimentacoes(prev => [novaMov, ...prev]);

    // Atualiza saldo do produto
    setProdutos(prev =>
      prev.map(p => {
        if (p.id !== produtoId) return p;
        const delta = tipo === 'entrada' ? quantidade : -quantidade;
        const novoEstoque = Math.max(0, p.estoque + delta);
        const novoStatus = novoEstoque <= 0 ? 'esgotado' : novoEstoque <= p.estoqueMinimo ? 'baixo' : 'normal';
        return { ...p, estoque: novoEstoque, status: novoStatus };
      })
    );

    // Atualiza lote se fornecido
    if (loteId) {
      setLotes(prev =>
        prev.map(l => {
          if (l.id !== loteId) return l;
          const delta = tipo === 'entrada' ? quantidade : -quantidade;
          return { ...l, quantidade: Math.max(0, l.quantidade + delta) };
        })
      );
    }
  };

  // Conforme RN-02 e RN-03 do Docs.md: Venda atômica com verificação e baixa
  const registrarVenda = (
    itens: { produtoId: string; quantidade: number; precoUnitario: number }[],
    formaPagamento: FormaPagamento
  ): { sucesso: boolean; mensagem: string } => {
    // 1. Verifica saldo disponível para todos os itens
    for (const item of itens) {
      const prod = produtos.find(p => p.id === item.produtoId);
      if (!prod) return { sucesso: false, mensagem: `Produto não localizado.` };
      if (prod.estoque < item.quantidade) {
        return {
          sucesso: false,
          mensagem: `Saldo insuficiente para "${prod.nome}". Disponível: ${prod.estoque} ${prod.unidade}.`
        };
      }
    }

    // 2. Calcula total
    const itensCompletos = itens.map(i => ({
      produtoId: i.produtoId,
      quantidade: i.quantidade,
      precoUnitario: i.precoUnitario,
      subtotal: i.quantidade * i.precoUnitario
    }));
    const valorTotal = itensCompletos.reduce((acc, i) => acc + i.subtotal, 0);

    const novaVenda: Venda = {
      id: `v_${Date.now()}`,
      codigo: `VND-${Math.floor(1000 + Math.random() * 9000)}`,
      dataHora: new Date().toISOString().replace('T', ' ').slice(0, 16),
      itens: itensCompletos,
      valorTotal,
      formaPagamento,
      status: 'concluida'
    };

    setVendas(prev => [novaVenda, ...prev]);

    // 3. Aplica baixa de estoque e registra movimentações de saída
    itens.forEach(item => {
      registrarMovimentacao(
        item.produtoId,
        'saida',
        item.quantidade,
        `Venda PDV ${novaVenda.codigo}`
      );
    });

    return { sucesso: true, mensagem: `Venda ${novaVenda.codigo} registrada com sucesso!` };
  };

  // Chatbot IA SpeedToBox (Atende aos Requisitos RF-17 e RNF-12)
  const enviarMensagemChat = (texto: string) => {
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      texto,
      dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Lógica inteligente de resposta baseada nas regras de negócio do Docs.md
    setTimeout(() => {
      let resposta = '';
      const t = texto.toLowerCase();

      if (t.includes('estoque baixo') || t.includes('acabando') || t.includes('repor')) {
        const baixos = produtos.filter(p => p.estoque <= p.estoqueMinimo);
        if (baixos.length === 0) {
          resposta = 'Nenhum produto está abaixo do estoque mínimo no momento. O catálogo está devidamente abastecido!';
        } else {
          resposta = `Identifiquei ${baixos.length} produto(s) abaixo do estoque mínimo:\n` +
            baixos.map(p => `• ${p.nome}: ${p.estoque} ${p.unidade} (Mínimo: ${p.estoqueMinimo})`).join('\n') +
            '\nRecomendo registrar uma ordem de reposição/entrada.';
        }
      } else if (t.includes('venc') || t.includes('validade') || t.includes('perto de vencer')) {
        const prox = lotes.filter(l => l.status === 'proximo_vencimento' || l.status === 'vencido');
        if (prox.length === 0) {
          resposta = 'Todos os lotes registrados estão dentro do prazo de validade seguro.';
        } else {
          resposta = `Atenção: existem ${prox.length} lote(s) que exigem cuidado:\n` +
            prox.map(l => {
              const p = produtos.find(pr => pr.id === l.produtoId);
              return `• ${l.codigoLote} (${p ? p.nome : 'Item'}): ${l.quantidade} un — Vence em ${l.dataValidade} [${l.status === 'vencido' ? 'VENCIDO' : 'PRÓXIMO'}]`;
            }).join('\n') +
            '\nConforme regra FIFO, priorize a saída desses lotes nas próximas vendas.';
        }
      } else if (t.includes('faturamento') || t.includes('venda') || t.includes('vendeu')) {
        resposta = `O faturamento total acumulado em vendas registradas é de R$ ${vendasPeriodoValor.toFixed(2)} em ${vendas.length} transações no PDV. Ticket médio: R$ ${ticketMedio.toFixed(2)}.`;
      } else if (t.includes('como') && (t.includes('entrada') || t.includes('compra'))) {
        resposta = 'Para registrar uma entrada, clique no botão "+ Entrada" no topo da tela ou vá na aba "Movimentações". Informe o produto, quantidade, lote e o custo unitário da aquisição.';
      } else {
        resposta = `Entendi sua dúvida sobre "${texto}". Atualmente posso consultar saldos de estoque, lotes próximos do vencimento, resumo de faturamento comercial e orientações operacionais. Como prefere continuar?`;
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        texto: resposta,
        dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        sugestoes: [
          'Ver produtos em estoque baixo',
          'Conferir lotes a vencer',
          'Histórico de vendas'
        ]
      };

      setChatMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  return (
    <StoreContext.Provider
      value={{
        produtos,
        lotes,
        movimentacoes,
        vendas,
        alertas,
        chatMessages,
        config,
        metrics,
        isNovaVendaOpen,
        setIsNovaVendaOpen,
        isNovaEntradaOpen,
        setIsNovaEntradaOpen,
        isNovoProdutoOpen,
        setIsNovoProdutoOpen,
        isChatOpen,
        setIsChatOpen,
        adicionarProduto,
        editarProduto,
        desativarProduto,
        registrarMovimentacao,
        registrarVenda,
        enviarMensagemChat
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser utilizado dentro de um StoreProvider');
  }
  return context;
}
