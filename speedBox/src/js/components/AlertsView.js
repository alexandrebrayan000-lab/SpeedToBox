/**
 * StockPro Alerts Center View
 */

class AlertsView {
  constructor() {
    this.container = null;
    this.prioridadeFiltro = 'todas';
    this.tipoFiltro = 'todos';
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

    const alerts = window.dataStore.alerts;
    const criticos = alerts.filter(a => a.prioridade === 'alta').length;
    const atencao = alerts.filter(a => a.prioridade === 'media').length;
    const informativos = alerts.filter(a => a.prioridade === 'baixa').length;

    let filtered = alerts.filter(a => {
      const matchPrio = this.prioridadeFiltro === 'todas' || a.prioridade === this.prioridadeFiltro;
      const matchTipo = this.tipoFiltro === 'todos' || a.tipo === this.tipoFiltro;
      return matchPrio && matchTipo;
    });

    this.container.innerHTML = `
      <div class="space-y-6 tab-fade-enter">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#FF3864]"></span>
              <h1 class="text-2xl font-black text-white tracking-wide" style="font-family: var(--font-display)">Central de Alertas</h1>
            </div>
            <p class="text-xs text-[#A3B2D1] mt-0.5">Monitore riscos operacionais, estoques críticos e lotes vencidos.</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              onclick="window.cyberToast.success('Todos os alertas marcados como revisados.');"
              class="btn-cyber-secondary text-xs py-2 px-3.5"
            >
              <i data-lucide="check-check" class="w-3.5 h-3.5"></i> Marcar Todos como Lidos
            </button>
          </div>
        </div>

        <!-- 3 Severity Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="cyber-card p-4 border-rose-500/30">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-rose-300 uppercase tracking-wider">Críticos (Ação Imediata)</span>
              <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center pulse-red">
                <i data-lucide="alert-octagon" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-rose-400">${criticos}</div>
            <span class="text-[10px] text-slate-400 mt-1 block">Produtos vencidos ou estoque zerado</span>
          </div>

          <div class="cyber-card p-4 border-amber-500/30">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-amber-300 uppercase tracking-wider">Atenção Necessária</span>
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center pulse-yellow">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-amber-400">${atencao}</div>
            <span class="text-[10px] text-slate-400 mt-1 block">Vencimentos nos próximos 30 dias</span>
          </div>

          <div class="cyber-card p-4 border-cyan-500/30">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Operacionais & Info</span>
              <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <i data-lucide="info" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-cyan-400">${informativos}</div>
            <span class="text-[10px] text-slate-400 mt-1 block">Avisos e sugestões de abastecimento</span>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="cyber-card p-4 flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400">Prioridade:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.alertsViewInstance.setFilter('prioridadeFiltro', this.value)">
              <option value="todas" ${this.prioridadeFiltro === 'todas' ? 'selected' : ''}>Todas as prioridades</option>
              <option value="alta" ${this.prioridadeFiltro === 'alta' ? 'selected' : ''}>Alta (Crítico)</option>
              <option value="media" ${this.prioridadeFiltro === 'media' ? 'selected' : ''}>Média (Atenção)</option>
              <option value="baixa" ${this.prioridadeFiltro === 'baixa' ? 'selected' : ''}>Baixa (Info)</option>
            </select>
          </div>

          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400">Tipo de Alerta:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.alertsViewInstance.setFilter('tipoFiltro', this.value)">
              <option value="todos" ${this.tipoFiltro === 'todos' ? 'selected' : ''}>Todos os tipos</option>
              <option value="vencido" ${this.tipoFiltro === 'vencido' ? 'selected' : ''}>Produtos Vencidos</option>
              <option value="proximo_vencimento" ${this.tipoFiltro === 'proximo_vencimento' ? 'selected' : ''}>Próximos do Vencimento</option>
              <option value="estoque_baixo" ${this.tipoFiltro === 'estoque_baixo' ? 'selected' : ''}>Estoque Baixo</option>
            </select>
          </div>
        </div>

        <!-- Alert Items List -->
        <div class="space-y-3">
          ${filtered.length === 0 ? `
            <div class="cyber-card p-12 text-center">
              <i data-lucide="check-circle" class="w-12 h-12 text-emerald-400 mx-auto mb-3"></i>
              <h3 class="text-base font-bold text-white">Nenhum alerta pendente</h3>
              <p class="text-xs text-slate-400 mt-1">Todos os níveis de estoque e prazos de validade estão em conformidade.</p>
            </div>
          ` : filtered.map(a => {
            const isCritical = a.prioridade === 'alta';
            return `
              <div class="cyber-card p-4 hover:border-cyan-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }">
                    <i data-lucide="${a.tipo === 'vencido' ? 'alert-octagon' : (a.tipo === 'proximo_vencimento' ? 'clock' : 'package-x')}" class="w-5 h-5"></i>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-white">${a.titulo}</span>
                      <span class="badge-neon ${isCritical ? 'badge-danger' : 'badge-warning'} text-[10px]">
                        ${a.prioridade.toUpperCase()}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 font-semibold mt-0.5">${a.produtoNome}</p>
                    <p class="text-xs text-slate-400 mt-0.5">${a.detalhe}</p>
                    <div class="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span>Data: ${a.data}</span>
                      <span>•</span>
                      <span class="text-purple-300 font-semibold">Recomendação: ${a.acao}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end md:self-center">
                  <button
                    onclick="window.cyberModals.openEntryModal('${a.produtoId}');"
                    class="btn-cyber-primary text-xs py-1.5 px-3"
                  >
                    Ação Rápida
                  </button>
                  <button
                    onclick="window.appSidebar.setTab('${a.tipo === 'estoque_baixo' ? 'produtos' : 'lotes'}');"
                    class="btn-cyber-secondary text-xs py-1.5 px-3"
                  >
                    Ver Item ➔
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }
  }
}

window.AlertsView = AlertsView;
