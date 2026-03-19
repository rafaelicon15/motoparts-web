-- =====================================================
-- MotoParts Web - Migraciones de Base de Datos
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- 1. TABLA: orders (Historial de Órdenes)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Datos del cliente
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT,
  
  -- Entrega y pago
  delivery_method TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  receipt_url TEXT,
  
  -- Montos
  subtotal_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  surcharge_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_bs NUMERIC(12, 2) NOT NULL DEFAULT 0,
  bcv_rate NUMERIC(10, 4) NOT NULL DEFAULT 0,
  
  -- Estado
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled'))
);

-- 2. TABLA: order_items (Detalle de Productos por Orden)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_usd NUMERIC(10, 2) NOT NULL,
  subtotal_usd NUMERIC(10, 2) NOT NULL
);

-- 3. ÍNDICES para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 4. FUNCIÓN: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS (Row Level Security) - Permitir inserción pública (desde el checkout)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede insertar órdenes (clientes del checkout)
CREATE POLICY "Allow public insert on orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public insert on order_items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Solo autenticados pueden leer (panel admin)
CREATE POLICY "Allow authenticated read on orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on order_items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo autenticados pueden actualizar el estado
CREATE POLICY "Allow authenticated update on orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

-- =====================================================
-- STORAGE BUCKETS (ejecutar en Storage > New Bucket)
-- =====================================================
-- Bucket 1: "products" (ya debería existir)
-- Bucket 2: "payment_receipts" (NUEVO - público)
-- 
-- Para crear vía SQL:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('payment_receipts', 'payment_receipts', true)
-- ON CONFLICT DO NOTHING;
-- 
-- Política de Storage para payment_receipts:
-- Permitir INSERT a anon y authenticated
-- CREATE POLICY "Allow public upload to payment_receipts"
--   ON storage.objects FOR INSERT
--   TO anon, authenticated
--   WITH CHECK (bucket_id = 'payment_receipts');
-- 
-- CREATE POLICY "Allow public read from payment_receipts"
--   ON storage.objects FOR SELECT
--   TO anon, authenticated
--   USING (bucket_id = 'payment_receipts');
