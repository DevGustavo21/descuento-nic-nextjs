export type Coupon = {
  id: number;
  title: string;
  code: string;
  store: string;
  logo_url: string;
  department: string;
  city: string;
  category: string;
  category_slug: string;
  discount_type: "percent" | "amount";
  discount_value: number;
  discount_label: string;
  expires_at: string;
  channels: string[];
  payment_methods: string[];
  terms: string | null;
  badge: "hot" | "new" | "expires" | null;
  remaining: number;
  max_redemptions: number;
};

export type CategoryItem = { name: string; slug: string; icon: string };

export type FiltersPayload = {
  categories: CategoryItem[];
  departments: string[];
  channels: Record<string, string>;
  payment_methods: Record<string, string>;
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const NEGOCIO_URL =
  process.env.NEXT_PUBLIC_NEGOCIO_URL ?? "http://localhost:8000/negocio";
