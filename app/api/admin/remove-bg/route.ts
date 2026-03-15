import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    if (!imageFile) return NextResponse.json({ error: 'No image' }, { status: 400 });

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const apiKey = process.env.REMOVE_BG_API_KEY || '';

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ image_file_b64: base64Image, size: 'auto' }),
    });

    if (!res.ok) throw new Error('API Rechazó la foto');
    const resultData = await res.json();
    return NextResponse.json({ success: true, base64: `data:image/png;base64,${resultData.data.result_b64}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}