'use client';

import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  CalendarClock,
  FileSpreadsheet,
  Eye,
  Download,
  Printer,
  X,
  CheckCircle2,
  Building2,
  Clock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ReportItem {
  id: string;
  key: string;
  title: string;
  desc: string;
}

interface ReportSection {
  title: string;
  icon: typeof Package;
  color: string;
  iconBg: string;
  reports: ReportItem[];
}

export function RelatoriosPage() {
  const { produtos, lotes, movimentacoes, vendas, metrics, config } = useStore();
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    reportKey: string;
    reportTitle: string;
  }>({
    isOpen: false,
    reportKey: '',
    reportTitle: ''
  });

  const showToast = (msg: string) => {
    setDownloadNotification(msg);
    setTimeout(() => {
      setDownloadNotification(null);
    }, 3500);
  };

  const reportSections: ReportSection[] = [
    {
      title: 'Estoque & Armazenagem',
      icon: Package,
      color: 'text-cyan-400',
      iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      reports: [
        {
          id: 'prod-geral',
          key: 'produtos-geral',
          title: 'Posição Geral de Estoque',
          desc: 'Catálogo consolidado, saldo atual, custo médio, preço de venda e valor total do estoque.'
        },
        {
          id: 'prod-baixo',
          key: 'produtos-baixo',
          title: 'Produtos em Estoque Baixo',
          desc: 'Listagem de itens atingindo o ponto de reposição com sugestão de compra emergencial.'
        },
        {
          id: 'prod-inventario',
          key: 'produtos-inventario',
          title: 'Inventário Físico & Auditoria',
          desc: 'Folha de conferência cega para contagem periódica e conciliação de saldos em prateleira.'
        },
        {
          id: 'mov-historico',
          key: 'movimentacoes',
          title: 'Histórico de Movimentações',
          desc: 'Extrato completo de todas as entradas, saídas, avarias e transferências com rastreio de usuário.'
        }
      ]
    },
    {
      title: 'Vendas & Desempenho Comercial',
      icon: TrendingUp,
      color: 'text-purple-400',
      iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      reports: [
        {
          id: 'vendas-abc',
          key: 'vendas-abc',
          title: 'Curva ABC de Vendas',
          desc: 'Classificação de produtos por volume de saída e representatividade no faturamento total.'
        },
        {
          id: 'vendas-periodo',
          key: 'vendas-periodo',
          title: 'Faturamento por Período',
          desc: 'Evolução de vendas concluídas no PDV com detalhamento das formas de pagamento.'
        },
        {
          id: 'vendas-categoria',
          key: 'vendas-categoria',
          title: 'Desempenho por Categoria',
          desc: 'Faturamento consolidado dividido pelos departamentos e segmentos do estabelecimento.'
        },
        {
          id: 'vendas-ticket',
          key: 'vendas-ticket',
          title: 'Ticket Médio & Eficiência',
          desc: 'Métricas de conversão de caixa, ticket médio e quantidade média de itens por pedido.'
        }
      ]
    },
    {
      title: 'Validades & Lotes (FIFO)',
      icon: CalendarClock,
      color: 'text-amber-400',
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      reports: [
        {
          id: 'lotes-vencendo',
          key: 'lotes-vencendo',
          title: 'Lotes Próximos do Vencimento',
          desc: 'Lotes que vencem nos próximos 30 dias para priorização imediata e liquidação (FIFO).'
        },
        {
          id: 'lotes-vencidos',
          key: 'lotes-vencidos',
          title: 'Auditoria de Produtos Vencidos',
          desc: 'Relatório para descarte fiscal, segregação de itens e baixa contábil de mercadorias expiradas.'
        },
        {
          id: 'lotes-rastreabilidade',
          key: 'lotes-rastreabilidade',
          title: 'Rastreabilidade Completa de Lotes',
          desc: 'Histórico de origem, data de entrada, data de validade e saldo restante por lote.'
        }
      ]
    }
  ];

  // Gerador de Dados CSV
  const gerarLinhasCSV = (key: string): { filename: string; rows: (string | number)[][] } => {
    const hojeStr = new Date().toISOString().slice(0, 10);

    if (key === 'produtos-geral') {
      const rows: (string | number)[][] = [
        ['CÓDIGO', 'SKU', 'NOME', 'CATEGORIA', 'ESTOQUE FÍSICO', 'ESTOQUE MÍNIMO', 'PREÇO CUSTO (R$)', 'PREÇO VENDA (R$)', 'VALOR EM ESTOQUE (R$)', 'STATUS']
      ];
      produtos.forEach(p => {
        const totalValor = p.estoque * p.precoCusto;
        rows.push([p.codigo, p.sku, `"${p.nome}"`, p.categoria, p.estoque, p.estoqueMinimo, p.precoCusto.toFixed(2), p.precoVenda.toFixed(2), totalValor.toFixed(2), p.status]);
      });
      return { filename: `speedtobox_posicao_estoque_${hojeStr}.csv`, rows };
    }

    if (key === 'produtos-baixo') {
      const rows: (string | number)[][] = [
        ['CÓDIGO', 'NOME', 'CATEGORIA', 'ESTOQUE ATUAL', 'ESTOQUE MÍNIMO', 'DÉFICIT / SUGESTÃO DE COMPRA', 'CUSTO UNIT. (R$)']
      ];
      produtos.filter(p => p.estoque <= p.estoqueMinimo).forEach(p => {
        const deficit = Math.max(0, p.estoqueMinimo * 2 - p.estoque);
        rows.push([p.codigo, `"${p.nome}"`, p.categoria, p.estoque, p.estoqueMinimo, deficit, p.precoCusto.toFixed(2)]);
      });
      return { filename: `speedtobox_estoque_baixo_${hojeStr}.csv`, rows };
    }

    if (key === 'produtos-inventario') {
      const rows: (string | number)[][] = [
        ['CÓDIGO', 'SKU', 'NOME DO PRODUTO', 'CATEGORIA', 'SALDO NO SISTEMA', 'CONTAGEM FÍSICA', 'DIVERGÊNCIA', 'VISTO DO AUDITOR']
      ];
      produtos.forEach(p => {
        rows.push([p.codigo, p.sku, `"${p.nome}"`, p.categoria, p.estoque, '', '', '']);
      });
      return { filename: `speedtobox_inventario_auditoria_${hojeStr}.csv`, rows };
    }

    if (key === 'movimentacoes') {
      const rows: (string | number)[][] = [
        ['DATA/HORA', 'PRODUTO', 'TIPO', 'QUANTIDADE', 'CUSTO UNIT. (R$)', 'MOTIVO', 'USUÁRIO', 'REFERÊNCIA']
      ];
      movimentacoes.forEach(m => {
        const p = produtos.find(item => item.id === m.produtoId);
        rows.push([m.dataHora, `"${p ? p.nome : m.produtoId}"`, m.tipo.toUpperCase(), m.quantidade, (m.custoUnitario || 0).toFixed(2), `"${m.motivo}"`, m.usuario, m.referencia]);
      });
      return { filename: `speedtobox_extrato_movimentacoes_${hojeStr}.csv`, rows };
    }

    if (key === 'vendas-abc') {
      const vendasPorProduto: { [key: string]: { nome: string; categoria: string; qtd: number; total: number } } = {};
      vendas.forEach(v => {
        v.itens.forEach(it => {
          if (!vendasPorProduto[it.produtoId]) {
            const p = produtos.find(prod => prod.id === it.produtoId);
            vendasPorProduto[it.produtoId] = {
              nome: p ? p.nome : it.produtoId,
              categoria: p ? p.categoria : 'Geral',
              qtd: 0,
              total: 0
            };
          }
          vendasPorProduto[it.produtoId].qtd += it.quantidade;
          vendasPorProduto[it.produtoId].total += it.subtotal;
        });
      });

      const totalGeral = Object.values(vendasPorProduto).reduce((acc, curr) => acc + curr.total, 0) || 1;
      const sorted = Object.values(vendasPorProduto).sort((a, b) => b.total - a.total);

      const rows: (string | number)[][] = [
        ['CLASSIFICAÇÃO', 'PRODUTO', 'CATEGORIA', 'UNIDADES VENDIDAS', 'FATURAMENTO (R$)', 'REPRESENTATIVIDADE (%)']
      ];

      let acumulado = 0;
      sorted.forEach(item => {
        acumulado += item.total;
        const pct = (item.total / totalGeral) * 100;
        const classe = (acumulado / totalGeral) <= 0.7 ? 'Classe A' : (acumulado / totalGeral) <= 0.9 ? 'Classe B' : 'Classe C';
        rows.push([classe, `"${item.nome}"`, item.categoria, item.qtd, item.total.toFixed(2), pct.toFixed(2) + '%']);
      });

      return { filename: `speedtobox_curva_abc_vendas_${hojeStr}.csv`, rows };
    }

    if (key === 'vendas-periodo') {
      const rows: (string | number)[][] = [
        ['CÓDIGO VENDA', 'DATA/HORA', 'TOTAL (R$)', 'FORMA DE PAGAMENTO', 'TOTAL ITENS', 'STATUS']
      ];
      vendas.forEach(v => {
        const qtdItens = v.itens.reduce((acc, it) => acc + it.quantidade, 0);
        rows.push([v.codigo, v.dataHora, v.valorTotal.toFixed(2), v.formaPagamento, qtdItens, v.status.toUpperCase()]);
      });
      return { filename: `speedtobox_faturamento_vendas_${hojeStr}.csv`, rows };
    }

    if (key === 'vendas-categoria') {
      const porCategoria: { [cat: string]: { total: number; qtdItens: number } } = {};
      vendas.forEach(v => {
        v.itens.forEach(it => {
          const p = produtos.find(prod => prod.id === it.produtoId);
          const cat = p ? p.categoria : 'Outros';
          if (!porCategoria[cat]) porCategoria[cat] = { total: 0, qtdItens: 0 };
          porCategoria[cat].total += it.subtotal;
          porCategoria[cat].qtdItens += it.quantidade;
        });
      });

      const rows: (string | number)[][] = [
        ['CATEGORIA', 'FATURAMENTO TOTAL (R$)', 'TOTAL DE ITENS VENDIDOS']
      ];
      Object.entries(porCategoria).forEach(([cat, val]) => {
        rows.push([cat, val.total.toFixed(2), val.qtdItens]);
      });
      return { filename: `speedtobox_desempenho_categorias_${hojeStr}.csv`, rows };
    }

    if (key === 'vendas-ticket') {
      const totalVendas = vendas.length || 1;
      const faturamentoTotal = vendas.reduce((acc, v) => acc + v.valorTotal, 0);
      const totalItens = vendas.reduce((acc, v) => acc + v.itens.reduce((sum, i) => sum + i.quantidade, 0), 0);
      const ticketMedio = faturamentoTotal / totalVendas;
      const itensPorVenda = totalItens / totalVendas;

      const rows: (string | number)[][] = [
        ['MÉTRICA COMERCIAL', 'VALOR APURADO'],
        ['Total de Transações no PDV', totalVendas],
        ['Faturamento Acumulado (R$)', faturamentoTotal.toFixed(2)],
        ['Ticket Médio por Venda (R$)', ticketMedio.toFixed(2)],
        ['Média de Itens por Carrinho', itensPorVenda.toFixed(1)]
      ];
      return { filename: `speedtobox_ticket_medio_${hojeStr}.csv`, rows };
    }

    if (key === 'lotes-vencendo') {
      const rows: (string | number)[][] = [
        ['PRODUTO', 'CÓDIGO LOTE', 'QUANTIDADE', 'DATA ENTRADA', 'DATA VALIDADE', 'DIAS RESTANTES (FIFO)', 'STATUS']
      ];
      const hoje = new Date();
      lotes
        .filter(l => {
          const dVal = new Date(l.dataValidade);
          const diffDays = Math.ceil((dVal.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays <= 30 && l.quantidade > 0;
        })
        .forEach(l => {
          const p = produtos.find(prod => prod.id === l.produtoId);
          const dVal = new Date(l.dataValidade);
          const diffDays = Math.ceil((dVal.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          rows.push([`"${p ? p.nome : l.produtoId}"`, l.codigoLote, l.quantidade, l.dataEntrada, l.dataValidade, diffDays, l.status]);
        });
      return { filename: `speedtobox_lotes_vencendo_${hojeStr}.csv`, rows };
    }

    if (key === 'lotes-vencidos') {
      const rows: (string | number)[][] = [
        ['PRODUTO', 'CÓDIGO LOTE', 'QUANTIDADE RETIDA', 'DATA ENTRADA', 'DATA VALIDADE', 'STATUS']
      ];
      const hoje = new Date();
      lotes
        .filter(l => {
          const dVal = new Date(l.dataValidade);
          return dVal < hoje && l.quantidade > 0;
        })
        .forEach(l => {
          const p = produtos.find(prod => prod.id === l.produtoId);
          rows.push([`"${p ? p.nome : l.produtoId}"`, l.codigoLote, l.quantidade, l.dataEntrada, l.dataValidade, 'VENCIDO (SEGREGAR)']);
        });
      return { filename: `speedtobox_auditoria_vencidos_${hojeStr}.csv`, rows };
    }

    // Default: lotes-rastreabilidade
    const rows: (string | number)[][] = [
      ['PRODUTO', 'CÓDIGO LOTE', 'SALDO ATUAL', 'QUANTIDADE INICIAL', 'DATA ENTRADA', 'DATA VALIDADE', 'STATUS']
    ];
    lotes.forEach(l => {
      const p = produtos.find(prod => prod.id === l.produtoId);
      rows.push([`"${p ? p.nome : l.produtoId}"`, l.codigoLote, l.quantidade, l.quantidadeInicial, l.dataEntrada, l.dataValidade, l.status]);
    });
    return { filename: `speedtobox_rastreabilidade_lotes_${hojeStr}.csv`, rows };
  };

  const exportarCSV = (key: string, title?: string) => {
    const { filename, rows } = gerarLinhasCSV(key);
    // \uFEFF for UTF-8 BOM so Excel opens with proper accents
    const csvContent = '\uFEFF' + rows.map(r => r.join(';')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Relatório "${title || filename}" exportado com sucesso!`);
  };

  const exportacaoGlobal = () => {
    const hojeStr = new Date().toISOString().slice(0, 10);
    const rows: string[] = [
      '# SPEEDTOBOX — EXPORTAÇÃO GLOBAL CONSOLIDADA',
      `# GERADO EM: ${new Date().toLocaleString('pt-BR')}`,
      `# EMPRESA: ${config.nome} | CNPJ: ${config.cnpj}`,
      '',
      '=== CATÁLOGO DE PRODUTOS ===',
      'CODIGO;SKU;NOME;CATEGORIA;ESTOQUE;PRECO_CUSTO;PRECO_VENDA;STATUS'
    ];

    produtos.forEach(p => {
      rows.push(`${p.codigo};${p.sku};"${p.nome}";${p.categoria};${p.estoque};${p.precoCusto.toFixed(2)};${p.precoVenda.toFixed(2)};${p.status}`);
    });

    rows.push('');
    rows.push('=== CONTROLE DE LOTES & VALIDADES (FIFO) ===');
    rows.push('PRODUTO;LOTE;QUANTIDADE;DATA_ENTRADA;DATA_VALIDADE;STATUS');
    lotes.forEach(l => {
      const p = produtos.find(prod => prod.id === l.produtoId);
      rows.push(`"${p ? p.nome : l.produtoId}";${l.codigoLote};${l.quantidade};${l.dataEntrada};${l.dataValidade};${l.status}`);
    });

    rows.push('');
    rows.push('=== HISTÓRICO DE VENDAS ===');
    rows.push('CODIGO;DATA_HORA;VALOR_TOTAL;FORMA_PAGAMENTO;ITENS_TOTAL');
    vendas.forEach(v => {
      const itensTotal = v.itens.reduce((acc, i) => acc + i.quantidade, 0);
      rows.push(`${v.codigo};${v.dataHora};${v.valorTotal.toFixed(2)};${v.formaPagamento};${itensTotal}`);
    });

    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speedtobox_base_global_${hojeStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Base consolidada global exportada com sucesso!');
  };

  const openPreview = (key: string, title: string) => {
    setPreviewModal({
      isOpen: true,
      reportKey: key,
      reportTitle: title
    });
  };

  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      reportKey: '',
      reportTitle: ''
    });
  };

  // Preview Data calculation for active modal
  const previewData = previewModal.isOpen ? gerarLinhasCSV(previewModal.reportKey) : null;

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Central */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d9ff]"></span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Central de Relatórios &amp; Auditoria
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Emita e exporte relatórios consolidados do seu negócio com dados auditados em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportacaoGlobal}
            className="btn-neon-primary text-xs py-2 px-3.5 flex items-center gap-2 shadow-[0_0_15px_rgba(0,217,255,0.25)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportação Global (CSV)</span>
          </button>
        </div>
      </div>

      {/* Notificação Toast */}
      {downloadNotification && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-[0_0_15px_rgba(0,230,160,0.15)]">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Faixa com Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Catálogo Auditado</span>
            <span className="text-base font-black text-white font-mono">{produtos.length} produtos / {produtos.reduce((a, b) => a + b.estoque, 0)} unid.</span>
          </div>
        </div>

        <div className="glass-panel p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Faturamento em Caixa</span>
            <span className="text-base font-black text-white font-mono">R$ {metrics.vendasPeriodoValor.toFixed(2)} ({vendas.length} vendas)</span>
          </div>
        </div>

        <div className="glass-panel p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Lotes Sob Regra FIFO</span>
            <span className="text-base font-black text-white font-mono">{lotes.length} lotes rastreados</span>
          </div>
        </div>
      </div>

      {/* Seções de Relatórios */}
      <div className="space-y-6">
        {reportSections.map(sec => {
          const SecIcon = sec.icon;
          return (
            <div key={sec.title} className="space-y-3">
              <div className="flex items-center gap-2">
                <SecIcon className={`w-4 h-4 ${sec.color}`} />
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {sec.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sec.reports.map(rep => (
                  <div
                    key={rep.id}
                    className="glass-panel p-4 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-200 group relative"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {rep.title}
                        </span>
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${sec.iconBg}`}>
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                        {rep.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-cyan-500/10">
                      <button
                        onClick={() => openPreview(rep.key, rep.title)}
                        className="btn-neon-secondary text-[11px] py-1.5 flex-1 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Prévia</span>
                      </button>
                      <button
                        onClick={() => exportarCSV(rep.key, rep.title)}
                        className="btn-neon-primary text-[11px] py-1.5 px-3 flex items-center justify-center"
                        title="Download direto em CSV"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Pré-Visualização com Design Cyberpunk */}
      {previewModal.isOpen && previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel border-cyan-500/30 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_0_40px_rgba(0,217,255,0.2)] bg-[#080d20]">
            {/* Top Modal */}
            <div className="flex items-center justify-between p-5 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {previewModal.reportTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="w-8 h-8 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cabeçalho Formal da Empresa */}
            <div className="px-5 pt-4">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-cyan-500/20 font-mono text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold">{config.nome || 'SPEEDTOBOX SISTEMAS DE ESTOQUE'}</span>
                  {config.cnpj && <span className="text-slate-400">({config.cnpj})</span>}
                </div>
                <div className="text-[11px] text-slate-400">
                  Total de registros apurados: <strong className="text-white">{previewData.rows.length - 1}</strong>
                </div>
              </div>
            </div>

            {/* Conteúdo da Tabela */}
            <div className="p-5 flex-1 overflow-auto">
              <div className="border border-cyan-500/20 rounded-xl overflow-hidden bg-slate-950/50">
                <table className="w-full text-left font-mono text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-cyan-300 border-b border-cyan-500/20 uppercase text-[10px] tracking-wider">
                    <tr>
                      {previewData.rows[0]?.map((col, idx) => (
                        <th key={idx} className="p-2.5 font-bold">
                          {String(col).replace(/"/g, '')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {previewData.rows.slice(1, 40).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-cyan-500/5 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 whitespace-nowrap text-slate-300">
                            {String(cell).replace(/"/g, '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {previewData.rows.length <= 1 && (
                      <tr>
                        <td
                          colSpan={previewData.rows[0]?.length || 1}
                          className="p-8 text-center text-slate-500 italic"
                        >
                          Nenhum registro encontrado para este filtro.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {previewData.rows.length > 40 && (
                <p className="text-[10px] text-slate-400 mt-2 font-mono text-center">
                  * Exibindo os primeiros 40 registros de {previewData.rows.length - 1}. O arquivo CSV completo contém todos os dados.
                </p>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="p-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 bg-[#050816]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="btn-neon-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={closePreview}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    exportarCSV(previewModal.reportKey, previewModal.reportTitle);
                    closePreview();
                  }}
                  className="btn-neon-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatoriosPage;
