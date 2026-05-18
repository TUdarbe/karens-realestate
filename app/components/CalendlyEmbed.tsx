'use client';
import { useEffect, useState } from "react";

export default function CalendlyEmbed() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    const handleMessage = (e: MessageEvent) => {
      if (typeof e.data?.event === "string" && e.data.event.startsWith("calendly.")) {
        setReady(true);
      }
    };
    window.addEventListener("message", handleMessage);

    // Fallback: show the widget after 6s regardless
    const fallback = setTimeout(() => setReady(true), 6000);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(link);
      window.removeEventListener("message", handleMessage);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      {!ready && (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-8 h-8 border-[3px] border-steel/20 border-t-steel rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading calendar…</p>
        </div>
      )}
      <div className={ready ? "bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden" : "opacity-0 h-0 overflow-hidden"}>
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/kaybolesa/30min"
          style={{ width: "100%", height: "700px" }}
        />
      </div>
    </>
  );
}
