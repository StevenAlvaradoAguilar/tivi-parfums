'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Se importa del CartContext que ya tenías

export default function AddToCartButtonClient({
  product,
}: {
  product: Parameters<ReturnType<typeof useCart>['addToCart']>[0];
}) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full bg-stone-900 text-white py-5 uppercase text-xs tracking-widest font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-lg"
    >
      <ShoppingBag className="w-4 h-4" />
      <span>Añadir al Carrito (${product.price})</span>
    </button>
  );
}