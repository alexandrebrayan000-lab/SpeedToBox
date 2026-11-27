'use client';

import React, { useEffect, useState, useRef } from 'react';

const STAGES = [
  { pct: 8, msg: 'INICIALIZANDO MOTOR GRÁFICO...' },
  { pct: 25, msg: 'CARREGANDO CATÁLOGO DE PRODUTOS...' },
  { pct: 45, msg: 'SINCRONIZANDO LOTES E CONTROLE FIFO...' },
  { pct: 68, msg: 'VALIDANDO HISTÓRICO DE MOVIMENTAÇÕES...' },
  { pct: 88, msg: 'CONSOLIDANDO VENDAS E ANALYTICS...' },
  { pct: 100, msg: 'SISTEMA OPERACIONAL • PRONTO!' },
];

export function CyberIntroLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [pct, setPct] = useState(0);
  const [statusMsg, setStatusMsg] = useState(STAGES[0].msg);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const finishIntro = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setFading(true);
    setTimeout(() => {
      setVisible(false);
    }, 750);
  }, []);

  useEffect(() => {
    // Attempt to play video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const startTime = performance.now();
    const DURATION = 2600; // ms

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      const currentPct = Math.round(easeOut(t) * 100);

      setPct(currentPct);

      for (const stage of STAGES) {
        if (currentPct >= stage.pct) {
          setStatusMsg(stage.msg);
        }
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          finishIntro();
        }, 400);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [finishIntro]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#050816] overflow-hidden transition-opacity duration-700 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Vídeo de fundo em tela cheia */}
      <video
        ref={videoRef}
        src="/assets/intro.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Véu de gradiente translúcido para contraste do HUD */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050816]/30 via-transparent to-[#050816]/85" />

      {/* Scanlines sutis estilo Cyberpunk */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)'
        }}
      />

      {/* Orbs de luz neon ambiente */}
      <div className="absolute -top-20 -left-20 w-[450px] h-[280px] rounded-full bg-cyan-500/20 blur-[60px] pointer-events-none z-[1]" />
      <div className="absolute -bottom-16 -right-16 w-[400px] h-[250px] rounded-full bg-purple-600/20 blur-[60px] pointer-events-none z-[1]" />

      {/* HUD Superior Esquerdo */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 flex items-center gap-2.5 font-mono text-[11px] sm:text-xs text-cyan-400 tracking-wider">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00d9ff] animate-pulse" />
        <span className="drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]">
          SPEEDTOBOX // KERNEL v2.0 — LIVE
        </span>
      </div>

      {/* Logo Superior Direito */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10 flex items-center gap-2.5">
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
          <polygon
            points="24,4 42,14 24,24 6,14"
            fill="rgba(0,217,255,0.85)"
            stroke="#00D9FF"
            strokeWidth="1.5"
          />
          <polygon
            points="6,14 24,24 24,44 6,34"
            fill="rgba(22,139,255,0.9)"
            stroke="#168BFF"
            strokeWidth="1.5"
          />
          <polygon
            points="24,24 42,14 42,34 24,44"
            fill="rgba(139,53,255,0.9)"
            stroke="#8B35FF"
            strokeWidth="1.5"
          />
        </svg>
        <span className="font-extrabold text-xl sm:text-2xl tracking-wider text-white">
          SPEED<span className="text-cyan-400 drop-shadow-[0_0_12px_#00d9ff]">TOBOX</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400 border border-slate-700/60 px-1.5 py-0.5 rounded bg-slate-900/60">
          v2.0
        </span>
      </div>

      {/* Rodapé: status + barra de progresso + skip */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-6 sm:p-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2.5 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d9ff] animate-ping" />
            <span className="tracking-wide uppercase font-semibold text-slate-200">
              {statusMsg}
            </span>
          </div>
          <span
            className={`font-mono text-base sm:text-lg font-black transition-colors ${
              pct >= 100 ? 'text-emerald-400' : 'text-cyan-400'
            }`}
          >
            {pct}%
          </span>
        </div>

        {/* Trilho e Barra de Progresso Neon */}
        <div className="w-full h-1.5 sm:h-2 bg-slate-900/90 rounded-full overflow-hidden border border-cyan-500/30 p-[1px] shadow-[0_0_15px_rgba(0,217,255,0.2)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-500 shadow-[0_0_12px_#00d9ff] transition-all duration-75 relative"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Informações de Conexão e Botão Pular */}
        <div className="flex items-center justify-between mt-3 font-mono text-[10px] sm:text-xs text-slate-400">
          <span className="hidden sm:inline">
            HOST: LOCALHOST:3000 &nbsp;•&nbsp; TLS / ATÔMICO ATIVO
          </span>
          <button
            onClick={finishIntro}
            className="text-cyan-400 hover:text-white transition-colors duration-200 flex items-center gap-1 ml-auto font-bold tracking-wider hover:drop-shadow-[0_0_8px_#00d9ff] cursor-pointer"
          >
            PULAR INTRO ➔
          </button>
        </div>
      </div>
    </div>
  );
}
