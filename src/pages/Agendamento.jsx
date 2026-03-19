import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Agendamentos = ({ usuarioEmail }) => {
  const [listaAgendamentos, setListaAgendamentos] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [coletoras, setColetoras] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [justificandoId, setJustificandoId] = useState(null);
  const [itemEditado, setItemEditado] = useState({});
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  
  // Estados para Filtros
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroEquipe, setFiltroEquipe] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Pendente');

  const [form, setForm] = useState({
    nome_paciente: '', 
    motorista: '', 
    coletora: '', 
    convenio: '',
    dia: '', 
    hora: '', 
    exame: '', 
    valor: '', 
    pagamento: 'Pix', 
    telefone: '', 
    endereco: ''
  });

  const formatarMoeda = (valor) => {
    let v = String(valor).replace(/\D/g, '');
    v = (v / 100).toFixed(2).replace('.', ',');
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return v;
  };

  const carregarDados = async () => {
    // Busca Agendamentos
    let query = supabase
      .from('agendamentos')
      .select('*')
      .order('dia', { ascending: true })
      .order('hora', { ascending: true });

    if (filtroStatus !== 'Todos') {
      query = query.eq('status', filtroStatus);
    }

    const { data: agend } = await query;
    if (agend) setListaAgendamentos(agend);

    // Busca Motoristas
    const { data: mot } = await supabase.from('motoristas').select('nome').order('nome', { ascending: true });
    if (mot) setMotoristas(mot);

    // Busca Coletoras
    const { data: col } = await supabase.from('coletoras').select('nome').order('nome', { ascending: true });
    if (col) setColetoras(col);

    // Busca Convênios
    const { data: conv } = await supabase.from('convenio').select('nome').order('nome', { ascending: true });
    if (conv) setConvenios(conv);
  };

  useEffect(() => {
    carregarDados();
  }, [filtroStatus]);

  const formatarDataBR = (dataIso) => {
    if (!dataIso) return '';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obrigatorios = [
      form.nome_paciente, form.motorista, form.coletora, form.convenio,
      form.dia, form.hora, form.exame, form.valor, form.telefone, form.endereco
    ];

    if (obrigatorios.some(campo => !campo || campo.trim() === '')) {
      alert("⚠️ Atenção: Todos os campos devem ser preenchidos!");
      return;
    }

    const novoRegistro = { 
      ...form, 
      criado_por: usuarioEmail || 'Admin/Sistema',
      atualizado_por: usuarioEmail || 'Admin/Sistema',
      status: 'Pendente' 
    };
    
    const { error } = await supabase.from('agendamentos').insert([novoRegistro]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("✅ Agendamento registrado!");
      setForm({
        nome_paciente: '', motorista: '', coletora: '', convenio: '',
        dia: '', hora: '', exame: '', valor: '', pagamento: 'Pix', telefone: '', endereco: ''
      });
      carregarDados();
    }
  };

  const finalizarColeta = async (id) => {
    if (window.confirm("Confirmar que esta coleta foi realizada?")) {
      const { error } = await supabase.from('agendamentos')
        .update({ 
            status: 'Concluído',
            atualizado_por: usuarioEmail 
        })
        .eq('id', id);
      if (!error) carregarDados();
    }
  };

  const cancelarColeta = async (id) => {
    if (!motivoCancelamento.trim()) {
      alert("Por favor, descreva o motivo do insucesso.");
      return;
    }
    const { error } = await supabase
      .from('agendamentos')
      .update({ 
          status: 'Insucesso', 
          justificativa: motivoCancelamento,
          atualizado_por: usuarioEmail 
      })
      .eq('id', id);

    if (!error) {
      setJustificandoId(null);
      setMotivoCancelamento('');
      carregarDados();
    }
  };

  const iniciarEdicao = (item) => { 
    setItemEditado({ ...item });
    setEditandoId(item.id); 
  };

  const salvarEdicao = async (id) => {
    const dadosParaSalvar = {
        ...itemEditado,
        atualizado_por: usuarioEmail
    };

    const { error } = await supabase.from('agendamentos').update(dadosParaSalvar).eq('id', id);
    if (!error) { 
      setEditandoId(null); 
      carregarDados(); 
    } else {
      alert("Erro ao atualizar: " + error.message);
    }
  };

  const deletarAgendamento = async (id) => {
    if (window.confirm("Excluir definitivamente este registro?")) {
      await supabase.from('agendamentos').delete().eq('id', id);
      carregarDados();
    }
  };

  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroEquipe('');
    setFiltroData('');
    setFiltroStatus('Pendente');
  };

  const agendamentosFiltrados = listaAgendamentos.filter(item => {
    const matchNome = (item.nome_paciente || '').toLowerCase().includes(filtroNome.toLowerCase());
    const matchEquipe = filtroEquipe === '' || item.motorista === filtroEquipe || item.coletora === filtroEquipe;
    const matchData = filtroData === '' || item.dia === filtroData;
    return matchNome && matchEquipe && matchData;
  });

  return (
    <div className="pt-6 pb-20 px-4 md:px-6 max-w-7xl mx-auto font-sans text-slate-800 bg-slate-50 min-h-screen">
      
      {/* HEADER DO SISTEMA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-5 rounded-xl shadow-sm border border-slate-200 gap-4">
        <h1 className="text-xl md:text-2xl font-bold border-l-4 border-[#006363] pl-4 text-[#006363]">Painel de Coletas Domiciliares</h1>
        <div className="text-center md:text-right bg-slate-50 p-2 rounded-lg border border-slate-100 w-full md:w-auto">
          <p className="text-[10px] uppercase text-slate-500 font-black mb-1">Operador do Sistema</p>
          <p className="text-sm font-bold text-[#006363]">{usuarioEmail}</p>
        </div>
      </div>

      {/* FORMULÁRIO DE CADASTRO */}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-slate-200 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Paciente</label>
            <input type="text" placeholder="Nome Completo" className="w-full border-2 rounded-lg p-3 outline-none focus:border-[#006363] transition-all" value={form.nome_paciente} onChange={e => setForm({ ...form, nome_paciente: e.target.value })} />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Telefone</label>
            <input type="tel" placeholder="(00) 00000-0000" className="w-full border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
          </div>
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Motorista</label>
            <select className="w-full border-2 rounded-lg p-3 bg-white outline-none focus:border-[#006363]" value={form.motorista} onChange={e => setForm({ ...form, motorista: e.target.value })}>
              <option value="">Selecionar...</option>
              {motoristas.map((m, i) => <option key={i} value={m.nome}>{m.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Coletora</label>
            <select className="w-full border-2 rounded-lg p-3 bg-white outline-none focus:border-[#006363]" value={form.coletora} onChange={e => setForm({ ...form, coletora: e.target.value })}>
              <option value="">Selecionar...</option>
              {coletoras.map((c, i) => <option key={i} value={c.nome}>{c.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Convênio</label>
            <select className="w-full border-2 rounded-lg p-3 bg-white outline-none focus:border-[#006363]" value={form.convenio} onChange={e => setForm({ ...form, convenio: e.target.value })}>
              <option value="">Escolher Convênio</option>
              {convenios.map((cv, i) => <option key={i} value={cv.nome}>{cv.nome}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Data</label>
                <input type="date" className="w-full border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.dia} onChange={e => setForm({ ...form, dia: e.target.value })} />
            </div>
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Hora</label>
                <input type="time" className="w-full border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Código do exame</label>
            <input type="text" placeholder="Código" className="w-full border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.exame} onChange={e => setForm({ ...form, exame: e.target.value })} />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Valor</label>
            <input type="text" placeholder="R$ 0,00" className="w-full border-2 rounded-lg p-3 text-right font-bold outline-none focus:border-[#006363]" value={form.valor} onChange={e => setForm({ ...form, valor: formatarMoeda(e.target.value) })} />
          </div>
          
          <div className="md:col-span-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Pagamento</label>
            <select className="w-full border-2 rounded-lg p-3 bg-white outline-none focus:border-[#006363]" value={form.pagamento} onChange={e => setForm({ ...form, pagamento: e.target.value })}>
                <option value="Pix">Pix</option>
                <option value="Cartão">Cartão</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Convênio">Pago</option>
                <option value="Convênio">Faturado Convênio</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Endereço de Coleta</label>
            <input type="text" placeholder="Rua, número, bairro e referências" className="w-full border-2 rounded-lg p-3 outline-none focus:border-[#006363]" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} />
          </div>
          
          <button type="submit" className="md:col-span-3 bg-[#006363] text-white font-black uppercase tracking-widest p-4 rounded-lg hover:bg-[#004d4d] transition-all shadow-lg active:scale-95 mt-2">
            Confirmar e Agendar Coleta
          </button>
        </div>
      </form>

      {/* FILTROS DE BUSCA */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Filtros de Busca</h2>
            <button onClick={limparFiltros} className="text-xs text-red-500 hover:underline font-bold">Limpar Filtros</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex flex-col">
            <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Status</label>
            <select className="p-2 border rounded-lg text-sm bg-slate-50 font-bold border-teal-200 outline-none focus:border-[#006363]" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="Pendente">🕒 Pendentes</option>
                <option value="Concluído">✅ Concluídos</option>
                <option value="Insucesso">❌ Insucesso</option>
                <option value="Todos">📄 Todos</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Paciente</label>
            <input type="text" placeholder="Nome..." className="p-2 border rounded-lg text-sm outline-none focus:border-[#006363]" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Equipe</label>
            <select className="p-2 border rounded-lg text-sm bg-white" value={filtroEquipe} onChange={(e) => setFiltroEquipe(e.target.value)}>
                <option value="">Todos</option>
                {[...motoristas, ...coletoras].map((colab, i) => <option key={i} value={colab.nome}>{colab.nome}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Data</label>
            <input type="date" className="p-2 border rounded-lg text-sm" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
          </div>
          <div className="bg-[#006363] text-white p-2 rounded-lg text-center shadow-inner self-end">
                <span className="text-[10px] font-bold uppercase block opacity-80">Encontrados</span>
                <span className="text-lg font-black">{agendamentosFiltrados.length}</span>
          </div>
        </div>
      </div>

      {/* TABELA DE DADOS */}
      <div className="bg-white shadow-2xl rounded-2xl border border-slate-300 overflow-hidden">
        <table className="w-full text-left border-collapse block md:table">
          <thead className="bg-[#006363] text-white text-xs uppercase hidden md:table-header-group">
            <tr>
              <th className="p-5 w-1/4">Cronograma / Equipe / Convênio</th>
              <th className="p-5 w-1/2">Dados do Paciente e Local</th>
              <th className="p-5 text-center">Gestão</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-300 block md:table-row-group">
            {agendamentosFiltrados.map((item) => (
              <tr key={item.id} className={`flex flex-col md:table-row border-b md:border-b-0 ${item.status === 'Insucesso' ? 'bg-red-50/30' : ''} ${item.status === 'Concluído' ? 'bg-green-50/20' : ''}`}>
                
                {editandoId === item.id ? (
                  /* MODO EDIÇÃO TOTAL */
                  <>
                    <td className="p-4 md:p-5 align-top md:border-r border-slate-100 space-y-2 bg-blue-50/50 block md:table-cell">
                      <label className="text-[9px] font-bold text-blue-400 uppercase">Data/Hora</label>
                      <input type="date" className="w-full border p-1 rounded text-sm font-bold" value={itemEditado.dia} onChange={e => setItemEditado({...itemEditado, dia: e.target.value})} />
                      <input type="time" className="w-full border p-1 rounded text-sm font-bold" value={itemEditado.hora} onChange={e => setItemEditado({...itemEditado, hora: e.target.value})} />
                      
                      <label className="text-[9px] font-bold text-blue-400 uppercase">Motorista</label>
                      <select className="w-full border p-1 text-xs rounded" value={itemEditado.motorista} onChange={e => setItemEditado({...itemEditado, motorista: e.target.value})}>
                        {motoristas.map((m, i) => <option key={i} value={m.nome}>{m.nome}</option>)}
                      </select>
                      
                      <label className="text-[9px] font-bold text-blue-400 uppercase">Coletora</label>
                      <select className="w-full border p-1 text-xs rounded" value={itemEditado.coletora} onChange={e => setItemEditado({...itemEditado, coletora: e.target.value})}>
                        {coletoras.map((c, i) => <option key={i} value={c.nome}>{c.nome}</option>)}
                      </select>

                      <label className="text-[9px] font-bold text-blue-400 uppercase">Convênio</label>
                      <select className="w-full border p-1 text-xs rounded" value={itemEditado.convenio} onChange={e => setItemEditado({...itemEditado, convenio: e.target.value})}>
                        {convenios.map((cv, i) => <option key={i} value={cv.nome}>{cv.nome}</option>)}
                      </select>
                    </td>
                    <td className="p-4 md:p-5 align-top space-y-2 bg-blue-50/50 block md:table-cell">
                      <label className="text-[9px] font-bold text-blue-400 uppercase">Paciente</label>
                      <input type="text" className="w-full border p-2 rounded font-black uppercase" value={itemEditado.nome_paciente} onChange={e => setItemEditado({...itemEditado, nome_paciente: e.target.value})} />
                      
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-blue-400 uppercase">Telefone</label>
                            <input type="text" className="w-full border p-2 rounded text-sm" value={itemEditado.telefone} onChange={e => setItemEditado({...itemEditado, telefone: e.target.value})} />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-blue-400 uppercase">Exame</label>
                            <input type="text" className="w-full border p-2 rounded text-sm" value={itemEditado.exame} onChange={e => setItemEditado({...itemEditado, exame: e.target.value})} />
                          </div>
                      </div>

                      <label className="text-[9px] font-bold text-blue-400 uppercase">Endereço</label>
                      <textarea className="w-full border p-2 rounded text-sm" rows="2" value={itemEditado.endereco} onChange={e => setItemEditado({...itemEditado, endereco: e.target.value})} />
                      
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold text-blue-400 uppercase">Valor</label>
                            <input type="text" className="w-full border p-2 rounded text-sm font-bold" value={itemEditado.valor} onChange={e => setItemEditado({...itemEditado, valor: formatarMoeda(e.target.value)})} />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-blue-400 uppercase">Pagamento</label>
                            <select className="w-full border p-2 rounded text-sm" value={itemEditado.pagamento} onChange={e => setItemEditado({...itemEditado, pagamento: e.target.value})}>
                                <option value="Pix">Pix</option>
                                <option value="Cartão">Cartão</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Pago">Pago</option>
                                <option value="Convênio">Faturamento Convênio</option>
                            </select>
                          </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 text-center align-middle bg-blue-100/50 md:border-l block md:table-cell">
                      <button onClick={() => salvarEdicao(item.id)} className="w-full bg-green-600 text-white py-2 rounded font-bold text-xs mb-2 shadow">SALVAR ALTERAÇÕES</button>
                      <button onClick={() => setEditandoId(null)} className="w-full bg-slate-400 text-white py-2 rounded font-bold text-xs shadow">CANCELAR</button>
                    </td>
                  </>
                ) : (
                  /* MODO VISUALIZAÇÃO */
                  <>
                    <td className="p-4 md:p-5 align-top md:border-r border-slate-100 block md:table-cell">
                      <div className="text-lg font-black text-[#006363] mb-2">
                        {formatarDataBR(item.dia)} <span className="text-slate-400 font-normal">às</span> {item.hora}
                      </div>
                      
                      <div className="bg-slate-100 p-2 rounded border border-slate-200 mb-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Equipe Responsável:</p>
                        <p className="text-sm font-bold text-slate-800">{item.motorista} & {item.coletora}</p>
                      </div>

                      <div className="bg-blue-50 p-2 rounded border border-blue-100">
                        <p className="text-[10px] font-bold text-blue-500 uppercase">Convênio:</p>
                        <p className="text-sm font-bold text-blue-800 uppercase leading-tight">{item.convenio || 'Particular'}</p>
                      </div>

                      <div className={`mt-2 text-[9px] font-black uppercase p-1 px-2 rounded-full inline-block ${
                        item.status === 'Concluído' ? 'bg-green-600 text-white' : 
                        item.status === 'Insucesso' ? 'bg-red-600 text-white' : 
                        'bg-orange-400 text-white'
                      }`}>
                        {item.status}
                      </div>
                    </td>

                    <td className="p-4 md:p-5 align-top block md:table-cell">
                      <div className="font-black text-slate-900 uppercase text-lg mb-1 leading-tight">{item.nome_paciente}</div>
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="bg-teal-50 px-2 py-1 rounded border border-teal-100 text-sm font-bold text-slate-700">📞 {item.telefone}</div>
                        <div className="bg-teal-50 px-2 py-1 rounded border border-teal-100 text-sm font-bold text-slate-700 uppercase">🔬 {item.exame}</div>
                      </div>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 shadow-sm">
                        <p className="text-[10px] font-bold text-yellow-700 uppercase mb-1">📍 Endereço:</p>
                        <p className="text-base font-bold text-slate-800 leading-relaxed">{item.endereco}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Valor:</p>
                            <p className="text-[#006363] font-black text-lg">R$ {item.valor}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Pagamento:</p>
                            <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider inline-block">{item.pagamento}</div>
                        </div>
                      </div>
                      
                      {/* INFORMAÇÕES DE AUDITORIA */}
                      <div className="mt-4 pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 text-[13px] text-slate-900 italic">
                        <span>📝 Criado por: {item.criado_por || 'Sistema'}</span>
                        {item.atualizado_por && (
                            <span>| 🔄 Última edição: {item.atualizado_por}</span>
                        )}
                      </div>

                      {item.justificativa && (
                        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-800 font-bold">
                          ⚠️ JUSTIFICATIVA: {item.justificativa}
                        </div>
                      )}
                    </td>

                    <td className="p-4 md:p-5 text-center align-top bg-slate-50/30 md:border-l border-slate-100 block md:table-cell">
                        {item.status === 'Pendente' ? (
                          justificandoId === item.id ? (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                              <textarea className="w-full border rounded p-2 text-sm mb-2" rows="2" value={motivoCancelamento} onChange={(e) => setMotivoCancelamento(e.target.value)} placeholder="Motivo..." />
                              <div className="flex gap-2">
                                <button onClick={() => cancelarColeta(item.id)} className="flex-1 bg-red-600 text-white text-[10px] font-bold py-2 rounded">SALVAR</button>
                                <button onClick={() => setJustificandoId(null)} className="flex-1 bg-slate-400 text-white text-[10px] font-bold py-2 rounded">VOLTAR</button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <button onClick={() => finalizarColeta(item.id)} className="w-full bg-[#006363] text-white py-3 rounded-lg font-black text-xs hover:bg-teal-800 transition-colors shadow">CONCLUIR COLETA ✅</button>
                              <button onClick={() => setJustificandoId(item.id)} className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold text-[10px] hover:bg-orange-600 shadow">NÃO REALIZADA ❌</button>
                              <div className="flex gap-2 pt-2">
                                <button onClick={() => iniciarEdicao(item)} className="flex-1 bg-blue-600 text-white py-1 rounded font-bold text-[9px] shadow">EDITAR</button>
                                <button onClick={() => deletarAgendamento(item.id)} className="flex-1 bg-slate-200 text-slate-600 py-1 rounded font-bold text-[9px] shadow">EXCLUIR</button>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="py-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação Finalizada</p>
                            <div className="text-2xl mt-2 opacity-50">🔒</div>
                            <div className="flex flex-col gap-2 mt-4">
                                <button onClick={() => iniciarEdicao(item)} className="text-[9px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-200 uppercase">Corrigir Dados</button>
                                <button onClick={() => deletarAgendamento(item.id)} className="text-[9px] text-red-400 hover:underline uppercase font-bold">Remover Permanente</button>
                            </div>
                          </div>
                        )}
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