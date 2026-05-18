import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const featuredUrl = listing.featuredPhoto
    ? urlFor(listing.featuredPhoto).width(1200).height(700).fit("crop").url()
    : null;

  const galleryPhotos: any[] = listing.photos ?? [];

  return (
    <>
      {/* Back nav */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/listings" className="text-sm text-navy hover:text-steel font-medium transition-colors flex items-center gap-1">
            ← Back to Listings
          </Link>
        </div>
      </div>

      {/* Hero photo */}
      <div className="relative w-full h-72 md:h-[480px] bg-gray-100">
        {featuredUrl ? (
          <Image src={featuredUrl} alt={listing.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy/30 to-steel/10 flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
            </svg>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {listing.status && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    listing.status === "Active" ? "bg-green-100 text-green-800" :
                    listing.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {listing.status}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{listing.title}</h1>
              <p className="text-gray-500 text-lg">{listing.address}{listing.city ? `, ${listing.city}` : ""}</p>
              <p className="text-4xl font-black text-steel mt-3">{formatPrice(listing.price)}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Bedrooms", value: listing.bedrooms },
                { label: "Bathrooms", value: listing.bathrooms },
                { label: "Sq Ft", value: listing.sqft?.toLocaleString() },
              ].map(({ label, value }) => value != null ? (
                <div key={label} className="bg-sky rounded-xl p-5 text-center">
                  <p className="text-2xl font-black text-navy">{value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">{label}</p>
                </div>
              ) : null)}
            </div>

            {/* Description */}
            {listing.description && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-3">About This Property</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Gallery */}
            {galleryPhotos.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryPhotos.map((photo: any, i: number) => {
                    const url = urlFor(photo).width(500).height(350).fit("crop").url();
                    return (
                      <div key={i} className="relative h-40 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-navy rounded-2xl p-7 text-white border-t border-steel/30">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Listed By</p>
              <h3 className="text-2xl font-black mb-1">Kay Bolesa</h3>
              <p className="text-slate-400 text-sm mb-6">RE/MAX Prime Properties</p>
              <div className="space-y-3">
                <a
                  href="tel:+14168333825"
                  className="flex items-center justify-center gap-2 bg-steel text-white w-full py-3.5 rounded-lg font-bold text-sm hover:bg-steel-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  (416) 833-3825
                </a>
                <a
                  href="mailto:kaybolesa@gmail.com"
                  className="flex items-center justify-center gap-2 bg-white/10 text-white w-full py-3.5 rounded-lg font-bold text-sm border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Email Kay
                </a>
              </div>
              <p className="text-slate-400 text-xs mt-5 text-center">License #6003320</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
