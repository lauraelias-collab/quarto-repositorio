/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Platform {
  INSTAGRAM = "Instagram",
  TIKTOK = "TikTok",
  LINKEDIN = "LinkedIn",
  X_TWITTER = "X / Twitter",
  YOUTUBE = "YouTube",
  FACEBOOK = "Facebook",
}

export interface SocialPost {
  id: string;
  title: string;
  platform: Platform;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  audience: number; // Followers or Reach
  audienceType: "followers" | "reach";
  createdAt: string;
  notes?: string;
}

export interface MetricWeights {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export interface Benchmark {
  platform: Platform;
  low: number; // Below average upper limit
  average: number; // Average upper limit
  good: number; // Good upper limit
  excellent: number; // Starting rate for excellent
}
