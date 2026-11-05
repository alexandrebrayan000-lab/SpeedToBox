'use client';

import React, { useState } from 'react';
import { Settings, Store, Lock, KeyRound, ShieldCheck, CheckCircle2, UserCheck, Bell } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ConfiguracoesPage() {
  const { config, usuario } = useStore();

  const [emailLogin, setEmailLogin] = useState(usuario?.email || 'operador@speedtobox.com.br');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [msgSucesso, setMsgSucesso] = useState<string | null>(null);
  const [msgErro, setMsgErro] = useState<string | null>(null);

  const handleSalvarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    setMsgErro(null);
    setMsgSucesso(null);

    if (!senhaAtual) {
      setMsgErro('Por favor, informe sua senha atual para validação.');
      return;
    }

    if (novaSenha.length < 6) {
      setMsgErro('A nova senha deve possuir no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmaSenha) {
      setMsgErro('A confirmação não coincide com a nova senha digitada.');
      return;
    }

    // Sucesso simulado / preparado para Supabase Auth updatePassword
    setMsgSucesso('Credenciais e senha de acesso atualizadas com sucesso!');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmaSenha('');

    setTimeout(() => setMsgSucesso(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Configurações &amp; Parâmetros do Sistema
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento de credenciais de acesso, dados do estabelecimento e parâmetros operacionais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Dados do Estabelecimento & Parâmetros */}
        <div className="space-y-6">
          <div className="glass-panel p-5 space-y-4 accent-line">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Store className="w-4 h-4 text-cyan-400" />
              <span>Dados do Estabelecimento</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 uppercase font-bold tracking-wider block mb-1">Nome Comercial</label>
                <input
                  type="text"
                  readOnly
                  value={config.nome}
                  className="w-full bg-[#080d20] border border-cyan-500/20 text-white p-2.5 rounded-xl font-medium outline-none cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 uppercase font-bold tracking-wider block mb-1">CNPJ</label>
                  <input
                    type="text"
                    readOnly
                    value={config.cnpj}
                    className="w-full bg-[#080d20] border border-cyan-500/20 text-white p-2.5 rounded-xl font-mono outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold tracking-wider block mb-1">Cidade / UF</label>
                  <input
                    type="text"
                    readOnly
                    value={`${config.cidade} - ${config.uf}`}
                    className="w-full bg-[#080d20] border border-cyan-500/20 text-white p-2.5 rounded-xl outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 uppercase font-bold tracking-wider block mb-1">Email Institucional</label>
                <input
                  type="text"
                  readOnly
                  value={config.email}
                  className="w-full bg-[#080d20] border border-cyan-500/20 text-white p-2.5 rounded-xl outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Parâmetros de Alerta */}
          <div className="glass-panel p-5 space-y-3 accent-line">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Regras de Notificação &amp; Validade</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080d20] border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-400 block text-xs">Janela de Alerta de Validade (FIFO)</span>
                <span className="text-[11px] text-slate-400">Notificar produtos próximos do vencimento</span>
              </div>
              <span className="badge-pill badge-pill-green font-mono font-bold text-xs">
                {config.janelaAlertaValidadeDias} dias
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Sistema operacional integrado ao Supabase PostgreSQL com replicação ativa.</span>
            </div>
          </div>
        </div>

        {/* Card 2: Credenciais de Acesso & Segurança (Login e Senha) */}
        <div className="glass-panel p-5 space-y-4 accent-line">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Acesso &amp; Segurança da Conta</span>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
              <UserCheck className="w-3 h-3" /> Sessão Ativa
            </span>
          </div>

          {msgSucesso && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{msgSucesso}</span>
            </div>
          )}

          {msgErro && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <span>⚠️ {msgErro}</span>
            </div>
          )}

          <form onSubmit={handleSalvarSenha} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Email de Login / Autenticação
              </label>
              <input
                type="email"
                value={emailLogin}
                onChange={e => setEmailLogin(e.target.value)}
                className="w-full bg-[#080d20] border border-cyan-500/20 focus:border-cyan-400 text-white p-2.5 rounded-xl font-mono outline-none transition-all"
                required
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block mb-2">
                Alteração de Senha
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 block mb-1">Senha Atual</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={senhaAtual}
                      onChange={e => setSenhaAtual(e.target.value)}
                      className="w-full bg-[#080d20] border border-cyan-500/20 focus:border-cyan-400 text-white p-2.5 rounded-xl outline-none transition-all pl-9"
                    />
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Nova Senha</label>
                    <input
                      type="password"
                      placeholder="Mínimo 6 dígitos"
                      value={novaSenha}
                      onChange={e => setNovaSenha(e.target.value)}
                      className="w-full bg-[#080d20] border border-cyan-500/20 focus:border-cyan-400 text-white p-2.5 rounded-xl outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Confirmar Senha</label>
                    <input
                      type="password"
                      placeholder="Repita a nova senha"
                      value={confirmaSenha}
                      onChange={e => setConfirmaSenha(e.target.value)}
                      className="w-full bg-[#080d20] border border-cyan-500/20 focus:border-cyan-400 text-white p-2.5 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="btn-neon-primary w-full text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Salvar Novas Credenciais</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;
