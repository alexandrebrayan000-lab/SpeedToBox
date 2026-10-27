'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Clock,
  Plus,
  ArrowDownLeft,
  Bell,
  Package,
  Boxes,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function TopBar() {
  const router = useRouter();
  const { produtos, lotes, alertas, setIsNovaVendaOpen, setIsNovaEntradaOpen } = useStore();

  const [time, setTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('pt-BR'));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = query
    ? produtos.filter(
        p => p.nome.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];

  const filteredLots = query
    ? lotes.filter(l => l.codigoLote.toLowerCase().includes(query)).slice(0, 3)
    : [];

  return (
    <header className="h-18 px-6 lg:px-8 border-b border-cyan-500/15 bg-[#080d20]/80 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search Input with Live Dropdown */}
      <div className="relative flex-1 max-w-md">
        <div className="flex items-center gap-2.5 bg-[#0c1328] border border-cyan-500/20 focus-within:border-cyan-400 rounded-xl px-3.5 py-2 text-xs transition-all shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]">
          <Search className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar por produto, código ou lote..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-slate-500 text-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Modal */}
        {isSearchOpen && query && (
          <div className="absolute top-12 left-0 right-0 bg-[#0c1328] border border-cyan-500/30 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
            {filteredProducts.length === 0 && filteredLots.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">Nenhum resultado encontrado.</p>
            ) : (
              <div className="space-y-2">
                {filteredProducts.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      Produtos
                    </span>
                    {filteredProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/produtos');
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-white font-medium">{p.nome}</span>
                        </div>
                        <span className="font-mono text-slate-400">{p.estoque} {p.unidade}</span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredLots.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                      Lotes
                    </span>
                    {filteredLots.map(l => (
                      <div
                        key={l.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/lotes');
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Boxes className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-white font-medium">{l.codigoLote}</span>
                        </div>
                        <span className="font-mono text-slate-400">Validade: {l.dataValidade}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-300 bg-[#0c1328] px-3 py-1.5 rounded-xl border border-cyan-500/20">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span suppressHydrationWarning>{time || '10:00:00'}</span>
        </div>

        {/* Action: Nova Venda */}
        <button
          onClick={() => setIsNovaVendaOpen(true)}
          className="btn-neon-primary text-xs py-2 px-3.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Venda</span>
        </button>

        {/* Action: Entrada de Mercadoria */}
        <button
          onClick={() => setIsNovaEntradaOpen(true)}
          className="btn-neon-secondary text-xs py-2 px-3 hidden md:inline-flex"
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>+ Entrada</span>
        </button>

        {/* Bell Alerts */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl bg-[#0c1328] border border-cyan-500/20 text-slate-300 hover:text-white flex items-center justify-center transition-all relative"
            title="Alertas"
          >
            <Bell className="w-4 h-4" />
            {alertas.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                {alertas.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-[#0c1328] border border-cyan-500/30 rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-white">Alertas Operacionais</span>
                <span className="text-[10px] text-cyan-400 font-mono">{alertas.length} ativos</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {alertas.map(a => (
                  <div key={a.id} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="font-semibold text-rose-400 block">{a.titulo}</span>
                    <span className="text-[11px] text-slate-300">{a.mensagem}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-cyan-500/15">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_8px_rgba(0,217,255,0.3)]">
            BM
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-tight">Brayan &amp; Mylenna</span>
            <span className="text-[10px] text-slate-400 leading-tight">Gestores do Estabelecimento</span>
          </div>
        </div>
      </div>
    </header>
  );
}
