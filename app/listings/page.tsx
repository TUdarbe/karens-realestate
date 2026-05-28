export const dynamic = 'force-dynamic';

import Image from "next/image";
import Link from "next/link";
import { getAllListings, type Listing } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Available: "bg-green-100 text-green-800",
    "Coming Soon": "bg-blue-100 text-blue-800",
    Pending: "bg-yellow-100 text-yellow-800",
    "Sold Conditionally": "bg-orange-100 text-orange-800",
    Sold: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const imgUrl = listing.featuredPhoto
    ? urlFor(listing.featuredPhoto).width(600).height(400).fit("crop").url()
    : null;

  return (
    <Link href={`/listings/${listing.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {imgUrl ? (
          <Image src={imgUrl} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy/20 to-steel/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={listing.status} />
        </div>
      </div>
      <div className="p-5">
        <p className="text-2xl font-black text-steel mb-1">{formatPrice(listing.price)}</p>
        <h3 className="font-bold text-gray-900 text-sm mb-0.5 truncate">{listing.title}</h3>
        <p className="text-gray-500 text-sm mb-3">{listing.address}{listing.city ? `, ${listing.city}` : ""}</p>
        <div className="flex items-center gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3">
          {listing.bedrooms != null && <span>{listing.bedrooms} bd</span>}
          {listing.bathrooms != null && <span>{listing.bathrooms} ba</span>}
          {listing.sqft != null && <span>{listing.sqft.toLocaleString()} sqft</span>}
        </div>
      </div>
    </Link>
  );
}

export default async function ListingsPage() {
  const listings = await getAllListings();

  const available = listings.filter((l) => l.status === "Available");
  const comingSoon = listings.filter((l) => l.status === "Coming Soon");
  const pending = listings.filter((l) => l.status === "Pending");
  const soldConditionally = listings.filter((l) => l.status === "Sold Conditionally");
  const sold = listings.filter((l) => l.status === "Sold");

  return (
    <>
      <section className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Properties</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">All Listings</h1>
        </div>
      </section>

      <section className="bg-sky min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {listings.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" /></svg>
              <p className="text-gray-400 font-medium">No listings yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {available.length > 0 && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-6 bg-green-500 rounded-full inline-block" />
                    Available ({available.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {available.map((l) => <ListingCard key={l._id} listing={l} />)}
                  </div>
                </div>
              )}
              {comingSoon.length > 0 && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-6 bg-blue-400 rounded-full inline-block" />
                    Coming Soon ({comingSoon.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comingSoon.map((l) => <ListingCard key={l._id} listing={l} />)}
                  </div>
                </div>
              )}
              {pending.length > 0 && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-6 bg-yellow-400 rounded-full inline-block" />
                    Pending ({pending.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pending.map((l) => <ListingCard key={l._id} listing={l} />)}
                  </div>
                </div>
              )}
              {soldConditionally.length > 0 && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-6 bg-orange-400 rounded-full inline-block" />
                    Sold Conditionally ({soldConditionally.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {soldConditionally.map((l) => <ListingCard key={l._id} listing={l} />)}
                  </div>
                </div>
              )}
              {sold.length > 0 && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-6 bg-gray-400 rounded-full inline-block" />
                    Sold ({sold.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sold.map((l) => <ListingCard key={l._id} listing={l} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
