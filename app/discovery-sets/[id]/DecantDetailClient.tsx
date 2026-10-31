'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShieldCheck, Truck, Clock, Sparkles, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  category: string;
  image: string;
}

export default function DecantDetailClient({ product }: { product: Product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<'2ml' | '5ml' | '10ml' | 'bottle'>('2ml');
  const [quantity, setQuantity] = useState(1);

  // 1. Extraemos el valor numérico del tamaño de la botella (ej: "50 ml" -> 50, "100ml" -> 100)
  // Si no se encuentra un número válido, por defecto toma 50 ml.
  const bottleVolume = parseInt(product.size.replace(/\D/g, ''), 10) || 50;

  // 2. Calculamos el precio exacto por cada mililitro
  const pricePerMl = product.price / bottleVolume;

  // 3. Precios proporcionales dinámicos basados en el volumen real de la botella
  const options = {
    '2ml': Math.round(pricePerMl * 2 * 1.1), // 10% de recargo para decants pequeños
    '5ml': Math.round(pricePerMl * 5 * 1.1),
    '10ml': Math.round(pricePerMl * 10 * 1.1),
    'bottle': product.price,
  };

  const currentPrice = options[selectedSize];

  const handleAddToCart = () => {
    const sizeLabel = selectedSize === 'bottle' ? product.size : selectedSize.toUpperCase();
    const uniqueCartId = `${product.id}-${selectedSize}`;

    addToCart({
      id: uniqueCartId,
      name: `Decant ${product.name}`,
      price: currentPrice,
      image: product.image,
      size: sizeLabel,
      quantity: quantity,
    });

    if (setIsCartOpen) {
      setIsCartOpen(true);
    }

    setQuantity(1);
  };

  return (
    <div className="space-y-6">
      {/* Botón de Volver a Discovery Sets */}
      <div className="flex items-center">
        <Link
          href="/discovery-sets"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-600 hover:text-amber-900 transition-colors font-medium group bg-white border border-amber-200/60 px-4 py-2 rounded-full shadow-2xs hover:border-amber-400"
        >
          <ArrowLeft className="w-4 h-4 text-amber-800 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a Discovery Sets</span>
        </Link>
      </div>

      {/* Grid del Detalle del Producto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Columna Izquierda: Imagen */}
        <div className="bg-white rounded-2xl p-8 border border-amber-200/80 shadow-xs relative h-112.5 sm:h-137.5 flex items-center justify-center overflow-hidden">
          <span className="absolute top-4 left-4 bg-amber-50 text-amber-900 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-xs border border-amber-200/80 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Decant Exclusivo
          </span>
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6"
          />
        </div>

        {/* Columna Derecha: Selección y Detalles */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-1 block">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-medium mb-1">
              Decant {product.name}
            </h1>
          </div>

          {/* Precio */}
          <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-950">
            ₡{(currentPrice * quantity).toLocaleString('es-CR')}
          </div>

          {/* Selector de Tamaño */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-600 font-semibold mb-3">
              Elegí el Tamaño
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: '2ml', label: '2 ML', price: options['2ml'] },
                { id: '5ml', label: '5 ML', price: options['5ml'] },
                { id: '10ml', label: '10 ML', price: options['10ml'] },
                { id: 'bottle', label: `BOTELLA ${product.size}`, price: options['bottle'] },
              ].map((opt) => {
                const isSelected = selectedSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedSize(opt.id as '2ml' | '5ml' | '10ml' | 'bottle');
                      setQuantity(1);
                    }}
                    className={`p-3.5 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/30 text-amber-950 shadow-xs font-semibold'
                        : 'border-stone-200 bg-white hover:border-amber-300 text-stone-700 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider">{opt.label}</div>
                    <div className={`text-[11px] mt-1 ${isSelected ? 'text-amber-800 font-semibold' : 'text-stone-500'}`}>
                      ₡{opt.price.toLocaleString('es-CR')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cantidad y Botón Añadir */}
          <div className="flex gap-4 pt-2">
            <div className="flex items-center border border-amber-200/80 rounded-full px-4 py-3 bg-white shadow-2xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-stone-600 hover:text-amber-900 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-stone-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-stone-600 hover:text-amber-900 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-stone-900 hover:bg-amber-900 text-amber-100 rounded-full py-3.5 px-6 text-xs uppercase tracking-widest transition-all font-semibold cursor-pointer shadow-md border border-amber-500/30"
            >
              Añadir al Carrito
            </button>
          </div>

          {/* Garantías */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-amber-200/60 text-[11px] text-stone-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span className="font-medium">100% Original</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-700" />
              <span>Envío a todo el país</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-700" />
              <span>Entrega en 1–3 días</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="pt-6 border-t border-amber-200/60">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-amber-900 mb-2">
              Descripción de la Fragancia
            </h3>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}