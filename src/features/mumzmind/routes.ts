export const mumzMindRouteMap = {
  landing: "/",
  parent: "/parent",
  timeline: "/timeline",
  stage: "/stage",
  crm: "/crm",
  cart: "/cart",
  intelligence: "/cart/intelligence",
  deals: "/deals",
  brands: "/brands",
} as const;

export type MumzMindScreen = keyof typeof mumzMindRouteMap;

export const mumzMindNavLinks = [
  { href: "/", label: "Store" },
  { href: "/deals", label: "Deals" },
  { href: "/brands", label: "Brands" },
  { href: "/cart", label: "Cart" },
] as const;
