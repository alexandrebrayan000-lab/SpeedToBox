'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ChatbotWidget } from './ChatbotWidget';
import { ModalNovaVenda } from '../modals/ModalNovaVenda';
import { ModalNovaMovimentacao } from '../modals/ModalNovaMovimentacao';
import { ModalNovoProduto } from '../modals/ModalNovoProduto';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#060919] text-white flex flex-col">
      {/* Barra de Navegação Lateral */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Conteúdo Principal com compensação da largura da barra lateral */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
        style={{ marginLeft: isCollapsed ? '80px' : '256px' }}
      >
        <TopBar />

        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

        {/* Rodapé do Sistema */}
        <footer className="py-4 px-8 border-t border-cyan-500/10 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SpeedToBox • Sistema de Gestão de Estoque &amp; PDV</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>v1.0</span>
            <span>© {new Date().getFullYear()} SpeedToBox</span>
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
