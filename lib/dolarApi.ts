// lib/dolarApi.ts

let lastKnownRate: number = 443.26; 

export async function getBcvRate(): Promise<number> {
  try {
    const venezuelaDate = new Date().toLocaleString("es-VE", {
      timeZone: "America/Caracas",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const response = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv', {
      cache: 'force-cache',
      next: { tags: [`bcv-${venezuelaDate}`] }
    });
    
    if (!response.ok) throw new Error('Error al conectar con la API de DolarVzla');
    
    const data = await response.json();
    lastKnownRate = data.monitors.bcv.price;
    return lastKnownRate;
    
  } catch (error) {
    // Usamos console.log en lugar de console.error para evitar la pantalla de error de Next.js
    console.log(`Aviso: Usando la última tasa conocida: Bs. ${lastKnownRate}`);
    return lastKnownRate; 
  }
}