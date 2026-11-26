// app/admin/orders/details/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Download,
  Upload,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Truck,
  User,
  DollarSign,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import Link from "next/link";

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_cedula: string;
  subtotal_usd: number;
  payment_method: string;
  status: string;
  delivery_type: string;
  state?: string;
  branch_name?: string;
  created_at: string;
  shipping_guide_url?: string;
  shipping_guide_sent?: boolean;
};

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  price_usd: number;
};

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (err: any) {
      setMessage({ type: "error", text: "Error cargando pedido" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUploadGuide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orderId) return;

    setUploading(true);
    try {
      const fileName = `guides/${orderId}_${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("payment_receipts")
        .upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("payment_receipts").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          shipping_guide_url: publicUrl,
          shipping_guide_sent: false,
        })
        .eq("id", orderId);

      if (updateError) throw updateError;

      setMessage({
        type: "success",
        text: "Guía de envío cargada exitosamente",
      });
      fetchOrder();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: "Error cargando guía: " + err.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSendGuideEmail = async () => {
    if (!order || !order.shipping_guide_url) return;

    setSendingEmail(true);
    try {
      // Aquí iría la lógica para enviar email
      // Por ahora, simularemos que se envió
      const { error } = await supabase
        .from("orders")
        .update({ shipping_guide_sent: true })
        .eq("id", orderId);

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Guía de envío enviada al cliente por email",
      });
      fetchOrder();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: "Error enviando email: " + err.message,
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#e3000f]" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <p className="text-gray-600">Pedido no encontrado</p>
        <Link
          href="/admin/orders"
          className="text-[#e3000f] hover:underline mt-4 inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Volver a Pedidos
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price_usd * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-[#e3000f] hover:underline flex items-center gap-2 mb-2"
          >
            <ArrowLeft size={16} /> Volver a Pedidos
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Pedido #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-500 mt-1">
            {new Date(order.created_at).toLocaleDateString("es-VE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold text-white ${
          order.status === "Entregado"
            ? "bg-green-500"
            : order.status === "Cancelado"
            ? "bg-red-500"
            : order.status === "Enviado"
            ? "bg-blue-500"
            : "bg-yellow-500"
        }`}>
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Cliente */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos del Cliente */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="text-[#e3000f]" size={20} /> Información del Cliente
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Nombre</p>
                <p className="text-gray-900 font-semibold">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Cédula/RIF</p>
                <p className="text-gray-900 font-semibold">{order.customer_cedula}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Teléfono</p>
                <p className="text-gray-900 font-semibold">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Correo</p>
                <p className="text-gray-900 font-semibold text-sm">{order.customer_email}</p>
              </div>
            </div>
          </div>

          {/* Entrega */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Truck className="text-[#e3000f]" size={20} /> Información de Entrega
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Tipo de Entrega</p>
                <p className="text-gray-900 font-semibold">
                  {order.delivery_type === "store_pickup"
                    ? "Retiro en Tienda"
                    : "Envío por Agencia"}
                </p>
              </div>
              {order.delivery_type === "agency" && (
                <>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Estado</p>
                    <p className="text-gray-900 font-semibold">{order.state}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Sucursal</p>
                    <p className="text-gray-900 font-semibold">{order.branch_name}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Productos</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${(item.price_usd * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Carga de Guía de Envío */}
          {order.delivery_type === "agency" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-[#e3000f]" size={20} /> Guía de Envío
              </h2>

              {order.shipping_guide_url ? (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={20} />
                      <div>
                        <p className="font-semibold text-green-900">Guía cargada</p>
                        <p className="text-sm text-green-700">
                          {order.shipping_guide_sent
                            ? "Enviada al cliente"
                            : "Pendiente de envío"}
                        </p>
                      </div>
                    </div>
                    <a
                      href={order.shipping_guide_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#e3000f] hover:underline flex items-center gap-1"
                    >
                      <Download size={16} /> Ver
                    </a>
                  </div>

                  {!order.shipping_guide_sent && (
                    <button
                      onClick={handleSendGuideEmail}
                      disabled={sendingEmail}
                      className="w-full bg-[#e3000f] text-white py-2.5 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
                    >
                      {sendingEmail ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Mail size={18} />
                      )}
                      {sendingEmail ? "Enviando..." : "Enviar Guía por Email"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600 font-medium mb-3">
                    Carga la guía de envío (PDF, PNG, JPG)
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleUploadGuide}
                      disabled={uploading}
                      className="hidden"
                    />
                    <span className="bg-[#e3000f] text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 cursor-pointer inline-flex items-center gap-2 disabled:bg-gray-400 transition-colors">
                      {uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploading ? "Cargando..." : "Seleccionar Archivo"}
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="text-[#e3000f]" size={20} /> Resumen
          </h2>

          <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Método de Pago</span>
              <span className="font-semibold text-sm">{order.payment_method}</span>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg text-[#e3000f]">
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
            <p className="font-semibold mb-1">ID del Pedido:</p>
            <p className="font-mono break-all">{order.id}</p>
          </div>
        </div>
      </div>

      {/* Mensaje */}
      {message && (
        <div
          className={`fixed bottom-4 right-4 flex items-center gap-2 text-sm font-medium rounded-lg p-4 ${
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
  );
}
