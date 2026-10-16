'use client';

import React from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    { key: 'dashboard', label: 'Visão geral', icon: LayoutDashboard, href: '/' },
    { key: 'produtos', label: 'Produtos', icon: Package, href: '#' },
    { key: 'lotes', label: 'Lotes e validades', icon: Boxes, href: '#' },
    { key: 'movimentacoes', label: 'Movimentações', icon: ArrowLeftRight, href: '#' },
    { key: 'vendas', label: 'Vendas e analítica', icon: TrendingUp, href: '/vendas', active: true },
    { key: 'relatorios', label: 'Relatórios', icon: FileBarChart, href: '#' },
    { key: 'alertas', label: 'Alertas', icon: Bell, href: '#', badge: 8 },
    { key: 'configuracoes', label: 'Configurações', icon: Settings, href: '#' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-[#080D20]/95 backdrop-blur-2xl border-r border-[#168BFF]/20 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Area: Exactly 72px to align seamlessly with TopBar */}
        <div
          className={`h-[72px] flex items-center ${
            isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
          } border-b border-[#168BFF]/15`}
        >
          <div className="flex items-center gap-3">
            {/* 3D Isometric Neon Cube Logo */}
            <div className="w-10 h-10 relative flex-shrink-0">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_0_10px_rgba(0,217,255,0.4)]">
                {/* Top Face */}
                <polygon
                  points="24,4 42,14 24,24 6,14"
                  fill="url(#cubeTop)"
                  stroke="#00D9FF"
                  strokeWidth="1.5"
                />
                {/* Left Face */}
                <polygon
                  points="6,14 24,24 24,44 6,34"
                  fill="url(#cubeLeft)"
                  stroke="#168BFF"
                  strokeWidth="1.5"
                />
                {/* Right Face */}
                <polygon
                  points="24,24 42,14 42,34 24,44"
                  fill="url(#cubeRight)"
                  stroke="#8B35FF"
                  strokeWidth="1.5"
                />
                {/* Core */}
                <circle cx="24" cy="24" r="3" fill="#00D9FF" />
                <defs>
                  <linearGradient id="cubeTop" x1="6" y1="4" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D9FF" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#168BFF" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="cubeLeft" x1="6" y1="14" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#168BFF" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#050816" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="cubeRight" x1="24" y1="24" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B35FF" stopOpacity="0.95" />
                    <stop offset="1" stopColor="#F32BFF" stopOpacity="0.45" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-black tracking-wider text-white">
                  SPEED<span className="text-cyan-400">TOBOX</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#A3B2D1]/70 font-semibold font-mono">
                  Gestão & Estoque
                </span>
              </div>
            )}
          </div>

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

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`group flex items-center ${
                  isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'
                } rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-[#168BFF]/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(0,217,255,0.15)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_#00D9FF]' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Action */}
      <div className="p-3 border-t border-[#168BFF]/15">
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-full flex justify-center text-slate-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-slate-800/40"
            title="Expandir menu"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 py-1">
            <span>v2.0 Enterprise</span>
            <span className="text-cyan-400/80 font-mono">ONLINE</span>
          </div>
        )}
      </div>
    </aside>
  );
}
