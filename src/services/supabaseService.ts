import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Produto, Lote, Movimentacao, Venda, ItemVenda } from '../types';

export const supabaseService = {
  // 1. PRODUTOS
  async getProdutos(): Promise<Produto[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('produtos').select('*').order('nome');
    if (error) {
      console.warn('Supabase getProdutos:', error.message);
      return null;
    }
    return data.map(p => ({
      id: p.id,
      codigo: p.codigo,
      sku: p.sku,
      nome: p.nome,
      categoria: p.categoria,
      estoque: Number(p.estoque),
      estoqueMinimo: Number(p.estoque_minimo),
      precoCusto: Number(p.preco_custo),
      precoVenda: Number(p.preco_venda),
      unidade: p.unidade,
      status: p.status,
      ativo: Boolean(p.ativo)
    }));
  },

  async insertProduto(p: Produto): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('produtos').insert([{
      id: p.id,
      codigo: p.codigo,
      sku: p.sku,
      nome: p.nome,
      categoria: p.categoria,
      estoque: p.estoque,
      estoque_minimo: p.estoqueMinimo,
      preco_custo: p.precoCusto,
      preco_venda: p.precoVenda,
      unidade: p.unidade,
      status: p.status,
      ativo: p.ativo
    }]);
    if (error) console.error('Erro ao inserir produto no Supabase:', error);
    return !error;
  },

  async updateProduto(id: string, updates: Partial<Produto>): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const payload: Record<string, unknown> = {};
    if (updates.estoque !== undefined) payload.estoque = updates.estoque;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.ativo !== undefined) payload.ativo = updates.ativo;
    if (updates.nome !== undefined) payload.nome = updates.nome;
    if (updates.precoVenda !== undefined) payload.preco_venda = updates.precoVenda;

    const { error } = await supabase.from('produtos').update(payload).eq('id', id);
    if (error) console.error('Erro ao atualizar produto no Supabase:', error);
    return !error;
  },

  // 2. LOTES
  async getLotes(): Promise<Lote[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('lotes').select('*').order('data_validade');
    if (error) {
      console.warn('Supabase getLotes:', error.message);
      return null;
    }
    return data.map(l => ({
      id: l.id,
      produtoId: l.produto_id,
      codigoLote: l.codigo_lote,
      quantidade: Number(l.quantidade),
      quantidadeInicial: Number(l.quantidade_inicial),
      dataEntrada: l.data_entrada,
      dataValidade: l.data_validade,
      status: l.status
    }));
  },

  async insertLote(lote: Lote): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('lotes').insert([{
      id: lote.id,
      produto_id: lote.produtoId,
      codigo_lote: lote.codigoLote,
      quantidade: lote.quantidade,
      quantidade_inicial: lote.quantidadeInicial,
      data_entrada: lote.dataEntrada,
      data_validade: lote.dataValidade,
      status: lote.status
    }]);
    if (error) console.error('Erro ao inserir lote no Supabase:', error);
    return !error;
  },

  // 3. MOVIMENTAÇÕES
  async getMovimentacoes(): Promise<Movimentacao[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase.from('movimentacoes').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getMovimentacoes:', error.message);
      return null;
    }
    return data.map(m => ({
      id: m.id,
      dataHora: m.data_hora,
      produtoId: m.produto_id,
      tipo: m.tipo,
      quantidade: Number(m.quantidade),
      custoUnitario: m.custo_unitario ? Number(m.custo_unitario) : undefined,
      motivo: m.motivo,
      loteId: m.lote_id,
      usuario: m.usuario,
      referencia: m.referencia
    }));
  },

  async insertMovimentacao(m: Movimentacao): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('movimentacoes').insert([{
      id: m.id,
      produto_id: m.produtoId,
      tipo: m.tipo,
      quantidade: m.quantidade,
      custo_unitario: m.custoUnitario,
      motivo: m.motivo,
      lote_id: m.loteId,
      usuario: m.usuario,
      referencia: m.referencia,
      data_hora: m.dataHora
    }]);
    if (error) console.error('Erro ao inserir movimentação no Supabase:', error);
    return !error;
  },

  // 4. VENDAS
  async getVendas(): Promise<Venda[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: vendasData, error: vError } = await supabase
      .from('vendas')
      .select('*, itens_venda(*)')
      .order('created_at', { ascending: false });

    if (vError) {
      console.warn('Supabase getVendas:', vError.message);
      return null;
    }

    return vendasData.map(v => ({
      id: v.id,
      codigo: v.codigo,
      dataHora: v.data_hora,
      valorTotal: Number(v.valor_total),
      formaPagamento: v.forma_pagamento,
      status: v.status,
      itens: (v.itens_venda || []).map((i: Record<string, unknown>) => ({
        produtoId: String(i.produto_id),
        quantidade: Number(i.quantidade),
        precoUnitario: Number(i.preco_unitario),
        subtotal: Number(i.subtotal)
      }))
    }));
  },

  async insertVenda(venda: Venda): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error: vError } = await supabase.from('vendas').insert([{
      id: venda.id,
      codigo: venda.codigo,
      data_hora: venda.dataHora,
      valor_total: venda.valorTotal,
      forma_pagamento: venda.formaPagamento,
      status: venda.status
    }]);

    if (vError) {
      console.error('Erro ao inserir venda no Supabase:', vError);
      return false;
    }

    if (venda.itens.length > 0) {
      const itensPayload = venda.itens.map(item => ({
        venda_id: venda.id,
        produto_id: item.produtoId,
        quantidade: item.quantidade,
        preco_unitario: item.precoUnitario,
        subtotal: item.subtotal
      }));
      const { error: iError } = await supabase.from('itens_venda').insert(itensPayload);
      if (iError) console.error('Erro ao inserir itens da venda no Supabase:', iError);
    }

    return true;
  }
};
