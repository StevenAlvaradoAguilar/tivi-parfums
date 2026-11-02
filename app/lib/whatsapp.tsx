// lib/whatsapp.tsx
// Utilidades para armar el mensaje de pedido y el enlace de WhatsApp.

export type CartItem = {
  id: string;
  name: string; // Ej: "Decant God of Fire Stéphane Humbert Lucas 777"
  size?: string; // Ej: "2ML"
  quantity: number;
  price: number; // Precio unitario en colones
};

// Formato en colones costarricenses (₡4 620)
export function formatCRC(amount: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

type BuildMessageOptions = {
  orderId?: string;
  items: CartItem[];
  customerName?: string;
  sinpeNumber: string;
  sinpeHolder?: string;
};

export function buildOrderMessage({
  orderId,
  items,
  customerName,
  sinpeNumber,
  sinpeHolder,
}: BuildMessageOptions): string {
  const lines = items.map((item, index) => {
    const size = item.size ? ` (${item.size})` : "";
    const subtotal = formatCRC(item.price * item.quantity);
    return `${index + 1}. ${item.name}${size} x${item.quantity} - ${subtotal}`;
  });

  const total = formatCRC(calculateTotal(items));

  const parts = [
    "Hola, Tivi Parfums! Quiero realizar el siguiente pedido:",
    ...(orderId ? [`*Orden #${orderId}*`] : []),
    "",
    ...(customerName ? [`Cliente: ${customerName}`, ""] : []),
    "*Detalle del pedido*",
    ...lines,
    "",
    `*Total: ${total}*`,
    "",
    "*Forma de pago: SINPE Movil*",
    `Numero: ${sinpeNumber}`,
    ...(sinpeHolder ? [`A nombre de: ${sinpeHolder}`] : []),
    `Monto: ${total}`,
    "",
    "Enviar el comprobante del SINPE movil por este medio. Gracias!",
  ];

  return parts.join("\n");
}

// El numero debe ir con codigo de pais y solo digitos: 50688887777
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}