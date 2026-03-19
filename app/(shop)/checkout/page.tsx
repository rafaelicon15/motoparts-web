// app/(shop)/checkout/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Upload,
  ShoppingBag,
  CheckCircle,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

// --- TIPOS ---
type ShippingAgency = {
  id: string;
  name: string;
  is_active: boolean;
};

type PaymentMethod = {
  id: string;
  name: string;
  is_active: boolean;
  requires_receipt: boolean;
  store_pickup_only: boolean;
  surcharge_type: "none" | "fixed" | "percentage";
  surcharge_value: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // --- Datos de la BD ---
  const [agencies, setAgencies] = useState<ShippingAgency[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [bcvRate, setBcvRate] = useState<number>(36.5);
  const [loadingData, setLoadingData] = useState(true);

  // --- Formulario ---
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerCity: "",
    deliveryMethod: "agency", // 'agency' | 'pickup'
    selectedAgencyId: "",
    selectedPaymentId: "",
    referenceNumber: "",
  });

  // --- Comprobante ---
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Estado del proceso ---
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hidratación segura
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar datos de la BD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agenciesRes, paymentsRes, settingsRes] = await Promise.all([
          supabase
            .from("shipping_agencies")
            .select("id, name, is_active")
            .eq("is_active", true)
            .order("name"),
          supabase
            .from("payment_methods")
            .select("*")
            .eq("is_active", true)
            .order("name"),
          supabase
            .from("system_settings")
            .select("key_value")
            .eq("key_name", "last_bcv_rate")
            .single(),
        ]);

        if (agenciesRes.data) setAgencies(agenciesRes.data);
        if (paymentsRes.data) setPaymentMethods(paymentsRes.data);
        if (settingsRes.data?.key_value) {
          setBcvRate(parseFloat(settingsRes.data.key_value));
        }

        // Preseleccionar primeros valores
        if (agenciesRes.data && agenciesRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            selectedAgencyId: agenciesRes.data[0].id,
          }));
        }
        if (paymentsRes.data && paymentsRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            selectedPaymentId: paymentsRes.data[0].id,
          }));
        }
      } catch (err) {
        console.error("Error cargando datos del checkout:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // --- Cálculos ---
  const selectedPayment = paymentMethods.find(
    (p) => p.id === formData.selectedPaymentId
  );
  const selectedAgency = agencies.find(
    (a) => a.id === formData.selectedAgencyId
  );

  const subtotalUSD = isMounted
    ? cart.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0)
    : 0;

  const surcharge = (() => {
    if (!selectedPayment) return 0;
    if (selectedPayment.surcharge_type === "fixed")
      return selectedPayment.surcharge_value;
    if (selectedPayment.surcharge_type === "percentage")
      return (subtotalUSD * selectedPayment.surcharge_value) / 100;
    return 0;
  })();

  const totalUSD = subtotalUSD + surcharge;
  const totalBs = (totalUSD * bcvRate).toFixed(2);

  // --- Manejo de comprobante ---
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Envío del formulario ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      setError("Por favor completa tu nombre y teléfono.");
      return;
    }
    if (
      formData.deliveryMethod === "agency" &&
      !formData.selectedAgencyId
    ) {
      setError("Por favor selecciona una agencia de envío.");
      return;
    }
    if (!formData.selectedPaymentId) {
      setError("Por favor selecciona un método de pago.");
      return;
    }
    if (selectedPayment?.requires_receipt && !receiptFile) {
      setError(
        `El método "${selectedPayment.name}" requiere adjuntar el comprobante de pago.`
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1. Subir comprobante a Storage (si existe)
      let receiptUrl: string | null = null;
      if (receiptFile) {
        const fileName = `receipt-${Date.now()}-${receiptFile.name.replace(/\s/g, "_")}`;
        const { error: storageError } = await supabase.storage
          .from("payment_receipts")
          .upload(fileName, receiptFile, { contentType: receiptFile.type });

        if (storageError) throw new Error("Error subiendo comprobante: " + storageError.message);

        receiptUrl = supabase.storage
          .from("payment_receipts")
          .getPublicUrl(fileName).data.publicUrl;
      }

      // 2. Guardar la orden en la base de datos
      const deliveryLabel =
        formData.deliveryMethod === "pickup"
          ? "Retiro en tienda"
          : selectedAgency?.name || "Agencia";

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: formData.customerName.trim(),
            customer_phone: formData.customerPhone.trim(),
            customer_city: formData.customerCity.trim() || null,
            delivery_method: deliveryLabel,
            payment_method: selectedPayment?.name || "",
            subtotal_usd: subtotalUSD,
            surcharge_usd: surcharge,
            total_usd: totalUSD,
            total_bs: parseFloat(totalBs),
            bcv_rate: bcvRate,
            reference_number: formData.referenceNumber.trim() || null,
            receipt_url: receiptUrl,
            status: "pending",
          },
        ])
        .select("id")
        .single();

      if (orderError) throw new Error("Error guardando orden: " + orderError.message);

      // 3. Guardar los items de la orden
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price_usd: item.priceUSD,
        subtotal_usd: item.priceUSD * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw new Error("Error guardando items: " + itemsError.message);

      // 4. Construir y enviar mensaje de WhatsApp
      const itemsText = cart
        .map(
          (item) =>
            `• ${item.name} x${item.quantity} = $${(item.priceUSD * item.quantity).toFixed(2)}`
        )
        .join("\n");

      const surchargeText =
        surcharge > 0
          ? `\n💳 Recargo (${selectedPayment?.name}): $${surcharge.toFixed(2)}`
          : "";

      const receiptText = receiptUrl
        ? `\n📎 Comprobante: ${receiptUrl}`
        : "";

      const refText = formData.referenceNumber
        ? `\n🔖 Ref. Pago: ${formData.referenceNumber}`
        : "";

      const message = `🏍️ *NUEVO PEDIDO - MotoParts*
━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${formData.customerName}
📞 *Teléfono:* ${formData.customerPhone}
📍 *Ciudad:* ${formData.customerCity || "No especificada"}
🚚 *Envío:* ${deliveryLabel}
━━━━━━━━━━━━━━━━━━━━
🛒 *PRODUCTOS:*
${itemsText}
━━━━━━━━━━━━━━━━━━━━
💵 Subtotal: $${subtotalUSD.toFixed(2)}${surchargeText}
💰 *TOTAL: $${totalUSD.toFixed(2)} | Bs. ${totalBs}*
💱 Tasa BCV: ${bcvRate.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━
💳 *Pago:* ${selectedPayment?.name || ""}${refText}${receiptText}
🆔 *Orden #:* ${orderData.id.split("-")[0].toUpperCase()}`;

      const whatsappNumber = "584121234567"; // Reemplazar con número real
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // 5. Limpiar carrito y redirigir
      clearCart();
      window.open(whatsappUrl, "_blank");
      router.push("/checkout/success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al procesar tu pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Renderizado ---
  if (!isMounted || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#e3000f]" size={40} />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-500 mb-6">
          Agrega productos antes de proceder al pago.
        </p>
        <Link
          href="/"
          className="bg-[#e3000f] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8">
      <Link
        href="/cart"
        className="flex items-center gap-2 text-gray-500 hover:text-[#e3000f] mb-6 transition-colors w-fit"
      >
        <ArrowLeft size={20} /> Volver al carrito
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Finalizar Pedido
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* ---- COLUMNA IZQUIERDA (2/3) ---- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos del Cliente */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="text-[#e3000f]" size={20} /> Datos del Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="Ej. 0414-1234567"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Ciudad / Estado
                </label>
                <input
                  type="text"
                  placeholder="Ej. Caracas, Miranda"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
                  value={formData.customerCity}
                  onChange={(e) =>
                    setFormData({ ...formData, customerCity: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Método de Entrega */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="text-[#e3000f]" size={20} /> Método de Entrega
            </h2>

            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, deliveryMethod: "agency" })
                }
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  formData.deliveryMethod === "agency"
                    ? "border-[#e3000f] bg-red-50 text-[#e3000f]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                🚚 Envío por Agencia
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, deliveryMethod: "pickup" })
                }
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  formData.deliveryMethod === "pickup"
                    ? "border-[#e3000f] bg-red-50 text-[#e3000f]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                🏪 Retiro en Tienda
              </button>
            </div>

            {formData.deliveryMethod === "agency" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selecciona la agencia
                </label>
                {agencies.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No hay agencias disponibles.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {agencies.map((agency) => (
                      <button
                        key={agency.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            selectedAgencyId: agency.id,
                          })
                        }
                        className={`py-2.5 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                          formData.selectedAgencyId === agency.id
                            ? "border-[#e3000f] bg-red-50 text-[#e3000f]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {agency.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {formData.deliveryMethod === "pickup" && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-800 mb-1">
                  📍 Dirección de la tienda
                </p>
                <p>Av. Principal, Local MotoParts — Caracas, Venezuela</p>
                <p className="mt-1 text-xs text-gray-400">
                  Horario: Lun–Sáb 8am–6pm
                </p>
              </div>
            )}
          </div>

          {/* Método de Pago */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="text-[#e3000f]" size={20} /> Método de
              Pago
            </h2>

            {paymentMethods.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                No hay métodos de pago disponibles.
              </p>
            ) : (
              <div className="space-y-2">
                {paymentMethods
                  .filter(
                    (pm) =>
                      !pm.store_pickup_only ||
                      formData.deliveryMethod === "pickup"
                  )
                  .map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.selectedPaymentId === pm.id
                          ? "border-[#e3000f] bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={formData.selectedPaymentId === pm.id}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            selectedPaymentId: pm.id,
                          })
                        }
                        className="mt-1 accent-[#e3000f]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{pm.name}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {pm.requires_receipt && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                              Requiere comprobante
                            </span>
                          )}
                          {pm.store_pickup_only && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                              Solo retiro en tienda
                            </span>
                          )}
                          {pm.surcharge_type !== "none" && (
                            <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                              +{pm.surcharge_type === "fixed" ? `$${pm.surcharge_value}` : `${pm.surcharge_value}%`}{" "}
                              recargo
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            )}

            {/* Número de referencia */}
            {selectedPayment && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Número de referencia{" "}
                  {selectedPayment.requires_receipt ? "(opcional)" : ""}
                </label>
                <input
                  type="text"
                  placeholder="Ej. 123456789"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referenceNumber: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Subida de comprobante */}
            {selectedPayment?.requires_receipt && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comprobante de pago *
                </label>
                {receiptPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={receiptPreview}
                      alt="Comprobante"
                      className="max-h-40 rounded-xl border border-gray-200 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeReceipt}
                      className="absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-500 hover:text-white border border-gray-200 p-1 rounded-full shadow"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[#e3000f] hover:bg-red-50 transition-all">
                    <Upload size={28} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-500">
                      Haz clic para subir tu comprobante
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG o PDF — máx. 5MB
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleReceiptChange}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* ---- COLUMNA DERECHA (1/3) — RESUMEN ---- */}
        <div className="space-y-4">
          <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-5 border-b border-gray-700 pb-4">
              Resumen del Pedido
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-300 truncate max-w-[60%]">
                    {item.name}{" "}
                    <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                  <span className="font-bold text-white">
                    ${(item.priceUSD * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>${subtotalUSD.toFixed(2)}</span>
              </div>
              {surcharge > 0 && (
                <div className="flex justify-between text-sm text-orange-400">
                  <span>Recargo ({selectedPayment?.name})</span>
                  <span>+${surcharge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-400">
                <span>Tasa BCV</span>
                <span>Bs. {bcvRate.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-4 pt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-lg">Total USD</span>
                <span className="text-2xl font-extrabold text-[#e3000f]">
                  ${totalUSD.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Total Bs.</span>
                <span className="font-semibold text-gray-300">
                  Bs. {totalBs}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-[#e3000f] text-white py-4 rounded-xl font-extrabold text-base hover:bg-red-700 disabled:bg-gray-600 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Confirmar y Enviar por WhatsApp
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-500 text-center mt-3">
              Al confirmar, se abrirá WhatsApp con el resumen de tu pedido.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
