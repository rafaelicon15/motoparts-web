-- =====================================================
-- MotoParts Web - Actualización de Migraciones v2
-- Ejecutar después de supabase_migrations_v2.sql
-- =====================================================

-- Agregar columnas de guía de envío a la tabla orders si no existen
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_guide_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_guide_sent BOOLEAN DEFAULT false;

-- Crear índice para búsquedas rápidas de guías
CREATE INDEX IF NOT EXISTS idx_orders_shipping_guide_sent 
  ON orders(shipping_guide_sent) 
  WHERE delivery_type = 'agency';
