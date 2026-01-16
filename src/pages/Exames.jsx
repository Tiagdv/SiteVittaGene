import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  MessageCircle, 
  TestTube2, 
  Loader2, 
  Info, 
  X 
} from 'lucide-react';
import Papa from 'papaparse';

// Substitua pelo seu link CSV gerado no Google Sheets
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJaBCqfd-iP3cX-ox9j1SDv0dJNKF2b6A_Me77YCDH2n0UCk1ehwMT_6yX70qvSKLICtlRnSsj7Nje/pub?output=csv";

export default function Exames() {
  const [busca, setBusca] = useState("");
  const [filtroCat, setFiltroCat] = useState("Todos");
  const [examesData, setExamesData] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [exameSelecionado, setExameSelecionado] = useState(null);

  const location = useLocation();
  const WHATSAPP_NUMBER = "5521991992185"; 

  // Carregar dados da planilha
  useEffect(() => {
    Papa.parse(GOOGLE_SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const dadosValidos = result.data.filter(item => item.nome && item.nome.trim() !== "");
        setExamesData(dadosValidos);
        setCarregando(false);
      },
      error: (error) => {
        console.error("Erro ao carregar dados:", error);
        setCarregando(false);
      }
    });
  }, []);

  useEffect(() => {
    if (location.state && location.state.query) {
      setBusca(location.state.query);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const agendarZap = (nome) => {
    const msg = encodeURIComponent(`Olá, VittaGene! Quero agendar o exame: ${nome}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const examesFiltrados = examesData.filter(exame => {
    const nomeExame = exame.nome ? exame.nome.toLowerCase() : "";
    const matchesSearch = nomeExame.includes(busca.toLowerCase());
    const matchesCat = filtroCat === "Todos" || exame.categoria === filtroCat;
    return matchesSearch && matchesCat;
  });

  const categorias = ["Todos", ...new Set(examesData.map(e => e.categoria).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased relative">
      
      {/* --- MODAL DE DETALHES (POPUP) --- */}
      {exameSelecionado && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all"
          onClick={() => setExameSelecionado(null)}
        >
          {/* Reduzi o max-w para 'md' (mais estreito) e ajustei o padding */}
          <div 
            className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar fixo no topo */}
            <button 
              onClick={() => setExameSelecionado(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Conteúdo com Scroll Interno para não esticar o modal */}
            <div className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              <div className="mb-6">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-vitta-light/10 text-vitta-primary px-2.5 py-1 rounded-md">
                  {exameSelecionado.categoria}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 leading-tight">
                  {exameSelecionado.nome}
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={14} className="text-vitta-primary" /> Orientações
                  </h4>
                  {/* Texto levemente menor para caber melhor */}
                  <p className="text-slate-600 text-[13px] leading-relaxed font-medium whitespace-pre-wrap border-l-2 border-slate-100 pl-4">
                    {exameSelecionado.detalhes || "Informações de preparo disponíveis via WhatsApp."}
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor Particular</span>
                  <p className="text-3xl font-black text-vitta-primary mt-1">{exameSelecionado.preco}</p>
                </div>
              </div>
            </div>

            {/* Botão de Agendar fixo no rodapé do modal */}
            <div className="p-6 border-t border-slate-50">
              <button 
                onClick={() => agendarZap(exameSelecionado.nome)}
                className="w-full bg-vitta-primary text-white font-black py-4 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-vitta-primary/20"
              >
                <MessageCircle size={20} />
                AGENDAR PELO WHATSAPP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO DA PÁGINA --- */}
      <main className="pt-32 md:pt-48 pb-20 px-4 md:px-6 max-w-5xl mx-auto">
        
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-vitta-primary font-bold mb-6 hover:opacity-70 transition-all">
            <ArrowLeft size={20} /> Voltar para o início
          </Link>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            Busca de <br/><span className="text-vitta-light italic font-serif">Exames.</span>
          </h2>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Qual exame você precisa hoje?"
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] md:rounded-[3rem] py-6 md:py-8 pl-16 pr-8 text-lg font-semibold outline-none focus:border-vitta-primary shadow-sm transition-all shadow-slate-200/50"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {carregando ? (
          <div className="flex flex-col justify-center items-center py-32 text-vitta-primary gap-4">
            <Loader2 className="animate-spin" size={56} />
            <p className="font-black uppercase tracking-[0.2em] text-xs">Sincronizando Exames...</p>
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide px-2">
              {categorias.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFiltroCat(cat)}
                  className={`px-10 py-4 rounded-full font-bold text-sm whitespace-nowrap border transition-all ${
                    filtroCat === cat 
                    ? 'bg-vitta-primary text-white border-vitta-primary shadow-lg shadow-vitta-primary/30 scale-105' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-vitta-primary hover:text-vitta-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-6">
              {examesFiltrados.length > 0 ? (
                examesFiltrados.map((exame, index) => (
                  <div 
                  key={exame.id || index} 
                  className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-all group"
                >
                  {/* Lado Esquerdo: Ícone e Títulos */}
                  <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    {/* Ícone Reduzido */}
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-vitta-light/10 rounded-2xl flex items-center justify-center text-vitta-primary font-bold group-hover:scale-105 transition-transform">
                      <TestTube2 size={24} />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <h3 className="font-black text-slate-800 text-base md:text-lg leading-tight">
                        {exame.nome}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2 items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded text-slate-500">
                          {exame.categoria}
                        </span>
                        
                        {/* Botão Detalhes sutil */}
                        <button 
                          onClick={() => setExameSelecionado(exame)}
                          className="text-[9px] font-black uppercase tracking-widest text-vitta-primary border border-vitta-primary/20 hover:border-vitta-primary px-2 py-1 rounded transition-all flex items-center gap-1"
                        >
                          <Info size={12} />
                          Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lado Direito: Preço e Botão */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <div className="text-left md:text-right">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor</span>
                      <span className="text-lg md:text-xl font-black text-vitta-primary">{exame.preco}</span>
                    </div>
                    
                    {/* Botão Retangular em vez de Quadrado */}
                    <button 
                      onClick={() => agendarZap(exame.nome)}
                      className="bg-vitta-primary text-white flex items-center justify-center gap-2 px-6 h-12 md:h-14 rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-vitta-primary/10"
                    >
                      <MessageCircle size={18} />
                      <span className="text-xs font-black uppercase">Agendar</span>
                    </button>
                  </div>
                </div>
  
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold text-lg">Nenhum exame encontrado para "{busca}"</p>
                  <button onClick={() => setBusca("")} className="text-vitta-primary font-black mt-4 underline decoration-2 underline-offset-4">Limpar todos os filtros</button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}