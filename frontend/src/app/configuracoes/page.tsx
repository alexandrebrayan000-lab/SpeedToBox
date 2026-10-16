'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  User,
  Database,
  Save,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Settings } from '../../types';

export default function SettingsPage() {
  const { settings, updateSettings, exportBackupJSON, importBackupJSON, resetToDefaultData, showToast } = useStore();

  const [activeSection, setActiveSection] = useState<'preferencias' | 'empresa' | 'perfil' | 'dados'>(
    'preferencias'
  );

  const [formData, setFormData] = useState<Settings>(settings);

  const handleSave = () => {
    updateSettings(formData);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importBackupJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#168BFF]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9FF]"></span>
            <h1
              className="text-2xl font-black text-white tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Configurações & Preferências
            </h1>
          </div>
          <p className="text-xs text-[#A3B2D1] mt-0.5">
            Personalize os efeitos visuais, dados operacionais e políticas de alerta do SpeedToBox.
          </p>
        </div>

        <button onClick={handleSave} className="btn-cyber-primary text-xs py-2 px-4">
          <Save className="w-3.5 h-3.5" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="cyber-card p-3 space-y-1.5 h-fit">
          <button
            onClick={() => setActiveSection('preferencias')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
              activeSection === 'preferencias'
                ? 'nav-active text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interface & Efeitos Neon</span>
          </button>

          <button
            onClick={() => setActiveSection('empresa')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
              activeSection === 'empresa'
                ? 'nav-active text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Dados da Empresa</span>
          </button>

          <button
            onClick={() => setActiveSection('perfil')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
              activeSection === 'perfil'
                ? 'nav-active text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <User className="w-4 h-4 text-pink-400" />
            <span>Perfil do Usuário</span>
          </button>

          <button
            onClick={() => setActiveSection('dados')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition ${
              activeSection === 'dados'
                ? 'nav-active text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Backup & Demonstração</span>
          </button>
        </div>

        {/* Form Panel */}
        <div className="cyber-card p-6 lg:col-span-3">
          {activeSection === 'preferencias' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Efeitos Visuais e Acessibilidade</h3>
                <p className="text-xs text-slate-400">
                  Ajuste a intensidade do Canvas 2D animado e do sistema de iluminação neon.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Intensidade dos Efeitos do Canvas
                  </label>
                  <select
                    value={formData.preferencias.visualEffects}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        preferencias: {
                          ...prev.preferencias,
                          visualEffects: e.target.value as any
                        }
                      }))
                    }
                    className="cyber-select w-full"
                  >
                    <option value="alta">Alta (Completo com Pulsos e Partículas)</option>
                    <option value="media">Média (Balanceado)</option>
                    <option value="sutil">Sutil (Circuitos Leves)</option>
                    <option value="desativada">Desativado (Fundo Estático)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Densidade das Tabelas
                  </label>
                  <select
                    value={formData.preferencias.tableDensity}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        preferencias: {
                          ...prev.preferencias,
                          tableDensity: e.target.value as any
                        }
                      }))
                    }
                    className="cyber-select w-full"
                  >
                    <option value="confortavel">Confortável (Padrão)</option>
                    <option value="compacta">Compacta (Mais itens por tela)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Janela de Alerta de Vencimento Próximo (Dias)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={formData.preferencias.alertThresholdDays}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        preferencias: {
                          ...prev.preferencias,
                          alertThresholdDays: Number(e.target.value)
                        }
                      }))
                    }
                    className="cyber-input max-w-xs"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Produtos com validade dentro desse intervalo acionarão aviso de atenção.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'empresa' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Informações do Estabelecimento</h3>
                <p className="text-xs text-slate-400">
                  Dados corporativos e parâmetros fiscais do negócio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Razão Social</label>
                  <input
                    type="text"
                    value={formData.empresa.nome}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, nome: e.target.value }
                      }))
                    }
                    className="cyber-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={formData.empresa.cnpj}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, cnpj: e.target.value }
                      }))
                    }
                    className="cyber-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Corporativo</label>
                  <input
                    type="email"
                    value={formData.empresa.email}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, email: e.target.value }
                      }))
                    }
                    className="cyber-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Moeda Padrão</label>
                  <input
                    type="text"
                    disabled
                    value={formData.empresa.moeda}
                    className="cyber-input bg-slate-900/80 text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fuso Horário</label>
                  <input
                    type="text"
                    disabled
                    value={formData.empresa.timezone}
                    className="cyber-input bg-slate-900/80 text-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'perfil' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Perfil do Operador</h3>
                <p className="text-xs text-slate-400">
                  Identificação do usuário logado na sessão local.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.usuario.nome}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        usuario: { ...prev.usuario, nome: e.target.value }
                      }))
                    }
                    className="cyber-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo / Função</label>
                  <input
                    type="text"
                    value={formData.usuario.cargo}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        usuario: { ...prev.usuario, cargo: e.target.value }
                      }))
                    }
                    className="cyber-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail de Acesso</label>
                  <input
                    type="email"
                    value={formData.usuario.email}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        usuario: { ...prev.usuario, email: e.target.value }
                      }))
                    }
                    className="cyber-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Iniciais do Avatar</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.usuario.avatar}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        usuario: { ...prev.usuario, avatar: e.target.value.toUpperCase() }
                      }))
                    }
                    className="cyber-input max-w-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'dados' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Gerenciamento de Dados & Backup</h3>
                <p className="text-xs text-slate-400">
                  Exporte cópias de segurança em JSON ou restaure o estado demonstrativo padrão.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-white block">Exportar Backup Completo</span>
                    <span className="text-[11px] text-slate-400">
                      Gera um arquivo JSON contendo todos os produtos, lotes, vendas e configurações.
                    </span>
                  </div>
                  <button onClick={exportBackupJSON} className="btn-cyber-primary text-xs py-2 px-4 flex-shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Backup</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-white block">Restaurar de Arquivo JSON</span>
                    <span className="text-[11px] text-slate-400">
                      Carregue um arquivo previamente exportado para restaurar o estado da aplicação.
                    </span>
                  </div>
                  <label className="btn-cyber-secondary text-xs py-2 px-4 cursor-pointer flex-shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload JSON</span>
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-rose-300 block">Restaurar Dados Padrão</span>
                    <span className="text-[11px] text-slate-400">
                      Reinicializa todos os produtos e lotes para a massa de dados brasileira original.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza? Isso restaurará todos os dados para o padrão original.')) {
                        resetToDefaultData();
                      }
                    }}
                    className="btn-cyber-danger text-xs py-2 px-4 flex-shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resetar Demonstração</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
