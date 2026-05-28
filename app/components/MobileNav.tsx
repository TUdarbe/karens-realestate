'use client';

import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-navy p-2 rounded focus:outline-none"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg z-50">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            <Link href="/listings" onClick={() => setOpen(false)} className="text-slate-600 hover:text-navy font-medium text-sm py-3 border-b border-slate-100 transition-colors">
              Listings
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)} className="text-slate-600 hover:text-navy font-medium text-sm py-3 border-b border-slate-100 transition-colors">
              Blog
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="text-slate-600 hover:text-navy font-medium text-sm py-3 border-b border-slate-100 transition-colors">
              About
            </Link>
            <Link href="/book" onClick={() => setOpen(false)} className="bg-steel text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-steel-dark transition-colors text-center mt-2">
              Book a Call
            </Link>
            <a href="tel:+14168333825" className="bg-navy text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-steel transition-colors text-center mt-1 mb-1">
              (416) 833-3825
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
