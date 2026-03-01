"use client";

import { useState } from "react";
import {
  GraduationCap,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Lock,
  Trophy,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ─── Types ─── */

type LessonStatus = "completed" | "in-progress" | "locked";

interface Lesson {
  readonly title: string;
  readonly status: LessonStatus;
}

interface LearningPath {
  readonly id: string;
  readonly title: string;
  readonly difficulty: "Beginner" | "Intermediate" | "Advanced";
  readonly color: string;
  readonly lessonCount: number;
  readonly estimatedHours: number;
  readonly progress: number;
  readonly lessons: readonly Lesson[];
}

/* ─── Data ─── */

const LEARNING_PATHS: readonly LearningPath[] = [
  {
    id: "peptide-fundamentals",
    title: "Peptide Fundamentals",
    difficulty: "Beginner",
    color: "#00d4ff",
    lessonCount: 6,
    estimatedHours: 2,
    progress: 50,
    lessons: [
      { title: "What Are Peptides?", status: "completed" },
      { title: "How Peptides Work in the Body", status: "completed" },
      { title: "Routes of Administration", status: "completed" },
      { title: "Understanding Evidence Lanes", status: "in-progress" },
      { title: "Reading Research Papers", status: "locked" },
      { title: "Safety & Side Effects", status: "locked" },
    ],
  },
  {
    id: "gh-optimization",
    title: "Growth Hormone Optimization",
    difficulty: "Intermediate",
    color: "#ff6b35",
    lessonCount: 5,
    estimatedHours: 3,
    progress: 40,
    lessons: [
      { title: "GH Secretagogues Overview", status: "completed" },
      { title: "CJC-1295 + Ipamorelin Deep Dive", status: "completed" },
      { title: "Timing & Stacking for GH", status: "in-progress" },
      { title: "MK-677 vs Injectable GHRPs", status: "locked" },
      { title: "Lab Work & Monitoring", status: "locked" },
    ],
  },
  {
    id: "trt-hormonal",
    title: "TRT & Hormonal Health",
    difficulty: "Intermediate",
    color: "#ffaa00",
    lessonCount: 5,
    estimatedHours: 2.5,
    progress: 20,
    lessons: [
      { title: "Testosterone Basics", status: "completed" },
      { title: "TRT Protocols & Dosing", status: "in-progress" },
      { title: "Estrogen Management", status: "locked" },
      { title: "HCG & Fertility Preservation", status: "locked" },
      { title: "Blood Work Interpretation", status: "locked" },
    ],
  },
  {
    id: "healing-recovery",
    title: "Healing & Recovery",
    difficulty: "Intermediate",
    color: "#00ff88",
    lessonCount: 4,
    estimatedHours: 1.5,
    progress: 100,
    lessons: [
      { title: "BPC-157: The Healing Peptide", status: "completed" },
      { title: "TB-500 & Tissue Repair", status: "completed" },
      { title: "GHK-Cu for Skin & Joints", status: "completed" },
      { title: "Building a Healing Stack", status: "completed" },
    ],
  },
  {
    id: "advanced-protocols",
    title: "Advanced Protocols",
    difficulty: "Advanced",
    color: "#b366ff",
    lessonCount: 5,
    estimatedHours: 4,
    progress: 0,
    lessons: [
      { title: "Multi-Peptide Stacking Principles", status: "locked" },
      { title: "Cycling & Periodization", status: "locked" },
      { title: "Reconstitution Mastery", status: "locked" },
      { title: "Injection Technique & Site Rotation", status: "locked" },
      { title: "Building Your Own Protocol", status: "locked" },
    ],
  },
  {
    id: "longevity-antiaging",
    title: "Longevity & Anti-Aging",
    difficulty: "Advanced",
    color: "#ff4444",
    lessonCount: 4,
    estimatedHours: 3,
    progress: 0,
    lessons: [
      { title: "Telomere Biology & Epithalon", status: "locked" },
      { title: "NAD+ & Cellular Energy", status: "locked" },
      { title: "Semax & Cognitive Enhancement", status: "locked" },
      { title: "The Longevity Stack", status: "locked" },
    ],
  },
] as const;

/* ─── Helpers ─── */

const DIFFICULTY_BADGE: Record<
  LearningPath["difficulty"],
  { variant: "success" | "warning" | "danger"; label: string }
> = {
  Beginner: { variant: "success", label: "Beginner" },
  Intermediate: { variant: "warning", label: "Intermediate" },
  Advanced: { variant: "danger", label: "Advanced" },
};

function computeStats(paths: readonly LearningPath[]) {
  const started = paths.filter((p) => p.progress > 0).length;
  const lessonsCompleted = paths.reduce(
    (sum, p) => sum + p.lessons.filter((l) => l.status === "completed").length,
    0,
  );
  const totalLessons = paths.reduce((sum, p) => sum + p.lessons.length, 0);
  const hoursSpent = paths.reduce(
    (sum, p) => sum + (p.estimatedHours * p.progress) / 100,
    0,
  );
  return { started, total: paths.length, lessonsCompleted, totalLessons, hoursSpent };
}

function LessonStatusIcon({ status }: { readonly status: LessonStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-dc-neon-green flex-shrink-0" />;
    case "in-progress":
      return <PlayCircle className="w-4 h-4 text-dc-warning flex-shrink-0" />;
    case "locked":
      return <Lock className="w-3.5 h-3.5 text-dc-text-faint flex-shrink-0" />;
  }
}

/* ─── Path Card ─── */

function PathCard({ path }: { readonly path: LearningPath }) {
  const [expanded, setExpanded] = useState(false);
  const badge = DIFFICULTY_BADGE[path.difficulty];
  const currentLesson = path.lessons.find((l) => l.status === "in-progress");

  const buttonLabel =
    path.progress === 100
      ? "Completed"
      : path.progress > 0
        ? "Continue"
        : "Start";

  return (
    <Card
      hoverable
      noPad
      className="overflow-hidden transition-all duration-300"
    >
      <div className="flex">
        {/* Color accent bar */}
        <div
          className="w-1 flex-shrink-0 rounded-l-2xl"
          style={{ backgroundColor: path.color }}
        />

        <div className="flex-1 p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="mb-1.5">{path.title}</CardTitle>
              <div className="flex items-center gap-3 text-xs text-dc-text-muted">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {path.lessonCount} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {path.estimatedHours}h
                </span>
              </div>
            </div>
            <Badge variant={badge.variant} size="xs">
              {badge.label}
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-dc-text-muted uppercase tracking-wider">
                Progress
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: path.color }}
              >
                {path.progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${path.progress}%`,
                  backgroundColor: path.color,
                  boxShadow: path.progress > 0 ? `0 0 8px ${path.color}60` : "none",
                }}
              />
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs text-dc-text-muted hover:text-dc-text transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              {expanded ? "Hide lessons" : "Show lessons"}
            </button>

            {path.progress === 100 ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-dc-neon-green">
                <Trophy className="w-3.5 h-3.5" />
                {buttonLabel}
              </span>
            ) : (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:brightness-110"
                style={{
                  backgroundColor: `${path.color}18`,
                  color: path.color,
                  border: `1px solid ${path.color}30`,
                }}
              >
                {path.progress > 0 ? (
                  <Flame className="w-3 h-3" />
                ) : (
                  <ArrowRight className="w-3 h-3" />
                )}
                {buttonLabel}
              </button>
            )}
          </div>

          {/* Expandable lesson list */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-dc-border/40 space-y-1">
              {path.lessons.map((lesson, idx) => {
                const isCurrent = lesson.status === "in-progress";
                return (
                  <div
                    key={lesson.title}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isCurrent
                        ? "bg-dc-surface-alt border border-dc-border/60"
                        : "hover:bg-white/[0.02]"
                    }`}
                    style={
                      isCurrent
                        ? { borderColor: `${path.color}40` }
                        : undefined
                    }
                  >
                    <span className="text-[10px] text-dc-text-faint font-mono w-4 text-right flex-shrink-0">
                      {idx + 1}
                    </span>
                    <LessonStatusIcon status={lesson.status} />
                    <span
                      className={`text-sm ${
                        lesson.status === "locked"
                          ? "text-dc-text-faint"
                          : lesson.status === "completed"
                            ? "text-dc-text-muted"
                            : "text-dc-text font-medium"
                      }`}
                    >
                      {lesson.title}
                    </span>
                    {isCurrent && (
                      <Badge
                        variant="warning"
                        size="xs"
                        className="ml-auto"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ─── Page ─── */

export default function LearnPage() {
  const stats = computeStats(LEARNING_PATHS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(179,102,255,0.08) 100%)",
          }}
        >
          <GraduationCap className="w-5.5 h-5.5 text-dc-neon-cyan" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dc-text tracking-tight">
            Learning Paths
          </h1>
          <p className="text-sm text-dc-text-muted">
            Master peptide science with structured courses
          </p>
        </div>
      </div>

      {/* My Progress Summary */}
      <Card className="!p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-dc-warning" />
          <span className="text-xs font-semibold text-dc-text uppercase tracking-wider">
            My Progress
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-dc-text">
              {stats.started}
              <span className="text-sm font-normal text-dc-text-muted">
                /{stats.total}
              </span>
            </p>
            <p className="text-[10px] text-dc-text-faint uppercase tracking-wider mt-0.5">
              Paths Started
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-dc-neon-green">
              {stats.lessonsCompleted}
              <span className="text-sm font-normal text-dc-text-muted">
                /{stats.totalLessons}
              </span>
            </p>
            <p className="text-[10px] text-dc-text-faint uppercase tracking-wider mt-0.5">
              Lessons Done
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-dc-neon-cyan">
              {stats.hoursSpent.toFixed(1)}h
            </p>
            <p className="text-[10px] text-dc-text-faint uppercase tracking-wider mt-0.5">
              Time Invested
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-dc-accent">
              {Math.round(
                (stats.lessonsCompleted / stats.totalLessons) * 100,
              )}
              %
            </p>
            <p className="text-[10px] text-dc-text-faint uppercase tracking-wider mt-0.5">
              Overall Mastery
            </p>
          </div>
        </div>
      </Card>

      {/* Path Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {LEARNING_PATHS.map((path) => (
          <PathCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
}
