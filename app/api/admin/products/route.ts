import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <-- 1. Importar esto

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    // Validar autenticación y rol de administrador
    const role = (clerkUser?.publicMetadata as { role?: string })?.role;

    if (!clerkUser || role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado. Acceso exclusivo para administradores.' }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr);
    const size = (formData.get('size') as string) || '100 ml';
    const category = (formData.get('category') as string) || 'General';
    const file = formData.get('image') as File | null;

    if (!name || isNaN(price) || !file) {
      return NextResponse.json(
        { error: 'Por favor proporciona un nombre, precio válido e imagen.' },
        { status: 400 }
      );
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const encodedFilePath = filePath.split('/').map(encodeURIComponent).join('/');

    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/perfumes/${encodedFilePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true',
      },
      body: buffer,
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.json().catch(() => ({}));
      const errorMessage = uploadError.message || uploadError.error || uploadResponse.statusText;
      console.error('Error subiendo imagen a Supabase Storage:', errorMessage);
      return NextResponse.json(
        { error: `Error en Storage: ${errorMessage}` },
        { status: 500 }
      );
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/perfumes/${filePath}`;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        size,
        category,
        image: imageUrl,
      },
    });

    // 2. Limpiar la caché de la página de inicio para que aparezca de inmediato
    revalidatePath('/');

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error interno al crear el producto:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado en el servidor.' },
      { status: 500 }
    );
  }
}