const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const fetchOptions = { next: { revalidate: 60 } as const };

export type CmsPlan = {
  id: number;
  name: string;
  label: string;
  price: number;
  badge: string | null;
  features: string[] | string;
  cta_text: string;
};

export type CmsService = {
  id: number;
  icon: string | null;
  title: string;
  description: string;
  sort_order: number;
};

export type SiteContentMap = Record<string, string>;

export async function getPlans(): Promise<CmsPlan[]> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  const res = await fetch(`${API_BASE}/api/plans`, fetchOptions);
  if (!res.ok) {
    throw new Error(`Failed to fetch plans: ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getContent(): Promise<SiteContentMap> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  const res = await fetch(`${API_BASE}/api/content`, fetchOptions);
  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${res.status}`);
  }
  return res.json();
}

export async function getServices(): Promise<CmsService[]> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  const res = await fetch(`${API_BASE}/api/services`, fetchOptions);
  if (!res.ok) {
    throw new Error(`Failed to fetch services: ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
