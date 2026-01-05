import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ArrowLeft, Baby, 
  UserRound, ChevronRight, Syringe, HeartPulse, MessageCircle 
} from 'lucide-react';

export default function Vacinas() {
  const [busca, setBusca] = useState("");
  const [filtroIdade, setFiltroIdade] = useState("Todos");

  // CONFIGURAÇÃO DO WHATSAPP
  const WHATSAPP_NUMBER = "5521991992185"; // Substitua pelo seu número real

  const agendarPeloZap = (nomeVacina) => {
    const msg = encodeURIComponent(`Olá, VittaGene! Gostaria de informações e agendamento para a vacina: ${nomeVacina}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const listaVacinas = [
    { id: 1, nome: "Gripe (Quadrivalente)", publico: "Todos", preco: "R$ 120,00", desc: "Proteção contra as 4 cepas principais do vírus influenza." },
    { id: 2, nome: "Dengue (Qdenga)", publico: "Adultos", preco: "R$ 350,00", desc: "Esquema de duas doses para proteção contra dengue." },
    { id: 3, nome: "HPV Quadrivalente", publico: "Adultos", preco: "R$ 420,00", desc: "Prevenção contra tipos de HPV causadores de câncer." },
    { id: 4, nome: "Meningocócica B", publico: "Bebês", preco: "R$ 580,00", desc: "Proteção contra meningite bacteriana do tipo B." },
    { id: 5, nome: "Tríplice Viral", publico: "Bebês", preco: "R$ 110,00", desc: "Sarampo, caxumba e rubéola." },
    { id: 6, nome: "Pneumocócica 13", publico: "Idosos", preco: "R$ 290,00", desc: "Previne doenças graves como pneumonia e meningite." },
  ];

  const vacinasFiltradas = listaVacinas.filter(v => {
    const correspondeBusca = v.nome.toLowerCase().includes(busca.toLowerCase());
    const correspondeIdade = filtroIdade === "Todos" || v.publico === filtroIdade || v.publico === "Todos";
    return correspondeBusca && correspondeIdade;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <main className="pt-32 md:pt-48 pb-20 px-6 max-w-5xl mx-auto">
        
        {/* HEADER DA PÁGINA */}
        <div className="mb-10 text-center md:text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-vitta-primary font-bold mb-6 hover:text-vitta-light transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Voltar para o início
          </Link>
          
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            Proteção para <br/>
            <span className="text-vitta-light italic font-serif tracking-tight text-4xl md:text-6xl">quem você ama.</span>
          </h2>
          <p className="mt-4 text-slate-500 font-medium max-w-xl">
            Atendimento domiciliar humanizado. Escolha sua vacina e tire suas dúvidas agora pelo WhatsApp.
          </p>
        </div>

        {/* BUSCA */}
        <div className="mb-8 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-vitta-primary transition-colors" size={22} />
          <input 
            type="text" 
            placeholder="Qual vacina você procura?"
            className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] py-6 pl-16 pr-8 text-lg font-semibold outline-none focus:border-vitta-primary shadow-sm transition-all placeholder:text-slate-300"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* FILTROS POR IDADE */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setFiltroIdade("Todos")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full border transition-all font-bold text-sm cursor-pointer whitespace-nowrap
              ${filtroIdade === "Todos" ? 'bg-vitta-primary text-white border-vitta-primary shadow-lg shadow-vitta-primary/20' : 'bg-white text-slate-600 border-slate-200 hover:border-vitta-primary'}`}
          >
            Todas
          </button>
          <FilterButton active={filtroIdade === "Bebês"} onClick={() => setFiltroIdade("Bebês")} icon={<Baby size={18}/>} label="Bebês" />
          <FilterButton active={filtroIdade === "Adultos"} onClick={() => setFiltroIdade("Adultos")} icon={<UserRound size={18}/>} label="Adultos" />
          <FilterButton active={filtroIdade === "Idosos"} onClick={() => setFiltroIdade("Idosos")} icon={<HeartPulse size={18}/>} label="Idosos" />
        </div>

        {/* LISTAGEM DE CARDS */}
        <div className="grid gap-6">
          {vacinasFiltradas.length > 0 ? (
            vacinasFiltradas.map(vacina => (
              <div key={vacina.id} className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between gap-6 group">
                
                {/* ESQUERDA: ÍCONE E TEXTO */}
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 bg-vitta-light/10 rounded-[2rem] flex items-center justify-center text-vitta-primary group-hover:bg-vitta-primary group-hover:text-white transition-all duration-500">
                    <Syringe size={34} />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-black text-slate-800 text-lg md:text-2xl leading-tight mb-1 group-hover:text-vitta-primary transition-colors">
                      {vacina.nome}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mb-3 hidden md:block max-w-md">
                      {vacina.desc}
                    </p>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500">
                        {vacina.publico}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-emerald-50 px-3 py-1.5 rounded-lg text-emerald-600">
                        Taxa Zero em Casa
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* DIREITA: PREÇO E AGENDAMENTO */}
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor Unitário</span>
                    <span className="text-2xl font-black text-vitta-primary whitespace-nowrap">
                      {vacina.preco}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => agendarPeloZap(vacina.nome)}
                    className="bg-vitta-primary text-white flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-[2rem] hover:bg-emerald-600 transition-all shadow-xl shadow-vitta-primary/20 group-hover:scale-105 cursor-pointer"
                  >
                    <MessageCircle size={24} className="mb-1" />
                    <span className="text-[10px] font-black uppercase">Agendar</span>
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200">
              <p className="font-bold text-slate-400">Nenhuma vacina encontrada.</p>
              <button onClick={() => {setBusca(""); setFiltroIdade("Todos");}} className="mt-4 text-vitta-primary font-black uppercase text-xs tracking-widest underline">Resetar tudo</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FilterButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 px-8 py-3.5 rounded-full border transition-all font-bold text-sm cursor-pointer whitespace-nowrap
        ${active ? 'bg-vitta-primary text-white border-vitta-primary shadow-lg shadow-vitta-primary/20' : 'bg-white text-slate-600 border-slate-200 hover:border-vitta-primary hover:text-vitta-primary hover:bg-slate-50'}`}>
      <span className={active ? 'text-white' : 'text-vitta-light'}>{icon}</span> 
      {label}
    </button>
  );
}