"use client";

import { useState, useMemo } from "react";
import { Trophy, Flame, Star, TrendingUp } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import type { Achievement, AchievementCategory, AchievementTier } from "@/types";

// ── Tier Colors ──
const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
  platinum: "#e5e4e2",
};

const TIER_XP: Record<AchievementTier, number> = {
  bronze: 100,
  silver: 250,
  gold: 500,
  platinum: 1000,
};

// ── Filter Tabs ──
const FILTER_TABS: ReadonlyArray<{ readonly label: string; readonly value: AchievementCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Logging", value: "logging" },
  { label: "Protocols", value: "protocols" },
  { label: "Learning", value: "learning" },
  { label: "Community", value: "community" },
  { label: "Milestones", value: "milestones" },
] as const;

// ── Achievement Data ──
const ACHIEVEMENTS: readonly Achievement[] = [
  // Logging (5)
  { id: "log-1", title: "First Dose", description: "Log your very first dose in DoseCraft.", category: "logging", tier: "bronze", icon: "\uD83C\uDFAF", requirement: "Log 1 dose", progress: 100, unlocked: true, unlockedAt: "2026-01-15T10:30:00Z" },
  { id: "log-2", title: "Week Warrior", description: "Maintain a 7-day logging streak without missing a day.", category: "logging", tier: "bronze", icon: "\uD83D\uDD25", requirement: "7-day streak", progress: 100, unlocked: true, unlockedAt: "2026-01-22T08:00:00Z" },
  { id: "log-3", title: "Month Master", description: "Achieve a 30-day consecutive logging streak.", category: "logging", tier: "silver", icon: "\uD83D\uDCC5", requirement: "30-day streak", progress: 43, unlocked: false },
  { id: "log-4", title: "Century Club", description: "Reach 100 total dose logs across all protocols.", category: "logging", tier: "silver", icon: "\uD83D\uDCAF", requirement: "100 total logs", progress: 87, unlocked: false },
  { id: "log-5", title: "Thousand Strong", description: "Log an incredible 1,000 doses over your journey.", category: "logging", tier: "gold", icon: "\uD83C\uDFC6", requirement: "1,000 total logs", progress: 18, unlocked: false },

  // Protocols (4)
  { id: "proto-1", title: "Protocol Pioneer", description: "Start your first peptide protocol.", category: "protocols", tier: "bronze", icon: "\uD83E\uDDEA", requirement: "Start first protocol", progress: 100, unlocked: true, unlockedAt: "2026-01-16T14:00:00Z" },
  { id: "proto-2", title: "Stack Builder", description: "Create a custom protocol from scratch.", category: "protocols", tier: "bronze", icon: "\uD83C\uDFD7\uFE0F", requirement: "Create custom protocol", progress: 100, unlocked: true, unlockedAt: "2026-01-20T09:15:00Z" },
  { id: "proto-3", title: "Protocol Perfectionist", description: "Maintain 100% compliance on a protocol for 30 consecutive days.", category: "protocols", tier: "gold", icon: "\u2B50", requirement: "100% compliance for 30 days", progress: 60, unlocked: false },
  { id: "proto-4", title: "Multi-Stack Master", description: "Run 3 or more protocols simultaneously.", category: "protocols", tier: "platinum", icon: "\uD83C\uDFAA", requirement: "Run 3+ protocols at once", progress: 33, unlocked: false },

  // Learning (4)
  { id: "learn-1", title: "Knowledge Seeker", description: "Explore 10 different compound profiles in the library.", category: "learning", tier: "bronze", icon: "\uD83D\uDCDA", requirement: "View 10 compound profiles", progress: 100, unlocked: true, unlockedAt: "2026-01-18T11:00:00Z" },
  { id: "learn-2", title: "Deep Diver", description: "View all 3 evidence lanes for at least 5 compounds.", category: "learning", tier: "silver", icon: "\uD83D\uDD2C", requirement: "View all lanes for 5 compounds", progress: 100, unlocked: true, unlockedAt: "2026-02-05T16:30:00Z" },
  { id: "learn-3", title: "Comparison Expert", description: "Use the compound comparison tool 10 times.", category: "learning", tier: "silver", icon: "\u2696\uFE0F", requirement: "Use compare tool 10 times", progress: 70, unlocked: false },
  { id: "learn-4", title: "FDA Scholar", description: "View the FDA status page for every tracked compound.", category: "learning", tier: "bronze", icon: "\uD83C\uDFDB\uFE0F", requirement: "View all FDA statuses", progress: 100, unlocked: true, unlockedAt: "2026-02-10T13:00:00Z" },

  // Community (3)
  { id: "comm-1", title: "Social Starter", description: "Follow your first protocol creator.", category: "community", tier: "bronze", icon: "\uD83D\uDC4B", requirement: "Follow a creator", progress: 100, unlocked: true, unlockedAt: "2026-01-25T10:00:00Z" },
  { id: "comm-2", title: "Community Voice", description: "Share one of your protocols with the community.", category: "community", tier: "silver", icon: "\uD83D\uDCE2", requirement: "Share a protocol", progress: 0, unlocked: false },
  { id: "comm-3", title: "Influencer", description: "Have your shared protocols saved by 10 different users.", category: "community", tier: "gold", icon: "\uD83C\uDF1F", requirement: "Get 10 protocol saves", progress: 0, unlocked: false },

  // Milestones (4)
  { id: "mile-1", title: "Getting Started", description: "Complete the DoseCraft onboarding flow.", category: "milestones", tier: "bronze", icon: "\uD83D\uDE80", requirement: "Complete onboarding", progress: 100, unlocked: true, unlockedAt: "2026-01-15T09:00:00Z" },
  { id: "mile-2", title: "Tool Explorer", description: "Use 5 different tools in the DoseCraft toolkit.", category: "milestones", tier: "bronze", icon: "\uD83E\uDDF0", requirement: "Use 5 different tools", progress: 100, unlocked: true, unlockedAt: "2026-02-01T12:00:00Z" },
  { id: "mile-3", title: "Wellness Tracker", description: "Log 7 days of wellness data to track your progress.", category: "milestones", tier: "silver", icon: "\uD83D\uDC9A", requirement: "Log 7 days of wellness data", progress: 57, unlocked: false },
  { id: "mile-4", title: "Inventory Pro", description: "Track 5 or more vials in your inventory.", category: "milestones", tier: "silver", icon: "\uD83D\uDCE6", requirement: "Track 5+ vials", progress: 40, unlocked: false },
] as const;

// ── Helpers ──
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function computeTier(percentage: number): AchievementTier {
  if (percentage >= 90) return "platinum";
  if (percentage >= 60) return "gold";
  if (percentage >= 30) return "silver";
  return "bronze";
}

// ── Page ──
export default function AchievementsPage() {
  const [activeFilter, setActiveFilter] = useState<AchievementCategory | "all">("all");

  const filtered = useMemo(
    () => activeFilter === "all" ? ACHIEVEMENTS : ACHIEVEMENTS.filter((a) => a.category === activeFilter),
    [activeFilter],
  );

  const totalUnlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const unlockPercentage = Math.round((totalUnlocked / totalCount) * 100);
  const currentTier = computeTier(unlockPercentage);
  const streakDays = 13;
  const xpPoints = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((sum, a) => sum + TIER_XP[a.tier], 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,107,53,0.1) 100%)" }}
          >
            <Trophy className="w-5 h-5" style={{ color: "#ffd700" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dc-text tracking-tight">Achievements</h1>
            <p className="text-sm text-dc-text-muted">Track your peptide research milestones</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-dc-accent/15">
              <Trophy className="w-4 h-4 text-dc-accent" />
            </div>
            <div>
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wider">Total Unlocked</p>
              <p className="text-xl font-bold text-dc-text">
                {totalUnlocked}<span className="text-sm text-dc-text-muted font-normal">/{totalCount}</span>
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${TIER_COLORS[currentTier]}18` }}
            >
              <Star className="w-4 h-4" style={{ color: TIER_COLORS[currentTier] }} />
            </div>
            <div>
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wider">Current Tier</p>
              <p className="text-xl font-bold capitalize" style={{ color: TIER_COLORS[currentTier] }}>
                {currentTier}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-dc-danger/15">
              <Flame className="w-4 h-4 text-dc-danger" />
            </div>
            <div>
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wider">Current Streak</p>
              <p className="text-xl font-bold text-dc-text">
                {streakDays} <span className="text-sm text-dc-text-muted font-normal">days</span>
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-dc-neon-green/15">
              <TrendingUp className="w-4 h-4 text-dc-neon-green" />
            </div>
            <div>
              <p className="text-[10px] text-dc-text-faint uppercase tracking-wider">XP Points</p>
              <p className="text-xl font-bold text-dc-neon-green">
                {xpPoints.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
              activeFilter === tab.value
                ? "bg-dc-accent/15 text-dc-accent border-dc-accent/30"
                : "bg-dc-surface/50 text-dc-text-muted border-dc-border hover:text-dc-text hover:bg-dc-surface-alt/60",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-dc-text-muted text-sm">No achievements in this category yet.</p>
        </Card>
      )}
    </div>
  );
}

// ── Achievement Card ──
function AchievementCard({ achievement }: { readonly achievement: Achievement }) {
  const tierColor = TIER_COLORS[achievement.tier];
  const isLocked = !achievement.unlocked;

  return (
    <Card
      hoverable
      className={clsx(
        "relative overflow-hidden transition-all duration-300",
        isLocked && "opacity-60 saturate-50",
      )}
    >
      {/* Tier accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${tierColor}00, ${tierColor}, ${tierColor}00)` }}
      />

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ backgroundColor: `${tierColor}12` }}
        >
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CardTitle className="text-sm truncate">{achievement.title}</CardTitle>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex-shrink-0"
              style={{
                color: tierColor,
                borderColor: `${tierColor}40`,
                backgroundColor: `${tierColor}12`,
              }}
            >
              {achievement.tier}
            </span>
          </div>

          <p className="text-xs text-dc-text-muted leading-relaxed mb-3">
            {achievement.description}
          </p>

          {/* Progress or Unlocked state */}
          {achievement.unlocked ? (
            <div className="flex items-center gap-2">
              <Badge variant="success" size="xs">Unlocked</Badge>
              {achievement.unlockedAt && (
                <span className="text-[10px] text-dc-text-faint">
                  {formatDate(achievement.unlockedAt)}
                </span>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-dc-text-faint">{achievement.requirement}</span>
                <span className="text-[10px] font-medium text-dc-text-muted mono">{achievement.progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${achievement.progress}%`,
                    background: `linear-gradient(90deg, ${tierColor}80, ${tierColor})`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
