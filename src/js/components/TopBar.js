/**
 * StockPro Cyberpunk Neon TopBar Component
 */

class CyberTopBar {
  constructor() {
    this.container = null;
    this.searchQuery = '';
    this.isSearchOpen = false;
    this.isNotificationsOpen = false;
    this.isProfileOpen = false;
    this.clockInterval = null;
  }

  renderTo(element) {
    this.container = element;
    this.render();
    this.startClock();
  }

  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(() => {
      const clockEl = document.getElementById('cyber-realtime-clock');
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('pt-BR');
      }
    }, 1000);
  }

  handleSearchInput(value) {
    this.searchQuery = value.trim().toLowerCase();
    const dropdown = document.getElementById('search-results-dropdown');
    if (!dropdown) return;

    if (!this.searchQuery) {
      dropdown.classList.add('hidden');
      return;
    }

    const products = window.dataStore.products.filter(p =>
      p.nome.toLowerCase().includes(this.searchQuery) ||
      p.sku.toLowerCase().includes(this.searchQuery) ||
      p.categoria.toLowerCase().includes(this.searchQuery)
    ).slice(0, 4);

    const lots = window.dataStore.lots.filter(l =>
      l.codigoLote.toLowerCase().includes(this.searchQuery)
    ).slice(0, 3);

    const movements = window.dataStore.movements.filter(m =>
      m.referencia.toLowerCase().includes(this.searchQuery) ||
      m.motivo.toLowerCase().includes(this.searchQuery)
    ).slice(0, 3);

    let html = '';

    if (products.length > 0) {
      html += `<div class="px-3 py-1.5 text-[11px] font-bold text-cyan-400 tracking-wider uppercase border-b border-cyan-500/10">Produtos</div>`;
      products.forEach(p => {
        html += `
          <div class="px-3 py-2 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors" onclick="window.appSidebar.setTab('produtos'); window.cyberTopBar.closeSearch();">
            <div class="flex items-center gap-2">
              <i data-lucide="package" class="w-4 h-4 text-cyan-400"></i>
              <span class="text-xs text-white">${p.nome}</span>
            </div>
            <span class="text-[11px] font-mono text-slate-400">${p.estoque} ${p.unidade}</span>
          </div>
        `;
      });
    }

    if (lots.length > 0) {
      html += `<div class="px-3 py-1.5 text-[11px] font-bold text-purple-400 tracking-wider uppercase border-b border-purple-500/10 mt-1">Lotes</div>`;
      lots.forEach(l => {
        const p = window.dataStore.products.find(pr => pr.id === l.produtoId);
        html += `
          <div class="px-3 py-2 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors" onclick="window.appSidebar.setTab('lotes'); window.cyberTopBar.closeSearch();">
            <div class="flex items-center gap-2">
              <i data-lucide="boxes" class="w-4 h-4 text-purple-400"></i>
              <span class="text-xs text-white">${l.codigoLote} (${p ? p.nome : ''})</span>
            </div>
            <span class="text-[11px] font-mono text-slate-400">${l.quantidade} un</span>
          </div>
        `;
      });
    }

    if (movements.length > 0) {
      html += `<div class="px-3 py-1.5 text-[11px] font-bold text-emerald-400 tracking-wider uppercase border-b border-emerald-500/10 mt-1">Movimentações</div>`;
      movements.forEach(m => {
        html += `
          <div class="px-3 py-2 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors" onclick="window.appSidebar.setTab('movimentacoes'); window.cyberTopBar.closeSearch();">
            <div class="flex items-center gap-2">
              <i data-lucide="arrow-left-right" class="w-4 h-4 text-emerald-400"></i>
              <span class="text-xs text-white">${m.motivo} - ${m.referencia}</span>
            </div>
            <span class="text-[11px] font-mono text-slate-400">${m.dataHora.split(' ')[0]}</span>
          </div>
        `;
      });
    }

    if (!html) {
      html = `<div class="p-4 text-center text-xs text-slate-400">Nenhum resultado para "${this.searchQuery}"</div>`;
    }

    dropdown.innerHTML = html;
    dropdown.classList.remove('hidden');

    if (window.lucide) {
      window.lucide.createIcons({ root: dropdown });
    }
  }

  closeSearch() {
    const dropdown = document.getElementById('search-results-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
    const input = document.getElementById('global-search-input');
    if (input) input.value = '';
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    const panel = document.getElementById('notifications-dropdown-panel');
    if (panel) {
      if (this.isNotificationsOpen) {
        panel.classList.remove('hidden');
        if (this.isProfileOpen) this.toggleProfile();
      } else {
        panel.classList.add('hidden');
      }
    }
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
    const menu = document.getElementById('profile-dropdown-menu');
    if (menu) {
      if (this.isProfileOpen) {
        menu.classList.remove('hidden');
        if (this.isNotificationsOpen) this.toggleNotifications();
      } else {
        menu.classList.add('hidden');
      }
    }
  }

  render() {
    if (!this.container) return;

    const alerts = window.dataStore ? window.dataStore.alerts : [];
    const unreadCount = alerts.length;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR');

    this.container.className = 'h-[72px] bg-[#050816]/85 backdrop-blur-xl border-b border-[#168BFF]/15 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30';

    this.container.innerHTML = `
      <!-- Global Search Field -->
      <div class="relative w-80 lg:w-96">
        <div class="relative flex items-center">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none"></i>
          <input
            id="global-search-input"
            type="text"
            placeholder="Buscar produto, lote, código, NF..."
            class="w-full bg-[#0B1228]/90 border border-[#168BFF]/25 hover:border-[#00D9FF]/40 focus:border-[#00D9FF] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 transition-all outline-none focus:shadow-[0_0_15px_rgba(0,217,255,0.25)]"
            oninput="window.cyberTopBar.handleSearchInput(this.value)"
            onfocus="if(this.value) window.cyberTopBar.handleSearchInput(this.value)"
          />
        </div>

        <!-- Search Results Dropdown -->
        <div id="search-results-dropdown" class="hidden absolute top-full mt-2 left-0 w-full bg-[#0B1228] border border-[#00D9FF]/30 rounded-xl shadow-2xl overflow-hidden z-50">
        </div>
      </div>

      <!-- Right Hand Controls -->
      <div class="flex items-center gap-3">
        <!-- Live Clock Indicator -->
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1228]/80 border border-[#168BFF]/20 text-xs font-mono text-cyan-300">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-cyan-400"></i>
          <span id="cyber-realtime-clock">${timeStr}</span>
        </div>

        <!-- Quick Action: Entrada -->
        <button onclick="window.cyberModals.openEntryModal()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition">
          <i data-lucide="arrow-down-left" class="w-3.5 h-3.5"></i> Entrada
        </button>

        <!-- Quick Action: Saída -->
        <button onclick="window.cyberModals.openExitModal()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition">
          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i> Saída
        </button>

        <!-- Notification Bell -->
        <div class="relative">
          <button
            onclick="window.cyberTopBar.toggleNotifications()"
            class="relative p-2 rounded-xl bg-[#0B1228] border border-[#168BFF]/25 hover:border-cyan-400 text-slate-300 hover:text-white transition-all hover:shadow-[0_0_12px_rgba(0,217,255,0.3)]"
            title="Alertas do sistema"
          >
            <i data-lucide="bell" class="w-4 h-4"></i>
            ${unreadCount > 0 ? `
              <span class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center pulse-red">
                ${unreadCount}
              </span>
            ` : ''}
          </button>

          <!-- Notifications Dropdown Panel -->
          <div id="notifications-dropdown-panel" class="hidden absolute right-0 mt-3 w-80 sm:w-96 bg-[#0B1228] border border-[#8B35FF]/35 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div class="flex items-center gap-2">
                <i data-lucide="bell-ring" class="w-4 h-4 text-purple-400"></i>
                <h4 class="text-sm font-bold text-white">Alertas do Sistema</h4>
              </div>
              <span class="text-[11px] font-mono text-cyan-400">${unreadCount} ativos</span>
            </div>

            <div class="max-h-72 overflow-y-auto space-y-2 pr-1">
              ${alerts.length === 0 ? `
                <div class="py-6 text-center text-xs text-slate-400">Tudo sob controle! Nenhum alerta crítico.</div>
              ` : alerts.map(a => `
                <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold ${a.prioridade === 'alta' ? 'text-rose-400' : 'text-amber-400'}">${a.titulo}</span>
                    <span class="text-[10px] text-slate-500">${a.data}</span>
                  </div>
                  <p class="text-xs text-slate-300 mb-1">${a.detalhe}</p>
                  <div class="flex items-center justify-between pt-1">
                    <span class="text-[10px] text-purple-300 font-semibold">${a.acao}</span>
                    <button class="text-[10px] text-cyan-400 hover:underline" onclick="window.appSidebar.setTab('${a.tipo === 'estoque_baixo' ? 'produtos' : 'lotes'}'); window.cyberTopBar.toggleNotifications();">
                      Resolver ➔
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="pt-3 border-t border-slate-800 text-center">
              <button onclick="window.appSidebar.setTab('alertas'); window.cyberTopBar.toggleNotifications();" class="text-xs text-cyan-400 hover:underline font-semibold">
                Ver todos os alertas na central
              </button>
            </div>
          </div>
        </div>

        <!-- User Profile Area -->
        <div class="relative">
          <div
            onclick="window.cyberTopBar.toggleProfile()"
            class="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl bg-[#0B1228] border border-[#168BFF]/25 hover:border-purple-500/50 cursor-pointer transition-all"
          >
            <!-- Cyber Avatar -->
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px] flex-shrink-0">
              <div class="w-full h-full bg-[#050816] rounded-lg flex items-center justify-center font-bold text-xs text-white">
                AD
              </div>
            </div>
            <div class="hidden lg:flex flex-col text-left">
              <span class="text-xs font-semibold text-white tracking-wide">Administrador</span>
              <span class="text-[10px] text-slate-400">admin@estoque.com</span>
            </div>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
          </div>

          <!-- Profile Dropdown Menu -->
          <div id="profile-dropdown-menu" class="hidden absolute right-0 mt-3 w-52 bg-[#0B1228] border border-[#00D9FF]/30 rounded-xl shadow-2xl p-2 z-50">
            <div class="px-3 py-2 border-b border-slate-800 mb-1">
              <p class="text-xs font-bold text-white">Administrador Master</p>
              <p class="text-[10px] text-slate-400">Nível 1 • Total Acesso</p>
            </div>
            <button onclick="window.appSidebar.setTab('configuracoes'); window.cyberTopBar.toggleProfile();" class="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2">
              <i data-lucide="user" class="w-3.5 h-3.5 text-cyan-400"></i> Meu Perfil
            </button>
            <button onclick="window.appSidebar.setTab('configuracoes'); window.cyberTopBar.toggleProfile();" class="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2">
              <i data-lucide="sliders" class="w-3.5 h-3.5 text-purple-400"></i> Preferências Neon
            </button>
            <button onclick="window.dataStore.resetDemoData(); window.cyberToast.info('Dados resetados com sucesso!'); window.cyberTopBar.toggleProfile();" class="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-400 hover:bg-slate-800/60 flex items-center gap-2">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Restaurar Dados Demo
            </button>
            <div class="border-t border-slate-800 mt-1 pt-1">
              <button onclick="window.cyberToast.info('Sessão protegida.'); window.cyberTopBar.toggleProfile();" class="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2">
                <i data-lucide="log-out" class="w-3.5 h-3.5"></i> Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }
  }
}

window.CyberTopBar = CyberTopBar;
