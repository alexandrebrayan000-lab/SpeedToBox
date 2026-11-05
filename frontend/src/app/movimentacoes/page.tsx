'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Plus, Filter, Download, Search, ArrowDownLeft, ArrowUpRight, AlertOctagon, Boxes } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { TipoMovimentacao } from '../../types';

export function MovimentacoesPage() {
  const { movimentacoes, produtos, lotes, setIsNovaEntradaOpen } = useStore();
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');

  // Métricas de resumo
  const totalMovs = movimentacoes.length;
  const totalEntradas = useMemo(
    () => movimentacoes.filter(m => m.tipo === 'entrada').reduce((acc, m) => acc + m.quantidade, 0),
    [movimentacoes]
  );
  const totalSaidas = useMemo(
    () => movimentacoes.filter(m => m.tipo === 'saida').reduce((acc, m) => acc + m.quantidade, 0),
    [movimentacoes]
  );
  const totalPerdas = useMemo(
    () => movimentacoes.filter(m => m.tipo === 'perda' || m.tipo === 'avaria').reduce((acc, m) => acc + m.quantidade, 0),
    [movimentacoes]
  );

  // Filtragem combinada
  const filtradas = useMemo(() => {
    return movimentacoes.filter(m => {
      const matchTipo = tipoFiltro === 'todos' || m.tipo === tipoFiltro;
      if (!matchTipo) return false;

      const termo = busca.trim().toLowerCase();
      if (!termo) return true;

      const prod = produtos.find(p => p.id === m.produtoId);
      const nomeProd = prod ? prod.nome.toLowerCase() : '';
      const lote = lotes.find(l => l.id === m.loteId);
      const codLote = lote ? lote.codigoLote.toLowerCase() : '';
      const motivo = m.motivo.toLowerCase();
      const referencia = m.referencia.toLowerCase();
      const operador = m.usuario.toLowerCase();

      return (
        nomeProd.includes(termo) ||
        codLote.includes(termo) ||
        motivo.includes(termo) ||
        referencia.includes(termo) ||
        operador.includes(termo)
      );
    });
  }, [movimentacoes, produtos, lotes, tipoFiltro, busca]);

  // Exportar para CSV
  const exportarCSV = () => {
    let csv = 'DATA_HORA,PRODUTO,TIPO,QUANTIDADE,CUSTO_UNITARIO,LOTE,MOTIVO,REFERENCIA,OPERADOR\n';
    movimentacoes.forEach(m => {
      const prod = produtos.find(p => p.id === m.produtoId);
      const lote = lotes.find(l => l.id === m.loteId);
      const nomeProd = prod ? prod.nome.replace(/"/g, '""') : 'N/D';
      const codLote = lote ? lote.codigoLote : (m.loteId || '');
      csv += `"${m.dataHora}","${nomeProd}","${m.tipo}",${m.quantidade},${m.custoUnitario || 0},"${codLote}","${m.motivo.replace(/"/g, '""')}","${m.referencia}","${m.usuario}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speedtobox-movimentacoes-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Movimentações de Estoque
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro rastreável de todas as compras, vendas, perdas e ajustes físicos de mercadorias.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportarCSV}
            className="btn-neon-secondary text-xs py-2 px-3.5"
            title="Exportar extrato auditável"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar Histórico (CSV)</span>
          </button>

          <button
            onClick={() => setIsNovaEntradaOpen(true)}
            className="btn-neon-primary text-xs py-2 px-4 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Movimentação</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total de Registros</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">{totalMovs}</span>
          <p className="text-[11px] text-slate-400 mt-1">Transações auditadas</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Entradas Físicas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">+{totalEntradas}</span>
          <p className="text-[11px] text-slate-400 mt-1">Unidades repostas</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saídas Comerciais</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-cyan-300 font-mono">-{totalSaidas}</span>
          <p className="text-[11px] text-slate-400 mt-1">Unidades vendidas</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perdas &amp; Avarias</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-400 font-mono">-{totalPerdas}</span>
          <p className="text-[11px] text-slate-400 mt-1">Descartes / Avarias</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="glass-panel p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por produto, lote, motivo ou NF..."
            className="w-full bg-[#080d20] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          {['todos', 'entrada', 'saida', 'perda', 'avaria'].map(t => (
            <button
              key={t}
              onClick={() => setTipoFiltro(t)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize border transition-all ${
                tipoFiltro === t
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.2)]'
                  : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Movimentações */}
      <div className="glass-panel overflow-hidden accent-line">
        <div className="overflow-x-auto">
          <table className="custom-table text-xs">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Produto</th>
                <th>Lote</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Custo Un.</th>
                <th>Motivo / Justificativa</th>
                <th>Referência</th>
                <th>Operador</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    Nenhuma movimentação corresponde aos filtros selecionados.
                  </td>
                </tr>
              ) : (
                filtradas.map(m => {
                  const prod = produtos.find(p => p.id === m.produtoId);
                  const lote = lotes.find(l => l.id === m.loteId);
                  const isEntrada = m.tipo === 'entrada';
                  const isSaida = m.tipo === 'saida';
                  const isPerda = m.tipo === 'perda';

                  return (
                    <tr key={m.id}>
                      <td className="font-mono text-slate-400 whitespace-nowrap">{m.dataHora}</td>
                      <td className="font-semibold text-white">{prod ? prod.nome : 'Produto'}</td>
                      <td>
                        {lote ? (
                          <span className="font-mono text-[11px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            {lote.codigoLote}
                          </span>
                        ) : m.loteId ? (
                          <span className="font-mono text-[11px] text-slate-400">{m.loteId}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge-pill ${
                            isEntrada
                              ? 'badge-pill-green'
                              : isSaida
                              ? 'badge-pill-cyan'
                              : isPerda
                              ? 'badge-pill-red'
                              : 'badge-pill-amber'
                          }`}
                        >
                          {m.tipo.toUpperCase()}
                        </span>
                      </td>
                      <td className={`font-mono font-bold ${isEntrada ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isEntrada ? '+' : '-'}{m.quantidade}
                      </td>
                      <td className="font-mono text-slate-400">
                        {m.custoUnitario ? `R$ ${m.custoUnitario.toFixed(2)}` : '—'}
                      </td>
                      <td className="text-slate-300">{m.motivo}</td>
                      <td className="font-mono text-[11px] text-cyan-400">{m.referencia}</td>
                      <td className="text-slate-400">{m.usuario}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MovimentacoesPage;
