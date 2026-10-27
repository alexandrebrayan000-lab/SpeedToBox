'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '../context/StoreContext';
import { NeonCanvas } from './NeonCanvas';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { GlobalModals } from './Modals/GlobalModals';
import { ToastContainer } from './ToastContainer';

function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setIsNewSaleOpen, setIsNewProductOpen, setMovementModal, setReportPreview } = useStore();

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + N => New Sale
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewSaleOpen(true);
      }
      // Ctrl + P => New Product
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsNewProductOpen(true);
      }
      // Esc => Close all modals
      if (e.key === 'Escape') {
        setIsNewSaleOpen(false);
        setIsNewProductOpen(false);
        setMovementModal({ isOpen: false, tipo: 'entrada' });
        setReportPreview({ isOpen: false, reportKey: '', reportTitle: '' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsNewSaleOpen, setIsNewProductOpen, setMovementModal, setReportPreview]);

  return (
    <div className="min-h-screen bg-[#050816] text-[#F4F7FF]" suppressHydrationWarning>
      {/* Dynamic Ambient Neon Canvas — fora do contexto z-10 */}
      {mounted && <NeonCanvas />}

      {/* Layout principal acima do canvas */}
      <div className="relative z-10 min-h-screen flex">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div
          className="flex-1 flex flex-col min-h-screen transition-all duration-300 min-w-0 overflow-hidden"
          style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}
        >
          <TopBar />

          <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

          {/* Minimal Cyberpunk Footer */}
          <footer className="py-4 px-8 border-t border-[#168BFF]/10 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SpeedToBox v2.0 Enterprise &bull; Painel Cyberpunk Neon (Next.js)</span>
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

      {/* Global Modals & Toasts */}
      {mounted && (
        <>
          <GlobalModals />
          <ToastContainer />
        </>
      )}
    </div>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase">SpeedToBox Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider>
      <LayoutShell>{children}</LayoutShell>
    </StoreProvider>
  );
}
