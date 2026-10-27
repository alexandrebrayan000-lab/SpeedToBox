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
  Plus
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { alerts, setIsNewSaleOpen } = useStore();
  const unreadAlerts = alerts.length;

  const menuItems = [
    { href: '/', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/produtos', label: 'Produtos', icon: Package },
    { href: '/lotes', label: 'Lotes e validades', icon: Boxes },
    { href: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
    { href: '/vendas', label: 'Vendas e analítica', icon: TrendingUp },
    { href: '/relatorios', label: 'Relatórios', icon: FileBarChart },
    { href: '/alertas', label: 'Alertas', icon: Bell, badge: unreadAlerts > 0 ? unreadAlerts : null },
    { href: '/configuracoes', label: 'Configurações', icon: Settings }
  ];

  return (
    <aside
      className={`h-screen fixed top-0 left-0 z-40 bg-gradient-to-b from-[#080D20] via-[#050816] to-[#080D20] backdrop-blur-2xl border-r border-[#168BFF]/15 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      {/* Top Brand Area: Exatamente 72px para alinhar com a TopBar */}
      <div>
        <div
          className={`h-[72px] flex items-center ${
            isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
          } border-b border-[#168BFF]/15`}
        >
          <Link href="/" className="flex items-center gap-3">
            {/* 3D Isometric Neon Box Logo */}
            <div className="w-10 h-10 relative flex-shrink-0 logo-box-glow">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                {/* Top Face */}
                <polygon
                  points="24,4 42,14 24,24 6,14"
                  fill="url(#cubeTopGrad)"
                  stroke="#00D9FF"
                  strokeWidth="1.5"
                />
                {/* Left Face */}
                <polygon
                  points="6,14 24,24 24,44 6,34"
                  fill="url(#cubeLeftGrad)"
                  stroke="#168BFF"
                  strokeWidth="1.5"
                />
                {/* Right Face */}
                <polygon
                  points="24,24 42,14 42,34 24,44"
                  fill="url(#cubeRightGrad)"
                  stroke="#8B35FF"
                  strokeWidth="1.5"
                />
                {/* Inner Neon Core */}
                <circle cx="24" cy="24" r="3" fill="#00D9FF" filter="drop-shadow(0 0 6px #00D9FF)" />
                <defs>
                  <linearGradient id="cubeTopGrad" x1="6" y1="4" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D9FF" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#168BFF" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="cubeLeftGrad" x1="6" y1="14" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#168BFF" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#050816" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="cubeRightGrad" x1="24" y1="24" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B35FF" stopOpacity="0.95" />
                    <stop offset="1" stopColor="#F32BFF" stopOpacity="0.45" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span
                    className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-cyan-100 to-purple-300 bg-clip-text text-transparent"
                    style={{ fontFamily: 'var(--font-display, Inter)' }}
                  >
                    SPEED<span className="text-cyan-400">TOBOX</span>
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#A3B2D1]/70 font-semibold font-mono">
                  Gestão & Estoque
                </span>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors"
              title="Recolher menu"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-hidden">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                } py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold ${
                  isActive
                    ? 'nav-active'
                    : 'text-[#A3B2D1] hover:text-white hover:bg-[#101A35]/50'
                }`}
              >
                <div className="relative flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isActive ? 'text-cyan-400 scale-105' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {isCollapsed && item.badge && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#FF3864]"></span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/35 pulse-red">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Quick Action */}
      <div className="p-3 border-t border-[#168BFF]/15">
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors"
            title="Expandir menu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="cyber-card p-3 flex items-center justify-between border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white">SpeedToBox Online</span>
                <span className="text-[9px] text-[#A3B2D1]/70 font-mono tracking-tight">Estoque & PDV v2.0</span>
              </div>
            </div>
            <button
              onClick={() => setIsNewSaleOpen(true)}
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,217,255,0.4)]"
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
