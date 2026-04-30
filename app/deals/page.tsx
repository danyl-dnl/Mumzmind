"use client";

import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import SimplePlaceholder from "@/src/features/mumzmind/components/SimplePlaceholder";

export default function DealsPage() {
  return (
    <MumzMindRouteFrame>
      <SimplePlaceholder 
        title="Exclusive Deals" 
        message="We're curating the best offers for you and your baby. Check back soon for premium discounts from Mumzworld and more." 
      />
    </MumzMindRouteFrame>
  );
}
