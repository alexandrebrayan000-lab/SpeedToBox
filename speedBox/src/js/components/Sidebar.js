/**
 * StockPro Cyberpunk Neon Sidebar Component
 */

class CyberSidebar {
  constructor(activeTab = 'dashboard', onTabChange = null) {
    this.activeTab = activeTab;
    this.onTabChange = onTabChange;
    this.isCollapsed = false;
    this.container = null;
  }

  setTab(tabKey) {
    this.activeTab = tabKey;
    if (this.onTabChange) this.onTabChange(tabKey);
    this.render();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.render();
    if (window.onSidebarToggle) window.onSidebarToggle(this.isCollapsed);
  }

  renderTo(element) {
    this.container = element;
    this.render();
  }

  render() {
    if (!this.container) return;

    const unreadAlerts = window.dataStore ? window.dataStore.alerts.length : 0;
    const widthClass = this.isCollapsed ? 'w-20' : 'w-64';

    const menuItems = [
      { key: 'dashboard', label: 'Visão geral', icon: 'layout-dashboard' },
      { key: 'produtos', label: 'Produtos', icon: 'package' },
      { key: 'lotes', label: 'Lotes e validades', icon: 'boxes' },
      { key: 'movimentacoes', label: 'Movimentações', icon: 'arrow-left-right' },
      { key: 'vendas', label: 'Vendas e analítica', icon: 'trending-up' },
      { key: 'relatorios', label: 'Relatórios', icon: 'file-bar-chart' },
      { key: 'alertas', label: 'Alertas', icon: 'bell', badge: unreadAlerts > 0 ? unreadAlerts : null },
      { key: 'configuracoes', label: 'Configurações', icon: 'settings' }
    ];

    this.container.className = `h-screen fixed top-0 left-0 z-40 bg-[#080D20]/90 backdrop-blur-xl border-r border-[#168BFF]/20 flex flex-col justify-between transition-all duration-300 ${widthClass}`;

    this.container.innerHTML = `
      <!-- Top Brand Area -->
      <div>
        <div class="h-20 flex items-center ${this.isCollapsed ? 'justify-center px-2' : 'justify-between px-5'} border-b border-[#168BFF]/15">
          <div class="flex items-center gap-3 cursor-pointer" onclick="window.appSidebar.setTab('dashboard')">
            <!-- 3D Isometric Neon Box Logo -->
            <div class="w-10 h-10 relative flex-shrink-0 logo-box-glow">
              <svg viewBox="0 0 48 48" fill="none" class="w-full h-full">
                <!-- Top Face -->
                <polygon points="24,4 42,14 24,24 6,14" fill="url(#cubeTopGrad)" stroke="#00D9FF" stroke-width="1.5" />
                <!-- Left Face -->
                <polygon points="6,14 24,24 24,44 6,34" fill="url(#cubeLeftGrad)" stroke="#168BFF" stroke-width="1.5" />
                <!-- Right Face -->
                <polygon points="24,24 42,14 42,34 24,44" fill="url(#cubeRightGrad)" stroke="#8B35FF" stroke-width="1.5" />
                <!-- Inner Neon Core -->
                <circle cx="24" cy="24" r="3" fill="#00D9FF" filter="drop-shadow(0 0 6px #00D9FF)" />
                <defs>
                  <linearGradient id="cubeTopGrad" x1="6" y1="4" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#00D9FF" stop-opacity="0.8" />
                    <stop offset="1" stop-color="#168BFF" stop-opacity="0.4" />
                  </linearGradient>
                  <linearGradient id="cubeLeftGrad" x1="6" y1="14" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#168BFF" stop-opacity="0.9" />
                    <stop offset="1" stop-color="#050816" stop-opacity="0.7" />
                  </linearGradient>
                  <linearGradient id="cubeRightGrad" x1="24" y1="24" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8B35FF" stop-opacity="0.9" />
                    <stop offset="1" stop-color="#F32BFF" stop-opacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            ${!this.isCollapsed ? `
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent" style="font-family: var(--font-display)">
                    STOCK<span class="text-cyan-400">PRO</span>
                  </span>
                </div>
                <span class="text-[10px] uppercase tracking-widest text-[#A3B2D1]/70 font-semibold">Controle de Estoque</span>
              </div>
            ` : ''}
          </div>

          ${!this.isCollapsed ? `
            <button onclick="window.appSidebar.toggleCollapse()" class="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors" title="Recolher menu">
              <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>
          ` : ''}
        </div>

        <!-- Navigation Menu -->
        <nav class="p-3 space-y-1.5">
          ${menuItems.map(item => {
            const isActive = this.activeTab === item.key;
            return `
              <button
                onclick="window.appSidebar.setTab('${item.key}')"
                class="w-full flex items-center ${this.isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive ? 'nav-active' : 'text-[#A3B2D1] hover:text-white hover:bg-[#101A35]/60 hover:translate-x-1'
                }"
                title="${item.label}"
              >
                <div class="flex items-center gap-3">
                  <i data-lucide="${item.icon}" class="w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}"></i>
                  ${!this.isCollapsed ? `<span>${item.label}</span>` : ''}
                </div>

                ${item.badge && !this.isCollapsed ? `
                  <span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 pulse-red">
                    ${item.badge}
                  </span>
                ` : ''}
              </button>
            `;
          }).join('')}
        </nav>
      </div>

      <!-- Bottom System Status & Quick Toggle -->
      <div class="p-3 border-t border-[#168BFF]/15">
        ${this.isCollapsed ? `
          <button onclick="window.appSidebar.toggleCollapse()" class="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors" title="Expandir menu">
            <i data-lucide="chevron-right" class="w-5 h-5"></i>
          </button>
        ` : `
          <div class="bg-[#0B1228]/80 rounded-xl p-3 border border-[#168BFF]/20 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-slate-200">Sistema Operacional</span>
                <span class="text-[10px] text-emerald-400 font-mono tracking-tight">LATÊNCIA: 18ms • ONLINE</span>
              </div>
            </div>
            <button onclick="window.cyberModals.openNewSaleModal()" class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white hover:opacity-90 shadow-lg shadow-purple-500/30" title="Venda rápida">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </button>
          </div>
        `}
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }
  }
}

window.CyberSidebar = CyberSidebar;
