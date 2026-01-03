
export enum QuestionType {
  MCQ = 'mcq',
  TF = 'tf',
  FITB = 'fitb'
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  questions: Question[];
  category: string;
  modified?: string;
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  students: { id: string; name: string; }[];
  assignedQuizIds: string[];
}
