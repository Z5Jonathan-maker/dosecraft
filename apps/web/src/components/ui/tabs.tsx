"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";

interface Tab {
  readonly id: string;
  readonly label: string;
  readonly color?: string;
}

interface TabsProps {
  readonly tabs: readonly Tab[];
  readonly defaultTab?: string;
  readonly children: (activeTab: string) => ReactNode;
  readonly className?: string;
}

export function Tabs({ tabs, defaultTab, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <div className={className}>
      <div className="flex gap-1 p-1 bg-dc-surface rounded-lg mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              activeTab === tab.id
                ? "bg-dc-surface-alt text-dc-text shadow-sm"
                : "text-dc-text-muted hover:text-dc-text",
            )}
            style={
              activeTab === tab.id && tab.color
                ? { borderBottom: `2px solid ${tab.color}` }
                : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{children(activeTab)}</div>
    </div>
  );
}
