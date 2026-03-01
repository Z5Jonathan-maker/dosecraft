"use client";

import Link from "next/link";
import { Star, Users, Layers, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MOCK_CREATORS, MOCK_PROTOCOLS } from "@/lib/mock-data";

export default function CreatorsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-dc-warning" />
          <h2 className="text-sm font-medium text-dc-warning">Expert Creators</h2>
        </div>
        <p className="text-dc-text-muted text-sm">
          {MOCK_CREATORS.length} verified experts &middot; Real protocols from real practitioners
        </p>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_CREATORS.map((creator) => {
          const creatorProtocols = MOCK_PROTOCOLS.filter((p) => p.creatorId === creator.id);

          return (
            <Link key={creator.id} href={`/creators/${creator.slug}`} className="block group">
              <Card hoverable className="h-full">
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                    style={{ background: `${creator.accentColor}20`, color: creator.accentColor }}
                  >
                    {creator.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-dc-text group-hover:text-dc-accent transition-colors truncate">
                        {creator.name}
                      </h3>
                      {creator.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: creator.accentColor }} />
                      )}
                      <ArrowUpRight className="w-3.5 h-3.5 text-dc-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <p className="text-[10px] text-dc-text-muted">{creator.credentials}</p>
                    <p className="text-[10px] font-medium" style={{ color: creator.accentColor }}>
                      {creator.specialty}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-dc-text-muted leading-relaxed mb-4 line-clamp-2">
                  {creator.bio}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-[10px] text-dc-text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {creator.followers.toLocaleString()} followers
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {creatorProtocols.length} protocols
                  </span>
                </div>

                {/* Protocol previews */}
                {creatorProtocols.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {creatorProtocols.slice(0, 3).map((p) => (
                      <span
                        key={p.id}
                        className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-dc-surface-alt/60 text-dc-text-muted border border-dc-border/40"
                      >
                        {p.hookTitle}
                      </span>
                    ))}
                    {creatorProtocols.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-medium text-dc-text-muted">
                        +{creatorProtocols.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
