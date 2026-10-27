'use client';

import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function NewSaleModal() {
  const { isNewSaleOpen, setIsNewSaleOpen, products, addSale, showToast } = useStore();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantidade, setQuantidade] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState('PIX');

  if (!isNewSaleOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];
  const unitPrice = currentProduct ? currentProduct.precoVenda : 0;
  const subtotal = unitPrice * quantidade;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (quantidade <= 0) {
      showToast('A quantidade deve ser maior que zero.', 'error');
      return;
    }

    if (quantidade > currentProduct.estoque) {
      showToast(
        `Estoque insuficiente! Disponível: ${currentProduct.estoque} ${currentProduct.unidade}`,
        'error'
      );
      return;
    }

    const success = addSale({
      itens: [
        {
          produtoId: currentProduct.id,
          quantidade: Number(quantidade),
          precoUnitario: unitPrice
        }
      ],
      formaPagamento
    });

    if (success) {
      setIsNewSaleOpen(false);
      setQuantidade(1);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewSaleOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">Registrar Nova Venda</h3>
                <p className="text-xs text-slate-400">Selecione o produto, informe a quantidade e confirme a baixa</p>
              </div>
            </div>
            <button
              onClick={() => setIsNewSaleOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Produto *</label>
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="cyber-select w-full"
                required
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — R$ {p.precoVenda.toFixed(2)} (Saldo: {p.estoque} {p.unidade})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quantidade *</label>
                <input
                  type="number"
                  min="1"
                  max={currentProduct ? currentProduct.estoque : 999}
                  value={quantidade}
                  onChange={e => setQuantidade(Number(e.target.value))}
                  className="cyber-input"
                  required
                />
                {currentProduct && (
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Disponível:{' '}
                    <span className="text-cyan-400 font-bold">
                      {currentProduct.estoque} {currentProduct.unidade}
                    </span>
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preço Unitário (R$)</label>
                <input
                  type="text"
                  readOnly
                  value={`R$ ${unitPrice.toFixed(2)}`}
                  className="cyber-input bg-slate-900/80 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Forma de Pagamento *</label>
              <select
                value={formaPagamento}
                onChange={e => setFormaPagamento(e.target.value)}
                className="cyber-select w-full"
              >
                <option value="PIX">PIX (Instantâneo)</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro em Espécie</option>
                <option value="Boleto">Boleto Bancário</option>
              </select>
            </div>

            {/* Total Highlight Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 uppercase tracking-wider block font-semibold">
                  Valor Total a Cobrar
                </span>
                <span className="text-[11px] text-slate-400">Atualização automática</span>
              </div>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                R$ {subtotal.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewSaleOpen(false)}
                className="btn-cyber-secondary text-xs py-2 px-4"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-cyber-primary text-xs py-2 px-6">
                Confirmar Venda
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
