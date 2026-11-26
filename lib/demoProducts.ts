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
};

export const demoProducts: StoreProduct[] = [
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
    id: 'demo-pastillas-freno-delanteras',
    name: 'Pastillas de freno delanteras cerámicas',
    category: 'Frenos',
    description: 'Frenado progresivo y silencioso para motos de calle. Instalación sencilla.',
    price_usd: 12.5,
    wholesale_price_usd: 10.5,
    stock: 42,
    units_per_box: 1,
    sale_mode: 'both',
    image_url: 'https://images.unsplash.com/photo-1529422643029-d4585747aaf2?auto=format&fit=crop&w=900&q=85',
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
