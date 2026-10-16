/**
 * StockPro Movements Ledger View
 */

class MovementsView {
  constructor() {
    this.container = null;
    this.tipoFiltro = 'todos';
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = 10;
  }

  setFilter(key, val) {
    this[key] = val;
    this.currentPage = 1;
    this.render();
  }

  renderTo(element) {
    this.container = element;
    this.render();
  }

  render() {
    if (!this.container) return;

    let movements = window.dataStore.movements.filter(m => {
      const prod = window.dataStore.products.find(p => p.id === m.produtoId);
      const matchSearch = !this.searchQuery ||
        m.motivo.toLowerCase().includes(this.searchQuery) ||
        m.referencia.toLowerCase().includes(this.searchQuery) ||
        (prod && prod.nome.toLowerCase().includes(this.searchQuery));

      const matchTipo = this.tipoFiltro === 'todos' || m.tipo === this.tipoFiltro;
      return matchSearch && matchTipo;
    });

    const totalPages = Math.ceil(movements.length / this.itemsPerPage) || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const pageItems = movements.slice(startIndex, startIndex + this.itemsPerPage);

    this.container.innerHTML = `
      <div class="space-y-6 tab-fade-enter">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
              <h1 class="text-2xl font-black text-white tracking-wide" style="font-family: var(--font-display)">Movimentações</h1>
            </div>
            <p class="text-xs text-[#A3B2D1] mt-0.5">Acompanhe o histórico completo de entradas, saídas, perdas e auditorias.</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="window.dataStore.exportToCSV('movimentacoes')" class="btn-cyber-secondary text-xs py-2 px-3.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Exportar
            </button>
            <button onclick="window.cyberModals.openEntryModal()" class="btn-cyber-success text-xs py-2 px-3.5">
              <i data-lucide="arrow-down-left" class="w-3.5 h-3.5"></i> Registrar Entrada (+)
            </button>
            <button onclick="window.cyberModals.openExitModal()" class="btn-cyber-danger text-xs py-2 px-3.5">
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i> Registrar Saída (-)
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="cyber-card p-4 flex flex-wrap items-center gap-3">
          <div class="relative flex-1 min-w-[200px]">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
            <input
              type="text"
              placeholder="Buscar por produto, motivo, referência..."
              value="${this.searchQuery}"
              oninput="window.movementsViewInstance.searchQuery = this.value.toLowerCase(); window.movementsViewInstance.currentPage = 1; window.movementsViewInstance.render();"
              class="cyber-input pl-9 text-xs"
            />
          </div>

          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400">Tipo:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.movementsViewInstance.setFilter('tipoFiltro', this.value)">
              <option value="todos" ${this.tipoFiltro === 'todos' ? 'selected' : ''}>Todos os tipos</option>
              <option value="entrada" ${this.tipoFiltro === 'entrada' ? 'selected' : ''}>Entrada (+)</option>
              <option value="saida" ${this.tipoFiltro === 'saida' ? 'selected' : ''}>Saída / Venda (-)</option>
              <option value="perda" ${this.tipoFiltro === 'perda' ? 'selected' : ''}>Perda (-)</option>
              <option value="avaria" ${this.tipoFiltro === 'avaria' ? 'selected' : ''}>Avaria (-)</option>
            </select>
          </div>
        </div>

        <!-- Movements Table -->
        <div class="cyber-card p-5">
          <div class="cyber-table-container">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>Data / Hora</th>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th>Qtd Movimentada</th>
                  <th>Motivo</th>
                  <th>Responsável</th>
                  <th>Referência / NF</th>
                </tr>
              </thead>
              <tbody>
                ${pageItems.length === 0 ? `
                  <tr>
                    <td colspan="7" class="text-center py-10 text-slate-400 text-xs">
                      Nenhuma movimentação registrada com os critérios atuais.
                    </td>
                  </tr>
                ` : pageItems.map(m => {
                  const prod = window.dataStore.products.find(p => p.id === m.produtoId);
                  const isEntry = m.tipo === 'entrada' || m.tipo === 'devolucao';
                  const isLoss = m.tipo === 'perda' || m.tipo === 'avaria';

                  let badgeClass = 'badge-danger';
                  if (isEntry) badgeClass = 'badge-success';
                  else if (isLoss) badgeClass = 'badge-warning';

                  return `
                    <tr>
                      <td class="font-mono text-xs text-slate-400">${m.dataHora}</td>
                      <td>
                        <div class="font-bold text-white text-xs">${prod ? prod.nome : m.produtoId}</div>
                        <span class="text-[10px] text-slate-400 font-mono">${prod ? prod.sku : ''}</span>
                      </td>
                      <td>
                        <span class="badge-neon ${badgeClass}">
                          ${isEntry ? '▲' : '▼'} ${m.tipo.toUpperCase()}
                        </span>
                      </td>
                      <td class="font-mono text-sm font-bold ${isEntry ? 'text-emerald-400' : 'text-rose-400'}">
                        ${isEntry ? `+${m.quantidade}` : `-${m.quantidade}`}
                      </td>
                      <td class="text-xs text-slate-200">${m.motivo}</td>
                      <td class="text-xs text-slate-400 font-mono">${m.usuario}</td>
                      <td class="font-mono text-xs text-cyan-400">${m.referencia}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 text-xs text-slate-400">
            <span>Exibindo ${pageItems.length} de ${movements.length} movimentações</span>
            <div class="flex items-center gap-1.5">
              <button
                onclick="if(window.movementsViewInstance.currentPage > 1) { window.movementsViewInstance.currentPage--; window.movementsViewInstance.render(); }"
                class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition disabled:opacity-40"
                ${this.currentPage <= 1 ? 'disabled' : ''}
              >
                Anterior
              </button>
              <span class="px-3 py-1 font-mono text-cyan-400 font-bold">${this.currentPage} / ${totalPages}</span>
              <button
                onclick="if(window.movementsViewInstance.currentPage < ${totalPages}) { window.movementsViewInstance.currentPage++; window.movementsViewInstance.render(); }"
                class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition disabled:opacity-40"
                ${this.currentPage >= totalPages ? 'disabled' : ''}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }
  }
}

window.MovementsView = MovementsView;
