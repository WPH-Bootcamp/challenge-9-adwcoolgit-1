export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => ["auth", "session"] as const,
    profile: () => ["auth", "profile"] as const,
  },
  restaurants: {
    all: ["restaurants"] as const,
    lists: () => ["restaurants", "list"] as const,
    list: (params: Record<string, string | number | undefined>) =>
      ["restaurants", "list", params] as const,
    sections: () => ["restaurants", "sections"] as const,
    recommended: () => ["restaurants", "sections", "recommended"] as const,
    bestSeller: () => ["restaurants", "sections", "best-seller"] as const,
    nearby: () => ["restaurants", "sections", "nearby"] as const,
    detail: (restaurantId: string | number) => ["restaurants", "detail", restaurantId] as const,
  },
  cart: {
    all: ["cart"] as const,
    current: () => ["cart", "current"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params?: Record<string, string | number | undefined>) =>
      ["orders", "list", params ?? {}] as const,
  },
} as const;
