import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { auth, logoutUser } from '../lib/firebase';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Fechar menu móvel quando mudar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout realizado com sucesso!");
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLinks = () => (
    <>
      <Link 
        to="/" 
        className={cn("nav-link py-2 px-3", isActive("/") && "active")}
      >
        Início
      </Link>
      <Link 
        to="/situacoes" 
        className={cn("nav-link py-2 px-3", isActive("/situacoes") && "active")}
      >
        Situações
      </Link>
      <Link 
        to="/quizzes" 
        className={cn("nav-link py-2 px-3", isActive("/quizzes") && "active")}
      >
        Quizzes
      </Link>
      <Link 
        to="/pronuncia" 
        className={cn("nav-link py-2 px-3", isActive("/pronuncia") && "active")}
      >
        Pronúncia
      </Link>
      <Link 
        to="/recursos" 
        className={cn("nav-link py-2 px-3", isActive("/recursos") && "active")}
      >
        Recursos
      </Link>
      <Link 
        to="/progresso" 
        className={cn("nav-link py-2 px-3", isActive("/progresso") && "active")}
      >
        Progresso
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-pacifico text-xl sm:text-2xl text-french-blue">
              aprender francês
            </span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>
          
          {/* Botões de Ação Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 bg-french-blue text-white px-4 py-2 rounded-md hover:bg-french-lightBlue transition-all">
                  <User size={16} />
                  <span>{user.displayName?.split(' ')[0] || user.email?.split('@')[0]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    <Settings size={16} className="mr-2" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out"
                >
                  Entrar
                </Link>
                <a 
                  href="https://pay.hotmart.com/V98903835C" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-french-blue text-french-blue hover:bg-french-blue hover:text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out"
                >
                  Comprar Acesso
                </a>
              </>
            )}
          </div>

          {/* Botão Hamburger Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-french-dark hover:text-french-blue"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="py-2 space-y-1 flex flex-col">
              <NavLinks />
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              {loading ? (
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
              ) : user ? (
                <div className="space-y-1">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Logado como <span className="font-medium text-french-dark">{user.displayName || user.email}</span>
                  </div>
                  <button
                    onClick={() => navigate('/perfil')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center"
                  >
                    <Settings size={16} className="mr-2" />
                    Meu Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-4">
                  <Link 
                    to="/login" 
                    className="block w-full text-center bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out"
                  >
                    Entrar
                  </Link>
                  <a 
                    href="https://pay.hotmart.com/V98903835C" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center border border-french-blue text-french-blue hover:bg-french-blue hover:text-white font-medium py-2 px-4 rounded-md transition-all duration-300 ease-in-out"
                  >
                    Comprar Acesso
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
