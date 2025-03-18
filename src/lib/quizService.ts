
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { Category, Question } from "@/types/quiz";

// Coleções no Firestore
const QUESTIONS_COLLECTION = "questions";
const CATEGORIES_COLLECTION = "categories";

// Funções para questões
export const getQuestions = async (): Promise<Question[]> => {
  try {
    const questionsSnapshot = await getDocs(collection(db, QUESTIONS_COLLECTION));
    return questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];
  } catch (error) {
    console.error("Erro ao buscar questões:", error);
    throw error;
  }
};

export const getQuestionsByCategory = async (categoryId: string): Promise<Question[]> => {
  try {
    const q = query(collection(db, QUESTIONS_COLLECTION), where("category", "==", categoryId));
    const questionsSnapshot = await getDocs(q);
    return questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];
  } catch (error) {
    console.error(`Erro ao buscar questões da categoria ${categoryId}:`, error);
    throw error;
  }
};

export const addQuestion = async (question: Omit<Question, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), question);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar questão:", error);
    throw error;
  }
};

export const updateQuestion = async (id: string, question: Partial<Question>): Promise<void> => {
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    await updateDoc(questionRef, question);
  } catch (error) {
    console.error(`Erro ao atualizar questão ${id}:`, error);
    throw error;
  }
};

export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, QUESTIONS_COLLECTION, id));
  } catch (error) {
    console.error(`Erro ao excluir questão ${id}:`, error);
    throw error;
  }
};

export const bulkAddQuestions = async (questions: Omit<Question, "id">[]): Promise<string[]> => {
  try {
    const ids: string[] = [];
    
    for (const question of questions) {
      const id = await addQuestion(question);
      ids.push(id);
    }
    
    return ids;
  } catch (error) {
    console.error("Erro ao adicionar questões em massa:", error);
    throw error;
  }
};

// Funções para categorias
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesSnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
};

export const addCategory = async (category: Omit<Category, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), category);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    throw error;
  }
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(categoryRef, category);
  } catch (error) {
    console.error(`Erro ao atualizar categoria ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
  } catch (error) {
    console.error(`Erro ao excluir categoria ${id}:`, error);
    throw error;
  }
};

export const bulkAddCategories = async (categories: Omit<Category, "id">[]): Promise<string[]> => {
  try {
    const ids: string[] = [];
    
    for (const category of categories) {
      const id = await addCategory(category);
      ids.push(id);
    }
    
    return ids;
  } catch (error) {
    console.error("Erro ao adicionar categorias em massa:", error);
    throw error;
  }
};
