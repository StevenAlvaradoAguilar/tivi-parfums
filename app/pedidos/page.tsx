'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShoppingBag, Loader2, ArrowLeft, Sparkles } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error cargando órdenes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isSignedIn, isLoaded]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col py-8">
      {/* Contenido Principal (El Navbar ya lo maneja layout.tsx) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Botón Volver al Inicio */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-600 hover:text-amber-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </div>

        {/* Encabezado de la página */}
        <div className="border-b border-amber-200/80 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/80 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] uppercase tracking-widest text-amber-900 font-semibold">
              Historial de Compras
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-stone-900 font-medium">Mis Pedidos</h1>
          <p className="text-stone-600 text-sm mt-1 font-light">
            Consulta el detalle de tus fragancias exclusivas y estado de tus compras.
          </p>
        </div>

        {/* Estado: Cargando */}
        {(!isLoaded || loading) && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-700 animate-spin mb-4" />
            <p className="font-serif text-stone-700 text-sm">Cargando tus pedidos de lujo...</p>
          </div>
        )}

        {/* Estado: No autenticado */}
        {isLoaded && !isSignedIn && (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-amber-200/80 p-8 shadow-2xs rounded-2xl text-center">
            <Package className="w-12 h-12 text-amber-700/60 mb-4" />
            <h2 className="text-2xl font-serif text-stone-900 mb-2 font-medium">Inicia Sesión</h2>
            <p className="text-stone-600 font-light text-sm max-w-sm mb-6">
              Por favor, inicia sesión para consultar tu historial de pedidos realizados en TIVI.
            </p>
            <Link
              href="/"
              className="bg-stone-900 hover:bg-amber-900 text-amber-100 px-8 py-3.5 rounded-full uppercase text-xs tracking-widest transition-all font-semibold shadow-md border border-amber-500/30"
            >
              Ir a Inicio
            </Link>
          </div>
        )}

        {/* Estado: Autenticado pero Sin Pedidos */}
        {isLoaded && isSignedIn && !loading && orders.length === 0 && (
          <div className="text-center py-16 bg-white border border-amber-200/80 rounded-2xl p-8 shadow-2xs">
            <ShoppingBag className="w-12 h-12 text-amber-700/50 mx-auto mb-3" />
            <h2 className="text-xl font-serif text-stone-900 font-medium">Aún no has realizado pedidos</h2>
            <p className="text-stone-600 text-xs font-light mt-1 mb-6">
              Explora nuestra colección de alta perfumería y descubre tu aroma firma.
            </p>
            <Link
              href="/"
              className="inline-block bg-stone-900 hover:bg-amber-900 text-amber-100 px-8 py-3.5 rounded-full uppercase text-xs tracking-widest font-semibold transition-all shadow-md border border-amber-500/30"
            >
              Ver Catálogo
            </Link>
          </div>
        )}

        {/* Estado: Autenticado con Lista de Pedidos */}
        {isLoaded && isSignedIn && !loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-amber-200/80 rounded-2xl shadow-2xs overflow-hidden"
              >
                {/* Cabecera de la Orden */}
                <div className="bg-amber-50/50 p-4 sm:p-5 border-b border-amber-200/60 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-amber-900/60 block uppercase text-[10px] tracking-wider font-semibold">Fecha</span>
                      <span className="font-serif text-stone-800">
                        {new Date(order.createdAt).toLocaleDateString('es-CR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-amber-900/60 block uppercase text-[10px] tracking-wider font-semibold">Total</span>
                      <span className="font-serif text-stone-900 font-semibold text-base">
                        ₡{order.totalAmount.toLocaleString('es-CR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] tracking-widest font-semibold uppercase ${
                        order.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100/80 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {order.status === 'PAID' ? 'Completado' : 'Pendiente'}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      #{order.id.slice(-8)}
                    </span>
                  </div>
                </div>

                {/* Ítems del Pedido */}
                <div className="p-4 sm:p-5 divide-y divide-amber-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <div className="relative w-16 h-16 bg-white border border-amber-100 shrink-0 rounded-xl overflow-hidden p-1">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-serif text-stone-900 text-base font-medium">{item.name}</h3>
                          <p className="text-stone-500 text-xs mt-0.5 font-light">
                            Cantidad: {item.quantity} × ₡{item.price.toLocaleString('es-CR')}
                          </p>
                        </div>
                      </div>

                      <span className="font-serif text-stone-900 text-sm font-semibold">
                        ₡{(item.price * item.quantity).toLocaleString('es-CR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}