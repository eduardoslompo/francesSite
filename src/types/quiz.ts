
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "básico" | "medio" | "expert";
  explanation?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  level: "básico" | "medio" | "expert";
  levelClass: string;
  questionsCount: number;
}
