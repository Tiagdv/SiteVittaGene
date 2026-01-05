import React, { useState } from 'react';
import { Search, ChevronRight, ArrowLeft, MessageCircle, TestTube2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const EXAMES_DATA = [
  { id: 1, nome: "Hemograma Completo", preco: "R$ 45,00", categoria: "Sangue", desc: "Avaliação das células sanguíneas (glóbulos vermelhos, brancos e plaquetas)." },
  { id: 2, nome: "Glicemia de Jejum", preco: "R$ 22,00", categoria: "Diabetes", desc: "Medição do nível de glicose no sangue após período de jejum." },
  { id: 3, nome: "Colesterol Total e Frações", preco: "R$ 68,00", categoria: "Cardiovascular", desc: "Avaliação dos níveis de gordura no sangue (HDL, LDL, VLDL)." },
  { id: 4, nome: "Vitamina D", preco: "R$ 110,00", categoria: "Vitaminas", desc: "Nível de calciferol para saúde óssea e sistema imunológico." },
  { id: 5, nome: "TSH / T4 Livre", preco: "R$ 85,00", categoria: "Tireoide", desc: "Check-up hormonal para avaliar o funcionamento da tireoide." },
  { id: 6, nome: "Beta HCG (Gravidez)", preco: "R$ 55,00", categoria: "Hormônios", desc: "Exame de sangue para detecção precoce de gravidez." },
];

export default function Exames() {
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const navigate = useNavigate();

  // CONFIGURAÇÃO DO WHATSAPP
  const WHATSAPP_NUMBER = "5521999999999"; // Substitua pelo seu número real

  const agendarExameZap = (nomeExame) => {
    const msg = encodeURIComponent(`Olá, VittaGene! Gostaria de agendar o exame: ${nomeExame}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  // Lógica de Filtro Duplo
  const examesFiltrados = EXAMES_DATA.filter(exame => {
    const correspondeBusca = exame.nome.toLowerCase().includes(busca.toLowerCase());
    const correspondeCategoria = filtroCategoria === "Todos" || exame.categoria === filtroCategoria;
    return correspondeBusca && correspondeCategoria;
  });

  // Extrair categorias únicas para os filtros
  const categorias = ["Todos", ...new Set(EXAMES_DATA.map(e => e.categoria))];

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <main className="pt-32 md:pt-48 pb-20 px-6 max-w-5xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="mb-10 text-center md:text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-vitta-primary font-bold mb-6 hover:text-vitta-light transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Voltar para o início
          </Link>
          
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            Busca de <br/>
            <span className="text-vitta-light italic font-serif tracking-tight text-4xl md:text-6xl">Exames.</span>
          </h2>
          <p className="mt-4 text-slate-500 font-medium max-w-xl">
            Realize seus exames laboratoriais sem sair de casa. Segurança e conforto para você e sua família.
          </p>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="mb-8 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-vitta-primary transition-colors" size={22} />
          <input 
            type="text" 
            placeholder="Qual exame você precisa?"
            className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] py-6 pl-16 pr-8 text-lg font-semibold outline-none focus:border-vitta-primary shadow-sm transition-all placeholder:text-slate-300"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* FILTROS DE CATEGORIA */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categorias.map(cat => (
            <button 
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-full border transition-all font-bold text-sm cursor-pointer whitespace-nowrap
                ${filtroCategoria === cat 
                  ? 'bg-vitta-primary text-white border-vitta-primary shadow-lg shadow-vitta-primary/20' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-vitta-primary hover:text-vitta-primary'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LISTA DE EXAMES */}
        <div className="grid gap-6">
          {examesFiltrados.length > 0 ? (
            examesFiltrados.map(exame => (
              <div 
                key={exame.id} 
                className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between gap-6 group"
              >
                
                {/* ESQUERDA: ÍCONE E TEXTO */}
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 bg-vitta-light/10 rounded-[2rem] flex items-center justify-center text-vitta-primary group-hover:bg-vitta-primary group-hover:text-white transition-all duration-500">
                    <TestTube2 size={34} />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-black text-slate-800 text-lg md:text-2xl leading-tight mb-1 group-hover:text-vitta-primary transition-colors">
                      {exame.nome}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mb-3 hidden md:block max-w-md">
                      {exame.desc}
                    </p>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500">
                        {exame.categoria}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-emerald-50 px-3 py-1.5 rounded-lg text-emerald-600">
                        Coleta Domiciliar
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* DIREITA: PREÇO E AGENDAMENTO */}
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block border-r border-slate-100 pr-8">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Particular</span>
                    <span className="text-2xl font-black text-vitta-primary whitespace-nowrap">
                      {exame.preco}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => agendarExameZap(exame.nome)}
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
              <p className="font-bold text-slate-400 text-lg">Nenhum exame encontrado.</p>
              <button onClick={() => {setBusca(""); setFiltroCategoria("Todos");}} className="mt-4 text-vitta-primary font-black uppercase text-xs tracking-widest underline cursor-pointer">Limpar busca</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}