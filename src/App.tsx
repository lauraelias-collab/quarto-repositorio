/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Platform, SocialPost } from "./types";
import EngagementCalculator from "./components/EngagementCalculator";
import PostHistory from "./components/PostHistory";
import GoalsSimulator from "./components/GoalsSimulator";
import PlatformBenchmarks from "./components/PlatformBenchmarks";
import { 
  Share2, 
  TrendingUp, 
  Target, 
  History, 
  Sparkles, 
  Lightbulb,
  Info
} from "lucide-react";

const INITIAL_LOCAL_POSTS: SocialPost[] = [
  {
    id: "post-1",
    title: "Guia Completo: Inteligência Artificial na Prática",
    platform: Platform.INSTAGRAM,
    likes: 540,
    comments: 48,
    shares: 112,
    saves: 85,
    audience: 15000,
    audienceType: "followers",
    createdAt: new Date().toISOString(),
  },
  {
    id: "post-2",
    title: "Vídeo Reels: Rotina de um Programador Sênior",
    platform: Platform.TIKTOK,
    likes: 4200,
    comments: 185,
    shares: 390,
    saves: 15,
    audience: 55000,
    audienceType: "reach",
    createdAt: new Date().toISOString(),
  },
  {
    id: "post-3",
    title: "Anúncio Importante: Nova Rodada de Investimento",
    platform: Platform.LINKEDIN,
    likes: 135,
    comments: 26,
    shares: 14,
    saves: 8,
    audience: 4800,
    audienceType: "followers",
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState<"calculator" | "history" | "goals">("calculator");
  
  // To allow loading a saved post back into the calculator for editing/inspection
  const [loadedPost, setLoadedPost] = useState<SocialPost | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("social_engagement_posts");
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar posts", e);
        setPosts(INITIAL_LOCAL_POSTS);
      }
    } else {
      // Seed with initial content for nice onboarding experience
      setPosts(INITIAL_LOCAL_POSTS);
      localStorage.setItem("social_engagement_posts", JSON.stringify(INITIAL_LOCAL_POSTS));
    }
  }, []);

  // Save post from calculator
  const handleSavePost = (newPostData: Omit<SocialPost, "id" | "createdAt">) => {
    const updatedPost: SocialPost = {
      ...newPostData,
      id: "post-" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    const newPostsList = [updatedPost, ...posts];
    setPosts(newPostsList);
    localStorage.setItem("social_engagement_posts", JSON.stringify(newPostsList));
    setLoadedPost(null); // Clear loaded edit context after saving
  };

  // Delete post
  const handleDeletePost = (id: string) => {
    const filtered = posts.filter((post) => post.id !== id);
    setPosts(filtered);
    localStorage.setItem("social_engagement_posts", JSON.stringify(filtered));
  };

  // Load post into active calculator
  const handleLoadPost = (post: SocialPost) => {
    setLoadedPost(post);
    setActiveTab("calculator");
    
    // Scroll smoothly to top of calculator
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset entire history
  const handleClearAll = () => {
    if (window.confirm("Você tem certeza que deseja excluir todo o histórico de posts cadastrados?")) {
      setPosts([]);
      localStorage.removeItem("social_engagement_posts");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 selection:bg-indigo-600 selection:text-white" id="main-applet-wrapper">
      
      {/* 1. TOP HUB BANNER HEADER */}
      <header className="bg-[#0F0F11] border-b border-white/10 sticky top-0 z-40" id="navigation-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 gap-4">
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/10 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-sans font-semibold text-lg text-white tracking-tight">
                    Métricas & Engajamento Social
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase px-2 .5 bg-indigo-500/10 text-indigo-300 rounded-md border border-indigo-500/20">
                    SaaS Studio
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Calcule, simule e analise o engajamento (curtidas, comentários, compartilhamentos e salvos) de suas mídias.
                </p>
              </div>
            </div>

            {/* Dashboard Tabs Navigator */}
            <nav className="flex items-center bg-[#16161A] p-1.5 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto select-none" id="tabs-navigation">
              <button
                onClick={() => setActiveTab("calculator")}
                className={`flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "calculator"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                id="tab-btn-calculator"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Calculadora Ativa
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "history"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                id="tab-btn-history"
              >
                <History className="w-3.5 h-3.5" />
                Histórico & Médias ({posts.length})
              </button>

              <button
                onClick={() => setActiveTab("goals")}
                className={`flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "goals"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                id="tab-btn-goals"
              >
                <Target className="w-3.5 h-3.5" />
                Simulador de Metas
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* 2. MAIN HUB WORKSPACE AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="primary-content-workspace">
        
        {/* Helper quick tips for social sellers */}
        <div className="bg-indigo-950/40 border border-indigo-500/20 text-slate-200 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300">
              <Lightbulb className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Dica de Crescimento Orgânico</p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Comentários e compartilhamentos pesam até 4x mais que curtidas no algoritmo do Instagram e TikTok. Foque em criar copys interativas!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab("goals");
              // Scroll gracefully to goals
              setTimeout(() => {
                const element = document.getElementById("goals-simulator-card");
                element?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="text-xs font-bold shrink-0 bg-indigo-600 hover:bg-indigo-750 transition-all text-white py-1.5 px-3 rounded-lg shadow-lg shadow-indigo-900/10"
          >
            Quero simular metas →
          </button>
        </div>

        {/* Tab content rendering */}
        <div className="space-y-8 animate-fadeIn">
          {activeTab === "calculator" && (
            <div className="space-y-6">
              {loadedPost && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Você carregou um post salvo do histórico: <strong className="font-semibold text-white">&quot;{loadedPost.title}&quot;</strong>. Os campos da calculadora foram atualizados para visualização.
                    </span>
                  </div>
                  <button
                    onClick={() => setLoadedPost(null)}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Voltar ao Modo Rascunho
                  </button>
                </div>
              )}
              
              <EngagementCalculator onSavePost={handleSavePost} initialPost={loadedPost} />
            </div>
          )}

          {activeTab === "history" && (
            <PostHistory 
              posts={posts} 
              onDeletePost={handleDeletePost} 
              onLoadPost={handleLoadPost}
              onClearAll={handleClearAll}
            />
          )}

          {activeTab === "goals" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <GoalsSimulator />
              </div>
              <div className="lg:col-span-5">
                <PlatformBenchmarks />
              </div>
            </div>
          )}
        </div>

      </main>

      {/* 3. POLISHED PROFESSIONAL FOOTER */}
      <footer className="bg-[#0F0F11] border-t border-white/5 py-8 mt-16 text-xs text-slate-500" id="applet-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">&copy; 2026 Calculadora de Engajamento nas Redes Sociais.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              Sincronizado automaticamente no armazenamento local do seu navegador
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
