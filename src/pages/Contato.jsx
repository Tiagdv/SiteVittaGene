import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  MessageCircle, Send, Clock, Globe 
} from 'lucide-react';

export default function Contato() {
  const [enviado, setEnviado] = useState(false);

  // CONFIGURAÇÃO DO WHATSAPP
  const WHATSAPP_NUMBER = "5521999999999"; 

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    // Aqui você integraria com algum serviço de email se desejar
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
            <span className="text-vitta-light italic font-serif">para cuidar de você.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* LADO ESQUERDO: CARTÕES DE CANAIS DE ATENDIMENTO */}
          <div className="grid gap-6">
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <MessageCircle size={32} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">WhatsApp</h3>
                <p className="text-slate-500 font-medium">Resposta em até 5 minutos</p>
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
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
            {enviado ? (
              <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Mensagem Enviada!</h3>
                <p className="text-slate-500 font-medium mb-6">Em breve um de nossos especialistas entrará em contato.</p>
                <button 
                  onClick={() => setEnviado(false)}
                  className="text-vitta-primary font-bold underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Nome Completo</label>
                  <input required type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-vitta-primary focus:bg-white outline-none rounded-2xl py-4 px-6 font-semibold transition-all" placeholder="Como podemos te chamar?" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">E-mail</label>
                    <input required type="email" className="w-full bg-slate-50 border-2 border-transparent focus:border-vitta-primary focus:bg-white outline-none rounded-2xl py-4 px-6 font-semibold transition-all" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Telefone</label>
                    <input required type="tel" className="w-full bg-slate-50 border-2 border-transparent focus:border-vitta-primary focus:bg-white outline-none rounded-2xl py-4 px-6 font-semibold transition-all" placeholder="(00) 00000-0000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Como podemos ajudar?</label>
                  <textarea required rows="4" className="w-full bg-slate-50 border-2 border-transparent focus:border-vitta-primary focus:bg-white outline-none rounded-2xl py-4 px-6 font-semibold transition-all resize-none" placeholder="Conte-nos o que você precisa..."></textarea>
                </div>

                <button type="submit" className="bg-vitta-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-vitta-primary/20 hover:bg-vitta-dark hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                  Enviar Mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}