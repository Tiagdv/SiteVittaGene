import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Agendamentos = ({ usuarioEmail }) => {
  const [listaAgendamentos, setListaAgendamentos] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [coletoras, setColetoras] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [itemEditado, setItemEditado] = useState({});
  
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroEquipe, setFiltroEquipe] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const [form, setForm] = useState({
    nome_paciente: '', motorista: '', coletora: '', dia: '', hora: '',
    exame: '', valor: '', pagamento: 'Pix', telefone: '', endereco: ''
  });

  const formatarMoeda = (valor) => {
    let v = String(valor).replace(/\D/g, '');
    v = (v / 100).toFixed(2).replace('.', ',');
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return v;
  };

  const carregarDados = async () => {
    const { data: agend } = await supabase
      .from('agendamentos')
      .select('*')
      .order('dia', { ascending: true })
      .order('hora', { ascending: true });
    
    if (agend) setListaAgendamentos(agend);

    const { data: mot } = await supabase.from('motoristas').select('nome').order('nome', { ascending: true });
    if (mot) setMotoristas(mot);

    const { data: col } = await supabase.from('coletoras').select('nome').order('nome', { ascending: true });
    if (col) setColetoras(col);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const formatarDataBR = (dataIso) => {
    if (!dataIso) return '';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obrigatorios = [
      form.nome_paciente, form.motorista, form.coletora, form.dia, 
      form.hora, form.exame, form.valor, form.telefone, form.endereco
    ];

    if (obrigatorios.some(campo => !campo || campo.trim() === '')) {
      alert("⚠️ Atenção: Todos os campos devem ser preenchidos!");
      return;
    }

    const novoRegistro = { ...form, criado_por: usuarioEmail };
    const { error } = await supabase.from('agendamentos').insert([novoRegistro]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("✅ Agendamento registrado!");
      setForm({
        nome_paciente: '', motorista: '', coletora: '', dia: '', hora: '',
        exame: '', valor: '', pagamento: 'Pix', telefone: '', endereco: ''
      });
      carregarDados();
    }
  };

  const iniciarEdicao = (item) => { 
    setEditandoId(item.id); 
    setItemEditado({ ...item }); 
  };

  const salvarEdicao = async (id) => {
    if (Object.values(itemEditado).some(v => String(v).trim() === '')) {
      alert("Campos vazios não são permitidos.");
      return;
    }
    const { error } = await supabase.from('agendamentos').update(itemEditado).eq('id', id);
    if (!error) { 
      setEditandoId(null); 
      carregarDados(); 
    } else {
      alert("Erro ao atualizar: " + error.message);
    }
  };

  const deletarAgendamento = async (id) => {
    if (window.confirm("Excluir este registro?")) {
      await supabase.from('agendamentos').delete().eq('id', id);
      carregarDados();
    }
  };

  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroEquipe('');
    setFiltroData('');
  };

  const agendamentosFiltrados = listaAgendamentos.filter(item => {
    const matchNome = (item.nome_paciente || '').toLowerCase().includes(filtroNome.toLowerCase());
    const matchEquipe = filtroEquipe === '' || item.motorista === filtroEquipe || item.coletora === filtroEquipe;
    const matchData = filtroData === '' || item.dia === filtroData;
    return matchNome && matchEquipe && matchData;
  });

  return (
    <div className="pt-6 pb-20 px-4 md:px-6 max-w-7xl mx-auto font-sans text-slate-800 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-5 rounded-xl shadow-sm border border-slate-200 gap-4">
        <h1 className="text-xl md:text-2xl font-bold border-l-4 border-[#006363] pl-4 text-[#006363]">Painel de Coletas Domiciliares</h1>
        <div className="text-center md:text-right bg-slate-50 p-2 rounded-lg border border-slate-100 w-full md:w-auto">
          <p className="text-[10px] uppercase text-slate-500 font-black mb-1">Operador do Sistema</p>
          <p className="text-sm font-bold text-[#006363]">{usuarioEmail}</p>
        </div>
      </div>

      {/* Form de Cadastro */}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-slate-200 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <input type="text" placeholder="Nome Completo do Paciente" className="border-2 rounded-lg p-3 md:col-span-2 outline-none focus:border-[#006363] transition-all" value={form.nome_paciente} onChange={e => setForm({ ...form, nome_paciente: e.target.value })} />
          <input type="tel" placeholder="Telefone de Contato" className="border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
          
          <select className="border-2 rounded-lg p-3 bg-white outline-none focus:border-[#006363]" value={form.motorista} onChange={e => setForm({ ...form, motorista: e.target.value })}>
            <option value="">Selecionar Motorista</option>
            {motoristas.map((m, i) => <option key={i} value={m.nome}>{m.nome}</option>)}
          </select>
          <select className="border-2 rounded-lg p-3 bg-white outline-none focus:border-[#006363]" value={form.coletora} onChange={e => setForm({ ...form, coletora: e.target.value })}>
            <option value="">Selecionar Coletora</option>
            {coletoras.map((c, i) => <option key={i} value={c.nome}>{c.nome}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input type="date" className="border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.dia} onChange={e => setForm({ ...form, dia: e.target.value })} />
            <input type="time" className="border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
          </div>

          <input type="text" placeholder="Tipo de Exame" className="border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.exame} onChange={e => setForm({ ...form, exame: e.target.value })} />
          <input type="text" placeholder="Valor R$" className="border-2 rounded-lg p-3 text-right font-bold outline-none focus:border-[#006363]" value={form.valor} onChange={e => setForm({ ...form, valor: formatarMoeda(e.target.value) })} />
          
          <select className="border-2 rounded-lg p-3 bg-white outline-none focus:border-[#006363]" value={form.pagamento} onChange={e => setForm({ ...form, pagamento: e.target.value })}>
            <option value="Pix">Pagamento: Pix</option>
            <option value="Cartão">Pagamento: Cartão</option>
            <option value="Dinheiro">Pagamento: Dinheiro</option>
          </select>

          <input type="text" placeholder="Endereço Completo para Coleta" className="border-2 rounded-lg p-3 md:col-span-3 outline-none focus:border-[#006363]" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} />
          
          <button type="submit" className="md:col-span-3 bg-[#006363] text-white font-black uppercase tracking-widest p-4 rounded-lg hover:bg-[#004d4d] transition-all shadow-lg active:scale-95">
            Confirmar e Agendar Coleta
          </button>
        </div>
      </form>

      {/* Filtros */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Filtros de Busca</h2>
            <button onClick={limparFiltros} className="text-xs text-red-500 hover:underline font-bold">Limpar Filtros</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Paciente..." className="p-2 border rounded-lg text-sm outline-none focus:border-[#006363]" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
          <select className="p-2 border rounded-lg text-sm bg-white" value={filtroEquipe} onChange={(e) => setFiltroEquipe(e.target.value)}>
              <option value="">Todos os Colaboradores</option>
              {[...motoristas, ...coletoras].map((colab, i) => <option key={i} value={colab.nome}>{colab.nome}</option>)}
          </select>
          <input type="date" className="p-2 border rounded-lg text-sm" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
          <div className="bg-[#006363] text-white p-2 rounded-lg text-center shadow-inner">
                <span className="text-[10px] font-bold uppercase block opacity-80">Total</span>
                <span className="text-lg font-black">{agendamentosFiltrados.length}</span>
          </div>
        </div>
      </div>

      {/* Tabela Responsiva */}
      <div className="bg-white shadow-2xl rounded-2xl border border-slate-300 overflow-hidden">
        <table className="w-full text-left border-collapse block md:table">
          <thead className="bg-[#006363] text-white text-xs uppercase tracking-tighter hidden md:table-header-group">
            <tr>
              <th className="p-5 w-1/4">Cronograma / Equipe</th>
              <th className="p-5 w-1/2">Dados do Paciente e Local</th>
              <th className="p-5 text-center">Gestão</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-300 block md:table-row-group">
            {agendamentosFiltrados.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors flex flex-col md:table-row border-b md:border-b-0 border-slate-200">
                {editandoId === item.id ? (
                  <>
                    <td className="p-4 md:p-5 align-top md:border-r border-slate-100 space-y-2 bg-blue-50/30 block md:table-cell">
                      <input type="date" className="w-full border p-2 rounded text-sm font-bold" value={itemEditado.dia} onChange={e => setItemEditado({...itemEditado, dia: e.target.value})} />
                      <input type="time" className="w-full border p-2 rounded text-sm font-bold" value={itemEditado.hora} onChange={e => setItemEditado({...itemEditado, hora: e.target.value})} />
                      <div className="space-y-1">
                        <select className="w-full border p-1 text-xs rounded" value={itemEditado.motorista} onChange={e => setItemEditado({...itemEditado, motorista: e.target.value})}>
                          {motoristas.map((m, i) => <option key={i} value={m.nome}>{m.nome}</option>)}
                        </select>
                        <select className="w-full border p-1 text-xs rounded" value={itemEditado.coletora} onChange={e => setItemEditado({...itemEditado, coletora: e.target.value})}>
                          {coletoras.map((c, i) => <option key={i} value={c.nome}>{c.nome}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 align-top space-y-2 bg-blue-50/30 block md:table-cell">
                      <input type="text" className="w-full border p-2 rounded font-black uppercase text-lg" value={itemEditado.nome_paciente} onChange={e => setItemEditado({...itemEditado, nome_paciente: e.target.value})} />
                      <div className="flex flex-wrap gap-2">
                        <input type="text" className="flex-1 border p-1 rounded text-sm" value={itemEditado.telefone} onChange={e => setItemEditado({...itemEditado, telefone: e.target.value})} />
                        <input type="text" className="flex-1 border p-1 rounded text-sm" value={itemEditado.exame} onChange={e => setItemEditado({...itemEditado, exame: e.target.value})} />
                      </div>
                      <textarea className="w-full border p-2 rounded text-sm font-bold" rows="2" value={itemEditado.endereco} onChange={e => setItemEditado({...itemEditado, endereco: e.target.value})} />
                      <div className="flex gap-2 items-center">
                        <input type="text" className="w-1/3 border p-1 rounded font-bold text-[#006363]" value={itemEditado.valor} onChange={e => setItemEditado({...itemEditado, valor: formatarMoeda(e.target.value)})} />
                        <select className="w-1/3 border p-1 rounded text-xs font-bold" value={itemEditado.pagamento} onChange={e => setItemEditado({...itemEditado, pagamento: e.target.value})}>
                          <option value="Pix">Pix</option>
                          <option value="Cartão">Cartão</option>
                          <option value="Dinheiro">Dinheiro</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 text-center align-middle bg-blue-50/50 md:border-l border-slate-100 block md:table-cell">
                      <button onClick={() => salvarEdicao(item.id)} className="w-full bg-green-600 text-white py-2 rounded shadow-md font-bold text-xs mb-2 hover:bg-green-700">SALVAR</button>
                      <button onClick={() => setEditandoId(null)} className="w-full bg-slate-400 text-white py-2 rounded shadow-md font-bold text-xs hover:bg-slate-500">CANCELAR</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 md:p-5 align-top md:border-r border-slate-100 block md:table-cell">
                      <div className="text-lg font-black text-[#006363] mb-2">
                        {formatarDataBR(item.dia)} <span className="text-slate-400 font-normal">às</span> {item.hora}
                      </div>
                      <div className="bg-slate-100 p-2 rounded border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Equipe:</p>
                        <p className="text-sm font-bold text-slate-800">{item.motorista} & {item.coletora}</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 align-top block md:table-cell">
                      <div className="font-black text-slate-900 uppercase text-lg mb-1 leading-tight">
                        {item.nome_paciente}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600 mb-3 bg-teal-50 w-fit px-2 py-0.5 rounded border border-teal-100">
                        <span>📞 {item.telefone}</span>
                        <span className="hidden md:inline text-teal-200">|</span>
                        <span className="uppercase">🔬 {item.exame}</span>
                      </div>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 shadow-sm">
                        <p className="text-[10px] font-bold text-yellow-700 uppercase mb-1">📍 Endereço de Coleta:</p>
                        <p className="text-base font-bold text-slate-800 leading-relaxed">{item.endereco}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-[#006363] font-black text-lg">R$ {item.valor}</div>
                        <div className="bg-slate-800 text-white text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wider">{item.pagamento}</div>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 text-center align-top bg-slate-50/30 md:border-l border-slate-100 block md:table-cell">
                        <div className="flex justify-center gap-3 mb-4 md:mb-6">
                          <button onClick={() => iniciarEdicao(item)} className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded shadow-md font-bold text-xs hover:bg-blue-700">EDITAR</button>
                          <button onClick={() => deletarAgendamento(item.id)} className="flex-1 md:flex-none bg-red-500 text-white px-4 py-2 rounded shadow-md font-bold text-xs hover:bg-red-600">EXCLUIR</button>
                        </div>
                        <div className="border-t border-slate-200 pt-3">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Agendado por:</p>
                          <p className="text-[11px] font-bold text-slate-500 break-all leading-tight mt-1">{item.criado_por}</p>
                        </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agendamentos;