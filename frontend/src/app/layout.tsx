'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import { StoreProvider, useStore } from '../context/StoreContext';
import { NeonCanvas } from '../components/NeonCanvas';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { GlobalModals } from '../components/Modals/GlobalModals';
import { ToastContainer } from '../components/ToastContainer';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { setIsNewSaleOpen, setIsNewProductOpen, setMovementModal, setReportPreview } = useStore();

  // Setup Global Keyboard Shortcuts
  useEffect(() => {
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

  const offsetClass = isSidebarCollapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Dynamic Ambient Neon Canvas */}
      <NeonCanvas />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 ${offsetClass} flex flex-col min-h-screen transition-all duration-300 relative z-10`}>
        <TopBar />

        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

        {/* Minimal Cyberpunk Footer */}
        <footer className="py-4 px-8 border-t border-[#168BFF]/10 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SpeedToBox v2.0 Enterprise • Painel Cyberpunk Neon (Next.js)</span>
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

      {/* Global Modals & Toasts */}
      <GlobalModals />
      <ToastContainer />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>SpeedToBox — Sistema de Controle de Estoque & Vendas Cyberpunk Neon</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050816] text-[#F4F7FF] antialiased selection:bg-[#8B35FF] selection:text-white">
        <StoreProvider>
          <AppLayoutContent>{children}</AppLayoutContent>
        </StoreProvider>
      </body>
    </html>
  );
}
