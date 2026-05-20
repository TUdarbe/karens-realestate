import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kay Bolesa | RE/MAX Real Estate",
  description: "Your trusted RE/MAX real estate agent. Browse listings, read market insights, and find your dream home.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50" style={{ boxShadow: "0 1px 0 0 #e2e8f0, 0 4px 16px -4px rgba(13,33,55,0.08)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3 group">
                <Image src="/remax-logo.png" alt="RE/MAX" width={40} height={48} className="object-contain" />
                <div className="flex flex-col leading-none">
                  <span className="text-navy font-black text-base tracking-tight">Kay Bolesa</span>
                  <span className="text-steel text-[10px] font-semibold uppercase tracking-widest">RE/MAX Prime Properties</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <Link href="/listings" className="text-slate-500 hover:text-navy font-medium text-sm transition-colors relative group">
                  Listings
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-steel transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link href="/blog" className="text-slate-500 hover:text-navy font-medium text-sm transition-colors relative group">
                  Blog
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-steel transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link href="/about" className="text-slate-500 hover:text-navy font-medium text-sm transition-colors relative group">
                  About
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-steel transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/book"
                  className="bg-steel text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-steel-dark transition-colors duration-300"
                >
                  Book a Call
                </Link>
                <a
                  href="tel:+14168333825"
                  className="bg-navy text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-steel transition-colors duration-300"
                >
                  (416) 833-3825
                </a>
              </nav>

              <a href="tel:+14168333825" className="md:hidden text-steel font-bold text-sm">
                (416) 833-3825
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="text-white" style={{ background: "#1b3252", borderTop: "1px solid rgba(91,158,201,0.3)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/remax-logo.png" alt="RE/MAX" width={34} height={40} className="object-contain brightness-0 invert" />
                  <div className="flex flex-col leading-none">
                    <span className="text-white font-black text-base">Kay Bolesa</span>
                    <span className="text-steel text-[10px] font-semibold uppercase tracking-widest">RE/MAX Prime Properties</span>
                  </div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">
                  Helping families find their perfect home with dedication, expertise, and integrity.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider mb-4 text-steel">Quick Links</h3>
                <ul className="space-y-2.5 text-sm">
                  <li><Link href="/listings" className="text-white/85 hover:text-white transition-colors">All Listings</Link></li>
                  <li><Link href="/blog" className="text-white/85 hover:text-white transition-colors">Market Blog</Link></li>
                  <li><Link href="/about" className="text-white/85 hover:text-white transition-colors">About Kay</Link></li>
                  <li><Link href="/book" className="text-white/85 hover:text-white transition-colors">Book a Consultation</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider mb-4 text-steel">Contact</h3>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="tel:+14168333825" className="text-white/85 hover:text-white transition-colors">(416) 833-3825</a></li>
                  <li><a href="mailto:kaybolesa@gmail.com" className="text-white/85 hover:text-white transition-colors">kaybolesa@gmail.com</a></li>
                  <li>
                    <a href="https://www.instagram.com/kaybrealty/" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/KayBolesaRealty/" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/15 mt-8 pt-6 text-center text-white/55 text-xs">
              © {new Date().getFullYear()} Kay Bolesa · RE/MAX Prime Properties · Each office independently owned and operated.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
