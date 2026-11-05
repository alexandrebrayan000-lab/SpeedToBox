'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ChatbotWidget() {
  const { isChatOpen, setIsChatOpen, chatMessages, enviarMensagemChat } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isChatOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    enviarMensagemChat(input.trim());
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[520px] z-50 bg-[#0c1328] border border-cyan-500/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-purple-900/60 to-cyan-900/60 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white">Assistente SpeedToBox</h3>
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="text-[10px] text-cyan-300/80 font-mono">IA Conectada aos Dados</span>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/40"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
        {chatMessages.map(m => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-none'
                    : 'bg-[#121c3b] border border-cyan-500/20 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                {m.texto}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 font-mono">{m.dataHora}</span>

              {/* Suggestions pills if any */}
              {m.sugestoes && m.sugestoes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.sugestoes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => enviarMensagemChat(s)}
                      className="text-[10px] bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-full transition-all text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#080d20] border-t border-cyan-500/15 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ex: Quais produtos estão acabando?..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-[#121c3b] border border-cyan-500/25 focus:border-cyan-400 text-white text-xs rounded-xl px-3 py-2 outline-none"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 flex items-center justify-center transition-all flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
