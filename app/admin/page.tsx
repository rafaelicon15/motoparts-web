// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Truck,
} from "lucide-react";

type Metrics = {
  totalProducts: number;
  totalStock: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  activeAgencies: number;
  bcvRate: number;
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [bcvInput, setBcvInput] = useState("");
  const [savingBcv, setSavingBcv] = useState(false);
  const [bcvMessage, setBcvMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, agenciesRes, settingsRes] =
        await Promise.all([
          supabase.from("products").select("stock"),
          supabase.from("orders").select("status, total_usd"),
          supabase
            .from("shipping_agencies")
            .select("id")
            .eq("is_active", true),
          supabase
            .from("system_settings")
            .select("key_value")
            .eq("key_name", "last_bcv_rate")
            .single(),
        ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const agencies = agenciesRes.data || [];
      const bcvRate = settingsRes.data?.key_value
        ? parseFloat(settingsRes.data.key_value)
        : 36.5;

      setMetrics({
        totalProducts: products.length,
        totalStock: products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0),
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        totalRevenue: orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + (Number(o.total_usd) || 0), 0),
        activeAgencies: agencies.length,
        bcvRate,
      });
      setBcvInput(bcvRate.toFixed(2));
    } catch (err) {
      console.error("Error cargando métricas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleUpdateBcv = async () => {
    const rate = parseFloat(bcvInput);
    if (isNaN(rate) || rate <= 0) {
      setBcvMessage({ type: "error", text: "Ingresa una tasa válida." });
      return;
    }
    setSavingBcv(true);
    setBcvMessage(null);
    try {
      const { error } = await supabase.from("system_settings").upsert({
        key_name: "last_bcv_rate",
        key_value: rate.toFixed(2),
      });
      if (error) throw error;
      setBcvMessage({
        type: "success",
        text: `Tasa BCV actualizada a Bs. ${rate.toFixed(2)}`,
      });
      setMetrics((prev) => (prev ? { ...prev, bcvRate: rate } : prev));
      setTimeout(() => setBcvMessage(null), 3000);
    } catch (err: any) {
      setBcvMessage({ type: "error", text: err.message });
    } finally {
      setSavingBcv(false);
    }
  };

  const fetchLiveBcv = async () => {
    setSavingBcv(true);
    setBcvMessage(null);
    try {
      const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.promedio) {
        setBcvInput(data.promedio.toFixed(2));
        setBcvMessage({
          type: "success",
          text: `Tasa obtenida de la API: Bs. ${data.promedio.toFixed(2)}. Haz clic en Guardar para confirmar.`,
        });
      } else {
        throw new Error("Datos inválidos de la API");
      }
    } catch {
      setBcvMessage({
        type: "error",
        text: "No se pudo obtener la tasa en tiempo real.",
      });
    } finally {
      setSavingBcv(false);
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Resumen general de tu tienda MotoParts.
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          {
            label: "Productos",
            value: metrics?.totalProducts,
            icon: <Package size={20} />,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Stock Total",
            value: `${metrics?.totalStock} unds`,
            icon: <Package size={20} />,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Pedidos",
            value: metrics?.totalOrders,
            icon: <ShoppingBag size={20} />,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Pendientes",
            value: metrics?.pendingOrders,
            icon: <AlertCircle size={20} />,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Ingresos",
            value: `$${metrics?.totalRevenue.toFixed(2)}`,
            icon: <TrendingUp size={20} />,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Agencias",
            value: metrics?.activeAgencies,
            icon: <Truck size={20} />,
            color: "text-[#e3000f]",
            bg: "bg-red-50",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <div
              className={`w-9 h-9 ${m.bg} ${m.color} rounded-xl flex items-center justify-center mb-3`}
            >
              {m.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
              {m.label}
            </p>
            <p className={`text-xl font-extrabold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Actualizador de Tasa BCV */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          <DollarSign className="text-[#e3000f]" size={20} /> Tasa BCV
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Tasa actual:{" "}
          <span className="font-bold text-gray-800">
            Bs. {metrics?.bcvRate.toFixed(2)}
          </span>
        </p>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-gray-400 font-bold text-sm">
              Bs.
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={bcvInput}
              onChange={(e) => setBcvInput(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
              placeholder="Ej. 36.50"
            />
          </div>
          <button
            onClick={handleUpdateBcv}
            disabled={savingBcv}
            className="bg-[#e3000f] text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center gap-2 shadow-sm"
          >
            {savingBcv ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Guardar
          </button>
          <button
            onClick={fetchLiveBcv}
            disabled={savingBcv}
            title="Obtener tasa en tiempo real de la API"
            className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {bcvMessage && (
          <div
            className={`mt-3 flex items-center gap-2 text-sm font-medium rounded-lg p-3 ${
              bcvMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {bcvMessage.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {bcvMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
