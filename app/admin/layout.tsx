// app/admin/layout.tsx
import Header from "@/components/Header";
import Link from "next/link";
import {
  PackageSearch,
  LayoutDashboard,
  Settings,
  LogOut,
  Store,
  FolderTree,
  ShoppingBag,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen font-sans">
      {/* Header Global - Sin carrito ni categorías */}
      <Header hideCategories={true} hideCart={true} />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        {/* Sidebar (Panel Lateral Oscuro) */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex shrink-0">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Moto<span className="text-[#e3000f]">Admin</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Panel de Control</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <PackageSearch size={20} />
              <span className="font-medium">Inventario</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <ShoppingBag size={20} />
              <span className="font-medium">Pedidos</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FolderTree size={20} />
              <span className="font-medium">Catálogo y Marcas</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Settings size={20} />
              <span className="font-medium">Métodos de Pago</span>
            </Link>

            <Link
              href="/admin/store-settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Settings size={20} />
              <span className="font-medium">Configuración Tienda</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Store size={18} /> Ver Tienda
            </Link>
            <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors w-full text-left">
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
