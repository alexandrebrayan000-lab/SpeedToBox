'use client';

import React, { useState, useMemo } from 'react';
import { Package, Plus, Search, Filter, Download, Boxes, AlertTriangle, DollarSign, ArrowDownLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ProdutosPage() {
  const { produtos, setIsNovoProdutoOpen, setIsNovaEntradaOpen } = useStore();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // Categorias únicas
  const categorias = useMemo(() => {
    return Array.from(new Set(produtos.map(p => p.categoria)));
  }, [produtos]);

  // Métricas Consolidadas
  const totalProdutos = produtos.length;
  const saldoFisicoTotal = useMemo(() => produtos.reduce((acc, p) => acc + p.estoque, 0), [produtos]);
  const totalCriticos = useMemo(() => produtos.filter(p => p.estoque <= p.estoqueMinimo).length, [produtos]);
  const valorPatrimonialTotal = useMemo(() => produtos.reduce((acc, p) => acc + (p.estoque * p.precoCusto), 0), [produtos]);

  // Filtragem combinada
  const filtrados = useMemo(() => {
    return produtos.filter(p => {
      const matchBusca =
        !busca.trim() ||
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.sku.toLowerCase().includes(busca.toLowerCase()) ||
        p.codigo.includes(busca);

      const matchCat = categoria === 'todas' || p.categoria === categoria;

      let matchStatus = true;
      if (filtroStatus === 'regular') matchStatus = p.estoque > p.estoqueMinimo;
      else if (filtroStatus === 'baixo') matchStatus = p.estoque > 0 && p.estoque <= p.estoqueMinimo;
      else if (filtroStatus === 'esgotado') matchStatus = p.estoque <= 0;

      return matchBusca && matchCat && matchStatus;
    });
  }, [produtos, busca, categoria, filtroStatus]);

  // Exportar Catálogo em CSV
  const exportarCatalogoCSV = () => {
    let csv = 'CODIGO,SKU,NOME,CATEGORIA,ESTOQUE,ESTOQUE_MINIMO,PRECO_CUSTO,PRECO_VENDA,MARGEM_LUCRO_PCT,VALOR_TOTAL_ESTOQUE,STATUS\n';
    produtos.forEach(p => {
      const margem = p.precoCusto > 0 ? (((p.precoVenda - p.precoCusto) / p.precoCusto) * 100).toFixed(1) : '0.0';
      const valorTotal = (p.estoque * p.precoCusto).toFixed(2);
      csv += `"${p.codigo}","${p.sku}","${p.nome.replace(/"/g, '""')}","${p.categoria}",${p.estoque},${p.estoqueMinimo},${p.precoCusto.toFixed(2)},${p.precoVenda.toFixed(2)},"${margem}%",${valorTotal},"${p.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speedtobox-catalogo-produtos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Catálogo de Produtos
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento de itens cadastrados, preços de custo/venda e níveis de estoque mínimo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportarCatalogoCSV}
            className="btn-neon-secondary text-xs py-2 px-3.5"
            title="Baixar planilha de produtos"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar Catálogo (CSV)</span>
          </button>

          <button
            onClick={() => setIsNovoProdutoOpen(true)}
            className="btn-neon-primary text-xs py-2 px-4 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Produto</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Itens Cadastrados</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">{totalProdutos}</span>
          <p className="text-[11px] text-slate-400 mt-1">Variedades no catálogo</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saldo Físico Total</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">{saldoFisicoTotal} un</span>
          <p className="text-[11px] text-slate-400 mt-1">Unidades em prateleira</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estoque Crítico</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-400 font-mono">{totalCriticos}</span>
          <p className="text-[11px] text-slate-400 mt-1">Abaixo do estoque mínimo</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valor do Estoque</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">
            R$ {valorPatrimonialTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Patrimônio a preço de custo</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Busca */}
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2 bg-[#080d20] border border-cyan-500/20 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Buscar por nome, código ou SKU..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-white placeholder:text-slate-500 text-xs"
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="bg-[#080d20] border border-cyan-500/20 text-white text-xs rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="todas">Todas as Categorias</option>
            {categorias.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Filtros Rápidos de Status */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroStatus === 'todos'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.2)]'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({totalProdutos})
          </button>
          <button
            onClick={() => setFiltroStatus('regular')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroStatus === 'regular'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Regulares
          </button>
          <button
            onClick={() => setFiltroStatus('baixo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroStatus === 'baixo'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(255,191,63,0.2)]'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Baixos ({totalCriticos})
          </button>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="glass-panel overflow-hidden accent-line">
        <div className="overflow-x-auto">
          <table className="custom-table text-xs">
            <thead>
              <tr>
                <th>Código / SKU</th>
                <th>Nome do Produto</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Estoque Mínimo</th>
                <th>Preço Custo</th>
                <th>Preço Venda</th>
                <th>Margem</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400">
                    Nenhum produto encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filtrados.map(p => {
                  const isBaixo = p.estoque <= p.estoqueMinimo;
                  const isZerado = p.estoque <= 0;
                  const margem = p.precoCusto > 0
                    ? Math.round(((p.precoVenda - p.precoCusto) / p.precoCusto) * 100)
                    : 0;

                  return (
                    <tr key={p.id}>
                      <td className="font-mono text-cyan-300 font-bold whitespace-nowrap">
                        {p.codigo} <span className="text-slate-500 text-[10px]">({p.sku})</span>
                      </td>
                      <td className="font-semibold text-white">{p.nome}</td>
                      <td>
                        <span className="badge-pill badge-pill-cyan">{p.categoria}</span>
                      </td>
                      <td className="font-mono font-bold text-white">
                        {p.estoque} {p.unidade}
                      </td>
                      <td className="font-mono text-slate-400">
                        {p.estoqueMinimo} {p.unidade}
                      </td>
                      <td className="font-mono text-slate-300">
                        R$ {p.precoCusto.toFixed(2)}
                      </td>
                      <td className="font-mono font-bold text-emerald-400">
                        R$ {p.precoVenda.toFixed(2)}
                      </td>
                      <td className="font-mono text-[11px] text-cyan-300">
                        +{margem}%
                      </td>
                      <td>
                        <span
                          className={`badge-pill ${
                            isZerado
                              ? 'badge-pill-red'
                              : isBaixo
                              ? 'badge-pill-amber'
                              : 'badge-pill-green'
                          }`}
                        >
                          {isZerado ? 'ESGOTADO' : isBaixo ? 'ESTOQUE BAIXO' : 'REGULAR'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setIsNovaEntradaOpen(true)}
                          className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all text-[11px] inline-flex items-center gap-1 font-semibold"
                          title={`Registrar entrada para ${p.nome}`}
                        >
                          <ArrowDownLeft className="w-3 h-3" />
                          <span>Repor</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProdutosPage;
