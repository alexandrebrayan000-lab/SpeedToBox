'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Plus,
  Filter,
  DollarSign,
  ShoppingBag,
  Award,
  Receipt,
  BarChart2,
  Table as TableIcon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CyberBarChart, CyberLineChart, CyberDoughnutChart } from '../../components/Charts';

const CATEGORIES = ['todas', 'Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Padaria'];

export default function SalesPage() {
  const { sales, products, exportToCSV, setIsNewSaleOpen, getSalesAnalytics } = useStore();

  const [periodo, setPeriodo] = useState('30d');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [tipoSaidas, setTipoSaidas] = useState('todas');
  const [timelineMode, setTimelineMode] = useState<'line' | 'bar' | 'table'>('line');

  const analytics = getSalesAnalytics(periodo, filtroCategoria);

  // Chart 1: Top Sellers (Horizontal Bar)
  const topSellersData = {
    labels: analytics.topSellers.slice(0, 5).map(s => s.nome.substring(0, 18) + '...'),
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: analytics.topSellers.slice(0, 5).map(s => s.quantidade),
        backgroundColor: 'rgba(0, 217, 255, 0.75)',
        borderRadius: 6
      }
    ]
  };

  const horizontalOptions = {
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false }
    }
  };

  // Chart 2: Exits Breakdown (Bar)
  const exitsData = {
    labels: ['Vendas Comerciais', 'Perdas (Validade)', 'Avarias (Frete)'],
    datasets: [
      {
        label: 'Volume Físico (UN)',
        data: [
          analytics.exitsBreakdown.vendas,
          analytics.exitsBreakdown.perdas,
          analytics.exitsBreakdown.avarias
        ],
        backgroundColor: [
          'rgba(0, 217, 255, 0.8)',
          'rgba(255, 56, 100, 0.8)',
          'rgba(255, 191, 63, 0.8)'
        ],
        borderRadius: 6
      }
    ]
  };

  // Chart 3: Revenue Timeline (Line | Bar | Table)
  const timelineChartData = {
    labels: analytics.timelineData.labels,
    datasets: [
      {
        label: 'Faturamento Diário (R$)',
        data: analytics.timelineData.values,
        borderColor: '#8B35FF',
        backgroundColor: 'rgba(139, 53, 255, 0.15)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#00D9FF',
        pointBorderColor: '#FFFFFF',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const timelineBarData = {
    labels: analytics.timelineData.labels,
    datasets: [
      {
        label: 'Faturamento Diário (R$)',
        data: analytics.timelineData.values,
        backgroundColor: 'rgba(139, 53, 255, 0.75)',
        borderColor: '#8B35FF',
        borderWidth: 1.5,
        borderRadius: 6
      }
    ]
  };

  // Chart 4: Categories Doughnut
  const categoryChartData = {
    labels: analytics.categoryDistribution.labels,
    datasets: [
      {
        data: analytics.categoryDistribution.values,
        backgroundColor: [
          'rgba(0, 217, 255, 0.85)',
          'rgba(139, 53, 255, 0.85)',
          'rgba(0, 230, 160, 0.85)',
          'rgba(243, 43, 255, 0.85)',
          'rgba(255, 191, 63, 0.85)'
        ],
        borderColor: '#0B1228',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#8B35FF]"></span>
            <h1
              className="text-2xl font-black text-white tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vendas e Desempenho
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Descubra quais produtos vendem mais, movimentam seu estoque e geram receita.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportToCSV('vendas')}
            className="btn-cyber-secondary text-xs py-2 px-3.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório</span>
          </button>
          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="btn-cyber-primary text-xs py-2 px-3.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nova Venda</span>
          </button>
        </div>
      </div>

      {/* Global Filters Bar */}
      <div className="cyber-card p-4 sm:p-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Filtros:</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-400">Período:</label>
          <select
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
            className="cyber-select text-xs min-w-[140px]"
          >
            <option value="hoje">Hoje</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="ano">Ano Atual</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-400">Categoria:</label>
          <select
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            className="cyber-select text-xs min-w-[180px]"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c === 'todas' ? 'Todas as Categorias' : c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs font-medium text-slate-400">Saídas:</label>
          <select
            value={tipoSaidas}
            onChange={e => setTipoSaidas(e.target.value)}
            className="cyber-select text-xs min-w-[240px]"
          >
            <option value="todas">Todas as Saídas (Vendas + Perdas)</option>
            <option value="vendas_apenas">Apenas Vendas Comerciais</option>
          </select>
        </div>
      </div>

      {/* 5 Sales KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Faturamento Total */}
        <div className="cyber-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Faturamento Total</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-white tracking-tight font-mono">
            R$ {analytics.faturamentoTotal.toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">+18.4% vs anterior</span>
        </div>

        {/* KPI 2: Unidades Vendidas */}
        <div className="cyber-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Unidades Vendidas</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-cyan-300 tracking-tight font-mono">
            {analytics.unidadesVendidas} un
          </div>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Volume comercial</span>
        </div>

        {/* KPI 3: Total de Pedidos */}
        <div className="cyber-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Total de Pedidos</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-purple-300 tracking-tight font-mono">
            {analytics.totalPedidos} pedidos
          </div>
          <span className="text-[10px] text-purple-400 font-mono mt-1 block">Transações concluídas</span>
        </div>

        {/* KPI 4: Ticket Médio */}
        <div className="cyber-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Ticket Médio</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-400 tracking-tight font-mono">
            R$ {analytics.ticketMedio.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Média por pedido</span>
        </div>

        {/* KPI 5: Produto Destaque */}
        <div className="cyber-card p-4 border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Top Produto</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-white truncate" title={analytics.produtoDestaqueNome}>
            {analytics.produtoDestaqueNome}
          </div>
          <span className="text-[10px] text-amber-400 font-mono mt-1 block truncate">
            {analytics.produtoDestaqueQtd} unidades vendidas
          </span>
        </div>
      </div>

      {/* Row 1: Top 5 Mais Vendidos & Evolução do Faturamento com Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Top Sellers */}
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Produtos Mais Vendidos
              </h3>
              <p className="text-xs text-slate-400">Classificação por unidades movimentadas</p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/30">
              Curva ABC
            </span>
          </div>
          <div className="h-72">
            <CyberBarChart data={topSellersData} options={horizontalOptions} />
          </div>
        </div>

        {/* Chart 2: Revenue Timeline with Mode Switcher (Linha, Barras, Tabela) */}
        <div className="cyber-card p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Evolução do Faturamento
              </h3>
              <p className="text-xs text-slate-400">Receita diária com alternância de visualização</p>
            </div>

            {/* VIEW MODE SWITCHER */}
            <div className="chart-toggle-group">
              <button
                onClick={() => setTimelineMode('line')}
                className={`chart-toggle-btn ${timelineMode === 'line' ? 'active' : ''}`}
                title="Gráfico de Linha / Tendência Crescente"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Linha</span>
              </button>

              <button
                onClick={() => setTimelineMode('bar')}
                className={`chart-toggle-btn ${timelineMode === 'bar' ? 'active' : ''}`}
                title="Gráfico de Barras"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Barras</span>
              </button>

              <button
                onClick={() => setTimelineMode('table')}
                className={`chart-toggle-btn ${timelineMode === 'table' ? 'active' : ''}`}
                title="Tabela de Dados"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabela</span>
              </button>
            </div>
          </div>

          {timelineMode === 'table' ? (
            <div className="cyber-table-container max-h-72 overflow-y-auto">
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Faturamento (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.timelineData.labels.map((lbl, idx) => (
                    <tr key={lbl}>
                      <td className="font-mono text-xs font-semibold text-white">{lbl}</td>
                      <td className="font-mono text-purple-300 font-bold">
                        R$ {analytics.timelineData.values[idx].toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : timelineMode === 'bar' ? (
            <div className="h-72">
              <CyberBarChart data={timelineBarData} />
            </div>
          ) : (
            <div className="h-72">
              <CyberLineChart data={timelineChartData} />
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Maiores Saídas do Estoque (2 cols) & Categorias (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 3: Exits Breakdown (2 cols) */}
        <div className="cyber-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Maiores Saídas do Estoque
              </h3>
              <p className="text-xs text-slate-400">Vendas vs Perdas por Validade e Avarias</p>
            </div>
            <span className="text-[11px] font-mono text-rose-400 bg-rose-900/20 px-2 py-0.5 rounded border border-rose-500/30">
              Auditoria
            </span>
          </div>
          <div className="h-72">
            <CyberBarChart data={exitsData} />
          </div>
        </div>

        {/* Chart 4: Categories Revenue Doughnut (1 col) */}
        <div className="cyber-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Faturamento por Categoria
                </h3>
                <p className="text-xs text-slate-400">Participação de receita por departamento</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Mix</span>
            </div>
            <div className="h-48 relative flex items-center justify-center">
              <CyberDoughnutChart data={categoryChartData} />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
            {analytics.categoryDistribution.labels.map((lbl, idx) => (
              <div key={lbl} className="flex items-center justify-between text-slate-300">
                <span>{lbl}</span>
                <span className="font-mono text-white font-semibold">
                  R$ {analytics.categoryDistribution.values[idx]?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Transactions Ledger */}
      <div className="cyber-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Extrato Detalhado de Vendas
            </h3>
          </div>
          <button
            onClick={() => exportToCSV('vendas')}
            className="text-xs text-cyan-400 hover:underline cursor-pointer"
          >
            Exportar CSV ➔
          </button>
        </div>

        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Data / Hora</th>
                <th>Itens do Pedido</th>
                <th>Forma Pagamento</th>
                <th>Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id}>
                  <td className="font-mono font-bold text-white text-xs">{s.codigo}</td>
                  <td className="font-mono text-xs text-slate-400">{s.dataHora}</td>
                  <td>
                    <div className="flex flex-col gap-0.5">
                      {s.itens.map((it, idx) => {
                        const prod = products.find(p => p.id === it.produtoId);
                        return (
                          <span key={idx} className="text-xs text-slate-300">
                            {it.quantidade}x {prod ? prod.nome : 'Item'} (R${' '}
                            {it.precoUnitario.toFixed(2)})
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
                      {s.formaPagamento}
                    </span>
                  </td>
                  <td className="font-mono font-bold text-sm text-white">
                    R$ {s.valorTotal.toFixed(2)}
                  </td>
                  <td>
                    <span className="badge-neon badge-success">{s.status.toUpperCase()}</span>
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
