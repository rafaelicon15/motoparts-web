-- =====================================================
-- MotoParts Web - Migraciones v2 (Ampliación)
-- Ejecutar después de supabase_migrations.sql
-- =====================================================

-- 1. TABLA: store_config (Configuración de la tienda)
CREATE TABLE IF NOT EXISTS store_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT UNIQUE NOT NULL,
  key_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valores iniciales
INSERT INTO store_config (key_name, key_value) VALUES
  ('store_phone', '+58 412-0000000'),
  ('store_email', 'ventas@motoparts.com'),
  ('store_address', 'Caracas, Venezuela'),
  ('paypal_commission_percent', '2.9'),
  ('paypal_commission_fixed', '0.30')
ON CONFLICT (key_name) DO NOTHING;

-- RLS para store_config
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on store_config"
  ON store_config FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update on store_config"
  ON store_config FOR UPDATE TO authenticated USING (true);

-- 2. TABLA: states (Estados de Venezuela)
CREATE TABLE IF NOT EXISTS states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar todos los estados de Venezuela
INSERT INTO states (name, code) VALUES
  ('Amazonas', 'AM'),
  ('Anzoátegui', 'AN'),
  ('Apure', 'AP'),
  ('Aragua', 'AR'),
  ('Barinas', 'BA'),
  ('Bolívar', 'BO'),
  ('Carabobo', 'CA'),
  ('Cojedes', 'CO'),
  ('Delta Amacuro', 'DA'),
  ('Distrito Capital', 'DC'),
  ('Falcón', 'FA'),
  ('Guárico', 'GU'),
  ('Lara', 'LA'),
  ('Mérida', 'ME'),
  ('Miranda', 'MI'),
  ('Monagas', 'MO'),
  ('Nueva Esparta', 'NE'),
  ('Portuguesa', 'PO'),
  ('Sucre', 'SU'),
  ('Táchira', 'TA'),
  ('Trujillo', 'TR'),
  ('Vargas', 'VA'),
  ('Yaracuy', 'YA'),
  ('Zulia', 'ZU')
ON CONFLICT (code) DO NOTHING;

-- 3. TABLA: agency_branches (Sucursales de agencias por estado)
CREATE TABLE IF NOT EXISTS agency_branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_name TEXT NOT NULL,
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_agency_branches_agency_state 
  ON agency_branches(agency_name, state_id);

-- RLS para agency_branches
ALTER TABLE agency_branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on agency_branches"
  ON agency_branches FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow authenticated write on agency_branches"
  ON agency_branches FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on agency_branches"
  ON agency_branches FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on agency_branches"
  ON agency_branches FOR DELETE TO authenticated USING (true);

-- 4. ACTUALIZAR TABLA: payment_methods (Agregar comentario)
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS comment TEXT;

-- 5. TABLA: partners (Socios mayoristas)
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  rif_cedula TEXT NOT NULL UNIQUE,
  city TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para partners
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on partners"
  ON partners FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write on partners"
  ON partners FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on partners"
  ON partners FOR UPDATE TO authenticated USING (true);

-- 6. ACTUALIZAR TABLA: orders (Agregar campos de entrega)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES agency_branches(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id);

-- Crear función para actualizar updated_at en store_config
CREATE OR REPLACE TRIGGER update_store_config_updated_at
  BEFORE UPDATE ON store_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS DE EJEMPLO: Sucursales de Agencias
-- =====================================================

-- Función auxiliar para obtener state_id por código
DO $$
DECLARE
  v_state_id UUID;
  v_agency_data RECORD;
BEGIN
  -- ZOOM - Sucursales en principales estados
  FOR v_agency_data IN
    SELECT id FROM states WHERE code IN ('DC', 'CA', 'AR', 'LA', 'ZU', 'TA', 'AN', 'BO')
  LOOP
    INSERT INTO agency_branches (agency_name, state_id, branch_name, address)
    SELECT 
      'ZOOM',
      v_agency_data.id,
      'ZOOM - ' || s.name,
      'Centro Comercial Principal - ' || s.name
    FROM states s WHERE s.id = v_agency_data.id;
  END LOOP;

  -- DOMESA - Sucursales principales
  FOR v_agency_data IN
    SELECT id FROM states WHERE code IN ('DC', 'CA', 'AR', 'LA', 'ZU', 'TA', 'AN')
  LOOP
    INSERT INTO agency_branches (agency_name, state_id, branch_name, address)
    SELECT 
      'DOMESA',
      v_agency_data.id,
      'DOMESA - ' || s.name,
      'Avenida Principal - ' || s.name
    FROM states s WHERE s.id = v_agency_data.id;
  END LOOP;

  -- TEALCA - Sucursales principales
  FOR v_agency_data IN
    SELECT id FROM states WHERE code IN ('DC', 'CA', 'AR', 'LA', 'ZU', 'TA', 'AN', 'BO', 'ME')
  LOOP
    INSERT INTO agency_branches (agency_name, state_id, branch_name, address)
    SELECT 
      'TEALCA',
      v_agency_data.id,
      'TEALCA - ' || s.name,
      'Zona Industrial - ' || s.name
    FROM states s WHERE s.id = v_agency_data.id;
  END LOOP;

  -- MRW - Sucursales principales
  FOR v_agency_data IN
    SELECT id FROM states WHERE code IN ('DC', 'CA', 'AR', 'LA', 'ZU', 'TA', 'AN', 'BO', 'ME', 'FA')
  LOOP
    INSERT INTO agency_branches (agency_name, state_id, branch_name, address)
    SELECT 
      'MRW',
      v_agency_data.id,
      'MRW - ' || s.name,
      'Oficina Central - ' || s.name
    FROM states s WHERE s.id = v_agency_data.id;
  END LOOP;
END $$;

-- =====================================================
-- MÉTODOS DE PAGO DE EJEMPLO
-- =====================================================

-- Actualizar métodos de pago existentes con comentarios
UPDATE payment_methods SET comment = 'Transferencia bancaria a cuenta de MotoParts'
  WHERE name = 'Pago Móvil';

UPDATE payment_methods SET comment = 'Transferencia internacional a cuenta PayPal'
  WHERE name = 'Zelle';

UPDATE payment_methods SET comment = 'Pago en efectivo al retirar en tienda'
  WHERE name = 'Efectivo';

-- Agregar PayPal como método de pago
INSERT INTO payment_methods (name, is_active, requires_receipt, store_pickup_only, surcharge_type, surcharge_value, comment)
VALUES ('PayPal', true, true, false, 'percentage', 2.9, 'Incluye comisión de PayPal (2.9% + $0.30)')
ON CONFLICT DO NOTHING;
