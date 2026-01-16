import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ArrowLeft, Baby, 
  UserRound, HeartPulse, MessageCircle, Syringe 
} from 'lucide-react';

export default function Vacinas() {
  const [busca, setBusca] = useState("");
  const [filtroIdade, setFiltroIdade] = useState("Todos");

  const WHATSAPP_NUMBER = "5521991992185"; 

  const agendarPeloZap = (nome) => {
    const msg = encodeURIComponent(`Olá, VittaGene! Gostaria de agendar a vacina: ${nome}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const listaVacinas = [
    { id: 1, nome: "Gripe (Quadrivalente)", publico: "Todos", preco: "R$ 120,00", desc: "Proteção contra as 4 cepas principais do vírus influenza." },
    { id: 2, nome: "Dengue (Qdenga)", publico: "Adultos", preco: "R$ 350,00", desc: "Esquema de duas doses para proteção contra dengue." },
    { id: 3, nome: "HPV Quadrivalente", publico: "Adultos", preco: "R$ 420,00", desc: "Prevenção contra tipos de HPV causadores de câncer." },
    { id: 4, nome: "Meningocócica B", publico: "Bebês", preco: "R$ 580,00", desc: "Proteção contra meningite bacteriana do tipo B." },
    { id: 5, nome: "Tríplice Viral", publico: "Bebês", preco: "R$ 110,00", desc: "Sarampo, caxumba e rubéola." },
    { id: 6, nome: "Pneumocócica 13", publico: "Idosos", preco: "R$ 290,00", desc: "Previne doenças graves como pneumonia." },
  ];

  const vacinasFiltradas = listaVacinas.filter(v => {
    const correspondeBusca = v.nome.toLowerCase().includes(busca.toLowerCase());
    const correspondeIdade = filtroIdade === "Todos" || v.publico === filtroIdade || v.publico === "Todos";
    return correspondeBusca && correspondeIdade;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <main className="pt-32 md:pt-48 pb-20 px-4 md:px-6 max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-vitta-primary font-bold mb-4 hover:opacity-70 transition-all">
            <ArrowLeft size={20} /> Voltar
          </Link>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900">
            Proteção para <br/><span className="text-vitta-light italic font-serif">quem você ama.</span>
          </h2>
        </div>

        {/* BUSCA */}
        <div className="mb-6 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Qual vacina você procura?"
            className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-[2.5rem] py-4 md:py-6 pl-14 pr-6 text-base md:text-lg font-semibold outline-none focus:border-vitta-primary shadow-sm"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* FILTROS */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {["Todos", "Bebês", "Adultos", "Idosos"].map(tipo => (
            <button 
              key={tipo}
              onClick={() => setFiltroIdade(tipo)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap border transition-all ${filtroIdade === tipo ? 'bg-vitta-primary text-white border-vitta-primary shadow-md' : 'bg-white text-slate-500 border-slate-200'}`}
            >
              {tipo}
            </button>
          ))}
        </div>

        {/* LISTA RESPONSIVA */}
        <div className="grid gap-4">
          {vacinasFiltradas.map(vacina => (
            <div key={vacina.id} className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              
              <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 bg-vitta-light/10 rounded-2xl flex items-center justify-center text-vitta-primary">
                  <Syringe size={28} />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-black text-slate-800 text-base md:text-xl leading-tight">{vacina.nome}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded text-slate-500">{vacina.publico}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded text-emerald-600 font-bold">Taxa Zero</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                <div className="text-left md:text-right">
                  <span className="block text-[9px] font-black text-slate-400 uppercase">Particular</span>
                  <span className="text-lg md:text-2xl font-black text-vitta-primary">{vacina.preco}</span>
                </div>
                <button 
                  onClick={() => agendarPeloZap(vacina.nome)}
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