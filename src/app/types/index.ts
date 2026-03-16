export interface StudentProfile {
  grade: number; // 9, 10, или 11 класс
  grades: Record<string, number>; // предмет -> средний балл
  achievements: Achievement[];
  interests: string[];
  careerGoals: string[];
  targetCity?: string;
  budget?: 'free' | 'paid' | 'any';
}

export interface Achievement {
  type: 'olympiad' | 'competition' | 'research' | 'volunteering' | 'other';
  title: string;
  level: 'school' | 'municipal' | 'regional' | 'national' | 'international';
  year: number;
}

export interface EGESubject {
  id: string;
  name: string;
  isRequired: boolean;
}

export interface University {
  id: string;
  name: string;
  city: string;
  rating: number;
  programs: Program[];
}

export interface Program {
  id: string;
  name: string;
  direction: string;
  requiredEGE: string[]; // список предметов ЕГЭ
  minScore: number; // минимальный балл для поступления
  passingScore: number; // проходной балл прошлого года
  budgetPlaces: number;
  paidPlaces: number;
  cost?: number;
  olympiads?: string[]; // олимпиады, дающие преимущества
}

export interface MatchResult {
  university: University;
  program: Program;
  matchScore: number; // 0-100, насколько подходит
  recommendedEGE: string[];
  targetScores: Record<string, number>;
  gaps: string[]; // что нужно улучшить
  strengths: string[]; // сильные стороны
}

export interface EducationStrategy {
  profile: StudentProfile;
  matches: MatchResult[];
  recommendedEGE: string[];
  timeline: TimelineStep[];
  olympiadRecommendations: string[];
  additionalPreparation: string[];
}

export interface TimelineStep {
  period: string;
  tasks: string[];
  goals: string[];
}
