import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/config';
import type { UserProfile } from '../types';
import { userService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  signup: (e: string, p: string, n: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (e: string) => Promise<void>;
  changePassword: (oldP: string, newP: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    const profile = await userService.getUserProfile(uid);
    setUserProfile(profile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (userProfile?.preferences?.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    
    // Apply font size
    if (userProfile?.preferences?.fontSize) {
      if (userProfile.preferences.fontSize === 'small') {
        root.style.fontSize = '14px';
      } else if (userProfile.preferences.fontSize === 'large') {
        root.style.fontSize = '18px';
      } else {
        root.style.fontSize = '16px'; // medium
      }
    }
    
    // Apply reduced motion
    if (userProfile?.preferences?.reducedAnimations) {
      root.style.setProperty('--reduced-motion', 'none');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--reduced-motion');
      root.classList.remove('reduce-motion');
    }
  }, [userProfile?.preferences]);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: UserProfile = {
      uid: res.user.uid,
      name,
      email,
      photoURL: null,
      learningPath: null,
      activeCourseId: null,
      onboardingCompleted: false,
      completedLessons: [],
      completedQuizzes: [],
      level: 1,
      preferences: {
        theme: 'dark',
        emailNotifications: true,
        pushNotifications: true,
        learningReminders: true,
        quizAlerts: true,
        projectDeadlines: true,
        learningLanguage: 'en',
        difficultyPreference: 'intermediate',
        autoplayVideos: true,
        showHints: 'auto',
        fontSize: 'medium',
        reducedAnimations: false,
        readAloud: false,
        activityVisibility: 'public',
        personalizedRecommendations: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await userService.createUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    let profile = await userService.getUserProfile(res.user.uid);
    if (!profile) {
      profile = {
        uid: res.user.uid,
        name: res.user.displayName || 'Learner',
        email: res.user.email || '',
        photoURL: res.user.photoURL,
        learningPath: null,
        activeCourseId: null,
        onboardingCompleted: false,
        completedLessons: [],
        completedQuizzes: [],
        level: 1,
        preferences: {
          theme: 'dark',
          emailNotifications: true,
          pushNotifications: true,
          learningReminders: true,
          quizAlerts: true,
          projectDeadlines: true,
          learningLanguage: 'en',
          difficultyPreference: 'intermediate',
          autoplayVideos: true,
          showHints: 'auto',
          fontSize: 'medium',
          reducedAnimations: false,
          readAloud: false,
          activityVisibility: 'public',
          personalizedRecommendations: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await userService.createUserProfile(profile as UserProfile);
    }
    setUserProfile(profile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (oldP: string, newP: string) => {
    if (!user || !user.email) throw new Error("User not logged in");
    
    // Check if user is Google Auth (handled in UI, but good to double check)
    if (user.providerData.some(p => p.providerId === 'google.com')) {
      throw new Error("Google authenticated users cannot change password here.");
    }

    const credential = EmailAuthProvider.credential(user.email, oldP);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newP);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading, login, signup, loginWithGoogle, logout, resetPassword, changePassword, refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
