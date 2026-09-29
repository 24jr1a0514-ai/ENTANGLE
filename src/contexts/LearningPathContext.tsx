import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import type { LearningPath } from '../types';
import { learningPathConfig, getPersonalizedContent } from '../services/personalizationEngine';

interface LearningPathContextType {
  learningPath: LearningPath | null;
  config: typeof learningPathConfig[LearningPath] | null;
  personalize: (topic: any) => any;
}

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export const LearningPathProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { userProfile } = useAuth();
  
  const path = userProfile?.learningPath || null;
  const config = path ? learningPathConfig[path] : null;
  
  const personalize = (topic: any) => {
    if (!path) return null;
    return getPersonalizedContent(path, topic, userProfile || undefined);
  };

  return (
    <LearningPathContext.Provider value={{ learningPath: path, config, personalize }}>
      {children}
    </LearningPathContext.Provider>
  );
};

export const useLearningPath = () => {
  const context = useContext(LearningPathContext);
  if (context === undefined) {
    throw new Error('useLearningPath must be used within a LearningPathProvider');
  }
  return context;
};
