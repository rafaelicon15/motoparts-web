// app/(shop)/layout.tsx
import Header from "@/components/Header";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* El Header con la barra roja, buscador y categorías */}
      <Header />
      
      {/* El contenido de la página (Catálogo, Carrito, etc.) */}
      <main className="flex-1 w-full bg-gray-50">
        {children}
      </main>

      {/* Footer Corporativo */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 px-4 md:px-8 border-t-4 border-[#e3000f]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-xl font-extrabold mb-4">
              Moto<span className="text-[#e3000f]">Parts</span>
            </h3>
            <p className="text-sm text-gray-400">
              El catálogo más completo de repuestos para motos a nivel nacional. Calidad garantizada en ventas al detal y mayor.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition">Catálogo completo</a></li>
              <li><a href="/terms" className="hover:text-white transition">Términos y Condiciones</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Política de Privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Atención: 0800-MOTOPART</li>
              <li>WhatsApp: +58 412-0000000</li>
              <li>Email: ventas@motoparts.com</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 pt-8 border-t border-gray-800">
          &copy; {new Date().getFullYear()} MotoParts. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}