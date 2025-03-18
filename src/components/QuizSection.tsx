
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface QuizCardProps {
  level: string;
  tag: string;
  delay?: number;
}

const QuizCard = ({ level, tag, delay = 0 }: QuizCardProps) => {
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

  const getTagClass = () => {
    switch (tag) {
      case 'Básico':
        return 'level-basico';
      case 'Médio':
        return 'level-medio';
      case 'Expert':
        return 'level-expert';
      default:
        return 'level-basico';
    }
  };

  return (
    <div 
      ref={cardRef}
      className="glass-card hover-card-effect rounded-xl p-6 opacity-0"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-french-dark">{level}</h3>
        <span className={`level-tag ${getTagClass()}`}>{tag}</span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-french-blue rounded-full"
          style={{ width: tag === 'Básico' ? '30%' : tag === 'Médio' ? '20%' : '10%' }}  
        ></div>
      </div>
      
      <div className="mt-8">
        <Link
          to={`/quizzes/${level.toLowerCase()}`}
          className="btn-primary w-full block text-center"
        >
          Iniciar Quiz
        </Link>
      </div>
    </div>
  );
};

const QuizSection = () => {
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
      className="py-20 bg-white opacity-0"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-french-dark mb-12">
          Quizzes por Nível
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <QuizCard level="Básico" tag="Básico" delay={100} />
          <QuizCard level="Intermediário" tag="Médio" delay={300} />
          <QuizCard level="Avançado" tag="Expert" delay={500} />
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
