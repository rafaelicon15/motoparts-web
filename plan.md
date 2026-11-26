# MotoParts — plantilla comercial

## Objetivo
Convertir la tienda de repuestos en una base reutilizable para ofrecer a otros comercios: portada comercial, catálogo navegable, búsqueda, filtros, carrito y modo demo que no depende de que Supabase ya tenga productos.

## Diseño
- **Movimiento:** e-commerce automotriz editorial, con contraste alto y acentos de taller.
- **Principios:** confianza visible, lectura rápida, jerarquía de precio clara y componentes preparados para reemplazar marca/contenido.
- **Paleta:** rojo de acción para compra y alertas; carbón para autoridad; fondos cálidos para que el producto domine.
- **Layout:** hero compacto, controles de catálogo y tarjetas densas; contenido útil antes que decoración.
- **Elementos distintivos:** banda de confianza, chips de categoría y precios USD/BS lado a lado.
- **Interacción:** búsqueda y filtros conservan el contexto en la URL; las tarjetas dan feedback inmediato al añadir.
- **Tipografía:** Inter del starter, con titulares pesados y etiquetas en mayúsculas para una lectura de mostrador.
- **Marca:** MotoParts se presenta como un catálogo confiable, directo y preparado para ventas detal/mayor.

## Implementación
- Supabase conserva prioridad cuando devuelve productos reales.
- Si el catálogo está vacío o no hay variables de conexión, se muestran productos demo locales.
- La portada usa parámetros `q` y `category` para búsqueda y filtrado sin añadir dependencias.
- Los productos demo tienen ficha de detalle y pueden añadirse al carrito.
