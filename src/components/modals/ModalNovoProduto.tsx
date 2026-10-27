'use client';

import React, { useState } from 'react';
import { X, PackagePlus, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UnidadeMedida } from '../../types';

export function ModalNovoProduto() {
  const { isNovoProdutoOpen, setIsNovoProdutoOpen, adicionarProduto } = useStore();

  const [codigo, setCodigo] = useState('');
  const [sku, setSku] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Alimentos');
  const [unidade, setUnidade] = useState<UnidadeMedida>('UN');
  const [precoCusto, setPrecoCusto] = useState<number>(0);
  const [precoVenda, setPrecoVenda] = useState<number>(0);
  const [estoque, setEstoque] = useState<number>(10);
  const [estoqueMinimo, setEstoqueMinimo] = useState<number>(15);
  const [sucesso, setSucesso] = useState(false);

  if (!isNovoProdutoOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;

    adicionarProduto({
      codigo: codigo || `${Math.floor(100 + Math.random() * 900)}`,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      nome,
      categoria,
      unidade,
      precoCusto,
      precoVenda,
      estoque,
      estoqueMinimo,
      ativo: true
    });

    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setIsNovoProdutoOpen(false);
      setNome('');
      setCodigo('');
      setSku('');
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card p-6">
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cadastrar Novo Produto</h2>
              <span className="text-xs text-slate-400">Inserção no Catálogo e Regras de Estoque Mínimo</span>
            </div>
          </div>

          <button
            onClick={() => setIsNovoProdutoOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sucesso && (
          <div className="p-3 rounded-xl mb-4 text-xs flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Produto cadastrado com sucesso no catálogo!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Arroz Nobre 5kg"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl outline-none"
              >
                <option value="Alimentos">Alimentos</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Higiene">Higiene</option>
                <option value="Padaria">Padaria</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Código / Ref
              </label>
              <input
                type="text"
                placeholder="Ex: 015"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                SKU
              </label>
              <input
                type="text"
                placeholder="Ex: ALM-015"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Unidade
              </label>
              <select
                value={unidade}
                onChange={e => setUnidade(e.target.value as UnidadeMedida)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl outline-none"
              >
                <option value="UN">UN</option>
                <option value="KG">KG</option>
                <option value="L">L</option>
                <option value="CX">CX</option>
                <option value="PCT">PCT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Preço Custo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={precoCusto}
                onChange={e => setPrecoCusto(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl font-mono text-center outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Preço Venda (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={precoVenda}
                onChange={e => setPrecoVenda(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl font-mono text-center outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Estoque Inicial
              </label>
              <input
                type="number"
                value={estoque}
                onChange={e => setEstoque(parseInt(e.target.value) || 0)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl font-mono text-center outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Estoque Mínimo
              </label>
              <input
                type="number"
                value={estoqueMinimo}
                onChange={e => setEstoqueMinimo(parseInt(e.target.value) || 0)}
                className="w-full bg-[#080d20] border border-cyan-500/25 text-white p-2.5 rounded-xl font-mono text-center outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNovoProdutoOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-neon-primary py-2 px-5">
              Cadastrar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
