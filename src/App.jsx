import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Phone, Instagram, Facebook, Linkedin, Menu, X } from 'lucide-react';

// Import das páginas
import Home from './pages/Home';
import Exames from './pages/Exames';
import Vacinas from './pages/Vacinas';
import Contato from './pages/Contato';
import Sobre from './pages/Sobre';

// --- CONFIGURAÇÃO GLOBAL ---
const WHATSAPP_NUMBER = "5521991992185";
const abrirWhatsapp = (mensagem) => {
  const msg = encodeURIComponent(mensagem || "Olá, VittaGene! Gostaria de mais informações.");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
};

// --- COMPONENTE NAVBAR ---
function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-[1000] border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center" onClick={() => setMenuAberto(false)}>
          <img 
            src="/imagens/LogoVitta.png" 
            alt="VittaGene Logo" 
            className="h-12 md:h-16 w-auto object-contain" 
          />
        </Link>

        <div className="hidden md:flex gap-8 font-bold text-slate-600 text-sm">
          <Link to="/" className="hover:text-vitta-primary transition-colors uppercase">Home</Link>
          <Link to="/exames" className="hover:text-vitta-primary transition-colors uppercase">Exames</Link>
          <Link to="/vacinas" className="hover:text-vitta-primary transition-colors uppercase">Vacinas</Link>
          <Link to="/sobre" className="hover:text-vitta-primary transition-colors uppercase">Sobre</Link>
          <Link to="/contato" className="hover:text-vitta-primary transition-colors uppercase">Contato</Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => abrirWhatsapp("Olá! Gostaria de realizar um agendamento.")}
            className="hidden md:block bg-vitta-primary text-white px-8 py-3 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
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

      {menuAberto && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-xl">
          <Link to="/" className="text-lg font-bold text-slate-700" onClick={() => setMenuAberto(false)}>Home</Link>
          <Link to="/exames" className="text-lg font-bold text-slate-700" onClick={() => setMenuAberto(false)}>Exames</Link>
          <Link to="/vacinas" className="text-lg font-bold text-slate-700" onClick={() => setMenuAberto(false)}>Vacinas</Link>
          <Link to="/sobre" className="text-lg font-bold text-slate-700" onClick={() => setMenuAberto(false)}>Sobre</Link>
          <Link to="/contato" className="text-lg font-bold text-slate-700" onClick={() => setMenuAberto(false)}>Contato</Link>
          <button 
            onClick={() => { abrirWhatsapp("Olá! Quero agendar pelo celular."); setMenuAberto(false); }}
            className="bg-vitta-primary text-white w-full py-4 rounded-2xl font-bold"
          >
            Agendar Agora
          </button>
        </div>
      )}
    </nav>
  );
}

// --- COMPONENTE SOCIAL ICON (CLICÁVEL) ---
function SocialIcon({ icon, href }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-vitta-primary transition-all cursor-pointer"
    >
      {icon}
    </a>
  );
}

// --- COMPONENTE FOOTER ---
function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <img src="/imagens/LogoVitta.png" alt="Logo" className="h-12 brightness-0 invert" />
            <p className="text-slate-400 text-sm font-medium"> Levando o melhor da tecnologia diagnóstica até o conforto do seu lar com cuidado humanizado.</p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={20} />} href="https://instagram.com/vittagene" />
              <SocialIcon icon={<Facebook size={20} />} href="https://facebook.com/vittagene" />
              <SocialIcon icon={<Linkedin size={20} />} href="https://linkedin.com/company/vittagene" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-vitta-light uppercase text-xs tracking-widest">Serviços</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold">
              <li><Link to="/exames">Exames</Link></li>
              <li><Link to="/vacinas">Vacinas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-vitta-light uppercase text-xs tracking-widest">Institucional</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold">
              <li><Link to="/sobre">Quem Somos</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold mb-6 text-vitta-light uppercase text-xs tracking-widest">Contato</h4>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
              <Phone size={18} />
              <span>21 991992185</span>
            </div>
            <button 
              onClick={() => abrirWhatsapp()}
              className="w-full bg-vitta-primary text-white py-3 rounded-xl font-black hover:brightness-110 transition-all"
            >
              Falar no WhatsApp
            </button>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-[10px] font-bold uppercase">
          <p>© 2024 VITTAGENE LAB. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </div>
    </footer>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exames" element={<Exames />} />
        <Route path="/vacinas" element={<Vacinas />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
      <Footer />
    </Router>
  );
}