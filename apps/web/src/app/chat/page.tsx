"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Bot,
  User,
  Send,
} from "lucide-react";

/* ─── Types ─── */

interface ChatMessage {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly content: string;
  readonly timestamp: Date;
}

/* ─── AI Response Map ─── */

const AI_RESPONSES: ReadonlyArray<{ readonly pattern: RegExp; readonly response: string }> = [
  {
    pattern: /healing/i,
    response:
      "For healing, **BPC-157** is widely considered the gold standard. It promotes angiogenesis, protects the GI tract, and accelerates tendon/ligament repair. Many researchers combine it with **TB-500** for a synergistic healing effect.\n\n**Typical protocol:**\n- BPC-157: 250-500mcg/day SubQ\n- TB-500: 750mcg 2x/week SubQ\n- Duration: 4-8 weeks\n\nCheck the [Healing & Recovery](/learn) learning path for more details.",
  },
  {
    pattern: /reconstitut/i,
    response:
      "To reconstitute BPC-157:\n\n1. **Remove** the flip-off cap from the vial\n2. **Draw** 1-2mL of bacteriostatic water into a syringe\n3. **Inject** the water slowly down the side of the vial (never directly onto the powder)\n4. **Swirl** gently — never shake\n5. **Refrigerate** once reconstituted (stable for ~4 weeks)\n\nFor a 5mg vial with 2mL BAC water:\n- Concentration = 2,500mcg/mL\n- For a 250mcg dose, draw 10 units on a 100-unit insulin syringe\n\nUse our [Reconstitution Calculator](/calculator) for exact measurements.",
  },
  {
    pattern: /cjc.*sermorelin|sermorelin.*cjc/i,
    response:
      "**CJC-1295 (with DAC) vs Sermorelin:**\n\n| Feature | CJC-1295 | Sermorelin |\n|---------|----------|------------|\n| Half-life | ~8 days | ~10 minutes |\n| Dosing | 1-2x/week | Daily (before bed) |\n| GH pulse | Sustained elevation | Natural pulse pattern |\n| Cost | $$ | $ |\n| Side effects | Mild | Very mild |\n\n**Sermorelin** is better for beginners — it mimics natural GH release patterns. **CJC-1295** is more potent but less physiological.\n\nMany prefer **CJC-1295 (no DAC) + Ipamorelin** as a middle ground. See our [Blends](/blends) page for pre-mixed options.",
  },
  {
    pattern: /dose|dosing|how much/i,
    response:
      "Dosing depends on the specific compound. Here are some common ranges:\n\n- **BPC-157:** 250-500mcg/day\n- **TB-500:** 750mcg 2x/week\n- **CJC-1295/Ipa:** 100mcg each, 2x/day\n- **Semaglutide:** 0.25mg/week (titrate up)\n- **Testosterone Cyp:** 100-200mg/week IM\n\nAlways start at the lower end and titrate up. Use our [Dosage Calculator](/tools/dosage-calc) for exact syringe measurements.",
  },
  {
    pattern: /side effect|safety|danger/i,
    response:
      "Common side effects across peptides:\n\n- **Injection site:** Redness, itching, small bumps (normal, rotate sites)\n- **GH peptides:** Water retention, numbness/tingling, increased hunger\n- **BPC-157:** Very few reported side effects\n- **Semaglutide:** Nausea (dose-dependent), constipation\n- **TRT:** Acne, hair changes, estrogen conversion\n\n**Important:** Always get bloodwork before and during any protocol. Use our [Wellness Tracker](/wellness) to monitor how you feel.",
  },
  {
    pattern: /stack|combine|together/i,
    response:
      "Popular stacks by goal:\n\n**Healing:** BPC-157 + TB-500 + GHK-Cu\n**Performance:** CJC-1295/Ipa + MK-677 + BPC-157\n**Longevity:** Epithalon + NAD+ + Thymosin Alpha-1\n**Weight Loss:** Semaglutide + Tesamorelin + AOD-9604\n**Sleep:** DSIP + Epithalon + low-dose MK-677\n\nCheck our [Protocols](/protocols) page for pre-built expert stacks, or build your own with the [Protocol Builder](/protocols/builder).",
  },
];

const FALLBACK_RESPONSE =
  "I'm not sure about that specific topic yet. Try asking about healing peptides, reconstitution, dosing, side effects, or stacking protocols. You can also browse our [Library](/library) for detailed compound profiles.";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! I'm your PeptideAI assistant. I can help with questions about peptides, dosing protocols, reconstitution, side effects, and more. What would you like to know?",
  timestamp: new Date(),
};

const SUGGESTED_QUESTIONS = [
  "What's the best healing peptide?",
  "How do I reconstitute BPC-157?",
  "CJC-1295 vs Sermorelin?",
] as const;

/* ─── Markdown Renderer ─── */

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];
  let inTable = false;
  let listItems: string[] = [];
  let inList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1 my-2">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-dc-accent mt-0.5 flex-shrink-0">•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
    inList = false;
  };

  const flushTable = () => {
    if (tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {tableHeaders.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-3 py-1.5 text-dc-text font-medium border-b border-dc-border/50"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-1.5 text-dc-text-muted border-b border-dc-border/20"
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      tableHeaders = [];
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table row detection
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      // Separator row (|---|---|)
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        continue;
      }

      if (!inTable) {
        if (inList) flushList();
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    }

    if (inTable) flushTable();

    // Numbered list items
    if (/^\d+\.\s/.test(line.trim())) {
      if (inList) flushList();
      const content = line.trim().replace(/^\d+\.\s/, "");
      elements.push(
        <div key={`ol-${i}`} className="flex gap-2 text-sm my-1">
          <span className="text-dc-neon-cyan font-medium flex-shrink-0">
            {line.trim().match(/^\d+/)?.[0]}.
          </span>
          <span>{renderInline(content)}</span>
        </div>,
      );
      continue;
    }

    // Bullet list items
    if (line.trim().startsWith("- ")) {
      inList = true;
      listItems.push(line.trim().slice(2));
      continue;
    }

    if (inList) flushList();

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={`br-${i}`} className="h-2" />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed">
        {renderInline(line)}
      </p>,
    );
  }

  if (inList) flushList();
  if (inTable) flushTable();

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  // Process bold, links, and inline code
  const parts: React.ReactNode[] = [];
  // Pattern: **bold**, [text](url), `code`
  const regex = /(\*\*(.+?)\*\*)|(\[(.+?)\]\((.+?)\))|(`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-dc-text">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      // Link
      parts.push(
        <Link
          key={`a-${match.index}`}
          href={match[5]}
          className="text-dc-neon-cyan hover:underline"
        >
          {match[4]}
        </Link>,
      );
    } else if (match[6]) {
      // Inline code
      parts.push(
        <code
          key={`c-${match.index}`}
          className="px-1.5 py-0.5 rounded bg-dc-surface-alt text-dc-neon-green text-xs font-mono"
        >
          {match[7]}
        </code>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

/* ─── Typing Indicator ─── */

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-dc-neon-cyan/15 border border-dc-neon-cyan/30">
        <Bot className="w-4 h-4 text-dc-neon-cyan" />
      </div>
      <div className="glass rounded-2xl rounded-bl-md px-4 py-3 border border-dc-border/40">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-dc-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-dc-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-dc-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Chat Message Bubble ─── */

function MessageBubble({ message }: { readonly message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
          isUser
            ? "bg-dc-accent/15 border-dc-accent/30"
            : "bg-dc-neon-cyan/15 border-dc-neon-cyan/30"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-dc-accent" />
        ) : (
          <Bot className="w-4 h-4 text-dc-neon-cyan" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 border ${
          isUser
            ? "bg-dc-accent/15 border-dc-accent/25 rounded-2xl rounded-br-md text-dc-text"
            : "glass border-dc-border/40 rounded-2xl rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="text-dc-text-muted">{renderMarkdown(message.content)}</div>
        )}
        <p className="text-[9px] text-dc-text-faint mt-2 select-none">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function ChatPage() {
  const [messages, setMessages] = useState<readonly ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const findResponse = useCallback((query: string): string => {
    for (const entry of AI_RESPONSES) {
      if (entry.pattern.test(query)) {
        return entry.response;
      }
    }
    return FALLBACK_RESPONSE;
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      // Simulate AI thinking delay
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: findResponse(trimmed),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    },
    [isTyping, findResponse],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const hasOnlyWelcome = messages.length === 1 && messages[0].id === "welcome";

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,255,136,0.08) 100%)",
          }}
        >
          <MessageCircle className="w-5 h-5 text-dc-neon-cyan" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dc-text tracking-tight">
            Peptide<span className="text-dc-neon-cyan">AI</span> Assistant
          </h1>
          <p className="text-xs text-dc-text-muted">
            Ask anything about peptides, protocols, and dosing
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-dc-neon-green animate-pulse" />
          <span className="text-[10px] text-dc-text-faint uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 min-h-0 scrollbar-thin scrollbar-thumb-dc-border scrollbar-track-transparent"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Suggested Questions */}
      {hasOnlyWelcome && !isTyping && (
        <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0 animate-fade-in">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-dc-neon-cyan border border-dc-neon-cyan/25 bg-dc-neon-cyan/5 hover:bg-dc-neon-cyan/10 hover:border-dc-neon-cyan/40 transition-all duration-200"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="flex-shrink-0 glass rounded-2xl border border-dc-border/50 p-2 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about peptides, dosing, protocols..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-dc-text placeholder:text-dc-text-faint resize-none outline-none px-3 py-2 max-h-32 scrollbar-thin"
          style={{ minHeight: "2.25rem" }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-dc-accent/15 hover:bg-dc-accent/25 border border-dc-accent/30 text-dc-accent"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] text-dc-text-faint text-center mt-2 flex-shrink-0">
        AI responses are for educational purposes only — not medical advice.
      </p>
    </div>
  );
}
