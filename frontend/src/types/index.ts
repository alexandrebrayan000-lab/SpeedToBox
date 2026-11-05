// SpeedToBox — Tipos e Modelos de Domínio
// Baseado nas especificações oficiais do Docs.md & Briefing

export type UnidadeMedida = 'UN' | 'KG' | 'L' | 'CX' | 'PCT';
export type StatusProduto = 'normal' | 'baixo' | 'esgotado';
export type StatusLote = 'normal' | 'proximo_vencimento' | 'vencido' | 'esgotado';
export type TipoMovimentacao = 'entrada' | 'saida' | 'perda' | 'avaria';
export type FormaPagamento = 'PIX' | 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto';

export interface Produto {
  id: string;
  codigo: string;
  sku: string;
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  precoCusto: number;
  precoVenda: number;
  unidade: UnidadeMedida;
  status: StatusProduto;
  ativo: boolean;
}

export interface Lote {
  id: string;
  produtoId: string;
  codigoLote: string;
  quantidade: number;
  quantidadeInicial: number;
  dataEntrada: string;
  dataValidade: string;
  status: StatusLote;
}

export interface Movimentacao {
  id: string;
  dataHora: string;
  produtoId: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  custoUnitario?: number;
  motivo: string;
  loteId?: string | null;
  usuario: string;
  referencia: string;
}

export interface ItemVenda {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  codigo: string;
  dataHora: string;
  itens: ItemVenda[];
  valorTotal: number;
  formaPagamento: FormaPagamento;
  status: 'concluida' | 'cancelada';
}

export interface Alerta {
  id: string;
  tipo: 'estoque_zerado' | 'estoque_baixo' | 'lote_vencido' | 'lote_proximo_vencimento';
  prioridade: 'alta' | 'media' | 'baixa';
  titulo: string;
  mensagem: string;
  produtoId?: string;
  loteId?: string;
  dataGeracao: string;
  resolvido?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  texto: string;
  dataHora: string;
  sugestoes?: string[];
}

export interface Usuario {
  id: string;
  nome: string;
  cargo: string;
  email?: string;
  avatarUrl?: string;
}

export interface EstabelecimentoConfig {
  nome: string;
  cnpj: string;
  email: string;
  cidade: string;
  uf: string;
  gestores: string;
  janelaAlertaValidadeDias: number;
}

export interface DashboardMetrics {
  totalProdutos: number;
  totalEmEstoque: number;
  totalEstoqueBaixo: number;
  totalLotesProximosVencimento: number;
  vendasPeriodoValor: number;
  vendasPeriodoQtd: number;
  ticketMedio: number;
  variacaoProdutos: string;
  variacaoEstoque: string;
  variacaoVendas: string;
}
