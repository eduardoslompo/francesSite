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
  const achievements = [...currentProgress.achievements];
  const now = new Date();

  // Check for first quiz completion
  if (currentProgress.totalQuizzesTaken === 0) {
    achievements.push({
      id: 'first-quiz',
      title: 'Primeiro Quiz',
      description: 'Completou seu primeiro quiz',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Check for perfect score
  if (latestQuiz.score === latestQuiz.totalQuestions) {
    achievements.push({
      id: 'perfect-score',
      title: 'Pontuação Perfeita',
      description: 'Acertou todas as questões em um quiz',
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  // Check for category mastery (>90% in a category)
  const categoryProgress = currentProgress.categoryProgress[latestQuiz.category] || 0;
  if (categoryProgress >= 90) {
    achievements.push({
      id: `${latestQuiz.category}-master`,
      title: `Mestre em ${latestQuiz.category}`,
      description: `Atingiu mais de 90% de progresso em ${latestQuiz.category}`,
      unlockedAt: Timestamp.fromDate(now)
    });
  }

  return achievements;
};