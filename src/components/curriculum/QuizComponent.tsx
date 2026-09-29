import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple' | 'true-false' | 'picture' | 'scenario';
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  imageUrl?: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
}

export function QuizComponent({ questions }: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No quiz available for this topic.</div>;
  }

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (hasSubmitted) return;

    if (currentQuestion.type === 'multiple') {
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    } else {
      setSelectedAnswers([index]);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) return;
    setHasSubmitted(true);
    
    // Check if correct
    const isCorrect = 
      selectedAnswers.length === currentQuestion.correctAnswers.length &&
      selectedAnswers.every(val => currentQuestion.correctAnswers.includes(val));
      
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswers([]);
      setHasSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setHasSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-xl animate-in fade-in zoom-in-95">
        <h3 className="text-2xl font-bold mb-2 quantum-text-gradient">Quiz Completed!</h3>
        <p className="text-muted-foreground mb-6">You answered {score} out of {questions.length} questions correctly.</p>
        
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center rounded-full border-4 border-primary/20">
          <div className="text-4xl font-bold text-primary">{percentage}%</div>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary"
              strokeDasharray={`${percentage * 3.01} 301`}
            />
          </svg>
        </div>

        <button 
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-full font-semibold transition-colors"
        >
          <RefreshCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const isMultiSelect = currentQuestion.type === 'multiple';

  return (
    <div className="flex flex-col h-full bg-card/50 border border-border rounded-2xl overflow-hidden shadow-md animate-in fade-in">
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/10">
        <h3 className="font-bold text-lg text-foreground">Topic Quiz</h3>
        <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        <h4 className="text-xl font-semibold mb-6 text-foreground leading-relaxed">
          {currentQuestion.question}
        </h4>

        {currentQuestion.imageUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-border/50 bg-black/20 flex justify-center p-4">
            <img src={currentQuestion.imageUrl} alt="Question Visual" className="max-h-64 object-contain rounded-md" />
          </div>
        )}

        {isMultiSelect && !hasSubmitted && (
          <p className="text-xs text-primary font-semibold mb-4 uppercase tracking-wider">Select all that apply</p>
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers.includes(idx);
            const isCorrectAnswer = currentQuestion.correctAnswers.includes(idx);
            
            let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium flex items-start gap-3 ";
            let icon = null;

            if (!hasSubmitted) {
              buttonClass += isSelected 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-border hover:border-primary/50 hover:bg-secondary/30 text-foreground/80";
              
              icon = (
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded${isMultiSelect ? '' : '-full'} border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                }`}>
                  {isSelected && <div className={`w-2.5 h-2.5 bg-current rounded${isMultiSelect ? '-sm' : '-full'}`} />}
                </div>
              );
            } else {
              if (isCorrectAnswer) {
                buttonClass += "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
              } else if (isSelected && !isCorrectAnswer) {
                buttonClass += "border-red-500 bg-red-500/10 text-red-400";
                icon = <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />;
              } else {
                buttonClass += "border-border/50 opacity-50 text-muted-foreground";
                icon = <div className="w-5 h-5 shrink-0 mt-0.5" />;
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={buttonClass}
                disabled={hasSubmitted}
              >
                {icon}
                <span className="leading-snug">{option}</span>
              </button>
            );
          })}
        </div>

        {hasSubmitted && (
          <div className="mt-8 p-5 rounded-xl bg-secondary/30 border border-border animate-in slide-in-from-bottom-4 fade-in">
            <h5 className="font-bold text-foreground mb-2 flex items-center gap-2">
              {selectedAnswers.every(val => currentQuestion.correctAnswers.includes(val)) && selectedAnswers.length === currentQuestion.correctAnswers.length 
                ? <><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Correct!</>
                : <><XCircle className="w-5 h-5 text-red-500"/> Incorrect.</>
              }
            </h5>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border/50 bg-card flex justify-end">
        {!hasSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={selectedAnswers.length === 0}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold disabled:opacity-50 transition-opacity"
          >
            Submit Answer
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
