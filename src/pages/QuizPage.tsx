import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { quizContent } from '../data/quizzes';
import { CheckCircle, XCircle, ChevronRight, Trophy } from 'lucide-react';
import { userService } from '../services/userService';

export default function QuizPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, userProfile, refreshProfile } = useAuth();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch the quiz based on the domain-specific chapter ID
  const questions = lessonId ? quizContent[lessonId] : undefined;

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center mt-20 animate-in fade-in">
        <h2 className="text-2xl font-bold mb-4">Quiz coming soon!</h2>
        <p className="text-muted-foreground mb-6">Administrators are currently adding questions for this chapter.</p>
        <Link to="/curriculum" className="text-primary font-medium hover:underline">Return to Curriculum</Link>
      </div>
    );
  }

  const handleSelect = (idx: number) => {
    if (!showResult) {
      setSelectedOpt(idx);
    }
  };

  const handleCheck = () => {
    if (selectedOpt === null) return;
    setShowResult(true);
    if (selectedOpt === questions[currentQ].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedOpt(null);
      setShowResult(false);
    } else {
      // Quiz finished
      if (user && userProfile) {
        setIsSaving(true);
        try {
          if (lessonId) {
            await userService.markQuizCompleted(user.uid, lessonId);
          }
          await refreshProfile();
        } catch (e) {
          console.error("Failed to save score", e);
        } finally {
          setIsSaving(false);
          // Just move to a mock completion state
          setCurrentQ(c => c + 1); 
        }
      } else {
        setCurrentQ(c => c + 1);
      }
    }
  };

  const isFinished = currentQ >= questions.length;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-12 bg-card border border-border rounded-3xl text-center shadow-lg animate-in fade-in zoom-in-95 duration-500">
        <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Quiz Completed!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          You scored <span className="text-primary font-bold">{score}</span> out of {questions.length}.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/curriculum" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors">
            Back to Curriculum
          </Link>
          <Link to={`/lessons/${lessonId}`} className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
            Review Lesson
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const isCorrect = selectedOpt === q.answer;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold capitalize">Quiz: {lessonId?.replace(/-/g, ' ')}</h1>
        <div className="text-sm font-medium text-muted-foreground">
          Question {currentQ + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-1.5 bg-secondary w-full">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${((currentQ) / questions.length) * 100}%` }}
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mb-8 mt-2 leading-relaxed">
          {q.question}
        </h2>

        <div className="space-y-3">
          {q.options.map((opt: string, idx: number) => {
            let btnClass = "border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary";
            
            if (showResult) {
              if (idx === q.answer) {
                btnClass = "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400";
              } else if (idx === selectedOpt && idx !== q.answer) {
                btnClass = "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
              } else {
                btnClass = "border-border opacity-50";
              }
            } else if (selectedOpt === idx) {
              btnClass = "border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {showResult && idx === q.answer && <CheckCircle className="w-5 h-5" />}
                {showResult && idx === selectedOpt && idx !== q.answer && <XCircle className="w-5 h-5" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`mt-8 p-6 rounded-2xl ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <h3 className={`font-bold mb-2 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>
            <p className="text-sm text-foreground/90">{q.explanation}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!showResult ? (
            <button
              onClick={handleCheck}
              disabled={selectedOpt === null}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isSaving}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {isSaving ? 'Saving...' : 'Next'} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
