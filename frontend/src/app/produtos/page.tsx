'use client';

import React, { useState } from 'react';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ProdutosPage() {
  const { produtos, setIsNovoProdutoOpen } = useStore();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');

  const filtrados = produtos.filter(p => {
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.sku.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.includes(busca);
    const matchCat = categoria === 'todas' || p.categoria === categoria;
    return matchBusca && matchCat;
  });

  const categorias = Array.from(new Set(produtos.map(p => p.categoria)));

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

        <button
          onClick={() => setIsNovoProdutoOpen(true)}
          className="btn-neon-primary text-xs py-2 px-4 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Produto</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-4">
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
            className="bg-[#080d20] border border-cyan-500/20 text-white text-xs rounded-xl px-3 py-2 outline-none"
          >
            <option value="todas">Todas as Categorias</option>
            {categorias.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => {
                const isBaixo = p.estoque <= p.estoqueMinimo;
                const isZerado = p.estoque <= 0;

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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProdutosPage;
