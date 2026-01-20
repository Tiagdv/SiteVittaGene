import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloating = () => {
  const numeroTelefone = "5521991992185";
  const mensagem = "Olá! Gostaria de tirar uma dúvida.";
  const url = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagem)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Falar no WhatsApp"
    >
      <span className="absolute right-20 bg-white text-slate-800 text-sm font-bold px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity维护 whitespace-nowrap pointer-events-none">
        Fale conosco!
      </span>
      
      {/* Ícone ajustado aqui */}
      <MessageCircle size={32} /> 
    </a>
  );
};

export default WhatsAppFloating; // Não esqueça desta linha!