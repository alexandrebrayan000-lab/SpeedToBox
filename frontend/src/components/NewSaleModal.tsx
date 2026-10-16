'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingCart } from 'lucide-react';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (saleData: any) => void;
}

export function NewSaleModal({ isOpen, onClose, onSuccess }: NewSaleModalProps) {
  const [product, setProduct] = useState('Arroz Nobre Tipo 1 5kg');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [price, setPrice] = useState(28.5);

  if (!isOpen) return null;

  const handleProductChange = (name: string) => {
    setProduct(name);
    if (name.includes('Arroz')) setPrice(28.5);
    else if (name.includes('Feijão')) setPrice(8.9);
    else if (name.includes('Óleo')) setPrice(6.5);
    else if (name.includes('Café')) setPrice(21.5);
    else setPrice(15.0);
  };

  const total = quantity * price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      id: `VND-${Date.now().toString().slice(-4)}`,
      product,
      quantity,
      paymentMethod,
      total,
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg cyber-card p-6 bg-[#0B1228] border border-cyan-500/40 shadow-[0_0_40px_rgba(0,217,255,0.2)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#168BFF]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Registrar Nova Venda</h2>
              <p className="text-[11px] text-slate-400">Atualiza automaticamente o estoque e os relatórios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Produto:</label>
            <select
              value={product}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full cyber-select py-2 text-xs"
            >
              <option value="Arroz Nobre Tipo 1 5kg">Arroz Nobre Tipo 1 5kg — R$ 28,50</option>
              <option value="Feijão Carioca Tipo 1 1kg">Feijão Carioca Tipo 1 1kg — R$ 8,90</option>
              <option value="Óleo de Soja 900ml">Óleo de Soja 900ml — R$ 6,50</option>
              <option value="Café Torrado e Moído 500g">Café Torrado e Moído 500g — R$ 21,50</option>
              <option value="Detergente Líquido Neutro 500ml">Detergente Líquido Neutro 500ml — R$ 3,20</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantidade:</label>
              <input
                type="number"
                min="1"
                max="999"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full cyber-input py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pagamento:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full cyber-select py-2 text-xs"
              >
                <option value="PIX">PIX (Imediato)</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro Físico</option>
              </select>
            </div>
          </div>

          {/* Total summary */}
          <div className="p-3.5 rounded-xl bg-[#080D20] border border-[#168BFF]/25 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total da Transação:</span>
            <span className="text-lg font-black text-cyan-300">
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-cyber-primary py-2 px-4 text-xs font-semibold cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
