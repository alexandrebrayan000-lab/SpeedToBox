'use client';

import React, { useState } from 'react';
import { X, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { TipoMovimentacao } from '../../types';

export function ModalNovaMovimentacao() {
  const { produtos, lotes, isNovaEntradaOpen, setIsNovaEntradaOpen, registrarMovimentacao } = useStore();

  const [produtoId, setProdutoId] = useState(produtos[0]?.id || '');
  const [tipo, setTipo] = useState<TipoMovimentacao>('entrada');
  const [quantidade, setQuantidade] = useState<number>(10);
  const [custoUnitario, setCustoUnitario] = useState<number>(15.0);
  const [loteId, setLoteId] = useState<string>('');
  const [motivo, setMotivo] = useState('Compra de Reposição / Fornecedor');
  const [sucesso, setSucesso] = useState(false);

  if (!isNovaEntradaOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoId || quantidade <= 0) return;

    registrarMovimentacao(
      produtoId,
      tipo,
      quantidade,
      motivo,
      custoUnitario,
      loteId || null
    );

    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setIsNovaEntradaOpen(false);
    }, 1200);
  };

  const lotesDoProduto = lotes.filter(l => l.produtoId === produtoId);

  return (
    <div className="modal-overlay">
      <div className="modal-card p-6">
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Registrar Movimentação de Estoque</h2>
              <span className="text-xs text-slate-400">Entrada (Compra), Saída, Perda ou Ajuste</span>
            </div>
          </div>

          <button
            onClick={() => setIsNovaEntradaOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sucesso && (
          <div className="p-3 rounded-xl mb-4 text-xs flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Movimentação registrada com sucesso no saldo do estoque!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Tipo de Operação */}
          <div>
            <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['entrada', 'saida', 'perda', 'avaria'] as TipoMovimentacao[]).map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setTipo(t);
                    if (t === 'entrada') setMotivo('Compra de Reposição / Fornecedor');
                    if (t === 'perda') setMotivo('Vencimento no Estoque');
                    if (t === 'avaria') setMotivo('Dano no Transporte / Armazenagem');
                  }}
                  className={`py-2 rounded-xl font-bold uppercase text-[11px] border transition-all text-center ${
                    tipo === t
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                      : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Selecionar Produto */}
          <div>
            <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Produto
            </label>
            <select
              value={produtoId}
              onChange={e => setProdutoId(e.target.value)}
              className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl outline-none"
            >
              {produtos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} — Saldo Atual: {p.estoque} {p.unidade}
                </option>
              ))}
            </select>
          </div>

          {/* Quantidade e Custo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min={1}
                value={quantidade}
                onChange={e => setQuantidade(parseInt(e.target.value) || 1)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl font-mono text-center outline-none"
              />
            </div>

            {tipo === 'entrada' && (
              <div>
                <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Custo Unitário (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={custoUnitario}
                  onChange={e => setCustoUnitario(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl font-mono text-center outline-none"
                />
              </div>
            )}
          </div>

          {/* Lote Opcional */}
          {lotesDoProduto.length > 0 && (
            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Vincular a um Lote Específico
              </label>
              <select
                value={loteId}
                onChange={e => setLoteId(e.target.value)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl outline-none"
              >
                <option value="">Nenhum / Lote Geral</option>
                {lotesDoProduto.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.codigoLote} (Validade: {l.dataValidade} - Saldo: {l.quantidade} un)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Motivo / Descrição */}
          <div>
            <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Motivo / Referência
            </label>
            <input
              type="text"
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNovaEntradaOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-neon-primary py-2 px-5">
              Confirmar Movimentação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
