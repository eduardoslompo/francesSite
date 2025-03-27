import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { auth } from '@/lib/firebase';
import { getUserProgress, initializeUserProgress } from '@/lib/userProgress';
import { getTotalCategories, getTotalQuizzes, getTotalSituations } from '@/lib/quizJsonService';
import { useNavigate } from 'react-router-dom';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalScore: 0,
    totalTimeSpent: 0,
    averageScore: 0
  });
  const [totalCategoriesAvailable, setTotalCategoriesAvailable] = useState(9);
  const [totalQuizzesAvailable, setTotalQuizzesAvailable] = useState(0);
  const [totalSituationsAvailable, setTotalSituationsAvailable] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadUserProgress();
    loadTotals();
    
    // Manter apenas os dados fictícios para o gráfico de evolução, quando necessário
    setTimeout(() => {
      // Dados de teste para o gráfico de evolução de aprendizado
      // Apenas adiciona se ainda não tivermos dados
      if (!progressData || progressData.length === 0 || !progressData.some(item => item.progress > 0)) {
        setProgressData([
          { day: 'Seg', progress: 65, date: '10/06/2024' },
          { day: 'Ter', progress: 75, date: '11/06/2024' },
          { day: 'Qua', progress: 60, date: '12/06/2024' },
          { day: 'Qui', progress: 80, date: '13/06/2024' },
          { day: 'Sex', progress: 70, date: '14/06/2024' },
          { day: 'Sáb', progress: 90, date: '15/06/2024' },
          { day: 'Dom', progress: 85, date: '16/06/2024' }
        ]);
      }
    }, 2000);
  }, []);

  const loadTotals = async () => {
    try {
      const categoriesCount = await getTotalCategories();
      const quizzesCount = await getTotalQuizzes();
      const situationsCount = await getTotalSituations();
      
      setTotalCategoriesAvailable(categoriesCount || 9);
      setTotalQuizzesAvailable(quizzesCount);
      setTotalSituationsAvailable(situationsCount);
    } catch (error) {
      console.error('Error loading totals:', error);
    }
  };

  const loadUserProgress = async () => {
    try {
      // Use onAuthStateChanged to ensure auth is fully initialized
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          // Redirect to login if not authenticated
          navigate('/login', { state: { from: '/progresso', message: 'Faça login para ver seu progresso' } });
          setLoading(false);
          return;
        }
        
        try {
          setLoading(true);
          console.log('Fetching progress for user:', user.uid);
          
          // Initialize user progress if it doesn't exist
          await initializeUserProgress(user.uid);
          
          // Get user progress
          const progress = await getUserProgress(user.uid);
          
          if (progress) {
            console.log('User progress loaded successfully');
            setUserProgress(progress);
            
            // Process progress data for charts (versão simplificada)
            processProgressData(progress);
          } else {
            console.log('No progress data found, initializing with empty data');
            // Initialize with empty data if no progress exists
            setProgressData([]);
            setCategoryData([]);
            setAchievements([]);
            setStats({
              totalQuizzes: 0,
              totalScore: 0,
              totalTimeSpent: 0,
              averageScore: 0
            });
          }
        } catch (error) {
          console.error('Error in auth callback when loading user progress:', error);
        } finally {
          setLoading(false);
          unsubscribe(); // Clean up the auth listener
        }
      });
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }
  };
  
  const processProgressData = (progress: any) => {
    // Processar dados para o gráfico de evolução
    let quizHistory = progress.quizHistory || [];
    
    // Ordenar o histórico por data
    const sortedHistory = [...quizHistory].sort((a, b) => {
      return new Date(a.completedAt.seconds * 1000).getTime() - new Date(b.completedAt.seconds * 1000).getTime();
    });
    
    // ===== PROCESSAR DADOS DE TEMPO REAIS =====
    // Inicializar objeto para armazenar minutos por dia da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const tempoEstudoPorDia = diasSemana.map(dia => ({
      day: dia,
      minutes: 0
    }));
    
    // Obter a data atual e determinar o domingo da semana atual
    const hoje = new Date();
    const domingoDaSemana = new Date(hoje);
    domingoDaSemana.setDate(hoje.getDate() - hoje.getDay());
    domingoDaSemana.setHours(0, 0, 0, 0);
    
    console.log("Processando dados reais de tempo de estudo...");
    console.log("Início da semana atual:", domingoDaSemana.toISOString());
    console.log("Total de registros:", sortedHistory.length);
    
    // Processar cada registro de tempo
    sortedHistory.forEach((entry, index) => {
      try {
        // Verificar se o registro tem tempo válido
        if (!entry.timeSpent || typeof entry.timeSpent !== 'number') {
          return;
        }
        
        // Obter a data do registro
        const dataRegistro = new Date(entry.completedAt.seconds * 1000);
        const dataRegistroNormalizada = new Date(dataRegistro);
        dataRegistroNormalizada.setHours(0, 0, 0, 0);
        
        // Verificar se está na semana atual
        if (dataRegistroNormalizada < domingoDaSemana) {
          return; // Ignorar registros de semanas anteriores
        }
        
        // Calcular os minutos (mínimo 1 minuto)
        const minutos = Math.max(1, Math.round(entry.timeSpent / 60));
        
        // Determinar o dia da semana (0 = domingo, 1 = segunda, etc.)
        const diaDaSemana = dataRegistro.getDay();
        
        // Adicionar os minutos ao dia correspondente
        tempoEstudoPorDia[diaDaSemana].minutes += minutos;
        
        console.log(`Registro #${index} [${entry.quizId}]:`, {
          data: dataRegistro.toLocaleString(),
          diaDaSemana: diasSemana[diaDaSemana],
          minutos: minutos,
          segundos: entry.timeSpent
        });
      } catch (error) {
        console.error("Erro ao processar registro de tempo:", error);
      }
    });
    
    // Verificar se temos dados reais
    const temDataReal = tempoEstudoPorDia.some(item => item.minutes > 0);
    console.log("Dados reais de tempo encontrados:", temDataReal);
    console.log("Dados de tempo processados:", tempoEstudoPorDia);
    
    // Atualizar o estado com os dados processados
    setSessionData(tempoEstudoPorDia);
    // ===== FIM DO PROCESSAMENTO DE DADOS DE TEMPO =====
    
    // Obter os últimos 7 registros para o gráfico de evolução
    const recentHistory = sortedHistory.slice(-7);
    
    // Formatar os dados para o gráfico de evolução
    const formattedProgressData = recentHistory.map(entry => {
      const date = new Date(entry.completedAt.seconds * 1000);
      // Verificar se é um quiz real (com score e totalQuestions) ou uma situação
      const isQuiz = entry.score !== undefined && entry.totalQuestions !== undefined && !entry.quizId.startsWith('situation-');
      return {
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        progress: isQuiz ? Math.round((entry.score / entry.totalQuestions) * 100) : 0,
        date: date.toLocaleDateString('pt-BR')
      };
    });
    
    // Filtrar apenas entradas de quizzes reais (não situações) para o gráfico de progresso
    const progressEntries = formattedProgressData.filter(entry => entry.progress > 0);
    
    // Usar dados reais se disponíveis, ou dados padrão
    setProgressData(progressEntries.length > 0 ? progressEntries : [
      { day: 'Seg', progress: 0 },
      { day: 'Ter', progress: 0 },
      { day: 'Qua', progress: 0 },
      { day: 'Qui', progress: 0 },
      { day: 'Sex', progress: 0 },
      { day: 'Sáb', progress: 0 },
      { day: 'Dom', progress: 0 },
    ]);
    
    // Processar progresso por categoria
    const categories = Object.entries(progress.categoryProgress || {}).map(([name, value]) => ({
      name: formatCategoryName(name),
      progress: value as number
    }));
    
    setCategoryData(categories.length > 0 ? categories : [
      { name: 'Sem dados', progress: 0 }
    ]);
    
    // Processar conquistas
    const formattedAchievements = (progress.achievements || []).map((achievement: any) => {
      const date = achievement.unlockedAt ? 
        new Date(achievement.unlockedAt.seconds * 1000).toLocaleDateString('pt-BR') : null;
      
      return {
        title: achievement.title,
        description: achievement.description,
        date: date,
        status: "conquistado"
      };
    });
    
    setAchievements(formattedAchievements.length > 0 ? formattedAchievements : [
      {
        title: "Sem conquistas ainda",
        description: "Complete quizzes para desbloquear conquistas",
        progress: 0,
        status: "em progresso"
      }
    ]);
    
    // Calcular estatísticas gerais
    const averageScore = progress.totalQuizzesTaken > 0 ? 
      Math.round(progress.totalScore / progress.totalQuizzesTaken) : 0;
    
    const timeSpent = typeof progress.totalTimeSpent === 'number' ? progress.totalTimeSpent : 0;
    
    setStats({
      totalQuizzes: progress.totalQuizzesTaken || 0,
      totalScore: progress.totalScore || 0,
      totalTimeSpent: timeSpent,
      averageScore: averageScore
    });
  };
  
  const formatCategoryName = (category: string) => {
    const categoryMap: {[key: string]: string} = {
      'vocabulario': 'Vocabulário',
      'restaurante': 'Restaurante',
      'viagem': 'Viagem',
      'hotel': 'Hotel',
      'situacoes': 'Situações',
      'cultura': 'Cultura',
      'geral': 'Geral'
    };
    
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return "0 minutos";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (minutes === 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} e ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-french-lightGray">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-french-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-french-gray">Carregando seu progresso...</p>
          </div>
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
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-french-dark mb-4">Seu Progresso</h1>
            <p className="text-french-gray">
              Acompanhe sua evolução no aprendizado de francês. Visualize estatísticas, conquistas e defina metas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-french-dark mb-6">Evolução do Aprendizado</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
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
                      formatter={(value) => [`${value}%`, 'Progresso']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      name="Pontos de progresso"
                      stroke="#5752E1"
                      strokeWidth={3}
                      dot={{ fill: '#5752E1', strokeWidth: 2, r: 4 }}
                      activeDot={{ fill: '#5752E1', strokeWidth: 0, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-french-dark mb-6">Estatísticas Gerais</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-french-gray text-sm">Quizzes completados</span>
                    <span className="font-semibold text-french-dark">{stats.totalQuizzes}/{totalQuizzesAvailable}</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-french-blue h-full" 
                      style={{ width: `${totalQuizzesAvailable > 0 ? Math.min((stats.totalQuizzes / totalQuizzesAvailable) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-french-gray text-sm">Pontuação média</span>
                    <span className="font-semibold text-french-dark">{stats.averageScore}%</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-french-blue h-full" 
                      style={{ width: `${stats.averageScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-french-gray text-sm">Tempo total de estudo</span>
                    <span className="font-semibold text-french-dark">
                      {formatTimeSpent(stats.totalTimeSpent)}
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-french-blue h-full" 
                      style={{ width: `${Math.min(stats.totalTimeSpent / 3600 * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-french-gray text-sm">Categorias exploradas</span>
                    <span className="font-semibold text-french-dark">{Object.keys(userProgress?.categoryProgress || {}).length}/{totalCategoriesAvailable}</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-french-blue h-full" 
                      style={{ width: `${(Object.keys(userProgress?.categoryProgress || {}).length / totalCategoriesAvailable) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-french-gray text-sm">Situações exploradas</span>
                    <span className="font-semibold text-french-dark">{Object.keys(userProgress?.situationProgress || {}).length}/{totalSituationsAvailable}</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-french-blue h-full" 
                      style={{ width: `${totalSituationsAvailable > 0 ? (Object.keys(userProgress?.situationProgress || {}).length / totalSituationsAvailable) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-french-dark mb-6">Tempo de Estudo</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sessionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} minutos`} />
                    <Bar dataKey="minutes" fill="#5752E1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-french-dark mb-6">Progresso por Categoria</h2>
              
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-french-gray">{category.name}</span>
                      <span className="font-semibold text-french-dark">{category.progress}%</span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-french-blue h-full"
                        style={{ width: `${category.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-french-dark mb-6">Conquistas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="flex items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100"
                >
                  <div className="w-10 h-10 bg-french-lightBlue/10 rounded-full flex items-center justify-center text-french-blue font-medium mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-french-dark">{achievement.title}</h4>
                    <p className="text-sm text-french-gray">{achievement.description}</p>
                    {achievement.date && (
                      <p className="text-xs text-french-gray mt-1">Conquistado em: {achievement.date}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {achievement.status === 'conquistado' ? (
                      <span className="status-conquistado">Conquistado</span>
                    ) : (
                      <>
                        <span className="status-progress">Em progresso</span>
                        <div className="mt-1 h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-french-blue rounded-full"
                            style={{ width: `${achievement.progress}%` }}  
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProgressPage; 