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
  title: "Karen [Last Name] | RE/MAX Real Estate",
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
                  <span className="text-navy font-black text-base tracking-tight">Karen [Last Name]</span>
                  <span className="text-steel text-[10px] font-semibold uppercase tracking-widest">RE/MAX [Office Name]</span>
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
                <Link href="#about" className="text-slate-500 hover:text-navy font-medium text-sm transition-colors relative group">
                  About
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-steel transition-all duration-300 group-hover:w-full" />
                </Link>
                <a
                  href="tel:+1XXXXXXXXXX"
                  className="bg-navy text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-steel transition-colors duration-300"
                >
                  (XXX) XXX-XXXX
                </a>
              </nav>

              <a href="tel:+1XXXXXXXXXX" className="md:hidden text-steel font-bold text-sm">
                (XXX) XXX-XXXX
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
                    <span className="text-white font-black text-base">Karen [Last Name]</span>
                    <span className="text-steel text-[10px] font-semibold uppercase tracking-widest">RE/MAX [Office Name]</span>
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
                  <li><Link href="#about" className="text-white/85 hover:text-white transition-colors">About Karen</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider mb-4 text-steel">Contact</h3>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="tel:+1XXXXXXXXXX" className="text-white/85 hover:text-white transition-colors">(XXX) XXX-XXXX</a></li>
                  <li><a href="mailto:karen@example.com" className="text-white/85 hover:text-white transition-colors">karen@example.com</a></li>
                  <li className="text-white/60">License #XXXXXXX</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/15 mt-8 pt-6 text-center text-white/55 text-xs">
              © {new Date().getFullYear()} Karen [Last Name] · RE/MAX [Office Name] · Each office independently owned and operated.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
