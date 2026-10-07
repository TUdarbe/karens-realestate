'use client';

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BASEMENT_OPTIONS, DAYS_ON_MARKET, HOME_TYPES, LOT_ACRE_MINIMUMS, RENT_PRICES, SALE_PRICES, SQFT_MINIMUMS,
  formatShortPrice, moreFiltersCount, type SearchFilters,
} from "@/lib/ampre/filters";

const CITIES = ["Pickering", "Ajax", "Whitby", "Oshawa", "Clarington", "Uxbridge", "Scugog", "Markham", "Toronto", "Scarborough", "Richmond Hill", "Vaughan", "Mississauga", "Brampton"];

type Patch = Record<string, string | undefined>;

function useUpdateFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(patch: Patch) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) params.delete(k);
      else params.set(k, v);
    }
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  return { update, pending };
}

// ---------- Small building blocks ----------

function Pill({ label, active, open, onClick }: { label: string; active?: boolean; open?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "border-steel bg-sky text-navy" : "border-slate-200 bg-white text-slate-600 hover:border-steel/60 hover:text-navy"
      }`}
    >
      {label}
      <svg className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

function Popover({ open, onClose, children, className = "" }: { open: boolean; onClose: () => void; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={ref} className={`absolute left-0 top-full z-[600] mt-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">{children}</p>;
}

function Segmented({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`min-w-11 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            value === o.value ? "border-navy bg-navy text-white" : "border-slate-200 text-slate-600 hover:border-steel"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const countOptions = (max: number) => [{ value: "", label: "Any" }, ...Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: `${i + 1}+` }))];

function Select({ value, onChange, children, label }: { value: string; onChange: (v: string) => void; children: React.ReactNode; label: string }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-navy focus:border-steel focus:outline-none"
    >
      {children}
    </select>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-navy has-[:checked]:border-steel has-[:checked]:bg-sky">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#5B9EC9]" />
      {label}
    </label>
  );
}

// ---------- Filter groups (shared by popovers and the mobile sheet) ----------

function PriceFields({ f, onChange }: { f: SearchFilters; onChange: (p: Patch) => void }) {
  const prices = f.type === "rent" ? RENT_PRICES : SALE_PRICES;
  const fmt = (p: number) => formatShortPrice(p) + (f.type === "rent" ? "/mo" : "");
  return (
    <div className="grid grid-cols-2 gap-3">
      <Select label="Minimum price" value={f.minPrice?.toString() ?? ""} onChange={(v) => onChange({ minPrice: v || undefined })}>
        <option value="">No min</option>
        {prices.map((p) => <option key={p} value={p}>{fmt(p)}</option>)}
      </Select>
      <Select label="Maximum price" value={f.maxPrice?.toString() ?? ""} onChange={(v) => onChange({ maxPrice: v || undefined })}>
        <option value="">No max</option>
        {prices.map((p) => <option key={p} value={p}>{fmt(p)}</option>)}
      </Select>
    </div>
  );
}

function HomeTypeFields({ f, onChange }: { f: SearchFilters; onChange: (p: Patch) => void }) {
  function toggle(type: string, on: boolean) {
    const next = on ? [...f.homeTypes, type] : f.homeTypes.filter((t) => t !== type);
    onChange({ homeType: next.length ? next.join(",") : undefined });
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {HOME_TYPES.map((t) => (
        <Toggle key={t.value} label={t.label} checked={f.homeTypes.includes(t.value)} onChange={(on) => toggle(t.value, on)} />
      ))}
    </div>
  );
}

function AdvancedFields({ f, onChange }: { f: SearchFilters; onChange: (p: Patch) => void }) {
  const flag = (key: string) => (on: boolean) => onChange({ [key]: on ? "1" : undefined });
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Bathrooms</SectionLabel>
        <Segmented options={countOptions(4)} value={f.baths?.toString() ?? ""} onChange={(v) => onChange({ baths: v || undefined })} />
      </div>
      <div>
        <SectionLabel>Parking spaces</SectionLabel>
        <Segmented options={countOptions(4)} value={f.parking?.toString() ?? ""} onChange={(v) => onChange({ parking: v || undefined })} />
      </div>
      <div>
        <SectionLabel>Basement</SectionLabel>
        <Segmented
          options={[{ value: "", label: "Any" }, ...BASEMENT_OPTIONS]}
          value={f.basement ?? ""}
          onChange={(v) => onChange({ basement: v || undefined })}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <SectionLabel>Days on market</SectionLabel>
          <Select label="Days on market" value={f.maxDays?.toString() ?? ""} onChange={(v) => onChange({ maxDays: v || undefined })}>
            <option value="">Any</option>
            {DAYS_ON_MARKET.map((d) => <option key={d} value={d}>{d} days or less</option>)}
          </Select>
        </div>
        <div>
          <SectionLabel>Square feet</SectionLabel>
          <Select label="Minimum square feet" value={f.minSqft?.toString() ?? ""} onChange={(v) => onChange({ minSqft: v || undefined })}>
            <option value="">Any</option>
            {SQFT_MINIMUMS.map((s) => <option key={s} value={s}>{s.toLocaleString()}+ sqft</option>)}
          </Select>
        </div>
        <div>
          <SectionLabel>Lot size</SectionLabel>
          <Select label="Minimum lot size" value={f.minLotAcres?.toString() ?? ""} onChange={(v) => onChange({ minLot: v || undefined })}>
            <option value="">Any</option>
            {LOT_ACRE_MINIMUMS.map((a) => <option key={a} value={a}>{a}+ acres</option>)}
          </Select>
        </div>
      </div>
      <div>
        <SectionLabel>Features</SectionLabel>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Toggle label="Open house" checked={f.openHouse} onChange={flag("openHouse")} />
          <Toggle label="New listings (7 days)" checked={f.newListings} onChange={flag("newListings")} />
          <Toggle label="Price reduced" checked={f.reduced} onChange={flag("reduced")} />
          <Toggle label="Garage" checked={f.garage} onChange={flag("garage")} />
          <Toggle label="Pool" checked={f.pool} onChange={flag("pool")} />
        </div>
      </div>
    </div>
  );
}

// ---------- Filter bar ----------

export default function FilterBar({ filters: f, total }: { filters: SearchFilters; total: number }) {
  const { update, pending } = useUpdateFilters();
  const [open, setOpen] = useState<null | "price" | "beds" | "type" | "more">(null);
  const [city, setCity] = useState(f.city);
  const close = () => setOpen(null);
  const toggle = (name: typeof open) => setOpen((cur) => (cur === name ? null : name));

  // Keep the input in sync when the URL's city changes (e.g. back button).
  const [syncedCity, setSyncedCity] = useState(f.city);
  if (syncedCity !== f.city) {
    setSyncedCity(f.city);
    setCity(f.city);
  }

  useEffect(() => {
    document.body.style.overflow = open === "more" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const priceLabel =
    f.minPrice || f.maxPrice
      ? `${f.minPrice ? formatShortPrice(f.minPrice) : "$0"} – ${f.maxPrice ? formatShortPrice(f.maxPrice) : "Any"}`
      : "Price";
  const typeLabel = f.homeTypes.length === 1 ? HOME_TYPES.find((t) => t.value === f.homeTypes[0])!.label : f.homeTypes.length ? `${f.homeTypes.length} types` : "Home Type";
  const moreCount = moreFiltersCount(f);
  const mobileCount = moreCount + [f.minPrice || f.maxPrice, f.beds, f.homeTypes.length].filter(Boolean).length;

  function submitCity(e?: React.FormEvent) {
    e?.preventDefault();
    if (city.trim() !== f.city) update({ city: city.trim() });
  }

  return (
    <div className="sticky top-16 z-[500] border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-4 py-3 sm:px-6 md:flex-nowrap">
        {/* Buy / Rent */}
        <div className="flex shrink-0 rounded-full bg-sky p-1">
          {(["sale", "rent"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => t !== f.type && update({ type: t === "rent" ? "rent" : undefined, minPrice: undefined, maxPrice: undefined })}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${f.type === t ? "bg-navy text-white shadow" : "text-slate-500 hover:text-navy"}`}
            >
              {t === "sale" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>

        {/* Location */}
        <form onSubmit={submitCity} className="relative order-last w-full md:order-none md:w-auto md:min-w-0 md:max-w-64 md:flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            list="city-options"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={() => submitCity()}
            placeholder="All areas"
            aria-label="Location"
            className="w-full rounded-full border border-slate-200 py-2 pl-10 pr-4 text-sm font-medium text-navy placeholder:text-slate-400 focus:border-steel focus:outline-none"
          />
          <datalist id="city-options">
            {CITIES.map((c) => <option key={c} value={c} />)}
          </datalist>
        </form>

        {/* Desktop quick filters */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Pill label={priceLabel} active={!!(f.minPrice || f.maxPrice)} open={open === "price"} onClick={() => toggle("price")} />
            <Popover open={open === "price"} onClose={close} className="w-80">
              <SectionLabel>{f.type === "rent" ? "Monthly rent" : "Price range"}</SectionLabel>
              <PriceFields f={f} onChange={update} />
            </Popover>
          </div>
          <div className="relative">
            <Pill label={f.beds ? `${f.beds}+ Beds` : "Beds"} active={!!f.beds} open={open === "beds"} onClick={() => toggle("beds")} />
            <Popover open={open === "beds"} onClose={close} className="w-80">
              <SectionLabel>Bedrooms</SectionLabel>
              <Segmented options={countOptions(5)} value={f.beds?.toString() ?? ""} onChange={(v) => { update({ beds: v || undefined }); close(); }} />
            </Popover>
          </div>
          <div className="relative">
            <Pill label={typeLabel} active={f.homeTypes.length > 0} open={open === "type"} onClick={() => toggle("type")} />
            <Popover open={open === "type"} onClose={close} className="w-80">
              <SectionLabel>Home type</SectionLabel>
              <HomeTypeFields f={f} onChange={update} />
            </Popover>
          </div>
        </div>

        {/* More filters (all filters on mobile) */}
        <button
          type="button"
          onClick={() => toggle("more")}
          className={`ml-auto flex shrink-0 items-center md:ml-0 gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            open === "more" || moreCount ? "border-steel bg-sky text-navy" : "border-slate-200 bg-white text-slate-600 hover:border-steel/60 hover:text-navy"
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" />
          </svg>
          <span className="hidden md:inline">More Filters</span>
          <span className="md:hidden">Filters</span>
          {(moreCount > 0 || mobileCount > 0) && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-steel px-1 text-[11px] font-bold text-white">
              <span className="hidden md:inline">{moreCount || ""}</span>
              <span className="md:hidden">{mobileCount}</span>
            </span>
          )}
        </button>

        {pending && <span className="hidden h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-steel border-t-transparent sm:block" aria-label="Loading" />}
      </div>

      {/* More filters panel: full-screen sheet on mobile, centred dialog on desktop */}
      {open === "more" && (
        <div className="fixed inset-0 z-[700] flex items-end justify-center bg-navy/40 md:items-center md:p-6" onClick={close}>
          <div
            role="dialog"
            aria-label="Filters"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl md:max-w-2xl md:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-black text-navy">Filters</h2>
              <button type="button" onClick={close} aria-label="Close filters" className="rounded-full p-2 text-slate-400 hover:bg-sky hover:text-navy">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="space-y-6 md:hidden">
                <div>
                  <SectionLabel>{f.type === "rent" ? "Monthly rent" : "Price range"}</SectionLabel>
                  <PriceFields f={f} onChange={update} />
                </div>
                <div>
                  <SectionLabel>Bedrooms</SectionLabel>
                  <Segmented options={countOptions(5)} value={f.beds?.toString() ?? ""} onChange={(v) => update({ beds: v || undefined })} />
                </div>
                <div>
                  <SectionLabel>Home type</SectionLabel>
                  <HomeTypeFields f={f} onChange={update} />
                </div>
              </div>
              <AdvancedFields f={f} onChange={update} />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  update({
                    minPrice: undefined, maxPrice: undefined, beds: undefined, homeType: undefined, baths: undefined, parking: undefined,
                    basement: undefined, maxDays: undefined, minSqft: undefined, minLot: undefined, openHouse: undefined,
                    newListings: undefined, reduced: undefined, garage: undefined, pool: undefined,
                  })
                }
                className="text-sm font-semibold text-slate-500 underline-offset-4 hover:text-navy hover:underline"
              >
                Clear all
              </button>
              <button type="button" onClick={close} className="rounded-full bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-steel">
                {pending ? "Updating…" : `Show ${total.toLocaleString()} ${total === 1 ? "home" : "homes"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
