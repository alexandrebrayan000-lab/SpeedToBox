/**
 * StockPro Lots & Expiration Management View
 */

class LotsView {
  constructor() {
    this.container = null;
    this.statusFiltro = 'todos';
    this.searchQuery = '';
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

    const lots = window.dataStore.lots;
    const lotesAtivos = lots.filter(l => l.status === 'normal').length;
    const lotesProximos = lots.filter(l => l.status === 'proximo_vencimento').length;
    const lotesVencidos = lots.filter(l => l.status === 'vencido').length;
    const lotesEsgotados = lots.filter(l => l.status === 'esgotado' || l.quantidade === 0).length;

    let filtered = lots.filter(l => {
      const prod = window.dataStore.products.find(p => p.id === l.produtoId);
      const matchSearch = !this.searchQuery ||
        l.codigoLote.toLowerCase().includes(this.searchQuery) ||
        (prod && prod.nome.toLowerCase().includes(this.searchQuery));

      const matchStatus = this.statusFiltro === 'todos' || l.status === this.statusFiltro;
      return matchSearch && matchStatus;
    });

    this.container.innerHTML = `
      <div class="space-y-6 tab-fade-enter">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#8B35FF]"></span>
              <h1 class="text-2xl font-black text-white tracking-wide" style="font-family: var(--font-display)">Lotes e Validades</h1>
            </div>
            <p class="text-xs text-[#A3B2D1] mt-0.5">Acompanhe os lotes e datas de validade dos seus produtos com controle FIFO.</p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.dataStore.exportToCSV('lotes')" class="btn-cyber-secondary text-xs py-2 px-3.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Exportar Lotes
            </button>
            <button onclick="window.cyberModals.openEntryModal()" class="btn-cyber-primary text-xs py-2 px-3.5">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> + Entrada com Lote
            </button>
          </div>
        </div>

        <!-- 4 KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">Lotes Ativos</span>
              <div class="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <i data-lucide="boxes" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-white tracking-tight">${lotesAtivos}</div>
            <span class="text-[10px] text-cyan-400 font-mono mt-1 block">Dentro do prazo regular</span>
          </div>

          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">Próximos do Vencimento</span>
              <div class="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 ${lotesProximos > 0 ? 'pulse-yellow' : ''}">
                <i data-lucide="clock" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-amber-400 tracking-tight">${lotesProximos}</div>
            <span class="text-[10px] text-amber-300 font-mono mt-1 block">Vencem em até 30 dias</span>
          </div>

          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">Lotes Vencidos</span>
              <div class="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 ${lotesVencidos > 0 ? 'pulse-red' : ''}">
                <i data-lucide="alert-octagon" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-rose-400 tracking-tight">${lotesVencidos}</div>
            <span class="text-[10px] text-rose-400 font-mono mt-1 block">Ação imediata necessária</span>
          </div>

          <div class="cyber-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-[#A3B2D1] uppercase tracking-wider">Sem Saldo / Esgotados</span>
              <div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <i data-lucide="archive" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-300 tracking-tight">${lotesEsgotados}</div>
            <span class="text-[10px] text-slate-500 font-mono mt-1 block">Histórico de lotes consumidos</span>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="cyber-card p-4 flex flex-wrap items-center gap-3">
          <div class="relative flex-1 min-w-[200px]">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
            <input
              type="text"
              placeholder="Filtrar por código do lote ou produto..."
              value="${this.searchQuery}"
              oninput="window.lotsViewInstance.searchQuery = this.value.toLowerCase(); window.lotsViewInstance.render();"
              class="cyber-input pl-9 text-xs"
            />
          </div>

          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400">Status Validade:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.lotsViewInstance.setFilter('statusFiltro', this.value)">
              <option value="todos" ${this.statusFiltro === 'todos' ? 'selected' : ''}>Todos os status</option>
              <option value="normal" ${this.statusFiltro === 'normal' ? 'selected' : ''}>Normal (> 30 dias)</option>
              <option value="proximo_vencimento" ${this.statusFiltro === 'proximo_vencimento' ? 'selected' : ''}>Próximo do vencimento</option>
              <option value="vencido" ${this.statusFiltro === 'vencido' ? 'selected' : ''}>Vencidos</option>
            </select>
          </div>
        </div>

        <!-- Lots Table -->
        <div class="cyber-card p-5">
          <div class="cyber-table-container">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Código do Lote</th>
                  <th>Qtd Disponível</th>
                  <th>Data Entrada</th>
                  <th>Data Validade</th>
                  <th>Dias Restantes</th>
                  <th>Status</th>
                  <th class="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(l => {
                  const prod = window.dataStore.products.find(p => p.id === l.produtoId);
                  const isExp = l.status === 'vencido';
                  const isNear = l.status === 'proximo_vencimento';
                  const days = l.diasRestantes !== undefined ? l.diasRestantes : 0;

                  return `
                    <tr>
                      <td>
                        <div class="font-bold text-white text-xs">${prod ? prod.nome : 'Produto Desconhecido'}</div>
                        <span class="text-[10px] text-slate-400 font-mono">${prod ? prod.categoria : ''}</span>
                      </td>
                      <td class="font-mono text-xs font-semibold text-cyan-400">${l.codigoLote}</td>
                      <td class="font-mono text-xs font-bold text-white">${l.quantidade} un</td>
                      <td class="font-mono text-xs text-slate-400">${window.dataStore.formatDate(l.dataEntrada)}</td>
                      <td class="font-mono text-xs font-semibold ${isExp ? 'text-rose-400' : (isNear ? 'text-amber-400' : 'text-slate-300')}">
                        ${window.dataStore.formatDate(l.dataValidade)}
                      </td>
                      <td>
                        <div class="flex items-center gap-2">
                          <span class="font-mono text-xs font-bold ${isExp ? 'text-rose-400' : (isNear ? 'text-amber-400' : 'text-emerald-400')}">
                            ${isExp ? `Vencido há ${Math.abs(days)}d` : `${days} dias`}
                          </span>
                        </div>
                        <div class="w-20 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                          <div class="h-1 rounded-full ${isExp ? 'bg-rose-500' : (isNear ? 'bg-amber-400' : 'bg-emerald-400')}" style="width: ${Math.min(100, Math.max(5, (days / 90) * 100))}%"></div>
                        </div>
                      </td>
                      <td>
                        ${isExp ? `
                          <span class="badge-neon badge-danger text-[10px]">Vencido</span>
                        ` : isNear ? `
                          <span class="badge-neon badge-warning text-[10px]">Vencendo</span>
                        ` : `
                          <span class="badge-neon badge-success text-[10px]">Normal</span>
                        `}
                      </td>
                      <td class="text-right">
                        ${isExp ? `
                          <button
                            onclick="window.cyberModals.openExitModal('${l.produtoId}');"
                            class="px-2 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold hover:bg-rose-500/30 transition"
                          >
                            Descartar
                          </button>
                        ` : isNear ? `
                          <button
                            onclick="window.cyberModals.openNewSaleModal();"
                            class="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold hover:bg-amber-500/30 transition"
                          >
                            Liquidar
                          </button>
                        ` : `
                          <button
                            onclick="window.cyberToast.info('Lote auditado em perfeitas condições.');"
                            class="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] hover:text-white transition"
                          >
                            Auditar
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }
  }
}

window.LotsView = LotsView;
