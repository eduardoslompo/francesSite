import { Question } from "@/types/quiz";

export interface QuizData {
  id: string;
  title: string;
  description: string;
  level: string;
  levelClass: string;
  category: string;
  questionsCount: number;
  questions: Question[];
}

/**
 * Loads all available quizzes from the JSON files
 */
export const loadAllQuizzes = async (): Promise<QuizData[]> => {
  try {
    // Dynamic import of all quiz JSON files
    const quizModules = import.meta.glob('../data/quizzes/*.json', { eager: true });
    
    // Convert the modules to an array of quiz data
    const quizzes: QuizData[] = Object.values(quizModules)
      .filter((module) => {
        const quiz = module as any;
        // Filter out any non-quiz files (like README.md)
        return quiz.id && quiz.title && quiz.questions;
      })
      .map((module) => module as QuizData);
    
    return quizzes;
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return [];
  }
};

/**
 * Loads a specific quiz by its ID
 */
export const loadQuizById = async (quizId: string): Promise<QuizData | null> => {
  try {
    const quizzes = await loadAllQuizzes();
    return quizzes.find(quiz => quiz.id === quizId) || null;
  } catch (error) {
    console.error(`Error loading quiz with ID ${quizId}:`, error);
    return null;
  }
};

/**
 * Gets questions for a specific quiz
 */
export const getQuizQuestions = async (quizId: string): Promise<Question[]> => {
  try {
    const quiz = await loadQuizById(quizId);
    return quiz?.questions || [];
  } catch (error) {
    console.error(`Error getting questions for quiz ${quizId}:`, error);
    return [];
  }
};

/**
 * Gets quizzes by category
 */
export const getQuizzesByCategory = async (category: string): Promise<QuizData[]> => {
  try {
    const quizzes = await loadAllQuizzes();
    return category === 'all' 
      ? quizzes 
      : quizzes.filter(quiz => quiz.category === category);
  } catch (error) {
    console.error(`Error getting quizzes for category ${category}:`, error);
    return [];
  }
};

/**
 * Finds a quiz by its title
 */
export const findQuizByTitle = async (title: string): Promise<QuizData | null> => {
  try {
    const quizzes = await loadAllQuizzes();
    return quizzes.find(quiz => quiz.title === title) || null;
  } catch (error) {
    console.error(`Error finding quiz with title ${title}:`, error);
    return null;
  }
};

/**
 * Gets the total number of distinct categories
 */
export const getTotalCategories = async (): Promise<number> => {
  try {
    const quizzes = await loadAllQuizzes();
    const categories = new Set(quizzes.map(quiz => quiz.category));
    return categories.size;
  } catch (error) {
    console.error('Error getting total categories:', error);
    return 0;
  }
};

/**
 * Gets the total number of quizzes
 */
export const getTotalQuizzes = async (): Promise<number> => {
  try {
    const quizzes = await loadAllQuizzes();
    return quizzes.length;
  } catch (error) {
    console.error('Error getting total quizzes:', error);
    return 0;
  }
};

/**
 * Gets the total number of situations available
 */
export const getTotalSituations = async (): Promise<number> => {
  try {
    // Dynamic import of all situation JSON files
    const situationModules = import.meta.glob('../data/situations/*.json', { eager: true });
    
    // Count situations excluding any README files
    const count = Object.values(situationModules)
      .filter((module) => {
        const situation = module as any;
        // Filter out any non-situation files (like README.md)
        return situation.title && situation.dialogues;
      }).length;
    
    return count;
  } catch (error) {
    console.error('Error getting total situations:', error);
    return 0;
  }
};