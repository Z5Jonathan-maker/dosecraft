"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, Layers, CheckCircle2, Star } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { ProtocolCard } from "@/components/protocol/protocol-card";
import { MOCK_CREATORS, MOCK_PROTOCOLS } from "@/lib/mock-data";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export default function CreatorProfilePage({ params }: PageProps) {
  const { slug } = use(params);
  const creator = MOCK_CREATORS.find((c) => c.slug === slug);

  if (!creator) {
    notFound();
  }

  const creatorProtocols = MOCK_PROTOCOLS.filter((p) => p.creatorId === creator.id);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/creators"
          className="flex items-center gap-1.5 text-sm text-dc-text-muted hover:text-dc-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Creators
        </Link>
        <span className="text-dc-text-faint">/</span>
        <span className="text-sm text-dc-text">{creator.name}</span>
      </div>

      {/* Hero */}
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: `${creator.accentColor}20`, color: creator.accentColor }}
          >
            {creator.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-dc-text">{creator.name}</h1>
              {creator.verified && <CheckCircle2 className="w-5 h-5 text-dc-neon-green" />}
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: creator.accentColor }}>
              {creator.specialty}
            </p>
            <p className="text-xs text-dc-text-muted mb-4">{creator.credentials}</p>
            <p className="text-dc-text-muted leading-relaxed">{creator.bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-dc-border/40">
          <div className="text-center">
            <p className="text-xl font-bold text-dc-text">{creator.followers.toLocaleString()}</p>
            <p className="text-[10px] text-dc-text-muted uppercase tracking-wide mt-0.5 flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> Followers
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: creator.accentColor }}>{creatorProtocols.length}</p>
            <p className="text-[10px] text-dc-text-muted uppercase tracking-wide mt-0.5 flex items-center justify-center gap-1">
              <Layers className="w-3 h-3" /> Protocols
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-dc-warning">
              {creatorProtocols.length > 0
                ? (creatorProtocols.reduce((sum, p) => sum + (p.rating ?? 0), 0) / creatorProtocols.filter((p) => p.rating).length).toFixed(1)
                : "—"}
            </p>
            <p className="text-[10px] text-dc-text-muted uppercase tracking-wide mt-0.5 flex items-center justify-center gap-1">
              <Star className="w-3 h-3" /> Avg Rating
            </p>
          </div>
        </div>
      </div>

      {/* Protocols */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4" style={{ color: creator.accentColor }} />
          <h2 className="text-base font-semibold text-dc-text">Protocols by {creator.name}</h2>
        </div>
        {creatorProtocols.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creatorProtocols.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-dc-text-muted text-center py-8">
              No protocols published yet. Check back soon.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
