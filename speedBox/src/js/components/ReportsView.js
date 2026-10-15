/**
 * StockPro Reports Center View
 */

class ReportsView {
  constructor() {
    this.container = null;
  }

  renderTo(element) {
    this.container = element;
    this.render();
  }

  render() {
    if (!this.container) return;

    const reportSections = [
      {
        title: 'Estoque & Armazenagem',
        icon: 'package',
        color: 'text-cyan-400',
        reports: [
          { key: 'produtos', title: 'Posição Geral de Estoque', desc: 'Catálogo consolidado, saldo atual, custo médio e valor total de estoque.' },
          { key: 'produtos', title: 'Produtos em Estoque Baixo', desc: 'Listagem de itens atingindo o ponto de reposição com sugestão de compra.' },
          { key: 'produtos', title: 'Inventário Físico & Auditoria', desc: 'Folha de contagem cega para contagem periódica e conciliação de saldos.' },
          { key: 'movimentacoes', title: 'Histórico de Movimentações', desc: 'Extrato completo de todas as entradas, saídas, avarias e transferências.' }
        ]
      },
      {
        title: 'Vendas & Desempenho Comercial',
        icon: 'trending-up',
        color: 'text-purple-400',
        reports: [
          { key: 'vendas', title: 'Curva ABC de Vendas', desc: 'Classificação de produtos por volume de saída e representatividade de receita.' },
          { key: 'vendas', title: 'Faturamento por Período', desc: 'Evolução diária, semanal e mensal de vendas com formas de pagamento.' },
          { key: 'vendas', title: 'Desempenho por Categoria', desc: 'Faturamento consolidado dividido pelos departamentos do estabelecimento.' },
          { key: 'vendas', title: 'Ticket Médio & Eficiência', desc: 'Métricas de conversão, tíquete médio e quantidade média de itens por pedido.' }
        ]
      },
      {
        title: 'Validades & Lotes (FIFO)',
        icon: 'calendar-alert',
        color: 'text-amber-400',
        reports: [
          { key: 'lotes', title: 'Lotes Próximos do Vencimento', desc: 'Produtos que vencem nos próximos 30 dias para planejamento de liquidação.' },
          { key: 'lotes', title: 'Auditoria de Produtos Vencidos', desc: 'Relatório para descarte fiscal e baixa contábil de mercadorias expiradas.' },
          { key: 'lotes', title: 'Rastreabilidade Completa de Lotes', desc: 'Origem, fornecedor, data de recebimento e histórico de expedição por lote.' }
        ]
      }
    ];

    this.container.innerHTML = `
      <div class="space-y-6 tab-fade-enter">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
              <h1 class="text-2xl font-black text-white tracking-wide" style="font-family: var(--font-display)">Central de Relatórios</h1>
            </div>
            <p class="text-xs text-[#A3B2D1] mt-0.5">Emita e exporte relatórios consolidados do seu negócio com dados auditados.</p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.dataStore.exportToCSV('produtos'); window.cyberToast.success('Exportando base completa...');" class="btn-cyber-primary text-xs py-2 px-3.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Exportação Global (CSV)
            </button>
          </div>
        </div>

        <!-- Groups -->
        <div class="space-y-6">
          ${reportSections.map(sec => `
            <div>
              <div class="flex items-center gap-2 mb-3">
                <i data-lucide="${sec.icon}" class="w-4 h-4 ${sec.color}"></i>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">${sec.title}</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                ${sec.reports.map(rep => `
                  <div class="cyber-card p-4 flex flex-col justify-between hover:border-cyan-400/40">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-white">${rep.title}</span>
                        <div class="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                          <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
                        </div>
                      </div>
                      <p class="text-[11px] text-slate-400 leading-relaxed mb-4">${rep.desc}</p>
                    </div>

                    <div class="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <button
                        onclick="window.cyberModals.openReportPreviewModal('${rep.key}', '${rep.title}')"
                        class="btn-cyber-secondary text-[11px] py-1.5 flex-1"
                      >
                        <i data-lucide="eye" class="w-3 h-3"></i> Prévia
                      </button>
                      <button
                        onclick="window.dataStore.exportToCSV('${rep.key}'); window.cyberToast.success('Relatório ${rep.title} baixado!');"
                        class="btn-cyber-primary text-[11px] py-1.5 px-3"
                        title="Download direto"
                      >
                        <i data-lucide="download" class="w-3 h-3"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }
  }
}

window.ReportsView = ReportsView;
