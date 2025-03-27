import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.classList.add('animate-fade-in');
    }
    
    if (textRef.current) {
      setTimeout(() => {
        textRef.current?.classList.add('animate-fade-up');
      }, 300);
    }
  }, []);

  return (
    <div 
      ref={heroRef}
      className="hero-section min-h-[60vh] md:min-h-[70vh] flex items-center justify-center opacity-0 text-center text-white relative"
    >
      <div 
        ref={textRef}
        className="container mx-auto px-4 py-6 sm:py-8 md:py-16 opacity-0"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 font-sans leading-tight">
          Aprenda Francês em Diversas Situações
        </h1>
        <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
          Domine o francês essencial para suas viagens com lições práticas e situações do dia a dia.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/situacoes"
            className="btn-primary w-full sm:w-auto py-2 px-4 sm:px-6 text-sm sm:text-base md:text-lg"
          >
            Começar Agora
          </Link>
          <a 
            href="https://pay.hotmart.com/V98903835C" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-outline w-full sm:w-auto py-2 px-4 sm:px-6 text-sm sm:text-base md:text-lg"
          >
            Comprar Acesso
          </a>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none"></div>
    </div>
  );
};

export default Hero;
