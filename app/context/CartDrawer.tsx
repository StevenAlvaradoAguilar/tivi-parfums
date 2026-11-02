'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { buildOrderMessage, buildWhatsAppUrl, formatCRC } from '../lib/whatsapp';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
const SINPE_NUMBER = process.env.NEXT_PUBLIC_SINPE_NUMBER ?? '';
const SINPE_HOLDER = process.env.NEXT_PUBLIC_SINPE_HOLDER ?? '';

// Datos del pedido ya creado, guardados antes de vaciar el carrito
interface SentOrder {
  orderId: string;
  total: number;
  whatsappUrl: string;
}

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart } = useCart();
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sentOrder, setSentOrder] = useState<SentOrder | null>(null);

  const closeDrawer = () => {
    setIsCartOpen(false);
    setSentOrder(null);
  };

  // Función para procesar el pago y guardar en Supabase
  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert('Por favor, inicia sesión para realizar tu compra.');
      return;
    }

    setLoading(true);

    try {
      // Formatear los ítems del carrito para enviarlos a la API
      const formattedItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: formattedItems,
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const orderId: string = data.order.id;

        // Mensaje de WhatsApp con el detalle y los datos de SINPE Móvil
        const message = buildOrderMessage({
          orderId,
          items: cart,
          sinpeNumber: SINPE_NUMBER,
          sinpeHolder: SINPE_HOLDER || undefined,
        });

        setSentOrder({
          orderId,
          total: totalPrice,
          whatsappUrl: buildWhatsAppUrl(WHATSAPP_NUMBER, message),
        });
        clearCart();
      } else {
        alert(data.error || 'Ocurrió un error al procesar el pedido.');
      }
    } catch (error) {
      console.error('Error de pago:', error);
      alert('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Fondo oscuro traslúcido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Panel Lateral Blanco y Dorado */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#fdfbf7] z-50 shadow-2xl flex flex-col justify-between p-6 border-l border-amber-200/80"
          >
            {/* Header del Carrito */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-amber-200/60">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-amber-900" />
                  <h2 className="text-xl font-serif text-stone-900 font-medium">Tu Carrito</h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1 hover:bg-amber-100/50 rounded-full transition-colors text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Productos */}
              <div className="mt-6 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
                {sentOrder ? (
                  <div className="space-y-4 text-sm text-stone-800">
                    <div className="text-center">
                      <Sparkles className="w-8 h-8 text-amber-400/80 mx-auto mb-2" />
                      <p className="font-serif text-lg text-stone-900">¡Pedido registrado!</p>
                      <span className="text-xs text-stone-500">
                        Orden #{sentOrder.orderId}
                      </span>
                    </div>

                    <div className="rounded-xl border border-amber-200/80 bg-amber-50 p-4 space-y-2">
                      <p className="font-semibold text-amber-950">Pago por SINPE Móvil</p>
                      <ol className="list-decimal pl-5 space-y-1 text-stone-700">
                        <li>
                          Envía <strong>{formatCRC(sentOrder.total)}</strong> al número{' '}
                          <strong>{SINPE_NUMBER || '(sin configurar)'}</strong>
                          {SINPE_HOLDER ? ` a nombre de ${SINPE_HOLDER}` : ''}.
                        </li>
                        <li>Presiona el botón para enviarnos tu pedido por WhatsApp.</li>
                        <li>Adjunta el comprobante del SINPE en el chat.</li>
                      </ol>
                    </div>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-16 text-stone-500 font-light flex flex-col items-center">
                    <Sparkles className="w-8 h-8 text-amber-400/80 mb-3" />
                    <p className="font-serif text-lg text-stone-800 mb-1">Tu bolsa está vacía</p>
                    <span className="text-xs text-stone-500">Descubre nuestras fragancias y añade tu favorita.</span>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex space-x-4 bg-white border border-amber-200/60 p-3 rounded-xl shadow-2xs">
                      {/* Imagen con borde dorado suave */}
                      <div className="relative w-20 h-20 bg-stone-50 border border-amber-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Detalles del Ítem */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-serif text-stone-900 font-medium text-sm leading-tight">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-stone-400 hover:text-red-500 transition-colors ml-2 cursor-pointer p-0.5"
                              title="Eliminar del carrito"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {item.size && (
                            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-amber-900 font-semibold bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200/60">
                              {item.size}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          {/* Botones de Cantidad */}
                          <div className="flex items-center border border-amber-200/80 rounded-full bg-white shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:text-amber-900 transition-colors cursor-pointer rounded-l-full"
                            >
                              <Minus className="w-3 h-3 text-stone-600" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-stone-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-amber-900 transition-colors cursor-pointer rounded-r-full"
                            >
                              <Plus className="w-3 h-3 text-stone-600" />
                            </button>
                          </div>

                          <span className="font-serif text-amber-950 font-bold text-sm">
                            ₡{(item.price * item.quantity).toLocaleString('es-CR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer tras crear el pedido: enlace directo a WhatsApp */}
            {sentOrder && (
              <div className="border-t border-amber-200/80 pt-4 space-y-3 bg-[#fdfbf7]">
                <a
                  href={sentOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-4 uppercase text-xs tracking-widest transition-all font-semibold flex justify-center items-center shadow-md"
                >
                  Enviar pedido por WhatsApp
                </a>
                <button
                  onClick={closeDrawer}
                  className="w-full text-center text-xs text-stone-500 underline cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* Footer con el Total y Botón Checkout */}
            {!sentOrder && cart.length > 0 && (
              <div className="border-t border-amber-200/80 pt-4 space-y-4 bg-[#fdfbf7]">
                <div className="flex justify-between items-center text-lg font-serif text-stone-900">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-amber-950 text-xl">₡{totalPrice.toLocaleString('es-CR')}</span>
                </div>
                <p className="text-[11px] text-stone-500 font-light leading-snug">
                  Pagas por SINPE Móvil y confirmamos tu pedido por WhatsApp. El envío se coordina por el chat.
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-amber-900 text-amber-100 rounded-full py-4 uppercase text-xs tracking-widest transition-all font-semibold flex justify-center items-center gap-2 border border-amber-500/30 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                      Procesando Pedido...
                    </>
                  ) : (
                    'Proceder al Pago'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}