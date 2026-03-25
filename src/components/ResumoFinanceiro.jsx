import React from 'react';
import { Landmark, Wallet, CreditCard } from 'lucide-react';

export function ResumoFinanceiro({ dados, unidadeFiltro = 'CEME' }) {
  const lancamentos = dados.filter(d => d.unidade === unidadeFiltro);
  const totalBruto = lancamentos.reduce((acc, curr) => acc + curr.valor_bruto, 0);

  const totalDigital = lancamentos
    .filter(d => d.forma_pagamento === 'Cartão' || d.forma_pagamento === 'Pix')
    .reduce((acc, curr) => acc + curr.valor_bruto, 0);

  const totalDinheiro = lancamentos
    .filter(d => d.forma_pagamento === 'Dinheiro')
    .reduce((acc, curr) => acc + curr.valor_bruto, 0);

  const comissaoClinica = unidadeFiltro === 'CEME' ? totalBruto * 0.30 : 0;
  const saldoRepasse = totalDinheiro - comissaoClinica;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-4 md:mb-6">
      <div className="bg-[#006363] px-4 py-3 flex items-center gap-2 text-white">
        <Landmark size={16} className="text-blue-300 shrink-0" />
        <span className="font-black uppercase text-[11px] tracking-widest">Resumo {unidadeFiltro}</span>
      </div>

      {/* ✅ Em mobile: coluna única. Em md+: duas colunas */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Coluna de valores */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase">Faturamento Bruto</span>
            <span className="font-black text-slate-800 text-sm">R$ {totalBruto.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 text-blue-600">
            <span className="text-[10px] font-black uppercase flex items-center gap-1">
              <CreditCard size={11} /> Digital (Pix/Cartão)
            </span>
            <span className="font-black text-sm">R$ {totalDigital.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-[10px] font-black uppercase flex items-center gap-1">
              <Wallet size={11} /> Dinheiro em Espécie
            </span>
            <span className="font-black text-sm">R$ {totalDinheiro.toFixed(2)}</span>
          </div>
        </div>

        {/* Box de repasse */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
          {unidadeFiltro === 'CEME' ? (
            <>
              <p className="text-[9px] font-black text-slate-400 uppercase text-center mb-2 italic">
                Cálculo de Repasse (Dinheiro - 30%)
              </p>
              <div className={`p-3 md:p-4 rounded-xl text-center shadow-inner ${saldoRepasse >= 0 ? 'bg-[#006363]' : 'bg-red-500'}`}>
                <p className="text-white font-black text-xl md:text-2xl tracking-tighter">
                  R$ {saldoRepasse.toFixed(2)}
                </p>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                  {saldoRepasse >= 0 ? 'Receber da Clínica' : 'Pagar à Clínica'}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Líquido VittaGene</p>
              <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter">R$ {totalBruto.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}