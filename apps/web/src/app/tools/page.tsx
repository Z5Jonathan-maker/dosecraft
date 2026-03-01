"use client";

import Link from "next/link";
import {
  Calculator,
  AlertTriangle,
  GitCompareArrows,
  ShieldCheck,
  Layers,
  DollarSign,
  Wrench,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

const TOOLS = [
  {
    title: "Reconstitution Calculator",
    description: "Calculate peptide reconstitution volumes, concentrations, and syringe doses with precision.",
    href: "/calculator",
    icon: Calculator,
    color: "#ffaa00",
  },
  {
    title: "Interaction Checker",
    description: "Check for synergies, conflicts, and timing recommendations between 2-5 compounds.",
    href: "/tools/interactions",
    icon: AlertTriangle,
    color: "#00ff88",
  },
  {
    title: "Peptide Comparison",
    description: "Compare 2-3 peptides side-by-side with radar charts, dosing data, and recommendations.",
    href: "/tools/compare",
    icon: GitCompareArrows,
    color: "#00d4ff",
  },
  {
    title: "FDA Status Tracker",
    description: "Track regulatory status, clinical trial progress, and approval timelines for all compounds.",
    href: "/fda-tracker",
    icon: ShieldCheck,
    color: "#b366ff",
  },
  {
    title: "Cost Comparison",
    description: "Compare estimated monthly costs across research vendors, compounding pharmacies, and telehealth clinics.",
    href: "/tools/pricing",
    icon: DollarSign,
    color: "#00ff88",
  },
  {
    title: "Protocol Builder",
    description: "Build custom protocols with AI-powered suggestions, dose configurations, and scheduling.",
    href: "/protocols/builder",
    icon: Layers,
    color: "#ff6b35",
  },
] as const;

export default function ToolsHubPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(179,102,255,0.1) 100%)" }}
        >
          <Wrench className="w-5 h-5 text-dc-neon-cyan" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-dc-text leading-none">Tools</h1>
          <p className="text-xs text-dc-text-muted mt-0.5">Calculators, checkers, and comparison utilities</p>
        </div>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card hoverable className="h-full group cursor-pointer">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: `${tool.color}15`,
                    boxShadow: `0 0 20px ${tool.color}10`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: tool.color }} />
                </div>
                <CardTitle className="mb-2 text-sm">{tool.title}</CardTitle>
                <p className="text-xs text-dc-text-muted leading-relaxed">{tool.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
