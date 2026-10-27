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
  BarChart2,
  Table as TableIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CyberBarChart, CyberLineChart, CyberDoughnutChart } from '../components/Charts';

export default function DashboardPage() {
  const { products, movements, alerts, getDashboardMetrics, setIsNewSaleOpen } = useStore();
  const [periodo, setPeriodo] = useState<'hoje' | '7d' | '30d'>('30d');
  const [movementChartMode, setMovementChartMode] = useState<'bar' | 'line' | 'table'>('bar');

  const metrics = getDashboardMetrics(periodo);
  const recentMovements = movements.slice(0, 5);
  const recentAlerts = alerts.slice(0, 3);

  // Group categories for doughnut chart
  const categoryCounts: Record<string, number> = {};
  products.forEach(p => {
    categoryCounts[p.categoria] = (categoryCounts[p.categoria] || 0) + 1;
  });

  const categoryColors = ['#00D9FF', '#8B35FF', '#F32BFF', '#00E6A0', '#FFBF3F'];

  const doughnutData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: categoryColors,
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const movementDays = ['10/10', '11/10', '12/10', '13/10', '14/10', '15/10', '16/10'];
  const entradasData = [35, 60, 45, 55, 40, 70, 50];
  const saidasData = [20, 30, 25, 45, 30, 50, 28];

  const movementBarData = {
    labels: movementDays,
    datasets: [
      {
        label: 'Entradas (+)',
        data: entradasData,
        backgroundColor: 'rgba(0, 230, 160, 0.85)',
        borderColor: '#00E6A0',
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 28
      },
      {
        label: 'Saídas (-)',
        data: saidasData,
        backgroundColor: 'rgba(255, 56, 100, 0.85)',
        borderColor: '#FF3864',
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 28
      }
    ]
  };

  const movementLineData = {
    labels: movementDays,
    datasets: [
      {
        label: 'Entradas (+)',
        data: entradasData,
        borderColor: '#00D9FF',
        backgroundColor: 'rgba(0, 217, 255, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: '#00D9FF',
        pointBorderColor: '#050816',
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Saídas (-)',
        data: saidasData,
        borderColor: '#8B35FF',
        backgroundColor: 'rgba(139, 53, 255, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: '#8B35FF',
        pointBorderColor: '#050816',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  return (
    <div className="space-y-6 tab-fade-enter">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
            <h1
              className="text-2xl font-black text-white tracking-wide"
              style={{ fontFamily: 'var(--font-display, Inter)' }}
            >
              Visão Geral
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Acompanhe o desempenho do seu estoque e indicadores comerciais em tempo real.
          </p>
        </div>

        {/* Period Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#0B1228] p-1 rounded-xl border border-[#168BFF]/25 flex items-center gap-1 text-xs">
            {(['hoje', '7d', '30d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-3 py-1 rounded-lg transition-all text-xs ${
                  periodo === p
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_8px_rgba(0,217,255,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              ATENÇÃO
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
            <div className="text-3xl font-extrabold text-white tracking-tight">
              R$ {metrics.vendasPeriodoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="badge-neon badge-purple text-[11px]">
              {metrics.vendasPeriodoQtd} UN
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

      {/* Charts Grid: Movement Flow vs Categories Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movement Flow (2 cols) */}
        <div className="cyber-card p-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Movimentações nos Últimos 7 Dias
              </h3>
              <p className="text-xs text-slate-400">
                Fluxo comparativo de Entradas (+) vs Saídas (-)
              </p>
            </div>

            {/* VIEW MODE SWITCHER: Barras vs Linha (Crescente) vs Tabela */}
            <div className="chart-toggle-group">
              <button
                onClick={() => setMovementChartMode('bar')}
                className={`chart-toggle-btn ${movementChartMode === 'bar' ? 'active' : ''}`}
                title="Gráfico de Barras / Colunas"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Barras</span>
              </button>

              <button
                onClick={() => setMovementChartMode('line')}
                className={`chart-toggle-btn ${movementChartMode === 'line' ? 'active' : ''}`}
                title="Gráfico de Linha / Tendência Crescente"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Linha / Crescente</span>
              </button>

              <button
                onClick={() => setMovementChartMode('table')}
                className={`chart-toggle-btn ${movementChartMode === 'table' ? 'active' : ''}`}
                title="Visualização em Tabela de Dados"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabela</span>
              </button>
            </div>
          </div>

          {/* Conditional Content Area: Chart or Table */}
          {movementChartMode === 'table' ? (
            <div className="cyber-table-container max-h-64 overflow-y-auto">
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Entradas (+)</th>
                    <th>Saídas (-)</th>
                    <th>Balanço do Dia</th>
                    <th>Status do Fluxo</th>
                  </tr>
                </thead>
                <tbody>
                  {movementDays.map((day, i) => {
                    const ent = entradasData[i];
                    const sai = saidasData[i];
                    const diff = ent - sai;
                    const isPositive = diff >= 0;
                    return (
                      <tr key={day}>
                        <td className="font-mono text-xs font-semibold text-white">{day}</td>
                        <td className="font-mono text-emerald-400 font-bold">+{ent} un</td>
                        <td className="font-mono text-rose-400 font-bold">-{sai} un</td>
                        <td className={`font-mono font-bold ${isPositive ? 'text-cyan-300' : 'text-amber-400'}`}>
                          {isPositive ? '+' : ''}{diff} un
                        </td>
                        <td>
                          <span className={`badge-neon ${isPositive ? 'badge-success' : 'badge-warning'}`}>
                            {isPositive ? 'SUPERÁVIT' : 'DÉFICIT'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : movementChartMode === 'line' ? (
            <div className="h-64 relative w-full">
              <CyberLineChart data={movementLineData} />
            </div>
          ) : (
            <div className="h-64 relative w-full">
              <CyberBarChart data={movementBarData} />
            </div>
          )}
        </div>

        {/* Category Doughnut Chart (1 col) */}
        <div className="cyber-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Mix por Categorias</h3>
                <p className="text-xs text-slate-400">Distribuição física do catálogo</p>
              </div>
              <span className="badge-neon badge-blue text-[11px]">
                {Object.keys(categoryCounts).length} setores
              </span>
            </div>

            <div className="h-44 relative flex items-center justify-center">
              <CyberDoughnutChart data={doughnutData} />
            </div>
          </div>

          {/* Categories Legend Table */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
            {Object.entries(categoryCounts).slice(0, 4).map(([cat, count], idx) => {
              const pct = ((count / metrics.totalProdutos) * 100).toFixed(0);
              return (
                <div key={cat} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: categoryColors[idx % categoryColors.length] }}
                    ></span>
                    <span>{cat}</span>
                  </div>
                  <span className="font-mono text-slate-400">{count} itens ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Movements Table & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Movements Table (2 cols) */}
        <div className="cyber-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Movimentações Recentes
              </h3>
            </div>
            <Link href="/movimentacoes" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              Ver extrato completo <ArrowRight className="w-3 h-3" />
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
                  const isEntrada = m.tipo === 'entrada';
                  const isSaida = m.tipo === 'saida';
                  const isPerda = m.tipo === 'perda';

                  return (
                    <tr key={m.id}>
                      <td className="font-mono text-xs text-slate-400">{m.dataHora}</td>
                      <td className="font-medium text-white">{prod ? prod.nome : 'Produto Desconhecido'}</td>
                      <td>
                        <span
                          className={`badge-neon ${
                            isEntrada
                              ? 'badge-success'
                              : isSaida
                              ? 'badge-blue'
                              : isPerda
                              ? 'badge-danger'
                              : 'badge-warning'
                          }`}
                        >
                          {m.tipo.toUpperCase()}
                        </span>
                      </td>
                      <td
                        className={`font-mono font-bold ${
                          isEntrada ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isEntrada ? '+' : '-'}{m.quantidade}
                      </td>
                      <td className="text-slate-400 text-xs">{m.motivo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Alerts (1 col) */}
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">Alertas Críticos</h3>
            </div>
            <Link href="/alertas" className="text-xs text-rose-400 hover:underline flex items-center gap-1">
              Ver todos ({alerts.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentAlerts.map(a => (
              <div
                key={a.id}
                className="p-3 rounded-xl bg-[#101A35]/40 border border-rose-500/20 hover:border-rose-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-rose-400 mb-1">
                  <span>{a.titulo}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {a.dataGeracao.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{a.mensagem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
