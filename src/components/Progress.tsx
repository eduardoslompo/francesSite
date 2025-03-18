
import React, { useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const progressData = [
  { day: 'Seg', progress: 10 },
  { day: 'Ter', progress: 12 },
  { day: 'Qua', progress: 15 },
  { day: 'Qui', progress: 20 },
  { day: 'Sex', progress: 25 },
  { day: 'Sáb', progress: 30 },
  { day: 'Dom', progress: 36 },
];

interface AchievementProps {
  icon: string;
  title: string;
  description: string;
  status: 'conquistado' | 'em progresso';
  progress?: number;
  delay?: number;
}

const Achievement = ({ icon, title, description, status, progress = 0, delay = 0 }: AchievementProps) => {
  const achievementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              achievementRef.current?.classList.add('animate-fade-up');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (achievementRef.current) {
      observer.observe(achievementRef.current);
    }
    
    return () => {
      if (achievementRef.current) {
        observer.unobserve(achievementRef.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={achievementRef}
      className="flex items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 opacity-0"
    >
      <div className="w-10 h-10 bg-french-lightBlue/10 rounded-full flex items-center justify-center text-french-blue font-medium mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-french-dark">{title}</h4>
        <p className="text-sm text-french-gray">{description}</p>
      </div>
      <div className="text-right">
        {status === 'conquistado' ? (
          <span className="status-conquistado">Conquistado</span>
        ) : (
          <>
            <span className="status-progress">Em progresso</span>
            <div className="mt-1 h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-french-blue rounded-full"
                style={{ width: `${progress}%` }}  
              ></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Progress = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            sectionRef.current?.classList.add('animate-fade-in');
            setTimeout(() => {
              chartRef.current?.classList.add('animate-fade-up');
            }, 300);
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
          Seu Progresso
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div 
            ref={chartRef}
            className="progress-card opacity-0"
          >
            <h3 className="text-xl font-semibold text-french-dark mb-6">
              Evolução de Aprendizado
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }} 
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#5752E1"
                    strokeWidth={3}
                    dot={{ fill: '#5752E1', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#5752E1', strokeWidth: 0, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-french-dark mb-6">
              Conquistas
            </h3>
            <div className="space-y-4">
              <Achievement 
                icon="1"
                title="Básico em Francês"
                description="Complete 5 lições básicas"
                status="conquistado"
                delay={100}
              />
              <Achievement 
                icon="2"
                title="Mestre da Culinária"
                description="Complete todas as lições de restaurante"
                status="em progresso"
                progress={60}
                delay={300}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Progress;
