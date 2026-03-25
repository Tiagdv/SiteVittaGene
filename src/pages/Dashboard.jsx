import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import {
  TrendingUp, Users, CheckCircle2, XCircle, Clock, Wallet,
  CreditCard, Landmark, BarChart3, Calendar, Filter,
  Activity, RefreshCw, Home
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) =>
  `R$ ${Number(v || 0)
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
const pct = (part, total) => (total > 0 ? ((part / total) * 100).toFixed(1) : '0.0');
const hoje = new Date().toISOString().split('T')[0];
const inicioMes = hoje.slice(0, 8) + '01';
const fmtDia = (iso) => { if (!iso) return ''; const [, m, d] = iso.split('-'); return `${d}/${m}`; };

// ─── Componentes base ──────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color = 'teal' }) {
  const map = {
    teal:   ['bg-teal-50',    'text-[#006363]',   'border-teal-100'],
    blue:   ['bg-blue-50',   'text-blue-600',    'border-blue-100'],
    green:  ['bg-emerald-50','text-emerald-600', 'border-emerald-100'],
    orange: ['bg-orange-50', 'text-orange-500',  'border-orange-100'],
    red:    ['bg-red-50',    'text-red-500',     'border-red-100'],
    slate:  ['bg-slate-100', 'text-slate-600',   'border-slate-200'],
    purple: ['bg-purple-50', 'text-purple-600',  'border-purple-100'],
  };
  const [light, text, border] = map[color] || map.teal;
  return (
    <div className={`bg-white rounded-2xl border ${border} p-4 md:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`${light} p-2.5 rounded-xl w-fit`}>
        <Icon size={17} className={text} />
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">{value}</p>
        {sub && <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SecTitle({ children, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={14} className="text-[#006363]" />}
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{children}</h3>
    </div>
  );
}

function BarRow({ label, value, display, max, color = '#006363' }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold text-slate-500 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, background: color }} />
      </div>
      <span className="text-[10px] font-black text-slate-700 w-24 text-right shrink-0">{display ?? value}</span>
    </div>
  );
}

function PeriodFilter({ inicio, fim, onInicio, onFim, onRefresh, loading }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-2">
      <div className="flex items-center bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-[10px] font-black text-white gap-2">
        <Calendar size={12} className="shrink-0 opacity-70" />
        <input
          type="date" value={inicio} onChange={e => onInicio(e.target.value)}
          className="bg-transparent outline-none w-[104px] cursor-pointer text-white placeholder-white/50"
        />
        <span className="opacity-40">·</span>
        <span className="text-[9px] opacity-60 uppercase">até</span>
        <span className="opacity-40">·</span>
        <input
          type="date" value={fim} onChange={e => onFim(e.target.value)}
          className="bg-transparent outline-none w-[104px] cursor-pointer text-white"
        />
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
      >
        <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> Filtrar
      </button>
    </div>
  );
}

function SectionShell({ title, icon: Icon, children, filter }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-[#006363] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-white">
          {Icon && <Icon size={16} />}
          <span className="font-black uppercase text-[11px] tracking-widest">{title}</span>
        </div>
        {filter}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex justify-center py-12">
      <RefreshCw size={22} className="animate-spin text-[#006363]" />
    </div>
  );
}

// ─── SEÇÃO 1: Fechamento de Caixa (lancamentos) ───────────────────────────────
function SecaoFinanceiro() {
  const [inicio, setInicio] = useState(inicioMes);
  const [fim, setFim]       = useState(hoje);
  const [dados, setDados]   = useState([]);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('lancamentos').select('*')
      .gte('data_referencia', inicio).lte('data_referencia', fim);
    setDados(data || []);
    setLoading(false);
  }, [inicio, fim]);

  useEffect(() => { carregar(); }, [carregar]);

  const ceme = dados.filter(l => l.unidade === 'CEME');
  const nilo = dados.filter(l => l.unidade === 'Nilo Peçanha');
  const total = dados.reduce((a, c) => a + c.valor_bruto, 0);
  const tCeme = ceme.reduce((a, c) => a + c.valor_bruto, 0);
  const tNilo = nilo.reduce((a, c) => a + c.valor_bruto, 0);
  const din   = dados.filter(l => l.forma_pagamento === 'Dinheiro').reduce((a, c) => a + c.valor_bruto, 0);
  const pix   = dados.filter(l => l.forma_pagamento === 'Pix').reduce((a, c) => a + c.valor_bruto, 0);
  const cart  = dados.filter(l => l.forma_pagamento === 'Cartão').reduce((a, c) => a + c.valor_bruto, 0);
  const repasse = din - tCeme * 0.30;

  const fatDia = {};
  dados.forEach(l => { fatDia[l.data_referencia] = (fatDia[l.data_referencia] || 0) + l.valor_bruto; });
  const fatDias = Object.entries(fatDia).sort((a, b) => a[0].localeCompare(b[0])).slice(-10);
  const maxFat  = Math.max(...fatDias.map(d => d[1]), 1);

  return (
    <SectionShell
      title="Fechamento de Caixa"
      icon={Landmark}
      filter={<PeriodFilter inicio={inicio} fim={fim} onInicio={setInicio} onFim={setFim} onRefresh={carregar} loading={loading} />}
    >
      {loading ? <Loading /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard icon={TrendingUp} label="Total Geral"    value={fmt(total)}    sub={`${dados.length} lançamentos`}          color="teal" />
            <KpiCard icon={Landmark}   label="CEME"           value={fmt(tCeme)}    sub={`${pct(tCeme, total)}% do total`}       color="blue" />
            <KpiCard icon={Landmark}   label="Nilo Peçanha"   value={fmt(tNilo)}    sub={`${pct(tNilo, total)}% do total`}       color="slate" />
            <KpiCard icon={Wallet}     label="Repasse CEME"   value={fmt(repasse)}  sub={repasse >= 0 ? 'A receber' : 'A pagar'} color={repasse >= 0 ? 'green' : 'red'} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <KpiCard icon={CreditCard} label="Pix"     value={fmt(pix)}  sub={`${pct(pix, total)}%`}  color="teal" />
            <KpiCard icon={CreditCard} label="Cartão"  value={fmt(cart)} sub={`${pct(cart, total)}%`} color="blue" />
            <KpiCard icon={Wallet}     label="Dinheiro" value={fmt(din)} sub={`${pct(din, total)}%`}  color="green" />
          </div>

          {fatDias.length > 0 && (
            <div>
              <SecTitle icon={BarChart3}>Faturamento por Dia</SecTitle>
              <div className="space-y-3">
                {fatDias.map(([dia, val]) => (
                  <BarRow key={dia} label={fmtDia(dia)} value={val} display={fmt(val)} max={maxFat} color="#006363" />
                ))}
              </div>
            </div>
          )}

          <div>
            <SecTitle icon={Landmark}>Por Unidade</SecTitle>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left min-w-[480px]">
                <thead className="bg-slate-50 border-b text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-3">Unidade</th>
                    <th className="px-4 py-3 text-right">Bruto</th>
                    <th className="px-4 py-3 text-right">Dinheiro</th>
                    <th className="px-4 py-3 text-right">Digital</th>
                    <th className="px-4 py-3 text-right">Qtd</th>
                    <th className="px-4 py-3 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[{ nome: 'CEME', data: ceme }, { nome: 'Nilo Peçanha', data: nilo }].map(({ nome, data }) => {
                    const b = data.reduce((a, c) => a + c.valor_bruto, 0);
                    const d = data.filter(l => l.forma_pagamento === 'Dinheiro').reduce((a, c) => a + c.valor_bruto, 0);
                    const g = data.filter(l => ['Cartão','Pix'].includes(l.forma_pagamento)).reduce((a, c) => a + c.valor_bruto, 0);
                    return (
                      <tr key={nome} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-black text-[11px] uppercase text-slate-700">{nome}</td>
                        <td className="px-4 py-3 text-right font-black text-slate-800 text-sm">{fmt(b)}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-bold text-sm">{fmt(d)}</td>
                        <td className="px-4 py-3 text-right text-blue-600 font-bold text-sm">{fmt(g)}</td>
                        <td className="px-4 py-3 text-right text-slate-500 font-bold">{data.length}</td>
                        <td className="px-4 py-3 text-right"><span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">{pct(b, total)}%</span></td>
                      </tr>
                    );
                  })}
                  <tr className="bg-teal-50/40 border-t-2 border-[#006363]/20">
                    <td className="px-4 py-3 font-black text-[11px] text-[#006363] uppercase">Total</td>
                    <td className="px-4 py-3 text-right font-black text-[#006363] text-sm">{fmt(total)}</td>
                    <td className="px-4 py-3 text-right font-black text-emerald-700 text-sm">{fmt(din)}</td>
                    <td className="px-4 py-3 text-right font-black text-blue-700 text-sm">{fmt(pix + cart)}</td>
                    <td className="px-4 py-3 text-right font-black text-slate-600">{dados.length}</td>
                    <td className="px-4 py-3 text-right"><span className="bg-[#006363] text-white text-[10px] font-black px-2 py-0.5 rounded-full">100%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}

// ─── SEÇÃO 2: Faturamento das Coletas (agendamentos.valor) ────────────────────
function SecaoFaturamentoColetas() {
  const [inicio, setInicio] = useState(inicioMes);
  const [fim, setFim]       = useState(hoje);
  const [dados, setDados]   = useState([]);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('agendamentos').select('*')
      .gte('dia', inicio).lte('dia', fim);
    setDados(data || []);
    setLoading(false);
  }, [inicio, fim]);

  useEffect(() => { carregar(); }, [carregar]);

  const parseVal = v => parseFloat(String(v || '0').replace(/\./g, '').replace(',', '.')) || 0;
  const comVal   = dados.filter(a => parseVal(a.valor) > 0);

  const tTotal    = comVal.reduce((a, c) => a + parseVal(c.valor), 0);
  const tRecebido = comVal.filter(a => a.status === 'Concluído').reduce((a, c) => a + parseVal(c.valor), 0);
  const tPendente = comVal.filter(a => a.status === 'Pendente').reduce((a, c) => a + parseVal(c.valor), 0);
  const tPerdido  = comVal.filter(a => a.status === 'Insucesso').reduce((a, c) => a + parseVal(c.valor), 0);

  const buildMap = (key, fallback = 'Não informado') => {
    const m = {};
    comVal.forEach(a => { const k = a[key] || fallback; m[k] = (m[k] || 0) + parseVal(a.valor); });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };

  const rankPgto   = buildMap('pagamento', 'Não informado');
  const rankConv   = buildMap('convenio', 'Particular').slice(0, 8);
  const rankEquipe = (() => {
    const m = {};
    comVal.forEach(a => { const k = `${a.motorista} & ${a.coletora}`; m[k] = (m[k] || 0) + parseVal(a.valor); });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8);
  })();

  const diaMap = {};
  comVal.forEach(a => { diaMap[a.dia] = (diaMap[a.dia] || 0) + parseVal(a.valor); });
  const fatDias = Object.entries(diaMap).sort((a, b) => a[0].localeCompare(b[0])).slice(-10);
  const maxFat  = Math.max(...fatDias.map(d => d[1]), 1);

  return (
    <SectionShell
      title="Faturamento das Coletas Domiciliares"
      icon={Home}
      filter={<PeriodFilter inicio={inicio} fim={fim} onInicio={setInicio} onFim={setFim} onRefresh={carregar} loading={loading} />}
    >
      {loading ? <Loading /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard icon={TrendingUp}   label="Total Agendado" value={fmt(tTotal)}    sub={`${comVal.length} coletas`}              color="teal" />
            <KpiCard icon={CheckCircle2} label="Recebido"       value={fmt(tRecebido)} sub={`${pct(tRecebido, tTotal)}% do total`}   color="green" />
            <KpiCard icon={Clock}        label="A Receber"      value={fmt(tPendente)} sub="coletas pendentes"                       color="orange" />
            <KpiCard icon={XCircle}      label="Perdido"        value={fmt(tPerdido)}  sub="coletas com insucesso"                   color="red" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fatDias.length > 0 && (
              <div>
                <SecTitle icon={BarChart3}>Por Dia</SecTitle>
                <div className="space-y-3">
                  {fatDias.map(([dia, val]) => (
                    <BarRow key={dia} label={fmtDia(dia)} value={val} display={fmt(val)} max={maxFat} color="#006363" />
                  ))}
                </div>
              </div>
            )}
            {rankPgto.length > 0 && (
              <div>
                <SecTitle icon={CreditCard}>Por Pagamento</SecTitle>
                <div className="space-y-3">
                  {rankPgto.map(([p, v]) => (
                    <BarRow key={p} label={p} value={v} display={fmt(v)} max={rankPgto[0][1]} color="#2563eb" />
                  ))}
                </div>
              </div>
            )}
            {rankConv.length > 0 && (
              <div>
                <SecTitle icon={Filter}>Por Convênio</SecTitle>
                <div className="space-y-3">
                  {rankConv.map(([c, v]) => (
                    <BarRow key={c} label={c} value={v} display={fmt(v)} max={rankConv[0][1]} color="#0284c7" />
                  ))}
                </div>
              </div>
            )}
            {rankEquipe.length > 0 && (
              <div>
                <SecTitle icon={Users}>Por Equipe</SecTitle>
                <div className="space-y-3">
                  {rankEquipe.map(([e, v]) => (
                    <BarRow key={e} label={e} value={v} display={fmt(v)} max={rankEquipe[0][1]} color="#7c3aed" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {rankConv.length > 0 && (
            <div>
              <SecTitle icon={Landmark}>Resumo por Convênio</SecTitle>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left min-w-[420px]">
                  <thead className="bg-slate-50 border-b text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3">Convênio</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-right">Coletas</th>
                      <th className="px-4 py-3 text-right">Ticket Médio</th>
                      <th className="px-4 py-3 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rankConv.map(([conv, val]) => {
                      const qt = comVal.filter(a => (a.convenio || 'Particular') === conv).length;
                      return (
                        <tr key={conv} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-black text-[11px] uppercase text-slate-700">{conv}</td>
                          <td className="px-4 py-3 text-right font-black text-slate-800 text-sm">{fmt(val)}</td>
                          <td className="px-4 py-3 text-right text-slate-500 font-bold">{qt}</td>
                          <td className="px-4 py-3 text-right text-blue-600 font-bold text-sm">{fmt(qt > 0 ? val / qt : 0)}</td>
                          <td className="px-4 py-3 text-right"><span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">{pct(val, tTotal)}%</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </SectionShell>
  );
}

// ─── SEÇÃO 3: Status das Coletas ──────────────────────────────────────────────
function SecaoStatusColetas() {
  const [inicio, setInicio] = useState(inicioMes);
  const [fim, setFim]       = useState(hoje);
  const [dados, setDados]   = useState([]);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('agendamentos').select('*')
      .gte('dia', inicio).lte('dia', fim);
    setDados(data || []);
    setLoading(false);
  }, [inicio, fim]);

  useEffect(() => { carregar(); }, [carregar]);

  const total  = dados.length;
  const conc   = dados.filter(a => a.status === 'Concluído').length;
  const pend   = dados.filter(a => a.status === 'Pendente').length;
  const insuc  = dados.filter(a => a.status === 'Insucesso').length;

  const eqMap = {};
  dados.forEach(a => { const k = `${a.motorista} & ${a.coletora}`; eqMap[k] = (eqMap[k] || 0) + 1; });
  const rankEq = Object.entries(eqMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const cvMap = {};
  dados.forEach(a => { const k = a.convenio || 'Particular'; cvMap[k] = (cvMap[k] || 0) + 1; });
  const rankCv = Object.entries(cvMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const diaMap = {};
  dados.forEach(a => { diaMap[a.dia] = (diaMap[a.dia] || 0) + 1; });
  const diasOrd = Object.entries(diaMap).sort((a, b) => a[0].localeCompare(b[0])).slice(-10);
  const maxDia  = Math.max(...diasOrd.map(d => d[1]), 1);

  return (
    <SectionShell
      title="Status das Coletas Domiciliares"
      icon={Activity}
      filter={<PeriodFilter inicio={inicio} fim={fim} onInicio={setInicio} onFim={setFim} onRefresh={carregar} loading={loading} />}
    >
      {loading ? <Loading /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard icon={Calendar}     label="Total"      value={total} sub="no período"                   color="slate" />
            <KpiCard icon={CheckCircle2} label="Concluídos" value={conc}  sub={`${pct(conc, total)}% sucesso`} color="green" />
            <KpiCard icon={Clock}        label="Pendentes"  value={pend}  sub="aguardando"                   color="orange" />
            <KpiCard icon={XCircle}      label="Insucesso"  value={insuc} sub={`${pct(insuc, total)}% falha`}  color="red" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diasOrd.length > 0 && (
              <div>
                <SecTitle icon={Calendar}>Coletas por Dia</SecTitle>
                <div className="space-y-3">
                  {diasOrd.map(([dia, qt]) => (
                    <BarRow key={dia} label={fmtDia(dia)} value={qt} max={maxDia} color="#2563eb" />
                  ))}
                </div>
              </div>
            )}
            {rankEq.length > 0 && (
              <div>
                <SecTitle icon={Users}>Ranking Equipes</SecTitle>
                <div className="space-y-3">
                  {rankEq.map(([eq, qt]) => (
                    <BarRow key={eq} label={eq} value={qt} max={rankEq[0][1]} color="#006363" />
                  ))}
                </div>
              </div>
            )}
            {rankCv.length > 0 && (
              <div className="md:col-span-2">
                <SecTitle icon={Filter}>Ranking Convênios</SecTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rankCv.map(([cv, qt]) => (
                    <BarRow key={cv} label={cv} value={qt} max={rankCv[0][1]} color="#0284c7" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left min-w-[320px]">
              <thead className="bg-slate-50 border-b text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Qtd</th>
                  <th className="px-4 py-3 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { label: 'Concluído', val: conc,  cls: 'bg-emerald-100 text-emerald-700' },
                  { label: 'Pendente',  val: pend,  cls: 'bg-orange-100 text-orange-700' },
                  { label: 'Insucesso', val: insuc, cls: 'bg-red-100 text-red-700' },
                ].map(({ label, val, cls }) => (
                  <tr key={label} className="hover:bg-slate-50">
                    <td className="px-4 py-3"><span className={`text-[10px] font-black px-2 py-1 rounded-full ${cls}`}>{label}</span></td>
                    <td className="px-4 py-3 text-right font-black text-slate-800">{val}</td>
                    <td className="px-4 py-3 text-right"><span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">{pct(val, total)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionShell>
  );
}

// ─── Dashboard Principal ───────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#F8FAFC] min-h-screen space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 bg-[#006363] rounded-full shrink-0" />
        <div>
          <h1 className="text-lg md:text-xl font-black text-[#006363] uppercase italic tracking-tighter">Painel de Gestão</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cada painel tem seu próprio filtro de período</p>
        </div>
      </div>

      <SecaoFinanceiro />
      <SecaoFaturamentoColetas />
      <SecaoStatusColetas />
    </div>
  );
}