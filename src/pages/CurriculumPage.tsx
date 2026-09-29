
import { Link } from 'react-router-dom';
import { courses } from '../data/courses';
import { BookOpen, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function CurriculumPage() {
  const { userProfile } = useAuth();

  const activeCourse = courses.find(c => c.id === userProfile?.activeCourseId);
  const domainData = activeCourse?.curriculum;

  if (!domainData) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Curriculum Loading...</h1>
        <p className="text-muted-foreground">The curriculum for this course is coming soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 quantum-text-gradient">
          Your Personalized Curriculum
        </h1>
        <p className="text-muted-foreground">
          Adapted for the <span className="font-bold text-primary capitalize">{userProfile?.learningPath}</span> path.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-secondary/50 px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold capitalize">{userProfile?.learningPath} Track Modules</h2>
          </div>
          <div className="divide-y divide-border">
            {domainData.chapters.map((chapter, cIdx) => {
              // A chapter is completed if all its topics are in completedLessons
              const completedPagesCount = chapter.pages.filter(page => userProfile?.completedLessons?.includes(page.id)).length;
              const isCompleted = chapter.pages.length > 0 && completedPagesCount === chapter.pages.length;
              const isPartiallyCompleted = completedPagesCount > 0 && !isCompleted;
              const isLocked = false;

              return (
                <div key={chapter.id} className="p-4 sm:p-6 hover:bg-secondary/20 transition-colors flex items-center justify-between group">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Chapter {cIdx + 1}
                      </div>
                      <h3 className={`text-lg font-bold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {chapter.title}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-1">
                        {chapter.pages.length} Pages • {completedPagesCount} Completed
                      </div>
                    </div>
                  </div>

                  {!isLocked && (
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/chapter/${chapter.id}`}
                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full font-medium transition-colors text-sm"
                      >
                        {isCompleted ? 'Review' : isPartiallyCompleted ? 'Continue' : 'Start'}
                      </Link>
                      <Link
                        to={`/quizzes/${chapter.id}`}
                        className="px-4 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white rounded-full font-medium transition-colors text-sm"
                      >
                        Quiz
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
