"use client";

import StageDetail from "@/src/features/mumzmind/components/StageDetail";
import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import { useMumzMindNavigate } from "@/src/features/mumzmind/useMumzMindNavigate";

export default function StagePage() {
  const onNavigate = useMumzMindNavigate();

  return (
    <MumzMindRouteFrame>
      <StageDetail onNavigate={onNavigate} />
    </MumzMindRouteFrame>
  );
}
