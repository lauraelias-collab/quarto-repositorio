/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Platform, SocialPost } from "../types";
import { 
  Trash2, 
  Search, 
  BarChart3, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Award
} from "lucide-react";
import { PLATFORM_COLORS } from "../constants";
import { 
  calculateEngagementRate, 
  classifyEngagementRate, 
  formatNum 
} from "../utils";

interface PostHistoryProps {
  posts: SocialPost[];
  onDeletePost: (id: string) => void;
  onLoadPost: (post: SocialPost) => void;
  onClearAll: () => void;
}

export default function PostHistory({ posts, onDeletePost, onLoadPost, onClearAll }: PostHistoryProps) {
  const [filterPlatform, setFilterPlatform] = useState<Platform | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchPlatform = filterPlatform === "ALL" || post.platform === filterPlatform;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPlatform && matchSearch;
  });

  // Calculate Average Analytics
  const totalPosts = posts.length;
  const avgLikes = totalPosts > 0 ? Math.round(posts.reduce((sum, p) => sum + p.likes, 0) / totalPosts) : 0;
  const avgComments = totalPosts > 0 ? Math.round(posts.reduce((sum, p) => sum + p.comments, 0) / totalPosts) : 0;
  const avgShares = totalPosts > 0 ? Math.round(posts.reduce((sum, p) => sum + p.shares, 0) / totalPosts) : 0;
  
  // Overall Engagement Rate (average of individual rates)
  const avgRate = totalPosts > 0
    ? posts.reduce((sum, p) => {
        const totalEng = p.likes + p.comments + p.shares + p.saves;
        return sum + calculateEngagementRate(totalEng, p.audience);
      }, 0) / totalPosts
    : 0;

  // Best Post (Highest ER)
  const bestPost = posts.reduce<SocialPost | null>((best, current) => {
    if (!best) return current;
    const currentEng = current.likes + current.comments + current.shares + current.saves;
    const currentRate = calculateEngagementRate(currentEng, current.audience);
    
    const bestEng = best.likes + best.comments + best.shares + best.saves;
    const bestRate = calculateEngagementRate(bestEng, best.audience);
    
    return currentRate > bestRate ? current : best;
  }, null);

  const bestPostRate = bestPost 
    ? calculateEngagementRate(bestPost.likes + bestPost.comments + bestPost.shares + bestPost.saves, bestPost.audience)
    : 0;

  return (
    <div className="space-y-6" id="post-history-section">
      
      {/* 1. AGGREGATE SOCIAL PERFORMANCE INDEX (BENTO GRID STYLE) */}
      <div className="bg-[#16161A] rounded-2xl border border-white/5 p-6 shadow-xl overflow-hidden relative" id="analytics-overview">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-sans font-semibold text-base text-white">Visão Geral de Performance</h3>
              <p className="text-xs text-slate-400">Análise média unificada de todos os posts cadastrados</p>
            </div>
          </div>

          {totalPosts > 1 && (
            <button
              onClick={onClearAll}
              className="text-xs font-bold text-rose-400 bg-rose-550/10 hover:bg-rose-550/20 border border-rose-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              id="btn-limpar-historico"
            >
              Resetar Histórico ({totalPosts})
            </button>
          )}
        </div>

        {totalPosts === 0 ? (
          <div className="py-8 text-center text-slate-400 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#0A0A0B] flex items-center justify-center text-slate-500 mx-auto mb-3 border border-white/10">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-200">Seu histórico está vazio</p>
            <p className="text-xs text-slate-400 mt-1">Preencha os campos da calculadora acima e clique em &quot;Salvar no Histórico&quot; para registrar publicações e calcular médias agregadas.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Index Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Avg ER */}
              <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Taxa Média Geral</p>
                <p className="text-2xl font-extrabold font-mono text-indigo-400 mt-1">{avgRate.toFixed(2)}%</p>
                <p className="text-[10px] text-slate-400 mt-1">Soma ponderada dos posts</p>
              </div>

              {/* Avg Likes */}
              <div className="p-4 bg-[#0A0A0B] rounded-xl border border-white/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Média de Curtidas</p>
                <p className="text-2xl font-extrabold font-mono text-white mt-1">{avgLikes.toLocaleString("pt-BR")}</p>
                <p className="text-[10px] text-slate-500 mt-1">Por post individual</p>
              </div>

              {/* Avg Comments */}
              <div className="p-4 bg-[#0A0A0B] rounded-xl border border-white/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Média Comentários</p>
                <p className="text-2xl font-extrabold font-mono text-white mt-1">{avgComments.toLocaleString("pt-BR")}</p>
                <p className="text-[10px] text-slate-500 mt-1">Interação conversacional</p>
              </div>

              {/* Avg Shares */}
              <div className="p-4 bg-[#0A0A0B] rounded-xl border border-white/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Média Compartilhar</p>
                <p className="text-2xl font-extrabold font-mono text-white mt-1">{avgShares.toLocaleString("pt-BR")}</p>
                <p className="text-[10px] text-slate-500 mt-1">Multiplicador de alcance</p>
              </div>
            </div>

            {/* Best post highlighted */}
            {bestPost && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-550/15 text-amber-400 rounded-lg shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider">Publicação Destaque (ER)</span>
                    <h5 className="font-semibold text-white text-sm line-clamp-1 mt-0.5">&quot;{bestPost.title}&quot; no {bestPost.platform}</h5>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:text-right">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium font-sans">Melhor Taxa</p>
                    <p className="font-mono font-bold text-amber-400 text-base">{bestPostRate.toFixed(2)}%</p>
                  </div>
                  <button
                    onClick={() => onLoadPost(bestPost)}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-250 bg-white/5 border border-amber-500/30 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Carregar Post
                    <ChevronRight className="w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. POST TABLE & SEARCH & FILTER */}
      {totalPosts > 0 && (
        <div className="bg-[#16161A] rounded-2xl border border-white/5 shadow-xl overflow-hidden" id="post-history-list">
          {/* Header Controls */}
          <div className="p-5 border-b border-white/5 bg-[#121214]/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Platform filter tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterPlatform("ALL")}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filterPlatform === "ALL" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/15" 
                    : "bg-[#0A0A0B] text-slate-400 hover:text-white border border-white/10"
                }`}
                id="filter-tag-all"
              >
                Todos
              </button>
              {Object.values(Platform).map((plat) => (
                <button
                  key={plat}
                  onClick={() => setFilterPlatform(plat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    filterPlatform === plat 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/15" 
                      : "bg-[#0A0A0B] text-slate-400 hover:text-white border border-white/10"
                  }`}
                  id={`filter-tag-${plat.toLowerCase().replace(/\s|\//g, "-")}`}
                >
                  {plat}
                </button>
              ))}
            </div>

            {/* Keyword search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar post..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 focus:border-indigo-500/50 focus:outline-[#2c2084] rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 font-medium"
                id="search-posts-input"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredPosts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Nenhum post encontrado com os filtros atuais.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-[#121214]/20 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-5">Publicação</th>
                    <th className="py-4 px-4">Engajamento</th>
                    <th className="py-4 px-4">Público Alvo</th>
                    <th className="py-4 px-4">Taxa</th>
                    <th className="py-4 px-4 text-center">Desempenho</th>
                    <th className="py-4 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredPosts.map((post) => {
                    const postEngagement = post.likes + post.comments + post.shares + post.saves;
                    const postRate = calculateEngagementRate(postEngagement, post.audience);
                    const classif = classifyEngagementRate(post.platform, postRate);
                    const colors = PLATFORM_COLORS[post.platform] || PLATFORM_COLORS[Platform.INSTAGRAM];

                    return (
                      <tr key={post.id} className="hover:bg-white/2 group transition-all" id={`post-row-${post.id}`}>
                        <td className="py-4 px-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white line-clamp-1">{post.title}</span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 mt-1.5 font-semibold">
                              <span className={`w-1.5 h-1.5 rounded-full ${colors.accent}`}></span>
                              {post.platform}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono">
                          <div className="text-white font-bold">{postEngagement.toLocaleString("pt-BR")}</div>
                          <div className="text-[10px] text-slate-400 flex gap-2 mt-0.5">
                            <span title="Curtidas" className="text-pink-400">♥ {formatNum(post.likes)}</span>
                            <span title="Comentários" className="text-cyan-400">✎ {formatNum(post.comments)}</span>
                            <span title="Compartilhamentos" className="text-emerald-400">⇾ {formatNum(post.shares)}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-300">
                          <div>{post.audience.toLocaleString("pt-BR")}</div>
                          <dfn className="text-[10px] text-slate-500 uppercase not-italic font-bold tracking-wider">
                            {post.audienceType === "followers" ? "Seguidores" : "Alcance"}
                          </dfn>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-indigo-400 text-base">
                          {postRate.toFixed(2)}%
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${classif.colorBorder} ${classif.colorBg} ${classif.colorText}`}>
                            {classif.status}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onLoadPost(post)}
                              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Carregar de volta na Calculadora"
                            >
                              Carregar
                            </button>
                            <button
                              onClick={() => onDeletePost(post.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
