
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
      className="hero-section min-h-[70vh] flex items-center justify-center opacity-0 text-center text-white relative"
    >
      <div 
        ref={textRef}
        className="container mx-auto px-4 py-16 opacity-0"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-sans">
          Aprenda Francês em Diversas Situações
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Domine o francês essencial para suas viagens com lições práticas e situações do dia a dia.
        </p>
        <Link
          to="/situacoes"
          className="btn-primary inline-block text-lg"
        >
          Começar Agora
        </Link>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none"></div>
    </div>
  );
};

export default Hero;
