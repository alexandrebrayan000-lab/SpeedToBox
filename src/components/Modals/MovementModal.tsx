'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function MovementModal() {
  const { movementModal, setMovementModal, products, lots, addMovement, showToast, settings } = useStore();

  const [tipo, setTipo] = useState<'entrada' | 'saida' | 'perda' | 'avaria'>('entrada');
  const [produtoId, setProdutoId] = useState(products[0]?.id || '');
  const [loteId, setLoteId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [referencia, setReferencia] = useState('');

  useEffect(() => {
    if (movementModal.isOpen) {
      setTipo(movementModal.tipo);
      if (movementModal.productId) {
        setProdutoId(movementModal.productId);
      } else if (products[0]) {
        setProdutoId(products[0].id);
      }
      setQuantidade(1);
      setMotivo(
        movementModal.tipo === 'entrada'
          ? 'Compra de Reposição'
          : movementModal.tipo === 'perda'
          ? 'Vencimento no Estoque'
          : movementModal.tipo === 'avaria'
          ? 'Avaria de Transporte'
          : 'Saída Operacional'
      );
      setReferencia('');
    }
  }, [movementModal, products]);

  if (!movementModal.isOpen) return null;

  const currentProduct = products.find(p => p.id === produtoId) || products[0];
  const productLots = lots.filter(l => l.produtoId === produtoId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (quantidade <= 0) {
      showToast('A quantidade deve ser maior que zero.', 'error');
      return;
    }

    if (tipo !== 'entrada' && quantidade > currentProduct.estoque) {
      showToast(
        `Quantidade maior que o saldo em estoque (${currentProduct.estoque} ${currentProduct.unidade}).`,
        'error'
      );
      return;
    }

    addMovement({
      produtoId,
      tipo,
      quantidade: Number(quantidade),
      motivo: motivo || (tipo === 'entrada' ? 'Entrada Avulsa' : 'Saída Avulsa'),
      loteId: loteId || null,
      usuario: settings.usuario.nome || 'Operador',
      referencia: referencia || (tipo === 'entrada' ? 'Ajuste Entrada' : 'Ajuste Saída')
    });

    setMovementModal({ isOpen: false, tipo: 'entrada' });
  };

  return (
    <div className="modal-overlay" onClick={() => setMovementModal({ isOpen: false, tipo: 'entrada' })}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tipo === 'entrada'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                }`}
              >
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {tipo === 'entrada' ? 'Registrar Entrada de Mercadoria' : 'Registrar Saída / Perda de Estoque'}
                </h3>
                <p className="text-xs text-slate-400">
                  {tipo === 'entrada'
                    ? 'Abasteça o catálogo físico ou dê entrada em novos lotes'
                    : 'Registre baixas por vendas, avarias de frete ou descarte'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMovementModal({ isOpen: false, tipo: 'entrada' })}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Movimentação *</label>
                <select
                  value={tipo}
                  onChange={e => setTipo(e.target.value as any)}
                  className="cyber-select w-full"
                >
                  <option value="entrada">Entrada (+) [Abastecimento]</option>
                  <option value="saida">Saída (-) [Venda / Consumo]</option>
                  <option value="perda">Perda (-) [Vencimento / Descarte]</option>
                  <option value="avaria">Avaria (-) [Danificado em Trânsito]</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Produto *</label>
                <select
                  value={produtoId}
                  onChange={e => setProdutoId(e.target.value)}
                  className="cyber-select w-full"
                  required
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (Atual: {p.estoque} {p.unidade})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quantidade *</label>
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={e => setQuantidade(Number(e.target.value))}
                  className="cyber-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vincular a Lote (Opcional)</label>
                <select
                  value={loteId}
                  onChange={e => setLoteId(e.target.value)}
                  className="cyber-select w-full"
                >
                  <option value="">Sem lote específico</option>
                  {productLots.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.codigoLote} (Saldo: {l.quantidade} un - Val: {l.dataValidade})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Motivo / Descrição *</label>
              <input
                type="text"
                required
                placeholder="Ex: Compra de Reposição NF-84920"
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                className="cyber-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Documento / Referência</label>
              <input
                type="text"
                placeholder="Ex: NF-e 99312 ou Laudo Avaria #04"
                value={referencia}
                onChange={e => setReferencia(e.target.value)}
                className="cyber-input"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMovementModal({ isOpen: false, tipo: 'entrada' })}
                className="btn-cyber-secondary text-xs py-2 px-4"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`text-xs py-2 px-6 ${
                  tipo === 'entrada' ? 'btn-cyber-success' : 'btn-cyber-danger'
                }`}
              >
                Confirmar {tipo.toUpperCase()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
