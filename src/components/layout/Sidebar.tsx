'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ArrowLeftRight,
  TrendingUp,
  FileBarChart,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Plus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { alertas, setIsNovaVendaOpen, setIsChatOpen } = useStore();
  const totalAlertas = alertas.length;

  const menuItems = [
    { href: '/', label: 'Visão Geral', icon: LayoutDashboard },
    { href: '/produtos', label: 'Produtos', icon: Package },
    { href: '/lotes', label: 'Lotes & Validades', icon: Boxes },
    { href: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
    { href: '/vendas', label: 'Vendas & PDV', icon: TrendingUp },
    { href: '/relatorios', label: 'Relatórios', icon: FileBarChart },
    { href: '/alertas', label: 'Alertas', icon: Bell, badge: totalAlertas > 0 ? totalAlertas : null },
    { href: '/configuracoes', label: 'Configurações', icon: Settings }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-[#080d20] border-r border-cyan-500/15 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      <div>
        {/* Brand Header */}
        <div
          className={`h-18 flex items-center ${
            isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
          } border-b border-cyan-500/15`}
        >
          <Link href="/" className="flex items-center gap-3 group">
            {/* 3D Isometric Cube Logo */}
            <div className="w-9 h-9 relative flex-shrink-0 drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <polygon points="24,4 42,14 24,24 6,14" fill="#00d9ff" fillOpacity="0.85" stroke="#00d9ff" strokeWidth="1.5" />
                <polygon points="6,14 24,24 24,44 6,34" fill="#168bff" fillOpacity="0.85" stroke="#168bff" strokeWidth="1.5" />
                <polygon points="24,24 42,14 42,34 24,44" fill="#8b35ff" fillOpacity="0.9" stroke="#8b35ff" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="3" fill="#ffffff" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-wider text-white">
                  SPEED<span className="text-cyan-400">TOBOX</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Estoque & Vendas
                </span>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
              title="Recolher menu"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                } py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'nav-link-active'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    {item.badge}
                  </span>
                )}

                {isCollapsed && item.badge && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Chatbot Button & System Status */}
      <div className="p-3 border-t border-cyan-500/15 space-y-2">
        {/* Chatbot Trigger */}
        <button
          onClick={() => setIsChatOpen(true)}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
          } rounded-xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold text-white transition-all shadow-[0_0_12px_rgba(0,217,255,0.15)]`}
          title="Assistente IA SpeedToBox"
        >
          <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-bounce" />
          {!isCollapsed && <span>Assistente IA</span>}
        </button>

        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-full flex justify-center text-slate-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-slate-800/40"
            title="Expandir menu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="glass-panel p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_8px_rgba(0,217,255,0.3)]">
                BM
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white">Brayan &amp; Mylenna</span>
                <span className="text-[9px] text-slate-400 font-mono">Gestores do Estabelecimento</span>
              </div>
            </div>

            <button
              onClick={() => setIsNovaVendaOpen(true)}
              className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black flex items-center justify-center transition-all"
              title="Nova Venda"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
