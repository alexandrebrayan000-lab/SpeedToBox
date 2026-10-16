/**
 * StockPro Dedicated Sales & Analytics View
 * Houses all major commercial charts: Top Sellers, Stock Exits Breakdown,
 * Revenue Timeline, Revenue by Product Ranking, Category Doughnut, and Sales Ledger.
 */

class SalesView {
  constructor() {
    this.container = null;
    this.periodo = '30d';
    this.filtroCategoria = 'todas';
    this.filtroProduto = 'todos';
    this.timelineMode = 'line'; // 'line' | 'bar' | 'table'
    this.chartTopSellers = null;
    this.chartExits = null;
    this.chartTimeline = null;
    this.chartCategories = null;
  }

  setTimelineMode(mode) {
    if (this.timelineMode === mode) return;
    this.timelineMode = mode;
    this.render();
  }

  setFilter(key, val) {
    this[key] = val;
    this.render();
  }

  renderTo(element) {
    this.container = element;
    this.render();
  }

  render() {
    if (!this.container) return;

    const analytics = window.dataStore.getSalesAnalytics(this.periodo, this.filtroCategoria, this.filtroProduto);
    const categories = ['todas', 'Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Padaria'];

    this.container.innerHTML = `
      <div class="space-y-6 tab-fade-enter">
        <!-- Page Header -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#8B35FF]"></span>
              <h1 class="text-2xl font-black text-white tracking-wide" style="font-family: var(--font-display)">Vendas e Desempenho</h1>
            </div>
            <p class="text-xs text-[#A3B2D1] mt-0.5">Descubra quais produtos vendem mais, movimentam seu estoque e geram receita.</p>
          </div>

          <!-- Action & Export Controls -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="window.dataStore.exportToCSV('vendas')" class="btn-cyber-secondary text-xs py-2 px-3.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Exportar Relatório
            </button>
            <button onclick="window.cyberModals.openNewSaleModal()" class="btn-cyber-primary text-xs py-2 px-3.5">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> + Nova Venda
            </button>
          </div>
        </div>

        <!-- Global Filters Bar -->
        <div class="cyber-card p-4 flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <i data-lucide="filter" class="w-4 h-4 text-cyan-400"></i>
            <span class="text-xs font-bold text-white uppercase tracking-wider">Filtros:</span>
          </div>

          <!-- Period Filter -->
          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400">Período:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.salesViewInstance.setFilter('periodo', this.value)">
              <option value="hoje" ${this.periodo === 'hoje' ? 'selected' : ''}>Hoje</option>
              <option value="7d" ${this.periodo === '7d' ? 'selected' : ''}>Últimos 7 dias</option>
              <option value="30d" ${this.periodo === '30d' ? 'selected' : ''}>Últimos 30 dias</option>
              <option value="ano" ${this.periodo === 'ano' ? 'selected' : ''}>Ano Atual</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400">Categoria:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.salesViewInstance.setFilter('filtroCategoria', this.value)">
              ${categories.map(c => `
                <option value="${c}" ${this.filtroCategoria === c ? 'selected' : ''}>
                  ${c === 'todas' ? 'Todas as Categorias' : c}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Exits Filter Mode -->
          <div class="flex items-center gap-1.5 ml-auto">
            <label class="text-xs text-slate-400">Saídas:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.salesViewInstance.setFilter('tipoSaidas', this.value)">
              <option value="todas" ${this.tipoSaidas === 'todas' ? 'selected' : ''}>Todas as Saídas (Vendas + Perdas)</option>
              <option value="vendas_apenas" ${this.tipoSaidas === 'vendas_apenas' ? 'selected' : ''}>Apenas Vendas Comerciais</option>
            </select>
          </div>
        </div>

        <!-- 5 Sales KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- KPI 1: Faturamento Total -->
          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Faturamento Total</span>
              <div class="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <i data-lucide="dollar-sign" class="w-3.5 h-3.5"></i>
              </div>
            </div>
            <div class="text-xl font-black text-white tracking-tight">
              ${window.dataStore.formatCurrency(analytics.faturamentoTotal)}
            </div>
            <span class="text-[10px] text-emerald-400 font-mono mt-1 block">+18.4% vs período anterior</span>
          </div>

          <!-- KPI 2: Unidades Vendidas -->
          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Unidades Vendidas</span>
              <div class="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <i data-lucide="layers" class="w-3.5 h-3.5"></i>
              </div>
            </div>
            <div class="text-xl font-black text-white tracking-tight">
              ${analytics.totalUnidadesVendidas} un
            </div>
            <span class="text-[10px] text-cyan-400 font-mono mt-1 block">Volume comercial</span>
          </div>

          <!-- KPI 3: Número de Vendas -->
          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Número de Vendas</span>
              <div class="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
              </div>
            </div>
            <div class="text-xl font-black text-white tracking-tight">
              ${analytics.totalVendas} pedidos
            </div>
            <span class="text-[10px] text-slate-400 font-mono mt-1 block">Transações concluídas</span>
          </div>

          <!-- KPI 4: Ticket Médio -->
          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Ticket Médio</span>
              <div class="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
              </div>
            </div>
            <div class="text-xl font-black text-emerald-400 tracking-tight">
              ${window.dataStore.formatCurrency(analytics.ticketMedio)}
            </div>
            <span class="text-[10px] text-slate-400 font-mono mt-1 block">Média por pedido</span>
          </div>

          <!-- KPI 5: Produto Mais Vendido -->
          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-semibold text-[#A3B2D1] uppercase tracking-wider">Top Produto</span>
              <div class="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <i data-lucide="award" class="w-3.5 h-3.5"></i>
              </div>
            </div>
            <div class="text-sm font-bold text-white truncate" title="${analytics.produtoMaisVendido.nome}">
              ${analytics.produtoMaisVendido.nome}
            </div>
            <span class="text-[10px] text-amber-400 font-mono mt-1 block">
              ${analytics.produtoMaisVendido.quantidade} un (${window.dataStore.formatCurrency(analytics.produtoMaisVendido.faturamento)})
            </span>
          </div>
        </div>

        <!-- Charts Row 1: Top 10 Mais Vendidos (Horizontal Bar) & Faturamento ao longo do tempo (Line) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Gráfico 1: Produtos Mais Vendidos -->
          <div class="cyber-card p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Produtos Mais Vendidos</h3>
                <p class="text-xs text-slate-400">Quantidade de unidades vendidas no período</p>
              </div>
              <button
                onclick="window.salesViewInstance.setFilter('showAllTop', !window.salesViewInstance.showAllTop)"
                class="text-xs text-cyan-400 hover:underline font-semibold"
              >
                ${this.showAllTop ? 'Ver Top 5' : 'Ver Todos'}
              </button>
            </div>

            <div class="h-72 relative w-full">
              <canvas id="sales-top-sellers-chart"></canvas>
            </div>
          </div>

          <!-- Gráfico 3: Faturamento ao longo do tempo with Mode Switcher -->
          <div class="cyber-card p-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Faturamento ao Longo do Tempo</h3>
                <p class="text-xs text-slate-400">Evolução da receita com alternância de visualização</p>
              </div>

              <!-- VIEW MODE SWITCHER: Linha (Crescente) vs Barras vs Tabela -->
              <div class="chart-toggle-group">
                <button
                  onclick="window.salesViewInstance.setTimelineMode('line')"
                  class="chart-toggle-btn ${this.timelineMode === 'line' ? 'active' : ''}"
                  title="Gráfico de Linha / Tendência Crescente"
                >
                  <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
                  <span>Linha</span>
                </button>

                <button
                  onclick="window.salesViewInstance.setTimelineMode('bar')"
                  class="chart-toggle-btn ${this.timelineMode === 'bar' ? 'active' : ''}"
                  title="Gráfico de Barras"
                >
                  <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
                  <span>Barras</span>
                </button>

                <button
                  onclick="window.salesViewInstance.setTimelineMode('table')"
                  class="chart-toggle-btn ${this.timelineMode === 'table' ? 'active' : ''}"
                  title="Tabela de Dados"
                >
                  <i data-lucide="table" class="w-3.5 h-3.5"></i>
                  <span>Tabela</span>
                </button>
              </div>
            </div>

            <!-- Content Area: Switch between Chart Canvas or Data Table -->
            ${this.timelineMode === 'table' ? `
              <div class="cyber-table-container max-h-72 overflow-y-auto">
                <table class="cyber-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Faturamento (R$)</th>
                      <th>Pedidos</th>
                      <th>Média / Pedido</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${analytics.revenueTimeline.map(t => {
                      const avg = t.pedidos > 0 ? t.faturamento / t.pedidos : 0;
                      return `
                        <tr>
                          <td class="font-mono text-xs font-semibold text-white">${t.data}</td>
                          <td class="font-mono text-purple-300 font-bold">${window.dataStore.formatCurrency(t.faturamento)}</td>
                          <td class="font-mono text-cyan-400 font-bold">${t.pedidos} ped.</td>
                          <td class="font-mono text-slate-300">${window.dataStore.formatCurrency(avg)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            ` : `
              <div class="h-72 relative w-full">
                <canvas id="sales-timeline-chart"></canvas>
              </div>
            `}
          </div>
        </div>

        <!-- Charts Row 2: Produtos que mais saíram (Distinção de motivos) & Categorias (Rosca) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Gráfico 2: Produtos que mais saíram do estoque (2 cols) -->
          <div class="cyber-card p-5 lg:col-span-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Produtos que Mais Saíram do Estoque</h3>
                <p class="text-xs text-slate-400">Diferenciação clara: Venda vs Perda vs Avaria vs Outros</p>
              </div>
              <div class="flex items-center gap-3 text-xs">
                <span class="flex items-center gap-1 text-cyan-400"><span class="w-2.5 h-2.5 bg-cyan-400 rounded-sm"></span> Venda</span>
                <span class="flex items-center gap-1 text-rose-400"><span class="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> Perda</span>
                <span class="flex items-center gap-1 text-amber-400"><span class="w-2.5 h-2.5 bg-amber-400 rounded-sm"></span> Avaria</span>
              </div>
            </div>

            <div class="h-64 relative w-full">
              <canvas id="sales-exits-chart"></canvas>
            </div>
          </div>

          <!-- Gráfico 5: Categorias Mais Vendidas (1 col) -->
          <div class="cyber-card p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="text-sm font-bold text-white tracking-wide">Participação por Categoria</h3>
                  <p class="text-xs text-slate-400">Faturamento gerado por cada setor</p>
                </div>
              </div>

              <div class="h-44 relative flex items-center justify-center">
                <canvas id="sales-category-doughnut"></canvas>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              ${analytics.categoriesArray.map(cat => `
                <div class="flex items-center justify-between text-slate-300">
                  <span>${cat.nome}</span>
                  <div class="flex items-center gap-2 font-mono">
                    <span class="text-white">${window.dataStore.formatCurrency(cat.faturamento)}</span>
                    <span class="text-cyan-400 font-bold">(${cat.percentual}%)</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Ranking de Faturamento por Produto & Tabela de Vendas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Gráfico 4 / Ranking: Faturamento por Produto (1 col) -->
          <div class="cyber-card p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Ranking por Faturamento</h3>
                <p class="text-xs text-slate-400">Itens que mais geraram receita líquida</p>
              </div>
              <i data-lucide="trophy" class="w-4 h-4 text-amber-400"></i>
            </div>

            <div class="space-y-3">
              ${analytics.rankingFaturamento.slice(0, 5).map((item, idx) => `
                <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 transition flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">
                      #${idx + 1}
                    </span>
                    <div>
                      <p class="text-xs font-bold text-white truncate max-w-[130px]">${item.nome}</p>
                      <span class="text-[10px] text-slate-400 font-mono">${item.quantidade} unidades vendidas</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-mono font-bold text-cyan-400">${window.dataStore.formatCurrency(item.faturamento)}</p>
                    <span class="text-[10px] text-purple-300 font-mono">${item.participacao}% do total</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tabela de Vendas Recentes (2 cols) -->
          <div class="cyber-card p-5 lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Registro de Vendas</h3>
                <p class="text-xs text-slate-400">Transações comerciais auditadas</p>
              </div>
              <span class="badge-neon badge-blue text-[11px]">${analytics.filteredSales.length} registros</span>
            </div>

            <div class="cyber-table-container">
              <table class="cyber-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Data / Hora</th>
                    <th>Itens</th>
                    <th>Pagamento</th>
                    <th>Valor Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${analytics.filteredSales.map(s => {
                    const firstItem = s.itens[0];
                    const prod = firstItem ? window.dataStore.products.find(p => p.id === firstItem.produtoId) : null;
                    const itemsDesc = firstItem ? `${prod ? prod.nome : 'Item'} (${firstItem.quantidade}x)` : 'Sem itens';
                    return `
                      <tr>
                        <td class="font-mono text-xs font-bold text-cyan-400">${s.codigo}</td>
                        <td class="font-mono text-xs text-slate-400">${s.dataHora}</td>
                        <td class="text-xs text-white">${itemsDesc} ${s.itens.length > 1 ? `+${s.itens.length - 1} item(s)` : ''}</td>
                        <td class="text-xs text-slate-300">${s.formaPagamento}</td>
                        <td class="font-mono text-xs font-bold text-emerald-400">${window.dataStore.formatCurrency(s.valorTotal)}</td>
                        <td>
                          <span class="badge-neon badge-success text-[10px]">
                            ${s.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }

    this.renderCharts(analytics);
  }

  renderCharts(analytics) {
    if (!window.Chart) return;

    // Gráfico 1: Top Sellers (Horizontal Bar)
    const topCtx = document.getElementById('sales-top-sellers-chart');
    if (topCtx) {
      if (this.chartTopSellers) this.chartTopSellers.destroy();

      const items = this.showAllTop ? analytics.rankingMaisVendidos : analytics.rankingMaisVendidos.slice(0, 6);
      const labels = items.map(i => i.nome.length > 22 ? i.nome.slice(0, 20) + '...' : i.nome);
      const dataQtd = items.map(i => i.quantidade);

      this.chartTopSellers = new Chart(topCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Unidades Vendidas',
            data: dataQtd,
            backgroundColor: 'rgba(0, 217, 255, 0.75)',
            borderColor: '#00D9FF',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0B1228',
              borderColor: '#00D9FF',
              borderWidth: 1,
              titleColor: '#00D9FF',
              bodyColor: '#F4F7FF',
              callbacks: {
                label: (ctx) => {
                  const item = items[ctx.dataIndex];
                  return [
                    `Quantidade: ${item.quantidade} un`,
                    `Faturamento: ${window.dataStore.formatCurrency(item.faturamento)}`,
                    `Participação: ${item.participacao}% das vendas`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(22, 139, 255, 0.08)' },
              ticks: { color: '#64748B', font: { size: 10 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#F4F7FF', font: { size: 10 } }
            }
          }
        }
      });
    }

    // Gráfico 3: Timeline de Faturamento (Line | Bar | Table)
    const timeCtx = document.getElementById('sales-timeline-chart');
    if (this.timelineMode === 'table') {
      if (this.chartTimeline) {
        this.chartTimeline.destroy();
        this.chartTimeline = null;
      }
    } else if (timeCtx) {
      if (this.chartTimeline) this.chartTimeline.destroy();

      const timeline = analytics.revenueTimeline;
      const isLine = this.timelineMode === 'line';

      this.chartTimeline = new Chart(timeCtx, {
        type: isLine ? 'line' : 'bar',
        data: {
          labels: timeline.map(t => t.data),
          datasets: [{
            label: 'Faturamento (R$)',
            data: timeline.map(t => t.faturamento),
            borderColor: '#8B35FF',
            backgroundColor: isLine ? 'rgba(139, 53, 255, 0.18)' : 'rgba(139, 53, 255, 0.75)',
            fill: isLine,
            tension: 0.4,
            borderWidth: isLine ? 2.5 : 1,
            borderRadius: isLine ? 0 : 6,
            pointBackgroundColor: '#00D9FF',
            pointBorderColor: '#8B35FF',
            pointRadius: isLine ? 4 : 0,
            pointHoverRadius: isLine ? 7 : 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0B1228',
              borderColor: '#8B35FF',
              borderWidth: 1,
              callbacks: {
                label: (ctx) => `Receita: ${window.dataStore.formatCurrency(ctx.parsed.y)}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(22, 139, 255, 0.08)' },
              ticks: { color: '#64748B', font: { size: 10 } }
            },
            y: {
              grid: { color: 'rgba(22, 139, 255, 0.08)' },
              ticks: {
                color: '#64748B',
                font: { size: 10 },
                callback: (val) => 'R$ ' + val
              }
            }
          }
        }
      });
    }

    // Gráfico 2: Produtos que mais saíram (Stacked Bar)
    const exitCtx = document.getElementById('sales-exits-chart');
    if (exitCtx) {
      if (this.chartExits) this.chartExits.destroy();

      const exits = analytics.rankingSaidas.slice(0, 6);
      const labels = exits.map(e => e.nome.length > 18 ? e.nome.slice(0, 16) + '...' : e.nome);

      this.chartExits = new Chart(exitCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Vendas',
              data: exits.map(e => e.vendas),
              backgroundColor: '#00D9FF',
              borderRadius: 4
            },
            {
              label: 'Perdas / Vencidos',
              data: exits.map(e => e.perdas),
              backgroundColor: '#FF3864',
              borderRadius: 4
            },
            {
              label: 'Avarias',
              data: exits.map(e => e.avarias),
              backgroundColor: '#FFBF3F',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: { color: '#F4F7FF', font: { size: 10 } }
            },
            y: {
              stacked: true,
              grid: { color: 'rgba(22, 139, 255, 0.08)' },
              ticks: { color: '#64748B', font: { size: 10 } }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0B1228',
              borderColor: '#168BFF',
              borderWidth: 1
            }
          }
        }
      });
    }

    // Gráfico 5: Categorias Doughnut
    const catCtx = document.getElementById('sales-category-doughnut');
    if (catCtx) {
      if (this.chartCategories) this.chartCategories.destroy();

      const cats = analytics.categoriesArray;
      this.chartCategories = new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels: cats.map(c => c.nome),
          datasets: [{
            data: cats.map(c => c.faturamento),
            backgroundColor: ['#8B35FF', '#00D9FF', '#F32BFF', '#00E6A0', '#FFBF3F'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0B1228',
              borderColor: '#F32BFF',
              borderWidth: 1,
              callbacks: {
                label: (ctx) => `${ctx.label}: ${window.dataStore.formatCurrency(ctx.parsed)}`
              }
            }
          }
        }
      });
    }
  }
}

window.SalesView = SalesView;
