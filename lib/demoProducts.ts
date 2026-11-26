export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  price_usd: number;
  wholesale_price_usd: number;
  stock: number;
  units_per_box: number;
  sale_mode: string;
  image_url: string;
  gallery_urls: string[];
  source_url?: string;
  source_label?: string;
};

const mercadoLibreBase = 'https://listado.mercadolibre.com.ve';

export const demoProducts: StoreProduct[] = [
  {
    id: 'ml-pastilla-freno-rk250',
    name: 'Pastilla de freno delantera y trasera RK250',
    category: 'Frenos',
    description: 'Referencia de mercado para una ficha de freno de moto. Verifica modelo, año y disponibilidad antes de comprar.',
    price_usd: 13.98,
    wholesale_price_usd: 11.89,
    stock: 12,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1529422643029-d4585747aaf2?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
    source_url: 'https://articulo.mercadolibre.com.ve/MLV-779699393-pastilla-de-freno-trasera-y-delantera-ambas-rk250-_JM',
    source_label: 'Referencia MercadoLibre Venezuela',
  },
  {
    id: 'ml-pastillas-m04-sintered',
    name: 'Pastillas de freno M04 Sintered',
    category: 'Frenos',
    description: 'Producto de referencia encontrado en MercadoLibre para mostrar cómo se presenta un repuesto importado.',
    price_usd: 7.5,
    wholesale_price_usd: 6.38,
    stock: 24,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
    source_url: 'https://articulo.mercadolibre.com.ve/MLV-1027068804-pastillas-de-freno-m04-sintered-bicicletas-_JM',
    source_label: 'Referencia MercadoLibre Venezuela',
  },
  {
    id: 'ml-base-carburador-pz30',
    name: 'Base de carburador PZ30 CG200 / Bera / Keeway',
    category: 'Motor',
    description: 'Base de carburador para motos de trabajo. Confirma compatibilidad con la medida y el modelo exacto.',
    price_usd: 8.61,
    wholesale_price_usd: 7.32,
    stock: 16,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
    source_url: `${mercadoLibreBase}/accesorios-para-vehiculos/repuestos-motos-y-cuatrimotos/kit-carburador-efco`,
    source_label: 'Referencia MercadoLibre Venezuela',
  },
  {
    id: 'ml-punos-black-moto',
    name: 'Puños Black Moto para manubrio',
    category: 'Accesorios',
    description: 'Muestra de accesorio universal con variaciones de color y aplicación para motos de uso urbano o enduro.',
    price_usd: 7.55,
    wholesale_price_usd: 6.42,
    stock: 30,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
    source_url: `${mercadoLibreBase}/repuestos-varios-para-moto`,
    source_label: 'Categoría de referencia MercadoLibre',
  },
  {
    id: 'ml-llave-gasolina-klr650',
    name: 'Llave de gasolina tipo original para KLR 650',
    category: 'Motor',
    description: 'Ejemplo de ficha por compatibilidad. El cliente puede filtrar por marca, modelo y año desde esta plantilla.',
    price_usd: 19.99,
    wholesale_price_usd: 16.99,
    stock: 8,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1558980394-0c8e0c2e5b8b?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
    source_url: `${mercadoLibreBase}/repuestos-para-todo-tipo-de-motos`,
    source_label: 'Categoría de referencia MercadoLibre',
  },
  {
    id: 'demo-kit-arrastre-428',
    name: 'Kit de arrastre reforzado 428H',
    category: 'Transmisión',
    description: 'Kit completo con cadena, piñón y corona para uso diario y trabajo pesado.',
    price_usd: 34.9,
    wholesale_price_usd: 29.9,
    stock: 18,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
  },
  {
    id: 'demo-filtro-aire-universal',
    name: 'Filtro de aire de alto flujo universal',
    category: 'Motor',
    description: 'Mayor protección para el motor y flujo de aire optimizado para el uso urbano.',
    price_usd: 9.9,
    wholesale_price_usd: 8.25,
    stock: 27,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
  },
  {
    id: 'demo-retrovisores-deportivos',
    name: 'Retrovisores deportivos universales',
    category: 'Accesorios',
    description: 'Par de retrovisores con acabado negro mate y ajuste multiángulo.',
    price_usd: 18.0,
    wholesale_price_usd: 15.0,
    stock: 11,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
  },
  {
    id: 'demo-amortiguadores-traseros',
    name: 'Amortiguadores traseros ajustables',
    category: 'Suspensión',
    description: 'Conjunto de amortiguadores ajustables para mejorar estabilidad y confort.',
    price_usd: 49.0,
    wholesale_price_usd: 42.0,
    stock: 7,
    units_per_box: 2,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
  },
  {
    id: 'demo-bujia-iridium',
    name: 'Bujía Iridium de larga duración',
    category: 'Motor',
    description: 'Encendido confiable, mejor respuesta y rendimiento para motores de 4 tiempos.',
    price_usd: 8.75,
    wholesale_price_usd: 7.25,
    stock: 35,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85',
    gallery_urls: [],
  },
];

export function getDemoProduct(id: string) {
  return demoProducts.find((product) => product.id === id);
}
