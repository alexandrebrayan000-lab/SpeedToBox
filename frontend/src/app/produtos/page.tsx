'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const CATEGORIES = ['todas', 'Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Padaria'];

export default function ProductsPage() {
  const { products, setIsNewProductOpen, setMovementModal, deleteProduct } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = products.filter(p => {
    const matchSearch =
      !searchQuery ||
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.codigo.includes(searchQuery);

    const matchCat = categoriaFiltro === 'todas' || p.categoria === categoriaFiltro;
    const matchStatus = statusFiltro === 'todos' || p.status === statusFiltro;

    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
            <h1
              className="text-2xl font-black text-white tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Produtos
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Gerencie seu catálogo físico e acompanhe a disponibilidade de itens em tempo real.
          </p>
        </div>

        <button
          onClick={() => setIsNewProductOpen(true)}
          className="btn-cyber-primary text-xs py-2 px-4"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Produto</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="cyber-card p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, código ou SKU..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="cyber-input pl-9 text-xs"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Categoria:</label>
          <select
            value={categoriaFiltro}
            onChange={e => {
              setCategoriaFiltro(e.target.value);
              setCurrentPage(1);
            }}
            className="cyber-select text-xs min-w-[160px]"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c === 'todas' ? 'Todas as Categorias' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Status:</label>
          <select
            value={statusFiltro}
            onChange={e => {
              setStatusFiltro(e.target.value);
              setCurrentPage(1);
            }}
            className="cyber-select text-xs min-w-[160px]"
          >
            <option value="todos">Todos os status</option>
            <option value="normal">Normal</option>
            <option value="baixo">Estoque Baixo</option>
            <option value="esgotado">Esgotado</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="cyber-card p-5">
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Código / SKU</th>
                <th>Nome do Produto</th>
                <th>Categoria</th>
                <th>Saldo Atual</th>
                <th>Estoque Mínimo</th>
                <th>Preço Custo</th>
                <th>Preço Venda</th>
                <th>Status</th>
                <th className="text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    Nenhum produto encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                pageItems.map(p => {
                  const margem =
                    p.precoVenda > 0
                      ? (((p.precoVenda - p.precoCusto) / p.precoVenda) * 100).toFixed(0)
                      : '0';

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono text-cyan-400 font-bold">{p.codigo}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{p.sku}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-white block">{p.nome}</span>
                        <span className="text-[10px] text-slate-400">Margem est.: {margem}%</span>
                      </td>
                      <td>
                        <span className="text-xs text-slate-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {p.categoria}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`font-mono font-bold text-sm ${
                            p.estoque === 0
                              ? 'text-rose-400'
                              : p.estoque <= p.estoqueMinimo
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {p.estoque} {p.unidade}
                        </span>
                      </td>
                      <td className="font-mono text-xs text-slate-400">
                        {p.estoqueMinimo} {p.unidade}
                      </td>
                      <td className="font-mono text-xs text-slate-300">
                        R$ {p.precoCusto.toFixed(2)}
                      </td>
                      <td className="font-mono text-xs font-bold text-cyan-300">
                        R$ {p.precoVenda.toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`badge-neon ${
                            p.status === 'esgotado'
                              ? 'badge-danger pulse-red'
                              : p.status === 'baixo'
                              ? 'badge-warning'
                              : 'badge-success'
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setMovementModal({ isOpen: true, tipo: 'entrada', productId: p.id })
                            }
                            className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                            title="Entrada rápida (+)"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setMovementModal({ isOpen: true, tipo: 'saida', productId: p.id })
                            }
                            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                            title="Saída / Baixa (-)"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja remover "${p.nome}" do catálogo?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 text-xs text-slate-400">
            <span>
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filtered.length)} de{' '}
              {filtered.length} produtos
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-cyan-400 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
