import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  MessageCircle, Send, Clock 
} from 'lucide-react';

export default function Contato() {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });

  const WHATSAPP_NUMBER = "5521991992185"; 

  // Atualiza o estado conforme o usuário digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. LÓGICA WHATSAPP: Abre uma nova aba com os dados preenchidos
    const textoZap = `Olá, meu nome é *${formData.nome}*.\n*E-mail:* ${formData.email}\n*Telefone:* ${formData.telefone}\n*Dúvida:* ${formData.mensagem}`;
    const urlZap = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textoZap)}`;
    
    // Opcional: Descomente a linha abaixo se quiser que abra o Zap ao enviar
    // window.open(urlZap, '_blank');

    // 2. LÓGICA E-MAIL (Usando Web3Forms - Gratuito)
    // Para funcionar, pegue uma chave (Access Key) em web3forms.com (é instantâneo)
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "SUA_CHAVE_AQUI", // <--- COLOQUE SUA CHAVE AQUI
        ...formData
      })
    });

    if (response.ok) {
      setEnviado(true);
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <main className="pt-32 md:pt-48 pb-20 px-6 max-w-6xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="mb-16 text-center md:text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-vitta-primary font-bold mb-6 hover:text-vitta-light transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Voltar para o início
          </Link>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            Estamos aqui <br/>
            <span className="text-vitta-primary italic font-serif">para cuidar de você.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          
          {/* LADO ESQUERDO: CANAIS */}
          <div className="grid gap-6">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <MessageCircle size={32} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">WhatsApp</h3>
                <p className="text-slate-500 font-medium">{WHATSAPP_NUMBER}</p>
              </div>
            </a>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-vitta-light/10 text-vitta-primary rounded-2xl flex items-center justify-center">
                <Mail size={32} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">E-mail</h3>
                <p className="text-slate-500 font-medium">contato@vittagene.com.br</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                <Clock size={32} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">Horário</h3>
                <p className="text-slate-500 font-medium">Seg a Sex: 07h às 19h</p>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: FORMULÁRIO */}
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl">
            {enviado ? (
              <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Mensagem Enviada!</h3>
                <p className="text-slate-500 font-medium mb-6">Recebemos seus dados e entraremos em contato.</p>
                <button onClick={() => setEnviado(false)} className="text-vitta-primary font-bold underline">Enviar outra mensagem</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-6">
                <input required name="nome" value={formData.nome} onChange={handleChange} type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-vitta-primary focus:bg-white outline-none rounded-2xl py-4 px-6 font-semibold transition-all" placeholder="Nome Completo" />
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-slate-50 border-2 border-transparent focus:border-vitta-primary focus:bg-white outline-none rounded-2xl py-4 px-6 font-semibold transition-all" placeholder="E-mail" />
                <input required name="telefone" value={formData.telefone} onChange={handleChange} type="tel" className="w-full bg-slate-50 border-2 border-transparent focus:border-vitta-primary focus:bg-white outline-none rounded-2xl py-4 px-6 font-semibold transition-all" placeholder="Telefone" />
                <textarea required name="mensagem" value={formData.mensagem} onChange={handleChange} rows="4" className="w-full bg-slate-50 border-2 border-transparent focus:border-vitta-primary focus:bg-white outline-none rounded-2xl py-4 px-6 font-semibold transition-all resize-none" placeholder="Como podemos ajudar?"></textarea>
                <button type="submit" className="bg-vitta-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:brightness-110 transition-all cursor-pointer">Enviar Mensagem</button>
              </form>
            )}
          </div>
        </div>

        {/* SEÇÃO DO MAPA */}
        <div className="w-full space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-vitta-primary text-white rounded-2xl">
              <MapPin size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Onde estamos</h3>
          </div>
          <div className="w-full h-[450px] rounded-[3rem] overflow-hidden shadow-inner border-4 border-white">
            <iframe 
              title="Mapa VittaGene"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.685324209581!2d-43.3082!3d-22.9231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU1JzIzLjEiUyA0M8KwMTgnMjkuNSJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
}