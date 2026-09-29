import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import type { LearningPath } from '../types';
import { Backpack, Book, GraduationCap, Microscope, Briefcase } from 'lucide-react';

export default function LearningPathSelection() {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(false);

  const paths = [
    {
      id: 'school',
      title: 'School',
      subtitle: 'Classes 5–10',
      description: 'Explore quantum computing through stories, games, pictures, and simple experiments.',
      icon: <Backpack className="w-10 h-10 mb-4 text-blue-400" />
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      subtitle: 'Classes 11–12',
      description: 'Build your quantum foundation using science, mathematics, simulations, and beginner coding.',
      icon: <Book className="w-10 h-10 mb-4 text-purple-400" />
    },
    {
      id: 'undergraduate',
      title: 'Undergraduate',
      subtitle: 'UG',
      description: 'Study quantum computing through mathematics, quantum mechanics, algorithms, and Qiskit programming.',
      icon: <GraduationCap className="w-10 h-10 mb-4 text-pink-400" />
    },
    {
      id: 'postgraduate',
      title: 'Postgraduate',
      subtitle: 'PG',
      description: 'Explore advanced quantum information, algorithms, error correction, research, and quantum technologies.',
      icon: <Microscope className="w-10 h-10 mb-4 text-indigo-400" />
    },
    {
      id: 'others',
      title: 'Others',
      subtitle: 'Professionals & Researchers',
      description: 'Explore practical quantum computing applications, career paths, industry use cases, and specialized learning tracks.',
      icon: <Briefcase className="w-10 h-10 mb-4 text-teal-400" />
    }
  ];



  const handleContinue = async () => {
    if (!selectedPath || !user) return;
    
    setLoading(true);
    try {
      await userService.updateUserProfile(user.uid, { 
        learningPath: selectedPath,
        activeCourseId: 'quantum-computing',
        onboardingCompleted: true
      });
      await refreshProfile();
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Failed to save learning path", error);
      alert(`Error: ${error.message}\n\nPlease make sure you have enabled "Firestore Database" in your Firebase console and set it to Test Mode!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center relative">
      <button 
        onClick={() => logout()}
        className="absolute top-8 right-8 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 font-medium transition-colors"
      >
        Logout
      </button>

      <div className="max-w-6xl w-full mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Learning Path</h1>
          <p className="text-xl text-muted-foreground">
            We'll personalize your quantum computing journey based on your current education level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {paths.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path.id as LearningPath)}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all ${
                selectedPath === path.id 
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                  : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
              }`}
            >
              {path.icon}
              <h2 className="text-2xl font-bold mb-1">{path.title}</h2>
              <span className="text-sm font-medium text-primary mb-4">{path.subtitle}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {path.description}
              </p>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedPath || loading}
            className="px-12 py-4 bg-primary text-primary-foreground text-lg font-medium rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
