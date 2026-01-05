import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Exames from './pages/Exames';
import { 
  Search, MapPin, Phone, ShieldCheck, Calendar, 
  ArrowRight, Instagram, Facebook, Linkedin, Menu, X 
} from 'lucide-react';

// Imports do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


function Home() {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  const handleBusca = (e) => {
    if (e) e.preventDefault();
    navigate('/exames', { state: { query: termoBusca } });
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      
      {/* 1. NAVBAR */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-[100] border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-vitta-primary tracking-tighter">
            Vitta<span className="text-vitta-light uppercase font-extrabold text-3xl">GENE</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 font-bold text-slate-600 text-sm">
            <Link to="/exames" className="hover:text-vitta-primary transition-colors uppercase">Exames</Link>
            <a href="#" className="hover:text-vitta-primary transition-colors uppercase">Vacinas</a>
            <a href="#" className="hover:text-vitta-primary transition-colors uppercase">A Vitta</a>
            <a href="#" className="hover:text-vitta-primary transition-colors uppercase">Contato</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block bg-vitta-primary text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all cursor-pointer">
              Agendar
            </button>
            <button 
              className="md:hidden text-vitta-primary p-2 cursor-pointer"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              {menuAberto ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuAberto && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top duration-300">
            <Link to="/exames" className="text-lg font-bold text-slate-700" onClick={() => setMenuAberto(false)}>Exames</Link>
            <a href="#" className="text-lg font-bold text-slate-700">Vacinas</a>
            <a href="#" className="text-lg font-bold text-slate-700">A Vitta</a>
            <a href="#" className="text-lg font-bold text-slate-700">Contato</a>
            <button className="bg-vitta-primary text-white w-full py-4 rounded-2xl font-bold">Agendar Agora</button>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION - Imagem Visível no Mobile */}
      <header className="pt-28 md:pt-40 pb-8 md:pb-12 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 text-center md:text-left order-2 md:order-1">
          <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-tight">
            Exames onde <br/>
            <span className="text-vitta-light italic font-serif">você estiver.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
            Conforto e segurança para realizar seus exames laboratoriais em casa ou em nossas unidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button onClick={() => navigate('/exames')} className="bg-vitta-light text-vitta-dark px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
              Agendar Exames
            </button>
            <button className="bg-slate-100 text-slate-700 px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all cursor-pointer">
              Saiba mais
            </button>
          </div>
        </div>

        <div className="relative order-1 md:order-2">
          <div className="absolute -inset-2 md:-inset-4 bg-vitta-light/10 rounded-[2rem] md:rounded-[3.5rem] rotate-3" />
          <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 md:border-4 border-white h-[250px] md:h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover" 
              alt="Atendimento VittaGene" 
            />
          </div>
        </div>
      </header>

      {/* 3. BUSCA */}
      <section className="px-6 relative z-20 mb-12 md:-mt-8">
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

      {/* 4. QUICK CARDS */}
      <section className="py-8 md:py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <QuickCard title="Resultados" icon={<ShieldCheck />} />
          <QuickCard title="Preços" icon={<Calendar />} />
          <QuickCard title="Onde atendemos" icon={<MapPin />} />
          <QuickCard title="Fale Conosco" icon={<Phone />} />
        </div>
      </section>

      {/* 5. BANNER PROMOCIONAL */}
      {/* 5. BANNER ROTATIVO (5 Banners com Navegação Automática) */}
<section className="pb-20 px-6">
  <div className="max-w-7xl mx-auto">
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      navigation={true}
      pagination={{ clickable: true }}
      autoplay={{ 
        delay: 5000, 
        disableOnInteraction: false 
      }}
      className="rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden"
    >
      {/* Banner 1: Geral */}
      <SwiperSlide>
        <div className="bg-vitta-primary min-h-[300px] md:min-h-[350px] flex items-center p-8 md:p-16 text-white">
          <div className="z-10 space-y-4 max-w-2xl text-left">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">Ano novo,<br/>saúde em dia!</h2>
            <p className="text-sm md:text-lg opacity-90 font-medium">Exames em casa com + de 40 planos de saúde aceitos.</p>
            <button className="bg-[#FF9F00] px-8 py-3 rounded-full font-black uppercase text-xs md:text-sm shadow-lg cursor-pointer">Agendar Agora</button>
          </div>
        </div>
      </SwiperSlide>

      {/* Banner 2: Vacinas */}
      <SwiperSlide>
        <div className="bg-vitta-light min-h-[300px] md:min-h-[350px] flex items-center p-8 md:p-16 text-vitta-dark">
          <div className="z-10 space-y-4 max-w-2xl text-left">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">Vacinação sem <br/><span className="text-vitta-primary">sair de casa</span></h2>
            <p className="text-sm md:text-lg opacity-80 font-bold">Proteção para toda a família com carinho e conforto.</p>
            <button className="bg-vitta-primary text-white px-8 py-3 rounded-full font-black uppercase text-xs md:text-sm shadow-lg cursor-pointer">Ver Vacinas</button>
          </div>
        </div>
      </SwiperSlide>

      {/* Banner 3: Check-up */}
      <SwiperSlide>
        <div className="bg-slate-900 min-h-[300px] md:min-h-[350px] flex items-center p-8 md:p-16 text-white">
          <div className="z-10 space-y-4 max-w-2xl text-left">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">Check-up <br/>Performance</h2>
            <p className="text-sm md:text-lg opacity-80 font-medium">Avaliação completa para quem busca o máximo rendimento.</p>
            <button className="bg-vitta-light text-vitta-dark px-8 py-3 rounded-full font-black uppercase text-xs md:text-sm shadow-lg cursor-pointer">Saiba Mais</button>
          </div>
        </div>
      </SwiperSlide>

      {/* Banner 4: Genética */}
      <SwiperSlide>
        <div className="bg-gradient-to-r from-emerald-600 to-vitta-primary min-h-[300px] md:min-h-[350px] flex items-center p-8 md:p-16 text-white">
          <div className="z-10 space-y-4 max-w-2xl text-left">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">O futuro está <br/>no seu DNA</h2>
            <p className="text-sm md:text-lg opacity-90 font-medium">Testes genéticos para uma prevenção 100% personalizada.</p>
            <button className="bg-white text-vitta-primary px-8 py-3 rounded-full font-black uppercase text-xs md:text-sm shadow-lg cursor-pointer">Conhecer Testes</button>
          </div>
        </div>
      </SwiperSlide>

      {/* Banner 5: Empresas */}
      <SwiperSlide>
        <div className="bg-slate-50 min-h-[300px] md:min-h-[350px] flex items-center p-8 md:p-16 text-slate-900 border border-slate-100">
          <div className="z-10 space-y-4 max-w-2xl text-left">
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-vitta-primary">Saúde para <br/>sua Empresa</h2>
            <p className="text-sm md:text-lg text-slate-500 font-medium">Exames in-company e condições especiais para o seu time.</p>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase text-xs md:text-sm shadow-lg cursor-pointer">Falar com Consultor</button>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</section>

      {/* 6. PASSO A PASSO */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-slate-900">Agende em até <span className="text-vitta-light">3 minutos!</span></h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="rounded-[2rem] overflow-hidden shadow-2xl h-[300px] md:h-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover" 
                  alt="Tecnologia VittaGene" 
                />
             </div>
             <div className="space-y-4">
                <StepCardWhite n="1" t="Na palma da sua mão" d="Faça tudo pelo nosso site ou app de forma prática e segura." />
                <StepCardWhite n="2" t="Escolha o serviço" d="Você pode agendar exames e vacinas, pelo plano ou particular." />
                <StepCardWhite n="3" t="Agende a visita" d="Escolha o melhor dia e horário para cuidar da saúde dentro da sua rotina." />
                <StepCardWhite n="4" t="Pronto! Vamos até você" d="Receba o cuidado sem filas, sem trânsito e sem sair de casa." />
             </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-slate-900">Dúvidas Frequentes</h2>
          <div className="space-y-4 text-left">
            <FAQItem question="Atendem meu convênio?" answer="Atendemos mais de 40 planos de saúde. Você pode verificar a cobertura completa durante o agendamento." />
            <FAQItem question="Como recebo meus resultados?" answer="Seus resultados são enviados por WhatsApp, e-mail e ficam disponíveis no nosso portal exclusivo." />
          </div>
        </div>
      </section>

      {/* 8. FOOTER - RESTAURADO! */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="text-2xl font-black tracking-tighter">
                Vitta<span className="text-vitta-light uppercase font-extrabold text-3xl">GENE</span>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Levando o melhor da tecnologia diagnóstica até o conforto do seu lar com cuidado humanizado.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Instagram size={20} />} />
                <SocialIcon icon={<Facebook size={20} />} />
                <SocialIcon icon={<Linkedin size={20} />} />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-vitta-light uppercase text-xs tracking-widest">Serviços</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-bold">
                <li><Link to="/exames" className="hover:text-white transition-colors">Exames Laboratoriais</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Vacinas Domiciliares</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Check-ups</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-vitta-light uppercase text-xs tracking-widest">Institucional</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">Quem Somos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Onde Atendemos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold mb-6 text-vitta-light uppercase text-xs tracking-widest">Contato</h4>
              <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                <Phone size={18} />
                <span>0800 000 0000</span>
              </div>
              <button className="w-full bg-vitta-primary text-white py-3 rounded-xl font-black hover:brightness-110 transition-all cursor-pointer">
                Falar no WhatsApp
              </button>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <p>© 2024 VITTAGENE LAB. TODOS OS DIREITOS RESERVADOS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// COMPONENTE PRINCIPAL DE ROTAS
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exames" element={<Exames />} />
      </Routes>
    </Router>
  );
}

// COMPONENTES AUXILIARES
function QuickCard({ title, icon }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-[1.5rem] border border-slate-100 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer shadow-sm">
      <div className="text-vitta-primary p-3 bg-slate-50 rounded-2xl">{React.cloneElement(icon, { size: 24 })}</div>
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
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 p-6' : 'max-h-0'} bg-white text-slate-500 text-sm font-medium border-t border-slate-50`}>
        {answer}
      </div>
    </div>
  );
}

function SocialIcon({ icon }) {
  return (
    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-vitta-primary transition-all cursor-pointer">
      {icon}
    </div>
  );
}