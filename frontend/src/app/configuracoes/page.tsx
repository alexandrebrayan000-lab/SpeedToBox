'use client';

import React from 'react';
import { Settings, Store, Users, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ConfiguracoesPage() {
  const { config } = useStore();

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
            Dados cadastrais do estabelecimento, parâmetros operacionais e informações do projeto.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados do Estabelecimento */}
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
                className="w-full bg-[#080d20] border border-cyan-500/20 text-white p-2.5 rounded-xl font-medium outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 uppercase font-bold tracking-wider block mb-1">CNPJ</label>
                <input
                  type="text"
                  readOnly
                  value={config.cnpj}
                  className="w-full bg-[#080d20] border border-cyan-500/20 text-white p-2.5 rounded-xl font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase font-bold tracking-wider block mb-1">Cidade / UF</label>
                <input
                  type="text"
                  readOnly
                  value={`${config.cidade} - ${config.uf}`}
                  className="w-full bg-[#080d20] border border-cyan-500/20 text-white p-2.5 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 uppercase font-bold tracking-wider block mb-1">Email de Contato</label>
              <input
                type="text"
                readOnly
                value={config.email}
                className="w-full bg-[#080d20] border border-cyan-500/20 text-white p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Gestores & Projeto Integrador II */}
        <div className="glass-panel p-5 space-y-4 accent-line">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Equipe Responsável &amp; Projeto</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#080d20] border border-cyan-500/20 space-y-2">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                Integrantes / Responsáveis (Docs.md)
              </span>
              <div className="flex items-center justify-between text-white font-semibold pt-1 border-t border-slate-800">
                <span>Brayan Alexandre Ivo Garrido</span>
                <span className="text-[10px] text-purple-400 font-mono">Backend &amp; Regras</span>
              </div>
              <div className="flex items-center justify-between text-white font-semibold pt-1 border-t border-slate-800">
                <span>Mylenna Gonçalves De Paula</span>
                <span className="text-[10px] text-cyan-400 font-mono">Frontend &amp; UI/UX</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080d20] border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-400 block">Janela de Alerta de Validade</span>
                <span className="text-[11px] text-slate-400">Notificar com antecedência mínima</span>
              </div>
              <span className="badge-pill badge-pill-green font-mono font-bold">
                {config.janelaAlertaValidadeDias} dias
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>SpeedToBox v1.0 — Projeto Integrador II devidamente configurado e operacional.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;
