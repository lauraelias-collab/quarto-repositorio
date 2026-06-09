/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Platform, SocialPost, MetricWeights } from "./types";
import { PLATFORM_BENCHMARKS, DEFAULT_WEIGHTS } from "./constants";

export function formatNum(n: number): string {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return n.toLocaleString("pt-BR");
}

export function calculateTotalEngagement(
  likes: number,
  comments: number,
  shares: number,
  saves: number = 0
): number {
  return likes + comments + shares + saves;
}

export function calculateEngagementRate(
  totalEngagement: number,
  audience: number
): number {
  if (!audience || audience <= 0) return 0;
  return (totalEngagement / audience) * 100;
}

export function calculateWeightedScore(
  likes: number,
  comments: number,
  shares: number,
  saves: number = 0,
  weights: MetricWeights = DEFAULT_WEIGHTS
): number {
  return (
    likes * weights.likes +
    comments * weights.comments +
    shares * weights.shares +
    saves * weights.saves
  );
}

export interface EngagementClassification {
  status: "Excelente" | "Bom" | "Médio" | "Abaixo da Média";
  colorText: string;
  colorBg: string;
  colorBorder: string;
}

export function classifyEngagementRate(
  platform: Platform,
  rate: number
): EngagementClassification {
  const benchmark = PLATFORM_BENCHMARKS[platform];
  if (!benchmark) {
    return {
      status: "Médio",
      colorText: "text-amber-700",
      colorBg: "bg-amber-50",
      colorBorder: "border-amber-200",
    };
  }

  if (rate >= benchmark.good) {
    return {
      status: "Excelente",
      colorText: "text-emerald-700",
      colorBg: "bg-emerald-50",
      colorBorder: "border-emerald-200",
    };
  } else if (rate >= benchmark.average) {
    return {
      status: "Bom",
      colorText: "text-blue-700",
      colorBg: "bg-blue-50",
      colorBorder: "border-blue-200",
    };
  } else if (rate >= benchmark.low) {
    return {
      status: "Médio",
      colorText: "text-amber-700",
      colorBg: "bg-amber-50",
      colorBorder: "border-amber-200",
    };
  } else {
    return {
      status: "Abaixo da Média",
      colorText: "text-rose-750",
      colorBg: "bg-rose-50",
      colorBorder: "border-rose-200",
    };
  }
}
