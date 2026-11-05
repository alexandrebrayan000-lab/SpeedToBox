'use client';

import React, { useState, useMemo } from 'react';
import { Boxes, Calendar, AlertTriangle, Search, Download, Plus, CheckCircle, ShieldAlert } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function LotesPage() {
  const { lotes, produtos, setIsNovaEntradaOpen } = useStore();
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');

  const hoje = useMemo(() => new Date(), []);

  const lotesComCalculos = useMemo(() => {
    return lotes.map(l => {
      const dataVal = new Date(l.dataValidade);
      const diffTime = dataVal.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...l, diasRestantes: diffDays };
    });
  }, [lotes, hoje]);

  // Contagens para os cards de resumo
  const totalLotes = lotesComCalculos.length;
  const totalRegulares = lotesComCalculos.filter(l => l.status === 'normal' && l.quantidade > 0).length;
  const totalProximos = lotesComCalculos.filter(l => l.status === 'proximo_vencimento').length;
  const totalVencidos = lotesComCalculos.filter(l => l.status === 'vencido' || l.diasRestantes < 0).length;

  // Filtragem combinada (status + busca)
  const filtrados = lotesComCalculos.filter(l => {
    const prod = produtos.find(p => p.id === l.produtoId);
    const nomeProd = prod ? prod.nome.toLowerCase() : '';
    const codLote = l.codigoLote.toLowerCase();
    const termo = busca.trim().toLowerCase();

    const combinaBusca = !termo || codLote.includes(termo) || nomeProd.includes(termo);

    if (!combinaBusca) return false;
    if (filtroStatus === 'todos') return true;
    if (filtroStatus === 'vencido') return l.status === 'vencido' || l.diasRestantes < 0;
    return l.status === filtroStatus;
  });

  // Exportação para CSV auditado
  const exportarLotesCSV = () => {
    let csv = 'CODIGO_LOTE,PRODUTO,QUANTIDADE_ATUAL,QUANTIDADE_INICIAL,DATA_ENTRADA,DATA_VALIDADE,DIAS_RESTANTES,STATUS\n';
    lotesComCalculos.forEach(l => {
      const prod = produtos.find(p => p.id === l.produtoId);
      const nome = prod ? prod.nome.replace(/"/g, '""') : 'N/D';
      csv += `"${l.codigoLote}","${nome}",${l.quantidade},${l.quantidadeInicial},"${l.dataEntrada}","${l.dataValidade}",${l.diasRestantes},"${l.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speedtobox-lotes-validades-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Controle de Lotes &amp; Validades (FIFO)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rastreamento de partidas, datas de validade e priorização de saída (First In, First Out).
          </p>
        </div>

        {/* Ações do Topo */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportarLotesCSV}
            className="btn-neon-secondary text-xs py-2 px-3.5"
            title="Baixar planilha de lotes e validades"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar Lotes (CSV)</span>
          </button>

          <button
            onClick={() => setIsNovaEntradaOpen(true)}
            className="btn-neon-primary text-xs py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>+ Entrada com Lote</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total de Lotes</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white font-mono">{totalLotes}</span>
          <p className="text-[11px] text-slate-400 mt-1">Partidas cadastradas</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lotes Regulares</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">{totalRegulares}</span>
          <p className="text-[11px] text-slate-400 mt-1">Dentro do prazo seguro</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Próximos do Vencimento</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-300 font-mono">{totalProximos}</span>
          <p className="text-[11px] text-slate-400 mt-1">Priorizar saída (FIFO)</p>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lotes Vencidos</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-400 font-mono">{totalVencidos}</span>
          <p className="text-[11px] text-slate-400 mt-1">Recolher e baixar</p>
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="glass-panel p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por lote ou produto..."
            className="w-full bg-[#080d20] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        {/* Botões de Filtro de Status */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroStatus === 'todos'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.2)]'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({totalLotes})
          </button>
          <button
            onClick={() => setFiltroStatus('normal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroStatus === 'normal'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Regulares
          </button>
          <button
            onClick={() => setFiltroStatus('proximo_vencimento')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroStatus === 'proximo_vencimento'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(255,191,63,0.2)]'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            A Vencer ({totalProximos})
          </button>
          <button
            onClick={() => setFiltroStatus('vencido')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filtroStatus === 'vencido'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_8px_rgba(255,56,100,0.2)]'
                : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Vencidos ({totalVencidos})
          </button>
        </div>
      </div>

      {/* Grid de Lotes */}
      {filtrados.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-400 text-xs">
          Nenhum lote corresponde aos critérios de busca ou filtro selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map(l => {
            const prod = produtos.find(p => p.id === l.produtoId);
            const isVencido = l.status === 'vencido' || l.diasRestantes < 0;
            const isProx = l.status === 'proximo_vencimento';

            return (
              <div key={l.id} className="glass-panel p-4 accent-line hover:border-cyan-400/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {l.codigoLote}
                  </span>
                  <span
                    className={`badge-pill ${
                      isVencido
                        ? 'badge-pill-red'
                        : isProx
                        ? 'badge-pill-amber'
                        : 'badge-pill-green'
                    }`}
                  >
                    {isVencido ? 'VENCIDO' : isProx ? 'VENCIMENTO PRÓXIMO' : 'REGULAR'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm truncate mb-3">
                  {prod ? prod.nome : 'Produto'}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-cyan-500/10">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Saldo no Lote:</span>
                    <span className="font-mono font-bold text-white">{l.quantidade} un</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data de Entrada:</span>
                    <span className="font-mono text-slate-300">{l.dataEntrada}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Data de Validade:</span>
                    <span className={`font-mono font-bold ${isVencido ? 'text-rose-400' : isProx ? 'text-amber-300' : 'text-emerald-400'}`}>
                      {l.dataValidade}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Contagem FIFO:</span>
                    <span className={`font-mono text-[11px] font-bold ${isVencido ? 'text-rose-400' : isProx ? 'text-amber-300' : 'text-cyan-300'}`}>
                      {l.diasRestantes < 0 ? `Venceu há ${Math.abs(l.diasRestantes)} dias` : `${l.diasRestantes} dias restantes`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LotesPage;
