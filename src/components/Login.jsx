import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Erro ao entrar: " + error.message);
      } else if (data?.session) {
        // Atualiza o estado global no App.jsx
        if (onLogin) {
          onLogin(data.session);
        }
        // Força a navegação para a rota de agendamento
        navigate('/agendamento');
      }
    } catch (err) {
      alert("Ocorreu um erro inesperado. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <img 
            src="/imagens/LogoVitta.png" 
            alt="VittaGene Logo" 
            className="h-12 mx-auto mb-4" 
          />
          <h2 className="text-2xl font-bold text-slate-800">Acesso ao Painel</h2>
          <p className="text-slate-500 text-sm">Identifique-se para gerenciar os agendamentos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              E-mail de Colaborador
            </label>
            <input 
              type="email" 
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#006363] outline-none transition-all"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Senha
            </label>
            <input 
              type="password" 
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#006363] outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#006363] text-white font-bold py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#006363]/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Autenticando...
              </span>
            ) : (
              'Acessar Sistema'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Acesso restrito. Se esqueceu sua senha, entre em contato com o suporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;