'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Lot,
  Movement,
  Sale,
  Settings,
  Alert,
  DashboardMetrics,
  SalesAnalytics,
  ToastMessage
} from '../types';

const INITIAL_PRODUCTS: Product[] = [
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

const INITIAL_LOTS: Lot[] = [
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

const INITIAL_MOVEMENTS: Movement[] = [
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

const INITIAL_SALES: Sale[] = [
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

const INITIAL_SETTINGS: Settings = {
  empresa: {
    nome: 'SpeedToBox Comércio & Logística LTDA',
    cnpj: '48.912.840/0001-92',
    email: 'contato@speedtobox.com.br',
    moeda: 'BRL',
    timezone: 'America/Sao_Paulo'
  },
  usuario: {
    nome: 'Brayan & Mylenna',
    cargo: 'Gestores do Estabelecimento',
    email: 'admin@speedtobox.com',
    avatar: 'ST'
  },
  preferencias: {
    visualEffects: 'alta',
    reducedMotion: false,
    neonIntensity: 'alta',
    tableDensity: 'confortavel',
    alertThresholdDays: 30
  }
};

interface MovementModalState {
  isOpen: boolean;
  tipo: 'entrada' | 'saida' | 'perda' | 'avaria';
  productId?: string;
}

interface ReportPreviewState {
  isOpen: boolean;
  reportKey: string;
  reportTitle: string;
}

interface StoreContextType {
  products: Product[];
  lots: Lot[];
  movements: Movement[];
  sales: Sale[];
  settings: Settings;
  alerts: Alert[];
  toasts: ToastMessage[];
  isHydrated: boolean;

  // Actions
  addProduct: (product: Omit<Product, 'id' | 'codigo' | 'status'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addLot: (lot: Omit<Lot, 'id' | 'status'>) => void;
  updateLot: (id: string, updates: Partial<Lot>) => void;
  addMovement: (movement: Omit<Movement, 'id' | 'dataHora'>) => void;
  addSale: (sale: { itens: Array<{ produtoId: string; quantidade: number; precoUnitario: number }>; formaPagamento: string }) => boolean;
  updateSettings: (newSettings: Settings) => void;
  exportToCSV: (type: 'produtos' | 'lotes' | 'movimentacoes' | 'vendas') => void;
  getDashboardMetrics: (periodo?: 'hoje' | '7d' | '30d') => DashboardMetrics;
  getSalesAnalytics: (periodo?: string, categoria?: string, produto?: string) => SalesAnalytics;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonStr: string) => boolean;
  resetToDefaultData: () => void;

  // Modals & UI
  isNewProductOpen: boolean;
  setIsNewProductOpen: (open: boolean) => void;
  isNewSaleOpen: boolean;
  setIsNewSaleOpen: (open: boolean) => void;
  movementModal: MovementModalState;
  setMovementModal: (state: MovementModalState) => void;
  reportPreview: ReportPreviewState;
  setReportPreview: (state: ReportPreviewState) => void;

  // Toasts
  showToast: (mensagem: string, tipo?: 'success' | 'error' | 'info', titulo?: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [lots, setLots] = useState<Lot[]>(INITIAL_LOTS);
  const [movements, setMovements] = useState<Movement[]>(INITIAL_MOVEMENTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Modals
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [movementModal, setMovementModal] = useState<MovementModalState>({ isOpen: false, tipo: 'entrada' });
  const [reportPreview, setReportPreview] = useState<ReportPreviewState>({ isOpen: false, reportKey: '', reportTitle: '' });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const p = localStorage.getItem('speedtobox_products_v2');
      if (p) setProducts(JSON.parse(p));
      const l = localStorage.getItem('speedtobox_lots_v2');
      if (l) setLots(JSON.parse(l));
      const m = localStorage.getItem('speedtobox_movements_v2');
      if (m) setMovements(JSON.parse(m));
      const s = localStorage.getItem('speedtobox_sales_v2');
      if (s) setSales(JSON.parse(s));
      const cfg = localStorage.getItem('speedtobox_settings_v2');
      if (cfg) setSettings(JSON.parse(cfg));
    } catch (e) {
      console.warn('Error hydrating store from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('speedtobox_products_v2', JSON.stringify(products));
      localStorage.setItem('speedtobox_lots_v2', JSON.stringify(lots));
      localStorage.setItem('speedtobox_movements_v2', JSON.stringify(movements));
      localStorage.setItem('speedtobox_sales_v2', JSON.stringify(sales));
      localStorage.setItem('speedtobox_settings_v2', JSON.stringify(settings));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  }, [products, lots, movements, sales, settings, isHydrated]);

  // Recalculate alerts whenever products or lots change
  useEffect(() => {
    const today = new Date('2026-10-16');
    const thresholdDays = settings.preferencias.alertThresholdDays || 30;
    const newAlerts: Alert[] = [];

    // Products alerts
    products.forEach(p => {
      if (p.estoque === 0) {
        newAlerts.push({
          id: `alert_prod_zero_${p.id}`,
          tipo: 'estoque_zerado',
          prioridade: 'alta',
          titulo: 'Estoque Esgotado',
          mensagem: `O produto "${p.nome}" está com saldo 0 no catálogo.`,
          produtoId: p.id,
          dataGeracao: '2026-10-16 08:00'
        });
      } else if (p.estoque <= p.estoqueMinimo) {
        newAlerts.push({
          id: `alert_prod_low_${p.id}`,
          tipo: 'estoque_baixo',
          prioridade: 'media',
          titulo: 'Estoque Baixo',
          mensagem: `"${p.nome}" possui apenas ${p.estoque} ${p.unidade} (Mínimo: ${p.estoqueMinimo}).`,
          produtoId: p.id,
          dataGeracao: '2026-10-16 08:00'
        });
      }
    });

    // Lots alerts
    lots.forEach(lot => {
      if (lot.quantidade <= 0) return;
      const validade = new Date(lot.dataValidade);
      const diffTime = validade.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const prod = products.find(p => p.id === lot.produtoId);
      const prodName = prod ? prod.nome : 'Produto';

      if (diffDays < 0) {
        newAlerts.push({
          id: `alert_lot_exp_${lot.id}`,
          tipo: 'lote_vencido',
          prioridade: 'alta',
          titulo: 'Lote Vencido!',
          mensagem: `${lot.codigoLote} (${prodName}) venceu há ${Math.abs(diffDays)} dias (${lot.quantidade} un).`,
          produtoId: lot.produtoId,
          loteId: lot.id,
          dataGeracao: '2026-10-16 08:00'
        });
      } else if (diffDays <= thresholdDays) {
        newAlerts.push({
          id: `alert_lot_near_${lot.id}`,
          tipo: 'lote_proximo_vencimento',
          prioridade: diffDays <= 7 ? 'alta' : 'media',
          titulo: 'Vencimento Próximo',
          mensagem: `${lot.codigoLote} (${prodName}) vence em ${diffDays} dias (${lot.quantidade} un).`,
          produtoId: lot.produtoId,
          loteId: lot.id,
          dataGeracao: '2026-10-16 08:00'
        });
      }
    });

    setAlerts(newAlerts);
  }, [products, lots, settings.preferencias.alertThresholdDays]);

  const showToast = (mensagem: string, tipo: 'success' | 'error' | 'info' = 'info', titulo?: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, tipo, titulo, mensagem }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addProduct = (p: Omit<Product, 'id' | 'codigo' | 'status'>) => {
    const newId = 'prod_' + (products.length + 1);
    const codigo = String(products.length + 1).padStart(3, '0');
    const status: Product['status'] = p.estoque === 0 ? 'esgotado' : p.estoque <= p.estoqueMinimo ? 'baixo' : 'normal';
    const newProd: Product = { ...p, id: newId, codigo, status };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Produto "${p.nome}" cadastrado com sucesso!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, ...updates };
      updated.status = updated.estoque === 0 ? 'esgotado' : updated.estoque <= updated.estoqueMinimo ? 'baixo' : 'normal';
      return updated;
    }));
    showToast('Produto atualizado com sucesso.', 'info');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Produto removido.', 'info');
  };

  const addLot = (lotData: Omit<Lot, 'id' | 'status'>) => {
    const newId = 'lot_' + (lots.length + 1);
    const today = new Date('2026-10-16');
    const validade = new Date(lotData.dataValidade);
    const diffDays = Math.ceil((validade.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let status: Lot['status'] = 'normal';
    if (diffDays < 0) status = 'vencido';
    else if (diffDays <= 30) status = 'proximo_vencimento';

    const newLot: Lot = { ...lotData, id: newId, status };
    setLots(prev => [newLot, ...prev]);
    showToast(`Lote "${lotData.codigoLote}" registrado com sucesso.`, 'success');
  };

  const updateLot = (id: string, updates: Partial<Lot>) => {
    setLots(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    showToast('Lote atualizado.', 'info');
  };

  const addMovement = (movData: Omit<Movement, 'id' | 'dataHora'>) => {
    const now = new Date();
    const dataHora = now.toISOString().replace('T', ' ').substring(0, 16);
    const newMov: Movement = {
      ...movData,
      id: 'mov_' + (movements.length + 1),
      dataHora
    };

    // Update product stock
    setProducts(prev => prev.map(p => {
      if (p.id !== movData.produtoId) return p;
      let newStock = p.estoque;
      if (movData.tipo === 'entrada') {
        newStock += movData.quantidade;
      } else {
        newStock = Math.max(0, newStock - movData.quantidade);
      }
      const status: Product['status'] = newStock === 0 ? 'esgotado' : newStock <= p.estoqueMinimo ? 'baixo' : 'normal';
      return { ...p, estoque: newStock, status };
    }));

    // If movement is linked to a lot
    if (movData.loteId) {
      setLots(prev => prev.map(l => {
        if (l.id !== movData.loteId) return l;
        let newQty = l.quantidade;
        if (movData.tipo === 'entrada') {
          newQty += movData.quantidade;
        } else {
          newQty = Math.max(0, newQty - movData.quantidade);
        }
        return { ...l, quantidade: newQty };
      }));
    }

    setMovements(prev => [newMov, ...prev]);
    showToast(`Movimentação (${movData.tipo.toUpperCase()}) registrada com sucesso!`, 'success');
  };

  const addSale = (saleData: { itens: Array<{ produtoId: string; quantidade: number; precoUnitario: number }>; formaPagamento: string }) => {
    // Validate stock
    for (const item of saleData.itens) {
      const prod = products.find(p => p.id === item.produtoId);
      if (!prod) {
        showToast('Produto não encontrado.', 'error');
        return false;
      }
      if (prod.estoque < item.quantidade) {
        showToast(`Saldo insuficiente para "${prod.nome}". Disponível: ${prod.estoque}`, 'error', 'Erro na Venda');
        return false;
      }
    }

    const now = new Date();
    const dataHora = now.toISOString().replace('T', ' ').substring(0, 16);
    const saleId = 'sale_' + (sales.length + 1);
    const codigo = 'VND-' + (1100 + sales.length);

    let valorTotal = 0;
    const saleItems = saleData.itens.map(it => {
      const subtotal = it.quantidade * it.precoUnitario;
      valorTotal += subtotal;
      return { ...it, subtotal };
    });

    const newSale: Sale = {
      id: saleId,
      codigo,
      dataHora,
      itens: saleItems,
      valorTotal,
      formaPagamento: saleData.formaPagamento,
      status: 'concluida'
    };

    // Deduct stock and log movements
    const newMovements: Movement[] = [];
    setProducts(prev => prev.map(p => {
      const soldItem = saleData.itens.find(it => it.produtoId === p.id);
      if (!soldItem) return p;
      const newStock = Math.max(0, p.estoque - soldItem.quantidade);

      newMovements.push({
        id: 'mov_' + Date.now() + Math.random().toString(36).substring(2, 5),
        dataHora,
        produtoId: p.id,
        tipo: 'saida',
        quantidade: soldItem.quantidade,
        motivo: 'Venda Comercial',
        loteId: null,
        usuario: settings.usuario.nome || 'Operador',
        referencia: codigo
      });

      const status: Product['status'] = newStock === 0 ? 'esgotado' : newStock <= p.estoqueMinimo ? 'baixo' : 'normal';
      return { ...p, estoque: newStock, status };
    }));

    setMovements(prev => [...newMovements, ...prev]);
    setSales(prev => [newSale, ...prev]);

    showToast(`Venda ${codigo} de R$ ${valorTotal.toFixed(2)} confirmada!`, 'success');
    return true;
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    showToast('Configurações salvas e aplicadas em todo o sistema!', 'success');
  };

  const getDashboardMetrics = (periodo: 'hoje' | '7d' | '30d' = '30d'): DashboardMetrics => {
    const totalProdutos = products.length;
    const totalEmEstoque = products.reduce((acc, p) => acc + p.estoque, 0);
    const totalEstoqueBaixo = products.filter(p => p.status === 'baixo' || p.status === 'esgotado').length;

    let totalVendas = 0;
    let qtdVendas = 0;
    sales.forEach(s => {
      if (s.status === 'concluida') {
        totalVendas += s.valorTotal;
        qtdVendas += s.itens.reduce((acc, it) => acc + it.quantidade, 0);
      }
    });

    return {
      totalProdutos,
      totalEmEstoque,
      totalEstoqueBaixo,
      vendasPeriodoValor: totalVendas,
      vendasPeriodoQtd: qtdVendas,
      variacaoProdutos: '+12%',
      variacaoEstoque: '+4.2%',
      variacaoBaixo: totalEstoqueBaixo > 0 ? 'Atenção' : 'Excelente',
      variacaoVendas: '+18.5%'
    };
  };

  const getSalesAnalytics = (periodo: string = '30d', categoria: string = 'todas', produto: string = 'todos'): SalesAnalytics => {
    const productSalesMap: Record<string, { qtd: number; receita: number }> = {};
    const categoryRevenueMap: Record<string, number> = {};
    let faturamentoTotal = 0;
    let unidadesVendidas = 0;
    let totalPedidos = 0;

    sales.forEach(sale => {
      if (sale.status !== 'concluida') return;
      totalPedidos++;

      sale.itens.forEach(it => {
        const prod = products.find(p => p.id === it.produtoId);
        if (!prod) return;
        if (categoria !== 'todas' && prod.categoria !== categoria) return;
        if (produto !== 'todos' && prod.id !== produto) return;

        faturamentoTotal += it.subtotal;
        unidadesVendidas += it.quantidade;

        if (!productSalesMap[prod.id]) {
          productSalesMap[prod.id] = { qtd: 0, receita: 0 };
        }
        productSalesMap[prod.id].qtd += it.quantidade;
        productSalesMap[prod.id].receita += it.subtotal;

        categoryRevenueMap[prod.categoria] = (categoryRevenueMap[prod.categoria] || 0) + it.subtotal;
      });
    });

    const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;

    const topSellers = Object.keys(productSalesMap).map(pId => {
      const prod = products.find(p => p.id === pId)!;
      const data = productSalesMap[pId];
      return {
        produtoId: pId,
        nome: prod.nome,
        sku: prod.sku,
        categoria: prod.categoria,
        quantidade: data.qtd,
        receita: data.receita,
        percentual: faturamentoTotal > 0 ? Math.round((data.receita / faturamentoTotal) * 100) : 0
      };
    }).sort((a, b) => b.quantidade - a.quantidade);

    const produtoDestaqueNome = topSellers[0] ? topSellers[0].nome : 'Nenhum';
    const produtoDestaqueQtd = topSellers[0] ? topSellers[0].quantidade : 0;

    // Exits breakdown
    let saidasVendas = 0;
    let saidasPerdas = 0;
    let saidasAvarias = 0;
    movements.forEach(m => {
      if (m.tipo === 'saida') saidasVendas += m.quantidade;
      if (m.tipo === 'perda') saidasPerdas += m.quantidade;
      if (m.tipo === 'avaria') saidasAvarias += m.quantidade;
    });

    return {
      faturamentoTotal,
      unidadesVendidas,
      totalPedidos,
      ticketMedio,
      produtoDestaqueNome,
      produtoDestaqueQtd,
      topSellers,
      exitsBreakdown: {
        vendas: saidasVendas,
        perdas: saidasPerdas,
        avarias: saidasAvarias,
        total: saidasVendas + saidasPerdas + saidasAvarias
      },
      timelineData: {
        labels: ['02/10', '04/10', '06/10', '08/10', '10/10', '12/10', '14/10', '16/10'],
        values: [1316, 349, 999, 289, 493, 192, 290, 107]
      },
      categoryDistribution: {
        labels: Object.keys(categoryRevenueMap),
        values: Object.values(categoryRevenueMap)
      }
    };
  };

  const exportToCSV = (type: 'produtos' | 'lotes' | 'movimentacoes' | 'vendas') => {
    let csv = '';
    let filename = `SpeedToBox_${type}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'produtos') {
      csv = 'ID,Codigo,SKU,Nome,Categoria,Estoque,EstoqueMinimo,PrecoCusto,PrecoVenda,Status\n';
      products.forEach(p => {
        csv += `"${p.id}","${p.codigo}","${p.sku}","${p.nome}","${p.categoria}",${p.estoque},${p.estoqueMinimo},${p.precoCusto},${p.precoVenda},"${p.status}"\n`;
      });
    } else if (type === 'lotes') {
      csv = 'ID,CodigoLote,Produto,Quantidade,DataEntrada,DataValidade,Status\n';
      lots.forEach(l => {
        const prod = products.find(p => p.id === l.produtoId);
        csv += `"${l.id}","${l.codigoLote}","${prod ? prod.nome : ''}",${l.quantidade},"${l.dataEntrada}","${l.dataValidade}","${l.status}"\n`;
      });
    } else if (type === 'movimentacoes') {
      csv = 'ID,DataHora,Produto,Tipo,Quantidade,Motivo,Referencia,Usuario\n';
      movements.forEach(m => {
        const prod = products.find(p => p.id === m.produtoId);
        csv += `"${m.id}","${m.dataHora}","${prod ? prod.nome : ''}","${m.tipo}",${m.quantidade},"${m.motivo}","${m.referencia}","${m.usuario}"\n`;
      });
    } else if (type === 'vendas') {
      csv = 'ID,Codigo,DataHora,ValorTotal,FormaPagamento,Status\n';
      sales.forEach(s => {
        csv += `"${s.id}","${s.codigo}","${s.dataHora}",${s.valorTotal},"${s.formaPagamento}","${s.status}"\n`;
      });
    }

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    showToast(`Arquivo "${filename}" baixado com sucesso!`, 'success');
  };

  const exportBackupJSON = () => {
    const backup = {
      version: '2.0-speedtobox',
      date: new Date().toISOString(),
      products,
      lots,
      movements,
      sales,
      settings
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SpeedToBox_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('Backup exportado em formato JSON.', 'success');
  };

  const importBackupJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products) setProducts(data.products);
      if (data.lots) setLots(data.lots);
      if (data.movements) setMovements(data.movements);
      if (data.sales) setSales(data.sales);
      if (data.settings) setSettings(data.settings);
      showToast('Backup restaurado com sucesso!', 'success');
      return true;
    } catch (e) {
      showToast('Erro ao importar arquivo JSON inválido.', 'error');
      return false;
    }
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setLots(INITIAL_LOTS);
    setMovements(INITIAL_MOVEMENTS);
    setSales(INITIAL_SALES);
    setSettings(INITIAL_SETTINGS);
    showToast('Dados reinicializados para o padrão de demonstração!', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        lots,
        movements,
        sales,
        settings,
        alerts,
        toasts,
        isHydrated,
        addProduct,
        updateProduct,
        deleteProduct,
        addLot,
        updateLot,
        addMovement,
        addSale,
        updateSettings,
        exportToCSV,
        getDashboardMetrics,
        getSalesAnalytics,
        exportBackupJSON,
        importBackupJSON,
        resetToDefaultData,
        isNewProductOpen,
        setIsNewProductOpen,
        isNewSaleOpen,
        setIsNewSaleOpen,
        movementModal,
        setMovementModal,
        reportPreview,
        setReportPreview,
        showToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
