'use client';

import React from 'react';
import { TrendingUp, Plus, DollarSign, Receipt, CreditCard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function VendasPage() {
  const { vendas, produtos, metrics, setIsNovaVendaOpen } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Vendas &amp; Gestão Financeira Comercial
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro de pedidos no PDV, receitas comerciais e controle de formas de pagamento.
          </p>
        </div>

        <button
          onClick={() => setIsNovaVendaOpen(true)}
          className="btn-neon-primary text-xs py-2 px-4 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Venda (PDV)</span>
        </button>
      </div>

      {/* Cards de Métricas Comerciais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento Total</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-white">
            R$ {metrics.vendasPeriodoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-emerald-400 block mt-1 font-mono">Receita bruta de vendas</span>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pedidos Realizados</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-white">
            {vendas.length} transações
          </span>
          <span className="text-[11px] text-cyan-400 block mt-1 font-mono">{metrics.vendasPeriodoQtd} itens comercializados</span>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket Médio</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-white">
            R$ {metrics.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-purple-400 block mt-1 font-mono">Média por pedido</span>
        </div>
      </div>

      {/* Histórico de Vendas */}
      <div className="glass-panel overflow-hidden accent-line">
        <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-wide">Histórico de Vendas Registradas</h2>
          <span className="badge-pill badge-pill-cyan">{vendas.length} transações concluídas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table text-xs">
            <thead>
              <tr>
                <th>Código</th>
                <th>Data/Hora</th>
                <th>Itens do Pedido</th>
                <th>Forma de Pagamento</th>
                <th>Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map(v => (
                <tr key={v.id}>
                  <td className="font-mono text-cyan-300 font-bold">{v.codigo}</td>
                  <td className="font-mono text-slate-400 whitespace-nowrap">{v.dataHora}</td>
                  <td className="text-white">
                    {v.itens.map((it, idx) => {
                      const prod = produtos.find(p => p.id === it.produtoId);
                      return (
                        <span key={idx} className="block text-slate-300">
                          {it.quantidade}x {prod ? prod.nome : 'Item'} (R$ {it.precoUnitario.toFixed(2)})
                        </span>
                      );
                    })}
                  </td>
                  <td>
                    <span className="badge-pill badge-pill-purple">{v.formaPagamento}</span>
                  </td>
                  <td className="font-mono font-bold text-white text-sm">
                    R$ {v.valorTotal.toFixed(2)}
                  </td>
                  <td>
                    <span className="badge-pill badge-pill-green">CONCLUÍDA</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VendasPage;
