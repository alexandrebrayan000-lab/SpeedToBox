/**
 * StockPro Settings & Profile Management View
 */

class SettingsView {
  constructor() {
    this.container = null;
    this.activeSection = 'preferencias'; // 'preferencias' | 'empresa' | 'perfil' | 'dados'
  }

  setSection(sec) {
    this.activeSection = sec;
    this.render();
  }

  renderTo(element) {
    this.container = element;
    this.render();
  }

  render() {
    if (!this.container) return;

    const settings = window.dataStore.settings;

    this.container.innerHTML = `
      <div class="space-y-6 tab-fade-enter">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
              <h1 class="text-2xl font-black text-white tracking-wide" style="font-family: var(--font-display)">Configurações & Preferências</h1>
            </div>
            <p class="text-xs text-[#A3B2D1] mt-0.5">Personalize os efeitos visuais, dados operacionais e políticas de alerta.</p>
          </div>

          <button
            onclick="window.cyberToast.success('Configurações salvas e aplicadas em todo o sistema!');"
            class="btn-cyber-primary text-xs py-2 px-4"
          >
            <i data-lucide="save" class="w-3.5 h-3.5"></i> Salvar Alterações
          </button>
        </div>

        <!-- Settings Layout: Sub-navigation & Content Panel -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Sub Nav Menu -->
          <div class="cyber-card p-3 space-y-1.5 h-fit">
            <button
              onclick="window.settingsViewInstance.setSection('preferencias')"
              class="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
                this.activeSection === 'preferencias' ? 'nav-active text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }"
            >
              <i data-lucide="sparkles" class="w-4 h-4 text-cyan-400"></i>
              <span>Interface & Efeitos Neon</span>
            </button>

            <button
              onclick="window.settingsViewInstance.setSection('empresa')"
              class="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
                this.activeSection === 'empresa' ? 'nav-active text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }"
            >
              <i data-lucide="building-2" class="w-4 h-4 text-purple-400"></i>
              <span>Dados da Empresa</span>
            </button>

            <button
              onclick="window.settingsViewInstance.setSection('perfil')"
              class="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
                this.activeSection === 'perfil' ? 'nav-active text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }"
            >
              <i data-lucide="user" class="w-4 h-4 text-pink-400"></i>
              <span>Perfil do Usuário</span>
            </button>

            <button
              onclick="window.settingsViewInstance.setSection('dados')"
              class="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
                this.activeSection === 'dados' ? 'nav-active text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }"
            >
              <i data-lucide="database" class="w-4 h-4 text-emerald-400"></i>
              <span>Backup & Demonstração</span>
            </button>
          </div>

          <!-- Section Content Panel -->
          <div class="cyber-card p-6 lg:col-span-3">
            ${this.renderSectionContent(settings)}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons({ root: this.container });
    }
  }

  renderSectionContent(settings) {
    if (this.activeSection === 'preferencias') {
      const prefs = settings.preferencias;
      return `
        <div>
          <h3 class="text-base font-bold text-white mb-1">Preferências da Interface Cyberpunk</h3>
          <p class="text-xs text-slate-400 mb-6">Ajuste o comportamento visual do Canvas, luminosidade do neon e densidade das informações.</p>

          <form onsubmit="event.preventDefault(); window.settingsViewInstance.savePreferences(this);">
            <div class="space-y-6">
              <!-- Visual Effects Engine -->
              <div>
                <label class="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Fundo Animado Global (Canvas 2D)</label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label class="p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${prefs.visualEffects === 'alta' ? 'bg-cyan-500/10 border-cyan-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}">
                    <input type="radio" name="visualEffects" value="alta" ${prefs.visualEffects === 'alta' ? 'checked' : ''} class="hidden" onchange="this.form.requestSubmit()" />
                    <span class="w-3 h-3 rounded-full bg-cyan-400"></span>
                    <div>
                      <div class="text-xs font-bold">Completo (Neon Ativo)</div>
                      <div class="text-[10px] text-slate-500">Circuitos, partículas e pulsos</div>
                    </div>
                  </label>

                  <label class="p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${prefs.visualEffects === 'media' ? 'bg-purple-500/10 border-purple-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}">
                    <input type="radio" name="visualEffects" value="media" ${prefs.visualEffects === 'media' ? 'checked' : ''} class="hidden" onchange="this.form.requestSubmit()" />
                    <span class="w-3 h-3 rounded-full bg-purple-400"></span>
                    <div>
                      <div class="text-xs font-bold">Moderado</div>
                      <div class="text-[10px] text-slate-500">Gradientes e nós sutis</div>
                    </div>
                  </label>

                  <label class="p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${prefs.visualEffects === 'desativada' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}">
                    <input type="radio" name="visualEffects" value="desativada" ${prefs.visualEffects === 'desativada' ? 'checked' : ''} class="hidden" onchange="this.form.requestSubmit()" />
                    <span class="w-3 h-3 rounded-full bg-slate-500"></span>
                    <div>
                      <div class="text-xs font-bold">Movimento Reduzido</div>
                      <div class="text-[10px] text-slate-500">Apenas fundo escuro estático</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Neon Intensity -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Intensidade do Brilho Neon</label>
                  <select name="neonIntensity" class="cyber-select w-full" onchange="this.form.requestSubmit()">
                    <option value="alta" ${prefs.neonIntensity === 'alta' ? 'selected' : ''}>Alta Luminosidade Cyberpunk</option>
                    <option value="media" ${prefs.neonIntensity === 'media' ? 'selected' : ''}>Média (Recomendada)</option>
                    <option value="sutil" ${prefs.neonIntensity === 'sutil' ? 'selected' : ''}>Sutil e Discreta</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Alerta Antecipado de Validade</label>
                  <select name="alertThresholdDays" class="cyber-select w-full" onchange="this.form.requestSubmit()">
                    <option value="15" ${prefs.alertThresholdDays === 15 ? 'selected' : ''}>Avisar 15 dias antes</option>
                    <option value="30" ${prefs.alertThresholdDays === 30 ? 'selected' : ''}>Avisar 30 dias antes (Padrão)</option>
                    <option value="45" ${prefs.alertThresholdDays === 45 ? 'selected' : ''}>Avisar 45 dias antes</option>
                    <option value="60" ${prefs.alertThresholdDays === 60 ? 'selected' : ''}>Avisar 60 dias antes</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      `;
    }

    if (this.activeSection === 'empresa') {
      const emp = settings.empresa;
      return `
        <div>
          <h3 class="text-base font-bold text-white mb-1">Dados Cadastrais da Empresa</h3>
          <p class="text-xs text-slate-400 mb-6">Informações utilizadas na emissão de relatórios, notas e extratos de inventário.</p>

          <form onsubmit="event.preventDefault(); window.settingsViewInstance.saveCompany(this);">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-slate-300 mb-1">Razão Social / Nome Fantasia</label>
                <input type="text" name="nome" value="${emp.nome}" class="cyber-input" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">CNPJ</label>
                <input type="text" name="cnpj" value="${emp.cnpj}" class="cyber-input" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">E-mail Corporativo</label>
                <input type="email" name="email" value="${emp.email}" class="cyber-input" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Moeda Padrão</label>
                <input type="text" name="moeda" value="${emp.moeda} (Real Brasileiro)" readonly class="cyber-input opacity-75" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Fuso Horário Operacional</label>
                <input type="text" name="timezone" value="${emp.timezone} (Brasília GMT-3)" readonly class="cyber-input opacity-75" />
              </div>
            </div>

            <button type="submit" class="btn-cyber-primary text-xs py-2 px-4">Salvar Dados da Empresa</button>
          </form>
        </div>
      `;
    }

    if (this.activeSection === 'perfil') {
      const usr = settings.usuario;
      return `
        <div>
          <h3 class="text-base font-bold text-white mb-1">Perfil do Operador Master</h3>
          <p class="text-xs text-slate-400 mb-6">Credenciais e nível de acesso do usuário atualmente autenticado.</p>

          <div class="flex items-center gap-4 mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px] flex-shrink-0">
              <div class="w-full h-full bg-[#050816] rounded-2xl flex items-center justify-center font-bold text-base text-white">
                ${usr.avatar}
              </div>
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">${usr.nome}</h4>
              <p class="text-xs text-cyan-400 font-mono">${usr.cargo}</p>
              <span class="text-[10px] text-slate-400">Autenticação Biométrica CyberShield Ativa</span>
            </div>
          </div>

          <form onsubmit="event.preventDefault(); window.cyberToast.success('Perfil atualizado com sucesso!');">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Nome Completo</label>
                <input type="text" value="${usr.nome}" class="cyber-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Cargo / Função</label>
                <input type="text" value="${usr.cargo}" class="cyber-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">E-mail de Login</label>
                <input type="email" value="${usr.email}" class="cyber-input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Nova Chave de Acesso (Senha)</label>
                <input type="password" placeholder="••••••••••••" class="cyber-input" />
              </div>
            </div>

            <button type="submit" class="btn-cyber-primary text-xs py-2 px-4">Atualizar Perfil</button>
          </form>
        </div>
      `;
    }

    if (this.activeSection === 'dados') {
      return `
        <div>
          <h3 class="text-base font-bold text-white mb-1">Backup & Restauração de Dados</h3>
          <p class="text-xs text-slate-400 mb-6">Exporte sua base em formato interoperável ou restaure os dados padrão de teste.</p>

          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold text-white">Exportar Backup Completo (JSON)</h4>
                <p class="text-[11px] text-slate-400 mt-0.5">Faça o download de todos os produtos, lotes, movimentações e vendas em um arquivo só.</p>
              </div>
              <button onclick="window.settingsViewInstance.exportJsonBackup();" class="btn-cyber-primary text-xs py-1.5 px-3">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Baixar JSON
              </button>
            </div>

            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold text-amber-400">Restaurar Dados Originais de Demonstração</h4>
                <p class="text-[11px] text-slate-400 mt-0.5">Restaura os produtos, lotes e gráficos para o estado inicial de fábrica.</p>
              </div>
              <button onclick="if(confirm('Deseja realmente restaurar os dados de demonstração?')) { window.dataStore.resetDemoData(); window.cyberToast.info('Dados resetados com sucesso!'); }" class="btn-cyber-secondary text-xs text-amber-400 border-amber-500/30 hover:bg-amber-500/10 py-1.5 px-3">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Restaurar
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  savePreferences(form) {
    const prefs = {
      visualEffects: form.visualEffects.value,
      neonIntensity: form.neonIntensity.value,
      alertThresholdDays: parseInt(form.alertThresholdDays.value)
    };

    window.dataStore.updateSettings({ preferencias: prefs });
    window.cyberToast.success('Efeitos visuais atualizados!');
  }

  saveCompany(form) {
    const emp = {
      nome: form.nome.value.trim(),
      cnpj: form.cnpj.value.trim(),
      email: form.email.value.trim(),
      moeda: 'BRL',
      timezone: 'America/Sao_Paulo'
    };

    window.dataStore.updateSettings({ empresa: emp });
    window.cyberToast.success('Dados da empresa salvos com sucesso!');
  }

  exportJsonBackup() {
    const backup = {
      timestamp: new Date().toISOString(),
      products: window.dataStore.products,
      lots: window.dataStore.lots,
      movements: window.dataStore.movements,
      sales: window.dataStore.sales,
      settings: window.dataStore.settings
    };

    const str = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', str);
    dl.setAttribute('download', `stockpro_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    window.cyberToast.success('Backup JSON baixado!');
  }
}

window.SettingsView = SettingsView;
