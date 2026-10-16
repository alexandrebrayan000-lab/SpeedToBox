/**
 * StockPro Central Reactive Data Store
 * Manages products, lots, movements, sales, alerts and system preferences.
 * Persists to localStorage and broadcasts state changes to components.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'stockpro_products_v2',
  LOTS: 'stockpro_lots_v2',
  MOVEMENTS: 'stockpro_movements_v2',
  SALES: 'stockpro_sales_v2',
  SETTINGS: 'stockpro_settings_v2',
  ALERTS: 'stockpro_alerts_v2'
};

// Initial Brazilian Commercial Seed Data
const INITIAL_PRODUCTS = [
  { id: 'prod_1', codigo: '001', sku: 'ALM-ARR-001', nome: 'Arroz Nobre Tipo 1 5kg', categoria: 'Alimentos', estoque: 145, estoqueMinimo: 30, precoCusto: 22.50, precoVenda: 32.90, unidade: 'UN', status: 'normal' },
  { id: 'prod_2', codigo: '002', sku: 'ALM-FEJ-002', nome: 'Feijão Carioca Selecionado 1kg', categoria: 'Alimentos', estoque: 18, estoqueMinimo: 25, precoCusto: 6.20, precoVenda: 9.80, unidade: 'UN', status: 'baixo' },
  { id: 'prod_3', codigo: '003', sku: 'ALM-OLE-003', nome: 'Óleo de Soja Refinado 900ml', categoria: 'Alimentos', estoque: 64, estoqueMinimo: 20, precoCusto: 5.10, precoVenda: 7.90, unidade: 'UN', status: 'normal' },
  { id: 'prod_4', codigo: '004', sku: 'LMP-DET-004', nome: 'Detergente Líquido Neutro 500ml', categoria: 'Limpeza', estoque: 12, estoqueMinimo: 30, precoCusto: 1.80, precoVenda: 2.99, unidade: 'UN', status: 'baixo' },
  { id: 'prod_5', codigo: '005', sku: 'HIG-SAB-005', nome: 'Sabonete Antibacteriano 90g', categoria: 'Higiene', estoque: 180, estoqueMinimo: 40, precoCusto: 2.10, precoVenda: 3.85, unidade: 'UN', status: 'normal' },
  { id: 'prod_6', codigo: '006', sku: 'BEB-REF-006', nome: 'Refrigerante Cola Pet 2L', categoria: 'Bebidas', estoque: 48, estoqueMinimo: 15, precoCusto: 6.50, precoVenda: 9.99, unidade: 'UN', status: 'normal' },
  { id: 'prod_7', codigo: '007', sku: 'ALM-CAF-007', nome: 'Café Torrado e Moído Tradicional 500g', categoria: 'Alimentos', estoque: 8, estoqueMinimo: 20, precoCusto: 14.20, precoVenda: 21.50, unidade: 'UN', status: 'baixo' },
  { id: 'prod_8', codigo: '008', sku: 'BEB-LEI-008', nome: 'Leite Integral UHT 1L', categoria: 'Bebidas', estoque: 110, estoqueMinimo: 30, precoCusto: 4.10, precoVenda: 5.89, unidade: 'UN', status: 'normal' },
  { id: 'prod_9', codigo: '009', sku: 'ALM-IOG-009', nome: 'Iogurte Natural Integral 170g', categoria: 'Alimentos', estoque: 22, estoqueMinimo: 15, precoCusto: 2.80, precoVenda: 4.50, unidade: 'UN', status: 'normal' },
  { id: 'prod_10', codigo: '010', sku: 'PAD-PAO-010', nome: 'Pão de Forma Tradicional 500g', categoria: 'Padaria', estoque: 35, estoqueMinimo: 15, precoCusto: 5.50, precoVenda: 8.90, unidade: 'UN', status: 'normal' },
  { id: 'prod_11', codigo: '011', sku: 'BEB-SUC-011', nome: 'Suco de Laranja Integral 1L', categoria: 'Bebidas', estoque: 28, estoqueMinimo: 10, precoCusto: 7.90, precoVenda: 12.90, unidade: 'UN', status: 'normal' },
  { id: 'prod_12', codigo: '012', sku: 'LMP-DES-012', nome: 'Desinfetante Floral 1L', categoria: 'Limpeza', estoque: 5, estoqueMinimo: 20, precoCusto: 4.30, precoVenda: 6.99, unidade: 'UN', status: 'baixo' }
];

const INITIAL_LOTS = [
  { id: 'lot_1', produtoId: 'prod_8', codigoLote: 'Lote 0421', quantidade: 35, dataEntrada: '2026-09-10', dataValidade: '2026-10-18', status: 'proximo_vencimento' },
  { id: 'lot_2', produtoId: 'prod_9', codigoLote: 'Lote 0312', quantidade: 5, dataEntrada: '2026-08-25', dataValidade: '2026-10-13', status: 'vencido' },
  { id: 'lot_3', produtoId: 'prod_10', codigoLote: 'Lote 0765', quantidade: 35, dataEntrada: '2026-10-02', dataValidade: '2026-11-15', status: 'normal' },
  { id: 'lot_4', produtoId: 'prod_11', codigoLote: 'Lote 0890', quantidade: 28, dataEntrada: '2026-10-01', dataValidade: '2026-12-10', status: 'normal' },
  { id: 'lot_5', produtoId: 'prod_7', codigoLote: 'Lote 0523', quantidade: 8, dataEntrada: '2026-08-15', dataValidade: '2026-10-20', status: 'proximo_vencimento' },
  { id: 'lot_6', produtoId: 'prod_1', codigoLote: 'Lote 1102', quantidade: 145, dataEntrada: '2026-09-28', dataValidade: '2027-04-30', status: 'normal' },
  { id: 'lot_7', produtoId: 'prod_2', codigoLote: 'Lote 0984', quantidade: 18, dataEntrada: '2026-09-20', dataValidade: '2027-02-15', status: 'normal' },
  { id: 'lot_8', produtoId: 'prod_4', codigoLote: 'Lote 0643', quantidade: 12, dataEntrada: '2026-09-15', dataValidade: '2027-09-15', status: 'normal' },
  { id: 'lot_9', produtoId: 'prod_5', codigoLote: 'Lote 0872', quantidade: 180, dataEntrada: '2026-09-25', dataValidade: '2028-01-01', status: 'normal' }
];

const INITIAL_MOVEMENTS = [
  { id: 'mov_1', dataHora: '2026-10-15 14:32', produtoId: 'prod_1', tipo: 'entrada', quantidade: 50, motivo: 'Compra de Reposição', loteId: 'lot_6', usuario: 'admin', referencia: 'NF-e 84920' },
  { id: 'mov_2', dataHora: '2026-10-15 11:15', produtoId: 'prod_7', tipo: 'saida', quantidade: 5, motivo: 'Venda Balcão', loteId: 'lot_5', usuario: 'admin', referencia: 'Venda #1092' },
  { id: 'mov_3', dataHora: '2026-10-14 16:47', produtoId: 'prod_8', tipo: 'entrada', quantidade: 40, motivo: 'Compra de Reposição', loteId: 'lot_1', usuario: 'admin', referencia: 'NF-e 84890' },
  { id: 'mov_4', dataHora: '2026-10-14 10:20', produtoId: 'prod_4', tipo: 'saida', quantidade: 8, motivo: 'Venda Balcão', loteId: 'lot_8', usuario: 'admin', referencia: 'Venda #1085' },
  { id: 'mov_5', dataHora: '2026-10-13 17:05', produtoId: 'prod_9', tipo: 'perda', quantidade: 5, motivo: 'Vencimento no Estoque', loteId: 'lot_2', usuario: 'admin', referencia: 'Ajuste Interno' },
  { id: 'mov_6', dataHora: '2026-10-13 15:30', produtoId: 'prod_6', tipo: 'saida', quantidade: 12, motivo: 'Venda Restaurante', loteId: null, usuario: 'admin', referencia: 'Venda #1078' },
  { id: 'mov_7', dataHora: '2026-10-12 14:10', produtoId: 'prod_3', tipo: 'avaria', quantidade: 2, motivo: 'Embalagem Rompida no Transporte', loteId: null, usuario: 'admin', referencia: 'Laudo 02' },
  { id: 'mov_8', dataHora: '2026-10-11 09:40', produtoId: 'prod_5', tipo: 'saida', quantidade: 20, motivo: 'Venda Balcão', loteId: 'lot_9', usuario: 'admin', referencia: 'Venda #1064' },
  { id: 'mov_9', dataHora: '2026-10-10 13:20', produtoId: 'prod_1', tipo: 'saida', quantidade: 15, motivo: 'Venda Corporativa', loteId: 'lot_6', usuario: 'admin', referencia: 'Venda #1052' },
  { id: 'mov_10', dataHora: '2026-10-09 11:00', produtoId: 'prod_2', tipo: 'saida', quantidade: 10, motivo: 'Venda Balcão', loteId: 'lot_7', usuario: 'admin', referencia: 'Venda #1041' }
];

const INITIAL_SALES = [
  { id: 'sale_1', codigo: 'VND-1092', dataHora: '2026-10-15 11:15', itens: [{ produtoId: 'prod_7', quantidade: 5, precoUnitario: 21.50, subtotal: 107.50 }], valorTotal: 107.50, formaPagamento: 'PIX', status: 'concluida' },
  { id: 'sale_2', codigo: 'VND-1085', dataHora: '2026-10-14 10:20', itens: [{ produtoId: 'prod_4', quantidade: 8, precoUnitario: 2.99, subtotal: 23.92 }, { produtoId: 'prod_5', quantidade: 4, precoUnitario: 3.85, subtotal: 15.40 }], valorTotal: 39.32, formaPagamento: 'Cartão de Crédito', status: 'concluida' },
  { id: 'sale_3', codigo: 'VND-1078', dataHora: '2026-10-13 15:30', itens: [{ produtoId: 'prod_6', quantidade: 12, precoUnitario: 9.99, subtotal: 119.88 }, { produtoId: 'prod_1', quantidade: 4, precoUnitario: 32.90, subtotal: 131.60 }], valorTotal: 251.48, formaPagamento: 'Boleto', status: 'concluida' },
  { id: 'sale_4', codigo: 'VND-1064', dataHora: '2026-10-11 09:40', itens: [{ produtoId: 'prod_5', quantidade: 20, precoUnitario: 3.85, subtotal: 77.00 }, { produtoId: 'prod_8', quantidade: 15, precoUnitario: 5.89, subtotal: 88.35 }], valorTotal: 165.35, formaPagamento: 'PIX', status: 'concluida' },
  { id: 'sale_5', codigo: 'VND-1052', dataHora: '2026-10-10 13:20', itens: [{ produtoId: 'prod_1', quantidade: 15, precoUnitario: 32.90, subtotal: 493.50 }], valorTotal: 493.50, formaPagamento: 'Cartão de Débito', status: 'concluida' },
  { id: 'sale_6', codigo: 'VND-1041', dataHora: '2026-10-09 11:00', itens: [{ produtoId: 'prod_2', quantidade: 10, precoUnitario: 9.80, subtotal: 98.00 }, { produtoId: 'prod_3', quantidade: 12, precoUnitario: 7.90, subtotal: 94.80 }], valorTotal: 192.80, formaPagamento: 'PIX', status: 'concluida' },
  { id: 'sale_7', codigo: 'VND-1035', dataHora: '2026-10-08 16:15', itens: [{ produtoId: 'prod_10', quantidade: 18, precoUnitario: 8.90, subtotal: 160.20 }, { produtoId: 'prod_11', quantidade: 10, precoUnitario: 12.90, subtotal: 129.00 }], valorTotal: 289.20, formaPagamento: 'Cartão de Crédito', status: 'concluida' },
  { id: 'sale_8', codigo: 'VND-1020', dataHora: '2026-10-06 14:00', itens: [{ produtoId: 'prod_1', quantidade: 25, precoUnitario: 32.90, subtotal: 822.50 }, { produtoId: 'prod_8', quantidade: 30, precoUnitario: 5.89, subtotal: 176.70 }], valorTotal: 999.20, formaPagamento: 'PIX', status: 'concluida' },
  { id: 'sale_9', codigo: 'VND-1011', dataHora: '2026-10-04 10:45', itens: [{ produtoId: 'prod_6', quantidade: 35, precoUnitario: 9.99, subtotal: 349.65 }], valorTotal: 349.65, formaPagamento: 'Cartão de Débito', status: 'concluida' },
  { id: 'sale_10', codigo: 'VND-1002', dataHora: '2026-10-02 09:30', itens: [{ produtoId: 'prod_1', quantidade: 40, precoUnitario: 32.90, subtotal: 1316.00 }], valorTotal: 1316.00, formaPagamento: 'PIX', status: 'concluida' }
];

const INITIAL_SETTINGS = {
  empresa: {
    nome: 'StockPro Comércio & Logística LTDA',
    cnpj: '48.912.840/0001-92',
    email: 'contato@stockpro.com.br',
    moeda: 'BRL',
    timezone: 'America/Sao_Paulo'
  },
  usuario: {
    nome: 'Administrador Master',
    cargo: 'Gerente Geral de Estoque',
    email: 'admin@estoque.com',
    avatar: 'AD'
  },
  preferencias: {
    visualEffects: 'alta', // 'alta' | 'media' | 'sutil' | 'desativada'
    reducedMotion: false,
    neonIntensity: 'alta', // 'alta' | 'media' | 'sutil'
    tableDensity: 'confortavel', // 'confortavel' | 'compacta'
    alertThresholdDays: 30
  }
};

class DataStore {
  constructor() {
    this.listeners = [];
    this.products = this.load(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.lots = this.load(STORAGE_KEYS.LOTS, INITIAL_LOTS);
    this.movements = this.load(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
    this.sales = this.load(STORAGE_KEYS.SALES, INITIAL_SALES);
    this.settings = this.load(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    this.alerts = [];

    this.recalculateStatuses();
    this.generateAlerts();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error loading key ${key}`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving key ${key}`, e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.recalculateStatuses();
    this.generateAlerts();
    this.listeners.forEach(cb => cb(this));
  }

  recalculateStatuses() {
    const today = new Date('2026-10-15T00:00:00');

    // Recalculate Lot statuses and days remaining
    this.lots.forEach(lot => {
      const valDate = new Date(lot.dataValidade + 'T00:00:00');
      const diffTime = valDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      lot.diasRestantes = diffDays;

      if (lot.quantidade <= 0) {
        lot.status = 'esgotado';
      } else if (diffDays < 0) {
        lot.status = 'vencido';
      } else if (diffDays <= (this.settings.preferencias.alertThresholdDays || 30)) {
        lot.status = 'proximo_vencimento';
      } else {
        lot.status = 'normal';
      }
    });

    // Recalculate Product stock and status
    this.products.forEach(p => {
      if (p.estoque <= 0) {
        p.status = 'esgotado';
      } else if (p.estoque <= p.estoqueMinimo) {
        p.status = 'baixo';
      } else {
        p.status = 'normal';
      }
    });
  }

  generateAlerts() {
    const list = [];

    // Vencidos
    this.lots.filter(l => l.status === 'vencido').forEach(l => {
      const p = this.products.find(pr => pr.id === l.produtoId);
      list.push({
        id: `alt_venc_${l.id}`,
        tipo: 'vencido',
        prioridade: 'alta',
        titulo: 'Produto Vencido no Estoque',
        produtoNome: p ? p.nome : 'Produto Desconhecido',
        produtoId: l.produtoId,
        detalhe: `${l.codigoLote} com ${l.quantidade} un venceu em ${this.formatDate(l.dataValidade)}`,
        data: l.dataValidade,
        acao: 'Descartar / Ajustar'
      });
    });

    // Próximo do vencimento
    this.lots.filter(l => l.status === 'proximo_vencimento').forEach(l => {
      const p = this.products.find(pr => pr.id === l.produtoId);
      list.push({
        id: `alt_prox_${l.id}`,
        tipo: 'proximo_vencimento',
        prioridade: 'media',
        titulo: 'Lote Próximo do Vencimento',
        produtoNome: p ? p.nome : 'Produto Desconhecido',
        produtoId: l.produtoId,
        detalhe: `${l.codigoLote} (${l.quantidade} un) vence em ${l.diasRestantes} dias`,
        data: l.dataValidade,
        acao: 'Criar Promoção / Queima'
      });
    });

    // Estoque Baixo
    this.products.filter(p => p.status === 'baixo').forEach(p => {
      list.push({
        id: `alt_baixo_${p.id}`,
        tipo: 'estoque_baixo',
        prioridade: 'alta',
        titulo: 'Estoque Abaixo do Nível Mínimo',
        produtoNome: p.nome,
        produtoId: p.id,
        detalhe: `Restam apenas ${p.estoque} ${p.unidade} (Mínimo estipulado: ${p.estoqueMinimo} ${p.unidade})`,
        data: '2026-10-15',
        acao: 'Reabastecer com Fornecedor'
      });
    });

    this.alerts = list;
    this.save(STORAGE_KEYS.ALERTS, this.alerts);
  }

  // --- CRUD ACTIONS ---

  addProduct(newProduct) {
    const id = 'prod_' + Date.now();
    const product = {
      id,
      codigo: String(this.products.length + 1).padStart(3, '0'),
      sku: newProduct.sku || `SKU-${Date.now().toString().slice(-4)}`,
      nome: newProduct.nome,
      categoria: newProduct.categoria || 'Geral',
      estoque: Number(newProduct.estoque) || 0,
      estoqueMinimo: Number(newProduct.estoqueMinimo) || 10,
      precoCusto: Number(newProduct.precoCusto) || 0,
      precoVenda: Number(newProduct.precoVenda) || 0,
      unidade: newProduct.unidade || 'UN',
      status: 'normal'
    };

    this.products.unshift(product);
    this.save(STORAGE_KEYS.PRODUCTS, this.products);

    // If initial stock > 0, register initial lot and entry movement
    if (product.estoque > 0) {
      const lotId = 'lot_' + Date.now();
      const lot = {
        id: lotId,
        produtoId: id,
        codigoLote: newProduct.codigoLote || `Lote ${new Date().getFullYear().toString().slice(-2)}01`,
        quantidade: product.estoque,
        dataEntrada: new Date().toISOString().split('T')[0],
        dataValidade: newProduct.dataValidade || '2027-12-31',
        status: 'normal'
      };
      this.lots.unshift(lot);
      this.save(STORAGE_KEYS.LOTS, this.lots);

      this.addMovement({
        produtoId: id,
        tipo: 'entrada',
        quantidade: product.estoque,
        motivo: 'Cadastro Inicial de Estoque',
        loteId: lotId,
        usuario: this.settings.usuario.nome || 'admin',
        referencia: 'Estoque Inicial'
      }, false);
    }

    this.notify();
    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.save(STORAGE_KEYS.PRODUCTS, this.products);
      this.notify();
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.lots = this.lots.filter(l => l.produtoId !== id);
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.save(STORAGE_KEYS.LOTS, this.lots);
    this.notify();
  }

  addMovement(movData, shouldNotify = true) {
    const id = 'mov_' + Date.now();
    const product = this.products.find(p => p.id === movData.produtoId);
    if (!product) return null;

    const qty = Number(movData.quantidade);
    const tipo = movData.tipo.toLowerCase(); // 'entrada' | 'saida' | 'ajuste' | 'perda' | 'avaria' | 'devolucao'

    // Adjust product stock
    if (tipo === 'entrada' || tipo === 'devolucao') {
      product.estoque += qty;
    } else {
      product.estoque = Math.max(0, product.estoque - qty);
    }

    // Adjust lot stock if provided
    if (movData.loteId) {
      const lot = this.lots.find(l => l.id === movData.loteId);
      if (lot) {
        if (tipo === 'entrada' || tipo === 'devolucao') {
          lot.quantidade += qty;
        } else {
          lot.quantidade = Math.max(0, lot.quantidade - qty);
        }
      }
    }

    const now = new Date();
    const dataHoraFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const movement = {
      id,
      dataHora: movData.dataHora || dataHoraFormatted,
      produtoId: movData.produtoId,
      tipo: tipo,
      quantidade: qty,
      motivo: movData.motivo || 'Movimentação Operacional',
      loteId: movData.loteId || null,
      usuario: movData.usuario || this.settings.usuario.nome || 'admin',
      referencia: movData.referencia || 'Operação Manual'
    };

    this.movements.unshift(movement);
    this.save(STORAGE_KEYS.MOVEMENTS, this.movements);
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.save(STORAGE_KEYS.LOTS, this.lots);

    if (shouldNotify) this.notify();
    return movement;
  }

  addSale(saleData) {
    const id = 'sale_' + Date.now();
    const codigo = `VND-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dataHora = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Process stock exits for each sold item
    saleData.itens.forEach(item => {
      this.addMovement({
        produtoId: item.produtoId,
        tipo: 'saida',
        quantidade: item.quantidade,
        motivo: 'Venda ' + codigo,
        loteId: item.loteId || null,
        usuario: this.settings.usuario.nome || 'admin',
        referencia: codigo
      }, false);
    });

    const sale = {
      id,
      codigo,
      dataHora,
      itens: saleData.itens,
      valorTotal: Number(saleData.valorTotal),
      formaPagamento: saleData.formaPagamento || 'PIX',
      status: 'concluida'
    };

    this.sales.unshift(sale);
    this.save(STORAGE_KEYS.SALES, this.sales);
    this.notify();
    return sale;
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.save(STORAGE_KEYS.SETTINGS, this.settings);

    // Broadcast visual effect change to neonCanvas
    if (newSettings.preferencias && newSettings.preferencias.visualEffects) {
      window.dispatchEvent(new CustomEvent('stockpro:setting-changed', {
        detail: { key: 'visualEffects', value: newSettings.preferencias.visualEffects }
      }));
    }

    this.notify();
  }

  // --- ANALYTICAL CALCULATORS ---

  getDashboardMetrics(periodo = '30d') {
    const totalProdutos = this.products.length;
    const totalEmEstoque = this.products.reduce((acc, p) => acc + (p.estoque || 0), 0);
    const produtosEstoqueBaixo = this.products.filter(p => p.status === 'baixo' || p.status === 'esgotado').length;
    const totalVendasPeriodo = this.sales.reduce((acc, s) => acc + (s.valorTotal || 0), 0);
    const totalQtdVendas = this.sales.length;

    return {
      totalProdutos,
      totalEmEstoque,
      produtosEstoqueBaixo,
      totalVendasPeriodo,
      totalQtdVendas,
      variacaoProdutos: '+12%',
      variacaoEstoque: '+8%',
      variacaoEstoqueBaixo: '-3%',
      variacaoVendas: '+18.4%'
    };
  }

  getSalesAnalytics(periodo = '30d', filtroCategoria = 'todas', filtroProduto = 'todos') {
    let filteredSales = [...this.sales];

    // Filter by product or category if specified
    if (filtroCategoria !== 'todas') {
      filteredSales = filteredSales.filter(s =>
        s.itens.some(item => {
          const prod = this.products.find(p => p.id === item.produtoId);
          return prod && prod.categoria === filtroCategoria;
        })
      );
    }

    if (filtroProduto !== 'todos') {
      filteredSales = filteredSales.filter(s =>
        s.itens.some(item => item.produtoId === filtroProduto)
      );
    }

    const faturamentoTotal = filteredSales.reduce((acc, s) => acc + (s.valorTotal || 0), 0);
    const totalVendas = filteredSales.length;
    const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;

    // Calculate units sold per product
    const productQuantities = {};
    const productRevenues = {};

    filteredSales.forEach(s => {
      s.itens.forEach(item => {
        productQuantities[item.produtoId] = (productQuantities[item.produtoId] || 0) + item.quantidade;
        productRevenues[item.produtoId] = (productRevenues[item.produtoId] || 0) + item.subtotal;
      });
    });

    const totalUnidadesVendidas = Object.values(productQuantities).reduce((a, b) => a + b, 0);

    // Ranking Top 10 Mais Vendidos (unidades)
    const rankingMaisVendidos = Object.keys(productQuantities).map(prodId => {
      const prod = this.products.find(p => p.id === prodId);
      const qtd = productQuantities[prodId];
      const receita = productRevenues[prodId] || 0;
      const pct = totalUnidadesVendidas > 0 ? ((qtd / totalUnidadesVendidas) * 100).toFixed(1) : 0;
      return {
        id: prodId,
        nome: prod ? prod.nome : 'Produto ' + prodId,
        categoria: prod ? prod.categoria : 'Geral',
        quantidade: qtd,
        faturamento: receita,
        participacao: Number(pct)
      };
    }).sort((a, b) => b.quantidade - a.quantidade);

    const produtoMaisVendido = rankingMaisVendidos[0] || { nome: 'Nenhum', quantidade: 0, faturamento: 0 };

    // Ranking por Faturamento (R$)
    const rankingFaturamento = [...rankingMaisVendidos].sort((a, b) => b.faturamento - a.faturamento);

    // Gráfico 2: Produtos que mais saíram do estoque (distinção entre Vendas, Perdas, Avarias, etc.)
    const saidasPorMotivo = {};
    const saidasPorProduto = {};

    this.movements.filter(m => m.tipo !== 'entrada' && m.tipo !== 'devolucao').forEach(m => {
      const p = this.products.find(pr => pr.id === m.produtoId);
      const pNome = p ? p.nome : 'Item';
      
      saidasPorMotivo[m.motivo] = (saidasPorMotivo[m.motivo] || 0) + m.quantidade;
      if (!saidasPorProduto[m.produtoId]) {
        saidasPorProduto[m.produtoId] = {
          nome: pNome,
          vendas: 0,
          perdas: 0,
          avarias: 0,
          outros: 0,
          total: 0
        };
      }
      saidasPorProduto[m.produtoId].total += m.quantidade;
      if (m.tipo === 'saida' && m.motivo.toLowerCase().includes('venda')) {
        saidasPorProduto[m.produtoId].vendas += m.quantidade;
      } else if (m.tipo === 'perda') {
        saidasPorProduto[m.produtoId].perdas += m.quantidade;
      } else if (m.tipo === 'avaria') {
        saidasPorProduto[m.produtoId].avarias += m.quantidade;
      } else {
        saidasPorProduto[m.produtoId].outros += m.quantidade;
      }
    });

    const rankingSaidas = Object.values(saidasPorProduto).sort((a, b) => b.total - a.total);

    // Vendas por Categoria
    const categoriasVendas = {};
    filteredSales.forEach(s => {
      s.itens.forEach(item => {
        const prod = this.products.find(p => p.id === item.produtoId);
        const cat = prod ? prod.categoria : 'Outros';
        categoriasVendas[cat] = (categoriasVendas[cat] || 0) + item.subtotal;
      });
    });

    const categoriesArray = Object.keys(categoriasVendas).map(cat => ({
      nome: cat,
      faturamento: categoriasVendas[cat],
      percentual: faturamentoTotal > 0 ? ((categoriasVendas[cat] / faturamentoTotal) * 100).toFixed(1) : 0
    }));

    // Faturamento ao longo do tempo (evolução dos últimos dias)
    const revenueTimeline = [
      { data: '09/10', faturamento: 192.80, pedidos: 1 },
      { data: '10/10', faturamento: 493.50, pedidos: 1 },
      { data: '11/10', faturamento: 165.35, pedidos: 1 },
      { data: '12/10', faturamento: 289.20, pedidos: 2 },
      { data: '13/10', faturamento: 251.48, pedidos: 1 },
      { data: '14/10', faturamento: 39.32, pedidos: 1 },
      { data: '15/10', faturamento: 107.50, pedidos: 1 }
    ];

    return {
      faturamentoTotal,
      totalUnidadesVendidas,
      totalVendas,
      ticketMedio,
      produtoMaisVendido,
      rankingMaisVendidos,
      rankingFaturamento,
      rankingSaidas,
      categoriesArray,
      revenueTimeline,
      filteredSales
    };
  }

  // --- HELPERS ---

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split(' ')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  }

  formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  }

  exportToCSV(type = 'produtos') {
    let rows = [];
    let filename = `stockpro_${type}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'produtos') {
      rows.push(['ID', 'Código', 'SKU', 'Nome', 'Categoria', 'Estoque', 'Estoque Mínimo', 'Preço Custo (R$)', 'Preço Venda (R$)', 'Status']);
      this.products.forEach(p => {
        rows.push([p.id, p.codigo, p.sku, `"${p.nome}"`, p.categoria, p.estoque, p.estoqueMinimo, p.precoCusto.toFixed(2), p.precoVenda.toFixed(2), p.status]);
      });
    } else if (type === 'vendas') {
      rows.push(['Código Venda', 'Data/Hora', 'Valor Total (R$)', 'Forma Pagamento', 'Status']);
      this.sales.forEach(s => {
        rows.push([s.codigo, s.dataHora, s.valorTotal.toFixed(2), s.formaPagamento, s.status]);
      });
    } else if (type === 'movimentacoes') {
      rows.push(['Data/Hora', 'Produto', 'Tipo', 'Quantidade', 'Motivo', 'Usuário', 'Referência']);
      this.movements.forEach(m => {
        const p = this.products.find(pr => pr.id === m.produtoId);
        rows.push([m.dataHora, `"${p ? p.nome : m.produtoId}"`, m.tipo, m.quantidade, `"${m.motivo}"`, m.usuario, m.referencia]);
      });
    } else if (type === 'lotes') {
      rows.push(['Produto', 'Código Lote', 'Quantidade', 'Entrada', 'Validade', 'Dias Restantes', 'Status']);
      this.lots.forEach(l => {
        const p = this.products.find(pr => pr.id === l.produtoId);
        rows.push([`"${p ? p.nome : l.produtoId}"`, l.codigoLote, l.quantidade, l.dataEntrada, l.dataValidade, l.diasRestantes, l.status]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.LOTS);
    localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.products = [...INITIAL_PRODUCTS];
    this.lots = [...INITIAL_LOTS];
    this.movements = [...INITIAL_MOVEMENTS];
    this.sales = [...INITIAL_SALES];
    this.settings = { ...INITIAL_SETTINGS };
    this.notify();
  }
}

// Global data store instance
window.dataStore = new DataStore();
