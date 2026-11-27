'use client';

import React, { useState } from 'react';
import {
  Package,
  Boxes,
  TrendingUp,
  FileBarChart,
  ShieldCheck,
  User,
  Lock,
  Mail,
  AtSign,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function LandingPage() {
  const { loginUsuario, loginComGoogle, cadastrarUsuario } = useStore();
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');

  // Campos Login (apenas nome de usuário e senha)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [mostrarSenhaLogin, setMostrarSenhaLogin] = useState(false);

  // Campos Cadastro (nome, email, nome de usuário e senha)
  const [cadNome, setCadNome] = useState('');
  const [cadEmail, setCadEmail] = useState('');
  const [cadUsername, setCadUsername] = useState('');
  const [cadSenha, setCadSenha] = useState('');
  const [mostrarSenhaCad, setMostrarSenhaCad] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setErro(null);
    setSucesso(null);
    setCarregandoGoogle(true);
    try {
      const res = await loginComGoogle();
      if (!res.sucesso) {
        setErro(res.erro || 'Não foi possível conectar com o Google.');
        setCarregandoGoogle(false);
      }
    } catch {
      setErro('Erro ao iniciar autenticação com Google.');
      setCarregandoGoogle(false);
    }
  };

  const alternarModo = (novoModo: 'login' | 'cadastro') => {
    setModo(novoModo);
    setErro(null);
    setSucesso(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setCarregando(true);

    try {
      const res = await loginUsuario({
        username: loginUsername,
        senha: loginSenha
      });
      if (!res.sucesso) {
        setErro(res.erro || 'Não foi possível entrar.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setCarregando(true);

    try {
      const res = await cadastrarUsuario({
        nome: cadNome,
        email: cadEmail,
        username: cadUsername,
        senha: cadSenha
      });
      if (!res.sucesso) {
        setErro(res.erro || 'Não foi possível concluir o cadastro.');
      } else {
        setSucesso('Conta criada com sucesso! Entrando no sistema...');
      }
    } finally {
      setCarregando(false);
    }
  };

  const recursos = [
    {
      icon: Boxes,
      titulo: 'Controle FIFO & Validades',
      descricao: 'Rastreie lotes com vencimento próximo e evite perdas no estoque automaticamente.',
      cor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30'
    },
    {
      icon: TrendingUp,
      titulo: 'PDV & Analítica em Tempo Real',
      descricao: 'Registre vendas em segundos com baixa automática de estoque e gráficos de receita.',
      cor: 'text-purple-400 bg-purple-500/15 border-purple-500/30'
    },
    {
      icon: FileBarChart,
      titulo: 'Relatórios & Exportação CSV',
      descricao: '11 modelos de relatórios executivos prontos para impressão e planilhas.',
      cor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
    },
    {
      icon: Package,
      titulo: 'Alertas Inteligentes',
      descricao: 'Notificações imediatas de estoque mínimo, rupturas e itens parados.',
      cor: 'text-amber-400 bg-amber-500/15 border-amber-500/30'
    }
  ];

  return (
    <div className="min-h-screen relative z-10 flex flex-col justify-between">
      {/* Header / Navbar da Landing Page */}
      <header className="border-b border-cyan-500/15 bg-[#080d20]/75 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex-shrink-0 drop-shadow-[0_0_10px_rgba(0,217,255,0.45)]">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <polygon points="24,4 42,14 24,24 6,14" fill="#00d9ff" fillOpacity="0.85" stroke="#00d9ff" strokeWidth="1.5" />
                <polygon points="6,14 24,24 24,44 6,34" fill="#168bff" fillOpacity="0.85" stroke="#168bff" strokeWidth="1.5" />
                <polygon points="24,24 42,14 42,34 24,44" fill="#8b35ff" fillOpacity="0.9" stroke="#8b35ff" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="3" fill="#ffffff" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-wider text-white">
                SPEED<span className="text-cyan-400">TOBOX</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                Estoque, Lotes &amp; PDV
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alternarModo('login')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                modo === 'login'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => alternarModo('cadastro')}
              className="btn-neon-primary text-xs py-2 px-4"
            >
              <span>Criar Conta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal: Hero + Card de Login/Cadastro */}
      <main className="max-w-7xl w-full mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Coluna Esquerda: Apresentação & Recursos */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma Inteligente v2.0 • Integrada ao Supabase</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Gestão de Estoque, Lotes FIFO &amp;{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                PDV em Tempo Real
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Controle entradas, saídas, validades de lotes e faturamento do seu estabelecimento
              em um único painel futurista, rápido e sincronizado na nuvem.
            </p>
          </div>

          {/* Grid de Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recursos.map(rec => {
              const Icon = rec.icon;
              return (
                <div
                  key={rec.titulo}
                  className="glass-panel p-4 accent-line hover:border-cyan-400/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${rec.cor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white mb-1">{rec.titulo}</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{rec.descricao}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Métricas / Selos de Confiança */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dados sincronizados com Supabase</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Baixa automática por FIFO</span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Card de Autenticação (Login / Cadastro) */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 sm:p-8 accent-line shadow-[0_0_40px_rgba(0,217,255,0.12)]">
            {/* Abas Entrar / Cadastro */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#080d20] border border-cyan-500/20 mb-6">
              <button
                type="button"
                onClick={() => alternarModo('login')}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                  modo === 'login'
                    ? 'bg-gradient-to-r from-cyan-500/25 to-purple-500/25 text-white border border-cyan-400/40 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => alternarModo('cadastro')}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                  modo === 'cadastro'
                    ? 'bg-gradient-to-r from-cyan-500/25 to-purple-500/25 text-white border border-cyan-400/40 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cadastro
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-lg font-black text-white tracking-wide">
                {modo === 'login' ? 'Acesse sua conta' : 'Crie sua conta SpeedToBox'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {modo === 'login'
                  ? 'Entre com seu nome de usuário e senha cadastrados.'
                  : 'Preencha seus dados para começar a gerenciar seu estoque.'}
              </p>
            </div>

            {erro && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            {sucesso && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{sucesso}</span>
              </div>
            )}

            {modo === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nome de usuário
                  </label>
                  <div className="flex items-center gap-2.5 bg-[#080d20] border border-cyan-500/25 focus-within:border-cyan-400 rounded-xl px-3.5 py-2.5 transition-all">
                    <User className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="Digite seu nome de usuário"
                      value={loginUsername}
                      onChange={e => setLoginUsername(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Senha
                  </label>
                  <div className="flex items-center gap-2.5 bg-[#080d20] border border-cyan-500/25 focus-within:border-cyan-400 rounded-xl px-3.5 py-2.5 transition-all">
                    <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <input
                      type={mostrarSenhaLogin ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={loginSenha}
                      onChange={e => setLoginSenha(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-white placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenhaLogin(!mostrarSenhaLogin)}
                      className="text-slate-400 hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {mostrarSenhaLogin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  className="btn-neon-primary w-full justify-center py-3 text-xs font-bold mt-2 disabled:opacity-60"
                >
                  {carregando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar no Painel</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCadastro} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nome completo
                  </label>
                  <div className="flex items-center gap-2.5 bg-[#080d20] border border-cyan-500/25 focus-within:border-cyan-400 rounded-xl px-3.5 py-2.5 transition-all">
                    <User className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Ex: Maria Oliveira"
                      value={cadNome}
                      onChange={e => setCadNome(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    E-mail
                  </label>
                  <div className="flex items-center gap-2.5 bg-[#080d20] border border-cyan-500/25 focus-within:border-cyan-400 rounded-xl px-3.5 py-2.5 transition-all">
                    <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@empresa.com.br"
                      value={cadEmail}
                      onChange={e => setCadEmail(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nome de usuário
                  </label>
                  <div className="flex items-center gap-2.5 bg-[#080d20] border border-cyan-500/25 focus-within:border-cyan-400 rounded-xl px-3.5 py-2.5 transition-all">
                    <AtSign className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="Ex: mariaoliveira"
                      value={cadUsername}
                      onChange={e => setCadUsername(e.target.value.replace(/\s+/g, ''))}
                      className="bg-transparent border-none outline-none w-full text-xs text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Senha
                  </label>
                  <div className="flex items-center gap-2.5 bg-[#080d20] border border-cyan-500/25 focus-within:border-cyan-400 rounded-xl px-3.5 py-2.5 transition-all">
                    <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <input
                      type={mostrarSenhaCad ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="Mínimo de 6 caracteres"
                      value={cadSenha}
                      onChange={e => setCadSenha(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-white placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenhaCad(!mostrarSenhaCad)}
                      className="text-slate-400 hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {mostrarSenhaCad ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  className="btn-neon-primary w-full justify-center py-3 text-xs font-bold mt-2 disabled:opacity-60"
                >
                  {carregando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Criando conta...</span>
                    </>
                  ) : (
                    <>
                      <span>Cadastrar e Entrar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Divisor e Botão Login com Google */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-cyan-500/20" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                ou continue com
              </span>
              <div className="h-px flex-1 bg-cyan-500/20" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={carregando || carregandoGoogle}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#080d20] hover:bg-slate-800/80 border border-cyan-500/25 hover:border-cyan-400/50 text-xs font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {carregandoGoogle ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Redirecionando para o Google...</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                    />
                  </svg>
                  <span>Entrar com Google</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="py-4 px-6 border-t border-cyan-500/10 text-xs text-slate-500 bg-[#060919]/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SpeedToBox • Gestão Inteligente de Estoque &amp; PDV</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            © {new Date().getFullYear()} SpeedToBox • Todos os direitos reservados
          </span>
        </div>
      </footer>
    </div>
  );
}
