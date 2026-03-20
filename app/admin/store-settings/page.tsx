// app/admin/store-settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Phone,
  Mail,
  MapPin,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type StoreConfig = {
  store_phone: string;
  store_email: string;
  store_address: string;
  paypal_commission_percent: string;
  paypal_commission_fixed: string;
};

export default function StoreSettingsPage() {
  const [config, setConfig] = useState<StoreConfig>({
    store_phone: "",
    store_email: "",
    store_address: "",
    paypal_commission_percent: "2.9",
    paypal_commission_fixed: "0.30",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("store_config")
        .select("key_name, key_value");

      if (error) throw error;

      const newConfig: StoreConfig = {
        store_phone: "",
        store_email: "",
        store_address: "",
        paypal_commission_percent: "2.9",
        paypal_commission_fixed: "0.30",
      };

      data?.forEach((item) => {
        if (item.key_name in newConfig) {
          newConfig[item.key_name as keyof StoreConfig] = item.key_value || "";
        }
      });

      setConfig(newConfig);
    } catch (err: any) {
      setMessage({ type: "error", text: "Error cargando configuración" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key_name: key,
        key_value: value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("store_config")
          .upsert(update, { onConflict: "key_name" });
        if (error) throw error;
      }

      setMessage({
        type: "success",
        text: "Configuración guardada exitosamente",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: "Error guardando configuración: " + err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#e3000f]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Configuración de la Tienda
        </h1>
        <p className="text-gray-500 mt-1">
          Edita la información de contacto y las comisiones de pago.
        </p>
      </div>

      <div className="space-y-6">
        {/* Información de Contacto */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Phone className="text-[#e3000f]" size={22} /> Información de Contacto
          </h2>

          <div className="space-y-4">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Teléfono de Atención
              </label>
              <input
                type="tel"
                value={config.store_phone}
                onChange={(e) =>
                  setConfig({ ...config, store_phone: e.target.value })
                }
                placeholder="Ej. +58 412-0000000"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={config.store_email}
                onChange={(e) =>
                  setConfig({ ...config, store_email: e.target.value })
                }
                placeholder="Ej. ventas@motoparts.com"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Dirección de la Tienda
              </label>
              <input
                type="text"
                value={config.store_address}
                onChange={(e) =>
                  setConfig({ ...config, store_address: e.target.value })
                }
                placeholder="Ej. Caracas, Venezuela"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Comisiones de Pago */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Mail className="text-[#e3000f]" size={22} /> Comisiones de PayPal
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Estos valores se utilizan para calcular automáticamente el monto que
            debe pagar el cliente cuando elige PayPal.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Porcentaje */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Comisión Porcentual (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.paypal_commission_percent}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paypal_commission_percent: e.target.value,
                  })
                }
                placeholder="Ej. 2.9"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
              />
            </div>

            {/* Monto fijo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Comisión Fija ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.paypal_commission_fixed}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paypal_commission_fixed: e.target.value,
                  })
                }
                placeholder="Ej. 0.30"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Fórmula: (Subtotal × Porcentaje / 100) + Monto Fijo
          </p>
        </div>

        {/* Botón Guardar */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#e3000f] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors shadow-md"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

        {/* Mensaje */}
        {message && (
          <div
            className={`flex items-center gap-2 text-sm font-medium rounded-lg p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
