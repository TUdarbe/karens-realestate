import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kay | RE/MAX Real Estate",
  description: "Meet Karen, your dedicated RE/MAX real estate agent. Learn about her background, expertise, and commitment to helping you find your perfect home.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Get to Know Me</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">About Kay</h1>
        </div>
      </section>

      {/* Bio Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Photo */}
            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="relative w-72 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/bio-pic.png"
                  alt="Kay Bolesa"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 288px, 320px"
                  priority
                />
              </div>
              <div className="bg-sky rounded-xl p-6 w-72 md:w-80">
                <h3 className="font-black text-navy text-sm uppercase tracking-widest mb-4">Contact Me</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="tel:+14168333825" className="flex items-center gap-3 text-steel hover:text-navy transition-colors font-semibold">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      (416) 833-3825
                    </a>
                  </li>
                  <li>
                    <a href="mailto:kaybolesa@gmail.com" className="flex items-center gap-3 text-steel hover:text-navy transition-colors font-semibold">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      kaybolesa@gmail.com
                    </a>
                  </li>
                  <li className="text-slate-400 text-xs pt-1">License #6003320 · RE/MAX Prime Properties</li>
                </ul>
              </div>
            </div>

            {/* Bio Text */}
            <div>
              <p className="text-steel text-xs font-bold uppercase tracking-widest mb-2">RE/MAX Prime Properties</p>
              <h2 className="text-3xl md:text-4xl font-black text-navy mb-6">Kay Bolesa</h2>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {[
                  { value: "10+", label: "Years Experience" },
                  { value: "200+", label: "Homes Sold" },
                  { value: "5★", label: "Client Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-xl bg-sky border border-slate-100">
                    <p className="text-2xl font-black text-steel">{stat.value}</p>
                    <p className="text-xs text-gray-500 font-semibold mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
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
                desc: "Placeholder text about deep knowledge of the local market, neighbourhoods, schools, and community.",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                title: "Client First",
                desc: "Placeholder text about putting clients' needs above all else and making the process stress-free.",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                title: "Trusted & Transparent",
                desc: "Placeholder text about honest communication, no hidden surprises, and advocating for clients at every step.",
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
          <p className="text-slate-400 text-lg mb-8">Ready to buy, sell, or just have questions? Reach out — no pressure, just honest advice.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:+14168333825" className="bg-steel text-white px-8 py-4 rounded font-bold text-sm uppercase tracking-wide hover:bg-steel-dark transition-colors">
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
