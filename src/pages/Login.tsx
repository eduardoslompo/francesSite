
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { loginUser } from '../lib/firebase';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await loginUser(email, password);
      toast.success("Login realizado com sucesso!");
      navigate('/');
    } catch (error: any) {
      console.error("Erro de login:", error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error("Email ou senha incorretos");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Email inválido");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Muitas tentativas de login. Tente novamente mais tarde");
      } else if (error.code === 'auth/configuration-not-found') {
        toast.error("Erro na configuração do Firebase. Entre em contato com o suporte.");
      } else {
        toast.error(error.message || "Ocorreu um erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <Link to="/" className="inline-block mb-8">
                <span className="font-pacifico text-3xl text-french-blue">aprender francês</span>
              </Link>
              <h1 className="text-3xl font-bold text-french-dark mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-french-gray">
                Entre para continuar sua jornada de aprendizado de francês
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-french-dark mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-french-dark mb-1">Senha</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent transition-all"
                  placeholder="Sua senha"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-french-blue hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-french-blue hover:bg-french-lightBlue text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-french-gray">
                Ainda não tem uma conta?
                <Link
                  to="/cadastro"
                  className="ml-1 text-french-blue hover:underline focus:outline-none"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block w-1/2 bg-[url('/imgs/paris.jpg')] bg-cover bg-center">
          <div className="h-full w-full bg-black/50 flex items-center justify-center p-12">
            <div className="max-w-md text-white">
              <h2 className="text-3xl font-bold mb-4">Aprenda francês para suas viagens</h2>
              <p className="mb-6">
                Domine o idioma com lições práticas focadas em situações reais que você enfrentará na França.
                Pratique com quizzes interativos e acompanhe seu progresso.
              </p>
              <Link
                to="/"
                className="inline-block border-2 border-white text-white hover:bg-white hover:text-french-dark font-medium py-2 px-6 rounded-md transition-colors"
              >
                Conheça nosso método
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
