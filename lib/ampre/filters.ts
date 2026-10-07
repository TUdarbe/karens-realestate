// Search filter definitions shared by the server (query building) and the
// client (filter UI). Filters live in the URL so results are shareable.

export const DEFAULT_CITY = "Pickering";
export const PAGE_SIZE = 24;

export type SearchFilters = {
  type: "sale" | "rent";
  city: string; // "" = all areas
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  homeTypes: HomeType[];
  parking?: number;
  basement?: BasementOption;
  openHouse: boolean;
  newListings: boolean;
  reduced: boolean;
  maxDays?: number;
  minSqft?: number;
  minLotAcres?: number;
  garage: boolean;
  pool: boolean;
  sort: SortOption;
  page: number;
};

export const HOME_TYPES = [
  { value: "detached", label: "Detached" },
  { value: "semi", label: "Semi-Detached" },
  { value: "townhouse", label: "Townhouse" },
  { value: "condo", label: "Condo" },
] as const;
export type HomeType = (typeof HOME_TYPES)[number]["value"];

export const BASEMENT_OPTIONS = [
  { value: "any", label: "Has basement" },
  { value: "finished", label: "Finished" },
  { value: "walkout", label: "Walk-out" },
  { value: "separate", label: "Separate entrance" },
] as const;
export type BasementOption = (typeof BASEMENT_OPTIONS)[number]["value"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price (low to high)" },
  { value: "price_desc", label: "Price (high to low)" },
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const SALE_PRICES = [300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1250000, 1500000, 2000000, 3000000];
export const RENT_PRICES = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 7500];
export const DAYS_ON_MARKET = [7, 14, 30, 60, 90];
export const SQFT_MINIMUMS = [700, 1000, 1500, 2000, 2500, 3000, 3500, 5000];
export const LOT_ACRE_MINIMUMS = [0.5, 2, 5, 10, 25];

function num(v: string | string[] | undefined) {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function str(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function oneOf<T extends string>(v: string | undefined, options: readonly { value: T }[]) {
  return options.find((o) => o.value === v)?.value;
}

export function parseFilters(sp: Record<string, string | string[] | undefined>): SearchFilters {
  const city = str(sp.city);
  return {
    type: str(sp.type) === "rent" ? "rent" : "sale",
    city: city === undefined ? DEFAULT_CITY : city.trim(),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    beds: num(sp.beds),
    baths: num(sp.baths),
    homeTypes: (str(sp.homeType) ?? "")
      .split(",")
      .map((t) => oneOf(t, HOME_TYPES))
      .filter((t): t is HomeType => !!t),
    parking: num(sp.parking),
    basement: oneOf(str(sp.basement), BASEMENT_OPTIONS),
    openHouse: str(sp.openHouse) === "1",
    newListings: str(sp.newListings) === "1",
    reduced: str(sp.reduced) === "1",
    maxDays: num(sp.maxDays),
    minSqft: num(sp.minSqft),
    minLotAcres: num(sp.minLot),
    garage: str(sp.garage) === "1",
    pool: str(sp.pool) === "1",
    sort: oneOf(str(sp.sort), SORT_OPTIONS) ?? "newest",
    page: Math.floor(num(sp.page) ?? 1),
  };
}

/** Count of filters tucked under "More Filters", for the button badge. */
export function moreFiltersCount(f: SearchFilters) {
  return [
    f.baths, f.parking, f.basement, f.maxDays, f.minSqft, f.minLotAcres,
    f.openHouse || undefined, f.newListings || undefined, f.reduced || undefined,
    f.garage || undefined, f.pool || undefined,
  ].filter(Boolean).length;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(price);
}

export function formatShortPrice(price: number) {
  if (price >= 999_500) return `$${(price / 1_000_000).toFixed(price >= 10_000_000 ? 0 : 2).replace(/\.?0+$/, "")}M`;
  if (price >= 10_000) return `$${Math.round(price / 1000)}K`;
  return `$${price.toLocaleString("en-CA")}`;
}
