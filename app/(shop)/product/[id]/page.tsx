// app/(shop)/product/[id]/page.tsx
import { supabase } from "@/lib/supabase";
import { getBcvRate } from "@/lib/dolarApi";
import { notFound } from "next/navigation";
import { Package, ArrowLeft, Tag, Layers } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: product }, bcvRate] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    getBcvRate(),
  ]);

  if (!product) notFound();

  const priceUsd = Number(product.price_usd) || 0;
  const wholesaleUsd = Number(product.wholesale_price_usd) || 0;
  const priceBs = (priceUsd * bcvRate).toFixed(2);
  const wholesaleBs = (wholesaleUsd * bcvRate).toFixed(2);
  const inStock = Number(product.stock) > 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-gray-500 hover:text-[#e3000f] mb-6 transition-colors w-fit"
      >
        <ArrowLeft size={20} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen Principal */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center aspect-square">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="max-w-full max-h-full object-contain drop-shadow-md"
            />
          ) : (
            <Package size={96} className="text-gray-200" />
          )}
        </div>

        {/* Información */}
        <div className="flex flex-col gap-5">
          {/* Categoría y nombre */}
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {product.category || "General"}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Precios */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            {product.sale_mode !== "wholesale_only" && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Precio Detal
                  </p>
                  <p className="text-3xl font-extrabold text-[#e3000f]">
                    ${priceUsd.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Bs. {priceBs}</p>
                </div>
              </div>
            )}

            {product.sale_mode !== "retail_only" && wholesaleUsd > 0 && (
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <div>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wide">
                    Precio Mayorista
                  </p>
                  <p className="text-2xl font-extrabold text-green-600">
                    ${wholesaleUsd.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Bs. {wholesaleBs}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-full">
                  Precio Mayor
                </span>
              </div>
            )}

            <p className="text-xs text-gray-400 border-t border-gray-200 pt-3">
              Tasa BCV: Bs. {bcvRate.toFixed(2)} — Los precios en Bs. son
              referenciales.
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-400"}`}
            />
            <span
              className={`text-sm font-semibold ${inStock ? "text-green-700" : "text-red-600"}`}
            >
              {inStock
                ? `${product.stock} unidades disponibles`
                : "Sin stock disponible"}
            </span>
          </div>

          {/* Descripción */}
          {product.description && (
            <div>
              <h2 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Descripción
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Detalles adicionales */}
          <div className="grid grid-cols-2 gap-3">
            {product.category && (
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-2">
                <Tag size={16} className="text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Categoría
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {product.category}
                  </p>
                </div>
              </div>
            )}
            {product.units_per_box > 1 && (
              <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-2">
                <Layers size={16} className="text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Unids/Caja
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {product.units_per_box} unidades
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botón de carrito */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              priceUSD: priceUsd,
            }}
            inStock={inStock}
          />
        </div>
      </div>

      {/* Galería */}
      {product.gallery_urls && product.gallery_urls.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-[#e3000f] pb-2 inline-block">
            Galería de Imágenes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {product.gallery_urls.map((url: string, idx: number) => (
              <div
                key={idx}
                className="aspect-square bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center p-3"
              >
                <img
                  src={url}
                  alt={`${product.name} - imagen ${idx + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
