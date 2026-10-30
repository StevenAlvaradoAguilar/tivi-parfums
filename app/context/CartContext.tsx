'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Cargar carrito guardado en localStorage
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const savedCart = localStorage.getItem('tivi_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error cargando carrito:', e);
        }
      }
      setCartLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // Guardar en localStorage cada vez que cambia el carrito
  useEffect(() => {
    if (!cartLoaded) return;
    localStorage.setItem('tivi_cart', JSON.stringify(cart));
  }, [cart, cartLoaded]);

  // FUNCIÓN CLAVE: Agrega la cantidad seleccionada
  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      // Compara por id exacto (ej: cmvj15zr30006gdr3a0qcz5mk-2ml)
      const existingIndex = prevCart.findIndex((item) => item.id === newItem.id);

      if (existingIndex > -1) {
        // Si el mismo perfume Y el mismo tamaño ya estaban, incrementa su cantidad
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + newItem.quantity,
        };
        return updatedCart;
      } else {
        // Si es una variante de tamaño distinta, se agrega como una línea nueva
        return [...prevCart, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tivi_cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}