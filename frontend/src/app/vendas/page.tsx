'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Layers,
  Receipt,
  Award,
  Filter,
  Download,
  Trophy,
  ArrowUpRight,
  CreditCard,
  QrCode,
  Banknote,
  Search,
  ShoppingCart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useStore } from '../../context/StoreContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export function VendasPage() {
  const { vendas, produtos, movimentacoes, setIsNovaVendaOpen } = useStore();

  const [periodo, setPeriodo] = useState<'hoje' | '7d' | '30d' | 'ano'>('30d');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [tipoSaidas, setTipoSaidas] = useState<'todas' | 'vendas_apenas'>('todas');
  const [showAllTop, setShowAllTop] = useState<boolean>(false);
  const [buscaVenda, setBuscaVenda] = useState<string>('');

  // Lista dinâmica de categorias
  const categoriasDisponiveis = useMemo(() => {
    const setCats = new Set<string>();
    produtos.forEach(p => {
      if (p.categoria) setCats.add(p.categoria);
    });
    return ['todas', ...Array.from(setCats)];
  }, [produtos]);

  // Filtragem temporal e analítica das vendas
  const analytics = useMemo(() => {
    const agora = new Date();
    let filteredSales = vendas.filter(v => {
      if (periodo === 'hoje') {
        const d = new Date(v.dataHora);
        return d.toDateString() === agora.toDateString();
      }
      if (periodo === '7d') {
        const d = new Date(v.dataHora);
        const diff = (agora.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }
      if (periodo === '30d') {
        const d = new Date(v.dataHora);
        const diff = (agora.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      }
      return true;
    });

    if (filtroCategoria !== 'todas') {
      filteredSales = filteredSales.filter(s =>
        s.itens.some(item => {
          const prod = produtos.find(p => p.id === item.produtoId);
          return prod && prod.categoria === filtroCategoria;
        })
      );
    }

    const faturamentoTotal = filteredSales.reduce((acc, s) => acc + (s.valorTotal || 0), 0);
    const totalVendas = filteredSales.length;
    const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;

    // Unidades e faturamento por produto
    const productQuantities: Record<string, number> = {};
    const productRevenues: Record<string, number> = {};

    filteredSales.forEach(s => {
      s.itens.forEach(item => {
        productQuantities[item.produtoId] = (productQuantities[item.produtoId] || 0) + item.quantidade;
        productRevenues[item.produtoId] = (productRevenues[item.produtoId] || 0) + item.subtotal;
      });
    });

    const totalUnidadesVendidas = Object.values(productQuantities).reduce((a, b) => a + b, 0);

    const rankingMaisVendidos = Object.keys(productQuantities).map(prodId => {
      const prod = produtos.find(p => p.id === prodId);
      const qtd = productQuantities[prodId];
      const receita = productRevenues[prodId] || 0;
      const pct = totalUnidadesVendidas > 0 ? ((qtd / totalUnidadesVendidas) * 100).toFixed(1) : '0';
      return {
        id: prodId,
        nome: prod ? prod.nome : 'Produto ' + prodId,
        categoria: prod ? prod.categoria : 'Geral',
        quantidade: qtd,
        faturamento: receita,
        participacao: Number(pct)
      };
    }).sort((a, b) => b.quantidade - a.quantidade);

    const produtoMaisVendido = rankingMaisVendidos[0] || {
      nome: produtos[0]?.nome || 'Sem vendas no período',
      quantidade: 0,
      faturamento: 0
    };

    const rankingFaturamento = [...rankingMaisVendidos].sort((a, b) => b.faturamento - a.faturamento);

    // Saídas de Estoque discriminadas (Vendas vs Perdas vs Avarias)
    const saidasPorProduto: Record<string, { nome: string; vendas: number; perdas: number; avarias: number }> = {};
    movimentacoes
      .filter(m => m.tipo !== 'entrada')
      .forEach(m => {
        const prod = produtos.find(p => p.id === m.produtoId);
        const pNome = prod ? prod.nome : 'Item ' + m.produtoId;
        if (!saidasPorProduto[m.produtoId]) {
          saidasPorProduto[m.produtoId] = { nome: pNome, vendas: 0, perdas: 0, avarias: 0 };
        }
        if (m.tipo === 'saida') saidasPorProduto[m.produtoId].vendas += m.quantidade;
        else if (m.tipo === 'perda') saidasPorProduto[m.produtoId].perdas += m.quantidade;
        else if (m.tipo === 'avaria') saidasPorProduto[m.produtoId].avarias += m.quantidade;
      });

    // Faturamento por categoria
    const categoryRevenues: Record<string, number> = {};
    filteredSales.forEach(s => {
      s.itens.forEach(it => {
        const p = produtos.find(prod => prod.id === it.produtoId);
        const cat = p?.categoria || 'Outros';
        categoryRevenues[cat] = (categoryRevenues[cat] || 0) + it.subtotal;
      });
    });

    const categoriesArray = Object.entries(categoryRevenues).map(([nome, fat]) => ({
      nome,
      faturamento: fat,
      percentual: faturamentoTotal > 0 ? ((fat / faturamentoTotal) * 100).toFixed(1) : '0'
    })).sort((a, b) => b.faturamento - a.faturamento);

    // Evolução diária de faturamento (Timeline)
    const salesByDate: Record<string, number> = {};
    filteredSales.forEach(s => {
      const dia = s.dataHora.slice(0, 10);
      salesByDate[dia] = (salesByDate[dia] || 0) + s.valorTotal;
    });

    const timelineLabels = Object.keys(salesByDate).sort();
    const timelineValues = timelineLabels.map(l => salesByDate[l]);

    return {
      filteredSales,
      faturamentoTotal,
      totalVendas,
      totalUnidadesVendidas,
      ticketMedio,
      produtoMaisVendido,
      rankingMaisVendidos,
      rankingFaturamento,
      saidasPorProduto: Object.values(saidasPorProduto).slice(0, 6),
      categoriesArray,
      timelineLabels: timelineLabels.length > 0 ? timelineLabels : ['Hoje'],
      timelineValues: timelineValues.length > 0 ? timelineValues : [faturamentoTotal]
    };
  }, [vendas, produtos, movimentacoes, periodo, filtroCategoria]);

  // Vendas filtradas por busca textual
  const vendasFiltradasBusca = useMemo(() => {
    if (!buscaVenda.trim()) return analytics.filteredSales;
    const q = buscaVenda.toLowerCase();
    return analytics.filteredSales.filter(v =>
      v.codigo.toLowerCase().includes(q) ||
      v.formaPagamento.toLowerCase().includes(q) ||
      v.itens.some(i => {
        const p = produtos.find(prod => prod.id === i.produtoId);
        return p && p.nome.toLowerCase().includes(q);
      })
    );
  }, [analytics.filteredSales, buscaVenda, produtos]);

  // Exportação CSV das vendas filtradas
  const exportarCSVVendas = () => {
    const rows = [
      ['CÓDIGO VENDA', 'DATA/HORA', 'TOTAL (R$)', 'FORMA PAGAMENTO', 'ITENS', 'STATUS']
    ];
    analytics.filteredSales.forEach(v => {
      const itensDesc = v.itens.map(i => {
        const p = produtos.find(prod => prod.id === i.produtoId);
        return `${p ? p.nome : i.produtoId} (${i.quantidade}x)`;
      }).join(' + ');
      rows.push([v.codigo, v.dataHora, v.valorTotal.toFixed(2), v.formaPagamento, `"${itensDesc}"`, v.status.toUpperCase()]);
    });

    const csvContent = '\uFEFF' + rows.map(r => r.join(';')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speedtobox_analitica_vendas_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper para badge de forma de pagamento
  const renderBadgePagamento = (forma: string) => {
    switch (forma) {
      case 'PIX':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <QrCode className="w-3 h-3" /> PIX
          </span>
        );
      case 'Cartão de Crédito':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-500/15 border border-purple-500/30 text-purple-300">
            <CreditCard className="w-3 h-3" /> Crédito
          </span>
        );
      case 'Cartão de Débito':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            <CreditCard className="w-3 h-3" /> Débito
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <Banknote className="w-3 h-3" /> {forma}
          </span>
        );
    }
  };

  // Gráficos configurados
  const topSellersList = showAllTop
    ? analytics.rankingMaisVendidos
    : analytics.rankingMaisVendidos.slice(0, 5);

  const topSellersChartData = {
    labels: topSellersList.map(item => item.nome.length > 18 ? item.nome.slice(0, 16) + '...' : item.nome),
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: topSellersList.map(item => item.quantidade),
        backgroundColor: 'rgba(0, 217, 255, 0.75)',
        borderColor: '#00D9FF',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const timelineChartData = {
    labels: analytics.timelineLabels.map(l => l.slice(5)),
    datasets: [
      {
        label: 'Faturamento (R$)',
        data: analytics.timelineValues,
        borderColor: '#8B35FF',
        backgroundColor: 'rgba(139, 53, 255, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#00D9FF',
        pointBorderColor: '#8B35FF',
        pointRadius: 4
      }
    ]
  };

  const exitsChartData = {
    labels: analytics.saidasPorProduto.map(p => p.nome.length > 14 ? p.nome.slice(0, 12) + '...' : p.nome),
    datasets: [
      {
        label: 'Vendas',
        data: analytics.saidasPorProduto.map(p => p.vendas),
        backgroundColor: '#00D9FF',
        borderRadius: 4
      },
      ...(tipoSaidas === 'todas'
        ? [
            {
              label: 'Perdas',
              data: analytics.saidasPorProduto.map(p => p.perdas),
              backgroundColor: '#FF3864',
              borderRadius: 4
            },
            {
              label: 'Avarias',
              data: analytics.saidasPorProduto.map(p => p.avarias),
              backgroundColor: '#FFBF3F',
              borderRadius: 4
            }
          ]
        : [])
    ]
  };

  const categoryDoughnutData = {
    labels: analytics.categoriesArray.map(c => c.nome),
    datasets: [
      {
        data: analytics.categoriesArray.map(c => c.faturamento),
        backgroundColor: ['#00D9FF', '#8B35FF', '#F32BFF', '#00E6A0', '#FFBF3F', '#168BFF'],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#8b35ff]"></span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Vendas &amp; Inteligência Comercial (PDV)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Descubra quais produtos vendem mais, movimentam seu estoque físico e maximizam a receita do caixa.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportarCSVVendas}
            className="btn-neon-secondary text-xs py-2 px-3.5 flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório</span>
          </button>
          <button
            onClick={() => setIsNovaVendaOpen(true)}
            className="btn-neon-primary text-xs py-2 px-4 flex items-center gap-2 shadow-[0_0_15px_rgba(0,217,255,0.3)]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>+ Nova Venda (PDV)</span>
          </button>
        </div>
      </div>

      {/* Global Filters Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-cyan-400">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">Filtros:</span>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-slate-400 font-mono">Período:</label>
          <select
            value={periodo}
            onChange={e => setPeriodo(e.target.value as 'hoje' | '7d' | '30d' | 'ano')}
            className="bg-slate-900 border border-cyan-500/30 text-white rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="hoje">Hoje</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="ano">Ano Atual</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-slate-400 font-mono">Categoria:</label>
          <select
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            className="bg-slate-900 border border-cyan-500/30 text-white rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:border-cyan-400 font-mono"
          >
            {categoriasDisponiveis.map(c => (
              <option key={c} value={c}>
                {c === 'todas' ? 'Todas as Categorias' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Exits Mode Filter */}
        <div className="flex items-center gap-1.5 sm:ml-auto">
          <label className="text-xs text-slate-400 font-mono">Saídas:</label>
          <select
            value={tipoSaidas}
            onChange={e => setTipoSaidas(e.target.value as 'todas' | 'vendas_apenas')}
            className="bg-slate-900 border border-cyan-500/30 text-white rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="todas">Todas as Saídas (Vendas + Perdas + Avarias)</option>
            <option value="vendas_apenas">Apenas Vendas Comerciais</option>
          </select>
        </div>
      </div>

      {/* 5 KPI Cards Comerciais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Faturamento Total */}
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Faturamento
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-white font-mono tracking-tight">
            R$ {analytics.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Receita bruta auditada
          </span>
        </div>

        {/* KPI 2: Unidades Vendidas */}
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Itens Vendidos
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-white font-mono tracking-tight">
            {analytics.totalUnidadesVendidas} un
          </div>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">
            Volume físico comercializado
          </span>
        </div>

        {/* KPI 3: Número de Pedidos */}
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Nº de Pedidos
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-white font-mono tracking-tight">
            {analytics.totalVendas} transações
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Vendas registradas no PDV
          </span>
        </div>

        {/* KPI 4: Ticket Médio */}
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Ticket Médio
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">
            R$ {analytics.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Média por carrinho
          </span>
        </div>

        {/* KPI 5: Produto Campeão */}
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Top Produto
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs font-bold text-white truncate" title={analytics.produtoMaisVendido.nome}>
            {analytics.produtoMaisVendido.nome}
          </div>
          <span className="text-[10px] text-amber-400 font-mono mt-1 block">
            {analytics.produtoMaisVendido.quantidade} un (R$ {analytics.produtoMaisVendido.faturamento.toFixed(2)})
          </span>
        </div>
      </div>

      {/* Linha 1 de Gráficos: Top Mais Vendidos & Faturamento ao Longo do Tempo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Mais Vendidos */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Produtos Mais Vendidos (Volume)
              </h3>
              <p className="text-xs text-slate-400">Quantidade de unidades vendidas no período filtrado</p>
            </div>
            <button
              onClick={() => setShowAllTop(!showAllTop)}
              className="text-xs text-cyan-400 hover:underline font-semibold font-mono"
            >
              {showAllTop ? 'Ver Top 5' : 'Ver Todos'}
            </button>
          </div>

          <div className="h-64 relative w-full">
            <Bar
              data={topSellersChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { family: 'monospace' } } },
                  y: { grid: { display: false }, ticks: { color: '#ffffff', font: { family: 'monospace', size: 11 } } }
                }
              }}
            />
          </div>
        </div>

        {/* Gráfico 2: Linha de Evolução do Faturamento */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Faturamento ao Longo do Tempo
              </h3>
              <p className="text-xs text-slate-400">Evolução diária da receita comercial concluída</p>
            </div>
            <span className="badge-pill badge-pill-cyan font-mono">Receita R$</span>
          </div>

          <div className="h-64 relative w-full">
            <Line
              data={timelineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { family: 'monospace' } } },
                  y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                      color: '#ffffff',
                      font: { family: 'monospace' },
                      callback: (v: string | number) => `R$ ${v}`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Linha 2 de Gráficos: Saídas por Motivo & Participação por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 3: Saídas de Estoque (2 cols) */}
        <div className="glass-panel p-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Produtos que Mais Saíram do Estoque
              </h3>
              <p className="text-xs text-slate-400">Diferenciação clara: Vendas vs Perdas vs Avarias</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm"></span> Venda
              </span>
              {tipoSaidas === 'todas' && (
                <>
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> Perda
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm"></span> Avaria
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="h-64 relative w-full">
            <Bar
              data={exitsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { stacked: true, grid: { display: false }, ticks: { color: '#ffffff', font: { family: 'monospace', size: 11 } } },
                  y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { family: 'monospace' } } }
                },
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>

        {/* Gráfico 4: Participação por Categoria (1 col) */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">Participação por Categoria</h3>
              <p className="text-xs text-slate-400">Faturamento gerado por departamento</p>
            </div>

            <div className="h-44 relative flex items-center justify-center">
              <Doughnut
                data={categoryDoughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/10 space-y-1.5 text-xs font-mono">
            {analytics.categoriesArray.slice(0, 4).map(cat => (
              <div key={cat.nome} className="flex items-center justify-between text-slate-300">
                <span>{cat.nome}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">R$ {cat.faturamento.toFixed(2)}</span>
                  <span className="text-cyan-400 font-semibold">({cat.percentual}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Linha 3: Ranking de Faturamento por Produto & Tabela Auditada de Vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking por Faturamento (1 col) */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Ranking por Receita</h3>
              <p className="text-xs text-slate-400">Itens com maior faturamento líquido</p>
            </div>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>

          <div className="space-y-3">
            {analytics.rankingFaturamento.slice(0, 5).map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[130px]">{item.nome}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{item.quantidade} unidades vendidas</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <p className="text-xs font-bold text-cyan-400">R$ {item.faturamento.toFixed(2)}</p>
                  <span className="text-[10px] text-purple-300">{item.participacao}% do total</span>
                </div>
              </div>
            ))}
            {analytics.rankingFaturamento.length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-6">Nenhuma venda encontrada no filtro.</p>
            )}
          </div>
        </div>

        {/* Registro / Tabela de Vendas PDV (2 cols) */}
        <div className="glass-panel p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Registro de Vendas (PDV)</h3>
                <p className="text-xs text-slate-400">Histórico rastreável com baixa atômica de saldo</p>
              </div>

              {/* Campo de Busca Rápida */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por código, produto..."
                  value={buscaVenda}
                  onChange={e => setBuscaVenda(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-cyan-500/10 rounded-xl">
              <table className="custom-table text-xs">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Data / Hora</th>
                    <th>Itens do Pedido</th>
                    <th>Pagamento</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendasFiltradasBusca.map(s => {
                    const firstItem = s.itens[0];
                    const prod = firstItem ? produtos.find(p => p.id === firstItem.produtoId) : null;
                    const itemsDesc = firstItem ? `${prod ? prod.nome : 'Item'} (${firstItem.quantidade}x)` : 'Sem itens';
                    return (
                      <tr key={s.id} className="hover:bg-cyan-500/5 transition-colors">
                        <td className="font-mono text-cyan-300 font-bold">{s.codigo}</td>
                        <td className="font-mono text-slate-400 whitespace-nowrap">{s.dataHora}</td>
                        <td className="text-white">
                          <span className="font-medium">{itemsDesc}</span>
                          {s.itens.length > 1 && (
                            <span className="text-[10px] text-cyan-400 ml-1.5 font-mono">
                              +{s.itens.length - 1} item(s)
                            </span>
                          )}
                        </td>
                        <td>{renderBadgePagamento(s.formaPagamento)}</td>
                        <td className="font-mono font-bold text-emerald-400">
                          R$ {s.valorTotal.toFixed(2)}
                        </td>
                        <td>
                          <span className="badge-pill badge-pill-cyan text-[10px] uppercase font-mono">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {vendasFiltradasBusca.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 italic">
                        Nenhuma transação localizada com os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Total apurado no filtro: <strong className="text-white">{vendasFiltradasBusca.length}</strong> vendas</span>
            <span>R$ {vendasFiltradasBusca.reduce((a, b) => a + b.valorTotal, 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendasPage;
