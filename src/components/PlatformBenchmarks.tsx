/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Platform } from "../types";
import { PLATFORM_BENCHMARKS, PLATFORM_COLORS } from "../constants";
import { Flame, Star, TrendingUp, AlertCircle } from "lucide-react";

export default function PlatformBenchmarks() {
  const platforms = Object.values(Platform);

  return (
    <div className="bg-[#16161A] rounded-2xl border border-white/5 p-6 shadow-xl overflow-hidden" id="p-benchmarks-card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-indigo-400" />
        <h3 className="font-sans font-semibold text-base text-white">
          Referências do Mercado (Benchmarks)
        </h3>
      </div>
      
      <p className="text-slate-450 text-sm mb-6 leading-relaxed">
        As taxas de engajamento estimadas abaixo mostram a porcentagem usual de interação de acordo com cada plataforma (calculada sobre seguidores/audiência total). Use para calibrar seus objetivos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((plat) => {
          const bench = PLATFORM_BENCHMARKS[plat];
          const colors = PLATFORM_COLORS[plat];
          
          return (
            <div 
              key={plat} 
              className={`p-4 rounded-xl border ${colors.border} transition-all duration-250 hover:shadow-lg bg-[#0A0A0B]/40 hover:bg-[#0A0A0B]/60`}
              id={`benchmark-item-${plat.toLowerCase().replace(/\s|\//g, "-")}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`font-semibold text-xs px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                  {plat}
                </span>
                <span className="text-xs font-mono text-slate-400 font-medium">
                  Taxa Ideal: &gt;={bench.good.toFixed(1)}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Abaixo da média:</span>
                  <span className="font-mono font-semibold text-rose-400">&lt; {bench.low.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Na Média:</span>
                  <span className="font-mono font-semibold text-amber-400">
                    {bench.low.toFixed(1)}% a {bench.average.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Excelente:</span>
                  <span className="font-mono font-semibold text-emerald-400">&gt;= {bench.good.toFixed(1)}%</span>
                </div>
              </div>

              {/* Graphical mini indicator */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="w-full bg-[#0A0A0B] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-rose-550 h-full" style={{ width: `${Math.min((bench.low / bench.good) * 100, 30)}%` }}></div>
                   <div className="bg-amber-550 h-full" style={{ width: `${Math.min(((bench.average - bench.low) / bench.good) * 100, 40)}%` }}></div>
                  <div className="bg-emerald-550 h-full" style={{ flexGrow: 1 }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-start gap-2.5 text-xs text-indigo-300">
        <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Como interpretar:</strong> Publicações com taxas acima da média de mercado têm maior probabilidade de serem recomendadas organicamente pelos algoritmos das redes sociais. Compartilhamentos e comentários são os principais propulsores desse engajamento.
        </span>
      </div>
    </div>
  );
}
