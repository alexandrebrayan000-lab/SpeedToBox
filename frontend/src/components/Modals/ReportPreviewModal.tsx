'use client';

import React from 'react';
import { FileSpreadsheet, X, Download, Printer } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ReportPreviewModal() {
  const { reportPreview, setReportPreview, products, lots, movements, sales, exportToCSV } = useStore();

  if (!reportPreview.isOpen) return null;

  const { reportKey, reportTitle } = reportPreview;

  let columns: string[] = [];
  let rows: any[] = [];

  if (reportKey === 'produtos') {
    columns = ['SKU', 'Produto', 'Categoria', 'Saldo', 'Min', 'Custo (R$)', 'Venda (R$)', 'Status'];
    rows = products.map(p => [
      p.sku,
      p.nome,
      p.categoria,
      `${p.estoque} ${p.unidade}`,
      p.estoqueMinimo,
      p.precoCusto.toFixed(2),
      p.precoVenda.toFixed(2),
      p.status.toUpperCase()
    ]);
  } else if (reportKey === 'lotes') {
    columns = ['Lote', 'Produto', 'Saldo', 'Entrada', 'Validade', 'Status'];
    rows = lots.map(l => {
      const prod = products.find(p => p.id === l.produtoId);
      return [
        l.codigoLote,
        prod ? prod.nome : '—',
        `${l.quantidade} un`,
        l.dataEntrada,
        l.dataValidade,
        l.status.toUpperCase()
      ];
    });
  } else if (reportKey === 'movimentacoes') {
    columns = ['Data/Hora', 'Produto', 'Tipo', 'Qtd', 'Motivo', 'Referência', 'Operador'];
    rows = movements.map(m => {
      const prod = products.find(p => p.id === m.produtoId);
      return [
        m.dataHora,
        prod ? prod.nome : '—',
        m.tipo.toUpperCase(),
        m.quantidade,
        m.motivo,
        m.referencia,
        m.usuario
      ];
    });
  } else if (reportKey === 'vendas') {
    columns = ['Código', 'Data/Hora', 'Total (R$)', 'Pagamento', 'Status'];
    rows = sales.map(s => [
      s.codigo,
      s.dataHora,
      `R$ ${s.valorTotal.toFixed(2)}`,
      s.formaPagamento,
      s.status.toUpperCase()
    ]);
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setReportPreview({ isOpen: false, reportKey: '', reportTitle: '' })}>
      <div className="modal-content !max-w-4xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">{reportTitle}</h3>
                <p className="text-xs text-slate-400">Visualização auditada com exportação e impressão instantânea</p>
              </div>
            </div>
            <button
              onClick={() => setReportPreview({ isOpen: false, reportKey: '', reportTitle: '' })}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Table Preview */}
          <div className="cyber-table-container max-h-[50vh] overflow-y-auto mb-6 border border-slate-800 rounded-xl">
            <table className="cyber-table">
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-6 text-slate-400">
                      Nenhum registro para exibir.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((val: any, cIdx: number) => (
                        <td key={cIdx}>{val}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              Total de linhas: <strong className="text-cyan-400">{rows.length}</strong>
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-cyber-secondary text-xs py-2 px-3.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>
              <button
                type="button"
                onClick={() => exportToCSV(reportKey as any)}
                className="btn-cyber-primary text-xs py-2 px-4"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
