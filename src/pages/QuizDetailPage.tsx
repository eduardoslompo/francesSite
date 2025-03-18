import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getQuizQuestions, loadQuizById } from '@/lib/quizJsonService';
import { Question } from '@/types/quiz';
import { auth } from '@/lib/firebase';
import { updateUserProgress, initializeUserProgress } from '@/lib/userProgress';

interface QuizParams {
  quizId: string;
}

const QuizDetailPage = () => {
  const { quizId } = useParams<QuizParams>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('');
  const [progressSaved, setProgressSaved] = useState(false);
  const startTimeRef = useRef<Date>(new Date());

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (quizId) {
      // Reset the start time when loading a new quiz
      startTimeRef.current = new Date();
      
      // Load quiz data and questions
      loadQuizData(quizId);
    }
  }, [quizId]);

  const loadQuizData = async (quizId: string) => {
    try {
      setLoading(true);
      
      // Load quiz metadata
      const quiz = await loadQuizById(quizId);
      
      if (quiz) {
        setQuizTitle(quiz.title);
        setQuizCategory(quiz.category);
        
        // Load quiz questions
        setQuestions(quiz.questions);
      } else {
        console.error(`Quiz with ID ${quizId} not found`);
      }
    } catch (error) {
      console.error(`Error loading quiz ${quizId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optionIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswerSubmitted(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      saveProgress();
    }
  };

  const saveProgress = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('User not logged in, progress not saved');
        return;
      }
      
      // Calculate time spent
      const endTime = new Date();
      const timeSpentMs = endTime.getTime() - startTimeRef.current.getTime();
      const timeSpentMinutes = Math.round(timeSpentMs / (1000 * 60));
      
      // Create quiz progress object
      const quizProgress = {
        quizId: quizId || '',
        category: quizCategory,
        score: score,
        totalQuestions: questions.length,
        timeSpent: timeSpentMinutes,
        completedAt: new Date(),
      };
      
      // Save progress to Firebase
      await updateUserProgress(currentUser.uid, quizProgress);
      setProgressSaved(true);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="mt-4 text-french-gray">Carregando quiz...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-french-dark mb-4">Quiz não encontrado</h2>
          <p className="text-french-gray mb-6">Não encontramos questões para este quiz. Por favor, tente outro tema.</p>
          <button 
            className="btn-primary"
            onClick={handleBackToQuizzes}
          >
            Voltar para Quizzes
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-french-lightGray py-16 flex-grow">
        <div className="container mx-auto px-4">
          {quizCompleted ? (
            <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-french-dark mb-6 text-center">Quiz Concluído!</h2>
                
                <div className="flex justify-center space-x-8 mb-8">
                  <div className="text-center">
                    <p className="text-sm text-french-gray">Pontuação</p>
                    <p className="text-3xl font-bold text-french-dark">{score}/{questions.length}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-french-gray">Acertos</p>
                    <p className="text-3xl font-bold text-french-dark">{Math.round((score / questions.length) * 100)}%</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    className="btn-secondary"
                    onClick={handleRestartQuiz}
                  >
                    Tentar Novamente
                  </button>
                  
                  <button 
                    className="btn-primary"
                    onClick={handleBackToQuizzes}
                  >
                    Voltar para Quizzes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-french-dark mb-2">{quizTitle}</h1>
                <div className="flex justify-between items-center">
                  <p className="text-french-gray">Questão {currentQuestionIndex + 1} de {questions.length}</p>
                  <p className="text-french-gray">Pontuação: {score}</p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-french-blue rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}  
                  ></div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-french-dark mb-6">
                  {questions[currentQuestionIndex].text}
                </h2>
                
                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedOption === index ? 
                        (isAnswerSubmitted ? 
                          (index === questions[currentQuestionIndex].correctAnswer ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300') : 
                          'bg-blue-50 border-blue-300') : 
                        'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${selectedOption === index ? 
                          (isAnswerSubmitted ? 
                            (index === questions[currentQuestionIndex].correctAnswer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 
                            'bg-blue-500 text-white') : 
                          'bg-gray-200'}`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-french-dark">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {isAnswerSubmitted && questions[currentQuestionIndex].explanation && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-french-dark">
                    <span className="font-semibold">Explicação: </span>
                    {questions[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                {!isAnswerSubmitted ? (
                  <button 
                    className={`btn-primary ${selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                  >
                    Verificar Resposta
                  </button>
                ) : (
                  <button 
                    className="btn-primary"
                    onClick={handleNextQuestion}
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuizDetailPage;