'use client';

import React, { useState, useMemo } from 'react';
import {
  FileBarChart,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Boxes,
  Package,
  TrendingUp,
  Receipt,
  Eye,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function RelatoriosPage() {
  const { produtos, movimentacoes, vendas, lotes, metrics } = useStore();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [modalPreview, setModalPreview] = useState<'produtos' | 'movimentacoes' | 'vendas' | 'lotes' | null>(null);

  const exportarCSV = (tipo: 'produtos' | 'movimentacoes' | 'vendas' | 'lotes') => {
    let csv = '';
    let nomeArquivo = '';

    if (tipo === 'produtos') {
      csv = 'CODIGO,SKU,NOME,CATEGORIA,ESTOQUE,ESTOQUE_MINIMO,PRECO_CUSTO,PRECO_VENDA,STATUS\n';
      produtos.forEach(p => {
        csv += `"${p.codigo}","${p.sku}","${p.nome.replace(/"/g, '""')}","${p.categoria}",${p.estoque},${p.estoqueMinimo},${p.precoCusto},${p.precoVenda},"${p.status}"\n`;
      });
      nomeArquivo = `relatorio-estoque-speedtobox-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (tipo === 'movimentacoes') {
      csv = 'DATA_HORA,PRODUTO,TIPO,QUANTIDADE,CUSTO_UNITARIO,MOTIVO,REFERENCIA,OPERADOR\n';
      movimentacoes.forEach(m => {
        const prod = produtos.find(p => p.id === m.produtoId);
        csv += `"${m.dataHora}","${prod ? prod.nome.replace(/"/g, '""') : ''}","${m.tipo}",${m.quantidade},${m.custoUnitario || 0},"${m.motivo.replace(/"/g, '""')}","${m.referencia}","${m.usuario}"\n`;
      });
      nomeArquivo = `relatorio-movimentacoes-speedtobox-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (tipo === 'vendas') {
      csv = 'CODIGO,DATA_HORA,VALOR_TOTAL,FORMA_PAGAMENTO,QUANTIDADE_ITENS\n';
      vendas.forEach(v => {
        const qtdItens = v.itens.reduce((acc, i) => acc + i.quantidade, 0);
        csv += `"${v.codigo}","${v.dataHora}",${v.valorTotal},"${v.formaPagamento}",${qtdItens}\n`;
      });
      nomeArquivo = `relatorio-vendas-speedtobox-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (tipo === 'lotes') {
      csv = 'CODIGO_LOTE,PRODUTO,QUANTIDADE,DATA_ENTRADA,DATA_VALIDADE,STATUS\n';
      lotes.forEach(l => {
        const prod = produtos.find(p => p.id === l.produtoId);
        csv += `"${l.codigoLote}","${prod ? prod.nome.replace(/"/g, '""') : 'Item'}",${l.quantidade},"${l.dataEntrada}","${l.dataValidade}","${l.status}"\n`;
      });
      nomeArquivo = `relatorio-lotes-validades-speedtobox-${new Date().toISOString().slice(0, 10)}.csv`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Relatório de ${tipo.toUpperCase()} exportado com sucesso!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Central de Relatórios &amp; Exportações
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gere extratos analíticos de saldo, histórico de compras/saídas, lotes FIFO e desempenho comercial.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 4 Cards de Resumo Executivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Catálogo Ativo</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">{produtos.length} SKUs</span>
          <p className="text-[11px] text-slate-400 mt-1">{metrics.totalEmEstoque} itens em estoque</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Volume de Vendas</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">
            R$ {metrics.vendasPeriodoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">{vendas.length} pedidos no PDV</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ticket Médio</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            R$ {metrics.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Média por transação</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lotes em Monitoramento</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-300 font-mono">{lotes.length} lotes</span>
          <p className="text-[11px] text-slate-400 mt-1">{metrics.totalLotesProximosVencimento} requerem atenção</p>
        </div>
      </div>

      {/* Grid de 4 Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Relatório de Estoque */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Posição Geral de Estoque</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Catálogo consolidado, saldo atual em prateleira, níveis de estoque mínimo, preços e status.
            </p>
            <span className="font-mono text-[11px] text-cyan-300 block mb-4">
              {produtos.length} produtos cadastrados
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setModalPreview('produtos')}
              className="btn-neon-secondary text-xs py-1.5 px-3 w-full flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Pré-visualizar
            </button>
            <button
              onClick={() => exportarCSV('produtos')}
              className="btn-neon-primary text-xs py-2 px-3 w-full flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Baixar CSV Estoque
            </button>
          </div>
        </div>

        {/* Card 2: Relatório de Movimentações */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Extrato de Movimentações</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Histórico rastreável de todas as compras de reposição, saídas por venda, perdas e avarias.
            </p>
            <span className="font-mono text-[11px] text-emerald-300 block mb-4">
              {movimentacoes.length} lançamentos auditados
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setModalPreview('movimentacoes')}
              className="btn-neon-secondary text-xs py-1.5 px-3 w-full flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Pré-visualizar
            </button>
            <button
              onClick={() => exportarCSV('movimentacoes')}
              className="btn-neon-primary text-xs py-2 px-3 w-full flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Baixar CSV Movimentações
            </button>
          </div>
        </div>

        {/* Card 3: Relatório de Vendas */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Vendas &amp; Desempenho PDV</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Transações comerciais consolidadas, faturamento por pedido, itens vendidos e formas de pagamento.
            </p>
            <span className="font-mono text-[11px] text-purple-300 block mb-4">
              {vendas.length} pedidos finalizados
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setModalPreview('vendas')}
              className="btn-neon-secondary text-xs py-1.5 px-3 w-full flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Pré-visualizar
            </button>
            <button
              onClick={() => exportarCSV('vendas')}
              className="btn-neon-primary text-xs py-2 px-3 w-full flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Baixar CSV Vendas
            </button>
          </div>
        </div>

        {/* Card 4: Relatório de Lotes e Validades */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Lotes &amp; Validades (FIFO)</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Rastreamento de partidas, datas de entrada e vencimento para auditoria sanitária e controle FIFO.
            </p>
            <span className="font-mono text-[11px] text-amber-300 block mb-4">
              {lotes.length} lotes registrados
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setModalPreview('lotes')}
              className="btn-neon-secondary text-xs py-1.5 px-3 w-full flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Pré-visualizar
            </button>
            <button
              onClick={() => exportarCSV('lotes')}
              className="btn-neon-primary text-xs py-2 px-3 w-full flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Baixar CSV Lotes
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Pré-visualização de Dados */}
      {modalPreview && (
        <div className="modal-overlay">
          <div className="modal-card p-6 max-w-3xl">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Pré-visualização: Relatório de {modalPreview.toUpperCase()}
                </h3>
                <p className="text-[11px] text-slate-400">Amostra dos primeiros registros contidos na base.</p>
              </div>
              <button
                onClick={() => setModalPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto mb-4 border border-cyan-500/10 rounded-xl">
              <table className="custom-table text-xs">
                {modalPreview === 'produtos' && (
                  <>
                    <thead>
                      <tr><th>Código</th><th>Produto</th><th>Categoria</th><th>Estoque</th><th>Preço</th></tr>
                    </thead>
                    <tbody>
                      {produtos.slice(0, 6).map(p => (
                        <tr key={p.id}>
                          <td className="font-mono text-cyan-300">{p.codigo}</td>
                          <td>{p.nome}</td>
                          <td>{p.categoria}</td>
                          <td className="font-mono">{p.estoque} {p.unidade}</td>
                          <td className="font-mono text-emerald-400">R$ {p.precoVenda.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {modalPreview === 'movimentacoes' && (
                  <>
                    <thead>
                      <tr><th>Data/Hora</th><th>Tipo</th><th>Qtd</th><th>Motivo</th><th>Operador</th></tr>
                    </thead>
                    <tbody>
                      {movimentacoes.slice(0, 6).map(m => (
                        <tr key={m.id}>
                          <td className="font-mono text-slate-400">{m.dataHora}</td>
                          <td>{m.tipo.toUpperCase()}</td>
                          <td className="font-mono">{m.quantidade}</td>
                          <td>{m.motivo}</td>
                          <td>{m.usuario}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {modalPreview === 'vendas' && (
                  <>
                    <thead>
                      <tr><th>Código</th><th>Data</th><th>Valor Total</th><th>Pagamento</th><th>Itens</th></tr>
                    </thead>
                    <tbody>
                      {vendas.slice(0, 6).map(v => (
                        <tr key={v.id}>
                          <td className="font-mono text-cyan-300">{v.codigo}</td>
                          <td className="font-mono text-slate-400">{v.dataHora}</td>
                          <td className="font-mono text-emerald-400 font-bold">R$ {v.valorTotal.toFixed(2)}</td>
                          <td>{v.formaPagamento}</td>
                          <td>{v.itens.length} tipo(s)</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {modalPreview === 'lotes' && (
                  <>
                    <thead>
                      <tr><th>Código Lote</th><th>Entrada</th><th>Validade</th><th>Saldo</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {lotes.slice(0, 6).map(l => (
                        <tr key={l.id}>
                          <td className="font-mono text-purple-300">{l.codigoLote}</td>
                          <td className="font-mono text-slate-400">{l.dataEntrada}</td>
                          <td className="font-mono text-cyan-300 font-bold">{l.dataValidade}</td>
                          <td className="font-mono">{l.quantidade} un</td>
                          <td>{l.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalPreview(null)}
                className="btn-neon-secondary text-xs py-2 px-3"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  exportarCSV(modalPreview);
                  setModalPreview(null);
                }}
                className="btn-neon-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Baixar Planilha Completa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatoriosPage;
