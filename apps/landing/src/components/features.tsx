"use client";

/*
  Features section now delegates to HorizontalScroll.
  Kept as a thin wrapper to preserve import structure.
*/

import HorizontalScroll from "./horizontal-scroll";

export default function Features() {
  return <HorizontalScroll />;
}
