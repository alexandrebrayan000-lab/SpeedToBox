export interface Product {
  id: string;
  codigo: string;
  sku: string;
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  precoCusto: number;
  precoVenda: number;
  unidade: string;
  status: 'normal' | 'baixo' | 'esgotado';
}

export interface Lot {
  id: string;
  produtoId: string;
  codigoLote: string;
  quantidade: number;
  dataEntrada: string;
  dataValidade: string;
  status: 'normal' | 'proximo_vencimento' | 'vencido' | 'esgotado';
}

export interface Movement {
  id: string;
  dataHora: string;
  produtoId: string;
  tipo: 'entrada' | 'saida' | 'perda' | 'avaria';
  quantidade: number;
  motivo: string;
  loteId: string | null;
  usuario: string;
  referencia: string;
}

export interface SaleItem {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  codigo: string;
  dataHora: string;
  itens: SaleItem[];
  valorTotal: number;
  formaPagamento: string;
  status: 'concluida' | 'cancelada';
}

export interface Settings {
  empresa: {
    nome: string;
    cnpj: string;
    email: string;
    moeda: string;
    timezone: string;
  };
  usuario: {
    nome: string;
    cargo: string;
    email: string;
    avatar: string;
  };
  preferencias: {
    visualEffects: 'alta' | 'media' | 'sutil' | 'desativada';
    reducedMotion: boolean;
    neonIntensity: 'alta' | 'media' | 'sutil';
    tableDensity: 'confortavel' | 'compacta';
    alertThresholdDays: number;
  };
}

export interface Alert {
  id: string;
  tipo: 'estoque_zerado' | 'estoque_baixo' | 'lote_vencido' | 'lote_proximo_vencimento';
  prioridade: 'alta' | 'media' | 'baixa';
  titulo: string;
  mensagem: string;
  produtoId?: string;
  loteId?: string;
  dataGeracao: string;
}

export interface DashboardMetrics {
  totalProdutos: number;
  totalEmEstoque: number;
  totalEstoqueBaixo: number;
  vendasPeriodoValor: number;
  vendasPeriodoQtd: number;
  variacaoProdutos: string;
  variacaoEstoque: string;
  variacaoBaixo: string;
  variacaoVendas: string;
}

export interface SalesAnalytics {
  faturamentoTotal: number;
  unidadesVendidas: number;
  totalPedidos: number;
  ticketMedio: number;
  produtoDestaqueNome: string;
  produtoDestaqueQtd: number;
  topSellers: Array<{
    produtoId: string;
    nome: string;
    sku: string;
    categoria: string;
    quantidade: number;
    receita: number;
    percentual: number;
  }>;
  exitsBreakdown: {
    vendas: number;
    perdas: number;
    avarias: number;
    total: number;
  };
  timelineData: {
    labels: string[];
    values: number[];
  };
  categoryDistribution: {
    labels: string[];
    values: number[];
  };
}

export interface ToastMessage {
  id: string;
  tipo: 'success' | 'error' | 'info';
  titulo?: string;
  mensagem: string;
}
