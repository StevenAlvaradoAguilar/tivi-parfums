import { Sparkles, Flower2, Droplet, Wind } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Notas Olfativas | TIVI Parfums CR',
  description: 'Descubre la pirámide olfativa y las familias de ingredientes que componen nuestras fragancias de autor.',
};

const FAMILIES = [
  {
    name: 'Amaderada & Especiada',
    subtitle: 'Misterio, Calidez & Carácter',
    description: 'Aromas profundos basados en maderas nobles como el sándalo, cedro, oud y vetiver, envueltos en cálidas especias.',
    notes: ['Sándalo', 'Cedro del Líbano', 'Oud Real', 'Pachulí', 'Canela', 'Pimienta Negra'],
    color: 'from-amber-100/60 to-stone-100',
  },
  {
    name: 'Cítrica & Acuática',
    subtitle: 'Frescura Vibrante & Energía',
    description: 'Notas chispeantes de frutas cítricas del mediterráneo combinadas con la brisa marina y hierbas aromáticas.',
    notes: ['Bergamota de Calabria', 'Limón Italiano', 'Agua de Coco', 'Menta Fresca', 'Hoja de Higuera'],
    color: 'from-amber-50 to-amber-100/40',
  },
  {
    name: 'Floral & Empolvada',
    subtitle: 'Elegancia, Delicadeza & Romance',
    description: 'Esencias refinadas extraídas de flores exclusivas que aportan una sofisticación clásica y sensual.',
    notes: ['Rosa de Damasco', 'Jazmín de Grasse', 'Flor de Azahar', 'Iris', 'Violeta'],
    color: 'from-amber-100/30 to-amber-50/80',
  },
  {
    name: 'Oriental & Gourmand',
    subtitle: 'Exotismo, Seducción & Dulzura',
    description: 'Acordes magnéticos y provocativos compuestos por balsámicos ricos, vainillas maduras, resinas y especias exóticas.',
    notes: ['Ambergris', 'Haba Tonka', 'Vainilla Bourbon', 'Incienso', 'Café', 'Tabaco'],
    color: 'from-stone-100 to-amber-100/50',
  },
];

export default function NotasOlfativasPage() {
  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 rounded-full border border-amber-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-900 font-semibold">
              El Arte de la Perfumería
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-900 font-medium">
            La Pirámide Olfativa
          </h1>
          <p className="text-stone-600 font-light text-sm md:text-base leading-relaxed">
            Cada fragancia de autor es una sinfonía en tres actos. Comprende cómo evoluciona la experiencia sensorial de tu perfume en la piel a lo largo del tiempo.
          </p>
        </div>

        {/* Pirámide Olfativa - 3 Niveles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Notas de Salida */}
          <div className="bg-white border border-amber-200/80 p-8 rounded-2xl shadow-2xs space-y-4 relative overflow-hidden group hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-serif font-bold text-lg mb-2">
              <Wind className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block">
              0 - 15 Minutos
            </span>
            <h3 className="text-2xl font-serif text-stone-900 font-medium">Notas de Salida</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              La primera impresión olfativa. Son las notas más volátiles y efervescentes que despiertan los sentidos al atomizar la fragancia.
            </p>
            <div className="pt-4 border-t border-amber-100 text-[11px] text-amber-950 font-medium">
              Ejemplos: Bergamota, Cítricos, Menta, Frutas Frescas.
            </div>
          </div>

          {/* Notas de Corazón */}
          <div className="bg-white border border-amber-300 p-8 rounded-2xl shadow-xs space-y-4 relative overflow-hidden group hover:border-amber-500 transition-all ring-1 ring-amber-400/20">
            <div className="w-12 h-12 rounded-full bg-amber-100/70 border border-amber-300 flex items-center justify-center text-amber-900 font-serif font-bold text-lg mb-2">
              <Flower2 className="w-5 h-5 text-amber-800" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block">
              15 Min - 4 Horas
            </span>
            <h3 className="text-2xl font-serif text-stone-900 font-medium">Notas de Corazón</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              El alma del perfume. Definen el carácter real y la personalidad de la fragancia una vez que las notas de salida comienzan a atenuarse.
            </p>
            <div className="pt-4 border-t border-amber-100 text-[11px] text-amber-950 font-medium">
              Ejemplos: Rosas, Jazmín, Especias, Acordes Marinos.
            </div>
          </div>

          {/* Notas de Fondo */}
          <div className="bg-white border border-amber-200/80 p-8 rounded-2xl shadow-2xs space-y-4 relative overflow-hidden group hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-serif font-bold text-lg mb-2">
              <Droplet className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block">
              + 4 Horas hasta días
            </span>
            <h3 className="text-2xl font-serif text-stone-900 font-medium">Notas de Fondo</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              La base rica y perdurable. Son las notas más intensas y pesadas que fijan el perfume a la piel, dejando una estela inolvidable.
            </p>
            <div className="pt-4 border-t border-amber-100 text-[11px] text-amber-950 font-medium">
              Ejemplos: Oud, Sándalo, Vainilla Madura, Ámbar, Almizcle.
            </div>
          </div>

        </div>

        {/* Sección de Familias Olfativas */}
        <div className="space-y-10 pt-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif text-stone-900 font-medium">Nuestras Familias Olfativas</h2>
            <p className="text-xs text-stone-500 font-light uppercase tracking-widest">
              Explora los acordes que componen el catálogo de TIVI Parfums CR y descubre tu perfil aromático ideal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FAMILIES.map((family, idx) => (
              <div
                key={idx}
                className="bg-white border border-amber-200/80 rounded-2xl p-8 space-y-5 shadow-2xs hover:shadow-md transition-all duration-300"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-800 font-semibold block mb-1">
                    {family.subtitle}
                  </span>
                  <h3 className="text-2xl font-serif text-stone-900 font-medium">{family.name}</h3>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {family.description}
                </p>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-3">
                    Ingredientes Clave:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {family.notes.map((note, noteIdx) => (
                      <span
                        key={noteIdx}
                        className="bg-amber-50/80 text-amber-950 text-xs px-3 py-1 rounded-full border border-amber-200/80 font-medium"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Explorar Fragancias */}
        <div className="bg-stone-900 text-center py-12 px-6 rounded-2xl border border-amber-500/30 space-y-4 shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-serif text-amber-100 font-medium">
            ¿Listo para descubrir tu perfil olfativo?
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm font-light max-w-lg mx-auto">
            Explora nuestros Discovery Sets en atomizadores portátiles para experimentar cada nota en tu piel.
          </p>
          <div className="pt-2">
            <Link
              href="/discovery-sets"
              className="inline-block bg-amber-400 hover:bg-amber-300 text-stone-950 px-8 py-3.5 rounded-full uppercase text-xs tracking-widest font-semibold transition-all shadow-md"
            >
              Ver Discovery Sets
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}