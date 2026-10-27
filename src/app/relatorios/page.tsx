'use client';

import React, { useState } from 'react';
import { FileBarChart, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function RelatoriosPage() {
  const { produtos, movimentacoes, vendas, metrics } = useStore();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const exportarCSV = (tipo: 'produtos' | 'movimentacoes' | 'vendas') => {
    let csv = '';
    let nomeArquivo = '';

    if (tipo === 'produtos') {
      csv = 'CODIGO,SKU,NOME,CATEGORIA,ESTOQUE,ESTOQUE_MINIMO,PRECO_CUSTO,PRECO_VENDA,STATUS\n';
      produtos.forEach(p => {
        csv += `"${p.codigo}","${p.sku}","${p.nome}","${p.categoria}",${p.estoque},${p.estoqueMinimo},${p.precoCusto},${p.precoVenda},"${p.status}"\n`;
      });
      nomeArquivo = `relatorio-estoque-speedtobox-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (tipo === 'movimentacoes') {
      csv = 'DATA_HORA,PRODUTO,TIPO,QUANTIDADE,CUSTO_UNITARIO,MOTIVO,REFERENCIA\n';
      movimentacoes.forEach(m => {
        const prod = produtos.find(p => p.id === m.produtoId);
        csv += `"${m.dataHora}","${prod ? prod.nome : ''}","${m.tipo}",${m.quantidade},${m.custoUnitario || 0},"${m.motivo}","${m.referencia}"\n`;
      });
      nomeArquivo = `relatorio-movimentacoes-speedtobox-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (tipo === 'vendas') {
      csv = 'CODIGO,DATA_HORA,VALOR_TOTAL,FORMA_PAGAMENTO,QUANTIDADE_ITENS\n';
      vendas.forEach(v => {
        const qtdItens = v.itens.reduce((acc, i) => acc + i.quantidade, 0);
        csv += `"${v.codigo}","${v.dataHora}",${v.valorTotal},"${v.formaPagamento}",${qtdItens}\n`;
      });
      nomeArquivo = `relatorio-vendas-speedtobox-${new Date().toISOString().slice(0, 10)}.csv`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();

    setDownloadSuccess(`Relatório de ${tipo} exportado com sucesso!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Relatórios Consolidados &amp; Exportações
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gere extratos analíticos de saldo, histórico de compras/saídas e desempenho comercial.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Relatório de Estoque */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">Posição Geral de Estoque</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Exporta todos os produtos cadastrados com saldo físico atual, níveis de estoque mínimo, preços e status.
            </p>
            <span className="font-mono text-xs text-cyan-300 block mb-4">
              {produtos.length} produtos catalogados
            </span>
          </div>

          <button
            onClick={() => exportarCSV('produtos')}
            className="btn-neon-primary text-xs py-2 px-3 w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Exportar CSV Estoque
          </button>
        </div>

        {/* Card 2: Relatório de Movimentações */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">Extrato de Movimentações</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Histórico rastreável de todas as compras de reposição, saídas por venda, perdas por validade e avarias.
            </p>
            <span className="font-mono text-xs text-emerald-300 block mb-4">
              {movimentacoes.length} lançamentos registrados
            </span>
          </div>

          <button
            onClick={() => exportarCSV('movimentacoes')}
            className="btn-neon-secondary text-xs py-2 px-3 w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Exportar CSV Movimentações
          </button>
        </div>

        {/* Card 3: Relatório de Vendas */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">Extrato Comercial &amp; Vendas</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Relatório analítico das transações concluídas no PDV com totais, datas e formas de pagamento.
            </p>
            <span className="font-mono text-xs text-purple-300 block mb-4">
              R$ {metrics.vendasPeriodoValor.toFixed(2)} faturados
            </span>
          </div>

          <button
            onClick={() => exportarCSV('vendas')}
            className="btn-neon-primary text-xs py-2 px-3 w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Exportar CSV Vendas
          </button>
        </div>
      </div>
    </div>
  );
}

export default RelatoriosPage;
