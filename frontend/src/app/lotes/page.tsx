'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Clock,
  AlertOctagon,
  Download,
  Plus,
  Search,
  Zap,
  Trash2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function LotsPage() {
  const { lots, products, exportToCSV, setMovementModal, addMovement, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');

  const lotesAtivos = lots.filter(l => l.status === 'normal').length;
  const lotesProximos = lots.filter(l => l.status === 'proximo_vencimento').length;
  const lotesVencidos = lots.filter(l => l.status === 'vencido').length;
  const lotesEsgotados = lots.filter(l => l.status === 'esgotado' || l.quantidade === 0).length;

  const filtered = lots.filter(l => {
    const prod = products.find(p => p.id === l.produtoId);
    const matchSearch =
      !searchQuery ||
      l.codigoLote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod && prod.nome.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFiltro === 'todos' || l.status === statusFiltro;
    return matchSearch && matchStatus;
  });

  const getDaysRemaining = (validadeStr: string) => {
    const today = new Date('2026-10-16');
    const val = new Date(validadeStr);
    return Math.ceil((val.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleDiscardExpired = (loteId: string, prodId: string, qty: number, loteCode: string) => {
    if (confirm(`Confirmar descarte fiscal por vencimento do ${loteCode} (${qty} un)?`)) {
      addMovement({
        produtoId: prodId,
        tipo: 'perda',
        quantidade: qty,
        motivo: `Descarte de Vencimento - ${loteCode}`,
        loteId,
        usuario: 'Operador FIFO',
        referencia: 'Ajuste Vencimento'
      });
      showToast(`Lote ${loteCode} baixado como perda por vencimento.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#8B35FF]"></span>
            <h1
              className="text-2xl font-black text-white tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Lotes e Validades
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Acompanhe os lotes e datas de validade dos seus produtos com controle FIFO rigoroso.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV('lotes')}
            className="btn-cyber-secondary text-xs py-2 px-3.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Lotes</span>
          </button>
          <button
            onClick={() => setMovementModal({ isOpen: true, tipo: 'entrada' })}
            className="btn-cyber-primary text-xs py-2 px-3.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Entrada com Lote</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Lotes Ativos
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{lotesAtivos}</div>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Dentro do prazo regular</span>
        </div>

        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Próximos do Vencimento
            </span>
            <div
              className={`w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 ${
                lotesProximos > 0 ? 'pulse-yellow' : ''
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight">{lotesProximos}</div>
          <span className="text-[10px] text-amber-300 font-mono mt-1 block">Vencem em até 30 dias</span>
        </div>

        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Lotes Vencidos
            </span>
            <div
              className={`w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 ${
                lotesVencidos > 0 ? 'pulse-red' : ''
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 tracking-tight">{lotesVencidos}</div>
          <span className="text-[10px] text-rose-400 font-mono mt-1 block">Ação imediata necessária</span>
        </div>

        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Sem Saldo / Esgotados
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-400 tracking-tight">{lotesEsgotados}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Histórico de partidas zeradas</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="cyber-card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por código de lote ou nome do produto..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="cyber-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-slate-400">Status do Lote:</label>
          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value)}
            className="cyber-select text-xs py-1.5"
          >
            <option value="todos">Todos os lotes</option>
            <option value="normal">Normal / No Prazo</option>
            <option value="proximo_vencimento">Próximo do Vencimento (&lt; 30d)</option>
            <option value="vencido">Vencidos (Crítico)</option>
          </select>
        </div>
      </div>

      {/* Lots Table */}
      <div className="cyber-card p-5">
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Código Lote</th>
                <th>Produto Vinculado</th>
                <th>Saldo Disponível</th>
                <th>Data Entrada</th>
                <th>Data Validade</th>
                <th>Prazo Restante</th>
                <th>Status</th>
                <th className="text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    Nenhum lote corresponde aos filtros informados.
                  </td>
                </tr>
              ) : (
                filtered.map(l => {
                  const prod = products.find(p => p.id === l.produtoId);
                  const days = getDaysRemaining(l.dataValidade);

                  return (
                    <tr key={l.id}>
                      <td className="font-mono font-bold text-white text-xs">{l.codigoLote}</td>
                      <td>
                        <span className="font-bold text-white block">{prod ? prod.nome : '—'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {prod ? prod.sku : ''}
                        </span>
                      </td>
                      <td className="font-mono font-bold text-cyan-300">{l.quantidade} un</td>
                      <td className="font-mono text-xs text-slate-400">{l.dataEntrada}</td>
                      <td className="font-mono text-xs font-semibold text-white">{l.dataValidade}</td>
                      <td>
                        <div className="flex flex-col gap-1 w-32">
                          <span
                            className={`text-xs font-mono font-bold ${
                              days < 0
                                ? 'text-rose-400'
                                : days <= 15
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {days < 0 ? `Vencido há ${Math.abs(days)}d` : `${days} dias restantes`}
                          </span>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                days < 0
                                  ? 'bg-rose-500 w-full'
                                  : days <= 30
                                  ? 'bg-amber-400 w-2/3'
                                  : 'bg-emerald-400 w-full'
                              }`}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge-neon ${
                            l.status === 'vencido'
                              ? 'badge-danger pulse-red'
                              : l.status === 'proximo_vencimento'
                              ? 'badge-warning pulse-yellow'
                              : 'badge-success'
                          }`}
                        >
                          {l.status === 'proximo_vencimento' ? 'ATENÇÃO' : l.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {l.status === 'vencido' ? (
                            <button
                              onClick={() =>
                                handleDiscardExpired(l.id, l.produtoId, l.quantidade, l.codigoLote)
                              }
                              className="btn-cyber-danger text-[11px] py-1 px-2.5"
                              title="Descartar produto vencido"
                            >
                              <Trash2 className="w-3 h-3" /> Descarte
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                showToast(
                                  `Lote ${l.codigoLote} marcado para ação comercial no PDV.`,
                                  'info'
                                )
                              }
                              className="btn-cyber-secondary text-[11px] py-1 px-2.5"
                              title="Destacar no PDV"
                            >
                              <Zap className="w-3 h-3 text-amber-400" /> Promover
                            </button>
                          )}
                        </div>
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
