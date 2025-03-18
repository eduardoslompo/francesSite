
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ResourceCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  type: string;
}

const ResourceCard = ({ title, description, icon, link, type }: ResourceCardProps) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="glass-card hover-card-effect rounded-xl p-6 block transition-all"
    >
      <div className="flex items-center mb-4">
        <div className="bg-french-blue/10 w-10 h-10 rounded-full flex items-center justify-center text-french-blue mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-french-dark">{title}</h3>
      </div>
      
      <p className="text-french-gray mb-4 text-sm">{description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs py-1 px-2 bg-french-lightGray rounded-full text-french-gray">
          {type}
        </span>
        <span className="text-french-blue hover:underline text-sm">Ver recurso →</span>
      </div>
    </a>
  );
};

const ResourcesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const resources = [
    {
      title: "Guia de Pronúncia",
      description: "Aprenda a pronúncia correta das palavras e frases mais comuns em francês.",
      icon: "🔊",
      link: "#",
      type: "PDF"
    },
    {
      title: "Vocabulário Essencial",
      description: "Lista com 200 palavras e frases essenciais para sua viagem.",
      icon: "📝",
      link: "#",
      type: "PDF"
    },
    {
      title: "Frases para Emergências",
      description: "Frases úteis para situações de emergência durante sua viagem.",
      icon: "🚨",
      link: "#",
      type: "PDF"
    },
    {
      title: "Videoaulas de Conversação",
      description: "Série de videoaulas focadas em conversação para viajantes.",
      icon: "🎥",
      link: "#",
      type: "Vídeo"
    },
    {
      title: "Podcast: Francês na Estrada",
      description: "Podcast com situações reais enfrentadas por viajantes na França.",
      icon: "🎧",
      link: "#",
      type: "Áudio"
    },
    {
      title: "Flashcards para Impressão",
      description: "Flashcards com palavras e frases essenciais para estudar offline.",
      icon: "🗂️",
      link: "#",
      type: "PDF"
    },
    {
      title: "Mapa do Metrô de Paris",
      description: "Mapa completo do metrô de Paris com vocabulário relacionado.",
      icon: "🗺️",
      link: "#",
      type: "PDF"
    },
    {
      title: "Guia de Restaurantes",
      description: "Guia com termos culinários franceses e como fazer pedidos.",
      icon: "🍽️",
      link: "#",
      type: "PDF"
    },
    {
      title: "Aplicativo Offline",
      description: "Aplicativo com frases essenciais que funciona sem internet.",
      icon: "📱",
      link: "#",
      type: "App"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-french-lightGray py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-french-dark mb-4">Recursos</h1>
            <p className="text-french-gray">
              Acesse materiais complementares para aprimorar seu aprendizado de francês para viagens.
              Baixe guias, flashcards e muito mais para estudar offline.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <ResourceCard 
                key={index}
                title={resource.title}
                description={resource.description}
                icon={resource.icon}
                link={resource.link}
                type={resource.type}
              />
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResourcesPage;
