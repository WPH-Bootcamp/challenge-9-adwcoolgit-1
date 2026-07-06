import type { DiscoveryState, RestaurantCard } from "@/types/domain";

import type {
  RestaurantListParams,
  RestaurantSearchParams,
} from "@/lib/api/restaurants";

const DEFAULT_PAGE = "1";
const DEFAULT_LIMIT = "12";

export const defaultDiscoveryState: DiscoveryState = {
  q: "",
  category: "",
  rating: "",
  priceMin: "",
  priceMax: "",
  range: "",
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
};

type SearchParamRecord = Record<string, string | string[] | undefined>;

type SearchParamSource =
  | URLSearchParams
  | {
      get?: (key: string) => string | null;
    }
  | SearchParamRecord;

function readSearchParam(source: SearchParamSource, key: keyof DiscoveryState) {
  if (typeof source === "object" && source !== null && typeof source.get === "function") {
    return source.get(key) ?? "";
  }

  const value = (source as SearchParamRecord)[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function normalizePositiveInteger(value: string, fallback: string) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return String(parsed);
}

export function parseDiscoveryState(source: SearchParamSource): DiscoveryState {
  return {
    q: readSearchParam(source, "q").trim(),
    category: readSearchParam(source, "category").trim(),
    rating: readSearchParam(source, "rating").trim(),
    priceMin: readSearchParam(source, "priceMin").trim(),
    priceMax: readSearchParam(source, "priceMax").trim(),
    range: readSearchParam(source, "range").trim(),
    page: normalizePositiveInteger(readSearchParam(source, "page"), DEFAULT_PAGE),
    limit: normalizePositiveInteger(readSearchParam(source, "limit"), DEFAULT_LIMIT),
  };
}

export function getDiscoveryPage(state: DiscoveryState) {
  return Number.parseInt(state.page, 10) || Number.parseInt(DEFAULT_PAGE, 10);
}

export function getDiscoveryLimit(state: DiscoveryState) {
  return Number.parseInt(state.limit, 10) || Number.parseInt(DEFAULT_LIMIT, 10);
}

export function hasSupplementalDiscoveryFilters(state: DiscoveryState) {
  return Boolean(
    state.category || state.rating || state.priceMin || state.priceMax || state.range,
  );
}

export function isDiscoveryStateActive(state: DiscoveryState) {
  return Boolean(
    state.q ||
      state.category ||
      state.rating ||
      state.priceMin ||
      state.priceMax ||
      state.range ||
      state.page !== DEFAULT_PAGE ||
      state.limit !== DEFAULT_LIMIT,
  );
}

export function mergeDiscoveryState(
  current: DiscoveryState,
  patch: Partial<DiscoveryState>,
): DiscoveryState {
  const next = {
    ...current,
    ...patch,
  };

  const shouldResetPage =
    Object.keys(patch).some(
      (key) => key !== "page" && key !== "limit" && key in defaultDiscoveryState,
    ) && patch.page === undefined;

  if (shouldResetPage) {
    next.page = DEFAULT_PAGE;
  }

  return {
    ...next,
    page: normalizePositiveInteger(next.page, DEFAULT_PAGE),
    limit: normalizePositiveInteger(next.limit, DEFAULT_LIMIT),
  };
}

export function serializeDiscoveryState(state: DiscoveryState) {
  const params = new URLSearchParams();

  (Object.entries(state) as Array<[keyof DiscoveryState, string]>).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    if (key === "page" && value === DEFAULT_PAGE) {
      return;
    }

    if (key === "limit" && value === DEFAULT_LIMIT) {
      return;
    }

    params.set(key, value);
  });

  return params.toString();
}

export function toRestaurantListParams(state: DiscoveryState): RestaurantListParams {
  return {
    category: state.category || undefined,
    rating: state.rating ? Number(state.rating) : undefined,
    priceMin: state.priceMin ? Number(state.priceMin) : undefined,
    priceMax: state.priceMax ? Number(state.priceMax) : undefined,
    range: state.range ? Number(state.range) : undefined,
    page: getDiscoveryPage(state),
    limit: getDiscoveryLimit(state),
  };
}

export function toRestaurantSearchParams(
  state: DiscoveryState,
  limitOverride?: number,
): RestaurantSearchParams {
  return {
    q: state.q.trim(),
    page: getDiscoveryPage(state),
    limit: limitOverride ?? getDiscoveryLimit(state),
  };
}

export function filterRestaurantsByDiscoveryState(
  restaurants: RestaurantCard[],
  state: DiscoveryState,
) {
  return restaurants.filter((restaurant) => {
    if (
      state.category &&
      !restaurant.categories.some(
        (category) => category.toLowerCase() === state.category.toLowerCase(),
      )
    ) {
      return false;
    }

    if (state.rating) {
      const minimumRating = Number(state.rating);

      if (restaurant.rating === null || restaurant.rating < minimumRating) {
        return false;
      }
    }

    if (state.priceMin) {
      const minimumPrice = Number(state.priceMin);

      if (restaurant.priceMin === null || restaurant.priceMin < minimumPrice) {
        return false;
      }
    }

    if (state.priceMax) {
      const maximumPrice = Number(state.priceMax);

      if (restaurant.priceMax === null || restaurant.priceMax > maximumPrice) {
        return false;
      }
    }

    if (state.range) {
      const maximumRange = Number(state.range);

      if (restaurant.distance === null || restaurant.distance > maximumRange) {
        return false;
      }
    }

    return true;
  });
}
