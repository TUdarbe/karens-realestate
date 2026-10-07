import "server-only";

// Amplify Syndication API (PropTx / TRREB), OData v4.
// Docs: https://developer.ampre.ca/docs/query-options

type ODataResponse<T> = {
  value: T[];
  "@odata.count"?: number;
};

export async function ampreQuery<T>(
  resource: string,
  params: Record<string, string | number | undefined>,
  revalidate = 300
): Promise<ODataResponse<T>> {
  const baseUrl = process.env.BASE_URL;
  const token = process.env.ACCESS_TOKEN;
  if (!baseUrl || !token) throw new Error("Missing BASE_URL or ACCESS_TOKEN env vars");

  // Build the query string by hand: URLSearchParams encodes spaces as "+",
  // which the Amplify OData parser rejects.
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");

  const res = await fetch(`${baseUrl}/odata/${resource}?${qs}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      // Cloudflare in front of the API blocks some default user agents (error 1010).
      "User-Agent": "KayBolesaRealEstate/1.0",
    },
    next: { revalidate },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Amplify API ${res.status} on ${resource}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

/** Escape a string literal for use inside an OData filter. */
export function odataString(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}
