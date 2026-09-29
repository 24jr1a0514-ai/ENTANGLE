export type LearningPath = 'school' | 'intermediate' | 'undergraduate' | 'postgraduate' | 'others';

export interface Page {
  id: string;
  title: string;
  objectives?: string[];
  explanation: Record<LearningPath, string>;
  keyConcepts?: string[];
  analogy?: string;
  math?: string;
  imageUrl?: string;
  videoEmbedId?: string;
  videoTitle?: string;
  
  // Custom modules for specific courses (e.g., PostgreSQL)
  theory?: Record<LearningPath, string>;
  examples?: Record<LearningPath, string>;
  quizzes?: any;
  puzzles?: any;
  flashcards?: any;
  video?: any;
  demo?: any;
}

export interface Chapter {
  id: string;
  title: string;
  pages: Page[];
}

export interface Curriculum {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface CurriculumDomain {
  domain: string;
  chapters: Chapter[];
}

export interface CourseCategory {
  id: string;
  name: string;
}

export interface CourseDefinition {
  id: string;
  title: string;
  categoryId: string;
  curriculum: CurriculumDomain;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  learningReminders: boolean;
  quizAlerts: boolean;
  projectDeadlines: boolean;
  
  // Learning
  learningLanguage: string;
  difficultyPreference: 'beginner' | 'intermediate' | 'advanced';
  autoplayVideos: boolean;
  showHints: 'auto' | 'manual';
  
  // Accessibility
  fontSize: 'small' | 'medium' | 'large';
  reducedAnimations: boolean;
  readAloud: boolean;
  
  // Privacy
  activityVisibility: 'public' | 'private' | 'friends';
  personalizedRecommendations: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  learningPath: LearningPath | null;
  activeCourseId: string | null;
  onboardingCompleted: boolean;
  completedLessons: string[];
  completedQuizzes: string[];
  completedModules?: string[];
  level: number;
  preferences?: UserPreferences;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export const Curriculum = {};
