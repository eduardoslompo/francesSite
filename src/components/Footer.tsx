import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-pacifico text-2xl text-white mb-4">aprender francês</div>
            <p className="text-gray-400 mb-4">
              Aprenda francês de forma prática e divertida para suas viagens.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-medium text-lg mb-4">LINKS RÁPIDOS</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre-nos" className="text-gray-400 hover:text-white transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium text-lg mb-4">LEGAL</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/termos" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium text-lg mb-4">NEWSLETTER</h3>
            <p className="text-gray-400 mb-4">
              Receba dicas e novidades sobre aprendizado de francês.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Seu email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-french-blue"
              />
              <button className="bg-french-blue text-white px-4 py-2 rounded-r-md hover:bg-french-lightBlue transition-colors">
                Inscrever
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2023 Todos os direitos reservados.</p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            Designed by <span className="text-gray-400">Lovable</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
