import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Microscope, HeartPulse, Home, Award, Users } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <main className="pt-32 md:pt-48 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
        
        {/* VOLTAR */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-vitta-primary font-bold hover:opacity-70 transition-all">
            <ArrowLeft size={20} /> Voltar para o início
          </Link>
        </div>

        {/* HERO SECTION */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              Inovação que pulsa <br/>
              <span className="text-vitta-light italic font-serif">pelo seu bem-estar.</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
              A **VittaGene** nasceu para ressignificar o cuidado com a saúde. Unimos tecnologia laboratorial de ponta com o acolhimento do atendimento domiciliar, levando segurança e conforto até onde você estiver.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square bg-vitta-primary/5 rounded-[4rem] flex items-center justify-center p-8 border-2 border-dashed border-vitta-primary/20">
              <Microscope size={120} className="text-vitta-primary opacity-20 absolute top-10 right-10" />
              <ShieldCheck size={200} className="text-vitta-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* DIFERENCIAIS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <CardDiferencial 
            icon={<Home size={32} />} 
            title="Conforto Real" 
            text="Coleta de exames e vacinação sem filas, no silêncio e segurança do seu lar."
          />
          <CardDiferencial 
            icon={<Award size={32} />} 
            title="Excelência Médica" 
            text="Processos rigorosos e parcerias com os melhores laboratórios do país."
          />
          <CardDiferencial 
            icon={<Users size={32} />} 
            title="Equipe Humanizada" 
            text="Profissionais treinados para um atendimento acolhedor, do bebê ao idoso."
          />
        </div>

        {/* NOSSA MISSÃO */}
        <div className="bg-white rounded-[4rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="max-w-3xl mx-auto text-center">
            <HeartPulse className="text-vitta-light mx-auto mb-6" size={48} />
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Nossa Missão</h3>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              "Democratizar o acesso a diagnósticos precisos e imunização de qualidade, eliminando barreiras geográficas e burocráticas através de uma experiência digital fluida e um atendimento domiciliar impecável."
            </p>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-24 text-center">
          <h4 className="text-2xl font-black text-slate-900 mb-6">Pronto para cuidar da sua saúde?</h4>
          <Link 
            to="/vacinas" 
            className="inline-block bg-vitta-primary text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-vitta-primary/30 hover:scale-105 transition-all"
          >
            Ver Vacinas Disponíveis
          </Link>
        </div>

      </main>
    </div>
  );
}

// Subcomponente para os cards de diferenciais
function CardDiferencial({ icon, title, text }) {
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 hover:shadow-xl transition-all group">
      <div className="w-16 h-16 bg-slate-50 text-vitta-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-vitta-primary group-hover:text-white transition-all">
        {icon}
      </div>
      <h4 className="font-black text-slate-800 text-xl mb-3">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed">{text}</p>
    </div>
  );
}