import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { findQuizByTitle } from '@/lib/quizJsonService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSituationById } from '@/lib/situationService';
import { auth } from '@/lib/firebase';
import { updateUserProgress, updateSituationProgress } from '@/lib/userProgress';

interface DialogLine {
  speaker: string;
  text: string;
  translation: string;
}

interface VocabularyItem {
  word: string;
  translation: string;
  example?: string;
}

interface CulturalNote {
  title: string;
  description: string;
}

export interface SituationDetail {
  title: string;
  description: string;
  image: string;
  introduction: string;
  dialogues: {
    title: string;
    lines: DialogLine[];
  }[];
  vocabulary: VocabularyItem[];
  culturalNotes: CulturalNote[];
  tips: string[];
  relatedQuizzes: string[];
}

const SituationDetailPage = () => {
  const { situationId } = useParams<{ situationId: string }>();
  const navigate = useNavigate();
  const [situation, setSituation] = useState<SituationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDialogue, setActiveDialogue] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const startTimeRef = useRef<Date>(new Date());
  const [timeTracked, setTimeTracked] = useState<boolean>(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Reset the start time when loading a new situation
    startTimeRef.current = new Date();
    setTimeTracked(false);
    
    const loadSituation = async () => {
      if (!situationId) return;
      
      try {
        const data = await getSituationById(situationId);
        if (data) {
          setSituation(data);
          // Quando a situação é carregada, marcamos como explorada imediatamente
          trackSituationVisit();
        }
      } catch (error) {
        console.error(`Error loading situation ${situationId}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSituation();
    
    // Cleanup function to track time spent when component unmounts
    return () => {
      trackTimeSpent();
    };
  }, [situationId]);
  
  // Função para registrar a visita à situação
  const trackSituationVisit = async () => {
    if (!situationId) return;
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('User not logged in, situation visit not tracked');
      return;
    }
    
    try {
      // Usamos a nova função específica para situações
      await updateSituationProgress(currentUser.uid, situationId, 0);
      console.log(`Situation ${situationId} marked as explored`);
    } catch (error) {
      console.error('Error tracking situation visit:', error);
    }
  };
  
  // Function to track time spent on the situation
  const trackTimeSpent = async () => {
    // Avoid tracking time if already tracked or if no situation is loaded
    if (timeTracked || !situation || !situationId) return;
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('User not logged in, time spent not tracked');
      return;
    }
    
    try {
      // Calculate time spent
      const endTime = new Date();
      const timeSpentMs = endTime.getTime() - startTimeRef.current.getTime();
      const timeSpentSeconds = Math.round(timeSpentMs / 1000);
      
      // Only track if user spent at least 5 seconds on the page
      if (timeSpentSeconds < 5) {
        console.log(`Tempo muito curto (${timeSpentSeconds}s), não será contabilizado`);
        return;
      }
      
      console.log(`Registrando tempo gasto na situação ${situationId}: ${timeSpentSeconds} segundos`);
      console.log('Tempo inicial:', startTimeRef.current);
      console.log('Tempo final:', endTime);
      
      // Atualizar apenas o tempo gasto, já que a visita foi registrada no carregamento
      await updateSituationProgress(currentUser.uid, situationId, timeSpentSeconds);
      setTimeTracked(true);
      console.log(`Time spent on situation ${situationId} tracked: ${timeSpentSeconds} seconds`);
    } catch (error) {
      console.error('Error tracking time spent:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-french-gray text-xl">Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!situation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-french-gray text-xl">Situação não encontrada</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-french-lightGray py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="relative rounded-xl overflow-hidden mb-12 h-64 md:h-80">
            <img 
              src={situation.image} 
              alt={situation.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{situation.title}</h1>
                <p className="text-white/80">{situation.description}</p>
              </div>
            </div>
          </div>
          
          {/* Introduction */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-french-dark mb-4">Introdução</h2>
            <p className="text-french-gray">{situation.introduction}</p>
          </div>
          
          {/* Dialogues */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-french-dark">Diálogos</h2>
              <div className="flex items-center">
                <span className="text-sm text-french-gray mr-2">Mostrar tradução</span>
                <button 
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${showTranslation ? 'bg-french-blue' : 'bg-gray-300'}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${showTranslation ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </button>
              </div>
            </div>
            
            <div className="flex mb-4 overflow-x-auto pb-2">
              {situation.dialogues.map((dialogue, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDialogue(index)}
                  className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${activeDialogue === index ? 'bg-french-blue text-white' : 'bg-white text-french-gray hover:text-french-dark'}`}
                >
                  {dialogue.title}
                </button>
              ))}
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-xl font-medium text-french-dark mb-4">{situation.dialogues[activeDialogue].title}</h3>
              <div className="space-y-4">
                {situation.dialogues[activeDialogue].lines.map((line, index) => (
                  <div key={index} className={`flex ${line.speaker === 'Você' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${line.speaker === 'Você' ? 'bg-french-blue/10 text-french-dark' : 'bg-gray-100 text-french-dark'}`}>
                      <div className="font-medium mb-1">{line.speaker}</div>
                      <p className="text-french-blue font-medium">{line.text}</p>
                      {showTranslation && (
                        <p className="text-french-gray text-sm mt-1">{line.translation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Vocabulary */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-french-dark mb-6">Vocabulário Essencial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {situation.vocabulary.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-french-blue">{item.word}</span>
                    <span className="text-french-gray">{item.translation}</span>
                  </div>
                  {item.example && (
                    <p className="text-sm text-french-gray mt-2 italic">Ex: {item.example}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Cultural Notes */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-french-dark mb-6">Notas Culturais</h2>
            <div className="space-y-4">
              {situation.culturalNotes.map((note, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <h3 className="font-medium text-french-dark mb-2">{note.title}</h3>
                  <p className="text-french-gray">{note.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tips */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-french-dark mb-6">Dicas Úteis</h2>
            <ul className="space-y-2">
              {situation.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-french-blue mr-2">•</span>
                  <span className="text-french-gray">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Related Quizzes */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-french-dark mb-6">Quizzes Relacionados</h2>
            <div className="flex flex-wrap gap-2">
              {situation.relatedQuizzes.map((quiz, index) => (
                <button 
                  key={index}
                  onClick={async () => {
                    try {
                      const quizData = await findQuizByTitle(quiz);
                      if (quizData) {
                        navigate(`/quizzes/${quizData.id}`);
                      } else {
                        // Fallback to category filter if quiz not found by title
                        navigate(`/quizzes?category=${encodeURIComponent(quiz)}`);
                      }
                    } catch (error) {
                      console.error(`Error navigating to quiz ${quiz}:`, error);
                      navigate(`/quizzes?category=${encodeURIComponent(quiz)}`);
                    }
                  }}
                  className="bg-french-blue/10 hover:bg-french-blue/20 text-french-blue px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  {quiz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SituationDetailPage;