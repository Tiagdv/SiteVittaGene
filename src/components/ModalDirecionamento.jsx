import React from 'react';
import { Calendar, Calculator, BarChart3, LogOut } from 'lucide-react';

export function ModalDirecionamento({ nivel, aoSelecionar, aoSair }) {
  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[999] p-4">
      {/* ✅ max-h + overflow para não vazar em celulares muito pequenos */}
      <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-[#006363] px-6 pt-8 pb-6 text-center relative">
          <button
            onClick={aoSair}
            className="absolute top-4 right-4 text-slate-200 hover:text-white transition-colors p-1"
          >
            <LogOut size={18} />
          </button>

          {/* ✅ Ícone menor no mobile */}
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-white/10 shadow-lg">
            <span className="text-white font-black text-2xl">V</span>
          </div>

          <h2 className="text-white font-black uppercase tracking-tighter text-lg md:text-xl">
            Acesso Restrito
          </h2>
          <p className="text-white/80 text-[12px] font-semibold uppercase tracking-wide mt-0.5">
            Escolha seu destino
          </p>
        </div>

        {/* Opções */}
        <div className="p-5 space-y-3 bg-white">

          {/* Agenda */}
          <button
            onClick={() => aoSelecionar('/agendamento')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm group-hover:text-blue-600">
                <Calendar size={18} />
              </div>
              <span className="font-black uppercase text-[11px] text-slate-700 tracking-tight">
                Agenda de Exames
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
              <span className="text-[10px] leading-none">→</span>
            </div>
          </button>

          {/* Caixa */}
          <button
            onClick={() => aoSelecionar('/financeiro')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm group-hover:text-emerald-600">
                <Calculator size={18} />
              </div>
              <span className="font-black uppercase text-[11px] text-slate-700 tracking-tight">
                Fechamento de Caixa
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
              <span className="text-[10px] leading-none">→</span>
            </div>
          </button>

          {/* Gestão - apenas gestores */}
          {nivel === 'gestor' && (
            <div className="pt-2">
              <div className="h-[1px] bg-slate-100 w-full mb-3" />
              <button
                onClick={() => aoSelecionar('/dashboard')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 transition-all group shadow-xl shadow-slate-200"
              >
                <div className="flex items-center gap-3 text-white">
                  <div className="bg-blue-600 p-2 rounded-xl shrink-0">
                    <BarChart3 size={18} />
                  </div>
                  <div className="text-left">
                    <span className="font-black uppercase text-[11px] block tracking-tight">Painel de Gestão</span>
                    <span className="text-[9px] text-blue-400 font-bold uppercase">Acesso Administrativo</span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <span className="text-[10px] leading-none">→</span>
                </div>
              </button>
            </div>
          )}

        </div>

        <div className="py-3 px-4 bg-slate-50 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            VittaGene Management v2.0
          </p>
        </div>
      </div>
    </div>
  );
}