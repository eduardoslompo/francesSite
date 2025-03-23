import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CompraAcesso = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <Link to="/" className="inline-block mb-8">
                <span className="font-pacifico text-3xl text-french-blue">aprender francês</span>
              </Link>
              <h1 className="text-3xl font-bold text-french-dark mb-2">
                Adquira seu acesso
              </h1>
              <p className="text-french-gray mb-6">
                Para acessar o conteúdo completo do nosso curso de francês, você precisa adquirir o acesso pela Hotmart
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-french-dark mb-4">Como funciona?</h2>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>Clique no botão "Comprar Acesso" abaixo</li>
                  <li>Complete a compra na plataforma Hotmart</li>
                  <li>Você receberá um email com suas credenciais de acesso</li>
                  <li>Use essas credenciais para fazer login no site</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-french-dark mb-4">O que está incluído?</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Acesso a todas as situações práticas de conversação</li>
                  <li>Quizzes interativos para testar seu conhecimento</li>
                  <li>Recursos de aprendizado exclusivos</li>
                  <li>Acompanhamento de progresso personalizado</li>
                  <li>Atualizações de conteúdo</li>
                </ul>
              </div>
              
              <a 
                href="https://pay.hotmart.com/seu-codigo-hotmart" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-french-blue hover:bg-french-lightBlue text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                Comprar Acesso
              </a>
              
              <div className="text-center mt-4">
                <p className="text-french-gray">
                  Já tem acesso?
                  <Link
                    to="/login"
                    className="ml-1 text-french-blue hover:underline focus:outline-none"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block w-1/2 bg-[url('/imgs/paris.jpg')] bg-cover bg-center">
          <div className="h-full w-full bg-black/50 flex items-center justify-center p-12">
            <div className="max-w-md text-white">
              <h2 className="text-3xl font-bold mb-4">Aprenda francês para suas viagens</h2>
              <p className="mb-6">
                Domine o idioma com lições práticas focadas em situações reais que você enfrentará na França.
                Pratique com quizzes interativos e acompanhe seu progresso.
              </p>
              <Link
                to="/"
                className="inline-block border-2 border-white text-white hover:bg-white hover:text-french-dark font-medium py-2 px-6 rounded-md transition-colors"
              >
                Conheça nosso método
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompraAcesso;