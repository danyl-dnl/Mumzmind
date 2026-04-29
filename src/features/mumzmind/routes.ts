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
  { href: "/timeline", label: "Timeline" },
  { href: "/stage", label: "Stage Detail" },
  { href: "/crm", label: "CRM Dashboard" },
] as const;
