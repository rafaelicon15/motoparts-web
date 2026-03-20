// app/admin/orders/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  ChevronDown,
  ExternalLink,
  Eye,
  X,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  RefreshCw,
} from "lucide-react";

// --- TIPOS ---
type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  price_usd: number;
  subtotal_usd: number;
};

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string | null;
  delivery_method: string;
  payment_method: string;
  reference_number: string | null;
  receipt_url: string | null;
  subtotal_usd: number;
  surcharge_usd: number;
  total_usd: number;
  total_bs: number;
  bcv_rate: number;
  status: OrderStatus;
  order_items?: OrderItem[];
};

// --- CONFIGURACIÓN DE ESTADOS ---
const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pendiente",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Clock size={14} />,
  },
  paid: {
    label: "Pagado",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle size={14} />,
  },
  shipped: {
    label: "Enviado",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Truck size={14} />,
  },
  delivered: {
    label: "Entregado",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <PackageCheck size={14} />,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <XCircle size={14} />,
  },
};

// --- COMPONENTE BADGE DE ESTADO ---
function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// --- COMPONENTE SELECTOR DE ESTADO ---
function StatusSelector({
  orderId,
  currentStatus,
  onUpdate,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdate: (id: string, status: OrderStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSelect = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) {
      setOpen(false);
      return;
    }
    setUpdating(true);
    setOpen(false);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) throw error;
      onUpdate(orderId, newStatus);
    } catch (err: any) {
      alert("Error actualizando estado: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={updating}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50"
      >
        {updating ? (
          <RefreshCw size={12} className="animate-spin" />
        ) : (
          <ChevronDown size={14} />
        )}
        Cambiar
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-20 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[160px] overflow-hidden">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleSelect(key as OrderStatus)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                key === currentStatus ? "font-bold bg-gray-50" : "font-medium"
              }`}
            >
              {config.icon}
              {config.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- MODAL DE DETALLE ---
function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Orden #{order.id.split("-")[0].toUpperCase()}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(order.created_at).toLocaleString("es-VE", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Datos del cliente */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Cliente
              </p>
              <p className="font-bold text-gray-800">{order.customer_name}</p>
              <p className="text-sm text-gray-600">{order.customer_phone}</p>
              {order.customer_city && (
                <p className="text-sm text-gray-500">{order.customer_city}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Entrega & Pago
              </p>
              <p className="font-semibold text-gray-800">
                🚚 {order.delivery_method}
              </p>
              <p className="text-sm text-gray-600">
                💳 {order.payment_method}
              </p>
              {order.reference_number && (
                <p className="text-xs text-gray-500 mt-1">
                  Ref: {order.reference_number}
                </p>
              )}
            </div>
          </div>

          {/* Comprobante */}
          {order.receipt_url && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                Comprobante de Pago
              </p>
              <a
                href={order.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink size={16} /> Ver Comprobante
              </a>
            </div>
          )}

          {/* Productos */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Productos
            </p>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3 text-left font-semibold">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Cant.
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.order_items?.map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.product_name}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        ${item.price_usd.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-800">
                        ${item.subtotal_usd.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="bg-gray-900 text-white rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span>${order.subtotal_usd.toFixed(2)}</span>
            </div>
            {order.surcharge_usd > 0 && (
              <div className="flex justify-between text-sm text-orange-400">
                <span>Recargo</span>
                <span>+${order.surcharge_usd.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-400">
              <span>Tasa BCV</span>
              <span>Bs. {order.bcv_rate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
              <span className="font-bold text-lg">Total</span>
              <div className="text-right">
                <p className="text-xl font-extrabold text-[#e3000f]">
                  ${order.total_usd.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                  Bs. {order.total_bs.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const query = supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error("Error cargando órdenes:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  // Métricas rápidas
  const metrics = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    totalRevenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total_usd, 0),
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Historial de Pedidos
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona y actualiza el estado de las órdenes de tus clientes.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Órdenes",
            value: metrics.total,
            color: "text-gray-900",
          },
          {
            label: "Pendientes",
            value: metrics.pending,
            color: "text-amber-600",
          },
          { label: "Pagadas", value: metrics.paid, color: "text-green-600" },
          {
            label: "Ingresos (USD)",
            value: `$${metrics.totalRevenue.toFixed(2)}`,
            color: "text-[#e3000f]",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
              {m.label}
            </p>
            <p className={`text-2xl font-extrabold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            filterStatus === "all"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Todas ({orders.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = orders.filter((o) => o.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(key as OrderStatus)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filterStatus === key
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw
              size={32}
              className="animate-spin text-gray-300 mx-auto mb-3"
            />
            <p className="text-gray-500 font-medium">Cargando pedidos...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-lg">
              No hay pedidos aún
            </p>
            <p className="text-gray-400 text-sm">
              Los pedidos aparecerán aquí cuando los clientes completen el
              checkout.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50/50">
                  <th className="px-6 py-4 font-semibold">Orden</th>
                  <th className="px-6 py-4 font-semibold">Cliente</th>
                  <th className="px-6 py-4 font-semibold">Entrega</th>
                  <th className="px-6 py-4 font-semibold">Pago</th>
                  <th className="px-6 py-4 font-semibold text-right">Total</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Estado
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => window.location.href = `/admin/orders/details?id=${order.id}`}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 font-mono text-sm">
                        #{order.id.split("-")[0].toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString(
                          "es-VE",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customer_phone}
                      </p>
                      {order.customer_city && (
                        <p className="text-xs text-gray-400">
                          {order.customer_city}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {order.delivery_method}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {order.payment_method}
                      </span>
                      {order.receipt_url && (
                        <a
                          href={order.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-blue-500 hover:text-blue-700 mt-0.5 flex items-center gap-1"
                        >
                          <ExternalLink size={10} /> Ver comprobante
                        </a>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="font-extrabold text-gray-900">
                        ${order.total_usd.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Bs. {order.total_bs.toFixed(2)}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <StatusSelector
                          orderId={order.id}
                          currentStatus={order.status}
                          onUpdate={handleStatusUpdate}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
