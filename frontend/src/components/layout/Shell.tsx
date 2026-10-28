'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ChatbotWidget } from './ChatbotWidget';
import { ModalNovaVenda } from '../modals/ModalNovaVenda';
import { ModalNovaMovimentacao } from '../modals/ModalNovaMovimentacao';
import { ModalNovoProduto } from '../modals/ModalNovoProduto';

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#060919] text-[#f4f7ff] flex relative">
      {/* Sidebar Fixa */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Área de Conteúdo Principal */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 min-w-0"
        style={{
          marginLeft: isSidebarCollapsed ? '80px' : '256px',
          width: isSidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)'
        }}
      >
        <TopBar />

        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

        {/* Rodapé do Sistema */}
        <footer className="py-4 px-8 border-t border-cyan-500/10 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SpeedToBox • Controle de Estoque, Lotes &amp; Vendas Integrado</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>Projeto Integrador II</span>
            <span>Brayan &amp; Mylenna</span>
          </div>
        </footer>
      </div>

      {/* Assistente IA e Modais Globais */}
      <ChatbotWidget />
      <ModalNovaVenda />
      <ModalNovaMovimentacao />
      <ModalNovoProduto />
    </div>
  );
}
