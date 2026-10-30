import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para realizar un pedido." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { items, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío." },
        { status: 400 },
      );
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    // 1. Buscar o crear el usuario en nuestra base de datos de Supabase
    const dbUser = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: {
        email: email,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      },
      create: {
        clerkId: clerkUser.id,
        email: email,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      },
    });

    // 2. Crear la orden con sus ítems en la base de datos
    const newOrder = await prisma.order.create({
      data: {
        userId: dbUser.id,
        totalAmount: totalAmount,
        status: "PAID",
        items: {
          create: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.product?.image || item.image || "", // Guardamos la ruta de la imagen
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar el pedido." },
      { status: 500 },
    );
  }
}
