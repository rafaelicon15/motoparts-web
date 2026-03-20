// app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  CreditCard,
  Truck,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Check,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";

// --- TIPOS ---
type PaymentMethod = {
  id: string;
  name: string;
  is_active: boolean;
  requires_receipt: boolean;
  store_pickup_only: boolean;
  surcharge_type: "none" | "fixed" | "percentage";
  surcharge_value: number;
  comment?: string;
};

type ShippingAgency = {
  id: string;
  name: string;
  is_active: boolean;
};

const EMPTY_PAYMENT: Omit<PaymentMethod, "id"> = {
  name: "",
  is_active: true,
  requires_receipt: false,
  store_pickup_only: false,
  surcharge_type: "none",
  surcharge_value: 0,
  comment: "",
};

export default function SettingsPage() {
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [agencies, setAgencies] = useState<ShippingAgency[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulario de método de pago
  const [paymentForm, setPaymentForm] = useState<Partial<PaymentMethod>>(EMPTY_PAYMENT);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [savingPayment, setSavingPayment] = useState(false);

  // Formulario de agencia
  const [newAgencyName, setNewAgencyName] = useState("");
  const [savingAgency, setSavingAgency] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [pmRes, agRes] = await Promise.all([
      supabase.from("payment_methods").select("*").order("name"),
      supabase.from("shipping_agencies").select("id, name, is_active").order("name"),
    ]);
    if (pmRes.data) setPayments(pmRes.data);
    if (agRes.data) setAgencies(agRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- MÉTODOS DE PAGO ---
  const handleEditPayment = (pm: PaymentMethod) => {
    setEditingPaymentId(pm.id);
    setPaymentForm({ ...pm });
  };

  const handleCancelPayment = () => {
    setEditingPaymentId(null);
    setPaymentForm(EMPTY_PAYMENT);
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.name?.trim()) return;
    setSavingPayment(true);

    const payload = {
      name: paymentForm.name.trim(),
      is_active: paymentForm.is_active ?? true,
      requires_receipt: paymentForm.requires_receipt ?? false,
      store_pickup_only: paymentForm.store_pickup_only ?? false,
      surcharge_type: paymentForm.surcharge_type ?? "none",
      surcharge_value: Number(paymentForm.surcharge_value) || 0,
      comment: paymentForm.comment?.trim() || null,
    };

    let error;
    if (editingPaymentId) {
      const { error: err } = await supabase
        .from("payment_methods")
        .update(payload)
        .eq("id", editingPaymentId);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("payment_methods")
        .insert([payload]);
      error = err;
    }

    if (error) {
      alert("Error: " + error.message);
    } else {
      handleCancelPayment();
      fetchData();
    }
    setSavingPayment(false);
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("¿Eliminar este método de pago?")) return;
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);
    if (error) alert("Error: " + error.message);
    else fetchData();
  };

  const handleTogglePayment = async (pm: PaymentMethod) => {
    const { error } = await supabase
      .from("payment_methods")
      .update({ is_active: !pm.is_active })
      .eq("id", pm.id);
    if (!error) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === pm.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    }
  };

  // --- AGENCIAS ---
  const handleAddAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName.trim()) return;
    setSavingAgency(true);
    const { error } = await supabase
      .from("shipping_agencies")
      .insert([{ name: newAgencyName.trim(), is_active: true }]);
    if (error) alert("Error: " + error.message);
    else {
      setNewAgencyName("");
      fetchData();
    }
    setSavingAgency(false);
  };

  const handleToggleAgency = async (ag: ShippingAgency) => {
    const { error } = await supabase
      .from("shipping_agencies")
      .update({ is_active: !ag.is_active })
      .eq("id", ag.id);
    if (!error) {
      setAgencies((prev) =>
        prev.map((a) =>
          a.id === ag.id ? { ...a, is_active: !a.is_active } : a
        )
      );
    }
  };

  const handleDeleteAgency = async (id: string) => {
    if (!confirm("¿Eliminar esta agencia?")) return;
    const { error } = await supabase
      .from("shipping_agencies")
      .delete()
      .eq("id", id);
    if (error) alert("Error: " + error.message);
    else fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#e3000f]" size={36} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Métodos de Pago & Agencias
        </h1>
        <p className="text-gray-500 mt-1">
          Configura los métodos de pago y las agencias de envío disponibles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ---- MÉTODOS DE PAGO ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
            <CreditCard className="text-[#e3000f]" size={22} /> Métodos de Pago
          </h2>

          {/* Formulario */}
          <form
            onSubmit={handleSavePayment}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6 space-y-3"
          >
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              {editingPaymentId ? "Editando Método" : "Nuevo Método de Pago"}
            </h3>

            <input
              required
              type="text"
              placeholder="Nombre (Ej. Pago Móvil, Zelle, Efectivo)"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
              value={paymentForm.name || ""}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, name: e.target.value })
              }
            />

            <textarea
              placeholder="Comentario (opcional - se mostrará en el checkout)"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#e3000f] focus:outline-none resize-none"
              rows={2}
              value={paymentForm.comment || ""}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, comment: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentForm.requires_receipt ?? false}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      requires_receipt: e.target.checked,
                    })
                  }
                  className="accent-[#e3000f] w-4 h-4"
                />
                Exige comprobante
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentForm.store_pickup_only ?? false}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      store_pickup_only: e.target.checked,
                    })
                  }
                  className="accent-[#e3000f] w-4 h-4"
                />
                Solo retiro en tienda
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Tipo de Recargo
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#e3000f] focus:outline-none bg-white"
                  value={paymentForm.surcharge_type || "none"}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      surcharge_type: e.target.value as "none" | "fixed" | "percentage",
                    })
                  }
                >
                  <option value="none">Sin recargo</option>
                  <option value="fixed">Monto fijo ($)</option>
                  <option value="percentage">Porcentaje (%)</option>
                </select>
              </div>
              {paymentForm.surcharge_type !== "none" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                    Valor del Recargo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={
                      paymentForm.surcharge_type === "fixed" ? "Ej. 2.00" : "Ej. 3.5"
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
                    value={paymentForm.surcharge_value || ""}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        surcharge_value: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingPayment}
                className="flex-1 bg-[#e3000f] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
              >
                {savingPayment ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {editingPaymentId ? "Actualizar" : "Guardar"}
              </button>
              {editingPaymentId && (
                <button
                  type="button"
                  onClick={handleCancelPayment}
                  className="px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Lista */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {payments.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay métodos de pago configurados.
              </p>
            )}
            {payments.map((pm) => (
              <div
                key={pm.id}
                className={`border rounded-xl p-3 flex items-center justify-between gap-3 transition-colors ${
                  pm.is_active
                    ? "border-gray-200 bg-white"
                    : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">
                    {pm.name}
                  </p>
                  {pm.comment && (
                    <p className="text-xs text-gray-500 mt-0.5">{pm.comment}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pm.requires_receipt && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                        Comprobante
                      </span>
                    )}
                    {pm.store_pickup_only && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                        Solo tienda
                      </span>
                    )}
                    {pm.surcharge_type !== "none" && (
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">
                        +
                        {pm.surcharge_type === "fixed"
                          ? `$${pm.surcharge_value}`
                          : `${pm.surcharge_value}%`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePayment(pm)}
                    className={`transition-colors ${
                      pm.is_active ? "text-green-500" : "text-gray-400"
                    }`}
                    title={pm.is_active ? "Desactivar" : "Activar"}
                  >
                    {pm.is_active ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                  <button
                    onClick={() => handleEditPayment(pm)}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDeletePayment(pm.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- AGENCIAS DE ENVÍO ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Truck className="text-[#e3000f]" size={22} /> Agencias de Envío
          </h2>

          {/* Formulario */}
          <form
            onSubmit={handleAddAgency}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6"
          >
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
              Nueva Agencia
            </h3>
            <div className="flex gap-2">
              <input
                required
                type="text"
                placeholder="Ej. MRW, ZOOM, TEALCA..."
                className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
                value={newAgencyName}
                onChange={(e) => setNewAgencyName(e.target.value)}
              />
              <button
                type="submit"
                disabled={savingAgency}
                className="bg-[#e3000f] text-white px-4 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-1 transition-colors"
              >
                {savingAgency ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
              </button>
            </div>
          </form>

          {/* Lista */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {agencies.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay agencias configuradas.
              </p>
            )}
            {agencies.map((ag) => (
              <div
                key={ag.id}
                className={`border rounded-xl p-3 flex items-center justify-between gap-3 transition-colors ${
                  ag.is_active
                    ? "border-gray-200 bg-white"
                    : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2">
                  {ag.is_active ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <X size={16} className="text-gray-400" />
                  )}
                  <span className="font-semibold text-gray-800 text-sm">
                    {ag.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleAgency(ag)}
                    className={`transition-colors ${
                      ag.is_active ? "text-green-500" : "text-gray-400"
                    }`}
                    title={ag.is_active ? "Desactivar" : "Activar"}
                  >
                    {ag.is_active ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteAgency(ag.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
