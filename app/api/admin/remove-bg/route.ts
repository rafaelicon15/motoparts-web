// app/api/admin/remove-bg/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No se envió ninguna imagen' }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Petición a la API de Remove.bg
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || '',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        image_file_b64: buffer.toString('base64'),
        size: 'auto'
      }),
    });

    if (!removeBgResponse.ok) {
      throw new Error('La API de Remove.bg rechazó la solicitud');
    }

    const result = await removeBgResponse.json();
    
    // Devolvemos la imagen limpia en formato Base64
    return NextResponse.json({ 
      success: true, 
      base64: `data:image/png;base64,${result.data.result_b64}` 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fallo al eliminar el fondo de la imagen' }, { status: 500 });
  }
}