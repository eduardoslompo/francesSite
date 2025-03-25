import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  level: string;
}

const VideoCard = ({ title, description, thumbnailUrl, videoUrl, duration, level }: VideoCardProps) => {
  return (
    <div className="glass-card hover-card-effect rounded-xl overflow-hidden transition-all">
      <div className="relative">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
          {duration}
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-french-dark">{title}</h3>
          <span className="text-xs py-1 px-2 bg-french-lightGray rounded-full text-french-gray">
            {level}
          </span>
        </div>
        
        <p className="text-french-gray mb-4 text-sm">{description}</p>
        
        <a 
          href={videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-french-blue hover:underline text-sm inline-flex items-center"
        >
          Assistir no YouTube
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const VideoaulasPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const videos = [
    {
      title: "Expressões básicas para viajantes",
      description: "Aprenda as expressões mais comuns que você vai precisar durante sua viagem à França.",
      thumbnailUrl: "https://img.youtube.com/vi/DcJnwwstEXI/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=DcJnwwstEXI",
      duration: "09:51",
      level: "Iniciante"
    },
    {
      title: "Como pedir comida em restaurantes",
      description: "Vocabulário essencial para fazer pedidos em restaurantes franceses com confiança.",
      thumbnailUrl: "https://img.youtube.com/vi/Gzj_MwsXhrQ/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=Gzj_MwsXhrQ",
      duration: "06:05",
      level: "Iniciante"
    },
    {
      title: "Navegando no transporte público",
      description: "Aprenda a usar o metrô, ônibus e trem na França com facilidade.",
      thumbnailUrl: "https://img.youtube.com/vi/0ySlsvRvCLk/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=0ySlsvRvCLk",
      duration: "12:31",
      level: "Intermediário"
    },
    {
      title: "Conversação: Fazendo compras",
      description: "Diálogos práticos para situações de compras em lojas, mercados e farmácias.",
      thumbnailUrl: "https://img.youtube.com/vi/7S6Sl3SpT6g/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=7S6Sl3SpT6g",
      duration: "08:46",
      level: "Intermediário"
    },
    {
      title: "Pronúncia avançada para viajantes",
      description: "Dicas para melhorar sua pronúncia e soar mais natural ao falar francês.",
      thumbnailUrl: "https://img.youtube.com/vi/csMgcYIbvN8/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=csMgcYIbvN8",
      duration: "33:13",
      level: "Avançado"
    },
    {
      title: "Expressões idiomáticas francesas",
      description: "Conheça expressões idiomáticas comuns que vão impressionar os nativos.",
      thumbnailUrl: "https://img.youtube.com/vi/Awg_s8uoavA/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=Awg_s8uoavA",
      duration: "144:09",
      level: "Avançado"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-french-lightGray py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link to="/recursos" className="text-french-blue hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para Recursos
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-french-dark mb-4">Videoaulas de Francês</h1>
            <p className="text-french-gray">
              Aprenda francês com nossas videoaulas selecionadas especialmente para viajantes.
              Desde expressões básicas até conversações avançadas para situações reais.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <VideoCard 
                key={index}
                title={video.title}
                description={video.description}
                thumbnailUrl={video.thumbnailUrl}
                videoUrl={video.videoUrl}
                duration={video.duration}
                level={video.level}
              />
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoaulasPage;