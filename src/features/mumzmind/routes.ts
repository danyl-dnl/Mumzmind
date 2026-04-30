export const mumzMindRouteMap = {
  landing: "/",
  parent: "/parent",
  timeline: "/timeline",
  stage: "/stage",
  crm: "/crm",
} as const;

export type MumzMindScreen = keyof typeof mumzMindRouteMap;

export const mumzMindNavLinks = [
  { href: "/", label: "Home" },
  { href: "/parent", label: "Parent Feed" },
  { href: "/timeline", label: "Baby Timeline" },
  { href: "/stage", label: "Next Chapter" },
  { href: "/crm", label: "CRM View" },
] as const;
