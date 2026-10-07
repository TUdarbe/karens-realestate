import "server-only";
import { ampreQuery, odataString } from "./client";
import { PAGE_SIZE, type SearchFilters } from "./filters";

// Raw Property fields we read. Never select or render PrivateRemarks or other
// agent-only fields: they are not for public display.
const CARD_FIELDS = [
  "ListingKey", "ListPrice", "OriginalListPrice", "TransactionType", "PropertySubType",
  "UnparsedAddress", "StreetNumber", "StreetName", "StreetSuffix", "StreetDirSuffix", "UnitNumber",
  "City", "StateOrProvince", "PostalCode", "InternetAddressDisplayYN",
  "BedroomsAboveGrade", "BedroomsBelowGrade", "BathroomsTotalInteger", "ParkingTotal", "LivingAreaRange",
  "ListingContractDate", "ListOfficeName",
];

const DETAIL_FIELDS = [
  ...CARD_FIELDS,
  "PublicRemarks", "ArchitecturalStyle", "Basement", "GarageType", "GarageYN", "PoolFeatures",
  "HeatType", "Cooling", "LotWidth", "LotDepth", "LotSizeUnits", "LotSizeRangeAcres", "ApproximateAge",
  "TaxAnnualAmount", "TaxYear", "AssociationFee", "CrossStreet", "CityRegion", "KitchensTotal",
  "Furnished", "VirtualTourURLUnbranded", "DaysOnMarket",
];

type RawProperty = Record<string, unknown> & {
  ListingKey: string;
  ListPrice: number;
};

export type ListingSummary = {
  key: string;
  price: number;
  originalPrice?: number;
  isRental: boolean;
  subType?: string;
  street?: string;
  city?: string;
  geocodeQuery?: string;
  beds?: string;
  baths?: number;
  parking?: number;
  sqft?: string;
  listedOn?: string;
  brokerage?: string;
  photo?: string;
  nextOpenHouse?: { start: string; end: string };
};

export type ListingDetail = ListingSummary & {
  remarks?: string;
  photos: string[];
  facts: { label: string; value: string }[];
  virtualTour?: string;
  openHouses: { start: string; end: string }[];
};

// ---------- Filter building ----------

// Lower bound of a TRREB range lookup value, e.g. "1500-2000" -> 1500, "< 700" -> 0, "5000 +" -> 5000.
function rangeLowerBound(range: string) {
  if (range.trim().startsWith("<")) return 0;
  return parseFloat(range) || 0;
}

// Lookup values from /odata/Lookup (LookupName eq 'LivingAreaRange' / 'LotSizeRangeAcres').
const LIVING_AREA_RANGES = ["< 700", "0-499", "500-599", "600-699", "700-799", "700-1100", "800-899", "900-999", "1000-1199", "1100-1500", "1200-1399", "1400-1599", "1500-2000", "1600-1799", "1800-1999", "2000-2249", "2000-2500", "2250-2499", "2500-2749", "2500-3000", "2750-2999", "3000-3249", "3000-3500", "3250-3499", "3500-3749", "3500-5000", "3750-3999", "4000-4249", "4250-4499", "4500-4749", "4750-4999", "5000 +"];
const LOT_ACRE_RANGES = ["< .50", ".50-1.99", "2-4.99", "5-9.99", "10-24.99", "25-49.99", "25-99.99", "50-99.99", "100 +"];

function inList(field: string, values: string[]) {
  return `${field} in (${values.map(odataString).join(",")})`;
}

function isoDateDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function buildFilter(f: SearchFilters): string {
  const clauses = [
    "StandardStatus eq 'Active'",
    "startswith(PropertyType,'Residential')",
    "InternetEntireListingDisplayYN eq true",
    f.type === "rent" ? "TransactionType eq 'For Lease'" : "TransactionType eq 'For Sale'",
  ];

  // Toronto cities come through as districts ("Toronto E07"), so match on prefix.
  if (f.city) clauses.push(`startswith(City,${odataString(f.city)})`);
  if (f.minPrice) clauses.push(`ListPrice ge ${f.minPrice}`);
  if (f.maxPrice) clauses.push(`ListPrice le ${f.maxPrice}`);
  if (f.beds) clauses.push(`BedroomsTotal ge ${f.beds}`);
  if (f.baths) clauses.push(`BathroomsTotalInteger ge ${f.baths}`);
  if (f.parking) clauses.push(`ParkingTotal ge ${f.parking}`);

  if (f.homeTypes.length) {
    const types = f.homeTypes.map((t) => {
      switch (t) {
        case "detached": return "PropertySubType eq 'Detached'";
        case "semi": return "startswith(PropertySubType,'Semi')";
        case "townhouse": return "contains(PropertySubType,'Townhouse')";
        case "condo": return "PropertySubType eq 'Condo Apartment'";
      }
    });
    clauses.push(`(${types.join(" or ")})`);
  }

  // Lambda syntax: no space after the colon, or the API returns "URI is malformed".
  switch (f.basement) {
    case "any": clauses.push("Basement/any(b:b ne 'None' and b ne 'Crawl Space')"); break;
    case "finished": clauses.push("Basement/any(b:b eq 'Finished' or b eq 'Finished with Walk-Out')"); break;
    case "walkout": clauses.push("Basement/any(b:(contains(b,'Walk-Out')))"); break;
    case "separate": clauses.push("Basement/any(b:b eq 'Separate Entrance')"); break;
  }

  const maxDays = Math.min(f.maxDays ?? Infinity, f.newListings ? 7 : Infinity);
  if (Number.isFinite(maxDays)) clauses.push(`ListingContractDate ge ${isoDateDaysAgo(maxDays)}`);
  if (f.reduced) clauses.push("ListPrice lt OriginalListPrice");
  if (f.minSqft) clauses.push(inList("LivingAreaRange", LIVING_AREA_RANGES.filter((r) => rangeLowerBound(r) >= f.minSqft!)));
  if (f.minLotAcres) clauses.push(inList("LotSizeRangeAcres", LOT_ACRE_RANGES.filter((r) => rangeLowerBound(r) >= f.minLotAcres!)));
  if (f.garage) clauses.push("GarageYN eq true");
  if (f.pool) clauses.push("PoolFeatures/any(p:p ne 'None')");

  return clauses.join(" and ");
}

function buildOrderBy(f: SearchFilters) {
  switch (f.sort) {
    case "price_asc": return "ListPrice asc,ListingKey asc";
    case "price_desc": return "ListPrice desc,ListingKey asc";
    default: return "ListingContractDate desc,ListingKey asc";
  }
}

// ---------- Mapping ----------

function toSummary(p: RawProperty): ListingSummary {
  const showAddress = p.InternetAddressDisplayYN !== false;
  const city = typeof p.City === "string" ? p.City : undefined;
  const street = [p.UnitNumber ? `${p.UnitNumber} -` : "", p.StreetNumber, p.StreetName, p.StreetSuffix, p.StreetDirSuffix]
    .filter(Boolean)
    .join(" ")
    .trim();
  const cityForGeocode = city?.replace(/\s+[A-Z]\d{2}$/, ""); // "Toronto E07" -> "Toronto"
  const bedsAbove = p.BedroomsAboveGrade as number | undefined;
  const bedsBelow = p.BedroomsBelowGrade as number | undefined;

  return {
    key: p.ListingKey,
    price: p.ListPrice,
    originalPrice: (p.OriginalListPrice as number) || undefined,
    isRental: p.TransactionType !== "For Sale",
    subType: (p.PropertySubType as string)?.trim(),
    street: showAddress ? street || undefined : undefined,
    city,
    geocodeQuery: showAddress && street
      ? `${p.StreetNumber} ${p.StreetName} ${p.StreetSuffix ?? ""}, ${cityForGeocode}, Ontario ${p.PostalCode ?? ""}`.replace(/\s+/g, " ")
      : undefined,
    beds: bedsAbove != null ? `${bedsAbove}${bedsBelow ? `+${bedsBelow}` : ""}` : undefined,
    baths: (p.BathroomsTotalInteger as number) ?? undefined,
    parking: (p.ParkingTotal as number) ?? undefined,
    sqft: (p.LivingAreaRange as string) || undefined,
    listedOn: (p.ListingContractDate as string) || undefined,
    brokerage: (p.ListOfficeName as string) || undefined,
  };
}

// ---------- Related resources ----------

function keyList(keys: string[]) {
  return `(${keys.map(odataString).join(",")})`;
}

async function getPreferredPhotos(keys: string[]) {
  if (!keys.length) return new Map<string, string>();
  const res = await ampreQuery<{ ResourceRecordKey: string; MediaURL: string }>("Media", {
    $top: keys.length * 2,
    $filter: `ResourceRecordKey in ${keyList(keys)} and ImageSizeDescription eq 'Large' and PreferredPhotoYN eq true and MediaStatus eq 'Active'`,
    $select: "ResourceRecordKey,MediaURL",
  });
  return new Map(res.value.map((m) => [m.ResourceRecordKey, m.MediaURL]));
}

type RawOpenHouse = { ListingKey: string; OpenHouseStartTime: string; OpenHouseEndTime: string };

async function getUpcomingOpenHouses(keys?: string[]) {
  const today = new Date().toISOString().slice(0, 10);
  const res = await ampreQuery<RawOpenHouse>("OpenHouse", {
    $top: 10000,
    $filter: `OpenHouseStatus eq 'Active' and OpenHouseDate ge ${today}${keys ? ` and ListingKey in ${keyList(keys)}` : ""}`,
    $select: "ListingKey,OpenHouseStartTime,OpenHouseEndTime",
    $orderby: "OpenHouseStartTime asc",
  });
  const byKey = new Map<string, { start: string; end: string }[]>();
  for (const oh of res.value) {
    const list = byKey.get(oh.ListingKey) ?? [];
    list.push({ start: oh.OpenHouseStartTime, end: oh.OpenHouseEndTime });
    byKey.set(oh.ListingKey, list);
  }
  return byKey;
}

// ---------- Public API ----------

export async function searchListings(f: SearchFilters): Promise<{ listings: ListingSummary[]; total: number }> {
  const filter = buildFilter(f);
  const orderby = buildOrderBy(f);
  const skip = (f.page - 1) * PAGE_SIZE;

  let rows: RawProperty[];
  let total: number;

  if (f.openHouse) {
    // OpenHouse is a separate resource, so intersect: fetch the keys that match
    // every other filter, keep the ones with an upcoming open house, then page.
    const [matches, openHouses] = await Promise.all([
      ampreQuery<{ ListingKey: string }>("Property", { $top: 10000, $filter: filter, $orderby: orderby, $select: "ListingKey" }),
      getUpcomingOpenHouses(),
    ]);
    const keys = matches.value.map((m) => m.ListingKey).filter((k) => openHouses.has(k));
    total = keys.length;
    const pageKeys = keys.slice(skip, skip + PAGE_SIZE);
    if (!pageKeys.length) return { listings: [], total };
    const res = await ampreQuery<RawProperty>("Property", {
      $top: PAGE_SIZE,
      $filter: `ListingKey in ${keyList(pageKeys)}`,
      $orderby: orderby,
      $select: CARD_FIELDS.join(","),
    });
    rows = res.value;
  } else {
    const res = await ampreQuery<RawProperty>("Property", {
      $top: PAGE_SIZE,
      $skip: skip || undefined,
      $count: "true",
      $filter: filter,
      $orderby: orderby,
      $select: CARD_FIELDS.join(","),
    });
    rows = res.value;
    total = res["@odata.count"] ?? rows.length;
  }

  const keys = rows.map((r) => r.ListingKey);
  const [photos, openHouses] = await Promise.all([getPreferredPhotos(keys), getUpcomingOpenHouses(keys)]);

  return {
    total,
    listings: rows.map((r) => ({
      ...toSummary(r),
      photo: photos.get(r.ListingKey),
      nextOpenHouse: openHouses.get(r.ListingKey)?.[0],
    })),
  };
}

function joinList(v: unknown) {
  return Array.isArray(v) ? v.filter((x) => x && x !== "None").join(", ") : typeof v === "string" ? v : "";
}

export async function getListing(key: string): Promise<ListingDetail | null> {
  const res = await ampreQuery<RawProperty>("Property", {
    $top: 1,
    // Only active listings are public; sold/expired data is not for display here.
    $filter: `ListingKey eq ${odataString(key)} and StandardStatus eq 'Active' and InternetEntireListingDisplayYN eq true`,
    $select: DETAIL_FIELDS.join(","),
  });
  const p = res.value[0];
  if (!p) return null;

  const [media, openHouses] = await Promise.all([
    ampreQuery<{ MediaURL: string }>("Media", {
      $top: 100,
      $filter: `ResourceRecordKey eq ${odataString(key)} and ImageSizeDescription eq 'Large' and MediaCategory eq 'Photo' and MediaStatus eq 'Active'`,
      $select: "MediaURL,Order",
      $orderby: "Order asc",
    }),
    getUpcomingOpenHouses([key]),
  ]);

  const summary = toSummary(p);
  const lot = p.LotWidth && p.LotDepth ? `${p.LotWidth} x ${p.LotDepth} ${(p.LotSizeUnits as string)?.toLowerCase() ?? ""}`.trim() : (p.LotSizeRangeAcres as string);
  const facts: { label: string; value: string | number | undefined }[] = [
    { label: "Type", value: summary.subType },
    { label: "Style", value: joinList(p.ArchitecturalStyle) },
    { label: "Bedrooms", value: summary.beds },
    { label: "Bathrooms", value: summary.baths },
    { label: "Kitchens", value: p.KitchensTotal as number },
    { label: "Square feet", value: summary.sqft },
    { label: "Lot size", value: lot },
    { label: "Parking", value: summary.parking },
    { label: "Garage", value: p.GarageType !== "None" ? (p.GarageType as string) : undefined },
    { label: "Basement", value: joinList(p.Basement) },
    { label: "Pool", value: joinList(p.PoolFeatures) },
    { label: "Heating", value: p.HeatType as string },
    { label: "Cooling", value: joinList(p.Cooling) },
    { label: "Age", value: p.ApproximateAge as string },
    { label: "Furnished", value: summary.isRental ? (p.Furnished as string) : undefined },
    { label: "Taxes", value: p.TaxAnnualAmount ? `$${Math.round(p.TaxAnnualAmount as number).toLocaleString("en-CA")} (${p.TaxYear})` : undefined },
    { label: "Maintenance", value: p.AssociationFee ? `$${(p.AssociationFee as number).toLocaleString("en-CA")}/mo` : undefined },
    { label: "Neighbourhood", value: p.CityRegion as string },
    { label: "Cross street", value: p.CrossStreet as string },
    { label: "MLS®", value: p.ListingKey },
  ];

  return {
    ...summary,
    photo: media.value[0]?.MediaURL,
    photos: media.value.map((m) => m.MediaURL),
    remarks: (p.PublicRemarks as string) || undefined,
    virtualTour: (p.VirtualTourURLUnbranded as string) || undefined,
    openHouses: openHouses.get(key) ?? [],
    facts: facts
      .filter((x) => x.value !== undefined && x.value !== null && x.value !== "" && x.value !== 0)
      .map((x) => ({ label: x.label, value: String(x.value) })),
  };
}
