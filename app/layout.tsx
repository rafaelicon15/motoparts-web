// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

// Usamos la fuente Inter para un aspecto moderno y limpio
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MotoParts - Tu Tienda de Repuestos",
  description: "Encuentra repuestos de moto al detal y al mayor con los mejores precios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        {/* El Header global de la tienda */}
        <Header />
        
        {/* Aquí se inyectará el contenido de cada página */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}