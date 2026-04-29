"use client";

import ParentApp from "@/src/features/mumzmind/components/ParentApp";
import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import { useMumzMindNavigate } from "@/src/features/mumzmind/useMumzMindNavigate";

export default function ParentPage() {
  const onNavigate = useMumzMindNavigate();

  return (
    <MumzMindRouteFrame>
      <ParentApp onNavigate={onNavigate} />
    </MumzMindRouteFrame>
  );
}
