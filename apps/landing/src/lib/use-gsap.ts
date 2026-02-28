"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook wrapping a GSAP context for safe cleanup.
 * `callback` receives the container ref element.
 * All GSAP instances created inside are auto-cleaned on unmount.
 */
export function useGSAP(
  callback: (container: HTMLElement) => void,
  deps: unknown[] = []
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      callback(containerRef.current!);
    }, containerRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
