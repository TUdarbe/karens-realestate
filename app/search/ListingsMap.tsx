'use client';

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice, formatShortPrice } from "@/lib/ampre/filters";

export type MapPin = {
  key: string;
  price: number;
  isRental: boolean;
  street?: string;
  photo?: string;
  geocodeQuery?: string;
};

const GTA: L.LatLngTuple = [43.75, -79.4];
const pointCache = new Map<string, { lat: number; lng: number } | null>();

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function pinIcon(label: string, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="map-pin${active ? " map-pin-active" : ""}">${label}</div>`,
    // Size comes from the label; .map-pin centres itself above the point via CSS.
    iconSize: undefined,
    iconAnchor: [0, 0],
  });
}

export default function ListingsMap({ pins, activeKey }: { pins: MapPin[]; activeKey?: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef(new Map<string, { marker: L.Marker; label: string }>());
  const boundsRef = useRef(L.latLngBounds([]));
  const [located, setLocated] = useState(0);
  const locatable = pins.filter((p) => p.geocodeQuery).length;

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false, scrollWheelZoom: true }).setView(GTA, 9);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    // The map sits in a container whose size changes (mobile list/map toggle).
    // When it goes from hidden to visible, re-fit the pins placed while hidden.
    let wasHidden = containerRef.current.offsetWidth === 0;
    const ro = new ResizeObserver(([entry]) => {
      map.invalidateSize();
      const hidden = entry.contentRect.width === 0;
      if (wasHidden && !hidden && boundsRef.current.isValid()) {
        map.fitBounds(boundsRef.current, { padding: [48, 48], maxZoom: 14 });
      }
      wasHidden = hidden;
    });
    ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Geocode pins one at a time and drop markers in as they resolve.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = markersRef.current;
    markers.forEach(({ marker }) => marker.remove());
    markers.clear();
    setLocated(0);

    let cancelled = false;
    const bounds = L.latLngBounds([]);
    boundsRef.current = bounds;

    (async () => {
      for (const pin of pins) {
        if (cancelled) return;
        if (!pin.geocodeQuery) continue;
        let point = pointCache.get(pin.geocodeQuery);
        if (point === undefined) {
          try {
            const res = await fetch(`/api/geocode?q=${encodeURIComponent(pin.geocodeQuery)}`);
            point = res.ok ? await res.json() : null;
          } catch {
            point = null;
          }
          pointCache.set(pin.geocodeQuery, point ?? null);
        }
        if (cancelled) return;
        setLocated((n) => n + 1);
        if (!point) continue;

        const label = formatShortPrice(pin.price) + (pin.isRental ? "/mo" : "");
        const marker = L.marker([point.lat, point.lng], { icon: pinIcon(label, false), riseOnHover: true })
          .bindPopup(
            `<a href="/search/${encodeURIComponent(pin.key)}" class="map-popup">
              ${pin.photo ? `<img src="${escapeHtml(pin.photo)}" alt="" />` : ""}
              <strong>${formatPrice(pin.price)}${pin.isRental ? "/mo" : ""}</strong>
              <span>${escapeHtml(pin.street ?? "")}</span>
            </a>`,
            { closeButton: false, minWidth: 200 }
          )
          .addTo(map);
        markers.set(pin.key, { marker, label });
        bounds.extend([point.lat, point.lng]);
        if (containerRef.current?.offsetWidth) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pins]);

  // Highlight the pin for the card being hovered.
  useEffect(() => {
    markersRef.current.forEach(({ marker, label }, key) => {
      const active = key === activeKey;
      marker.setIcon(pinIcon(label, active));
      marker.setZIndexOffset(active ? 1000 : 0);
    });
  }, [activeKey, located]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full z-0" />
      {locatable > 0 && located < locatable && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] bg-white/95 text-navy text-xs font-semibold px-4 py-2 rounded-full shadow-md flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-steel border-t-transparent rounded-full animate-spin" />
          Placing homes on map {located}/{locatable}
        </div>
      )}
    </div>
  );
}
