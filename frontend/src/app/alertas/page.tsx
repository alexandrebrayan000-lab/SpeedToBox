'use client';

import React, { useState, useMemo } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  CheckCheck,
  ArrowDownLeft,
  Filter,
  Package,
  Calendar,
  AlertOctagon
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';

export function AlertasPage() {
  const { alertas, produtos, lotes, setIsNovaEntradaOpen } = useStore();
  const [todosRevisados, setTodosRevisados] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'estoque' | 'validade'>('todos');

  const alertasEstoque = useMemo(
    () => alertas.filter(a => a.tipo === 'estoque_baixo' || a.tipo === 'estoque_zerado'),
    [alertas]
  );
  const alertasValidade = useMemo(
    () => alertas.filter(a => a.tipo === 'lote_proximo_vencimento' || a.tipo === 'lote_vencido'),
    [alertas]
  );

  const totalCriticos = alertas.filter(a => a.prioridade === 'alta').length;
  const totalAtencao = alertas.filter(a => a.prioridade === 'media').length;

  const handleMarcarTodosRevisados = () => {
    setTodosRevisados(true);
    setTimeout(() => setTodosRevisados(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Central de Alertas &amp; Prevenção de Perdas
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Notificações prioritárias para reposição de estoque e gestão de validades críticas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarcarTodosRevisados}
            className={`btn-neon-secondary text-xs py-2 px-3.5 transition-all ${
              todosRevisados ? 'border-emerald-400 text-emerald-300' : ''
            }`}
          >
            <CheckCheck className={`w-3.5 h-3.5 ${todosRevisados ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{todosRevisados ? 'Alertas Revisados!' : 'Marcar como Revisados'}</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Gravidade Operacional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alertas Totais</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">{alertas.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Ocorrências ativas</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prioridade Alta</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-400 font-mono">{totalCriticos}</span>
          <p className="text-[11px] text-slate-400 mt-1">Esgotados ou vencidos</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Atenção Preventiva</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-300 font-mono">{totalAtencao}</span>
          <p className="text-[11px] text-slate-400 mt-1">Estoque baixo / Vencendo</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Controle Sanitário</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-cyan-300 font-mono">FIFO ATIVO</span>
          <p className="text-[11px] text-slate-400 mt-1">Validação de lotes</p>
        </div>
      </div>

      {/* Seletor de Tipo */}
      <div className="glass-panel p-3 flex items-center gap-2">
        <Filter className="w-4 h-4 text-cyan-400 ml-1" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">Filtrar:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroTipo === 'todos'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.2)]'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos os Alertas ({alertas.length})
          </button>
          <button
            onClick={() => setFiltroTipo('estoque')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroTipo === 'estoque'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(255,191,63,0.2)]'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Estoque Mínimo ({alertasEstoque.length})
          </button>
          <button
            onClick={() => setFiltroTipo('validade')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroTipo === 'validade'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_8px_rgba(255,56,100,0.2)]'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Validades FIFO ({alertasValidade.length})
          </button>
        </div>
      </div>

      {/* Grid de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna 1: Estoque Baixo & Esgotado */}
        {(filtroTipo === 'todos' || filtroTipo === 'estoque') && (
          <div className="glass-panel p-5 accent-line">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Alertas de Estoque Mínimo</h2>
              </div>
              <Link href="/produtos" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
                Catálogo <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {alertasEstoque.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Nenhum produto abaixo do mínimo no momento.</p>
              ) : (
                alertasEstoque.map(a => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-[#080d20] border border-amber-500/20 text-xs space-y-2 hover:border-amber-400/40 transition-all">
                    <div className="flex items-center justify-between font-bold text-amber-400">
                      <span>{a.titulo}</span>
                      <span className="badge-pill badge-pill-amber">REPOSIÇÃO</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{a.mensagem}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <span className="text-[11px] text-slate-500 font-mono">{a.dataGeracao}</span>
                      <button
                        onClick={() => setIsNovaEntradaOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ArrowDownLeft className="w-3 h-3" />
                        <span>Registrar Entrada ➔</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Coluna 2: Validade & Lotes (FIFO) */}
        {(filtroTipo === 'todos' || filtroTipo === 'validade') && (
          <div className="glass-panel p-5 accent-line">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Alertas de Validade (FIFO)</h2>
              </div>
              <Link href="/lotes" className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold">
                Painel de Lotes <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {alertasValidade.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Todos os lotes cadastrados estão dentro do prazo.</p>
              ) : (
                alertasValidade.map(a => {
                  const isVencido = a.tipo === 'lote_vencido';

                  return (
                    <div key={a.id} className="p-3.5 rounded-xl bg-[#080d20] border border-rose-500/20 text-xs space-y-2 hover:border-rose-400/40 transition-all">
                      <div className="flex items-center justify-between font-bold text-rose-400">
                        <span>{a.titulo}</span>
                        <span className={`badge-pill ${isVencido ? 'badge-pill-red' : 'badge-pill-amber'}`}>
                          {isVencido ? 'VENCIDO' : 'PRÓXIMO'}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{a.mensagem}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-[11px] text-slate-500 font-mono">{a.dataGeracao}</span>
                        {isVencido ? (
                          <Link
                            href="/movimentacoes"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            Registrar Descarte / Perda ➔
                          </Link>
                        ) : (
                          <Link
                            href="/vendas"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Priorizar no PDV (FIFO) ➔
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertasPage;
