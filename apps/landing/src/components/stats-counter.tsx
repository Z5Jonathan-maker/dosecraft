"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 5000, suffix: "+", label: "Peptide Data Points" },
  { value: 3, suffix: "", label: "Evidence Lanes" },
  { value: 1, suffix: "", prefix: "AI", label: "Protocol Engine" },
  { value: 0, suffix: "", prefix: "Zero", label: "Corporate BS" },
];

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const counters =
        gsap.utils.toArray<HTMLElement>(".stat-number");

      counters.forEach((counter) => {
        const target = parseInt(counter.dataset.target || "0", 10);
        const suffix = counter.dataset.suffix || "";
        const prefix = counter.dataset.prefix || "";

        if (prefix && target === 0) {
          /* Static text stats like "Zero" */
          counter.textContent = prefix;

          if (!prefersReduced) {
            gsap.fromTo(
              counter,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                  trigger: counter,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
          return;
        }

        if (prefix) {
          counter.textContent = prefix;

          if (!prefersReduced) {
            gsap.fromTo(
              counter,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                  trigger: counter,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
          return;
        }

        if (prefersReduced) {
          counter.textContent = target.toLocaleString() + suffix;
          return;
        }

        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            counter.textContent =
              Math.floor(obj.val).toLocaleString() + suffix;
          },
        });
      });

      /* Glow pulse on the container */
      if (!prefersReduced) {
        gsap.utils.toArray<HTMLElement>(".stat-item").forEach((item, i) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: i * 0.1,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 px-4">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-dc-orange/[0.06] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-dc-cyan/[0.05] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="stat-item text-center py-8 px-4 glass-card relative overflow-hidden group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-dc-orange/5 to-transparent" />

              <div
                className="stat-number text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space)] text-dc-text mb-2 stat-glow"
                data-target={stat.value}
                data-suffix={stat.suffix}
                data-prefix={stat.prefix || ""}
              >
                {stat.prefix || "0"}
              </div>

              <p className="text-dc-text-muted text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
