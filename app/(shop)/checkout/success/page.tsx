// app/(shop)/checkout/success/page.tsx
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
        <CheckCircle size={72} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          ¡Pedido Registrado!
        </h1>
        <p className="text-gray-500 mb-2 text-lg">
          Tu orden ha sido guardada correctamente.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Se abrió WhatsApp con el resumen de tu pedido. Nuestro equipo te
          contactará pronto para confirmar la entrega.
        </p>
        <Link
          href="/"
          className="bg-[#e3000f] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition-colors inline-block"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
