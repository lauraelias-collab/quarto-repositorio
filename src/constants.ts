/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Platform, Benchmark, MetricWeights } from "./types";

export const PLATFORM_BENCHMARKS: Record<Platform, Benchmark> = {
  [Platform.INSTAGRAM]: {
    platform: Platform.INSTAGRAM,
    low: 1.0,
    average: 2.5,
    good: 4.5,
    excellent: 4.5,
  },
  [Platform.TIKTOK]: {
    platform: Platform.TIKTOK,
    low: 3.0,
    average: 6.0,
    good: 10.0,
    excellent: 10.0,
  },
  [Platform.LINKEDIN]: {
    platform: Platform.LINKEDIN,
    low: 0.5,
    average: 1.5,
    good: 3.0,
    excellent: 3.0,
  },
  [Platform.X_TWITTER]: {
    platform: Platform.X_TWITTER,
    low: 0.2,
    average: 0.9,
    good: 2.0,
    excellent: 2.0,
  },
  [Platform.YOUTUBE]: {
    platform: Platform.YOUTUBE,
    low: 1.5,
    average: 3.5,
    good: 6.5,
    excellent: 6.5,
  },
  [Platform.FACEBOOK]: {
    platform: Platform.FACEBOOK,
    low: 0.3,
    average: 1.2,
    good: 2.5,
    excellent: 2.5,
  },
};

export const DEFAULT_WEIGHTS: MetricWeights = {
  likes: 1.0,
  comments: 2.5,
  shares: 4.0,
  saves: 3.0,
};

export const PLATFORM_COLORS: Record<Platform, { bg: string; text: string; border: string; accent: string; darkAccent: string }> = {
  [Platform.INSTAGRAM]: {
    bg: "bg-pink-950/30",
    text: "text-pink-400",
    border: "border-pink-900/30",
    accent: "bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500",
    darkAccent: "from-purple-800 to-pink-700",
  },
  [Platform.TIKTOK]: {
    bg: "bg-stone-900/50",
    text: "text-stone-100",
    border: "border-stone-800",
    accent: "bg-gradient-to-r from-cyan-400 to-rose-500",
    darkAccent: "from-cyan-600 to-rose-600",
  },
  [Platform.LINKEDIN]: {
    bg: "bg-blue-950/40",
    text: "text-blue-400",
    border: "border-blue-900/30",
    accent: "bg-sky-500",
    darkAccent: "bg-sky-800",
  },
  [Platform.X_TWITTER]: {
    bg: "bg-zinc-900/80",
    text: "text-zinc-150",
    border: "border-zinc-800",
    accent: "bg-neutral-800",
    darkAccent: "bg-black",
  },
  [Platform.YOUTUBE]: {
    bg: "bg-red-950/30",
    text: "text-red-400",
    border: "border-red-900/30",
    accent: "bg-red-500",
    darkAccent: "bg-red-800",
  },
  [Platform.FACEBOOK]: {
    bg: "bg-indigo-950/40",
    text: "text-indigo-400",
    border: "border-indigo-900/30",
    accent: "bg-indigo-500",
    darkAccent: "bg-indigo-800",
  },
};
