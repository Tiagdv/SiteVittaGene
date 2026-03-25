import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ResumoFinanceiro } from '../components/ResumoFinanceiro';
import { Trash2, Calendar, PlusCircle, Filter } from 'lucide-react';

export default function Financeiro() {
  const [unidade, setUnidade] = useState('CEME');
  const [valor, setValor] = useState('');
  const [metodo, setMetodo] = useState('Dinheiro');
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  const [unidadeFiltro, setUnidadeFiltro] = useState('TODAS');
  const [lancamentos, setLancamentos] = useState([]);

  const buscarDados = async () => {
    let query = supabase
      .from('lancamentos')
      .select('*')
      .gte('data_referencia', dataInicio)
      .lte('data_referencia', dataFim)
      .order('created_at', { ascending: false });

    if (unidadeFiltro !== 'TODAS') {
      query = query.eq('unidade', unidadeFiltro);
    }

    const { data, error } = await query;
    if (!error) setLancamentos(data);
  };

  useEffect(() => { buscarDados(); }, [dataInicio, dataFim, unidadeFiltro]);

  const salvarVenda = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('lancamentos').insert([{
      unidade, valor_bruto: parseFloat(valor), forma_pagamento: metodo, data_referencia: dataInicio
    }]);
    if (!error) { setValor(''); buscarDados(); }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#F8FAFC] min-h-screen">

      {/* BARRA DE FILTROS (TOPO) */}
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 md:mb-8">

        {/* Linha 1: título + filtros (desktop inline / mobile empilhado) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          {/* Título */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full shrink-0"></div>
            <h1 className="text-lg md:text-xl font-black text-[#006363] uppercase italic tracking-tighter">Explorar Dados</h1>
          </div>

          {/* Filtros lado a lado no mobile também */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2">

            {/* Filtro Unidade */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-[10px] font-black uppercase text-slate-500">
              <Filter size={13} className="mr-2 shrink-0 text-slate-400" />
              <select
                value={unidadeFiltro}
                onChange={e => setUnidadeFiltro(e.target.value)}
                className="bg-transparent outline-none w-full cursor-pointer"
              >
                <option value="TODAS">TODAS AS UNIDADES</option>
                <option value="CEME">CEME</option>
                <option value="Nilo Peçanha">NILO PEÇANHA</option>
              </select>
            </div>

            {/* Filtro Datas — sempre inline (início · até · fim) */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-[10px] font-black text-slate-500 gap-2">
              <Calendar size={13} className="shrink-0 text-slate-400" />
              <input
                type="date"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                className="bg-transparent outline-none w-[110px] cursor-pointer"
              />
              <span className="text-slate-300 font-bold">·</span>
              <span className="text-slate-400 uppercase text-[9px]">até</span>
              <span className="text-slate-300 font-bold">·</span>
              <input
                type="date"
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
                className="bg-transparent outline-none w-[110px] cursor-pointer"
              />
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

        {/* COLUNA ESQUERDA: NOVO REGISTRO */}
        <section className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-50 space-y-5">
          <h3 className="font-black uppercase text-[10px] text-blue-600 flex items-center gap-2 tracking-widest">
            <PlusCircle size={16} /> Novo Registro
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {['CEME', 'NILO PEÇANHA'].map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setUnidade(u === 'CEME' ? 'CEME' : 'Nilo Peçanha')}
                className={`py-3 rounded-xl font-black text-[11px] uppercase border-2 transition-all ${unidade.toUpperCase() === u ? 'bg-[#006363] text-white border-[#0F172A]' : 'border-slate-100 text-slate-400'}`}
              >
                {u}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl">
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={e => setValor(e.target.value)}
              className="w-full bg-transparent font-black text-3xl md:text-4xl text-slate-700 outline-none placeholder-slate-300"
              placeholder="R$ 0,00"
              required
            />
          </div>

          {/* ✅ CORREÇÃO: grid-cols-3 para os 3 métodos ficarem na mesma linha */}
          <div className="grid grid-cols-3 gap-2">
            {['DINHEIRO', 'CARTÃO', 'PIX'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMetodo(m === 'DINHEIRO' ? 'Dinheiro' : m === 'CARTÃO' ? 'Cartão' : 'Pix')}
                className={`py-3 rounded-xl font-black text-[10px] border-2 transition-all ${metodo.toUpperCase() === m ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-100 text-slate-400'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="submit"
            onClick={salvarVenda}
            className="w-full bg-[#006363] text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#004f4f] shadow-lg shadow-green-100 transition-all"
          >
            Registrar Venda
          </button>
        </section>

        {/* COLUNA DIREITA: RESUMO E LISTA */}
        <section className="lg:col-span-8 space-y-6 md:space-y-8">
          <ResumoFinanceiro dados={lancamentos} unidadeFiltro={unidadeFiltro === 'TODAS' ? 'CEME' : unidadeFiltro} />

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[400px]">
              <thead className="bg-[#F8FAFC] text-[10px] font-black uppercase text-slate-400 border-b">
                <tr>
                  <th className="px-4 md:px-6 py-4 italic">Local / Hora</th>
                  <th className="px-4 md:px-6 py-4">Método</th>
                  <th className="px-4 md:px-6 py-4 text-right">Valor Bruto</th>
                  <th className="px-4 md:px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lancamentos.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <p className="text-[10px] font-black text-slate-800 uppercase italic">{l.unidade}</p>
                      <p className="text-[9px] text-slate-400 font-bold">{new Date(l.created_at).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-[9px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase">{l.forma_pagamento}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right font-black text-slate-800 text-sm">R$ {l.valor_bruto.toFixed(2)}</td>
                    <td className="px-4 md:px-6 py-4 text-right text-slate-300 cursor-pointer hover:text-red-400 transition-colors"><Trash2 size={14} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}