import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

interface PodcastCardProps {
  title: string;
  description: string;
  coverUrl: string;
  spotifyUrl: string;
  episodes: number;
  level: string;
}

const PodcastCard = ({ title, description, coverUrl, spotifyUrl, episodes, level }: PodcastCardProps) => {
  return (
    <div className="glass-card hover-card-effect rounded-xl overflow-hidden transition-all">
      <div className="relative">
        <img 
          src={coverUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
          {episodes} episódios
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
          href={spotifyUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-french-blue hover:underline text-sm inline-flex items-center"
        >
          Ouvir no Spotify
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const PodcastsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const podcasts = [
    {
      title: "Francês Básico com Bruna Lewis",
      description: "Podcast com situações reais enfrentadas por viajantes com vocabulário e frases.",
      coverUrl: "https://i.scdn.co/image/ab6765630000ba8a0fec1fd063798375ad0d80a4",
      spotifyUrl: "https://open.spotify.com/show/4pmSKGa47kVGIU1oJtKT7O?si=c8a4d0f3f52a4d9c",
      episodes: "Diversos",
      level: "Iniciante"
    },
    {
      title: "Francês da Vida Real",
      description: "Diálogos cotidianos em francês com explicações detalhadas sobre vocabulário e dicas.",
      coverUrl: "https://i.scdn.co/image/ab67656300005f1f539c919834d26a351c6e6dc9",
      spotifyUrl: "https://open.spotify.com/show/5aw0WXMnL571WwSqYWGs1J?si=7f997219799e4890&nd=1&dlsi=17d09099b6aa4109",
      episodes: "Diversos",
      level: "Iniciante"
    },
    {
      title: "Francês com Raquel Ferpin",
      description: "Episódios curtos focados em vocabulário e gramática.",
      coverUrl: "https://i.scdn.co/image/ab67656300005f1f0205eb432be44f9350e279ff",
      spotifyUrl: "https://open.spotify.com/show/5dETuUQ1FjPx96yLhgsIGE?si=d05293d2eca84df2",
      episodes: "Diversos",
      level: "Iniciante"
    },
    {
      title: "Fala Francês com LinguaBoost",
      description: "Aprenda vocabulário e frases do dia a dia.",
      coverUrl: "https://d3wo5wojvuv7l.cloudfront.net/t_square_limited_720/images.spreaker.com/original/7d74d39b2a5fc5e2c604b0f63192acb7.jpg",
      spotifyUrl: "https://open.spotify.com/show/71AiC0vVbcOu77ujmJpIlt?si=3ba95a2d347b488a",
      episodes: "Diversos",
      level: "Iniciante"
    },
    {
      title: "100% Français Authentique",
      description: "Narrativas simples em francês para treinar sua compreensão auditiva de forma divertida.",
      coverUrl: "https://i.scdn.co/image/ab6765630000ba8a04139745250c1cdaa721406f",
      spotifyUrl: "https://open.spotify.com/show/7DdASHevothGIuE4bh0hkg",
      episodes: "Diversos",
      level: "Avançado"
    },
    {
      title: "Journal en Français Facile",
      description: "Jornal em francês para treinar sua audição.",
      coverUrl: "https://i.scdn.co/image/ab6765630000ba8abd69ca14a6d766dc2f47adc1",
      spotifyUrl: "https://open.spotify.com/show/0AVkxaaQWUC6QAn38x5OmR?si=e4a63e7d10c647b3",
      episodes: "Diversos",
      level: "Avançado"
    },
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
            <h1 className="text-4xl font-bold text-french-dark mb-4">Podcasts em Francês</h1>
            <p className="text-french-gray">
              Aprimore seu francês ouvindo podcasts selecionados especialmente para viajantes.
              Treine seu ouvido e aprenda novas expressões enquanto se diverte.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {podcasts.map((podcast, index) => (
              <PodcastCard 
                key={index}
                title={podcast.title}
                description={podcast.description}
                coverUrl={podcast.coverUrl}
                spotifyUrl={podcast.spotifyUrl}
                episodes={podcast.episodes}
                level={podcast.level}
              />
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PodcastsPage;