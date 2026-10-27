'use client';

import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function MovementsPage() {
  const { movements, products, exportToCSV, setMovementModal } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = movements.filter(m => {
    const prod = products.find(p => p.id === m.produtoId);
    const matchSearch =
      !searchQuery ||
      m.motivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.referencia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod && prod.nome.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchTipo = tipoFiltro === 'todos' || m.tipo === tipoFiltro;
    return matchSearch && matchTipo;
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
              Movimentações
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Acompanhe o histórico completo e auditável de entradas, saídas, perdas e transferências.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportToCSV('movimentacoes')}
            className="btn-cyber-secondary text-xs py-2 px-3.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
          <button
            onClick={() => setMovementModal({ isOpen: true, tipo: 'entrada' })}
            className="btn-cyber-success text-xs py-2 px-3.5"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Registrar Entrada (+)</span>
          </button>
          <button
            onClick={() => setMovementModal({ isOpen: true, tipo: 'saida' })}
            className="btn-cyber-danger text-xs py-2 px-3.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Registrar Saída (-)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="cyber-card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por produto, motivo, referência..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="cyber-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Tipo de Movimentação:</label>
          <select
            value={tipoFiltro}
            onChange={e => {
              setTipoFiltro(e.target.value);
              setCurrentPage(1);
            }}
            className="cyber-select text-xs min-w-[240px]"
          >
            <option value="todos">Todos os tipos</option>
            <option value="entrada">Entrada (+) [Abastecimento]</option>
            <option value="saida">Saída (-) [Venda Comercial]</option>
            <option value="perda">Perda (-) [Vencimento / Descarte]</option>
            <option value="avaria">Avaria (-) [Danificado]</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="cyber-card p-5">
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Motivo / Descrição</th>
                <th>Documento / Referência</th>
                <th>Operador</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Nenhuma movimentação registrada encontrada.
                  </td>
                </tr>
              ) : (
                pageItems.map(m => {
                  const prod = products.find(p => p.id === m.produtoId);

                  return (
                    <tr key={m.id}>
                      <td className="font-mono text-xs text-slate-400">{m.dataHora}</td>
                      <td>
                        <span className="font-bold text-white block">{prod ? prod.nome : '—'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {prod ? prod.sku : ''}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge-neon ${
                            m.tipo === 'entrada'
                              ? 'badge-success'
                              : m.tipo === 'saida'
                              ? 'badge-info'
                              : 'badge-danger'
                          }`}
                        >
                          {m.tipo.toUpperCase()}
                        </span>
                      </td>
                      <td className="font-mono font-bold text-sm">
                        <span
                          className={
                            m.tipo === 'entrada'
                              ? 'text-emerald-400'
                              : m.tipo === 'saida'
                              ? 'text-cyan-300'
                              : 'text-rose-400'
                          }
                        >
                          {m.tipo === 'entrada' ? `+${m.quantidade}` : `-${m.quantidade}`}
                        </span>
                      </td>
                      <td className="text-xs text-slate-200">{m.motivo}</td>
                      <td className="font-mono text-xs text-cyan-400">{m.referencia}</td>
                      <td className="text-xs text-slate-400">{m.usuario}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 text-xs text-slate-400">
            <span>
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filtered.length)} de{' '}
              {filtered.length} movimentações
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
