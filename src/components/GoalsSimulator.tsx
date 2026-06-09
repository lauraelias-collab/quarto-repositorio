/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Platform } from "../types";
import { Target, ThumbsUp, MessageSquare, Share2, HelpCircle } from "lucide-react";
import { formatNum } from "../utils";

interface Strategy {
  name: string;
  description: string;
  likesPct: number;
  commentsPct: number;
  sharesPct: number;
}

const STRATEGIES: Strategy[] = [
  {
    name: "Equilibrada (Padrão)",
    description: "Distribuição padrão ideal para posts cotidianos.",
    likesPct: 75,
    commentsPct: 15,
    sharesPct: 10,
  },
  {
    name: "Foco em Viralidade",
    description: "Apropriado para carrosséis instrutivos ou memes altamente compartilháveis.",
    likesPct: 55,
    commentsPct: 10,
    sharesPct: 35,
  },
  {
    name: "Foco em Conversa",
    description: "Fórmula para posts polêmicos, perguntas, sorteios ou feedbacks.",
    likesPct: 50,
    commentsPct: 45,
    sharesPct: 5,
  },
];

export default function GoalsSimulator() {
  const [platform, setPlatform] = useState<Platform>(Platform.INSTAGRAM);
  const [targetRate, setTargetRate] = useState<number>(3.5);
  const [audience, setAudience] = useState<number>(10000);
  const [strategyIndex, setStrategyIndex] = useState<number>(0);

  // Executing calculations
  const totalEngagementNeeded = Math.round((targetRate / 100) * audience);
  
  const strategy = STRATEGIES[strategyIndex];
  const likesNeeded = Math.round((strategy.likesPct / 100) * totalEngagementNeeded);
  const commentsNeeded = Math.round((strategy.commentsPct / 100) * totalEngagementNeeded);
  const sharesNeeded = Math.round((strategy.sharesPct / 100) * totalEngagementNeeded);

  return (
    <div className="bg-[#16161A] rounded-2xl border border-white/5 p-6 shadow-xl" id="goals-simulator-card">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-indigo-400" />
        <h3 className="font-sans font-semibold text-base text-white">
          Simulador de Metas de Engajamento
        </h3>
      </div>

      <p className="text-slate-450 text-sm mb-6 leading-relaxed">
        Defina seu público e a taxa de engajamento desejada para descobrir exatamente quantas curtidas, comentários e compartilhamentos você precisa obter para bater sua meta.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">
              Plataforma de Destino
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500/55 focus:outline-hidden rounded-xl px-4 py-2.5 text-sm text-white transition-all font-medium"
              id="simulator-platform-select"
            >
              {Object.values(Platform).map((plat) => (
                <option key={plat} value={plat} className="bg-[#121214] text-white">
                  {plat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">
                Seguidores / Alcance
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={audience || ""}
                onChange={(e) => setAudience(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500/55 focus:outline-hidden rounded-xl px-4 py-2 text-sm text-white font-mono transition-all"
                id="simulator-audience-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">
                Taxa Alvo (%)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                max="100"
                value={targetRate || ""}
                onChange={(e) => setTargetRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500/55 focus:outline-hidden rounded-xl px-4 py-2 text-sm text-white font-mono transition-all"
                id="simulator-rate-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-sans">
              Estratégia de Distribuição
            </label>
            <div className="space-y-2">
              {STRATEGIES.map((strat, idx) => (
                <button
                  key={strat.name}
                  type="button"
                  onClick={() => setStrategyIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-sm cursor-pointer ${
                    strategyIndex === idx
                      ? "border-indigo-500 bg-indigo-500/10 text-white ring-2 ring-indigo-500/10"
                      : "border-white/10 bg-[#0A0A0B]/20 text-slate-400 hover:bg-[#0A0A0B]/40 hover:text-slate-200"
                  }`}
                  id={`strategy-button-${idx}`}
                >
                  <p className="font-semibold">{strat.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{strat.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      Curtidas: {strat.likesPct}%
                    </span>
                    <span className="flex items-center gap-1">
                      Coments: {strat.commentsPct}%
                    </span>
                    <span className="flex items-center gap-1">
                      Compart: {strat.sharesPct}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Results Breakdown */}
        <div className="bg-[#0F0F11]/50 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider font-sans text-left">
              Diagnóstico da Meta
            </h4>
            <div className="p-4 bg-[#0A0A0B] rounded-xl border border-white/10 shadow-xs mb-4">
              <p className="text-xs text-slate-400 uppercase font-semibold">Total de Interações Necessárias</p>
              <p className="text-3xl font-extrabold text-indigo-400 mt-1 font-mono">
                {formatNum(totalEngagementNeeded)}
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Para um público de <strong className="font-mono text-white">{formatNum(audience)}</strong> pessoas, gerar <strong className="font-mono text-white">{targetRate}%</strong> de engajamento exige um total de {totalEngagementNeeded.toLocaleString("pt-BR")} conexões ou cliques ativos.
              </p>
            </div>

            <div className="space-y-3">
              {/* Likes needed */}
              <div className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-2 rounded-lg bg-pink-500/10 text-pink-400">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">Curtidas</p>
                    <p className="text-xs font-mono text-slate-500">{strategy.likesPct}% da meta</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-white text-base">{likesNeeded.toLocaleString("pt-BR")}</p>
                </div>
              </div>

              {/* Comments needed */}
              <div className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">Comentários</p>
                    <p className="text-xs font-mono text-slate-500">{strategy.commentsPct}% da meta</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-white text-base">{commentsNeeded.toLocaleString("pt-BR")}</p>
                </div>
              </div>

              {/* Shares needed */}
              <div className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">Compartilhamentos</p>
                    <p className="text-xs font-mono text-slate-500">{strategy.sharesPct}% da meta</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-white text-base">{sharesNeeded.toLocaleString("pt-BR")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-400 bg-[#0A0A0B]/50 rounded-lg p-2.5 border border-white/5 leading-relaxed">
            *Dica: Para impulsionar comentários, faça perguntas abertas ao final da legenda do post. Para compartilhamentos, crie posts do formato &quot;guia passo a passo&quot; ou listas úteis de consulta rápida.
          </div>
        </div>
      </div>
    </div>
  );
}
