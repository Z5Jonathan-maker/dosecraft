"use client";

/*
  Lanes section now delegates to ParallaxLanes.
  Kept as a thin wrapper to preserve import structure.
*/

import ParallaxLanes from "./parallax-lanes";

export default function Lanes() {
  return <ParallaxLanes />;
}
