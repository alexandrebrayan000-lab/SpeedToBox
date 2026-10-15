/**
 * StockPro Dashboard View — Compact Futuristic Overview (NO BANNER)
 */

class DashboardView {
  constructor() {
    this.container = null;
    this.periodo = '30d';
    this.movementChart = null;
    this.categoryChart = null;
  }

  setPeriodo(periodo) {
    this.periodo = periodo;
    this.render();
  }

  renderTo(element) {
    this.container = element;
    this.render();
  }

  render() {
    if (!this.container) return;

    const metrics = window.dataStore.getDashboardMetrics(this.periodo);
    const recentMovements = window.dataStore.movements.slice(0, 5);
    const recentAlerts = window.dataStore.alerts.slice(0, 3);

    // Compute category counts
    const categoryCounts = {};
    window.dataStore.products.forEach(p => {
      categoryCounts[p.categoria] = (categoryCounts[p.categoria] || 0) + 1;
    });

    this.container.innerHTML = `
      <div class="space-y-6 tab-fade-enter">
        <!-- Compact Header (NO BANNER) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
              <h1 class="text-2xl font-black text-white tracking-wide" style="font-family: var(--font-display)">Visão geral</h1>
            </div>
            <p class="text-xs text-[#A3B2D1] mt-0.5">Acompanhe o desempenho do seu estoque em tempo real.</p>
          </div>

          <!-- Period Selector & Quick Actions -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="bg-[#0B1228] p-1 rounded-xl border border-[#168BFF]/25 flex items-center gap-1 text-xs">
              <button onclick="window.dashboardViewInstance.setPeriodo('hoje')" class="px-2.5 py-1 rounded-lg transition-all ${this.periodo === 'hoje' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}">Hoje</button>
              <button onclick="window.dashboardViewInstance.setPeriodo('7d')" class="px-2.5 py-1 rounded-lg transition-all ${this.periodo === '7d' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}">7 dias</button>
              <button onclick="window.dashboardViewInstance.setPeriodo('30d')" class="px-2.5 py-1 rounded-lg transition-all ${this.periodo === '30d' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}">30 dias</button>
            </div>

            <button onclick="window.cyberModals.openNewSaleModal()" class="btn-cyber-primary text-xs py-2 px-3.5">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Nova Venda
            </button>
          </div>
        </div>

        <!-- 4 Animated KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Total de Produtos -->
          <div
            onclick="window.appSidebar.setTab('produtos')"
            class="cyber-card p-5 cursor-pointer group hover:border-cyan-400/50"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">Total de Produtos</span>
              <div class="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <i data-lucide="package" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="flex items-baseline justify-between">
              <div class="text-3xl font-extrabold text-white tracking-tight" id="count-total-produtos">
                ${metrics.totalProdutos}
              </div>
              <span class="badge-neon badge-success text-[11px]">
                <i data-lucide="trending-up" class="w-3 h-3"></i> ${metrics.variacaoProdutos}
              </span>
            </div>
            <div class="mt-3 flex items-center justify-between text-[11px] text-[#A3B2D1]/70 border-t border-slate-800/80 pt-2">
              <span>Catálogo cadastrado</span>
              <span class="text-cyan-400 group-hover:underline">Gerenciar ➔</span>
            </div>
          </div>

          <!-- Card 2: Em Estoque -->
          <div
            onclick="window.appSidebar.setTab('produtos')"
            class="cyber-card p-5 cursor-pointer group hover:border-emerald-400/50"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">Em Estoque</span>
              <div class="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <i data-lucide="boxes" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="flex items-baseline justify-between">
              <div class="text-3xl font-extrabold text-white tracking-tight" id="count-total-estoque">
                ${metrics.totalEmEstoque}
              </div>
              <span class="badge-neon badge-success text-[11px]">
                <i data-lucide="trending-up" class="w-3 h-3"></i> ${metrics.variacaoEstoque}
              </span>
            </div>
            <div class="mt-3 flex items-center justify-between text-[11px] text-[#A3B2D1]/70 border-t border-slate-800/80 pt-2">
              <span>Unidades físicas totais</span>
              <span class="text-emerald-400 group-hover:underline">Conferir ➔</span>
            </div>
          </div>

          <!-- Card 3: Estoque Baixo -->
          <div
            onclick="window.appSidebar.setTab('alertas')"
            class="cyber-card p-5 cursor-pointer group hover:border-rose-400/50"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">Estoque Baixo</span>
              <div class="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform ${metrics.produtosEstoqueBaixo > 0 ? 'pulse-red' : ''}">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="flex items-baseline justify-between">
              <div class="text-3xl font-extrabold text-rose-400 tracking-tight" id="count-estoque-baixo">
                ${metrics.produtosEstoqueBaixo}
              </div>
              <span class="badge-neon badge-danger text-[11px]">
                ${metrics.variacaoEstoqueBaixo} atenção
              </span>
            </div>
            <div class="mt-3 flex items-center justify-between text-[11px] text-[#A3B2D1]/70 border-t border-slate-800/80 pt-2">
              <span>Itens no nível de alerta</span>
              <span class="text-rose-400 group-hover:underline">Reabastecer ➔</span>
            </div>
          </div>

          <!-- Card 4: Vendas no Período -->
          <div
            onclick="window.appSidebar.setTab('vendas')"
            class="cyber-card p-5 cursor-pointer group hover:border-purple-400/50"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">Vendas no Período</span>
              <div class="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="flex items-baseline justify-between">
              <div class="text-2xl font-extrabold text-white tracking-tight" id="count-vendas-periodo">
                ${window.dataStore.formatCurrency(metrics.totalVendasPeriodo)}
              </div>
              <span class="badge-neon badge-purple text-[11px]">
                ${metrics.totalQtdVendas} vendas
              </span>
            </div>
            <div class="mt-3 flex items-center justify-between text-[11px] text-[#A3B2D1]/70 border-t border-slate-800/80 pt-2">
              <span>Análise completa na aba Vendas</span>
              <span class="text-purple-400 group-hover:underline">Gráficos ➔</span>
            </div>
          </div>
        </div>

        <!-- Middle Row: 7-Day Movements + Category Donut -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Movimentações nos últimos 7 dias (2 cols) -->
          <div class="cyber-card p-5 lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Movimentações nos Últimos 7 Dias</h3>
                <p class="text-xs text-slate-400">Fluxo comparativo de Entradas vs Saídas</p>
              </div>
              <div class="flex items-center gap-4 text-xs font-semibold">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00D9FF]"></span>
                  <span class="text-slate-300">Entradas</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_#8B35FF]"></span>
                  <span class="text-slate-300">Saídas</span>
                </div>
              </div>
            </div>

            <div class="h-64 relative w-full">
              <canvas id="overview-movement-chart"></canvas>
            </div>
          </div>

          <!-- Categorias (1 col) -->
          <div class="cyber-card p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-sm font-bold text-white tracking-wide">Categorias</h3>
                  <p class="text-xs text-slate-400">Distribuição do catálogo por setor</p>
                </div>
                <span class="badge-neon badge-blue text-[11px]">${Object.keys(categoryCounts).length} setores</span>
              </div>

              <div class="h-48 relative flex items-center justify-center">
                <canvas id="overview-category-chart"></canvas>
              </div>
            </div>

            <!-- Categories Legend Table -->
            <div class="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              ${Object.entries(categoryCounts).slice(0, 4).map(([cat, count], idx) => {
                const colors = ['#00D9FF', '#8B35FF', '#F32BFF', '#00E6A0'];
                const pct = ((count / metrics.totalProdutos) * 100).toFixed(0);
                return `
                  <div class="flex items-center justify-between text-slate-300">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full" style="background: ${colors[idx % colors.length]}"></span>
                      <span>${cat}</span>
                    </div>
                    <span class="font-mono text-slate-400">${count} itens (${pct}%)</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Bottom Row: Recent Movements Table & Active Alerts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Movements Table (2 cols) -->
          <div class="cyber-card p-5 lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Movimentações Recentes</h3>
                <p class="text-xs text-slate-400">Últimos registros operacionais no armazém</p>
              </div>
              <button onclick="window.appSidebar.setTab('movimentacoes')" class="text-xs text-cyan-400 hover:underline font-semibold">
                Ver todas ➔
              </button>
            </div>

            <div class="cyber-table-container">
              <table class="cyber-table">
                <thead>
                  <tr>
                    <th>Data / Hora</th>
                    <th>Produto</th>
                    <th>Tipo</th>
                    <th>Qtd</th>
                    <th>Motivo</th>
                    <th>Resp.</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentMovements.map(m => {
                    const prod = window.dataStore.products.find(p => p.id === m.produtoId);
                    const isEntry = m.tipo === 'entrada' || m.tipo === 'devolucao';
                    return `
                      <tr>
                        <td class="font-mono text-xs text-slate-400">${m.dataHora}</td>
                        <td class="font-medium text-white">${prod ? prod.nome : m.produtoId}</td>
                        <td>
                          <span class="badge-neon ${isEntry ? 'badge-success' : 'badge-danger'}">
                            ${isEntry ? '+' : '-'} ${m.tipo.toUpperCase()}
                          </span>
                        </td>
                        <td class="font-mono font-bold ${isEntry ? 'text-emerald-400' : 'text-rose-400'}">
                          ${isEntry ? `+${m.quantidade}` : `-${m.quantidade}`}
                        </td>
                        <td class="text-slate-300 text-xs">${m.motivo}</td>
                        <td class="text-slate-400 text-xs">${m.usuario}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Priority Active Alerts (1 col) -->
          <div class="cyber-card p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold text-white tracking-wide">Alertas Recentes</h3>
                <p class="text-xs text-slate-400">Avisos prioritários do sistema</p>
              </div>
              <button onclick="window.appSidebar.setTab('alertas')" class="text-xs text-cyan-400 hover:underline font-semibold">
                Ver todos (${window.dataStore.alerts.length})
              </button>
            </div>

            <div class="space-y-3">
              ${recentAlerts.length === 0 ? `
                <div class="p-6 text-center text-xs text-slate-400">Nenhum alerta pendente no momento.</div>
              ` : recentAlerts.map(a => `
                <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    a.prioridade === 'alta' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }">
                    <i data-lucide="${a.tipo === 'vencido' ? 'x-circle' : (a.tipo === 'proximo_vencimento' ? 'clock' : 'alert-triangle')}" class="w-4 h-4"></i>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-white">${a.titulo}</span>
                      <span class="text-[10px] text-slate-500">${a.data}</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-0.5">${a.detalhe}</p>
                    <div class="mt-2 flex items-center justify-between">
                      <span class="text-[10px] text-purple-300 font-semibold">${a.acao}</span>
                      <button
                        onclick="window.appSidebar.setTab('${a.tipo === 'estoque_baixo' ? 'produtos' : 'lotes'}')"
                        class="text-[11px] text-cyan-400 hover:underline font-semibold"
                      >
                        Acessar ➔
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }

    this.renderCharts();
  }

  renderCharts() {
    if (!window.Chart) return;

    // Movement Line Chart (Entradas vs Saídas)
    const movCtx = document.getElementById('overview-movement-chart');
    if (movCtx) {
      if (this.movementChart) this.movementChart.destroy();

      const days = ['09/10', '10/10', '11/10', '12/10', '13/10', '14/10', '15/10'];
      const entradasData = [35, 60, 45, 55, 40, 70, 50];
      const saidasData = [20, 30, 25, 45, 30, 50, 28];

      this.movementChart = new Chart(movCtx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [
            {
              label: 'Entradas',
              data: entradasData,
              borderColor: '#00D9FF',
              backgroundColor: 'rgba(0, 217, 255, 0.12)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: '#00D9FF',
              pointBorderColor: '#050816',
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Saídas',
              data: saidasData,
              borderColor: '#8B35FF',
              backgroundColor: 'rgba(139, 53, 255, 0.12)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: '#8B35FF',
              pointBorderColor: '#050816',
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0B1228',
              borderColor: '#168BFF',
              borderWidth: 1,
              titleColor: '#00D9FF',
              bodyColor: '#F4F7FF',
              padding: 10,
              cornerRadius: 8
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(22, 139, 255, 0.08)' },
              ticks: { color: '#64748B', font: { size: 10 } }
            },
            y: {
              grid: { color: 'rgba(22, 139, 255, 0.08)' },
              ticks: { color: '#64748B', font: { size: 10 } }
            }
          }
        }
      });
    }

    // Category Donut Chart
    const catCtx = document.getElementById('overview-category-chart');
    if (catCtx) {
      if (this.categoryChart) this.categoryChart.destroy();

      const categoryCounts = {};
      window.dataStore.products.forEach(p => {
        categoryCounts[p.categoria] = (categoryCounts[p.categoria] || 0) + 1;
      });

      const labels = Object.keys(categoryCounts);
      const data = Object.values(categoryCounts);

      this.categoryChart = new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#00D9FF', '#8B35FF', '#F32BFF', '#00E6A0', '#FFBF3F'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0B1228',
              borderColor: '#8B35FF',
              borderWidth: 1,
              cornerRadius: 8
            }
          }
        }
      });
    }
  }
}

window.DashboardView = DashboardView;
