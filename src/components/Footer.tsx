import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="font-pacifico text-2xl text-white mb-4">aprender francês</div>
            <p className="text-gray-400 mb-4">
              Aprenda francês de forma prática e divertida para suas viagens.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-medium text-lg mb-4">REDES SOCIAIS</h3>
            <p className="text-gray-400 mb-4">
              Conecte-se conosco e acompanhe nossas novidades.
            </p>
            <div className="flex flex-col space-y-3">
              <a 
                href="https://instagram.com/aprenderfrances" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                Instagram
              </a>
              <a 
                href="mailto:contato@aprenderfrances.com" 
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                contato@aprenderfrances.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 Todos os direitos reservados.</p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            <span className="text-gray-400">Aprenda Francês</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
