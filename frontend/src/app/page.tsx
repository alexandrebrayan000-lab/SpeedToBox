'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  Boxes,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ArrowLeftRight,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';

export default function HomePage() {
  const { produtos, movimentacoes, alertas, metrics, setIsNovaVendaOpen } = useStore();
  const ultimasMovimentacoes = movimentacoes.slice(0, 5);
  const alertasCriticos = alertas.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d9ff]"></span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Visão Geral do Estabelecimento
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoramento em tempo real do estoque físico, validades (FIFO) e movimentações comerciais.
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

      {/* 4 Cards de Indicadores (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total de Produtos */}
        <Link href="/produtos" className="glass-panel p-4 group accent-line block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total de Produtos
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono tracking-tight">
              {metrics.totalProdutos}
            </span>
            <span className="badge-pill badge-pill-cyan">
              {metrics.variacaoProdutos}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Catálogo ativo</span>
            <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-semibold">
              Gerenciar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* KPI 2: Itens em Estoque */}
        <Link href="/produtos" className="glass-panel p-4 group accent-line block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Itens em Estoque
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono tracking-tight">
              {metrics.totalEmEstoque}
            </span>
            <span className="badge-pill badge-pill-green">
              {metrics.variacaoEstoque}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Saldo físico total</span>
            <span className="text-emerald-400 group-hover:underline flex items-center gap-1 font-semibold">
              Conferir <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* KPI 3: Estoque Crítico */}
        <Link href="/alertas" className="glass-panel p-4 group accent-line block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Estoque Crítico
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-400 font-mono tracking-tight">
              {metrics.totalEstoqueBaixo}
            </span>
            <span className="badge-pill badge-pill-red">
              {metrics.totalEstoqueBaixo > 0 ? 'ATENÇÃO' : 'NORMAL'}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Abaixo do mínimo</span>
            <span className="text-rose-400 group-hover:underline flex items-center gap-1 font-semibold">
              Repor <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* KPI 4: Vendas Registradas */}
        <Link href="/vendas" className="glass-panel p-4 group accent-line block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Vendas Registradas
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono tracking-tight">
              R$ {metrics.vendasPeriodoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="badge-pill badge-pill-purple">
              {metrics.vendasPeriodoQtd} UN
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Receita comercial</span>
            <span className="text-purple-400 group-hover:underline flex items-center gap-1 font-semibold">
              Ver Vendas <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>

      {/* Gráficos Reativos */}
      <DashboardCharts />

      {/* Linha Inferior: Tabela de Movimentações Recentes & Alertas Prioritários */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movimentações Recentes (2 colunas) */}
        <div className="glass-panel p-5 lg:col-span-2 accent-line">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Movimentações Recentes de Estoque
              </h3>
            </div>
            <Link href="/movimentacoes" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
              Ver histórico completo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="custom-table text-xs">
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th>Qtd</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {ultimasMovimentacoes.map(m => {
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
                      <td className="text-slate-400">{m.motivo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alertas Operacionais (1 coluna) */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">Alertas Prioritários</h3>
              </div>
              <Link href="/alertas" className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold">
                Ver todos ({alertas.length}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {alertasCriticos.map(a => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-[#080d20] border border-rose-500/20 text-xs"
                >
                  <span className="font-bold text-rose-400 block mb-0.5">{a.titulo}</span>
                  <span className="text-slate-300 leading-relaxed block">{a.mensagem}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Controle FIFO ativo</span>
            <span className="text-cyan-400 font-mono">Regras Docs.md</span>
          </div>
        </div>
      </div>
    </div>
  );
}
