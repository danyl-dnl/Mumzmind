"use client";

import CRMDashboard from "@/src/features/mumzmind/components/CRMDashboard";
import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import { useMumzMindNavigate } from "@/src/features/mumzmind/useMumzMindNavigate";

export default function CrmPage() {
  const onNavigate = useMumzMindNavigate();

  return (
    <MumzMindRouteFrame>
      <CRMDashboard onNavigate={onNavigate} />
    </MumzMindRouteFrame>
  );
}
