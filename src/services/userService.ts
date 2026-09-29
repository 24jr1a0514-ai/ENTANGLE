import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { UserProfile } from '../types';

export const userService = {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  },

  async createUserProfile(userProfile: UserProfile): Promise<void> {
    try {
      const docRef = doc(db, 'users', userProfile.uid);
      await setDoc(docRef, userProfile);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  async markLessonCompleted(uid: string, lessonId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        completedLessons: arrayUnion(lessonId),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error marking lesson completed:", error);
      throw error;
    }
  },

  async markQuizCompleted(uid: string, lessonId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        completedQuizzes: arrayUnion(lessonId),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error marking quiz completed:", error);
      throw error;
    }
  },

  async markModuleCompleted(uid: string, moduleId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        completedModules: arrayUnion(moduleId),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error marking module completed:", error);
      throw error;
    }
  }
};
