"use client";

import { useState, useMemo } from "react";
import {
  Newspaper,
  Search,
  Clock,
  ArrowRight,
  User,
  Calendar,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ─── Types ─── */

type ArticleCategory = "Guides" | "Research" | "Protocols" | "News" | "Safety";

interface Article {
  readonly id: number;
  readonly title: string;
  readonly excerpt: string;
  readonly author: string;
  readonly date: string;
  readonly readTime: string;
  readonly category: ArticleCategory;
  readonly featured: boolean;
}

/* ─── Data ─── */

const ARTICLES: readonly Article[] = [
  {
    id: 1,
    title: "The Complete Guide to BPC-157",
    excerpt: "Everything you need to know about the body protection compound: mechanisms, dosing, protocols, and what the research says.",
    author: "Dr. Marcus Reed",
    date: "Jan 15, 2026",
    readTime: "12 min read",
    category: "Guides",
    featured: true,
  },
  {
    id: 2,
    title: "CJC-1295 + Ipamorelin: The Gold Standard GH Stack",
    excerpt: "Why this combination remains the most popular growth hormone secretagogue stack and how to optimize your protocol.",
    author: "Leo Rex",
    date: "Feb 3, 2026",
    readTime: "8 min read",
    category: "Protocols",
    featured: false,
  },
  {
    id: 3,
    title: "Understanding FDA Status: What It Means for Peptides",
    excerpt: "A breakdown of regulatory classifications and what they mean for researchers and patients.",
    author: "DoseCraft Team",
    date: "Feb 10, 2026",
    readTime: "6 min read",
    category: "Research",
    featured: false,
  },
  {
    id: 4,
    title: "TRT 101: Getting Started with Testosterone Replacement",
    excerpt: "A comprehensive introduction to TRT: protocols, bloodwork, estrogen management, and common mistakes.",
    author: "Jay Campbell",
    date: "Jan 28, 2026",
    readTime: "15 min read",
    category: "Guides",
    featured: false,
  },
  {
    id: 5,
    title: "5 Common Reconstitution Mistakes",
    excerpt: "Avoid these errors that can destroy your peptides or create safety risks.",
    author: "Tristan Huseby",
    date: "Feb 18, 2026",
    readTime: "5 min read",
    category: "Safety",
    featured: false,
  },
  {
    id: 6,
    title: "Peptide Stacking: Principles and Popular Combinations",
    excerpt: "Learn the science behind combining peptides for synergistic effects.",
    author: "Vincent Luzzolino",
    date: "Mar 1, 2026",
    readTime: "10 min read",
    category: "Protocols",
    featured: false,
  },
  {
    id: 7,
    title: "The Future of GLP-1 Agonists",
    excerpt: "Semaglutide, Tirzepatide, and the next generation of metabolic peptides reshaping medicine.",
    author: "DoseCraft Team",
    date: "Feb 25, 2026",
    readTime: "7 min read",
    category: "News",
    featured: false,
  },
  {
    id: 8,
    title: "Injection Technique: SubQ vs IM Explained",
    excerpt: "When to use subcutaneous vs intramuscular injections, proper technique, and site selection.",
    author: "Justin Mihaly",
    date: "Feb 12, 2026",
    readTime: "6 min read",
    category: "Safety",
    featured: false,
  },
] as const;

const CATEGORIES: readonly ("All" | ArticleCategory)[] = [
  "All",
  "Guides",
  "Research",
  "Protocols",
  "News",
  "Safety",
] as const;

/* ─── Helpers ─── */

const CATEGORY_CONFIG: Record<ArticleCategory, { color: string; variant: "success" | "warning" | "danger" | "clinical" | "expert" }> = {
  Guides:    { color: "#00d4ff", variant: "clinical" },
  Research:  { color: "#b366ff", variant: "experimental" as never },
  Protocols: { color: "#ff6b35", variant: "expert" },
  News:      { color: "#00ff88", variant: "success" },
  Safety:    { color: "#ff4444", variant: "danger" },
};

function showToast(message: string) {
  if (typeof window === "undefined") return;
  const el = document.createElement("div");
  el.textContent = message;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(30,30,40,0.95)",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    zIndex: "9999",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

/* ─── Featured Article Card ─── */

function FeaturedCard({ article }: { readonly article: Article }) {
  const cfg = CATEGORY_CONFIG[article.category];

  return (
    <Card
      hoverable
      className="relative overflow-hidden cursor-pointer"
      onClick={() => showToast("Full articles coming soon!")}
      style={{
        background: "linear-gradient(135deg, rgba(255,107,53,0.06) 0%, rgba(0,212,255,0.04) 100%)",
        border: "1px solid rgba(255,107,53,0.25)",
      }}
    >
      {/* Gradient top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${cfg.color}, #ff6b35, #b366ff)`,
        }}
      />

      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="warning" size="xs">Featured</Badge>
          <Badge variant={cfg.variant} size="xs">{article.category}</Badge>
        </div>

        <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
        <p className="text-sm text-dc-text-muted leading-relaxed mb-4">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-dc-text-faint">
            <span className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>
          <span
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:brightness-125"
            style={{ color: cfg.color }}
          >
            Read <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ─── Article Card ─── */

function ArticleCard({ article }: { readonly article: Article }) {
  const cfg = CATEGORY_CONFIG[article.category];

  return (
    <Card
      hoverable
      noPad
      className="overflow-hidden cursor-pointer transition-all duration-300"
      onClick={() => showToast("Full articles coming soon!")}
    >
      <div className="flex">
        {/* Color accent bar */}
        <div
          className="w-1 flex-shrink-0 rounded-l-2xl"
          style={{ backgroundColor: cfg.color }}
        />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-sm leading-snug">{article.title}</CardTitle>
            <Badge variant={cfg.variant} size="xs" className="flex-shrink-0">
              {article.category}
            </Badge>
          </div>

          <p className="text-xs text-dc-text-muted leading-relaxed mb-3 line-clamp-2">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-dc-text-faint">
              <span className="flex items-center gap-1">
                <User className="w-2.5 h-2.5" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {article.readTime}
              </span>
            </div>
            <span
              className="flex items-center gap-1 text-[11px] font-semibold"
              style={{ color: cfg.color }}
            >
              Read <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── Page ─── */

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<"All" | ArticleCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featured = ARTICLES.find((a) => a.featured);
  const nonFeatured = ARTICLES.filter((a) => !a.featured);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return nonFeatured.filter((article) => {
      const matchesCategory = activeCategory === "All" || article.category === activeCategory;
      const matchesSearch =
        query === "" ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, nonFeatured]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(179,102,255,0.08) 100%)",
          }}
        >
          <Newspaper className="w-5.5 h-5.5 text-dc-accent" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dc-text tracking-tight">Research Blog</h1>
          <p className="text-sm text-dc-text-muted">Articles, guides, and deep dives on peptide science</p>
        </div>
      </div>

      {/* Featured Article */}
      {featured && <FeaturedCard article={featured} />}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dc-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-dc-text placeholder:text-dc-text-muted/40 bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all duration-200"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const color = cat === "All" ? "#fff" : CATEGORY_CONFIG[cat].color;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                style={
                  isActive
                    ? {
                        backgroundColor: `${color}18`,
                        borderColor: `${color}40`,
                        color,
                      }
                    : {
                        backgroundColor: "transparent",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.4)",
                      }
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Article Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-sm text-dc-text-muted">No articles found matching your search.</p>
        </Card>
      )}
    </div>
  );
}
