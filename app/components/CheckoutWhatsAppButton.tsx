// components/CheckoutWhatsAppButton.tsx
"use client";

import { useState } from "react";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  calculateTotal,
  formatCRC,
  type CartItem,
} from "../lib/whatsapp";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const SINPE_NUMBER = process.env.NEXT_PUBLIC_SINPE_NUMBER ?? "";
const SINPE_HOLDER = process.env.NEXT_PUBLIC_SINPE_HOLDER ?? "";

type Props = {
  items: CartItem[];
  customerName?: string;
  onOrderSent?: () => void; // Ej: vaciar el carrito despues de enviar
};

export default function CheckoutWhatsAppButton({
  items,
  customerName,
  onOrderSent,
}: Props) {
  const [showSinpe, setShowSinpe] = useState(false);
  const total = calculateTotal(items);
  const isEmpty = items.length === 0;
  const isConfigured = Boolean(WHATSAPP_NUMBER && SINPE_NUMBER);

  function handleSendOrder() {
    if (isEmpty || !isConfigured) return;

    const message = buildOrderMessage({
      items,
      customerName,
      sinpeNumber: SINPE_NUMBER,
      sinpeHolder: SINPE_HOLDER || undefined,
    });
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, message);

    // Se abre dentro del click para que el navegador no bloquee la ventana
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url; // Respaldo si el popup fue bloqueado

    onOrderSent?.();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Total</span>
        <span className="text-xl font-bold">{formatCRC(total)}</span>
      </div>

      {!showSinpe ? (
        <button
          type="button"
          disabled={isEmpty}
          onClick={() => setShowSinpe(true)}
          className="w-full rounded-full bg-neutral-900 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Proceder al pago
        </button>
      ) : (
        <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-semibold">Pago por SINPE Movil</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Envia <strong>{formatCRC(total)}</strong> al numero{" "}
              <strong>{SINPE_NUMBER || "(sin configurar)"}</strong>
              {SINPE_HOLDER ? ` a nombre de ${SINPE_HOLDER}` : ""}.
            </li>
            <li>Presiona el boton para enviarnos tu pedido por WhatsApp.</li>
            <li>Adjunta el comprobante del SINPE en el chat.</li>
          </ol>

          {!isConfigured && (
            <p className="text-red-600">
              Falta configurar NEXT_PUBLIC_WHATSAPP_NUMBER y
              NEXT_PUBLIC_SINPE_NUMBER en el archivo .env.
            </p>
          )}

          <button
            type="button"
            onClick={handleSendOrder}
            disabled={!isConfigured}
            className="w-full rounded-full bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar pedido por WhatsApp
          </button>

          <button
            type="button"
            onClick={() => setShowSinpe(false)}
            className="w-full text-center text-xs underline"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}