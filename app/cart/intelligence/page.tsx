"use client";

import HeroLanding from "@/src/features/mumzmind/components/HeroLanding";
import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import { useMumzMindNavigate } from "@/src/features/mumzmind/useMumzMindNavigate";

export default function IntelligencePage() {
  const onNavigate = useMumzMindNavigate();

  return (
    <MumzMindRouteFrame>
      <HeroLanding onNavigate={onNavigate} initialView="extension" />
    </MumzMindRouteFrame>
  );
}
