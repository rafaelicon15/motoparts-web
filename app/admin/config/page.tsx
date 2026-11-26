"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  Palette,
  Save,
  Store,
  Truck,
} from "lucide-react";

type StoreConfig = {
  storeName: string;
  tagline: string;
  accent: string;
  phone: string;
  city: string;
  currency: string;
  catalogMode: "demo" | "inventory";
  marketplaceSource: string;
  showWholesale: boolean;
  showMarketplaceReferences: boolean;
};

const DEFAULT_CONFIG: StoreConfig = {
  storeName: "MotoParts",
  tagline: "Repuestos confiables para cada kilómetro.",
  accent: "#e3000f",
  phone: "0800-MOTOPART",
  city: "Caracas, Venezuela",
  currency: "USD + Bs.",
  catalogMode: "demo",
  marketplaceSource: "MercadoLibre Venezuela",
  showWholesale: true,
  showMarketplaceReferences: true,
};

const STORAGE_KEY = "motoparts-store-config";

export default function AdminConfigPage() {
  const [config, setConfig] = useState<StoreConfig>(() => {
    if (typeof window === "undefined") return DEFAULT_CONFIG;
    try {
      const savedConfig = window.localStorage.getItem(STORAGE_KEY);
      return savedConfig ? { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof StoreConfig>(key: K, value: StoreConfig[K]) => {
    setConfig((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const saveConfig = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3200);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e3000f]">Plantilla comercial</p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">Admin / Configuración</h1>
          <p className="mt-2 max-w-2xl text-gray-500">Personaliza la identidad de cada tienda, activa la muestra de catálogo y deja lista la información que verá el cliente.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm hover:border-red-200 hover:text-[#e3000f]"><Eye size={17} /> Ver tienda</Link>
          <button onClick={saveConfig} className="inline-flex items-center gap-2 rounded-xl bg-[#e3000f] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-700"><Save size={17} /> Guardar</button>
        </div>
      </div>

      {saved && <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700"><CheckCircle2 size={18} /> Configuración guardada en este navegador.</div>}

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 border-b border-gray-100 pb-4 text-xl font-bold text-gray-800"><Store className="text-[#e3000f]" size={21} /> Identidad de la tienda</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-gray-700">Nombre comercial<input value={config.storeName} onChange={(e) => update("storeName", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-[#e3000f]" /></label>
              <label className="text-sm font-bold text-gray-700">Color principal<input type="color" value={config.accent} onChange={(e) => update("accent", e.target.value)} className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-1" /></label>
              <label className="text-sm font-bold text-gray-700 md:col-span-2">Frase de portada<input value={config.tagline} onChange={(e) => update("tagline", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-[#e3000f]" /></label>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 border-b border-gray-100 pb-4 text-xl font-bold text-gray-800"><Truck className="text-[#e3000f]" size={21} /> Información comercial</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-gray-700">Teléfono de atención<input value={config.phone} onChange={(e) => update("phone", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-[#e3000f]" /></label>
              <label className="text-sm font-bold text-gray-700">Ciudad / despacho<input value={config.city} onChange={(e) => update("city", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-[#e3000f]" /></label>
              <label className="text-sm font-bold text-gray-700">Moneda visible<select value={config.currency} onChange={(e) => update("currency", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 font-normal outline-none focus:border-[#e3000f]"><option>USD + Bs.</option><option>Solo USD</option><option>Solo Bs.</option></select></label>
              <label className="text-sm font-bold text-gray-700">Fuente de referencia<input value={config.marketplaceSource} onChange={(e) => update("marketplaceSource", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 font-normal outline-none focus:border-[#e3000f]" /></label>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 border-b border-gray-100 pb-4 text-xl font-bold text-gray-800"><Palette className="text-[#e3000f]" size={21} /> Catálogo y experiencia</h2>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-bold text-gray-700">Modo de catálogo<select value={config.catalogMode} onChange={(e) => update("catalogMode", e.target.value as StoreConfig["catalogMode"])} className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 font-normal outline-none focus:border-[#e3000f]"><option value="demo">Muestra demo con referencias públicas</option><option value="inventory">Inventario real conectado</option></select></label>
              <label className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-700"><input type="checkbox" checked={config.showWholesale} onChange={(e) => update("showWholesale", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#e3000f]" /><span>Mostrar precios mayoristas para talleres y negocios.</span></label>
              <label className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-700"><input type="checkbox" checked={config.showMarketplaceReferences} onChange={(e) => update("showMarketplaceReferences", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#e3000f]" /><span>Mostrar enlaces de referencia de MercadoLibre en los productos demo.</span></label>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-gray-900 p-6 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-300">Vista rápida</p>
            <div className="mt-8 rounded-2xl bg-white p-5 text-gray-900">
              <div className="flex items-center gap-2 text-lg font-black"><span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white" style={{ backgroundColor: config.accent }}>M</span>{config.storeName || "Tu tienda"}</div>
              <p className="mt-5 text-2xl font-black leading-tight">{config.tagline || "Tu frase comercial"}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-red-50 px-3 py-2" style={{ color: config.accent }}>{config.currency}</span><span className="rounded-full bg-gray-100 px-3 py-2">{config.city || "Tu ciudad"}</span></div>
            </div>
            <p className="mt-4 text-xs leading-5 text-gray-400">Esta previsualización demuestra el flujo de personalización. Para producción, estos valores pueden persistirse en Supabase y aplicar el color a todos los componentes.</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900"><p className="font-extrabold">Fuente de la muestra</p><p className="mt-2 leading-6">El catálogo actual usa referencias públicas de MercadoLibre Venezuela. No es una integración automática ni una afiliación; reemplaza estos datos por el inventario y las fotos autorizadas del negocio.</p><a href="https://listado.mercadolibre.com.ve/repuestos-varios-para-moto" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-950">Abrir referencia <ExternalLink size={14} /></a></div>
        </aside>
      </div>
    </div>
  );
}
