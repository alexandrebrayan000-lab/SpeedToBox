'use client';

import React, { useState, useEffect } from 'react';
import { Search, Clock, Plus, ArrowDownLeft, Bell } from 'lucide-react';

interface TopBarProps {
  onOpenNewSale: () => void;
}

export function TopBar({ onOpenNewSale }: TopBarProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-[72px] w-full px-6 lg:px-8 border-b border-[#168BFF]/15 bg-[#080D20]/75 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2.5 bg-[#0B1228]/90 border border-[#168BFF]/25 hover:border-cyan-400/50 rounded-xl px-3.5 py-2 text-xs text-slate-300 w-full focus-within:border-cyan-400 focus-within:shadow-[0_0_12px_rgba(0,217,255,0.25)] transition-all">
          <Search className="w-4 h-4 text-cyan-400/80 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar movimentações..."
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder:text-slate-500 text-xs"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5 flex-shrink-0">
        {/* Dynamic Clock */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-300 bg-[#0B1228]/80 px-3 py-1.5 rounded-lg border border-cyan-500/20 shadow-[0_0_8px_rgba(0,217,255,0.1)]">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{time || '16:00:00'}</span>
        </div>

        {/* Action: Nova Venda */}
        <button
          onClick={onOpenNewSale}
          className="btn-cyber-primary text-xs py-2 px-3.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Nova Venda</span>
        </button>

        {/* Action: Entrada */}
        <button className="hidden md:inline-flex items-center gap-1.5 text-xs py-2 px-3 rounded-xl bg-[#0B1228] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400/60 transition-all font-semibold cursor-pointer">
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <span>+ Entrada</span>
        </button>

        {/* Bell with unread badge */}
        <button className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/40 transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_6px_#FF3864]">
            8
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(0,217,255,0.3)]">
            BM
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-tight">Brayan &amp; Mylenna</span>
            <span className="text-[10px] text-slate-400 leading-tight">Gestores do Estabelecimento</span>
          </div>
        </div>
      </div>
    </header>
  );
}
