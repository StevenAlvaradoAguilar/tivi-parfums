'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Shield, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, setIsCartOpen } = useCart();
  
  // Hooks de autenticación de Clerk
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Verificación de rol de Administrador en Clerk (publicMetadata)
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Cantidad total de productos en el carrito
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'FRAGANCIAS', href: '/' },
    { name: 'NOTAS OLFATIVAS', href: '/notas-olfativas' },
    { name: 'DISCOVERY SETS', href: '/discovery-sets' },
    { name: 'NOSOTROS', href: '/nosotros' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-amber-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO DE LA MARCA */}
        <Link href="/" className="group flex flex-col items-start">
          <span className="text-2xl font-serif tracking-widest text-stone-900 font-bold group-hover:text-amber-900 transition-colors">
            TIVI
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-amber-800 font-semibold -mt-1">
            Parfums
          </span>
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs uppercase tracking-widest transition-all duration-200 font-medium relative py-1 ${
                  isActive
                    ? 'text-amber-900 font-semibold'
                    : 'text-stone-600 hover:text-amber-900'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-800 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ACCIONES DEL MENÚ */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Botón de Búsqueda */}
          <Link
            href="/#catalogo"
            className="p-2 text-stone-600 hover:text-amber-900 transition-colors"
            title="Buscar"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* 🔒 Botón Admin: Solo visible para usuarios logueados con rol 'admin' */}
          {isLoaded && isSignedIn && isAdmin && (
            <Link
              href="/admin/products"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-full border border-amber-200/80 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>ADMIN</span>
            </Link>
          )}

          {/* Mis Pedidos */}
          <Link
            href="/pedidos"
            className="hidden sm:inline-block text-xs uppercase tracking-wider text-stone-600 hover:text-amber-900 transition-colors font-medium"
          >
            Mis Pedidos
          </Link>

          {/* 🔐 AUTENTICACIÓN CON CLERK */}
          {isLoaded && (
            <>
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-700 hover:text-amber-900 font-semibold border border-amber-200/80 bg-white px-3 py-1.5 rounded-full hover:border-amber-400 transition-all cursor-pointer shadow-2xs">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <span>Ingresar</span>
                  </button>
                </SignInButton>
              ) : (
                <div className="flex items-center justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-8 h-8 rounded-full border border-amber-300 shadow-2xs',
                      },
                    }}
                  />
                </div>
              )}
            </>
          )}

          {/* Carrito de Compras */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-800 hover:text-amber-900 transition-colors cursor-pointer"
            aria-label="Abrir Carrito"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}