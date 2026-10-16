'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCheck,
  ArrowRight,
  Boxes,
  Plus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function AlertsPage() {
  const { alerts, setMovementModal, showToast } = useStore();

  const [prioridadeFiltro, setPrioridadeFiltro] = useState('todas');
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  const criticos = alerts.filter(a => a.prioridade === 'alta').length;
  const atencao = alerts.filter(a => a.prioridade === 'media').length;
  const informativos = alerts.filter(a => a.prioridade === 'baixa').length;

  const filtered = alerts.filter(a => {
    const matchPrio = prioridadeFiltro === 'todas' || a.prioridade === prioridadeFiltro;
    const matchTipo = tipoFiltro === 'todos' || a.tipo === tipoFiltro;
    return matchPrio && matchTipo;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#FF3864]"></span>
            <h1
              className="text-2xl font-black text-white tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Central de Alertas
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Monitore riscos operacionais, estoques críticos e lotes vencidos para tomada rápida de decisão.
          </p>
        </div>

        <button
          onClick={() => showToast('Todos os alertas marcados como revisados.', 'success')}
          className="btn-cyber-secondary text-xs py-2 px-3.5"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Marcar Todos como Lidos</span>
        </button>
      </div>

      {/* 3 Severity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="cyber-card p-4 border-rose-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              Críticos (Ação Imediata)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center pulse-red">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400">{criticos}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Produtos vencidos ou estoque zerado
          </span>
        </div>

        <div className="cyber-card p-4 border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Atenção Necessária
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center pulse-yellow">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400">{atencao}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Vencimentos nos próximos 30 dias
          </span>
        </div>

        <div className="cyber-card p-4 border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Operacionais & Info
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-400">{informativos}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Avisos e sugestões de abastecimento
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="cyber-card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Prioridade:</label>
          <select
            value={prioridadeFiltro}
            onChange={e => setPrioridadeFiltro(e.target.value)}
            className="cyber-select text-xs min-w-[190px]"
          >
            <option value="todas">Todas as prioridades</option>
            <option value="alta">Alta (Crítico)</option>
            <option value="media">Média (Atenção)</option>
            <option value="baixa">Baixa (Informativo)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Tipo de Risco:</label>
          <select
            value={tipoFiltro}
            onChange={e => setTipoFiltro(e.target.value)}
            className="cyber-select text-xs min-w-[210px]"
          >
            <option value="todos">Todos os tipos</option>
            <option value="lote_vencido">Lotes Vencidos</option>
            <option value="lote_proximo_vencimento">Validade Próxima (&lt; 30d)</option>
            <option value="estoque_zerado">Estoque Zerado</option>
            <option value="estoque_baixo">Estoque Baixo</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="cyber-card p-8 text-center text-slate-400">
            Nenhum alerta ativo encontrado com os filtros selecionados.
          </div>
        ) : (
          filtered.map(a => {
            const isHigh = a.prioridade === 'alta';
            const isWarning = a.prioridade === 'media';

            return (
              <div
                key={a.id}
                className={`cyber-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isHigh
                    ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 to-transparent'
                    : isWarning
                    ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 to-transparent'
                    : 'border-cyan-500/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 pulse-red'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 pulse-yellow'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    {isHigh ? (
                      <AlertOctagon className="w-5 h-5" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{a.titulo}</span>
                      <span
                        className={`badge-neon text-[10px] ${
                          isHigh ? 'badge-danger' : isWarning ? 'badge-warning' : 'badge-info'
                        }`}
                      >
                        {a.prioridade.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {a.dataGeracao}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{a.mensagem}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() =>
                      setMovementModal({
                        isOpen: true,
                        tipo: a.tipo === 'lote_vencido' ? 'perda' : 'entrada',
                        productId: a.produtoId
                      })
                    }
                    className={`text-xs py-1.5 px-3.5 ${
                      a.tipo === 'lote_vencido' ? 'btn-cyber-danger' : 'btn-cyber-primary'
                    }`}
                  >
                    <span>{a.tipo === 'lote_vencido' ? 'Baixar Descarte' : 'Repor Estoque'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
