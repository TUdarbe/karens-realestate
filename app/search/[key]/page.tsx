import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/ampre/filters";
import { getListing } from "@/lib/ampre/listings";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListing(decodeURIComponent((await params).key));
  if (!listing) return { title: "Listing not found | Kay Bolesa RE/MAX" };
  return {
    title: `${listing.street ?? listing.subType ?? "Home"}, ${listing.city} | ${formatPrice(listing.price)}`,
    description: listing.remarks?.slice(0, 160),
  };
}

function formatOpenHouse(start: string, end: string) {
  const s = new Date(start);
  const day = s.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
  const time = (d: Date) => d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  return `${day}, ${time(s)} – ${time(new Date(end))}`;
}

export default async function SearchListingPage({ params }: Props) {
  const listing = await getListing(decodeURIComponent((await params).key));
  if (!listing) notFound();

  const reduced = listing.originalPrice && listing.price < listing.originalPrice;

  return (
    <div className="bg-sky pb-16">
      {/* Photos: swipeable strip */}
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl">
          {listing.photos.length > 0 ? (
            <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto">
              {listing.photos.map((src, i) => (
                <div key={src} className="relative h-72 w-[90vw] shrink-0 snap-start sm:h-96 sm:w-[46rem]">
                  <Image src={src} alt={`Photo ${i + 1} of ${listing.photos.length}`} fill priority={i === 0} className="object-cover" sizes="(max-width: 640px) 90vw, 46rem" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center text-white/40">No photos available</div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/search" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-steel-dark hover:text-navy">
          ← Back to search
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                  {listing.isRental ? "For Rent" : "For Sale"}
                </span>
                {reduced && (
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
                    Reduced from {formatPrice(listing.originalPrice!)}
                  </span>
                )}
              </div>
              <p className="text-3xl font-black text-steel md:text-4xl">
                {formatPrice(listing.price)}
                {listing.isRental && <span className="text-lg font-semibold text-slate-400">/mo</span>}
              </p>
              <h1 className="mt-2 text-xl font-black text-navy">{listing.street ?? "Address available on request"}</h1>
              <p className="text-slate-500">{listing.city}, ON</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-sm font-semibold text-navy">
                {listing.beds && <span>{listing.beds} Beds</span>}
                {listing.baths != null && <span>{listing.baths} Baths</span>}
                {listing.parking ? <span>{listing.parking} Parking</span> : null}
                {listing.sqft && <span>{listing.sqft} sqft</span>}
              </div>
            </div>

            {listing.remarks && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                <h2 className="mb-3 text-lg font-black text-navy">About this home</h2>
                <p className="whitespace-pre-line leading-relaxed text-slate-600">{listing.remarks}</p>
              </div>
            )}

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-black text-navy">Property details</h2>
              <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {listing.facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-4 border-b border-gray-100 py-2.5 text-sm">
                    <dt className="text-slate-500">{f.label}</dt>
                    <dd className="text-right font-semibold text-navy">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {listing.brokerage && <p className="text-xs text-slate-400">Listing brokerage: {listing.brokerage}</p>}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {listing.openHouses.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-steel">Open House</h2>
                <ul className="space-y-2 text-sm font-semibold text-navy">
                  {listing.openHouses.map((oh) => <li key={oh.start}>{formatOpenHouse(oh.start, oh.end)}</li>)}
                </ul>
              </div>
            )}
            <div className="rounded-xl bg-navy p-6 text-white shadow-md">
              <h2 className="text-lg font-black">Interested in this home?</h2>
              <p className="mt-1 text-sm text-white/70">Kay can answer questions, pull comparables, or book you a private showing.</p>
              <div className="mt-5 flex flex-col gap-2">
                <Link href="/book" className="rounded-full bg-steel px-5 py-3 text-center text-sm font-bold transition-colors hover:bg-steel-dark">
                  Book a Showing
                </Link>
                <a href="tel:+14168333825" className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-bold transition-colors hover:bg-white/10">
                  (416) 833-3825
                </a>
                {listing.virtualTour && (
                  <a href={listing.virtualTour} target="_blank" rel="noopener noreferrer" className="mt-1 text-center text-sm font-semibold text-steel hover:text-white">
                    View virtual tour ↗
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
