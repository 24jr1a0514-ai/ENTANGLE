import type { LearningPath, UserProfile } from '../types';

interface PersonalizationConfig {
  terminology: string;
  difficulty: 'low' | 'medium' | 'high' | 'expert';
  mathDepth: 'none' | 'basic' | 'advanced' | 'rigorous';
  explanationStyle: string;
}

export const learningPathConfig: Record<LearningPath, PersonalizationConfig> = {
  school: {
    terminology: 'simple, everyday analogies',
    difficulty: 'low',
    mathDepth: 'none',
    explanationStyle: 'storytelling, visual, game-like'
  },
  intermediate: {
    terminology: 'beginner scientific terms',
    difficulty: 'medium',
    mathDepth: 'basic',
    explanationStyle: 'step-by-step, introductory physics'
  },
  undergraduate: {
    terminology: 'standard academic and technical terminology',
    difficulty: 'high',
    mathDepth: 'advanced',
    explanationStyle: 'technical, mathematical, standard textbooks'
  },
  postgraduate: {
    terminology: 'advanced research terminology',
    difficulty: 'expert',
    mathDepth: 'rigorous',
    explanationStyle: 'mathematical proofs, research papers, formalisms'
  },
  others: {
    terminology: 'industry and business application terms',
    difficulty: 'medium',
    mathDepth: 'basic',
    explanationStyle: 'practical, use-case driven, high-level technical'
  }
};

export const getPersonalizedContent = (
  learningPath: LearningPath,
  topic: any, // We will type this properly later
  _learnerProfile?: UserProfile
) => {
  // Logic to extract the correct variant from the topic based on learningPath
  if (topic && topic.variants && topic.variants[learningPath]) {
    return topic.variants[learningPath];
  }
  
  // Fallback if the specific variant doesn't exist
  return topic?.variants?.intermediate || null;
};
