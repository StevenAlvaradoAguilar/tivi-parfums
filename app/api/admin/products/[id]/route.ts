import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// --- AUXILIAR DE SEGURIDAD ---
async function checkAdmin() {
  const clerkUser = await currentUser();
  const role = (clerkUser?.publicMetadata as { role?: string })?.role;
  if (!clerkUser || role !== 'admin') {
    return false;
  }
  return true;
}

// ==========================================
// 1. ELIMINAR UN PERFUME (DELETE)
// ==========================================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;

    // Buscar el producto primero para obtener la URL de la imagen
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Opcional: Eliminar la imagen de Supabase Storage si no es una URL externa
    if (product.image && product.image.includes('/storage/v1/object/public/perfumes/')) {
      const fileName = product.image.split('/perfumes/').pop();
      if (fileName) {
        await fetch(`${supabaseUrl}/storage/v1/object/perfumes/${fileName}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
          },
        }).catch((err) => console.error('Error borrando imagen de Supabase:', err));
      }
    }

    // Eliminar de la base de datos con Prisma
    await prisma.product.delete({ where: { id } });

    // Revalidar las rutas para actualizar la tienda de inmediato
    revalidatePath('/');
    revalidatePath('/admin/products');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
}

// ==========================================
// 2. EDITAR UN PERFUME (PUT)
// ==========================================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;

    // 1. Buscar el producto actual en la base de datos para recuperar su imagen original
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const formData = await req.formData();

    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr);
    const size = (formData.get('size') as string) || '100 ml';
    const category = (formData.get('category') as string) || 'General';
    const file = formData.get('image') as File | null;

    if (!name || isNaN(price)) {
      return NextResponse.json({ error: 'Nombre y precio válido son requeridos.' }, { status: 400 });
    }

    // 2. Por defecto, conservamos la imagen que ya tenía guardada en Prisma
    let imageUrl = existingProduct.image;

    // 3. Si se subió un nuevo archivo válido, lo subimos a Supabase y actualizamos la URL
    if (file && file.size > 0 && typeof file !== 'string') {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/perfumes/${fileName}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
          'Content-Type': file.type || 'image/jpeg',
          'x-upsert': 'true',
        },
        body: buffer,
      });

      if (uploadResponse.ok) {
        imageUrl = `${supabaseUrl}/storage/v1/object/public/perfumes/${fileName}`;
      }
    }

    // 4. Actualizar producto con Prisma garantizando que 'image' nunca sea nulo
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        size,
        category,
        image: imageUrl,
      },
    });

    revalidatePath('/');
    revalidatePath(`/product/${id}`);
    revalidatePath('/admin/products');

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error al editar el producto:', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}