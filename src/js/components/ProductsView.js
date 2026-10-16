/**
 * StockPro Products Catalog Management View
 */

class ProductsView {
  constructor() {
    this.container = null;
    this.searchQuery = '';
    this.categoriaFiltro = 'todas';
    this.statusFiltro = 'todos';
    this.currentPage = 1;
    this.itemsPerPage = 8;
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

    let filtered = window.dataStore.products.filter(p => {
      const matchSearch = !this.searchQuery ||
        p.nome.toLowerCase().includes(this.searchQuery) ||
        p.sku.toLowerCase().includes(this.searchQuery) ||
        p.codigo.includes(this.searchQuery);

      const matchCat = this.categoriaFiltro === 'todas' || p.categoria === this.categoriaFiltro;
      const matchStatus = this.statusFiltro === 'todos' || p.status === this.statusFiltro;

      return matchSearch && matchCat && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const pageItems = filtered.slice(startIndex, startIndex + this.itemsPerPage);

    const categories = ['todas', 'Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Padaria'];

    this.container.innerHTML = `
      <div class="space-y-6 tab-fade-enter">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
              <h1 class="text-2xl font-black text-white tracking-wide" style="font-family: var(--font-display)">Produtos</h1>
            </div>
            <p class="text-xs text-[#A3B2D1] mt-0.5">Gerencie seu catálogo e acompanhe a disponibilidade dos produtos.</p>
          </div>

          <button onclick="window.cyberModals.openNewProductModal()" class="btn-cyber-primary text-xs py-2 px-4">
            <i data-lucide="plus" class="w-4 h-4"></i> + Novo Produto
          </button>
        </div>

        <!-- Filters Bar -->
        <div class="cyber-card p-4 flex flex-wrap items-center gap-3">
          <!-- Search in Catalog -->
          <div class="relative flex-1 min-w-[200px]">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
            <input
              type="text"
              placeholder="Buscar por nome, código ou SKU..."
              value="${this.searchQuery}"
              oninput="window.productsViewInstance.searchQuery = this.value.toLowerCase(); window.productsViewInstance.currentPage = 1; window.productsViewInstance.render();"
              class="cyber-input pl-9 text-xs"
            />
          </div>

          <!-- Category filter -->
          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400">Categoria:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.productsViewInstance.setFilter('categoriaFiltro', this.value)">
              ${categories.map(c => `
                <option value="${c}" ${this.categoriaFiltro === c ? 'selected' : ''}>
                  ${c === 'todas' ? 'Todas' : c}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Status filter -->
          <div class="flex items-center gap-1.5">
            <label class="text-xs text-slate-400">Status:</label>
            <select class="cyber-select text-xs py-1.5" onchange="window.productsViewInstance.setFilter('statusFiltro', this.value)">
              <option value="todos" ${this.statusFiltro === 'todos' ? 'selected' : ''}>Todos os status</option>
              <option value="normal" ${this.statusFiltro === 'normal' ? 'selected' : ''}>Normal</option>
              <option value="baixo" ${this.statusFiltro === 'baixo' ? 'selected' : ''}>Estoque Baixo</option>
              <option value="esgotado" ${this.statusFiltro === 'esgotado' ? 'selected' : ''}>Esgotado</option>
            </select>
          </div>

          <!-- Quick export -->
          <button onclick="window.dataStore.exportToCSV('produtos')" class="btn-cyber-secondary text-xs py-1.5 px-3">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> CSV
          </button>
        </div>

        <!-- Products Table -->
        <div class="cyber-card p-5">
          <div class="cyber-table-container">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>SKU / Cód.</th>
                  <th>Categoria</th>
                  <th>Disponível</th>
                  <th>Mínimo</th>
                  <th>Preço Venda</th>
                  <th>Status</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${pageItems.length === 0 ? `
                  <tr>
                    <td colspan="8" class="text-center py-10 text-slate-400 text-xs">
                      Nenhum produto encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ` : pageItems.map(p => {
                  const pct = Math.min(100, (p.estoque / (p.estoqueMinimo * 3)) * 100);
                  const isLow = p.status === 'baixo';
                  const isOut = p.status === 'esgotado';
                  return `
                    <tr>
                      <td>
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 flex-shrink-0">
                            <i data-lucide="package" class="w-4 h-4"></i>
                          </div>
                          <div>
                            <div class="font-bold text-white text-xs">${p.nome}</div>
                            <span class="text-[10px] text-slate-400 font-mono">Unidade: ${p.unidade}</span>
                          </div>
                        </div>
                      </td>
                      <td class="font-mono text-xs text-slate-300">
                        <div>${p.sku}</div>
                        <span class="text-[10px] text-slate-500">Cód: ${p.codigo}</span>
                      </td>
                      <td>
                        <span class="badge-neon badge-blue text-[10px]">${p.categoria}</span>
                      </td>
                      <td>
                        <div class="flex items-center gap-2">
                          <span class="font-mono font-bold text-sm ${isLow ? 'text-amber-400' : (isOut ? 'text-rose-400' : 'text-white')}">
                            ${p.estoque} ${p.unidade}
                          </span>
                        </div>
                        <div class="w-20 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                          <div class="h-1 rounded-full ${isLow ? 'bg-amber-400' : (isOut ? 'bg-rose-500' : 'bg-cyan-400')}" style="width: ${pct}%"></div>
                        </div>
                      </td>
                      <td class="font-mono text-xs text-slate-400">${p.estoqueMinimo} ${p.unidade}</td>
                      <td class="font-mono text-xs font-bold text-emerald-400">${window.dataStore.formatCurrency(p.precoVenda)}</td>
                      <td>
                        ${isLow ? `
                          <span class="badge-neon badge-warning text-[10px]">
                            <i data-lucide="alert-circle" class="w-3 h-3"></i> Baixo
                          </span>
                        ` : isOut ? `
                          <span class="badge-neon badge-danger text-[10px]">
                            <i data-lucide="x-circle" class="w-3 h-3"></i> Esgotado
                          </span>
                        ` : `
                          <span class="badge-neon badge-success text-[10px]">
                            <i data-lucide="check" class="w-3 h-3"></i> Normal
                          </span>
                        `}
                      </td>
                      <td class="text-right">
                        <div class="inline-flex items-center gap-1.5">
                          <button
                            onclick="window.cyberModals.openEntryModal('${p.id}')"
                            class="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
                            title="Entrada rápida (+)"
                          >
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                          </button>
                          <button
                            onclick="window.cyberModals.openExitModal('${p.id}')"
                            class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                            title="Saída rápida (-)"
                          >
                            <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                          </button>
                          <button
                            onclick="if(confirm('Excluir produto ${p.nome}?')) { window.dataStore.deleteProduct('${p.id}'); window.cyberToast.info('Produto removido'); }"
                            class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                            title="Excluir produto"
                          >
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 text-xs text-slate-400">
            <span>Exibindo ${pageItems.length} de ${filtered.length} produtos</span>
            <div class="flex items-center gap-1.5">
              <button
                onclick="if(window.productsViewInstance.currentPage > 1) { window.productsViewInstance.currentPage--; window.productsViewInstance.render(); }"
                class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition disabled:opacity-40"
                ${this.currentPage <= 1 ? 'disabled' : ''}
              >
                Anterior
              </button>
              <span class="px-3 py-1 font-mono text-cyan-400 font-bold">${this.currentPage} / ${totalPages}</span>
              <button
                onclick="if(window.productsViewInstance.currentPage < ${totalPages}) { window.productsViewInstance.currentPage++; window.productsViewInstance.render(); }"
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

window.ProductsView = ProductsView;
