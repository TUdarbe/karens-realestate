'use client';

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_SIZE, SORT_OPTIONS, formatPrice, type SearchFilters } from "@/lib/ampre/filters";
import type { ListingSummary } from "@/lib/ampre/listings";
import type { MapPin } from "./ListingsMap";

const ListingsMap = dynamic(() => import("./ListingsMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-sky" />,
});

function formatOpenHouse(start: string) {
  return new Date(start).toLocaleString("en-CA", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function daysSince(date?: string) {
  if (!date) return Infinity;
  return (Date.now() - new Date(date).getTime()) / 86_400_000;
}

function ListingCard({ l, onHover }: { l: ListingSummary; onHover: (key: string | null) => void }) {
  const reduced = l.originalPrice && l.price < l.originalPrice;
  const isNew = daysSince(l.listedOn) <= 7;

  return (
    <Link
      href={`/search/${encodeURIComponent(l.key)}`}
      onMouseEnter={() => onHover(l.key)}
      onMouseLeave={() => onHover(null)}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {l.photo ? (
          <Image src={l.photo} alt={l.street ?? "Listing photo"} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/20 to-steel/10">
            <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" /></svg>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {isNew && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">New</span>}
          {reduced && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">Price reduced</span>}
          {l.nextOpenHouse && <span className="rounded-full bg-sky px-2 py-0.5 text-xs font-semibold text-navy">Open house</span>}
        </div>
      </div>
      <div className="p-5">
        <p className="mb-1 text-2xl font-black text-steel">
          {formatPrice(l.price)}
          {l.isRental && <span className="text-sm font-semibold text-slate-400">/mo</span>}
        </p>
        <h3 className="mb-0.5 truncate text-sm font-bold text-gray-900">{l.street ?? "Address available on request"}</h3>
        <p className="mb-3 truncate text-sm text-gray-500">
          {l.city}{l.subType ? ` · ${l.subType}` : ""}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-600">
          {l.beds && <span>{l.beds} bd</span>}
          {l.baths != null && <span>{l.baths} ba</span>}
          {l.parking ? <span>{l.parking} parking</span> : null}
          {l.sqft && <span>{l.sqft} sqft</span>}
        </div>
        {l.nextOpenHouse && <p className="mt-2 text-xs font-semibold text-steel-dark">Open {formatOpenHouse(l.nextOpenHouse.start)}</p>}
        {l.brokerage && <p className="mt-2 truncate text-[11px] text-slate-400">Listed by {l.brokerage}</p>}
      </div>
    </Link>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) params.delete("page");
    else params.set("page", String(p));
    return `${pathname}?${params.toString()}`;
  };

  // First, last, and a window around the current page.
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const base = "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${base} border border-slate-200 bg-white text-navy hover:border-steel`}>← Prev</Link>
      ) : (
        <span className={`${base} border border-slate-100 text-slate-300`}>← Prev</span>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && <span className="hidden px-1 text-slate-400 sm:inline">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${base} ${p === page ? "bg-navy text-white" : "border border-slate-200 bg-white text-navy hover:border-steel"} ${Math.abs(p - page) > 1 ? "hidden sm:flex" : ""}`}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${base} bg-steel text-white hover:bg-steel-dark`}>Next →</Link>
      ) : (
        <span className={`${base} border border-slate-100 text-slate-300`}>Next →</span>
      )}
    </nav>
  );
}

export default function ResultsView({ filters, listings, total, error }: { filters: SearchFilters; listings: ListingSummary[]; total: number; error?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pins: MapPin[] = useMemo(
    () => listings.map((l) => ({ key: l.key, price: l.price, isRental: l.isRental, street: l.street, photo: l.photo, geocodeQuery: l.geocodeQuery })),
    [listings]
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const first = (filters.page - 1) * PAGE_SIZE + 1;
  const place = filters.city || "Ontario";
  const title = `Homes for ${filters.type === "rent" ? "Rent" : "Sale"} in ${place}`;

  function setSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "newest") params.delete("sort");
    else params.set("sort", sort);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mx-auto flex max-w-[1600px] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,44%)]">
      {/* List */}
      <section className="min-w-0 flex-1 bg-sky px-4 py-8 sm:px-6 lg:min-h-[calc(100dvh-125px)]">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-navy md:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {total > 0
                ? `${total.toLocaleString()} ${total === 1 ? "property" : "properties"}${totalPages > 1 ? ` · showing ${first}–${Math.min(first + PAGE_SIZE - 1, total)}` : ""}`
                : "0 properties"}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-500">
            Sort by
            <select
              value={filters.sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-navy focus:border-steel focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-100 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-navy">We couldn&apos;t load listings right now.</p>
            <p className="mt-1 text-sm text-slate-500">Please try again in a few minutes.</p>
          </div>
        ) : listings.length === 0 && total > 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-navy">That page is past the end of the results.</p>
            <Pagination page={totalPages + 1} totalPages={totalPages} />
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white px-6 py-16 text-center">
            <svg className="mx-auto mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" /></svg>
            <p className="font-semibold text-navy">No homes match your search{filters.city ? ` in ${filters.city}` : ""}.</p>
            <p className="mt-1 text-sm text-slate-500">Try removing a filter or searching a nearby area.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {filters.city && (
                <Link href={`${pathname}${filters.type === "rent" ? "?type=rent" : ""}`} className="rounded-full bg-steel px-6 py-2.5 text-sm font-bold text-white hover:bg-steel-dark">
                  Search all areas
                </Link>
              )}
              <Link href="/book" className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-bold text-navy hover:border-steel">
                Ask Kay about off-market homes
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
              {listings.map((l) => <ListingCard key={l.key} l={l} onHover={setHovered} />)}
            </div>
            <Pagination page={filters.page} totalPages={totalPages} />
          </>
        )}

        <p className="mt-10 text-[11px] leading-relaxed text-slate-400">
          Listing data provided by PropTx Innovations Inc. via the Amplify Syndication API. Information is deemed reliable but not guaranteed
          and should be independently verified. Listings are marked with the name of the listing brokerage.
        </p>
      </section>

      {/* Map: sticky column on desktop, full-screen overlay on mobile */}
      <aside
        className={`${showMap ? "fixed inset-x-0 bottom-0 top-[172px] z-[450]" : "hidden"} lg:sticky lg:top-[125px] lg:z-0 lg:block lg:h-[calc(100dvh-125px)]`}
      >
        <ListingsMap pins={pins} activeKey={hovered} />
      </aside>

      {/* Mobile list/map toggle */}
      <button
        type="button"
        onClick={() => setShowMap((v) => !v)}
        className="fixed bottom-6 left-1/2 z-[460] flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white shadow-xl lg:hidden"
      >
        {showMap ? (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            List
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            Map
          </>
        )}
      </button>
    </div>
  );
}
