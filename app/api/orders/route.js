import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: 'No autorizado. Por favor inicia sesión.' },
        { status: 401 }
      );
    }

    // 1. Buscar al usuario en la base de datos por su ID de Clerk
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!dbUser) {
      return NextResponse.json([]); // Si el usuario no existe aún, devuelve array vacío
    }

    // 2. Obtener todas las órdenes del usuario ordenadas por fecha (las más recientes primero)
    const orders = await prisma.order.findMany({
      where: { userId: dbUser.id },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json(
      { error: 'Error al consultar el historial de pedidos.' },
      { status: 500 }
    );
  }
}