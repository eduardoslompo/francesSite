import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { getUserProgress, updateUserProgress } from '@/lib/userProgress';
import AchievementCard from '@/components/ui/AchievementCard';
import { toast } from 'sonner';

interface PhraseCardProps {
  french: string;
  portuguese: string;
  category: string;
}

const PhraseCard = ({ french, portuguese, category }: PhraseCardProps) => {
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-card hover-card-effect rounded-xl p-6 block transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-french-dark">{french}</h3>
        <span className="text-xs py-1 px-2 bg-french-lightGray rounded-full text-french-gray">
          {category}
        </span>
      </div>
      
      <p className="text-french-gray mb-4 text-sm">{portuguese}</p>
      
      <button 
        onClick={() => speakText(french)}
        className="text-french-blue hover:bg-french-blue/10 text-sm inline-flex items-center p-2 rounded-full transition-all"
        aria-label="Ouvir pronúncia"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </button>
    </div>
  );
};

const PronunciaPage = () => {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Verificar se o usuário está autenticado e carregar conquistas
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserAchievements(currentUser.uid);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Função para carregar as conquistas do usuário
  const loadUserAchievements = async (userId: string) => {
    try {
      setLoading(true);
      const progress = await getUserProgress(userId);
      
      if (progress && progress.achievements) {
        // Filtrar apenas conquistas relacionadas à pronúncia
        const pronunciationAchievements = progress.achievements.filter(achievement => 
          achievement.id === 'pronunciation-master' || 
          achievement.id.includes('pronuncia')
        );
        
        setUserAchievements(pronunciationAchievements);
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para desbloquear a conquista de pronúncia
  const unlockPronunciationAchievement = async () => {
    if (!user) return;
    
    try {
      // Criar um objeto de progresso de quiz fictício para a pronúncia
      const pronunciationProgress = {
        quizId: 'pronunciation-practice',
        category: 'pronuncia',
        score: 100,
        totalQuestions: 100,
        completedAt: new Date(),
        timeSpent: 300 // 5 minutos em segundos
      };
      
      // Atualizar o progresso do usuário
      await updateUserProgress(user.uid, pronunciationProgress);
      
      // Recarregar as conquistas
      loadUserAchievements(user.uid);
      
      // Mostrar notificação
      toast.success('Parabéns! Você desbloqueou uma conquista de pronúncia!');
    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
    }
  };

  const phrases = [
    // Saudações
    {
      french: "Bonjour",
      portuguese: "Bom dia / Olá",
      category: "Saudações"
    },
    {
      french: "Au revoir",
      portuguese: "Adeus",
      category: "Saudações"
    },
    {
      french: "Merci beaucoup",
      portuguese: "Muito obrigado",
      category: "Saudações"
    },
    {
      french: "S'il vous plaît",
      portuguese: "Por favor",
      category: "Saudações"
    },
    {
      french: "Excusez-moi",
      portuguese: "Com licença / Desculpe",
      category: "Saudações"
    },
    {
      french: "Bonsoir",
      portuguese: "Boa noite (ao chegar)",
      category: "Saudações"
    },
    {
      french: "Bonne nuit",
      portuguese: "Boa noite (ao se despedir)",
      category: "Saudações"
    },
    {
      french: "Enchanté(e)",
      portuguese: "Prazer em conhecê-lo(a)",
      category: "Saudações"
    },
    {
      french: "À bientôt",
      portuguese: "Até breve",
      category: "Saudações"
    },
    {
      french: "Comment allez-vous?",
      portuguese: "Como vai você? (formal)",
      category: "Saudações"
    },
    {
      french: "Ça va?",
      portuguese: "Tudo bem? (informal)",
      category: "Saudações"
    },
    
    // Restaurante
    {
      french: "Je voudrais réserver une table",
      portuguese: "Eu gostaria de reservar uma mesa",
      category: "Restaurante"
    },
    {
      french: "L'addition, s'il vous plaît",
      portuguese: "A conta, por favor",
      category: "Restaurante"
    },
    {
      french: "C'est délicieux",
      portuguese: "Está delicioso",
      category: "Restaurante"
    },
    {
      french: "Je suis végétarien/végétarienne",
      portuguese: "Eu sou vegetariano/vegetariana",
      category: "Restaurante"
    },
    {
      french: "Qu'est-ce que vous recommandez?",
      portuguese: "O que você recomenda?",
      category: "Restaurante"
    },
    {
      french: "Je voudrais un verre de vin",
      portuguese: "Eu gostaria de uma taça de vinho",
      category: "Restaurante"
    },
    {
      french: "Avez-vous un menu en portugais?",
      portuguese: "Vocês têm um cardápio em português?",
      category: "Restaurante"
    },
    {
      french: "Je suis allergique à...",
      portuguese: "Eu sou alérgico(a) a...",
      category: "Restaurante"
    },
    
    // Transporte
    {
      french: "Où est la station de métro?",
      portuguese: "Onde fica a estação de metrô?",
      category: "Transporte"
    },
    {
      french: "Je voudrais aller à...",
      portuguese: "Eu gostaria de ir para...",
      category: "Transporte"
    },
    {
      french: "Combien coûte le billet?",
      portuguese: "Quanto custa a passagem?",
      category: "Transporte"
    },
    {
      french: "À quelle heure part le train?",
      portuguese: "A que horas parte o trem?",
      category: "Transporte"
    },
    {
      french: "Pouvez-vous m'appeler un taxi?",
      portuguese: "Pode chamar um táxi para mim?",
      category: "Transporte"
    },
    {
      french: "Est-ce que ce bus va au centre-ville?",
      portuguese: "Este ônibus vai para o centro da cidade?",
      category: "Transporte"
    },
    {
      french: "Je me suis perdu(e)",
      portuguese: "Eu me perdi",
      category: "Transporte"
    },
    
    // Hotel
    {
      french: "Je voudrais une chambre pour deux nuits",
      portuguese: "Eu gostaria de um quarto para duas noites",
      category: "Hotel"
    },
    {
      french: "À quelle heure est le petit-déjeuner?",
      portuguese: "A que horas é o café da manhã?",
      category: "Hotel"
    },
    {
      french: "Y a-t-il le Wi-Fi?",
      portuguese: "Tem Wi-Fi?",
      category: "Hotel"
    },
    {
      french: "Ma clé ne fonctionne pas",
      portuguese: "Minha chave não funciona",
      category: "Hotel"
    },
    {
      french: "Pouvez-vous nettoyer ma chambre?",
      portuguese: "Pode limpar meu quarto?",
      category: "Hotel"
    },
    {
      french: "À quelle heure est le check-out?",
      portuguese: "A que horas é o check-out?",
      category: "Hotel"
    },
    
    // Emergência
    {
      french: "J'ai besoin d'un médecin",
      portuguese: "Eu preciso de um médico",
      category: "Emergência"
    },
    {
      french: "Où est l'hôpital le plus proche?",
      portuguese: "Onde fica o hospital mais próximo?",
      category: "Emergência"
    },
    {
      french: "Au secours!",
      portuguese: "Socorro!",
      category: "Emergência"
    },
    {
      french: "J'ai perdu mon passeport",
      portuguese: "Eu perdi meu passaporte",
      category: "Emergência"
    },
    {
      french: "Appelez la police!",
      portuguese: "Chame a polícia!",
      category: "Emergência"
    },
    {
      french: "J'ai été volé(e)",
      portuguese: "Eu fui roubado(a)",
      category: "Emergência"
    },
    
    // Compras
    {
      french: "Combien ça coûte?",
      portuguese: "Quanto custa?",
      category: "Compras"
    },
    {
      french: "C'est trop cher",
      portuguese: "É muito caro",
      category: "Compras"
    },
    {
      french: "Je voudrais essayer",
      portuguese: "Eu gostaria de experimentar",
      category: "Compras"
    },
    {
      french: "Avez-vous une autre taille?",
      portuguese: "Você tem outro tamanho?",
      category: "Compras"
    },
    {
      french: "Je cherche un cadeau",
      portuguese: "Estou procurando um presente",
      category: "Compras"
    },
    {
      french: "Acceptez-vous les cartes de crédit?",
      portuguese: "Vocês aceitam cartões de crédito?",
      category: "Compras"
    },
    {
      french: "Puis-je avoir un reçu?",
      portuguese: "Posso ter um recibo?",
      category: "Compras"
    },
    
    // Comunicação
    {
      french: "Parlez-vous anglais?",
      portuguese: "Você fala inglês?",
      category: "Comunicação"
    },
    {
      french: "Je ne comprends pas",
      portuguese: "Eu não entendo",
      category: "Comunicação"
    },
    {
      french: "Pouvez-vous répéter, s'il vous plaît?",
      portuguese: "Pode repetir, por favor?",
      category: "Comunicação"
    },
    {
      french: "Parlez plus lentement, s'il vous plaît",
      portuguese: "Fale mais devagar, por favor",
      category: "Comunicação"
    },
    {
      french: "Comment dit-on... en français?",
      portuguese: "Como se diz... em francês?",
      category: "Comunicação"
    },
    {
      french: "Pouvez-vous l'écrire?",
      portuguese: "Pode escrever isso?",
      category: "Comunicação"
    },
    
    // Vida Cotidiana
    {
      french: "Quelle heure est-il?",
      portuguese: "Que horas são?",
      category: "Vida Cotidiana"
    },
    {
      french: "Je suis désolé(e) d'être en retard",
      portuguese: "Desculpe pelo atraso",
      category: "Vida Cotidiana"
    },
    {
      french: "Quel temps fait-il aujourd'hui?",
      portuguese: "Como está o tempo hoje?",
      category: "Vida Cotidiana"
    },
    {
      french: "J'ai faim/soif",
      portuguese: "Estou com fome/sede",
      category: "Vida Cotidiana"
    },
    {
      french: "Je suis fatigué(e)",
      portuguese: "Estou cansado(a)",
      category: "Vida Cotidiana"
    },
    {
      french: "Bon appétit",
      portuguese: "Bom apetite",
      category: "Vida Cotidiana"
    },
    {
      french: "À votre santé!",
      portuguese: "À sua saúde! (brinde)",
      category: "Vida Cotidiana"
    },
    {
      french: "Je dois y aller",
      portuguese: "Eu preciso ir embora",
      category: "Vida Cotidiana"
    },
    
    // No Trabalho
    {
      french: "Je travaille comme...",
      portuguese: "Eu trabalho como...",
      category: "No Trabalho"
    },
    {
      french: "Pouvons-nous fixer un rendez-vous?",
      portuguese: "Podemos marcar uma reunião?",
      category: "No Trabalho"
    },
    {
      french: "Envoyez-moi un e-mail, s'il vous plaît",
      portuguese: "Envie-me um e-mail, por favor",
      category: "No Trabalho"
    },
    {
      french: "Je suis en congé",
      portuguese: "Estou de férias",
      category: "No Trabalho"
    },
    {
      french: "Quel est le délai?",
      portuguese: "Qual é o prazo?",
      category: "No Trabalho"
    },
    {
      french: "Avez-vous des questions?",
      portuguese: "Você tem alguma pergunta?",
      category: "No Trabalho"
    },
    
    // Expressões Idiomáticas
    {
      french: "C'est la vie",
      portuguese: "É a vida (expressão de resignação)",
      category: "Expressões Idiomáticas"
    },
    {
      french: "Ça ne fait rien",
      portuguese: "Não tem problema",
      category: "Expressões Idiomáticas"
    },
    {
      french: "À mon avis",
      portuguese: "Na minha opinião",
      category: "Expressões Idiomáticas"
    },
    {
      french: "Avoir le coup de foudre",
      portuguese: "Amor à primeira vista",
      category: "Expressões Idiomáticas"
    },
    {
      french: "Être dans la lune",
      portuguese: "Estar distraído, no mundo da lua",
      category: "Expressões Idiomáticas"
    },
    {
      french: "Mettre les pieds dans le plat",
      portuguese: "Meter os pés pelas mãos (cometer uma gafe)",
      category: "Expressões Idiomáticas"
    }
  ];

  const categories = ['Todas', ...new Set(phrases.map(phrase => phrase.category))];
  
  const filteredPhrases = activeCategory === 'Todas' 
    ? phrases 
    : phrases.filter(phrase => phrase.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-french-lightGray py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link to="/" className="text-french-blue hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para Início
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-french-dark mb-4">Pronúncia em Francês</h1>
            <p className="text-french-gray">
              Aprenda a pronúncia correta das frases mais comuns em francês. 
              Clique no ícone de áudio para ouvir a pronúncia nativa.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${activeCategory === category 
                  ? 'bg-french-blue text-white' 
                  : 'bg-white text-french-gray hover:bg-french-blue/10'}`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhrases.map((phrase, index) => (
              <PhraseCard 
                key={index}
                french={phrase.french}
                portuguese={phrase.portuguese}
                category={phrase.category}
              />
            ))}
          </div>
          
          {/* Categorias e frases */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['Todas', 'Saudações', 'Restaurante', 'Transporte', 'Hotel', 'Emergências'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-french-blue text-white'
                      : 'bg-white text-french-gray hover:bg-french-blue/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phrases
                .filter((phrase) => activeCategory === 'Todas' || phrase.category === activeCategory)
                .map((phrase, index) => (
                  <PhraseCard
                    key={index}
                    french={phrase.french}
                    portuguese={phrase.portuguese}
                    category={phrase.category}
                  />
                ))}
            </div>
          </div>
          
          {/* Seção de Conquistas */}
          {user && (
            <div className="glass-card rounded-xl p-6 mb-12">
              <h2 className="text-xl font-semibold text-french-dark mb-6">Suas Conquistas de Pronúncia</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-french-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-french-gray">Carregando suas conquistas...</p>
                </div>
              ) : userAchievements.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {userAchievements.map((achievement, index) => (
                    <AchievementCard 
                      key={achievement.id} 
                      achievement={achievement} 
                      index={index} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-french-gray mb-4">Você ainda não desbloqueou conquistas de pronúncia.</p>
                  <p className="text-french-gray">Pratique a pronúncia para desbloquear conquistas!</p>
                </div>
              )}
              
              {!user && (
                <div className="mt-6 text-center">
                  <p className="text-french-gray mb-4">Faça login para acompanhar suas conquistas</p>
                  <Link 
                    to="/login" 
                    className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-2 px-4 rounded-md transition-all"
                  >
                    Fazer Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PronunciaPage;