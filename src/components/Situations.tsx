
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface SituationCardProps {
  title: string;
  description: string;
  image: string;
  delay?: number;
}

const SituationCard = ({ title, description, image, delay = 0 }: SituationCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              cardRef.current?.classList.add('animate-fade-up');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className="glass-card hover-card-effect rounded-xl overflow-hidden opacity-0"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-french-dark mb-2">{title}</h3>
        <p className="text-french-gray mb-4">{description}</p>
        <Link 
          to={`/situacoes/${title.toLowerCase()}`}
          className="text-french-blue font-medium hover:underline"
        >
          Aprender mais →
        </Link>
      </div>
    </div>
  );
};

const Situations = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            sectionRef.current?.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-french-lightGray opacity-0"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-french-dark mb-12">
          Situações do Dia a Dia
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SituationCard 
            title="Restaurante" 
            description="Aprenda a fazer pedidos, entender o cardápio e interagir com garçons."
            image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            delay={100}
          />
          <SituationCard 
            title="Hotel" 
            description="Vocabulário essencial para check-in, serviços e comunicação com staff."
            image="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            delay={300}
          />
          <SituationCard 
            title="Transporte" 
            description="Como se locomover usando metrô, ônibus e táxi na França."
            image="https://images.unsplash.com/photo-1515165562839-978bbcf18277?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            delay={500}
          />
        </div>
        
        <div className="text-center mt-12">
          <Link
            to="/situacoes"
            className="btn-outline inline-block"
          >
            Ver todas as situações
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Situations;
