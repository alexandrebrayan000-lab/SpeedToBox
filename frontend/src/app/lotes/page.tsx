'use client';

import React, { useState } from 'react';
import { Boxes, Calendar, AlertTriangle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function LotesPage() {
  const { lotes, produtos } = useStore();
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const hoje = new Date('2026-10-27');

  const lotesComCalculos = lotes.map(l => {
    const dataVal = new Date(l.dataValidade);
    const diffTime = dataVal.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { ...l, diasRestantes: diffDays };
  });

  const filtrados = lotesComCalculos.filter(l => {
    if (filtroStatus === 'todos') return true;
    return l.status === filtroStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Controle de Lotes &amp; Validades (FIFO)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rastreamento de partidas, datas de validade e priorização de saída (First In, First Out).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              filtroStatus === 'todos'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-[#080d20] border-slate-800 text-slate-400'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroStatus('proximo_vencimento')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              filtroStatus === 'proximo_vencimento'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-[#080d20] border-slate-800 text-slate-400'
            }`}
          >
            A Vencer
          </button>
          <button
            onClick={() => setFiltroStatus('vencido')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              filtroStatus === 'vencido'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                : 'bg-[#080d20] border-slate-800 text-slate-400'
            }`}
          >
            Vencidos
          </button>
        </div>
      </div>

      {/* Grid de Lotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map(l => {
          const prod = produtos.find(p => p.id === l.produtoId);
          const isVencido = l.status === 'vencido' || l.diasRestantes < 0;
          const isProx = l.status === 'proximo_vencimento';

          return (
            <div key={l.id} className="glass-panel p-4 accent-line">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {l.codigoLote}
                </span>
                <span
                  className={`badge-pill ${
                    isVencido
                      ? 'badge-pill-red'
                      : isProx
                      ? 'badge-pill-amber'
                      : 'badge-pill-green'
                  }`}
                >
                  {isVencido ? 'VENCIDO' : isProx ? 'VENCIMENTO PRÓXIMO' : 'REGULAR'}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm truncate mb-3">
                {prod ? prod.nome : 'Produto'}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-cyan-500/10">
                <div className="flex justify-between">
                  <span className="text-slate-400">Saldo no Lote:</span>
                  <span className="font-mono font-bold text-white">{l.quantidade} un</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data de Entrada:</span>
                  <span className="font-mono text-slate-300">{l.dataEntrada}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Data de Validade:</span>
                  <span className={`font-mono font-bold ${isVencido ? 'text-rose-400' : isProx ? 'text-amber-300' : 'text-emerald-400'}`}>
                    {l.dataValidade}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Contagem FIFO:</span>
                  <span className="font-mono text-[11px] font-bold text-cyan-300">
                    {l.diasRestantes < 0 ? `Venceu há ${Math.abs(l.diasRestantes)} dias` : `${l.diasRestantes} dias restantes`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LotesPage;
