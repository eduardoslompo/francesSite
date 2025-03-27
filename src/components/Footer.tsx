import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 py-6 sm:py-8 md:py-12">
          <div>
            <div className="font-pacifico text-xl sm:text-2xl text-white mb-3 sm:mb-4">aprender francês</div>
            <p className="text-gray-400 text-sm sm:text-base mb-4">
              Aprenda francês de forma prática e divertida para suas viagens.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-medium text-base sm:text-lg mb-3 sm:mb-4">REDES SOCIAIS</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4">
              Conecte-se conosco e acompanhe nossas novidades.
            </p>
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <a 
                href="https://instagram.com/aprenderfrancesdozero" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                Instagram
              </a>
              <a 
                href="mailto:aprenderfrancesdozero@gmail.com" 
                className="flex items-center text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                aprenderfrancesdozero@gmail.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 sm:mt-8 md:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs sm:text-sm">© 2025 Todos os direitos reservados.</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-0">
            <span className="text-gray-400">Aprenda Francês</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
