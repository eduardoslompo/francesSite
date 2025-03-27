import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { loadAllQuizzes, QuizData } from '@/lib/quizJsonService';
import { auth } from '@/lib/firebase';

interface QuizCardProps {
  title: string;
  level: string;
  levelClass: string;
  description: string;
  questionsCount: number;
  completionRate?: number;
  id: string;
}

const QuizCard = ({ title, level, levelClass, description, questionsCount, completionRate, id }: QuizCardProps) => {
  return (
    <div className="glass-card hover-card-effect rounded-xl p-4 sm:p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg sm:text-xl font-semibold text-french-dark">{title}</h3>
        <span className={`level-tag ${levelClass} text-xs`}>{level}</span>
      </div>
      
      <p className="text-french-gray text-sm sm:text-base mb-4">{description}</p>
      
      <div className="flex justify-between text-xs sm:text-sm text-french-gray mb-2">
        <span>{questionsCount} perguntas</span>
        {completionRate !== undefined && <span>{completionRate}% concluído</span>}
      </div>
      
      {completionRate !== undefined && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4 sm:mb-6">
          <div 
            className="h-full bg-french-blue rounded-full"
            style={{ width: `${completionRate}%` }}  
          ></div>
        </div>
      )}
      
      <Link
        to={`/quizzes/${id}`}
        className="btn-primary w-full block text-center text-sm sm:text-base py-2.5 sm:py-3"
      >
        {completionRate !== undefined && completionRate > 0 ? 'Continuar' : 'Iniciar Quiz'}
      </Link>
    </div>
  );
};

const QuizzesPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const loadedQuizzes = await loadAllQuizzes();
      setQuizzes(loadedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = activeTab === "all" 
    ? quizzes 
    : quizzes.filter(quiz => {
      // Map the activeTab to the corresponding level value in the quiz data
      const levelMap = {
        'basico': 'Básico',
        'intermediario': 'Intermediário',
        'avancado': 'Avançado'
      };
      return quiz.level === levelMap[activeTab];
    });
    
  // Limit quizzes to 3 for non-logged in users
  const displayedQuizzes = user ? filteredQuizzes : filteredQuizzes.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-french-lightGray py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-french-dark mb-3 sm:mb-4">Quizzes por Nível</h1>
            <p className="text-sm sm:text-base text-french-gray mb-6 sm:mb-8">
              Teste seus conhecimentos em francês com nossos quizzes interativos. 
              Avance do nível básico ao avançado e acompanhe seu progresso.
            </p>
            
            <div className="bg-white p-1 rounded-full inline-flex flex-wrap justify-center">
              <button 
                className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-french-blue text-white' : 'text-french-gray hover:text-french-dark'}`}
                onClick={() => setActiveTab('all')}
              >
                Todos
              </button>
              <button 
                className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${activeTab === 'basico' ? 'bg-french-blue text-white' : 'text-french-gray hover:text-french-dark'}`}
                onClick={() => setActiveTab('basico')}
              >
                Básico
              </button>
              <button 
                className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${activeTab === 'intermediario' ? 'bg-french-blue text-white' : 'text-french-gray hover:text-french-dark'}`}
                onClick={() => setActiveTab('intermediario')}
              >
                Interm.
              </button>
              <button 
                className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${activeTab === 'avancado' ? 'bg-french-blue text-white' : 'text-french-gray hover:text-french-dark'}`}
                onClick={() => setActiveTab('avancado')}
              >
                Avançado
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-french-gray">Carregando quizzes...</p>
            </div>
          ) : displayedQuizzes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {displayedQuizzes.map((quiz) => (
                  <QuizCard 
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    level={quiz.level}
                    levelClass={quiz.levelClass}
                    description={quiz.description}
                    questionsCount={quiz.questionsCount}
                    // We'll implement this with user progress later
                    completionRate={undefined}
                  />
                ))}
              </div>
              
              {!user && filteredQuizzes.length > 3 && (
                <div className="mt-8 sm:mt-12 text-center">
                  <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl sm:text-2xl font-bold text-french-dark mb-2 sm:mb-3">Quer acessar todos os {filteredQuizzes.length} quizzes?</h3>
                    <p className="text-sm sm:text-base text-french-gray mb-4 sm:mb-6">Adquira agora mesmo por apenas R$ 97,00 ou <span className="text-red-400">12x de R$ 8,08</span> para desbloquear todos os quizzes e recursos de aprendizado.</p>
                    <Link 
                      to="/cadastro" 
                      className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-300 ease-in-out inline-block text-sm sm:text-base"
                    >
                      Ter acesso
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-french-gray">Nenhum quiz encontrado para esta categoria.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuizzesPage;
