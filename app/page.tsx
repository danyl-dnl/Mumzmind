"use client";

import HeroLanding from "@/src/features/mumzmind/components/HeroLanding";
import MumzMindRouteFrame from "@/src/features/mumzmind/components/MumzMindRouteFrame";
import { useMumzMindNavigate } from "@/src/features/mumzmind/useMumzMindNavigate";

import { useState, useEffect } from "react";
import LoadingScreen from "@/src/features/mumzmind/components/LoadingScreen";

export default function Home() {
  const onNavigate = useMumzMindNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Check if we've already shown the splash in this session
    const wasLoaded = sessionStorage.getItem("mumzmind_splash_loaded");
    if (wasLoaded) {
      setIsLoading(false);
    }
    setHasStarted(true);
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("mumzmind_splash_loaded", "true");
    setIsLoading(false);
  };

  // Prevent flash of content/loader before session check
  if (!hasStarted) return null;

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <MumzMindRouteFrame>
      <HeroLanding onNavigate={onNavigate} />
    </MumzMindRouteFrame>
  );
}
