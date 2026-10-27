'use client';

import React, { useState } from 'react';
import { PackagePlus, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const CATEGORIES = [
  'Alimentos',
  'Bebidas',
  'Limpeza',
  'Higiene',
  'Padaria',
  'Frios & Laticínios',
  'Hortifruti',
  'Utilidades'
];

export function NewProductModal() {
  const { isNewProductOpen, setIsNewProductOpen, addProduct, addLot } = useStore();

  const [nome, setNome] = useState('');
  const [sku, setSku] = useState('');
  const [categoria, setCategoria] = useState('Alimentos');
  const [estoque, setEstoque] = useState(0);
  const [estoqueMinimo, setEstoqueMinimo] = useState(10);
  const [precoCusto, setPrecoCusto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [unidade, setUnidade] = useState('UN');
  const [codigoLote, setCodigoLote] = useState('');
  const [dataValidade, setDataValidade] = useState('');

  if (!isNewProductOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !sku.trim()) return;

    const custo = parseFloat(precoCusto) || 0;
    const venda = parseFloat(precoVenda) || 0;

    addProduct({
      nome,
      sku: sku.toUpperCase(),
      categoria,
      estoque: Number(estoque),
      estoqueMinimo: Number(estoqueMinimo),
      precoCusto: custo,
      precoVenda: venda,
      unidade
    });

    // Optionally create lot if supplied
    if (codigoLote.trim() && dataValidade) {
      addLot({
        produtoId: 'prod_new', // will attach
        codigoLote,
        quantidade: Number(estoque),
        dataEntrada: new Date().toISOString().slice(0, 10),
        dataValidade
      });
    }

    setIsNewProductOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsNewProductOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <PackagePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">Cadastrar Novo Produto</h3>
                <p className="text-xs text-slate-400">Insira as informações do item para o catálogo do SpeedToBox</p>
              </div>
            </div>
            <button
              onClick={() => setIsNewProductOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Arroz Integral Premium 5kg"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="cyber-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Código / SKU *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ALM-ARR-002"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  className="cyber-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria *</label>
                <select
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                  className="cyber-select w-full"
                  required
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estoque Inicial (UN)</label>
                <input
                  type="number"
                  min="0"
                  value={estoque}
                  onChange={e => setEstoque(Number(e.target.value))}
                  className="cyber-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estoque Mínimo (Alerta)</label>
                <input
                  type="number"
                  min="1"
                  value={estoqueMinimo}
                  onChange={e => setEstoqueMinimo(Number(e.target.value))}
                  className="cyber-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preço de Custo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={precoCusto}
                  onChange={e => setPrecoCusto(e.target.value)}
                  className="cyber-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preço de Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={precoVenda}
                  onChange={e => setPrecoVenda(e.target.value)}
                  className="cyber-input"
                />
              </div>
            </div>

            {/* Optional Lot info */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 mb-6">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                Identificação de Lote Inicial (Opcional - FIFO)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Código do Lote</label>
                  <input
                    type="text"
                    placeholder="Ex: Lote 0924"
                    value={codigoLote}
                    onChange={e => setCodigoLote(e.target.value)}
                    className="cyber-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Data de Validade</label>
                  <input
                    type="date"
                    value={dataValidade}
                    onChange={e => setDataValidade(e.target.value)}
                    className="cyber-input text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewProductOpen(false)}
                className="btn-cyber-secondary text-xs py-2 px-4"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-cyber-primary text-xs py-2 px-6">
                Salvar Produto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
