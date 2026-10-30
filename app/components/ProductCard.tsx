'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: string | number;
  image: string;
  name: string;
  size: string;
  subtitle: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  price: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col bg-white border border-stone-200 p-4 transition-all duration-300 hover:shadow-xl"
    >
      {/* Enlace al detalle del producto */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative w-full h-80 bg-stone-50 overflow-hidden mb-6">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <span className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-2 py-1">
            {product.size}
          </span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between text-center">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-2xl font-serif text-stone-900 mb-2 font-medium hover:text-amber-700 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="my-4 py-3 border-y border-stone-100 text-left space-y-1 text-xs">
            <p className="text-stone-600">
              <strong className="text-stone-900 font-medium">Salida:</strong> {product.notes.top}
            </p>
            <p className="text-stone-600">
              <strong className="text-stone-900 font-medium">Corazón:</strong> {product.notes.heart}
            </p>
            <p className="text-stone-600">
              <strong className="text-stone-900 font-medium">Fondo:</strong> {product.notes.base}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-2">
          <span className="text-xl font-serif text-stone-900 font-semibold">
            ₡{product.price.toLocaleString('es-CR')}
          </span>

          <button 
            onClick={() => addToCart({ ...product, id: String(product.id), quantity: 1 })}
            className="flex items-center space-x-2 bg-stone-900 text-white px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}