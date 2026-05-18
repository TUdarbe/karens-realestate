export const dynamic = 'force-dynamic';

import Image from "next/image";
import Link from "next/link";
import { getFeaturedListings, getFeaturedPosts, type Listing, type Post } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Sold: "bg-gray-100 text-gray-700",
    Pending: "bg-yellow-100 text-yellow-800",
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
          {listing.bedrooms != null && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" /></svg>
              {listing.bedrooms} bd
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 6h16" /></svg>
              {listing.bathrooms} ba
            </span>
          )}
          {listing.sqft != null && (
            <span>{listing.sqft.toLocaleString()} sqft</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ post }: { post: Post }) {
  const imgUrl = post.coverImage
    ? urlFor(post.coverImage).width(600).height(360).fit("crop").url()
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {imgUrl ? (
          <Image src={imgUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-deep flex items-center justify-center">
            <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" /></svg>
          </div>
        )}
      </div>
      <div className="p-5">
        {post.publishedAt && <p className="text-xs text-remax-gray mb-2">{formatDate(post.publishedAt)}</p>}
        <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-navy transition-colors line-clamp-2">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>}
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [listings, posts] = await Promise.all([
    getFeaturedListings(),
    getFeaturedPosts(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0a1c2e 0%, #0d2540 45%, #0a1e35 100%)" }}>
        {/* Subtle cool blue glow — top right */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(circle at 70% 30%, #5B9EC9, transparent 60%)", transform: "translate(20%, -20%)" }} />
        {/* Soft glow — bottom left */}
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-[0.07] pointer-events-none" style={{ background: "radial-gradient(circle, #3D7EA6, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        {/* Subtle horizontal scan lines for texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)" }} />
        {/* Thin steel rule at very top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-steel/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-steel/10 border border-steel/25 text-steel text-[10px] font-bold px-4 py-1.5 rounded-full mb-8 uppercase tracking-[0.18em]">
              RE/MAX Prime Properties
            </div>
            <h1 className="text-5xl md:text-[4.25rem] font-black text-white leading-[1.05] tracking-tight mb-7">
              Find Your<br />
              <span className="text-steel">Perfect</span> Home<br />
              With Kay.
            </h1>
            <p className="text-slate-400 text-base md:text-lg mb-10 leading-relaxed max-w-md font-light">
              Dedicated RE/MAX agent. Local expertise. Real results — whether you&apos;re buying, selling, or just starting to look.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/listings" className="bg-steel text-white px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-steel-dark transition-colors duration-300 text-center">
                Browse Listings
              </Link>
              <a href="tel:+14168333825" className="text-slate-300 border border-white/15 px-7 py-3.5 rounded-full font-medium text-sm uppercase tracking-widest hover:bg-white/5 hover:border-white/30 hover:text-white transition-all duration-300 text-center">
                (416) 833-3825
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-sky py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-steel text-xs font-bold uppercase tracking-widest mb-2">Available Now</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Featured Properties</h2>
            </div>
            <Link href="/listings" className="hidden sm:inline-flex text-navy font-semibold text-sm hover:text-steel transition-colors items-center gap-1">
              View all →
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-400 text-sm">Listings coming soon. Check back shortly!</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/listings" className="text-navy font-semibold text-sm hover:text-steel transition-colors">View all listings →</Link>
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-steel text-xs font-bold uppercase tracking-widest mb-2">Why Choose Me</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">The Kay Difference</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Backed by the most recognized brand in real estate, I bring local market expertise and a personal touch to every transaction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                ),
                title: "Deep Local Knowledge",
                desc: "Years of experience in the local market means I know every neighborhood, school district, and hidden gem.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ),
                title: "Proven Results",
                desc: "A track record of successful transactions, happy buyers, and top-dollar sales for sellers.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                ),
                title: "Always Available",
                desc: "Real estate doesn't follow a 9-to-5 schedule — and neither do I. I'm here when you need me.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 rounded-xl border border-slate-100 hover:border-steel/30 hover:shadow-lg transition-all group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-steel/10 text-steel rounded-full mb-5 group-hover:bg-steel group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      {posts.length > 0 && (
        <section className="bg-sky py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-steel text-xs font-bold uppercase tracking-widest mb-2">Stay Informed</p>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">Market Insights</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex text-navy font-semibold text-sm hover:text-steel transition-colors items-center gap-1">
                All posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => <BlogCard key={post._id} post={post} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-navy py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Make Your Move?</h2>
          <p className="text-slate-400 text-lg mb-8">Whether you&apos;re buying, selling, or just exploring your options — let&apos;s talk. No pressure, just answers.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/book" className="bg-steel text-white px-8 py-4 rounded font-bold text-sm uppercase tracking-wide hover:bg-steel-dark transition-colors">
              Book a Consultation
            </Link>
            <a href="tel:+14168333825" className="bg-transparent text-white border-2 border-white px-8 py-4 rounded font-bold text-sm uppercase tracking-wide hover:bg-white/10 transition-colors">
              Call (416) 833-3825
            </a>
            <a href="mailto:kaybolesa@gmail.com" className="bg-transparent text-white border-2 border-white px-8 py-4 rounded font-bold text-sm uppercase tracking-wide hover:bg-white/10 transition-colors">
              Send an Email
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
