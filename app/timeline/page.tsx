"use client";

import TimelineScreen from "@/src/features/mumzmind/components/TimelineScreen";
import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import { useMumzMindNavigate } from "@/src/features/mumzmind/useMumzMindNavigate";

export default function TimelinePage() {
  const onNavigate = useMumzMindNavigate();

  return (
    <MumzMindRouteFrame>
      <TimelineScreen onNavigate={onNavigate} />
    </MumzMindRouteFrame>
  );
}
