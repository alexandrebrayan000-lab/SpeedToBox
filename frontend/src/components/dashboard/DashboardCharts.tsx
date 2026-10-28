'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { BarChart3, TrendingUp, Table as TableIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export function DashboardCharts() {
  const { produtos, metrics } = useStore();
  const [mounted, setMounted] = useState(false);
  const [chartMode, setChartMode] = useState<'bar' | 'line' | 'table'>('bar');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 glass-panel animate-pulse flex items-center justify-center text-xs text-slate-500">Carregando métricas visuais...</div>;
  }

  // Agrupamento por Categoria
  const categoryCounts: Record<string, number> = {};
  produtos.forEach(p => {
    categoryCounts[p.categoria] = (categoryCounts[p.categoria] || 0) + 1;
  });

  const categoryLabels = Object.keys(categoryCounts);
  const categoryDataValues = Object.values(categoryCounts);
  const categoryPalette = ['#00d9ff', '#8b35ff', '#f32bff', '#00e6a0', '#ffbf3f'];

  const doughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryDataValues,
        backgroundColor: categoryPalette,
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0c1328',
        borderColor: '#00d9ff',
        borderWidth: 1,
        titleColor: '#00d9ff',
        bodyColor: '#ffffff',
        padding: 8
      }
    }
  };

  // Dados dos Últimos 7 Dias
  const days = ['10/10', '11/10', '12/10', '13/10', '14/10', '15/10', '16/10'];
  const entradas = [35, 60, 45, 55, 40, 70, 50];
  const saidas = [20, 30, 25, 45, 30, 50, 28];

  const barData = {
    labels: days,
    datasets: [
      {
        label: 'Entradas (+)',
        data: entradas,
        backgroundColor: 'rgba(0, 230, 160, 0.85)',
        borderColor: '#00e6a0',
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 24
      },
      {
        label: 'Saídas (-)',
        data: saidas,
        backgroundColor: 'rgba(255, 56, 100, 0.85)',
        borderColor: '#ff3864',
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 24
      }
    ]
  };

  const lineData = {
    labels: days,
    datasets: [
      {
        label: 'Entradas (+)',
        data: entradas,
        borderColor: '#00d9ff',
        backgroundColor: 'rgba(0, 217, 255, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#00d9ff',
        pointRadius: 3
      },
      {
        label: 'Saídas (-)',
        data: saidas,
        borderColor: '#8b35ff',
        backgroundColor: 'rgba(139, 53, 255, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#8b35ff',
        pointRadius: 3
      }
    ]
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#8e9dbf',
          font: { size: 11, family: 'Inter' },
          boxWidth: 10,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#0c1328',
        borderColor: '#00d9ff',
        borderWidth: 1,
        titleColor: '#00d9ff',
        bodyColor: '#ffffff',
        padding: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0, 217, 255, 0.06)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(0, 217, 255, 0.06)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Fluxo de Movimentações (2 colunas) */}
      <div className="glass-panel p-5 lg:col-span-2 accent-line">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Fluxo de Movimentações (Últimos 7 Dias)
            </h3>
            <p className="text-xs text-slate-400">
              Comparativo de reposições / entradas vs vendas e baixas
            </p>
          </div>

          {/* Toggle Switcher */}
          <div className="flex items-center gap-1 bg-[#080d20] p-1 rounded-xl border border-cyan-500/20 text-xs font-semibold">
            <button
              onClick={() => setChartMode('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                chartMode === 'bar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Barras</span>
            </button>

            <button
              onClick={() => setChartMode('line')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                chartMode === 'line'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Linha</span>
            </button>

            <button
              onClick={() => setChartMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                chartMode === 'table'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabela</span>
            </button>
          </div>
        </div>

        {/* Visualização */}
        {chartMode === 'table' ? (
          <div className="h-60 overflow-y-auto">
            <table className="custom-table text-xs">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Entradas (+)</th>
                  <th>Saídas (-)</th>
                  <th>Balanço</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d, i) => {
                  const ent = entradas[i];
                  const sai = saidas[i];
                  const saldo = ent - sai;
                  const positivo = saldo >= 0;
                  return (
                    <tr key={d}>
                      <td className="font-mono text-cyan-300 font-bold">{d}</td>
                      <td className="font-mono text-emerald-400">+{ent} un</td>
                      <td className="font-mono text-rose-400">-{sai} un</td>
                      <td className={`font-mono font-bold ${positivo ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {positivo ? '+' : ''}{saldo} un
                      </td>
                      <td>
                        <span className={`badge-pill ${positivo ? 'badge-pill-green' : 'badge-pill-amber'}`}>
                          {positivo ? 'SUPERÁVIT' : 'DÉFICIT'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : chartMode === 'line' ? (
          <div className="h-60 relative w-full">
            <Line data={lineData} options={commonChartOptions} />
          </div>
        ) : (
          <div className="h-60 relative w-full">
            <Bar data={barData} options={commonChartOptions} />
          </div>
        )}
      </div>

      {/* Mix por Categorias (1 coluna) */}
      <div className="glass-panel p-5 flex flex-col justify-between accent-line">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Mix por Categorias</h3>
              <p className="text-xs text-slate-400">Distribuição do catálogo cadastrado</p>
            </div>
            <span className="badge-pill badge-pill-cyan">
              {categoryLabels.length} setores
            </span>
          </div>

          <div className="h-40 relative flex items-center justify-center my-2">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Legenda Customizada */}
        <div className="pt-3 border-t border-cyan-500/10 space-y-1.5 text-xs">
          {categoryLabels.slice(0, 4).map((cat, idx) => {
            const count = categoryCounts[cat];
            const pct = ((count / metrics.totalProdutos) * 100).toFixed(0);
            return (
              <div key={cat} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: categoryPalette[idx % categoryPalette.length] }}
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
  );
}
