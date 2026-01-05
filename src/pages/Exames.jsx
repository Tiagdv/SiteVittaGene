import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, MessageCircle, TestTube2 } from 'lucide-react';

const EXAMES_DATA = [
  { id: 1, nome: "Hemograma Completo", preco: "R$ 45,00", categoria: "Sangue" },
  { id: 2, nome: "Glicemia de Jejum", preco: "R$ 22,00", categoria: "Diabetes" },
  { id: 3, nome: "Colesterol Total e Frações", preco: "R$ 68,00", categoria: "Cardiovascular" },
  { id: 4, nome: "Vitamina D", preco: "R$ 110,00", categoria: "Vitaminas" },
  { id: 5, nome: "TSH / T4 Livre", preco: "R$ 85,00", categoria: "Tireoide" },
  { id: 6, nome: "Beta HCG (Gravidez)", preco: "R$ 55,00", categoria: "Hormônios" },
];

export default function Exames() {
  const [busca, setBusca] = useState("");
  const [filtroCat, setFiltroCat] = useState("Todos");
  const WHATSAPP_NUMBER = "5521999999999"; 

  const agendarZap = (nome) => {
    const msg = encodeURIComponent(`Olá, VittaGene! Quero agendar o exame: ${nome}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const examesFiltrados = EXAMES_DATA.filter(e => {
    const matchesSearch = e.nome.toLowerCase().includes(busca.toLowerCase());
    const matchesCat = filtroCat === "Todos" || e.categoria === filtroCat;
    return matchesSearch && matchesCat;
  });

  const categorias = ["Todos", ...new Set(EXAMES_DATA.map(e => e.categoria))];

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <main className="pt-32 md:pt-48 pb-20 px-4 md:px-6 max-w-5xl mx-auto">
        
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-vitta-primary font-bold mb-4 hover:opacity-70 transition-all">
            <ArrowLeft size={20} /> Voltar
          </Link>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            Busca de <br/><span className="text-vitta-light italic font-serif">Exames.</span>
          </h2>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Qual exame você precisa?"
            className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-[2.5rem] py-4 md:py-6 pl-14 pr-6 text-base font-semibold outline-none focus:border-vitta-primary shadow-sm"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {categorias.map(cat => (
            <button 
              key={cat}
              onClick={() => setFiltroCat(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap border transition-all ${filtroCat === cat ? 'bg-vitta-primary text-white border-vitta-primary' : 'bg-white text-slate-500 border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {examesFiltrados.map(exame => (
            <div key={exame.id} className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 bg-vitta-light/10 rounded-2xl flex items-center justify-center text-vitta-primary font-bold">
                  <TestTube2 size={28} />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-black text-slate-800 text-base md:text-xl leading-tight">{exame.nome}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded text-slate-500">{exame.categoria}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded text-emerald-600">Coleta Domiciliar</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                <div className="text-left md:text-right">
                  <span className="block text-[9px] font-black text-slate-400 uppercase">A partir de</span>
                  <span className="text-lg md:text-2xl font-black text-vitta-primary">{exame.preco}</span>
                </div>
                <button 
                  onClick={() => agendarZap(exame.nome)}
                  className="bg-vitta-primary text-white flex items-center justify-center gap-2 px-6 h-12 md:w-24 md:h-24 rounded-xl md:rounded-[2rem] hover:bg-emerald-600 transition-all cursor-pointer shadow-lg shadow-vitta-primary/20"
                >
                  <MessageCircle size={20} />
                  <span className="text-xs font-black uppercase md:hidden">Agendar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}