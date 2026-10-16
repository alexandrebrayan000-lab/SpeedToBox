'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Layers,
  Receipt,
  TrendingUp,
  Award,
  Filter,
  Download,
  Plus,
  BarChart3,
  LineChart as LineChartIcon,
  Table as TableIcon,
  CheckCircle2,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { NewSaleModal } from './NewSaleModal';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SaleItem {
  id: string;
  date: string;
  items: string;
  payment: string;
  total: number;
  status: string;
}

export function SalesAnalyticsView() {
  const [mounted, setMounted] = useState(false);
  const [periodo, setPeriodo] = useState('hoje');
  const [categoria, setCategoria] = useState('todas');
  const [tipoSaidas, setTipoSaidas] = useState('todas');
  const [timelineMode, setTimelineMode] = useState<'line' | 'bar' | 'table'>('line');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [salesList, setSalesList] = useState<SaleItem[]>([
    {
      id: 'VND-001',
      date: '16/10 15:42',
      items: '5x Café Torrado e Moído Tradicional 500g (R$ 21.50)',
      payment: 'PIX',
      total: 107.5,
      status: 'CONCLUÍDO',
    },
    {
      id: 'VND-002',
      date: '16/10 14:15',
      items: '3x Arroz Nobre Tipo 1 5kg + 2x Feijão Carioca 1kg',
      payment: 'Cartão de Crédito',
      total: 103.3,
      status: 'CONCLUÍDO',
    },
    {
      id: 'VND-003',
      date: '16/10 12:30',
      items: '10x Óleo de Soja 900ml',
      payment: 'Dinheiro',
      total: 65.0,
      status: 'CONCLUÍDO',
    },
    {
      id: 'VND-004',
      date: '16/10 11:05',
      items: '4x Detergente Líquido Neutro 500ml',
      payment: 'PIX',
      total: 12.8,
      status: 'CONCLUÍDO',
    },
    {
      id: 'VND-005',
      date: '16/10 09:20',
      items: '2x Arroz Nobre Tipo 1 5kg',
      payment: 'Cartão de Débito',
      total: 57.0,
      status: 'CONCLUÍDO',
    },
  ]);

  useEffect(() => {
    setMounted(true);

    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-new-sale-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-sale-modal', handleOpenModal);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaleSuccess = (newSale: any) => {
    const newItem: SaleItem = {
      id: newSale.id,
      date: newSale.date,
      items: `${newSale.quantity}x ${newSale.product}`,
      payment: newSale.paymentMethod,
      total: newSale.total,
      status: 'CONCLUÍDO',
    };
    setSalesList([newItem, ...salesList]);
    showToast(`Venda ${newSale.id} realizada com sucesso!`);
  };

  const exportCSV = () => {
    let csv = 'ID,DATA,ITENS,FORMA DE PAGAMENTO,VALOR TOTAL,STATUS\n';
    salesList.forEach((s) => {
      csv += `"${s.id}","${s.date}","${s.items}","${s.payment}","${s.total}","${s.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-vendas-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('Relatório CSV exportado com sucesso!');
  };

  // 1. Chart: Top Produtos Mais Vendidos (Horizontal Bar)
  const topSellersData = {
    labels: [
      'Arroz Nobre 1 5kg',
      'Feijão Carioca 1kg',
      'Óleo de Soja 900ml',
      'Detergente Neutro',
      'Café Moído 500g',
    ],
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: [64, 42, 39, 28, 22],
        backgroundColor: 'rgba(0, 217, 255, 0.85)',
        hoverBackgroundColor: '#00D9FF',
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  };

  const topSellersOptions: any = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(11, 18, 40, 0.95)',
        borderColor: '#00D9FF',
        borderWidth: 1,
        titleColor: '#00D9FF',
        bodyColor: '#F4F7FF',
        padding: 10,
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw} unidades vendidas`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(22, 139, 255, 0.1)' },
        ticks: { color: '#64748B', font: { size: 10, family: 'Inter' } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#A3B2D1', font: { size: 11, weight: '500' } },
      },
    },
  };

  // 2. Chart: Maiores Saídas do Estoque (Auditoria: Vendas vs Perdas vs Avarias)
  const exitsData = {
    labels: ['Vendas Comerciais', 'Perdas (Validade)', 'Avarias (Frete)'],
    datasets: [
      {
        label: 'Volume Físico (UN)',
        data: [68, 6, 2],
        backgroundColor: [
          'rgba(0, 217, 255, 0.85)',
          'rgba(255, 56, 100, 0.85)',
          'rgba(255, 191, 63, 0.85)',
        ],
        borderRadius: 8,
        barThickness: 50,
      },
    ],
  };

  const exitsOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#A3B2D1',
          font: { size: 11 },
          boxWidth: 12,
          usePointStyle: false,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(11, 18, 40, 0.95)',
        borderColor: '#168BFF',
        borderWidth: 1,
        bodyColor: '#F4F7FF',
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#A3B2D1', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(22, 139, 255, 0.1)' },
        ticks: { color: '#64748B', font: { size: 10 } },
      },
    },
  };

  // 3. Chart: Evolução do Faturamento
  const timelineDates = ['06/10', '08/10', '10/10', '12/10', '14/10', '16/10'];
  const timelineValues = [780, 240, 480, 210, 410, 120];

  const timelineData = {
    labels: timelineDates,
    datasets: [
      {
        label: 'Faturamento Diário (R$)',
        data: timelineValues,
        borderColor: '#8B35FF',
        backgroundColor: 'rgba(139, 53, 255, 0.15)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00D9FF',
        pointBorderColor: '#8B35FF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const timelineBarData = {
    labels: timelineDates,
    datasets: [
      {
        label: 'Faturamento Diário (R$)',
        data: timelineValues,
        backgroundColor: 'rgba(139, 53, 255, 0.75)',
        hoverBackgroundColor: '#8B35FF',
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const timelineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start',
        labels: {
          color: '#A3B2D1',
          font: { size: 11 },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(11, 18, 40, 0.95)',
        borderColor: '#8B35FF',
        borderWidth: 1,
        bodyColor: '#F4F7FF',
        callbacks: {
          label: (ctx: any) =>
            ` R$ ${ctx.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(22, 139, 255, 0.08)' },
        ticks: { color: '#64748B', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(22, 139, 255, 0.08)' },
        ticks: {
          color: '#64748B',
          font: { size: 10 },
          callback: (val: any) => `R$ ${val}`,
        },
      },
    },
  };

  // 4. Chart: Faturamento por Categoria (Doughnut)
  const categoryData = {
    labels: ['Alimentos', 'Limpeza', 'Higiene', 'Bebidas', 'Padaria'],
    datasets: [
      {
        data: [44, 22, 16, 11, 7],
        backgroundColor: ['#00D9FF', '#8B35FF', '#00E6A0', '#168BFF', '#FFBF3F'],
        borderColor: '#0B1228',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const categoryOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#A3B2D1',
          font: { size: 11 },
          padding: 12,
          boxWidth: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(11, 18, 40, 0.95)',
        borderColor: '#00D9FF',
        borderWidth: 1,
        bodyColor: '#F4F7FF',
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.raw}% da receita`,
        },
      },
    },
  };

  if (!mounted) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
        <span className="text-xs font-mono text-cyan-400/80 mt-3">Carregando métricas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0B1228] border border-cyan-400 shadow-[0_0_20px_rgba(0,217,255,0.4)] text-xs text-white">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#8B35FF]"></span>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Vendas e Desempenho
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Descubra quais produtos vendem mais, movimentam seu estoque e geram receita.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="btn-cyber-secondary text-xs py-2 px-3.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-cyber-primary text-xs py-2 px-3.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nova Venda</span>
          </button>
        </div>
      </div>

      {/* Global Filters Bar */}
      <div className="cyber-card p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Filtros:
          </span>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Período:</label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="cyber-select min-w-[140px]"
          >
            <option value="hoje">Hoje</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="ano">Ano Atual</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Categoria:</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="cyber-select min-w-[190px]"
          >
            <option value="todas">Todas as Categorias</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Higiene">Higiene</option>
            <option value="Padaria">Padaria</option>
          </select>
        </div>

        {/* Exits Filter */}
        <div className="flex items-center gap-2 lg:ml-auto">
          <label className="text-xs text-slate-400 font-medium">Saídas:</label>
          <select
            value={tipoSaidas}
            onChange={(e) => setTipoSaidas(e.target.value)}
            className="cyber-select min-w-[260px]"
          >
            <option value="todas">Todas as Saídas (Vendas + Perdas)</option>
            <option value="vendas_apenas">Apenas Vendas Comerciais</option>
          </select>
        </div>
      </div>

      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Faturamento Total */}
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Faturamento Total
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            R$ 4.204,40
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            +18.4% vs período anterior
          </span>
        </div>

        {/* KPI 2: Unidades Vendidas */}
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Unidades Vendidas
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            263 un
          </div>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">
            Volume comercial
          </span>
        </div>

        {/* KPI 3: Total de Pedidos */}
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Total de Pedidos
            </span>
            <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            10
          </div>
          <span className="text-[10px] text-purple-400 font-mono mt-1 block">
            Transações no PDV
          </span>
        </div>

        {/* KPI 4: Ticket Médio */}
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Ticket Médio
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            R$ 420.40
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            Média por pedido
          </span>
        </div>

        {/* KPI 5: Produto Destaque */}
        <div className="cyber-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">
              Produto Destaque
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm font-black text-white truncate" title="Arroz Nobre Tipo 1 5kg">
            Arroz Nobre Tipo 1 5kg
          </div>
          <span className="text-[10px] text-amber-400 font-mono mt-1 block">
            64 unidades vendidas
          </span>
        </div>
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Top Produtos Mais Vendidos */}
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#168BFF]/15">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                TOP PRODUTOS MAIS VENDIDOS
              </h2>
              <p className="text-[11px] text-slate-400">Classificação por volume de saída</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-md">
              Curva ABC
            </span>
          </div>
          <div className="h-[260px] w-full">
            <Bar data={topSellersData} options={topSellersOptions} />
          </div>
        </div>

        {/* Chart 2: Maiores Saídas do Estoque */}
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#168BFF]/15">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                MAIORES SAÍDAS DO ESTOQUE
              </h2>
              <p className="text-[11px] text-slate-400">
                Vendas vs Perdas por Validade e Avarias
              </p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md">
              Auditoria
            </span>
          </div>
          <div className="h-[260px] w-full">
            <Bar data={exitsData} options={exitsOptions} />
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Evolução do Faturamento (with Linha / Barras / Tabela toggles) */}
        <div className="lg:col-span-7 cyber-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-[#168BFF]/15">
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  EVOLUÇÃO DO FATURAMENTO
                </h2>
                <p className="text-[11px] text-slate-400">
                  Desempenho diário de receita registrada
                </p>
              </div>

              {/* View Switcher: Linha | Barras | Tabela */}
              <div className="flex items-center gap-1 bg-[#080D20] p-1 rounded-xl border border-[#168BFF]/25">
                <button
                  onClick={() => setTimelineMode('line')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timelineMode === 'line' ? 'switcher-active' : 'switcher-inactive'
                  }`}
                >
                  <LineChartIcon className="w-3.5 h-3.5" />
                  <span>Linha</span>
                </button>
                <button
                  onClick={() => setTimelineMode('bar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timelineMode === 'bar' ? 'switcher-active' : 'switcher-inactive'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Barras</span>
                </button>
                <button
                  onClick={() => setTimelineMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timelineMode === 'table' ? 'switcher-active' : 'switcher-inactive'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Tabela</span>
                </button>
              </div>
            </div>

            <div className="h-[270px] w-full flex items-center justify-center">
              {timelineMode === 'line' && (
                <Line data={timelineData} options={timelineOptions} />
              )}
              {timelineMode === 'bar' && (
                <Bar data={timelineBarData} options={timelineOptions} />
              )}
              {timelineMode === 'table' && (
                <div className="w-full h-full overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#168BFF]/20 text-[#A3B2D1] uppercase text-[10px]">
                        <th className="py-2 px-3">Data</th>
                        <th className="py-2 px-3">Transações</th>
                        <th className="py-2 px-3">Faturamento</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#168BFF]/10 text-slate-300">
                      {timelineDates.map((date, idx) => (
                        <tr key={date} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-mono text-cyan-300">{date}/2026</td>
                          <td className="py-2.5 px-3">{Math.round(timelineValues[idx] / 45)} pedidos</td>
                          <td className="py-2.5 px-3 font-semibold text-white">
                            R$ {timelineValues[idx].toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Auditado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart 4: Faturamento por Categoria */}
        <div className="lg:col-span-5 cyber-card p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#168BFF]/15">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                FATURAMENTO POR CATEGORIA
              </h2>
              <p className="text-[11px] text-slate-400">
                Participação de receita por departamento
              </p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
              Mix Financeiro
            </span>
          </div>
          <div className="h-[270px] w-full flex items-center justify-center">
            <Doughnut data={categoryData} options={categoryOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Table: Histórico de Vendas */}
      <div className="cyber-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#168BFF]/15">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              HISTÓRICO RECENTE DE VENDAS
            </h2>
            <p className="text-[11px] text-slate-400">
              Últimas transações comerciais confirmadas no PDV
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>Exportar CSV</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#168BFF]/20 text-[#A3B2D1] uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3">Itens do Pedido</th>
                <th className="py-2.5 px-3">Forma Pagamento</th>
                <th className="py-2.5 px-3">Valor Total</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#168BFF]/10 text-slate-300">
              {salesList.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-cyan-300 whitespace-nowrap">
                    {sale.date}
                  </td>
                  <td className="py-3 px-3 font-medium text-white max-w-md truncate">
                    {sale.items}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#0B1228] border border-cyan-500/25 text-cyan-300 font-mono text-[11px]">
                      {sale.payment}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white font-mono whitespace-nowrap">
                    {sale.total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sale Modal */}
      <NewSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaleSuccess}
      />
    </div>
  );
}
