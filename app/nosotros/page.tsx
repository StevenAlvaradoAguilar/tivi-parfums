import Link from 'next/link';
import { Sparkles, ShieldCheck, HeartHandshake, Award, Feather } from 'lucide-react';

export const metadata = {
  title: 'Nosotros | TIVI Parfums CR',
  description: 'Conoce la historia detrás de TIVI Parfums CR y nuestra pasión por la perfumería nicho de autor.',
};

export default function NosotrosPage() {
  return (
    <div className="bg-[#fdfbf7] min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 rounded-full border border-amber-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-900 font-semibold">
              Nuestra Filosofía
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-900 font-medium">
            TIVI Parfums CR
          </h1>
          <p className="text-stone-600 font-light text-sm md:text-base leading-relaxed">
            Redefiniendo el lujo de la alta perfumería de autor. Acercamos las obras maestras olfativas más exclusivas del mundo a los verdaderos amantes del perfume.
          </p>
        </div>

        {/* Historia / Sección Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white border border-amber-200/80 rounded-2xl p-8 sm:p-12 shadow-2xs">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
              El Origen
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-medium leading-tight">
              Aromas con identidad, creados para dejar huella.
            </h2>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              En **TIVI Parfums CR** creemos que el perfume es la forma de arte más íntima. No es simplemente un accesorio, sino una firma invisible que comunica quién eres sin necesidad de pronunciar una palabra.
            </p>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              Nacimos con la misión de democratizar el acceso a la perfumería de nicho y de autor. A través de nuestros **Decants Exclusivos** en atomizadores portátiles de cristal de 2ml, 5ml y 10ml, permitimos a nuestros clientes explorar y vestir múltiples creaciones internacionales antes de comprometerse con un frasco completo.
            </p>
          </div>

          <div className="relative h-80 sm:h-96 w-full bg-[#fcfbf9] rounded-xl border border-amber-100 flex items-center justify-center overflow-hidden">
            <div className="text-center p-8 space-y-3">
              <Feather className="w-12 h-12 text-amber-700 mx-auto" />
              <blockquote className="font-serif italic text-lg text-stone-800">
                &ldquo;El perfume es la forma más intensa del recuerdo.&rdquo;
              </blockquote>
              <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold block">
                — TIVI Parfums CR
              </span>
            </div>
          </div>
        </div>

        {/* Pilares de la Marca */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif text-stone-900 font-medium">Nuestros Compromisos</h2>
            <p className="text-xs text-stone-500 font-light uppercase tracking-widest">
              Garantía de excelencia en cada gota
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-amber-200/70 p-8 rounded-2xl text-center space-y-4 shadow-2xs">
              <div className="w-12 h-12 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-stone-900 font-medium">100% Auténticos</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Todas nuestras fragancias provienen directamente de casas oficiales y distribuidores autorizados. Garantizamos la máxima calidad y originalidad.
              </p>
            </div>

            <div className="bg-white border border-amber-200/70 p-8 rounded-2xl text-center space-y-4 shadow-2xs">
              <div className="w-12 h-12 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-stone-900 font-medium">Fraccionado Profesional</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Nuestros decants son envasados utilizando jeringas y embudos de grado laboratorio sin alteraciones ni diluciones, preservando las notas intactas.
              </p>
            </div>

            <div className="bg-white border border-amber-200/70 p-8 rounded-2xl text-center space-y-4 shadow-2xs">
              <div className="w-12 h-12 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-stone-900 font-medium">Asesoría Personalizada</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Te acompañamos en la búsqueda de tu aroma firma a través de nuestro test olfativo interactivo y recomendación experta.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center space-y-6 pt-6">
          <h3 className="text-3xl font-serif text-stone-900 font-medium">
            Comienza tu viaje olfativo hoy
          </h3>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="bg-stone-900 hover:bg-amber-900 text-amber-100 px-8 py-3.5 rounded-full uppercase text-xs tracking-widest font-semibold transition-all shadow-md border border-amber-500/30"
            >
              Explorar Perfumes
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}