import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kay Bolesa | RE/MAX Prime Properties",
  description: "Kay Bolesa is a registered Realtor with RE/MAX Prime Properties serving Toronto, York Region, and Durham Region.",
};

export default function AboutPage() {
  return (
    <>
      {/* Editorial Split Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: "580px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "580px" }}>

          {/* Left: Identity panel */}
          <div className="bg-navy flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-steel/40 to-transparent" />
            <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.5) 8px, rgba(255,255,255,0.5) 9px)" }} />

            <p className="text-steel text-[10px] font-bold uppercase tracking-[0.3em] mb-8">RE/MAX Prime Properties</p>
            <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tight mb-5">
              Kay<br />
              <span className="text-steel">Bolesa</span>
            </h1>
            <div className="w-10 h-[2px] bg-steel/40 mb-5" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light">
              Registered Realtor · Toronto, York Region & Durham Region
            </p>

            <div className="mt-10 flex flex-col gap-3">
              <a href="tel:+14168333825" className="flex items-center gap-3 text-slate-300 hover:text-steel transition-colors text-sm group">
                <span className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-steel/40 transition-colors shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </span>
                (416) 833-3825
              </a>
              <a href="mailto:kaybolesa@gmail.com" className="flex items-center gap-3 text-slate-300 hover:text-steel transition-colors text-sm group">
                <span className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-steel/40 transition-colors shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                kaybolesa@gmail.com
              </a>
              <div className="flex gap-2 mt-1">
                <a href="https://www.instagram.com/kaybrealty/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-steel hover:border-steel/40 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.facebook.com/KayBolesaRealty/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-steel hover:border-steel/40 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Photo */}
          <div className="relative min-h-[380px] lg:min-h-0">
            <Image
              src="/bio-pic.png"
              alt="Kay Bolesa"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-navy to-transparent hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-gray-600 leading-relaxed text-[17px]">
            <p>
              I&apos;m Kay Bolesa, a registered Realtor with RE/MAX Prime Properties, proudly serving the City of Toronto, York Region, and Durham Region. With a strong background in both real estate and healthcare leadership, I bring a unique mix of professionalism, compassion, and project management expertise to every client relationship.
            </p>
            <p>
              Before becoming a Realtor, I spent over a decade in leadership roles within healthcare, specializing in quality improvement, client experience, and risk management. That experience taught me how to truly listen, anticipate needs, and guide people through complex decisions with patience and care. Today, I apply those same skills to help buyers, sellers, and renters feel confident and supported through every stage of their real estate journey.
            </p>
          </div>

          {/* Numbered Approach */}
          <div className="mt-16 border-t border-slate-100 pt-16">
            <p className="text-steel text-[10px] font-bold uppercase tracking-[0.25em] mb-10">As Your Agent</p>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {[
                { num: "01", title: "Listen First", desc: "Understanding your goals, budget, and timelines before anything else." },
                { num: "02", title: "Simplify the Process", desc: "From pre-qualification to keys in hand, I handle the details so you can focus on what matters." },
                { num: "03", title: "Advocate for You", desc: "Whether negotiating an offer, preparing your home to sell, or uncovering hidden opportunities." },
                { num: "04", title: "Stay Connected", desc: "Building long-term relationships so I can be your trusted real estate partner for years to come." },
              ].map((item, i) => (
                <div key={item.num} className={`flex gap-5 py-8 border-b border-slate-100 ${i % 2 === 0 ? "md:pr-10" : "md:pl-10 md:border-l border-slate-100"}`}>
                  <span className="text-4xl font-black text-steel/60 leading-none select-none shrink-0">{item.num}</span>
                  <div>
                    <h3 className="font-bold text-navy mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-600 leading-relaxed text-[17px] mt-12">
              With my knowledge of the real estate market, strong network of lenders, inspectors, and contractors, and a genuine passion for helping people, I make sure you&apos;re supported from the first showing to the final signature.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sky py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-steel text-xs font-bold uppercase tracking-widest mb-2">What I Stand For</p>
            <h2 className="text-3xl md:text-4xl font-black text-navy">My Approach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
                title: "Local Expertise",
                desc: "Deep knowledge of Toronto, York Region, and Durham Region — neighbourhoods, schools, and hidden gems.",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                title: "Client First",
                desc: "Your needs, goals, and timeline drive every decision. The process should feel supported, not stressful.",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                title: "Trusted & Transparent",
                desc: "Honest communication, no hidden surprises, and a genuine advocate at every step of your journey.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-8 border border-slate-100 hover:border-steel/30 hover:shadow-lg transition-all group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-steel/10 text-steel rounded-full mb-5 group-hover:bg-steel group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Let&apos;s Work Together</h2>
          <p className="text-slate-400 text-lg mb-8">Ready to buy, sell, or just have questions? Reach out. No pressure, just honest advice.</p>
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
