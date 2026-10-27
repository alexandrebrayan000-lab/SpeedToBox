'use client';

import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { alerts } = useStore();
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

  const widthClass = isCollapsed ? 'w-20' : 'w-64';

  return (
    <aside
      className={`h-screen fixed top-0 left-0 z-40 bg-[#080D20]/95 backdrop-blur-xl border-r border-[#168BFF]/15 flex flex-col justify-between transition-all duration-300 ${widthClass}`}
      style={{ width: isCollapsed ? '80px' : '256px' }}
    >
      {/* Top Brand Area */}
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
                    <stop stopColor="#00D9FF" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#168BFF" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="cubeLeftGrad" x1="6" y1="14" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#168BFF" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#050816" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="cubeRightGrad" x1="24" y1="24" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B35FF" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#F32BFF" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span
                    className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    SPEED<span className="text-cyan-400">TOBOX</span>
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#A3B2D1]/70 font-semibold">
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
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)]">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'nav-active'
                    : 'text-[#A3B2D1] hover:text-white hover:bg-slate-800/40'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />

                {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}

                {!isCollapsed && item.badge && (
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold flex items-center justify-center pulse-red">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Area */}
      <div className="p-3 border-t border-[#168BFF]/15">
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-full flex justify-center text-slate-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-slate-800/40 transition-colors"
            title="Expandir menu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="bg-[#0B1228]/80 p-2.5 rounded-xl border border-cyan-500/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white">Online v2.0</span>
                <span className="text-[9px] text-[#A3B2D1]/70 font-mono">Next.js App</span>
              </div>
            </div>
            <button
              onClick={onToggleCollapse}
              className="text-slate-400 hover:text-cyan-400 p-1"
              title="Recolher"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
