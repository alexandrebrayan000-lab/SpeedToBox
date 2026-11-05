'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Plus,
  DollarSign,
  Receipt,
  CreditCard,
  Download,
  Search,
  Award,
  Wallet,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FormaPagamento } from '../../types';

export function VendasPage() {
  const { vendas, produtos, metrics, setIsNovaVendaOpen } = useStore();
  const [filtroPagamento, setFiltroPagamento] = useState<string>('todas');
  const [busca, setBusca] = useState<string>('');

  // 1. Ranking dos Top 5 Produtos Mais Vendidos
  const rankingTopVendidos = useMemo(() => {
    const mapa: Record<string, { produtoId: string; nome: string; quantidade: number; receita: number }> = {};

    vendas.forEach(v => {
      v.itens.forEach(it => {
        if (!mapa[it.produtoId]) {
          const prod = produtos.find(p => p.id === it.produtoId);
          mapa[it.produtoId] = {
            produtoId: it.produtoId,
            nome: prod ? prod.nome : 'Produto',
            quantidade: 0,
            receita: 0
          };
        }
        mapa[it.produtoId].quantidade += it.quantidade;
        mapa[it.produtoId].receita += it.subtotal;
      });
    });

    const lista = Object.values(mapa).sort((a, b) => b.quantidade - a.quantidade);
    const maxQtd = lista.length > 0 ? lista[0].quantidade : 1;

    return lista.slice(0, 5).map(item => ({
      ...item,
      percentual: Math.round((item.quantidade / maxQtd) * 100)
    }));
  }, [vendas, produtos]);

  // 2. Resumo por Forma de Pagamento
  const resumoPagamentos = useMemo(() => {
    const totais: Record<FormaPagamento, { qtd: number; valor: number }> = {
      PIX: { qtd: 0, valor: 0 },
      'Cartão de Crédito': { qtd: 0, valor: 0 },
      'Cartão de Débito': { qtd: 0, valor: 0 },
      Dinheiro: { qtd: 0, valor: 0 },
      Boleto: { qtd: 0, valor: 0 }
    };

    vendas.forEach(v => {
      if (totais[v.formaPagamento]) {
        totais[v.formaPagamento].qtd += 1;
        totais[v.formaPagamento].valor += v.valorTotal;
      }
    });

    const totalGeral = metrics.vendasPeriodoValor || 1;

    return Object.entries(totais).map(([forma, dados]) => ({
      forma,
      qtd: dados.qtd,
      valor: dados.valor,
      percentual: Math.round((dados.valor / totalGeral) * 100)
    })).filter(p => p.qtd > 0 || p.forma !== 'Boleto');
  }, [vendas, metrics.vendasPeriodoValor]);

  // 3. Filtragem das Vendas na Tabela
  const vendasFiltradas = useMemo(() => {
    return vendas.filter(v => {
      const matchPag = filtroPagamento === 'todas' || v.formaPagamento === filtroPagamento;
      if (!matchPag) return false;

      const termo = busca.trim().toLowerCase();
      if (!termo) return true;

      const matchCodigo = v.codigo.toLowerCase().includes(termo);
      const matchItem = v.itens.some(it => {
        const prod = produtos.find(p => p.id === it.produtoId);
        return prod && prod.nome.toLowerCase().includes(termo);
      });

      return matchCodigo || matchItem;
    });
  }, [vendas, produtos, filtroPagamento, busca]);

  // 4. Exportar Relatório em CSV
  const exportarVendasCSV = () => {
    let csv = 'CODIGO_VENDA,DATA_HORA,VALOR_TOTAL,FORMA_PAGAMENTO,ITENS_DETALHADOS\n';
    vendas.forEach(v => {
      const itensFormatados = v.itens
        .map(it => {
          const prod = produtos.find(p => p.id === it.produtoId);
          return `${it.quantidade}x ${prod ? prod.nome : 'Item'} (R$ ${it.precoUnitario.toFixed(2)})`;
        })
        .join(' | ');

      csv += `"${v.codigo}","${v.dataHora}",${v.valorTotal.toFixed(2)},"${v.formaPagamento}","${itensFormatados.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speedtobox-vendas-pdv-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getBadgePagamento = (forma: FormaPagamento) => {
    switch (forma) {
      case 'PIX':
        return 'badge-pill-green';
      case 'Cartão de Crédito':
        return 'badge-pill-purple';
      case 'Cartão de Débito':
        return 'badge-pill-cyan';
      case 'Dinheiro':
        return 'badge-pill-amber';
      default:
        return 'badge-pill-cyan';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Vendas &amp; Gestão Financeira Comercial
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro de pedidos no PDV, receitas comerciais e controle de formas de pagamento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportarVendasCSV}
            className="btn-neon-secondary text-xs py-2 px-3.5"
            title="Baixar extrato de vendas em planilha"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar Relatório (CSV)</span>
          </button>

          <button
            onClick={() => setIsNovaVendaOpen(true)}
            className="btn-neon-primary text-xs py-2 px-4 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Venda (PDV)</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Métricas Comerciais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faturamento Total</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-white">
            R$ {metrics.vendasPeriodoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-emerald-400 block mt-1 font-mono">Receita bruta consolidada</span>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pedidos Concluídos</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-white">
            {vendas.length} transações
          </span>
          <span className="text-[11px] text-cyan-400 block mt-1 font-mono">Operações no balcão</span>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ticket Médio</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-white">
            R$ {metrics.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-purple-400 block mt-1 font-mono">Média por pedido</span>
        </div>

        <div className="glass-panel p-4 accent-line">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Itens Comercializados</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-amber-300">
            {metrics.vendasPeriodoQtd} un
          </span>
          <span className="text-[11px] text-slate-400 block mt-1 font-mono">Volume de saída física</span>
        </div>
      </div>

      {/* Seção Intermediária: Top 5 Produtos + Composição de Pagamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Produtos Mais Vendidos (2 colunas) */}
        <div className="glass-panel p-5 lg:col-span-2 accent-line">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">Top 5 Produtos Mais Vendidos</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Classificação por unidades</span>
          </div>

          <div className="space-y-3.5">
            {rankingTopVendidos.map((prod, idx) => (
              <div key={prod.produtoId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-white truncate">{prod.nome}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs flex-shrink-0">
                    <span className="font-bold text-cyan-300">{prod.quantidade} un</span>
                    <span className="text-slate-400">R$ {prod.receita.toFixed(2)}</span>
                  </div>
                </div>
                {/* Barra de Progresso Neon */}
                <div className="w-full bg-[#080d20] h-2 rounded-full overflow-hidden border border-cyan-500/20">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${prod.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divisão por Formas de Pagamento (1 coluna) */}
        <div className="glass-panel p-5 flex flex-col justify-between accent-line">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">Formas de Pagamento</h2>
            </div>

            <div className="space-y-3">
              {resumoPagamentos.map(pag => (
                <div key={pag.forma} className="p-2.5 rounded-xl bg-[#080d20] border border-cyan-500/10 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{pag.forma}</span>
                    <span className="font-mono text-cyan-400 font-bold">{pag.percentual}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{pag.qtd} pedidos</span>
                    <span>R$ {pag.valor.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Conciliação automática</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              Ativo <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca de Vendas */}
      <div className="glass-panel p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por código (VND-...) ou nome de produto..."
            className="w-full bg-[#080d20] border border-cyan-500/20 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['todas', 'PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'].map(fp => (
            <button
              key={fp}
              onClick={() => setFiltroPagamento(fp)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                filtroPagamento === fp
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.2)]'
                  : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {fp === 'todas' ? 'Todos os Pagamentos' : fp}
            </button>
          ))}
        </div>
      </div>

      {/* Histórico de Vendas */}
      <div className="glass-panel overflow-hidden accent-line">
        <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-wide">Extrato de Vendas Registradas</h2>
          <span className="badge-pill badge-pill-cyan">{vendasFiltradas.length} transações</span>
        </div>

        <div className="overflow-x-auto">
          <table className="custom-table text-xs">
            <thead>
              <tr>
                <th>Código</th>
                <th>Data/Hora</th>
                <th>Itens do Pedido</th>
                <th>Forma de Pagamento</th>
                <th>Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Nenhuma venda encontrada para os critérios selecionados.
                  </td>
                </tr>
              ) : (
                vendasFiltradas.map(v => (
                  <tr key={v.id}>
                    <td className="font-mono text-cyan-300 font-bold">{v.codigo}</td>
                    <td className="font-mono text-slate-400 whitespace-nowrap">{v.dataHora}</td>
                    <td className="text-white">
                      {v.itens.map((it, idx) => {
                        const prod = produtos.find(p => p.id === it.produtoId);
                        return (
                          <span key={idx} className="block text-slate-300">
                            {it.quantidade}x {prod ? prod.nome : 'Item'} (R$ {it.precoUnitario.toFixed(2)})
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      <span className={`badge-pill ${getBadgePagamento(v.formaPagamento)}`}>
                        {v.formaPagamento}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-white text-sm">
                      R$ {v.valorTotal.toFixed(2)}
                    </td>
                    <td>
                      <span className="badge-pill badge-pill-green">CONCLUÍDA</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VendasPage;
