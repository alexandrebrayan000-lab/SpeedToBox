'use client';

import React from 'react';
import { Bell, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';

export function AlertasPage() {
  const { alertas, produtos, lotes } = useStore();

  const alertasEstoque = alertas.filter(a => a.tipo === 'estoque_baixo' || a.tipo === 'estoque_zerado');
  const alertasValidade = alertas.filter(a => a.tipo === 'lote_proximo_vencimento' || a.tipo === 'lote_vencido');

  return (
    <div className="space-y-6">
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

        <span className="badge-pill badge-pill-red text-xs py-1.5 px-3">
          {alertas.length} alertas ativos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna 1: Estoque Baixo & Esgotado */}
        <div className="glass-panel p-5 accent-line">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">Alertas de Estoque Mínimo</h2>
            </div>
            <Link href="/produtos" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              Catálogo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {alertasEstoque.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Nenhum produto abaixo do mínimo.</p>
            ) : (
              alertasEstoque.map(a => (
                <div key={a.id} className="p-3.5 rounded-xl bg-[#080d20] border border-amber-500/20 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-400 mb-1">
                    <span>{a.titulo}</span>
                    <span className="badge-pill badge-pill-amber">REPOSIÇÃO</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-2">{a.mensagem}</p>
                  <Link
                    href="/movimentacoes"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:underline"
                  >
                    Registrar entrada de compra ➔
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna 2: Validade & Lotes */}
        <div className="glass-panel p-5 accent-line">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">Alertas de Validade (FIFO)</h2>
            </div>
            <Link href="/lotes" className="text-xs text-rose-400 hover:underline flex items-center gap-1">
              Painel de Lotes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {alertasValidade.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Todos os lotes estão em dia.</p>
            ) : (
              alertasValidade.map(a => (
                <div key={a.id} className="p-3.5 rounded-xl bg-[#080d20] border border-rose-500/20 text-xs">
                  <div className="flex items-center justify-between font-bold text-rose-400 mb-1">
                    <span>{a.titulo}</span>
                    <span className="badge-pill badge-pill-red">FIFO</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-2">{a.mensagem}</p>
                  <Link
                    href="/vendas"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:underline"
                  >
                    Priorizar venda deste lote ➔
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertasPage;
