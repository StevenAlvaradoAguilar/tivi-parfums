import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;

    // Buscar o crear el usuario en nuestra base de datos de Supabase
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        email: email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      },
      create: {
        clerkId: user.id,
        email: email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      },
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error('Error al sincronizar usuario:', error);
    return NextResponse.json({ error: 'Error de servidor' }, { status: 500 });
  }
}