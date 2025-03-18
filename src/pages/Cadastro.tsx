
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { registerUser } from '../lib/firebase';
import Navbar from '../components/Navbar';

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setLoading(true);
    
    try {
      await registerUser(email, password, name);
      toast.success("Conta criada com sucesso!");
      navigate('/');
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Este e-mail já está sendo usado por outra conta");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("E-mail inválido");
      } else if (error.code === 'auth/configuration-not-found') {
        toast.error("Erro na configuração do Firebase. Entre em contato com o suporte.");
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error("Operação não permitida. Entre em contato com o suporte.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("A senha é muito fraca. Use uma senha mais forte.");
      } else {
        toast.error(error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.");
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
                Crie sua conta
              </h1>
              <p className="text-french-gray">
                Comece sua jornada de aprendizado de francês para viagens
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-french-dark mb-1">Nome completo</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent transition-all"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-french-dark mb-1">Confirmar senha</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-french-blue focus:border-transparent transition-all"
                  placeholder="Confirme sua senha"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-french-blue hover:bg-french-lightBlue text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Cadastrando...' : 'Criar conta'}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-french-gray">
                Já tem uma conta?
                <Link
                  to="/login"
                  className="ml-1 text-french-blue hover:underline focus:outline-none"
                >
                  Entrar
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

export default Cadastro;
