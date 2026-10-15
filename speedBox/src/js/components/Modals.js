/**
 * StockPro Cyberpunk Neon Modal Component Manager
 */

class CyberModalManager {
  constructor() {
    this.overlay = null;
    this.currentModal = null;
  }

  open(contentHtml, onClose = null) {
    this.close();

    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) this.close();
    };

    const container = document.createElement('div');
    container.className = 'modal-content';
    container.innerHTML = contentHtml;

    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);

    // Close buttons inside modal
    const closeBtns = container.querySelectorAll('.btn-close-modal');
    closeBtns.forEach(btn => {
      btn.onclick = () => {
        this.close();
        if (onClose) onClose();
      };
    });

    // Re-initialize any Lucide icons inside modal if needed
    if (window.lucide) {
      window.lucide.createIcons({ root: container });
    }
  }

  close() {
    if (this.overlay && this.overlay.parentElement) {
      this.overlay.parentElement.removeChild(this.overlay);
    }
    this.overlay = null;
  }

  // --- SPECIFIC MODALS ---

  openNewProductModal() {
    const categories = ['Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Padaria', 'Frios & Laticínios', 'Hortifruti', 'Utilidades'];
    const html = `
      <div class="p-6">
        <div class="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <i data-lucide="package-plus" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white tracking-wide">Cadastrar Novo Produto</h3>
              <p class="text-xs text-slate-400">Insira as informações do item para o catálogo do StockPro</p>
            </div>
          </div>
          <button class="btn-close-modal text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition">✕</button>
        </div>

        <form id="form-new-product" onsubmit="event.preventDefault(); window.cyberModals.handleSaveProduct(this);">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-300 mb-1">Nome do Produto *</label>
              <input type="text" name="nome" required placeholder="Ex: Arroz Integral Premium 5kg" class="cyber-input" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Código / SKU *</label>
              <input type="text" name="sku" required placeholder="Ex: ALM-ARR-002" class="cyber-input" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Categoria *</label>
              <select name="categoria" class="cyber-select w-full" required>
                ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Estoque Inicial (UN)</label>
              <input type="number" name="estoque" min="0" value="0" class="cyber-input" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Estoque Mínimo (Alerta)</label>
              <input type="number" name="estoqueMinimo" min="1" value="10" class="cyber-input" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Preço de Custo (R$)</label>
              <input type="number" step="0.01" name="precoCusto" min="0" placeholder="0,00" class="cyber-input" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Preço de Venda (R$)</label>
              <input type="number" step="0.01" name="precoVenda" min="0" placeholder="0,00" class="cyber-input" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Código do Lote Inicial</label>
              <input type="text" name="codigoLote" placeholder="Ex: Lote 1205" class="cyber-input" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Data de Validade</label>
              <input type="date" name="dataValidade" value="2027-10-15" class="cyber-input" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" class="btn-close-modal btn-cyber-secondary">Cancelar</button>
            <button type="submit" class="btn-cyber-primary">Salvar Produto</button>
          </div>
        </form>
      </div>
    `;
    this.open(html);
  }

  handleSaveProduct(form) {
    const data = {
      nome: form.nome.value.trim(),
      sku: form.sku.value.trim(),
      categoria: form.categoria.value,
      estoque: Number(form.estoque.value) || 0,
      estoqueMinimo: Number(form.estoqueMinimo.value) || 10,
      precoCusto: Number(form.precoCusto.value) || 0,
      precoVenda: Number(form.precoVenda.value) || 0,
      codigoLote: form.codigoLote.value.trim(),
      dataValidade: form.dataValidade.value
    };

    window.dataStore.addProduct(data);
    this.close();
    window.cyberToast.success(`Produto "${data.nome}" adicionado com sucesso!`, 'Catálogo Atualizado');
  }

  openEntryModal(preselectedProductId = null) {
    const products = window.dataStore.products;
    const html = `
      <div class="p-6">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <i data-lucide="arrow-down-left" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white tracking-wide">Registrar Entrada no Estoque</h3>
              <p class="text-xs text-slate-400">Aumente o saldo de itens e vincule a uma nota ou lote</p>
            </div>
          </div>
          <button class="btn-close-modal text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition">✕</button>
        </div>

        <form onsubmit="event.preventDefault(); window.cyberModals.handleSaveEntry(this);">
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Selecionar Produto *</label>
              <select name="produtoId" class="cyber-select w-full" required>
                ${products.map(p => `
                  <option value="${p.id}" ${preselectedProductId === p.id ? 'selected' : ''}>
                    ${p.nome} (Atual: ${p.estoque} ${p.unidade})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Quantidade de Entrada *</label>
                <input type="number" name="quantidade" min="1" value="10" required class="cyber-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Motivo da Entrada</label>
                <select name="motivo" class="cyber-select w-full">
                  <option value="Compra de Reposição">Compra de Reposição</option>
                  <option value="Devolução de Cliente">Devolução de Cliente</option>
                  <option value="Ajuste de Inventário (+)">Ajuste de Inventário (+)</option>
                  <option value="Bonificação / Brinde">Bonificação / Brinde</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Referência / Documento</label>
                <input type="text" name="referencia" placeholder="Ex: NF-e 89123" class="cyber-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Código do Lote</label>
                <input type="text" name="codigoLote" placeholder="Ex: Lote 1409" class="cyber-input" />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" class="btn-close-modal btn-cyber-secondary">Cancelar</button>
            <button type="submit" class="btn-cyber-success">Confirmar Entrada (+)</button>
          </div>
        </form>
      </div>
    `;
    this.open(html);
  }

  handleSaveEntry(form) {
    const produtoId = form.produtoId.value;
    const quantidade = Number(form.quantidade.value);
    const motivo = form.motivo.value;
    const referencia = form.referencia.value.trim() || 'Entrada Manual';

    window.dataStore.addMovement({
      produtoId,
      tipo: 'entrada',
      quantidade,
      motivo,
      referencia
    });

    this.close();
    window.cyberToast.success(`Entrada de ${quantidade} unidades registrada com sucesso!`, 'Estoque Abastecido');
  }

  openExitModal(preselectedProductId = null) {
    const products = window.dataStore.products;
    const html = `
      <div class="p-6">
        <div class="flex items-center justify-between pb-4 border-b border-rose-500/20 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <i data-lucide="arrow-up-right" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white tracking-wide">Registrar Saída no Estoque</h3>
              <p class="text-xs text-slate-400">Baixa por venda, consumo interno, avaria ou perda</p>
            </div>
          </div>
          <button class="btn-close-modal text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition">✕</button>
        </div>

        <form onsubmit="event.preventDefault(); window.cyberModals.handleSaveExit(this);">
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Selecionar Produto *</label>
              <select name="produtoId" class="cyber-select w-full" required>
                ${products.map(p => `
                  <option value="${p.id}" ${preselectedProductId === p.id ? 'selected' : ''}>
                    ${p.nome} (Saldo atual: ${p.estoque} ${p.unidade})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Quantidade de Saída *</label>
                <input type="number" name="quantidade" min="1" value="1" required class="cyber-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Tipo / Motivo da Saída *</label>
                <select name="tipo" class="cyber-select w-full">
                  <option value="saida">Venda Direta / Balcão</option>
                  <option value="consumo">Consumo Interno</option>
                  <option value="avaria">Avaria / Embalagem Rompida</option>
                  <option value="perda">Perda / Vencimento</option>
                  <option value="ajuste">Ajuste de Auditoria (-)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Observação / Justificativa</label>
              <input type="text" name="motivo" placeholder="Ex: Retirada para expedição de pedido #392" class="cyber-input" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" class="btn-close-modal btn-cyber-secondary">Cancelar</button>
            <button type="submit" class="btn-cyber-danger">Confirmar Saída (-)</button>
          </div>
        </form>
      </div>
    `;
    this.open(html);
  }

  handleSaveExit(form) {
    const produtoId = form.produtoId.value;
    const quantidade = Number(form.quantidade.value);
    const tipo = form.tipo.value;
    const motivo = form.motivo.value.trim() || 'Saída Operacional';

    const p = window.dataStore.products.find(pr => pr.id === produtoId);
    if (p && p.estoque < quantidade) {
      window.cyberToast.error(`Estoque insuficiente! O item tem apenas ${p.estoque} ${p.unidade}.`, 'Erro de Saldo');
      return;
    }

    window.dataStore.addMovement({
      produtoId,
      tipo,
      quantidade,
      motivo,
      referencia: 'Baixa Manual'
    });

    this.close();
    window.cyberToast.success(`Saída de ${quantidade} unidades registrada!`, 'Estoque Atualizado');
  }

  openNewSaleModal() {
    const products = window.dataStore.products;
    const html = `
      <div class="p-6">
        <div class="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <i data-lucide="shopping-cart" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white tracking-wide">Lançar Nova Venda</h3>
              <p class="text-xs text-slate-400">Registrar transação comercial com baixa automática de estoque</p>
            </div>
          </div>
          <button class="btn-close-modal text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition">✕</button>
        </div>

        <form id="form-new-sale" onsubmit="event.preventDefault(); window.cyberModals.handleSaveSale(this);">
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Produto Vendido *</label>
              <select name="produtoId" id="sale-prod-select" class="cyber-select w-full" onchange="window.cyberModals.updateSalePrice(this)">
                ${products.map(p => `
                  <option value="${p.id}" data-preco="${p.precoVenda}" data-estoque="${p.estoque}">
                    ${p.nome} — R$ ${p.precoVenda.toFixed(2)} (Disponível: ${p.estoque})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Quantidade *</label>
                <input type="number" name="quantidade" id="sale-qty" min="1" value="1" class="cyber-input" oninput="window.cyberModals.calculateSaleTotal()" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Preço Unitário (R$)</label>
                <input type="number" step="0.01" name="precoUnitario" id="sale-price" value="${products[0] ? products[0].precoVenda : 0}" class="cyber-input" oninput="window.cyberModals.calculateSaleTotal()" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Forma de Pagamento</label>
                <select name="formaPagamento" class="cyber-select w-full">
                  <option value="PIX">PIX (Instantâneo)</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Boleto Bancário">Boleto Bancário</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Total da Venda</label>
                <div id="sale-total-display" class="cyber-input font-bold text-cyan-400 text-base bg-slate-900/90 flex items-center">
                  R$ ${(products[0] ? products[0].precoVenda : 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" class="btn-close-modal btn-cyber-secondary">Cancelar</button>
            <button type="submit" class="btn-cyber-primary">Concluir Venda e Baixar Estoque</button>
          </div>
        </form>
      </div>
    `;
    this.open(html);
  }

  updateSalePrice(selectEl) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const preco = parseFloat(selectedOption.getAttribute('data-preco')) || 0;
    const priceInput = document.getElementById('sale-price');
    if (priceInput) priceInput.value = preco.toFixed(2);
    this.calculateSaleTotal();
  }

  calculateSaleTotal() {
    const qty = parseInt(document.getElementById('sale-qty')?.value) || 0;
    const price = parseFloat(document.getElementById('sale-price')?.value) || 0;
    const total = qty * price;
    const display = document.getElementById('sale-total-display');
    if (display) {
      display.textContent = window.dataStore.formatCurrency(total);
    }
  }

  handleSaveSale(form) {
    const produtoId = form.produtoId.value;
    const quantidade = Number(form.quantidade.value);
    const precoUnitario = Number(form.precoUnitario.value);
    const formaPagamento = form.formaPagamento.value;
    const valorTotal = quantidade * precoUnitario;

    const prod = window.dataStore.products.find(p => p.id === produtoId);
    if (prod && prod.estoque < quantidade) {
      window.cyberToast.error(`Estoque insuficiente! O item tem apenas ${prod.estoque} em estoque.`, 'Erro de Saldo');
      return;
    }

    window.dataStore.addSale({
      itens: [{
        produtoId,
        quantidade,
        precoUnitario,
        subtotal: valorTotal
      }],
      valorTotal,
      formaPagamento
    });

    this.close();
    window.cyberToast.success(`Venda de ${window.dataStore.formatCurrency(valorTotal)} concluída com sucesso!`, 'Venda Registrada');
  }

  openReportPreviewModal(reportType, reportTitle) {
    const html = `
      <div class="p-6">
        <div class="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <i data-lucide="file-text" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white tracking-wide">${reportTitle}</h3>
              <p class="text-xs text-slate-400">Pré-visualização gerada em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>
          <button class="btn-close-modal text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition">✕</button>
        </div>

        <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-6 max-h-72 overflow-y-auto font-mono text-xs text-slate-300">
          <div class="border-b border-slate-800 pb-2 mb-3 flex justify-between items-center text-slate-400">
            <span>STOCKPRO SISTEMAS DE ESTOQUE</span>
            <span>EMPRESA: ${window.dataStore.settings.empresa.nome}</span>
          </div>
          <div class="py-2">
            Status: Dados auditados e sincronizados em tempo real.<br>
            Itens computados: ${window.dataStore.products.length} produtos | ${window.dataStore.lots.length} lotes | ${window.dataStore.sales.length} vendas registradas.<br>
            Faturamento acumulado: ${window.dataStore.formatCurrency(window.dataStore.sales.reduce((a, s) => a + s.valorTotal, 0))}.
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div class="flex items-center gap-2">
            <button class="btn-cyber-secondary text-xs" onclick="window.dataStore.exportToCSV('${reportType}'); window.cyberToast.info('Arquivo CSV exportado com sucesso!');">
              <i data-lucide="download" class="w-3.5 h-3.5 mr-1"></i> Baixar CSV
            </button>
            <button class="btn-cyber-secondary text-xs" onclick="window.print();">
              <i data-lucide="printer" class="w-3.5 h-3.5 mr-1"></i> Imprimir
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-close-modal btn-cyber-secondary">Fechar</button>
            <button class="btn-cyber-primary text-xs" onclick="window.dataStore.exportToCSV('${reportType}'); window.cyberModals.close(); window.cyberToast.success('Relatório gerado com sucesso!');">
              <i data-lucide="check-circle" class="w-3.5 h-3.5 mr-1"></i> Confirmar Exportação
            </button>
          </div>
        </div>
      </div>
    `;
    this.open(html);
  }
}

window.cyberModals = new CyberModalManager();
