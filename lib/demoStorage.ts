export type DemoCategory = {
  id: string;
  name: string;
  parent_id: string | null;
};

export type DemoBrand = {
  id: string;
  name: string;
};

export type DemoPaymentMethod = {
  id: string;
  name: string;
  is_active: boolean;
  requires_receipt: boolean;
  store_pickup_only: boolean;
  surcharge_type: "none" | "fixed" | "percentage";
  surcharge_value: number;
  comment?: string;
};

export type DemoAgency = {
  id: string;
  name: string;
  is_active: boolean;
};

export const demoStorageKeys = {
  categories: "motoparts-demo-categories",
  brands: "motoparts-demo-brands",
  payments: "motoparts-demo-payment-methods",
  agencies: "motoparts-demo-shipping-agencies",
  bcvRate: "motoparts-demo-bcv-rate",
} as const;

export const defaultDemoCategories: DemoCategory[] = [
  { id: "demo-category-motor", name: "Motor", parent_id: null },
  { id: "demo-category-frenos", name: "Frenos", parent_id: null },
  { id: "demo-category-electrico", name: "Sistema eléctrico", parent_id: null },
  { id: "demo-category-accesorios", name: "Accesorios", parent_id: null },
];

export const defaultDemoBrands: DemoBrand[] = [
  { id: "demo-brand-honda", name: "Honda" },
  { id: "demo-brand-yamaha", name: "Yamaha" },
  { id: "demo-brand-suzuki", name: "Suzuki" },
  { id: "demo-brand-generica", name: "Genérica" },
];

export const defaultDemoPayments: DemoPaymentMethod[] = [
  { id: "demo-pago-movil", name: "Pago Móvil", is_active: true, requires_receipt: true, store_pickup_only: false, surcharge_type: "none", surcharge_value: 0, comment: "Adjuntar comprobante" },
  { id: "demo-transferencia", name: "Transferencia bancaria", is_active: true, requires_receipt: true, store_pickup_only: false, surcharge_type: "none", surcharge_value: 0, comment: "Adjuntar comprobante" },
  { id: "demo-crypto", name: "Crypto (USDT)", is_active: true, requires_receipt: true, store_pickup_only: false, surcharge_type: "none", surcharge_value: 0, comment: "Adjuntar hash o comprobante" },
];

export const defaultDemoAgencies: DemoAgency[] = [
  { id: "demo-zoom", name: "ZOOM", is_active: true },
  { id: "demo-mrw", name: "MRW", is_active: true },
  { id: "demo-tealca", name: "TEALCA", is_active: true },
];

export function readDemoList<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeDemoList<T>(key: string, value: T[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}
