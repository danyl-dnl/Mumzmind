"use client";

import HeroLanding from "@/src/features/mumzmind/components/HeroLanding";
import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import { useMumzMindNavigate } from "@/src/features/mumzmind/useMumzMindNavigate";

export default function CartPage() {
  const onNavigate = useMumzMindNavigate();

  return (
    <MumzMindRouteFrame>
      {/* For now, HeroLanding still contains the Cart/Extension logic. 
          We'll refactor it shortly so HeroLanding at / is the Store, 
          and here it shows the Cart directly. */}
      <HeroLanding onNavigate={onNavigate} initialView="cart" />
    </MumzMindRouteFrame>
  );
}
