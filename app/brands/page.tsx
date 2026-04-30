"use client";

import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import SimplePlaceholder from "@/src/features/mumzmind/components/SimplePlaceholder";

export default function BrandsPage() {
  return (
    <MumzMindRouteFrame>
      <SimplePlaceholder 
        title="Premium Brands" 
        message="Discover the brands that parents trust. We're partnering with the world's leading names in baby care to bring you the best." 
      />
    </MumzMindRouteFrame>
  );
}
