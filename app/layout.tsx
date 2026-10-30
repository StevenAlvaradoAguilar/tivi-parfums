import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Suspense } from 'react';
import './globals.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

export const metadata: Metadata = {
  title: 'TIVI Parfum',
  description: 'Venna de perfumería , decants exclusivos y fragancias nicho.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth">
        <body className="bg-[#fdfbf7] text-stone-900 antialiased min-h-screen flex flex-col justify-between">
          <CartProvider>
            
            {/* 📌 SUSPENSE RESUELVE EL USO DE usePathname() EN RUTAS DINÁMICAS */}
            <Suspense fallback={<header className="h-20 bg-[#fdfbf7] border-b border-amber-200/60 w-full" />}>
              <Navbar />
            </Suspense>

            {/* Contenido Dinámico de la Página */}
            <main className="flex-1">{children}</main>

            {/* Botón Volver Arriba */}
            <ScrollToTop />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}