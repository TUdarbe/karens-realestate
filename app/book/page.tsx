import type { Metadata } from "next";
import CalendlyEmbed from "@/app/components/CalendlyEmbed";

export const metadata: Metadata = {
  title: "Book a Consultation | Kay Bolesa RE/MAX",
  description: "Book a free 30-minute consultation with Kay Bolesa, your RE/MAX Prime Properties agent. Pick a time that works for you.",
};

export default function BookPage() {
  return (
    <>
      <section className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Free & No Obligation</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Book a Consultation</h1>
          <p className="text-slate-400 text-base max-w-xl">
            Pick a time that works for you. Whether you&apos;re buying, selling, or just exploring, let&apos;s talk. No pressure, just honest advice.
          </p>
        </div>
      </section>

      <section className="bg-sky min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalendlyEmbed />
        </div>
      </section>
    </>
  );
}
