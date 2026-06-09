/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Platform, SocialPost, MetricWeights } from "../types";
import { DEFAULT_WEIGHTS, PLATFORM_COLORS } from "../constants";
import {
  calculateTotalEngagement,
  calculateEngagementRate,
  calculateWeightedScore,
  classifyEngagementRate,
  formatNum,
} from "../utils";
import { 
  Plus, 
  Settings, 
  HelpCircle, 
  Info, 
  Activity, 
  Sparkles,
  Bookmark,
  ChevronRight,
  TrendingUp
} from "lucide-react";

interface EngagementCalculatorProps {
  onSavePost: (post: Omit<SocialPost, "id" | "createdAt">) => void;
  initialPost?: SocialPost | null;
}

export default function EngagementCalculator({ onSavePost, initialPost }: EngagementCalculatorProps) {
  // Post inputs
  const [title, setTitle] = useState(initialPost?.title || "Exemplo de Publicação");
  const [platform, setPlatform] = useState<Platform>(initialPost?.platform || Platform.INSTAGRAM);
  const [likes, setLikes] = useState<number>(initialPost?.likes ?? 420);
  const [comments, setComments] = useState<number>(initialPost?.comments ?? 35);
  const [shares, setShares] = useState<number>(initialPost?.shares ?? 58);
  const [saves, setSaves] = useState<number>(initialPost?.saves ?? 24);
  const [audience, setAudience] = useState<number>(initialPost?.audience ?? 12500);
  const [audienceType, setAudienceType] = useState<"followers" | "reach">(initialPost?.audienceType || "followers");

  // Advanced weight configuration
  const [showWeightsConfig, setShowWeightsConfig] = useState(false);
  const [weights, setWeights] = useState<MetricWeights>(DEFAULT_WEIGHTS);

  // Sync state if initialPost changes (e.g. when editing/re-loading a historical post)
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setPlatform(initialPost.platform);
      setLikes(initialPost.likes);
      setComments(initialPost.comments);
      setShares(initialPost.shares);
      setSaves(initialPost.saves);
      setAudience(initialPost.audience);
      setAudienceType(initialPost.audienceType);
    }
  }, [initialPost]);

  // Calculations
  const totalEngagement = calculateTotalEngagement(likes, comments, shares, saves);
  const engagementRate = calculateEngagementRate(totalEngagement, audience);
  const weightedScore = calculateWeightedScore(likes, comments, shares, saves, weights);
  const classification = classifyEngagementRate(platform, engagementRate);

  const colors = PLATFORM_COLORS[platform] || PLATFORM_COLORS[Platform.INSTAGRAM];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePost({
      title: title.trim() || `Post no ${platform}`,
      platform,
      likes,
      comments,
      shares,
      saves,
      audience,
      audienceType,
    });
    
    // Smooth scroll down to post history
    const historySection = document.getElementById("post-history-section");
    if (historySection) {
      historySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const resetCalculator = () => {
    setTitle("Novo Post " + platform);
    setLikes(0);
    setComments(0);
    setShares(0);
    setSaves(0);
  };

  // Percentages for visualizations
  const totalInvolved = likes + comments + shares + saves || 1;
  const likesPct = (likes / totalInvolved) * 100;
  const commentsPct = (comments / totalInvolved) * 100;
  const sharesPct = (shares / totalInvolved) * 100;
  const savesPct = (saves / totalInvolved) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="engagement-calculator-root">
      
      {/* 1. INPUT FORM COLUMN (LG: 7) */}
      <form onSubmit={handleSave} className="lg:col-span-7 bg-[#16161A] rounded-2xl border border-white/5 p-6 shadow-xl space-y-6 flex flex-col justify-between" id="calculator-input-form">
        <div>
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-base text-white">Calculadora de Publicações</h3>
                <p className="text-xs text-slate-400">Calcule métricas personalizadas instantaneamente</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={resetCalculator}
              className="text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              id="btn-limpar-calculo"
            >
              Limpar Campos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans" htmlFor="field-title">
                Nome ou Tema da Publicação
              </label>
              <input
                id="field-title"
                type="text"
                placeholder="Ex. Lançamento do Produto X, Vídeo de Receita, etc..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500/50 focus:outline-hidden rounded-xl px-4 py-2.5 text-white text-sm transition-all font-medium placeholder-slate-650"
              />
            </div>

            {/* Platform Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans" htmlFor="field-platform">
                Rede Social
              </label>
              <select
                id="field-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500/50 focus:outline-hidden rounded-xl px-4 py-2.5 text-sm text-white font-medium transition-all"
              >
                {Object.values(Platform).map((plat) => (
                  <option key={plat} value={plat} className="bg-[#121214] text-white">
                    {plat}
                  </option>
                ))}
              </select>
            </div>

            {/* Audience Setup */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans" htmlFor="field-audience">
                Volume da Audiência Total
              </label>
              <div className="relative flex items-center">
                <input
                  id="field-audience"
                  type="number"
                  min="1"
                  value={audience || ""}
                  onChange={(e) => setAudience(Math.max(1, parseInt(e.target.value) || 0))}
                  placeholder="Ex: 5000"
                  className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500/50 focus:outline-hidden rounded-xl pl-4 pr-32 py-2.5 text-sm text-white font-mono transition-all font-medium placeholder-slate-655"
                />
                
                {/* Segment Selector for Audience Type */}
                <span className="absolute right-1 text-xs">
                  <select
                    value={audienceType}
                    onChange={(e) => setAudienceType(e.target.value as "followers" | "reach")}
                    className="bg-[#16161A] border border-white/10 rounded-lg py-1 px-2 text-[10px] uppercase font-bold tracking-wider text-slate-300 focus:outline-none"
                    id="field-audience-type"
                  >
                    <option value="followers" className="text-white">Seguidores</option>
                    <option value="reach" className="text-white">Alcance</option>
                  </select>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {/* Likes */}
            <div className="group">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans" htmlFor="field-likes">
                Curtidas
              </label>
              <input
                id="field-likes"
                type="number"
                min="0"
                value={likes || 0}
                onChange={(e) => setLikes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-pink-500/50 focus:outline-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-pink-400 font-mono transition-all"
              />
            </div>

            {/* Comments */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans" htmlFor="field-comments">
                Comentários
              </label>
              <input
                id="field-comments"
                type="number"
                min="0"
                value={comments || 0}
                onChange={(e) => setComments(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-cyan-500/50 focus:outline-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-cyan-400 font-mono transition-all"
              />
            </div>

            {/* Shares */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans" htmlFor="field-shares">
                Compartilhamentos
              </label>
              <input
                id="field-shares"
                type="number"
                min="0"
                value={shares || 0}
                onChange={(e) => setShares(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-emerald-500/50 focus:outline-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-emerald-400 font-mono transition-all"
              />
            </div>

            {/* Saves */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans" htmlFor="field-saves">
                  Salvos / Favoritos
                </label>
                <div className="relative group/tooltip">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-1 bg-[#0A0A0B] border border-white/10 text-slate-300 text-[10px] p-2 rounded-lg w-48 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-md">
                    Salvos são muito importantes no Instagram, TikTok e Pinterest para medir intenção qualificada.
                  </div>
                </div>
              </div>
              <input
                id="field-saves"
                type="number"
                min="0"
                value={saves || 0}
                onChange={(e) => setSaves(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-amber-500/50 focus:outline-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-amber-400 font-mono transition-all"
              />
            </div>
          </div>

          {/* Advanced Weight customisation */}
          <div className="mt-5 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={() => setShowWeightsConfig(!showWeightsConfig)}
              className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold hover:text-indigo-300 focus:outline-none cursor-pointer"
              id="toggle-weights"
            >
              <Settings className={`w-3.5 h-3.5 transition-transform duration-300 ${showWeightsConfig ? "rotate-90" : ""}`} />
              {showWeightsConfig ? "Ocultar Pesos Customizados" : "Configurar Pesos dos Engajamentos"}
            </button>

            {showWeightsConfig && (
              <div className="bg-[#0A0A0B]/50 p-4 rounded-xl border border-white/5 mt-3 space-y-4 animate-fadeIn" id="weights-panel">
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Social managers usam &quot;Engajamento Geral Ponderado&quot; para dar mais valor a ações de alto esforço (como compartilhar ou comentar) do que cliques simples (curtidas). Defina quantos pontos vale cada ação:
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Curtida</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={weights.likes}
                      onChange={(e) => setWeights({ ...weights, likes: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Comentário</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={weights.comments}
                      onChange={(e) => setWeights({ ...weights, comments: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Compart.</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={weights.shares}
                      onChange={(e) => setWeights({ ...weights, shares: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Salvo</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={weights.saves}
                      onChange={(e) => setWeights({ ...weights, saves: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-full bg-[#0A0A0B] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setWeights(DEFAULT_WEIGHTS)}
                    className="text-[10px] font-bold text-slate-400 hover:text-[#1e1e24] uppercase cursor-pointer"
                  >
                    Restaurar Padrão
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Action Button */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-900/20"
            id="btn-salvar-no-historico"
          >
            <Plus className="w-4 h-4" />
            Salvar no Histórico de Posts
          </button>
        </div>
      </form>

      {/* 2. LIVE RESULTS & DIAGNOSTIC COLUMN (LG: 5) */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6" id="calculator-live-results">
        
        {/* Metric Overview Widget */}
        <div className="bg-[#16161A] text-slate-350 rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          {/* Subtle overlay decorative circle */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#6c727f]">
                Diagnóstico em Tempo Real
              </span>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} flex items-center gap-1 border ${colors.border}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {platform}
              </span>
            </div>

            {/* Title display */}
            <h4 className="text-base font-semibold text-white line-clamp-1 mb-5">
              &quot;{title}&quot;
            </h4>

            {/* Core figures side by side */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-5 mb-5">
              <div>
                <p className="text-xs text-[#a0aec0]">Engajamento Total</p>
                <p className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {totalEngagement.toLocaleString("pt-BR")}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#a0aec0]">
                  Taxa de Engajamento
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-3xl font-extrabold text-indigo-400 font-mono">
                    {engagementRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Assessment display */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#a0aec0] font-medium">Classificação de Desempenho:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${classification.colorBorder} ${classification.colorBg} ${classification.colorText}`}>
                  {classification.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#a0aec0] font-medium">Pontuação Ponderada (Valores):</span>
                <span className="text-xs font-mono font-bold text-slate-350">
                  {weightedScore.toFixed(1)} pontos
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-xs text-slate-400 leading-relaxed">
            {classification.status === "Excelente" && (
              <p>🥇 Desempenho fantástico! O post está engajando muito mais do que a média de mercado para o {platform}. Dobre a aposta neste tema.</p>
            )}
            {classification.status === "Bom" && (
              <p>⭐ Ótimas métricas! A publicação está saudável e performando acima do padrão. O conteúdo se provou interessante para a audiência.</p>
            )}
            {classification.status === "Médio" && (
              <p>📈 Resultado satisfatório. Está dentro do intervalo padrão de mercado. Tente responder os comentários para estimular conversas artificiais.</p>
            )}
            {classification.status === "Abaixo da Média" && (
              <p>⚠️ Engajamento frio. Ficou abaixo do patamar de mercado de {platform}. Avalie otimizar a imagem de capa e a chamada para ação (CTA).</p>
            )}
          </div>
        </div>

        {/* Interaction Share Breakdown UI */}
        <div className="bg-[#16161A] rounded-2xl border border-white/5 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">
              Composição das Interações
            </h4>
            <span className="text-[10px] font-mono text-slate-500">
              Total: {totalEngagement}
            </span>
          </div>

          {totalEngagement === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
              Nenhuma interação informada para criar o gráfico.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Custom Stacked Bar Chart */}
              <div className="w-full bg-[#0A0A0B] h-4 rounded-full overflow-hidden flex">
                {likes > 0 && <div className="bg-pink-500 h-full transition-all duration-300" style={{ width: `${likesPct}%` }} title="Curtidas" />}
                {comments > 0 && <div className="bg-cyan-500 h-full transition-all duration-300" style={{ width: `${commentsPct}%` }} title="Comentários" />}
                {shares > 0 && <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${sharesPct}%` }} title="Compartilhamentos" />}
                {saves > 0 && <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${savesPct}%` }} title="Salvos" />}
              </div>

              {/* Legends with detailed breakdown */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Likes info */}
                <div className="flex items-start gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-xs bg-pink-500 shrink-0 mt-0.5"></span>
                  <div className="leading-none">
                    <p className="font-semibold text-slate-200">Curtidas</p>
                    <p className="font-mono text-[10px] text-slate-450 mt-0.5">{likesPct.toFixed(1)}% ({formatNum(likes)})</p>
                  </div>
                </div>

                {/* Comments info */}
                <div className="flex items-start gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500 shrink-0 mt-0.5"></span>
                  <div className="leading-none">
                    <p className="font-semibold text-slate-200">Comentários</p>
                    <p className="font-mono text-[10px] text-slate-450 mt-0.5">{commentsPct.toFixed(1)}% ({formatNum(comments)})</p>
                  </div>
                </div>

                {/* Shares info */}
                <div className="flex items-start gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 shrink-0 mt-0.5"></span>
                  <div className="leading-none">
                    <p className="font-semibold text-slate-200">Compartilhamentos</p>
                    <p className="font-mono text-[10px] text-slate-450 mt-0.5">{sharesPct.toFixed(1)}% ({formatNum(shares)})</p>
                  </div>
                </div>

                {/* Saves info */}
                <div className="flex items-start gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shrink-0 mt-0.5"></span>
                  <div className="leading-none">
                    <p className="font-semibold text-slate-200">Salvos/Favoritos</p>
                    <p className="font-mono text-[10px] text-slate-450 mt-0.5">{savesPct.toFixed(1)}% ({formatNum(saves)})</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
