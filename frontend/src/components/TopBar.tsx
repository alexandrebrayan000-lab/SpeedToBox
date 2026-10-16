'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Clock,
  Bell,
  Plus,
  ArrowDownLeft,
  Package,
  Boxes,
  ArrowLeftRight,
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function TopBar() {
  const router = useRouter();
  const { products, lots, movements, alerts, settings, setIsNewSaleOpen, setMovementModal } = useStore();

  const [timeStr, setTimeStr] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const matchedProducts = query
    ? products.filter(
        p =>
          p.nome.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.categoria.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];

  const matchedLots = query
    ? lots.filter(l => l.codigoLote.toLowerCase().includes(query)).slice(0, 3)
    : [];

  const matchedMovements = query
    ? movements.filter(
        m => m.referencia.toLowerCase().includes(query) || m.motivo.toLowerCase().includes(query)
      ).slice(0, 3)
    : [];

  const hasResults = matchedProducts.length > 0 || matchedLots.length > 0 || matchedMovements.length > 0;

  return (
    <header className="h-20 bg-[#050816]/80 backdrop-blur-md border-b border-[#168BFF]/15 px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Global Search with Live Popover */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Pesquisar produtos, lotes, SKU, movimentações..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="cyber-input pl-10 pr-4 text-xs py-2.5 w-full placeholder:text-slate-500"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && query && (
          <div className="absolute top-12 left-0 right-0 bg-[#0B1228] border border-cyan-500/30 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] z-50 overflow-hidden max-h-80 overflow-y-auto">
            {!hasResults ? (
              <div className="p-4 text-center text-xs text-slate-400">Nenhum resultado encontrado.</div>
            ) : (
              <div>
                {matchedProducts.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-cyan-400 tracking-wider uppercase border-b border-cyan-500/10 bg-slate-900/60">
                      Produtos
                    </div>
                    {matchedProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/produtos');
                        }}
                        className="px-3 py-2 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span className="text-xs text-white">{p.nome}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {p.estoque} {p.unidade}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {matchedLots.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-purple-400 tracking-wider uppercase border-b border-purple-500/10 bg-slate-900/60">
                      Lotes
                    </div>
                    {matchedLots.map(l => (
                      <div
                        key={l.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/lotes');
                        }}
                        className="px-3 py-2 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span className="text-xs text-white">{l.codigoLote}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">{l.quantidade} un</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchedMovements.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-emerald-400 tracking-wider uppercase border-b border-emerald-500/10 bg-slate-900/60">
                      Movimentações
                    </div>
                    {matchedMovements.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push('/movimentacoes');
                        }}
                        className="px-3 py-2 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowLeftRight className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-xs text-white truncate max-w-[200px]">
                            {m.motivo} - {m.referencia}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {m.dataHora.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080D20] border border-cyan-500/20 text-xs font-mono text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>{timeStr || '14:30:00'}</span>
        </div>

        {/* Quick Action: New Sale */}
        <button
          onClick={() => setIsNewSaleOpen(true)}
          className="btn-cyber-primary text-xs py-2 px-3.5 hidden md:inline-flex"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Venda</span>
        </button>

        {/* Quick Action: New Entry */}
        <button
          onClick={() => setMovementModal({ isOpen: true, tipo: 'entrada' })}
          className="btn-cyber-secondary text-xs py-2 px-3 hidden lg:inline-flex"
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>+ Entrada</span>
        </button>

        {/* Notifications Icon with Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 rounded-xl bg-[#080D20] border border-[#168BFF]/25 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all relative"
            title="Alertas & Notificações"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center pulse-red">
                {alerts.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-[#0B1228] border border-cyan-500/30 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Alertas do Sistema</span>
                <span className="text-[10px] text-cyan-400 font-mono">{alerts.length} pendentes</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Nenhum alerta pendente.</p>
                ) : (
                  alerts.slice(0, 4).map(a => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        router.push('/alertas');
                      }}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition text-xs"
                    >
                      <div className="font-semibold text-rose-400 flex items-center justify-between">
                        <span>{a.titulo}</span>
                        <span className="text-[9px] text-slate-500">{a.dataGeracao.split(' ')[0]}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{a.mensagem}</p>
                    </div>
                  ))
                )}
              </div>
              <Link
                href="/alertas"
                onClick={() => setIsNotificationsOpen(false)}
                className="mt-3 block text-center text-xs text-cyan-400 hover:underline pt-2 border-t border-slate-800"
              >
                Ver todos os alertas ➔
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Badge with Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#080D20] border border-[#168BFF]/25 hover:border-cyan-400/50 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_8px_rgba(0,217,255,0.4)]">
              {settings.usuario.avatar || 'ST'}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">{settings.usuario.nome}</span>
              <span className="text-[10px] text-slate-400 leading-tight">{settings.usuario.cargo}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-[#0B1228] border border-cyan-500/30 rounded-xl shadow-2xl p-3 z-50 animate-fadeIn">
              <div className="pb-2 border-b border-slate-800 mb-2">
                <p className="text-xs font-bold text-white">{settings.usuario.nome}</p>
                <p className="text-[10px] text-cyan-400 font-mono truncate">{settings.usuario.email}</p>
              </div>
              <Link
                href="/configuracoes"
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Perfil & Preferências</span>
              </Link>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-emerald-400 px-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Acesso Master Autenticado</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
