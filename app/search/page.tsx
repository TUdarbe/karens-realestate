import type { Metadata } from "next";
import { Suspense } from "react";
import { parseFilters } from "@/lib/ampre/filters";
import { searchListings, type ListingSummary } from "@/lib/ampre/listings";
import FilterBar from "./FilterBar";
import ResultsView from "./ResultsView";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const place = f.city || "Ontario";
  return {
    title: `Homes for ${f.type === "rent" ? "Rent" : "Sale"} in ${place} | Kay Bolesa RE/MAX`,
    description: `Browse MLS® homes for ${f.type === "rent" ? "rent" : "sale"} in ${place}. Filter by price, bedrooms, home type and more.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const filters = parseFilters(await searchParams);

  let listings: ListingSummary[] = [];
  let total = 0;
  let error = false;
  try {
    ({ listings, total } = await searchListings(filters));
  } catch (e) {
    console.error(e);
    error = true;
  }

  return (
    <Suspense>
      <FilterBar filters={filters} total={total} />
      <ResultsView filters={filters} listings={listings} total={total} error={error} />
    </Suspense>
  );
}
