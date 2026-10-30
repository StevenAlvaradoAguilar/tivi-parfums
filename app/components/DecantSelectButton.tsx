'use client';

interface DecantSelectButtonProps {
  productName: string;
}

export default function DecantSelectButton({ productName }: DecantSelectButtonProps) {
  const handleClick = () => {
    alert(`✨ Has seleccionado la versión Decant para "${productName}". Opción de compra en 5ml/10ml disponible próximamente.`);
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full bg-stone-900 hover:bg-amber-900 text-amber-100 py-3.5 uppercase text-[10px] tracking-widest transition-colors font-semibold border border-amber-500/30 shadow-xs cursor-pointer"
    >
      Seleccionar Decant
    </button>
  );
}