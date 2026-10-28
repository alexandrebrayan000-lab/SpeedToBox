'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FormaPagamento } from '../../types';

export function ModalNovaVenda() {
  const { produtos, isNovaVendaOpen, setIsNovaVendaOpen, registrarVenda } = useStore();

  const [itens, setItens] = useState<{ produtoId: string; quantidade: number }[]>([
    { produtoId: produtos[0]?.id || '', quantidade: 1 }
  ]);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX');
  const [mensagemStatus, setMensagemStatus] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  if (!isNovaVendaOpen) return null;

  const handleAddItem = () => {
    setItens(prev => [...prev, { produtoId: produtos[0]?.id || '', quantidade: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItens(prev => prev.filter((_, i) => i !== index));
  };

  const handleChangeProduto = (index: number, produtoId: string) => {
    setItens(prev => {
      const next = [...prev];
      next[index].produtoId = produtoId;
      return next;
    });
  };

  const handleChangeQtd = (index: number, quantidade: number) => {
    setItens(prev => {
      const next = [...prev];
      next[index].quantidade = Math.max(1, quantidade);
      return next;
    });
  };

  // Cálculo de Subtotal e Total
  const total = itens.reduce((acc, item) => {
    const prod = produtos.find(p => p.id === item.produtoId);
    return acc + (prod ? prod.precoVenda * item.quantidade : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemStatus(null);

    const itensParaVenda = itens.map(i => {
      const prod = produtos.find(p => p.id === i.produtoId);
      return {
        produtoId: i.produtoId,
        quantidade: i.quantidade,
        precoUnitario: prod ? prod.precoVenda : 0
      };
    });

    const resultado = registrarVenda(itensParaVenda, formaPagamento);

    if (resultado.sucesso) {
      setMensagemStatus({ tipo: 'sucesso', texto: resultado.mensagem });
      setTimeout(() => {
        setIsNovaVendaOpen(false);
        setMensagemStatus(null);
        setItens([{ produtoId: produtos[0]?.id || '', quantidade: 1 }]);
      }, 1500);
    } else {
      setMensagemStatus({ tipo: 'erro', texto: resultado.mensagem });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Registrar Nova Venda</h2>
              <span className="text-xs text-slate-400">Frente de Caixa &amp; Baixa Automática no Estoque</span>
            </div>
          </div>

          <button
            onClick={() => setIsNovaVendaOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mensagemStatus && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
              mensagemStatus.tipo === 'sucesso'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
            }`}
          >
            {mensagemStatus.tipo === 'sucesso' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{mensagemStatus.texto}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Itens da Venda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Itens do Pedido</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {itens.map((item, idx) => {
                const prod = produtos.find(p => p.id === item.produtoId);
                const sub = prod ? prod.precoVenda * item.quantidade : 0;

                return (
                  <div key={idx} className="flex items-center gap-2 bg-[#080d20] p-2.5 rounded-xl border border-cyan-500/15">
                    <select
                      value={item.produtoId}
                      onChange={e => handleChangeProduto(idx, e.target.value)}
                      className="flex-1 bg-[#0c1328] border border-cyan-500/20 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none"
                    >
                      {produtos.map(p => (
                        <option key={p.id} value={p.id} disabled={p.estoque <= 0}>
                          {p.nome} — R$ {p.precoVenda.toFixed(2)} ({p.estoque} {p.unidade} disp.)
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      value={item.quantidade}
                      onChange={e => handleChangeQtd(idx, parseInt(e.target.value) || 1)}
                      className="w-18 bg-[#0c1328] border border-cyan-500/20 text-white text-xs rounded-lg px-2 py-1.5 text-center font-mono outline-none"
                    />

                    <span className="w-20 text-right text-xs font-mono font-bold text-cyan-400">
                      R$ {sub.toFixed(2)}
                    </span>

                    {itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'] as FormaPagamento[]).map(fp => (
                <button
                  type="button"
                  key={fp}
                  onClick={() => setFormaPagamento(fp)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    formaPagamento === fp
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                      : 'bg-[#080d20] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {fp}
                </button>
              ))}
            </div>
          </div>

          {/* Total & Botão de Confirmar */}
          <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Valor Total</span>
              <span className="text-xl font-extrabold font-mono text-white">R$ {total.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsNovaVendaOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={total <= 0}
                className="btn-neon-primary text-xs py-2 px-5 disabled:opacity-50"
              >
                Concluir Venda
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
