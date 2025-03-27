import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaginaVendas = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-french-blue to-french-lightBlue py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <span className="bg-yellow-500 text-french-dark font-bold px-4 py-1 rounded-full text-sm inline-block mb-4">MÉTODO EXCLUSIVO PARA VIAJANTES</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Domine o Francês para suas Viagens em Apenas 8 Semanas</h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
            Aprenda francês de forma prática e divertida com situações reais que você vai enfrentar na França
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            <span className="font-bold">Sem decorar regras gramaticais</span> e <span className="font-bold">sem perder tempo</span> com conteúdos que você nunca vai usar
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 mr-2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Mais de 1.500 alunos</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 mr-2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Acesso vitalício</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 mr-2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Garantia de 7 dias</span>
            </div>
          </div>
          <a 
            href="https://pay.hotmart.com/V98903835C" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-yellow-500 text-french-dark hover:bg-yellow-400 font-bold py-4 px-8 rounded-full text-lg inline-block transition-colors shadow-lg animate-pulse"
          >
            QUERO APRENDER FRANCÊS AGORA
          </a>
          <p className="text-sm mt-4 opacity-80">Oferta por tempo limitado • Acesso imediato após a compra</p>
        </div>
      </div>
      
      {/* Problemas e Soluções */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-french-dark mb-6">Você já passou por alguma dessas situações?</h2>
          <p className="text-xl text-center text-french-gray mb-12 max-w-3xl mx-auto">Muitos brasileiros enfrentam dificuldades ao viajar para países de língua francesa</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400">
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-french-dark mb-2">Medo de não conseguir se comunicar</h3>
                  <p className="text-french-gray">Sentir-se inseguro por não saber como pedir informações, comida ou ajuda em situações básicas.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400">
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-french-dark mb-2">Frustração com métodos tradicionais</h3>
                  <p className="text-french-gray">Estudar gramática por meses e ainda não conseguir formar frases simples em situações reais.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400">
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-french-dark mb-2">Perder oportunidades de conexão</h3>
                  <p className="text-french-gray">Não conseguir interagir com locais e perder experiências culturais enriquecedoras por causa da barreira linguística.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400">
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-french-dark mb-2">Dependência de tradutores</h3>
                  <p className="text-french-gray">Ficar preso ao celular ou dicionários o tempo todo, perdendo a espontaneidade das interações.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-french-dark mb-4">A boa notícia é que existe uma solução!</h3>
            <p className="text-xl text-french-gray max-w-3xl mx-auto">Nosso método foi desenvolvido especificamente para viajantes que precisam aprender francês de forma rápida e prática</p>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-french-dark mb-12">O Que Você Vai Aprender</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-french-lightGray p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-french-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-french-dark mb-3">Conversação Prática</h3>
              <p className="text-french-gray">Aprenda frases e diálogos úteis para situações reais como restaurantes, hotéis, transporte e emergências.</p>
            </div>
            
            <div className="bg-french-lightGray p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-french-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-french-dark mb-3">Pronúncia Perfeita</h3>
              <p className="text-french-gray">Domine a pronúncia francesa com exercícios práticos e áudios de falantes nativos.</p>
            </div>
            
            <div className="bg-french-lightGray p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="bg-french-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-french-dark mb-3">Vocabulário Essencial</h3>
              <p className="text-french-gray">Aprenda as palavras e expressões mais importantes para se comunicar com confiança na França.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* O que está incluído */}
      <div className="py-16 bg-french-lightGray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-french-dark mb-12">O Que Está Incluído No Curso</h2>
            
            <div className="space-y-6">
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-french-blue text-white p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-french-dark mb-2">Mais de 50 Situações Práticas</h3>
                  <p className="text-french-gray">Diálogos e frases úteis para restaurantes, hotéis, compras, transporte e muito mais.</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-french-blue text-white p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-french-dark mb-2">Quizzes Interativos</h3>
                  <p className="text-french-gray">Teste seu conhecimento com quizzes interativos que ajudam a fixar o aprendizado.</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-french-blue text-white p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-french-dark mb-2">Recursos para Download</h3>
                  <p className="text-french-gray">Guias de pronúncia, vocabulário essencial, mapas do metrô de Paris e muito mais.</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-french-blue text-white p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-french-dark mb-2">Acompanhamento de Progresso</h3>
                  <p className="text-french-gray">Acompanhe seu progresso e veja seu desenvolvimento ao longo do tempo.</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-french-blue text-white p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-french-dark mb-2">Acesso Vitalício</h3>
                  <p className="text-french-gray">Pague uma vez e tenha acesso para sempre, incluindo todas as atualizações futuras.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demonstração do Produto */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-french-dark mb-6">Conheça Nossa Plataforma</h2>
          <p className="text-xl text-center text-french-gray mb-12 max-w-3xl mx-auto">Veja como é fácil e intuitivo aprender francês com nossa plataforma exclusiva</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src="/screenshots/situacoes.gif" alt="Situações práticas em francês" className="w-full" />
              <div className="p-4 bg-french-lightGray">
                <h3 className="font-bold text-french-dark">Situações Práticas</h3>
                <p className="text-french-gray">Aprenda frases úteis para situações reais que você vai enfrentar</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src="/screenshots/quizzes.gif" alt="Quizzes interativos" className="w-full" />
              <div className="p-4 bg-french-lightGray">
                <h3 className="font-bold text-french-dark">Quizzes Interativos</h3>
                <p className="text-french-gray">Teste seu conhecimento e fixe o aprendizado com quizzes divertidos</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src="/screenshots/progresso.gif" alt="Acompanhamento de progresso" className="w-full" />
              <div className="p-4 bg-french-lightGray">
                <h3 className="font-bold text-french-dark">Acompanhamento de Progresso</h3>
                <p className="text-french-gray">Veja seu desenvolvimento e mantenha-se motivado</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src="/screenshots/recursos.gif" alt="Recursos para download" className="w-full" />
              <div className="p-4 bg-french-lightGray">
                <h3 className="font-bold text-french-dark">Recursos para Download</h3>
                <p className="text-french-gray">Acesse guias, mapas e materiais exclusivos para complementar seu aprendizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Depoimentos */}
      <div className="py-16 bg-french-lightGray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-french-dark mb-12">O Que Nossos Alunos Dizem</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-french-lightGray p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <p className="text-french-gray mb-4">"Consegui me comunicar perfeitamente durante minha viagem a Paris! As situações práticas foram exatamente o que eu precisava para me sentir confiante."</p>
              <div className="font-semibold text-french-dark">Mariana S.</div>
            </div>
            
            <div className="bg-french-lightGray p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <p className="text-french-gray mb-4">"Os quizzes interativos são excelentes para fixar o conteúdo. Em apenas 3 semanas já conseguia entender e falar frases básicas em francês."</p>
              <div className="font-semibold text-french-dark">Carlos M.</div>
            </div>
            
            <div className="bg-french-lightGray p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#5752E1" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <p className="text-french-gray mb-4">"Os recursos para download são fantásticos! O guia de pronúncia e o mapa do metrô de Paris foram super úteis durante minha viagem."</p>
              <div className="font-semibold text-french-dark">Juliana R.</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preço e Garantia */}
      <div className="py-16 bg-french-lightGray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-yellow-500">
            <div className="bg-french-blue text-white p-8 text-center">
              <span className="bg-yellow-500 text-french-dark font-bold px-4 py-1 rounded-full text-sm inline-block mb-4">OFERTA ESPECIAL POR TEMPO LIMITADO</span>
              <h2 className="text-3xl font-bold mb-2">Invista no seu aprendizado</h2>
              <p className="text-xl opacity-90">Acesso vitalício a todo o conteúdo</p>
            </div>
            
            <div className="p-8 text-center">
              <div className="mb-6">
                <span className="text-gray-400 line-through text-xl">De R$ 197,00</span>
                <div className="text-5xl font-bold text-french-dark mt-1">Por R$ 97,00</div>
                <div className="text-french-gray mt-1">ou 12x de R$ 8,08</div>
                <div className="text-sm text-green-600 font-medium mt-2">Economize R$ 100,00 (51% de desconto)</div>
              </div>
              
              <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span className="font-bold text-french-dark">Garantia de 7 dias ou seu dinheiro de volta</span>
                </div>
                <p className="text-sm text-french-gray">Se você não ficar satisfeito com o curso por qualquer motivo, basta solicitar o reembolso em até 7 dias após a compra.</p>
              </div>
              
              <a 
                href="https://pay.hotmart.com/V98903835C" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-500 hover:bg-yellow-400 text-french-dark font-bold py-4 px-8 rounded-full text-lg inline-block transition-colors w-full md:w-auto shadow-lg animate-pulse"
              >
                QUERO APRENDER FRANCÊS AGORA
              </a>
              
              <div className="mt-6">
                <p className="text-sm text-french-gray mb-2">Formas de pagamento aceitas:</p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-xs font-medium">Cartão de crédito</div>
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-xs font-medium">Boleto</div>
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-xs font-medium">PIX</div>
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-xs font-medium">PayPal</div>
                </div>
                <p className="text-xs text-french-gray mt-4">Pagamento processado com segurança pela Hotmart</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-french-dark mb-12">Perguntas Frequentes</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-french-lightGray p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-french-dark mb-3">Preciso ter conhecimento prévio de francês?</h3>
              <p className="text-french-gray">Não, o curso foi desenvolvido para iniciantes. Começamos do zero e avançamos gradualmente.</p>
            </div>
            
            <div className="bg-french-lightGray p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-french-dark mb-3">Por quanto tempo terei acesso ao curso?</h3>
              <p className="text-french-gray">O acesso é vitalício. Pague uma vez e tenha acesso para sempre, incluindo todas as atualizações futuras.</p>
            </div>
            
            <div className="bg-french-lightGray p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-french-dark mb-3">Como funciona a garantia?</h3>
              <p className="text-french-gray">Oferecemos garantia de 7 dias. Se você não ficar satisfeito, basta solicitar o reembolso dentro desse período.</p>
            </div>
            
            <div className="bg-french-lightGray p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-french-dark mb-3">Posso acessar o curso pelo celular?</h3>
              <p className="text-french-gray">Sim, o curso é totalmente responsivo e pode ser acessado de qualquer dispositivo: computador, tablet ou smartphone.</p>
            </div>
            
            <div className="bg-french-lightGray p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-french-dark mb-3">Quais formas de pagamento são aceitas?</h3>
              <p className="text-french-gray">Aceitamos cartão de crédito, boleto bancário, PIX e PayPal através da plataforma Hotmart.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Final */}
      <div className="py-16 bg-gradient-to-r from-french-blue to-french-lightBlue text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para falar francês na sua próxima viagem?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Não perca mais tempo! Comece agora mesmo e surpreenda-se com seu progresso.
          </p>
          <a 
            href="https://pay.hotmart.com/V98903835C" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-french-blue hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg inline-block transition-colors"
          >
            QUERO APRENDER FRANCÊS AGORA
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaginaVendas;