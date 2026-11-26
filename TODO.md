# TODO MotoParts

- [x] Mostrar un catálogo demo útil cuando Supabase está vacío o todavía no está configurado.
- [x] Incorporar búsqueda por nombre, marca o categoría desde la cabecera.
- [x] Incorporar filtros de categoría y estado de resultados.
- [x] Hacer navegables los productos demo hacia una ficha de detalle.
- [x] Mantener precios USD y conversión referencial a Bs. en las tarjetas.
- [x] Crear una muestra comercial con referencias públicas de MercadoLibre, precios de ejemplo, advertencia de disponibilidad y enlaces externos.
- [x] Crear `/admin/config` para identidad visual, datos comerciales, modo de catálogo, precios mayoristas y referencias de marketplace.
- [x] Agregar pasarela de pago de prueba con tarjeta demo y persistencia local de pedidos cuando Supabase no está configurado.
- [x] Mantener carrito funcional con cantidades, eliminación, vaciado y paso al checkout.
- [x] Evitar `Failed to fetch` en tasa BCV, configuración de tienda, pagos y agencias durante el modo demo.
- [x] Configurar el checkout demo para operar con Pago Móvil, transferencia bancaria y Crypto (USDT), solicitando comprobante y sin cobrar tarjetas.
- [x] Persistir en modo demo la tasa BCV, categorías, marcas, agencias y métodos de pago en el navegador.
- [x] Permitir seleccionar varias unidades desde la ficha del producto y ajustar cantidades en el carrito.
- [ ] Crear y conectar el esquema base de Supabase para categorías, marcas, productos, pagos, agencias, pedidos y configuración.
- [ ] Sustituir el fallback demo por persistencia compartida cuando existan credenciales reales de Supabase.
- [ ] Conectar credenciales reales de Supabase en Vercel y cargar el inventario del cliente.
- [ ] Sustituir datos de contacto, logo y colores desde configuración de tienda.
- [ ] Validar checkout, pagos y cálculo de envíos con datos reales.
