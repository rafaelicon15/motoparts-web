// lib/dolarApi.ts
import { supabase } from './supabase';

export async function getBcvRate(): Promise<number> {
  try {
    // 1. Intentamos consultar la API oficial en tiempo real
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', { 
      cache: 'no-store' 
    });
    const data = await res.json();
    
    if (data && data.promedio) {
      const currentRate = data.promedio;
      
      // 2. ÉXITO: Guardamos esta tasa en la base de datos como la "última conocida"
      await supabase.from('system_settings').upsert({ 
        key_name: 'last_bcv_rate', 
        key_value: currentRate.toString() 
      });
      
      return currentRate;
    }
    
    throw new Error("Datos de la API inválidos");
    
  } catch (error) {
    console.error("Aviso: Fallo en API del Dólar, rescatando la última tasa conocida de la BD...");
    
    // 3. CONTINGENCIA: Si la API falló, buscamos en nuestra base de datos
    const { data } = await supabase
      .from('system_settings')
      .select('key_value')
      .eq('key_name', 'last_bcv_rate')
      .single();
      
    if (data && data.key_value) {
      return parseFloat(data.key_value);
    }
    
    // Fallback extremo por si la base de datos también falla (nunca debería pasar)
    return 36.50; 
  }
}