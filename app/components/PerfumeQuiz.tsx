'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RefreshCw, ShoppingBag, Droplet } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

type CartProduct = Parameters<ReturnType<typeof useCart>['addToCart']>[0];

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
  products: CartProduct[];
}

const QUESTIONS = [
  {
    id: 'personality',
    title: '¿Qué sensación deseas proyectar con tu aroma?',
    options: [
      { label: 'Sofisticación misteriosa, elegancia y magnetismo', value: 'night' },
      { label: 'Frescura vibrante, energía limpia y vitalidad', value: 'fresh' },
      { label: 'Calidez envolvente, sensualidad y distinción', value: 'daily' },
    ],
  },
  {
    id: 'family',
    title: '¿Con qué universo olfativo te identificas más?',
    options: [
      { label: 'Maderas nobles, resinas, cuero y especias (Cálido y Profundo)', value: 'Amaderado' },
      { label: 'Flores blancas, rosas exquisitas y toques empolvados (Elegante y Romántico)', value: 'Floral' },
      { label: 'Cítricos mediterráneos, hojas verdes y acordes acuáticos (Fresco y Limpio)', value: 'Cítrico' },
      { label: 'Ámbar, vainilla, dulce exótico y notas gourmand (Seductor y Provocativo)', value: 'Oriental' },
    ],
  },
  {
    id: 'moment',
    title: '¿En qué momentos te acompañará tu fragancia firma?',
    options: [
      { label: 'Firma versátil para el día a día y reuniones clave', value: 'daily' },
      { label: 'Cenas exclusivas, eventos nocturnos y veladas de gala', value: 'night' },
      { label: 'Días cálidos, escapadas de fin de semana y aire libre', value: 'fresh' },
    ],
  },
  {
    id: 'sillage',
    title: '¿Cómo prefieres que se perciba tu estela (presencia)?',
    options: [
      { label: 'Íntima y cercana (Aroma sutil al abrazar)', value: 'subtle' },
      { label: 'Equilibrada y elegante (Deja un rastro memorable sin abrumar)', value: 'medium' },
      { label: 'Potente y protagónica (Presencia inolvidable en todo el salón)', value: 'strong' },
    ],
  },
];

export default function PerfumeQuiz({ isOpen, onClose, products }: QuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendedProduct, setRecommendedProduct] = useState<CartProduct | null>(null);
  const { addToCart } = useCart();

  const handleSelectOption = (value: string) => {
    const currentQuestion = QUESTIONS[currentStep];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  // Algoritmo de puntuación para seleccionar la fragancia más afín
  const calculateResult = (finalAnswers: Record<string, string>) => {
    if (!products || products.length === 0) return;

    let bestMatch = products[0];
    let highestScore = -1;

    products.forEach((product) => {
      let score = 0;
      const category = 'category' in product && typeof product.category === 'string' ? product.category.toLowerCase() : '';
      const selectedFamily = (finalAnswers.family || '').toLowerCase();

      // Puntos por coincidencia de categoría
      if (category === selectedFamily) {
        score += 10;
      }

      // Puntos adicionales si el nombre/descripción coincide con las respuestas de uso o estela
      const description = 'description' in product && typeof product.description === 'string' ? product.description : '';
      const productDesc = (product.name + ' ' + description).toLowerCase();
      if (finalAnswers.moment && productDesc.includes(finalAnswers.moment)) score += 3;
      if (finalAnswers.personality && productDesc.includes(finalAnswers.personality)) score += 3;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = product;
      }
    });

    setRecommendedProduct(bestMatch);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendedProduct(null);
  };

  // Función para agregar al carrito (Decant 2ml o Frasco Completo)
  const handleAddToCart = (sizeType: 'decant' | 'bottle') => {
    if (!recommendedProduct) return;

    if (sizeType === 'decant') {
      const decantPrice = Math.round(recommendedProduct.price * 0.15);
      addToCart({
        id: `${recommendedProduct.id}-2ml`,
        name: `Decant ${recommendedProduct.name}`,
        price: decantPrice,
        image: recommendedProduct.image,
        size: '2ML',
        quantity: 1,
      });
    } else {
      addToCart({
        id: `${recommendedProduct.id}-bottle`,
        name: recommendedProduct.name,
        price: recommendedProduct.price,
        image: recommendedProduct.image,
        size: recommendedProduct.size || '100 ML',
        quantity: 1,
      });
    }

    resetQuiz(); // Restablece el test
    onClose();   // Cierra el modal
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Fondo oscuro traslúcido */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
        />

        {/* Modal de Preguntas / Resultados */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-[#fdfbf7] p-8 md:p-10 border border-amber-200/80 rounded-2xl shadow-2xl z-10 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!recommendedProduct ? (
            <div>
              <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs tracking-widest uppercase mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Asesor Olfativo Virtual ({currentStep + 1} de {QUESTIONS.length})</span>
              </div>

              <h2 className="text-2xl font-serif text-stone-900 mb-8 font-medium">
                {QUESTIONS[currentStep].title}
              </h2>

              <div className="space-y-3">
                {QUESTIONS[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(option.value)}
                    className="w-full text-left p-4 bg-white border border-amber-200/70 hover:border-amber-400 hover:shadow-xs transition-all text-sm text-stone-800 font-light flex justify-between items-center group cursor-pointer rounded-xl"
                  >
                    <span>{option.label}</span>
                    <span className="text-amber-700/60 group-hover:text-amber-900 group-hover:translate-x-1 transition-all">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.2em] text-amber-800 font-semibold block mb-1">
                Tu Match Olfativo Ideal
              </span>
              <h2 className="text-3xl font-serif text-stone-900 mb-4 font-medium">
                {recommendedProduct.name}
              </h2>

              <div className="relative w-44 h-44 mx-auto bg-white border border-amber-100 rounded-xl mb-4 overflow-hidden p-2 flex items-center justify-center shadow-2xs">
                <Image
                  src={recommendedProduct.image}
                  alt={recommendedProduct.name}
                  fill
                  sizes="200px"
                  className="object-contain p-2"
                />
              </div>

              <p className="text-xs text-stone-600 mb-6 font-light leading-relaxed">
                Basado en tus elecciones, esta obra maestra encaja perfectamente con el perfil olfativo y presencia que deseas transmitir.
              </p>

              {/* Botones de Selección e Inserción al Carrito */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Botón Opción Decant Muestra (2ML) */}
                  <button
                    onClick={() => handleAddToCart('decant')}
                    className="flex items-center justify-center gap-2 border border-amber-300 bg-amber-50/50 hover:bg-amber-100/60 text-amber-950 py-3.5 px-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    <Droplet className="w-4 h-4 text-amber-700" />
                    <span>Muestra 2ML (₡{Math.round(recommendedProduct.price * 0.15).toLocaleString('es-CR')})</span>
                  </button>

                  {/* Botón Opción Botella Completa */}
                  <button
                    onClick={() => handleAddToCart('bottle')}
                    className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-900 text-amber-100 py-3.5 px-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-md border border-amber-500/30"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Botella (₡{recommendedProduct.price.toLocaleString('es-CR')})</span>
                  </button>
                </div>

                {/* Botón para Repetir Test */}
                <button
                  onClick={resetQuiz}
                  className="w-full flex items-center justify-center space-x-2 text-stone-500 hover:text-stone-900 py-2 text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Repetir Test Olfativo</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}