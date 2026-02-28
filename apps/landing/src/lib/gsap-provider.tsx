"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface GSAPContextValue {
  lenis: Lenis | null;
  isReady: boolean;
}

const GSAPContext = createContext<GSAPContextValue>({
  lenis: null,
  isReady: false,
});

export function useGSAPContext() {
  return useContext(GSAPContext);
}

export function GSAPProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    /* Respect reduced motion */
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setIsReady(true);
      return;
    }

    /* Initialize Lenis smooth scroll */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    /* Connect Lenis to GSAP ScrollTrigger */
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    setIsReady(true);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(lenis.raf as never);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <GSAPContext.Provider value={{ lenis: lenisRef.current, isReady }}>
      {children}
    </GSAPContext.Provider>
  );
}
