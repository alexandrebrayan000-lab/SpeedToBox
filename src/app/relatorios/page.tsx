'use client';

import React from 'react';
import {
  Package,
  TrendingUp,
  Boxes,
  Download,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function ReportsPage() {
  const { setReportPreview, exportToCSV } = useStore();

  const reportSections = [
    {
      title: 'Estoque & Armazenagem',
      icon: Package,
      color: 'text-cyan-400',
      reports: [
        {
          key: 'produtos',
          title: 'Posição Geral de Estoque',
          desc: 'Catálogo consolidado, saldo atual, custo médio e valor total de estoque.'
        },
        {
          key: 'produtos',
          title: 'Produtos em Estoque Baixo',
          desc: 'Listagem de itens atingindo o ponto de reposição com sugestão de compra.'
        },
        {
          key: 'produtos',
          title: 'Inventário Físico & Auditoria',
          desc: 'Folha de contagem cega para contagem periódica e conciliação de saldos.'
        },
        {
          key: 'movimentacoes',
          title: 'Histórico de Movimentações',
          desc: 'Extrato completo de todas as entradas, saídas, avarias e transferências.'
        }
      ]
    },
    {
      title: 'Vendas & Desempenho Comercial',
      icon: TrendingUp,
      color: 'text-purple-400',
      reports: [
        {
          key: 'vendas',
          title: 'Curva ABC de Vendas',
          desc: 'Classificação de produtos por volume de saída e representatividade de receita.'
        },
        {
          key: 'vendas',
          title: 'Faturamento por Período',
          desc: 'Evolução diária, semanal e mensal de vendas com formas de pagamento.'
        },
        {
          key: 'vendas',
          title: 'Desempenho por Categoria',
          desc: 'Faturamento consolidado dividido pelos departamentos do estabelecimento.'
        },
        {
          key: 'vendas',
          title: 'Ticket Médio & Eficiência',
          desc: 'Métricas de conversão, tíquete médio e quantidade média de itens por pedido.'
        }
      ]
    },
    {
      title: 'Validades & Lotes (FIFO)',
      icon: Boxes,
      color: 'text-amber-400',
      reports: [
        {
          key: 'lotes',
          title: 'Lotes Próximos do Vencimento',
          desc: 'Produtos que vencem nos próximos 30 dias para planejamento de liquidação.'
        },
        {
          key: 'lotes',
          title: 'Auditoria de Produtos Vencidos',
          desc: 'Relatório para descarte fiscal e baixa contábil de mercadorias expiradas.'
        },
        {
          key: 'lotes',
          title: 'Rastreabilidade Completa de Lotes',
          desc: 'Origem, fornecedor, data de recebimento e histórico de expedição por lote.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
            <h1
              className="text-2xl font-black text-white tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Central de Relatórios
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Emita e exporte relatórios consolidados do seu negócio com dados auditados.
          </p>
        </div>

        <button
          onClick={() => exportToCSV('produtos')}
          className="btn-cyber-primary text-xs py-2 px-3.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportação Global (CSV)</span>
        </button>
      </div>

      {/* Report Groups */}
      <div className="space-y-8">
        {reportSections.map(sec => {
          const SectionIcon = sec.icon;

          return (
            <div key={sec.title}>
              <div className="flex items-center gap-2 mb-3">
                <SectionIcon className={`w-4 h-4 ${sec.color}`} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{sec.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sec.reports.map(rep => (
                  <div
                    key={rep.title}
                    className="cyber-card p-4 flex flex-col justify-between hover:border-cyan-400/40"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{rep.title}</span>
                        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{rep.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() =>
                          setReportPreview({
                            isOpen: true,
                            reportKey: rep.key,
                            reportTitle: rep.title
                          })
                        }
                        className="btn-cyber-secondary text-[11px] py-1.5 flex-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Prévia</span>
                      </button>
                      <button
                        onClick={() => exportToCSV(rep.key as any)}
                        className="btn-cyber-primary text-[11px] py-1.5 px-3"
                        title="Download CSV"
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
    </div>
  );
}
