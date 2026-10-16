'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { NeonBackground } from './NeonBackground';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase">
            SpeedToBox Carregando...
          </span>
        </div>
      </div>
    );
  }

  const sidebarWidth = isCollapsed ? 80 : 256;

  return (
    <div className="relative z-10 min-h-screen flex bg-[#050816] text-[#F4F7FF]">
      {/* Dynamic Ambient Background Canvas */}
      <NeonBackground />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area - Strictly offset so sidebar NEVER overlaps! */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10 min-w-0"
        style={{
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <TopBar onOpenNewSale={() => {
          // Trigger global new sale modal by dispatching custom event or state
          window.dispatchEvent(new CustomEvent('open-new-sale-modal'));
        }} />

        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

        {/* Minimal Cyberpunk Footer */}
        <footer className="py-4 px-8 border-t border-[#168BFF]/10 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SpeedToBox v2.0 Enterprise • Painel Cyberpunk Neon</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>
              Atalhos: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">Ctrl+N</kbd> Nova Venda
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 font-mono">Ctrl+P</kbd> Novo Produto
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
