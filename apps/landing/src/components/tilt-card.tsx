"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glowColor = "rgba(255, 107, 53, 0.15)",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const tiltX = (y - 0.5) * -maxTilt * 2;
    const tiltY = (x - 0.5) * maxTilt * 2;

    gsap.to(el, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });

    // Update glow position CSS variables
    el.style.setProperty("--glow-x", `${x * 100}%`);
    el.style.setProperty("--glow-y", `${y * 100}%`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;

    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    el.style.setProperty("--glow-x", "50%");
    el.style.setProperty("--glow-y", "50%");
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Radial glow that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor} 0%, transparent 60%)`,
          zIndex: 0,
          borderRadius: "inherit",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
