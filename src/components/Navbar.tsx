
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { auth, logoutUser } from '../lib/firebase';
import { toast } from 'sonner';

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-pacifico text-2xl text-french-blue">
            aprender francês
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn("nav-link", isActive("/") && "active")}
          >
            Início
          </Link>
          <Link 
            to="/situacoes" 
            className={cn("nav-link", isActive("/situacoes") && "active")}
          >
            Situações
          </Link>
          <Link 
            to="/quizzes" 
            className={cn("nav-link", isActive("/quizzes") && "active")}
          >
            Quizzes
          </Link>
          <Link 
            to="/recursos" 
            className={cn("nav-link", isActive("/recursos") && "active")}
          >
            Recursos
          </Link>
          <Link 
            to="/progresso" 
            className={cn("nav-link", isActive("/progresso") && "active")}
          >
            Progresso
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md"></div>
          ) : user ? (
            <>
              <span className="text-french-dark">
                Olá, {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out"
              >
                Entrar
              </Link>
              <Link 
                to="/cadastro" 
                className="border border-french-blue text-french-blue hover:bg-french-blue hover:text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
