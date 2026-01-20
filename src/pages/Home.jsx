import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Phone, ShieldCheck, Calendar, ArrowRight 
} from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const WHATSAPP_NUMBER = "5521991992185";
const abrirWhatsapp = (mensagem) => {
  const msg = encodeURIComponent(mensagem || "Olá, VittaGene! Gostaria de mais informações.");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
};

function QuickCard({ title, icon, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 md:p-6 rounded-[1.5rem] border border-slate-100 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer shadow-sm"
    >
      <div className="text-vitta-primary p-3 bg-slate-50 rounded-2xl">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="font-bold text-slate-800 text-[10px] md:text-xs uppercase tracking-tight text-center">{title}</span>
    </div>
  );
}

function StepCardWhite({ n, t, d }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
      <div className="bg-vitta-primary text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black flex-shrink-0 text-sm md:text-base">
        {n}
      </div>
      <div>
        <h3 className="font-black text-slate-800 text-base md:text-lg">{t}</h3>
        <p className="text-slate-500 text-xs md:text-sm font-medium leading-tight">{d}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 flex justify-between items-center bg-slate-50 text-left cursor-pointer hover:bg-white transition-colors">
        <span className="font-bold text-slate-800">{question}</span>
        <ArrowRight size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[300px] p-6' : 'max-h-0'} bg-white text-slate-500 text-sm font-medium border-t border-slate-50`}>
        {answer}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState("");

  const handleBusca = (e) => {
    if (e) e.preventDefault();
    navigate('/exames', { state: { query: termoBusca } });
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      
      <section className="pt-32 md:pt-40 px-6 relative z-20">
        <form onSubmit={handleBusca} className="max-w-4xl mx-auto bg-white p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2">
            <Search className="text-vitta-primary" size={20} />
            <input 
              type="text" 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Qual exame você procura?" 
              className="w-full outline-none text-base md:text-lg font-semibold text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <button type="submit" className="bg-vitta-primary text-white px-8 py-4 rounded-xl md:rounded-2xl font-black text-lg hover:brightness-110 transition-all cursor-pointer">
            Buscar
          </button>
        </form>
      </section>

      <header className="pt-16 md:pt-24 pb-8 md:pb-12 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 text-center md:text-left order-2 md:order-1">
          <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-tight">
            O seu código genético revela o caminho para<br/>
            <span className="text-vitta-primary italic font-serif">sua saúde.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
            Vá além do básico. Realize exames genéticos avançados e laboratoriais de rotina com a tecnologia que o seu corpo merece, no conforto da sua casa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => abrirWhatsapp("Olá! Gostaria de agendar um exame através do site.")} 
              className="bg-vitta-primary text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
            >
              Agendar
            </button>
            <button 
              onClick={() => navigate('/exames')}
              className="bg-slate-100 text-slate-700 px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all cursor-pointer"
            >
              Ver todos os exames
            </button>
          </div>
        </div>

        <div className="relative order-1 md:order-2">
          <div className="absolute -inset-2 md:-inset-4 bg-vitta-light/10 rounded-[2rem] md:rounded-[3.5rem] rotate-3" />
          <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white h-[250px] md:h-[500px]">
            <img 
              src="/imagens/cientista.png"
              className="w-full h-full object-cover" 
              alt="Atendimento VittaGene" 
            />
          </div>
        </div>
      </header>

      <section className="py-8 md:py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <QuickCard 
            title="Resultados" 
            icon={<ShieldCheck />}
            onClick={() => abrirWhatsapp("Olá! preciso do resultado do meu exame.")} />
          <QuickCard 
            title="Preços" 
            icon={<Calendar />} 
            onClick={() => navigate('/exames')} />
          <QuickCard 
            title="Onde estamos localizados"
            icon={<MapPin />}
            onClick={() => navigate('/contato')} />
          <QuickCard 
            title="Fale Conosco" 
            icon={<Phone />} 
            onClick={() => abrirWhatsapp("Olá! Vi a opção Fale Conosco no site.")} />
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden"
          >
            <SwiperSlide>
              <div className="bg-vitta-primary min-h-[300px] md:min-h-[350px] flex items-center p-8 md:p-16 text-white">
                <div className="z-10 space-y-4 max-w-2xl text-left">
                  <h2 className="text-3xl md:text-5xl font-black leading-tight">Ano novo,<br/>saúde em dia!</h2>
                  <p className="text-sm md:text-lg opacity-90 font-medium">Exames em casa.</p>
                  <button 
                    onClick={() => abrirWhatsapp("Olá! Vi o banner de Ano Novo e quero agendar exames.")}
                    className="bg-[#FF9F00] px-8 py-3 rounded-full font-black uppercase text-xs md:text-sm shadow-lg cursor-pointer"
                  >
                    Agendar Agora
                  </button>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-vitta-light min-h-[300px] md:min-h-[350px] flex items-center p-8 md:p-16 text-vitta-dark">
                <div className="z-10 space-y-4 max-w-2xl text-left">
                  <h2 className="text-3xl md:text-5xl font-black leading-tight">Vacinação sem <br/><span className="text-vitta-primary">sair de casa</span></h2>
                  <p className="text-sm md:text-lg opacity-80 font-bold">Proteção para toda a família com carinho e conforto.</p>
                  <button 
                    onClick={() => navigate('/vacinas')}
                    className="bg-vitta-primary text-white px-8 py-3 rounded-full font-black uppercase text-xs md:text-sm shadow-lg cursor-pointer"
                  >
                    Ver Vacinas
                  </button>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-slate-900">Agende em até <span className="text-vitta-primary">3 minutos!</span></h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="rounded-[2rem] overflow-hidden shadow-2xl h-[300px] md:h-[500px]">
                <img 
                  src="/imagens/modeloagendamento.jpg" 
                  className="w-full h-full object-cover" 
                  alt="Tecnologia VittaGene" 
                />
             </div>
             <div className="space-y-4">
                <StepCardWhite n="1" t="Na palma da sua mão" d="Faça tudo pelo nosso site ou app de forma prática e segura." />
                <StepCardWhite n="2" t="Escolha o serviço" d="Você pode agendar exames e vacinas." />
                <StepCardWhite n="3" t="Agende a visita" d="Escolha o melhor dia e horário para cuidar da saúde dentro da sua rotina." />
                <StepCardWhite n="4" t="Pronto! Vamos até você" d="Receba o cuidado sem filas, sem trânsito e sem sair de casa." />
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => abrirWhatsapp("Olá! Gostaria de agendar um exame através do site.")} 
              className="bg-vitta-primary text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
            >
              Agendar
            </button>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-slate-900">Dúvidas Frequentes</h2>
          <div className="space-y-4 text-left">
            <FAQItem question="Como funciona o atendimento domiciliar?" answer="É simples! Você agenda pelo site ou WhatsApp, e um de nossos profissionais especializados vai até sua casa ou escritório no horário marcado para realizar a coleta ou aplicação." />
            <FAQItem question="Preciso de pedido médico para realizar os exames?" answer="Para exames particulares e check-ups preventivos, alguns procedimentos podem ser realizados sem pedido. Consulte nossa equipe." />
            <FAQItem question="Como recebo meus resultados?" answer="Seus resultados são enviados por WhatsApp, e-mail e ficam disponíveis no nosso portal exclusivo." />
            <FAQItem question="Existe taxa de deslocamento?" answer="Nossa taxa de visita varia de acordo com a sua localização. Consulte seu CEP com nossos atendentes." />
            <FAQItem question="Como devo me preparar para o exame?" answer="O preparo varia para cada exame. Assim que agendar, enviaremos as instruções específicas." />    
          </div>
        </div>
      </section>
    </div>
  );
}