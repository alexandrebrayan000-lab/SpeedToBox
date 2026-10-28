'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, Plus, Filter } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { TipoMovimentacao } from '../../types';

export function MovimentacoesPage() {
  const { movimentacoes, produtos, setIsNovaEntradaOpen } = useStore();
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

  const filtradas = movimentacoes.filter(m => {
    if (tipoFiltro === 'todos') return true;
    return m.tipo === tipoFiltro;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Movimentações de Estoque
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro rastreável de todas as compras, vendas, perdas e ajustes físicos de mercadorias.
          </p>
        </div>

        <button
          onClick={() => setIsNovaEntradaOpen(true)}
          className="btn-neon-primary text-xs py-2 px-4 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Movimentação</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="glass-panel p-3.5 flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-300 uppercase">Filtrar por:</span>
        <div className="flex flex-wrap gap-2">
          {['todos', 'entrada', 'saida', 'perda', 'avaria'].map(t => (
            <button
              key={t}
              onClick={() => setTipoFiltro(t)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize border ${
                tipoFiltro === t
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="glass-panel overflow-hidden accent-line">
        <div className="overflow-x-auto">
          <table className="custom-table text-xs">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Custo Un.</th>
                <th>Motivo / Justificativa</th>
                <th>Referência</th>
                <th>Operador</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map(m => {
                const prod = produtos.find(p => p.id === m.produtoId);
                const isEntrada = m.tipo === 'entrada';
                const isSaida = m.tipo === 'saida';
                const isPerda = m.tipo === 'perda';

                return (
                  <tr key={m.id}>
                    <td className="font-mono text-slate-400 whitespace-nowrap">{m.dataHora}</td>
                    <td className="font-semibold text-white">{prod ? prod.nome : 'Produto'}</td>
                    <td>
                      <span
                        className={`badge-pill ${
                          isEntrada
                            ? 'badge-pill-green'
                            : isSaida
                            ? 'badge-pill-cyan'
                            : isPerda
                            ? 'badge-pill-red'
                            : 'badge-pill-amber'
                        }`}
                      >
                        {m.tipo.toUpperCase()}
                      </span>
                    </td>
                    <td className={`font-mono font-bold ${isEntrada ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isEntrada ? '+' : '-'}{m.quantidade}
                    </td>
                    <td className="font-mono text-slate-400">
                      {m.custoUnitario ? `R$ ${m.custoUnitario.toFixed(2)}` : '—'}
                    </td>
                    <td className="text-slate-300">{m.motivo}</td>
                    <td className="font-mono text-[11px] text-cyan-400">{m.referencia}</td>
                    <td className="text-slate-400">{m.usuario}</td>
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

export default MovimentacoesPage;
