import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Produto, Lote, Movimentacao, Venda, Usuario, EstabelecimentoConfig } from '../types';

const ESTABELECIMENTO_PADRAO_ID = 'a0000000-0000-0000-0000-000000000001';
const STORAGE_SESSION_KEY = 'speedtobox_user_session';
const STORAGE_USERS_KEY = 'speedtobox_users_cache';

interface CachedUserRecord {
  id: string;
  nome: string;
  username: string;
  email: string;
  cargo: string;
  senhaHash: string;
}

async function hashSenha(senha: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(senha);
    const buffer = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return btoa(unescape(encodeURIComponent(senha)));
}

function getCachedUsers(): CachedUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? (JSON.parse(raw) as CachedUserRecord[]) : [];
  } catch {
    return [];
  }
}

function saveCachedUser(record: CachedUserRecord) {
  if (typeof window === 'undefined') return;
  const users = getCachedUsers().filter(
    u => u.username !== record.username && u.email !== record.email
  );
  users.push(record);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function saveActiveSession(usuario: Usuario) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(usuario));
}

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
    if (updates.codigo !== undefined) payload.codigo = updates.codigo;
    if (updates.sku !== undefined) payload.sku = updates.sku;
    if (updates.nome !== undefined) payload.nome = updates.nome;
    if (updates.categoria !== undefined) payload.categoria = updates.categoria;
    if (updates.estoque !== undefined) payload.estoque = updates.estoque;
    if (updates.estoqueMinimo !== undefined) payload.estoque_minimo = updates.estoqueMinimo;
    if (updates.precoCusto !== undefined) payload.preco_custo = updates.precoCusto;
    if (updates.precoVenda !== undefined) payload.preco_venda = updates.precoVenda;
    if (updates.unidade !== undefined) payload.unidade = updates.unidade;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.ativo !== undefined) payload.ativo = updates.ativo;

    if (Object.keys(payload).length === 0) return true;

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

  async updateLote(id: string, updates: Partial<Lote>): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const payload: Record<string, unknown> = {};
    if (updates.quantidade !== undefined) payload.quantidade = updates.quantidade;
    if (updates.status !== undefined) payload.status = updates.status;
    if (Object.keys(payload).length === 0) return true;
    const { error } = await supabase.from('lotes').update(payload).eq('id', id);
    if (error) console.error('Erro ao atualizar lote no Supabase:', error);
    return !error;
  },

  async getEstabelecimento(): Promise<EstabelecimentoConfig | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('estabelecimentos')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error || !data) {
      if (error) console.warn('Supabase getEstabelecimento:', error.message);
      return null;
    }
    return {
      nome: String(data.nome),
      cnpj: String(data.cnpj),
      email: String(data.email),
      cidade: String(data.cidade),
      uf: String(data.uf),
      gestores: String(data.gestores || 'Gestão Integrada'),
      janelaAlertaValidadeDias: Number(data.janela_alerta_validade_dias ?? 15)
    };
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
  },

  // 5. AUTENTICAÇÃO (CADASTRO & LOGIN VIA SUPABASE)
  getUsuarioSessao(): Usuario | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  },

  async cadastrarUsuario(dados: {
    nome: string;
    email: string;
    username: string;
    senha: string;
  }): Promise<{ sucesso: boolean; usuario?: Usuario; erro?: string }> {
    const nome = dados.nome.trim();
    const email = dados.email.trim().toLowerCase();
    const username = dados.username.trim().toLowerCase().replace(/\s+/g, '');
    const senha = dados.senha;

    if (!nome || !email || !username || !senha) {
      return { sucesso: false, erro: 'Preencha todos os campos obrigatórios.' };
    }
    if (senha.length < 6) {
      return { sucesso: false, erro: 'A senha deve ter pelo menos 6 caracteres.' };
    }

    const senhaHash = await hashSenha(senha);
    const localUsers = getCachedUsers();
    if (localUsers.some(u => u.username === username)) {
      return { sucesso: false, erro: 'Este nome de usuário já está em uso.' };
    }
    if (localUsers.some(u => u.email === email)) {
      return { sucesso: false, erro: 'Este e-mail já está cadastrado.' };
    }

    let userId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `usr_${Date.now()}`;

    if (isSupabaseConfigured && supabase) {
      // Verifica duplicidade no Supabase
      const { data: existingByEmail } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingByEmail) {
        return { sucesso: false, erro: 'Este e-mail já está cadastrado no Supabase.' };
      }

      const { data: existingByUser, error: userCheckError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (!userCheckError && existingByUser) {
        return { sucesso: false, erro: 'Este nome de usuário já está em uso.' };
      }

      // 1) Registra no Supabase Auth (auth.users)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome, username }
        }
      });

      if (!authError && authData.user?.id) {
        userId = authData.user.id;
      }

      // 2) Salva perfil na tabela `usuarios` do Supabase
      const { error: insertError } = await supabase.from('usuarios').insert([
        {
          id: userId,
          estabelecimento_id: ESTABELECIMENTO_PADRAO_ID,
          nome,
          username,
          cargo: 'Gestor de Estoque',
          email,
          senha_hash: senhaHash
        }
      ]);

      if (insertError) {
        // Caso as colunas username/senha_hash ainda não tenham sido adicionadas no Supabase remoto
        if (
          insertError.message.includes('username') ||
          insertError.message.includes('senha_hash') ||
          insertError.code === 'PGRST204' ||
          insertError.code === '42703'
        ) {
          const { error: fallbackError } = await supabase.from('usuarios').insert([
            {
              id: userId,
              estabelecimento_id: ESTABELECIMENTO_PADRAO_ID,
              nome,
              cargo: username,
              email
            }
          ]);
          if (fallbackError) {
            console.warn('Supabase usuarios fallback insert:', fallbackError.message);
          }
        } else {
          console.warn('Supabase usuarios insert:', insertError.message);
        }
      }
    }

    const usuario: Usuario = {
      id: userId,
      nome,
      username,
      cargo: 'Gestor de Estoque',
      email
    };

    saveCachedUser({
      id: userId,
      nome,
      username,
      email,
      cargo: 'Gestor de Estoque',
      senhaHash
    });
    saveActiveSession(usuario);

    return { sucesso: true, usuario };
  },

  async loginUsuario(dados: {
    username: string;
    senha: string;
  }): Promise<{ sucesso: boolean; usuario?: Usuario; erro?: string }> {
    const username = dados.username.trim().toLowerCase().replace(/\s+/g, '');
    const senha = dados.senha;

    if (!username || !senha) {
      return { sucesso: false, erro: 'Informe seu nome de usuário e senha.' };
    }

    const senhaHash = await hashSenha(senha);

    if (isSupabaseConfigured && supabase) {
      // Busca usuário pelo username no Supabase
      let dbUser: Record<string, unknown> | null = null;

      const { data: byUsername, error: usernameErr } = await supabase
        .from('usuarios')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (!usernameErr && byUsername) {
        dbUser = byUsername as Record<string, unknown>;
      } else if (usernameErr) {
        // Fallback caso coluna username ainda não exista no banco remoto
        const { data: byCargo } = await supabase
          .from('usuarios')
          .select('*')
          .eq('cargo', username)
          .maybeSingle();
        if (byCargo) {
          dbUser = byCargo as Record<string, unknown>;
        }
      }

      if (dbUser) {
        const email = String(dbUser.email || '');
        const storedHash = dbUser.senha_hash ? String(dbUser.senha_hash) : '';

        let autenticado = false;

        if (email) {
          const { error: authErr } = await supabase.auth.signInWithPassword({
            email,
            password: senha
          });
          if (!authErr) autenticado = true;
        }

        if (!autenticado && storedHash && storedHash === senhaHash) {
          autenticado = true;
        }

        if (!autenticado) {
          const cached = getCachedUsers().find(u => u.username === username);
          if (cached && cached.senhaHash === senhaHash) {
            autenticado = true;
          }
        }

        if (autenticado) {
          const usuario: Usuario = {
            id: String(dbUser.id),
            nome: String(dbUser.nome),
            username: String(dbUser.username || username),
            cargo: String(dbUser.cargo || 'Gestor de Estoque'),
            email
          };
          saveActiveSession(usuario);
          return { sucesso: true, usuario };
        }

        return { sucesso: false, erro: 'Senha incorreta para este usuário.' };
      }
    }

    // Fallback local (caso usuário tenha sido criado antes de migrar colunas ou offline)
    const cachedUser = getCachedUsers().find(u => u.username === username);
    if (cachedUser && cachedUser.senhaHash === senhaHash) {
      const usuario: Usuario = {
        id: cachedUser.id,
        nome: cachedUser.nome,
        username: cachedUser.username,
        cargo: cachedUser.cargo,
        email: cachedUser.email
      };
      saveActiveSession(usuario);
      return { sucesso: true, usuario };
    }

    return { sucesso: false, erro: 'Nome de usuário ou senha inválidos.' };
  },

  async atualizarSenhaUsuario(
    username: string,
    email: string,
    senhaAtual: string,
    novaSenha: string
  ): Promise<{ sucesso: boolean; erro?: string }> {
    if (!senhaAtual || novaSenha.length < 6) {
      return { sucesso: false, erro: 'A nova senha deve possuir no mínimo 6 caracteres.' };
    }

    const senhaAtualHash = await hashSenha(senhaAtual);
    const novaSenhaHash = await hashSenha(novaSenha);

    if (isSupabaseConfigured && supabase) {
      if (email) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password: senhaAtual
        });
        if (!signInErr) {
          const { error: updateErr } = await supabase.auth.updateUser({ password: novaSenha });
          if (updateErr) {
            return { sucesso: false, erro: updateErr.message };
          }
        }
      }

      if (email) {
        await supabase
          .from('usuarios')
          .update({ senha_hash: novaSenhaHash })
          .eq('email', email);
      }
    }

    const cached = getCachedUsers();
    const idx = cached.findIndex(
      u => (username && u.username === username) || (email && u.email === email)
    );
    if (idx >= 0) {
      if (cached[idx].senhaHash !== senhaAtualHash && !(isSupabaseConfigured && supabase)) {
        return { sucesso: false, erro: 'Senha atual incorreta.' };
      }
      cached[idx] = { ...cached[idx], senhaHash: novaSenhaHash };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(cached));
      }
    }

    return { sucesso: true };
  },

  async logoutUsuario(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
  }
};
