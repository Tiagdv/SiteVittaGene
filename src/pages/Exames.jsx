import React, { useState } from 'react';
import { Search, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const examesFiltrados = EXAMES_DATA.filter(exame => 
    exame.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho da Página */}
        <div className="mb-12">
          <button 
            onClick={() => navigate('/')}
            className="text-vitta-primary font-bold mb-4 flex items-center gap-2 hover:underline cursor-pointer"
          >
            ← Voltar para Home
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Busca de <span className="text-vitta-light">Exames</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Selecione os exames que deseja realizar no conforto da sua casa.
          </p>
        </div>

        {/* Barra de Busca Refinada */}
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex gap-4 mb-10">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="text-vitta-primary" size={24} />
            <input 
              type="text" 
              placeholder="Digite o nome do exame..." 
              className="w-full py-2 outline-none text-lg font-semibold text-slate-700"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <button className="bg-slate-100 p-3 rounded-2xl text-slate-500 hover:bg-slate-200 transition-all">
            <Filter size={24} />
          </button>
        </div>

        {/* Lista de Resultados */}
        <div className="grid gap-4">
          {examesFiltrados.length > 0 ? (
            examesFiltrados.map(exame => (
              <div 
                key={exame.id}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center group hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-vitta-light/10 rounded-2xl flex items-center justify-center text-vitta-primary font-bold">
                    {exame.categoria[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{exame.nome}</h3>
                    <span className="text-sm font-bold text-vitta-light uppercase tracking-wider">{exame.categoria}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold uppercase">A partir de</p>
                    <p className="text-2xl font-black text-vitta-primary">{exame.preco}</p>
                  </div>
                  <button className="bg-vitta-primary text-white p-4 rounded-2xl group-hover:scale-110 transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-xl">Nenhum exame encontrado com este nome.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}