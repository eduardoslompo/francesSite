import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

interface QuizProgress {
  quizId: string;
  category: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent: number; // in seconds
}

interface UserProgress {
  totalQuizzesTaken: number;
  totalScore: number;
  totalTimeSpent: number; // in seconds
  lastQuizDate: Date;
  categoryProgress: { [key: string]: number }; // percentage progress by category
  quizHistory: QuizProgress[];
  achievements: {
    id: string;
    title: string;
    description: string;
    unlockedAt: Date;
  }[];
}

// Initialize user progress document
export const initializeUserProgress = async (userId: string) => {
  try {
    // Ensure we're using the exact collection name as specified in the security rules
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);

    if (!userProgressDoc.exists()) {
      console.log('Creating new user progress document for user:', userId);
      await setDoc(userProgressRef, {
        totalQuizzesTaken: 0,
        totalScore: 0,
        totalTimeSpent: 0,
        lastQuizDate: null,
        categoryProgress: {},
        quizHistory: [],
        achievements: []
      });
      console.log('User progress document created successfully');
    }
  } catch (error) {
    console.error('Error initializing user progress:', error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

// Update user progress after completing a quiz
export const updateUserProgress = async (
  userId: string,
  quizProgress: QuizProgress
) => {
  try {
    console.log('Updating user progress for user:', userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);

    if (!userProgressDoc.exists()) {
      console.log('User progress document does not exist, initializing...');
      await initializeUserProgress(userId);
      // Fetch the document again after initialization
      const refreshedDoc = await getDoc(userProgressRef);
      if (!refreshedDoc.exists()) {
        throw new Error('Failed to create user progress document');
      }
    }

    const currentProgress = userProgressDoc.data() as UserProgress;

    // Update total statistics
    // Convert Date objects to Firestore Timestamp objects
    const updatedProgress = {
      totalQuizzesTaken: currentProgress.totalQuizzesTaken + 1,
      totalScore: currentProgress.totalScore + quizProgress.score,
      totalTimeSpent: currentProgress.totalTimeSpent + quizProgress.timeSpent,
      lastQuizDate: Timestamp.fromDate(quizProgress.completedAt),
      categoryProgress: {
        ...currentProgress.categoryProgress,
        [quizProgress.category]: calculateCategoryProgress(
          currentProgress.categoryProgress[quizProgress.category] || 0,
          quizProgress.score,
          quizProgress.totalQuestions
        )
      },
      quizHistory: [...currentProgress.quizHistory, {
        ...quizProgress,
        completedAt: Timestamp.fromDate(quizProgress.completedAt)
      }],
      achievements: checkAndUpdateAchievements(currentProgress, quizProgress)
    };

    await updateDoc(userProgressRef, updatedProgress);
    return updatedProgress;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// Get user progress
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    console.log('Getting user progress for user:', userId);
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);

    if (!userProgressDoc.exists()) {
      console.log('User progress document not found, initializing...');
      await initializeUserProgress(userId);
      
      // Try to get the document again after initialization
      const refreshedDoc = await getDoc(userProgressRef);
      if (!refreshedDoc.exists()) {
        console.log('Still could not find user progress document after initialization');
        return null;
      }
      
      return refreshedDoc.data() as UserProgress;
    }

    return userProgressDoc.data() as UserProgress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

// Calculate category progress
const calculateCategoryProgress = (
  currentProgress: number,
  score: number,
  totalQuestions: number
): number => {
  const quizPercentage = (score / totalQuestions) * 100;
  // Weight the new score with the existing progress
  return currentProgress === 0
    ? quizPercentage
    : (currentProgress + quizPercentage) / 2;
};

// Check and update achievements
const checkAndUpdateAchievements = (
  currentProgress: UserProgress,
  latestQuiz: QuizProgress
) => {
  // Filter out duplicates by ID
  const existingAchievementIds = new Set(currentProgress.achievements.map(a => a.id));
  const achievements = [...currentProgress.achievements];
  const now = new Date();

  // Função para adicionar conquista apenas se não existir
  const addAchievement = (achievement: any) => {
    if (!existingAchievementIds.has(achievement.id)) {
      achievements.push(achievement);
      existingAchievementIds.add(achievement.id);
    }
  };

  // CONQUISTAS BÁSICAS

  // Check for first quiz completion
  if (currentProgress.totalQuizzesTaken === 0) {
    addAchievement({
      id: 'first-quiz',
      title: 'Primeiros Passos',
      description: 'Completou seu primeiro quiz em francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Check for perfect score
  if (latestQuiz.score === latestQuiz.totalQuestions) {
    addAchievement({
      id: 'perfect-score',
      title: 'Perfeição Francesa',
      description: 'Acertou todas as questões em um quiz',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Check for category mastery (>90% in a category)
  const categoryProgress = currentProgress.categoryProgress[latestQuiz.category] || 0;
  if (categoryProgress >= 90) {
    addAchievement({
      id: `${latestQuiz.category}-master`,
      title: `Mestre em ${latestQuiz.category}`,
      description: `Atingiu mais de 90% de progresso em ${latestQuiz.category}`,
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // CONQUISTAS DE PROGRESSO

  // Conquista para completar 5 quizzes
  if (currentProgress.totalQuizzesTaken >= 5) {
    addAchievement({
      id: 'five-quizzes',
      title: 'Estudante Dedicado',
      description: 'Completou 5 quizzes de francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para completar 10 quizzes
  if (currentProgress.totalQuizzesTaken >= 10) {
    addAchievement({
      id: 'ten-quizzes',
      title: 'Entusiasta do Francês',
      description: 'Completou 10 quizzes de francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para completar 25 quizzes
  if (currentProgress.totalQuizzesTaken >= 25) {
    addAchievement({
      id: 'twenty-five-quizzes',
      title: 'Francófilo',
      description: 'Completou 25 quizzes de francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // CONQUISTAS DE TEMPO

  // Conquista para estudar por mais de 1 hora
  if (currentProgress.totalTimeSpent >= 3600) { // 3600 segundos = 1 hora
    addAchievement({
      id: 'one-hour-study',
      title: 'Primeira Hora',
      description: 'Estudou francês por mais de uma hora',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para estudar por mais de 5 horas
  if (currentProgress.totalTimeSpent >= 18000) { // 18000 segundos = 5 horas
    addAchievement({
      id: 'five-hours-study',
      title: 'Imersão Francesa',
      description: 'Estudou francês por mais de cinco horas',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para estudar por mais de 10 horas
  if (currentProgress.totalTimeSpent >= 36000) { // 36000 segundos = 10 horas
    addAchievement({
      id: 'ten-hours-study',
      title: 'Dedicação Total',
      description: 'Estudou francês por mais de dez horas',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // CONQUISTAS DE CATEGORIAS

  // Verificar se o usuário dominou múltiplas categorias
  const masteredCategories = Object.entries(currentProgress.categoryProgress)
    .filter(([_, progress]) => progress >= 80)
    .length;

  // Conquista para dominar 3 categorias
  if (masteredCategories >= 3) {
    addAchievement({
      id: 'three-categories-master',
      title: 'Triplo Talento',
      description: 'Dominou 3 categorias diferentes de francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para dominar 5 categorias
  if (masteredCategories >= 5) {
    addAchievement({
      id: 'five-categories-master',
      title: 'Poliglota em Formação',
      description: 'Dominou 5 categorias diferentes de francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para dominar todas as categorias
  if (masteredCategories >= 7) {
    addAchievement({
      id: 'all-categories-master',
      title: 'Fluência Completa',
      description: 'Dominou todas as categorias de francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // CONQUISTAS DE PONTUAÇÃO

  // Conquista para atingir 1000 pontos totais
  if (currentProgress.totalScore >= 1000) {
    addAchievement({
      id: 'score-1000',
      title: 'Milésimo Ponto',
      description: 'Acumulou 1000 pontos nos quizzes de francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para atingir 2500 pontos totais
  if (currentProgress.totalScore >= 2500) {
    addAchievement({
      id: 'score-2500',
      title: 'Conhecimento Avançado',
      description: 'Acumulou 2500 pontos nos quizzes de francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // CONQUISTAS DE SEQUÊNCIA

  // Verificar se o usuário completou quizzes em dias consecutivos
  // Isso requer uma lógica mais complexa que seria implementada aqui
  // Por enquanto, vamos adicionar uma conquista baseada na categoria do último quiz

  // Conquista para completar um quiz de pronúncia
  if (latestQuiz.category === 'pronuncia') {
    addAchievement({
      id: 'pronunciation-master',
      title: 'Sotaque Parisiense',
      description: 'Praticou a pronúncia correta do francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para completar um quiz de vocabulário
  if (latestQuiz.category === 'vocabulario') {
    addAchievement({
      id: 'vocabulary-master',
      title: 'Vocabulário Rico',
      description: 'Expandiu seu vocabulário em francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Conquista para completar um quiz de situações
  if (latestQuiz.category === 'situacoes') {
    addAchievement({
      id: 'situations-master',
      title: 'Pronto para Paris',
      description: 'Aprendeu a lidar com situações cotidianas em francês',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  return achievements;
};