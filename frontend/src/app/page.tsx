'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Boxes,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
  ArrowLeftRight,
  ShieldAlert
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CyberBarChart, CyberDoughnutChart } from '../components/Charts';

export default function DashboardPage() {
  const { products, movements, alerts, getDashboardMetrics, setIsNewSaleOpen } = useStore();
  const [periodo, setPeriodo] = useState<'hoje' | '7d' | '30d'>('30d');

  const metrics = getDashboardMetrics(periodo);
  const recentMovements = movements.slice(0, 5);
  const recentAlerts = alerts.slice(0, 3);

  // Group categories for doughnut chart
  const categoryCounts: Record<string, number> = {};
  products.forEach(p => {
    categoryCounts[p.categoria] = (categoryCounts[p.categoria] || 0) + 1;
  });

  const doughnutData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          'rgba(0, 217, 255, 0.8)',
          'rgba(139, 53, 255, 0.8)',
          'rgba(0, 230, 160, 0.8)',
          'rgba(243, 43, 255, 0.8)',
          'rgba(255, 191, 63, 0.8)',
          'rgba(22, 139, 255, 0.8)'
        ],
        borderColor: '#0B1228',
        borderWidth: 2
      }
    ]
  };

  // 7-day movement comparison chart data
  const movementChartData = {
    labels: ['10/10', '11/10', '12/10', '13/10', '14/10', '15/10', '16/10'],
    datasets: [
      {
        label: 'Entradas (+)',
        data: [15, 30, 10, 45, 40, 50, 20],
        backgroundColor: 'rgba(0, 230, 160, 0.75)',
        borderRadius: 6
      },
      {
        label: 'Saídas (-)',
        data: [12, 20, 18, 17, 24, 25, 14],
        backgroundColor: 'rgba(255, 56, 100, 0.75)',
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Compact Header (NO BANNER) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
            <h1
              className="text-2xl font-black text-white tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Visão geral
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Acompanhe o desempenho do seu estoque e indicadores em tempo real.
          </p>
        </div>

        {/* Period Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#0B1228] p-1 rounded-xl border border-[#168BFF]/25 flex items-center gap-1 text-xs">
            {(['hoje', '7d', '30d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  periodo === p
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'hoje' ? 'Hoje' : p === '7d' ? '7 dias' : '30 dias'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="btn-cyber-primary text-xs py-2 px-3.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Venda</span>
          </button>
        </div>
      </div>

      {/* 4 Animated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total de Produtos */}
        <Link
          href="/produtos"
          className="cyber-card p-5 cursor-pointer group hover:border-cyan-400/50 block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Total de Produtos
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.totalProdutos}
            </div>
            <span className="badge-neon badge-success text-[11px]">
              <TrendingUp className="w-3 h-3" /> {metrics.variacaoProdutos}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#A3B2D1]/70 border-t border-slate-800/80 pt-2">
            <span>Catálogo cadastrado</span>
            <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
              Gerenciar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Card 2: Em Estoque */}
        <Link
          href="/produtos"
          className="cyber-card p-5 cursor-pointer group hover:border-emerald-400/50 block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Em Estoque
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.totalEmEstoque}
            </div>
            <span className="badge-neon badge-success text-[11px]">
              <TrendingUp className="w-3 h-3" /> {metrics.variacaoEstoque}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#A3B2D1]/70 border-t border-slate-800/80 pt-2">
            <span>Unidades físicas totais</span>
            <span className="text-emerald-400 group-hover:underline flex items-center gap-1">
              Conferir <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Card 3: Estoque Baixo */}
        <Link
          href="/alertas"
          className="cyber-card p-5 cursor-pointer group hover:border-rose-400/50 block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Estoque Baixo
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-rose-400 tracking-tight">
              {metrics.totalEstoqueBaixo}
            </div>
            <span className="badge-neon badge-danger text-[11px]">
              {metrics.variacaoBaixo}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#A3B2D1]/70 border-t border-slate-800/80 pt-2">
            <span>Abaixo do nível mínimo</span>
            <span className="text-rose-400 group-hover:underline flex items-center gap-1">
              Repor <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Card 4: Vendas no Período */}
        <Link
          href="/vendas"
          className="cyber-card p-5 cursor-pointer group hover:border-purple-400/50 block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Vendas no Período
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-cyan-300 tracking-tight font-mono">
              R$ {metrics.vendasPeriodoValor.toFixed(2)}
            </div>
            <span className="badge-neon badge-info text-[11px]">
              {metrics.vendasPeriodoQtd} un
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#A3B2D1]/70 border-t border-slate-800/80 pt-2">
            <span>Faturamento registrado</span>
            <span className="text-purple-400 group-hover:underline flex items-center gap-1">
              Ver Analítica <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movements 7d Bar Chart */}
        <div className="cyber-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Fluxo de Movimentações (Últimos 7 dias)
              </h3>
              <p className="text-xs text-slate-400">Entradas vs Saídas de mercadorias no estoque físico</p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/30">
              FIFO Operacional
            </span>
          </div>
          <div className="h-64">
            <CyberBarChart data={movementChartData} />
          </div>
        </div>

        {/* Category Doughnut Chart */}
        <div className="cyber-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mix por Categorias
            </h3>
            <p className="text-xs text-slate-400">Proporção de produtos catalogados</p>
          </div>
          <div className="h-64">
            <CyberDoughnutChart data={doughnutData} />
          </div>
        </div>
      </div>

      {/* Recent Activity & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Movements Table */}
        <div className="cyber-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Movimentações Recentes
              </h3>
            </div>
            <Link href="/movimentacoes" className="text-xs text-cyan-400 hover:underline">
              Ver extrato completo ➔
            </Link>
          </div>

          <div className="cyber-table-container">
            <table className="cyber-table">
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
                {recentMovements.map(m => {
                  const prod = products.find(p => p.id === m.produtoId);
                  return (
                    <tr key={m.id}>
                      <td className="font-mono text-xs text-slate-400">{m.dataHora}</td>
                      <td className="font-semibold text-white">{prod ? prod.nome : '—'}</td>
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
                      <td className="font-mono font-bold text-white">
                        {m.tipo === 'entrada' ? `+${m.quantidade}` : `-${m.quantidade}`}
                      </td>
                      <td className="text-xs text-slate-300">{m.motivo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Alerts Center */}
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Alertas Críticos
              </h3>
            </div>
            <Link href="/alertas" className="text-xs text-rose-400 hover:underline">
              Ver todos ({alerts.length})
            </Link>
          </div>

          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Nenhum alerta crítico ativo no momento.
              </p>
            ) : (
              recentAlerts.map(a => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/30 transition text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-rose-400 mb-1">
                    <span>{a.titulo}</span>
                    <span className="text-[10px] text-slate-500">{a.dataGeracao.split(' ')[0]}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{a.mensagem}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
