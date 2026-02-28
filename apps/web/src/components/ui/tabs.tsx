"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";

interface Tab {
  readonly id: string;
  readonly label: string;
  readonly color?: string;
  readonly icon?: ReactNode;
  readonly count?: number;
}

interface TabsProps {
  readonly tabs: readonly Tab[];
  readonly defaultTab?: string;
  readonly children: (activeTab: string) => ReactNode;
  readonly className?: string;
  readonly variant?: "pills" | "underline";
}

export function Tabs({ tabs, defaultTab, children, className, variant = "pills" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <div className={className}>
      {variant === "pills" ? (
        <div className="flex gap-1 p-1 bg-dc-surface rounded-xl mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                activeTab === tab.id
                  ? "bg-dc-surface-alt text-dc-text shadow-sm"
                  : "text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt/50",
              )}
              style={
                activeTab === tab.id && tab.color
                  ? { color: tab.color }
                  : undefined
              }
            >
              {tab.icon && <span className="opacity-75">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    "ml-1 px-1.5 py-0.5 text-[10px] rounded-full",
                    activeTab === tab.id ? "bg-dc-border text-dc-text" : "bg-dc-border/50 text-dc-text-muted",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex border-b border-dc-border mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-current text-dc-text"
                  : "border-transparent text-dc-text-muted hover:text-dc-text hover:border-dc-border",
              )}
              style={activeTab === tab.id && tab.color ? { color: tab.color, borderColor: tab.color } : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div>{children(activeTab)}</div>
    </div>
  );
}
