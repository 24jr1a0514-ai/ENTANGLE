import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courses } from '../data/courses';
import { ChevronLeft, CheckCircle, BookOpen } from 'lucide-react';

export default function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { userProfile } = useAuth();

  const activeCourse = courses.find(c => c.id === userProfile?.activeCourseId);
  const domainData = activeCourse?.curriculum;

  if (!domainData) {
    return <div className="p-8">Loading...</div>;
  }
  
  const chapter = domainData.chapters.find((c: any) => c.id === chapterId);

  if (!chapter || !chapter.pages || chapter.pages.length === 0) {
    return (
      <div className="p-8 text-center animate-in fade-in mt-20">
        <h2 className="text-2xl font-bold mb-4">Chapter not found or empty</h2>
        <Link to="/curriculum" className="text-primary hover:underline font-medium">
          Return to Curriculum
        </Link>
      </div>
    );
  }

  const completedLessons = userProfile?.completedLessons || [];
  
  // Calculate progress
  let completedTopicsCount = 0;
  chapter.pages.forEach((page: any) => {
    if (completedLessons.includes(page.id)) {
      completedTopicsCount++;
    }
  });

  const totalTopics = chapter.pages.length;
  const progressPercentage = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-300">
      <Link
        to="/curriculum"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Curriculum
      </Link>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            {domainData.domain.toUpperCase()} TRACK
          </div>
          <div className="text-sm font-semibold text-muted-foreground">
            {completedTopicsCount} / {totalTopics} Topics Completed — {progressPercentage}%
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight quantum-text-gradient">
          {chapter.title}
        </h1>
        
        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-3 mb-6 overflow-hidden">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="space-y-4 pt-2">
          {chapter.pages.map((topic: any, index: number) => {
            const isCompleted = completedLessons.includes(topic.id);
            const isUnlocked = true; // All topics are independently accessible

            return (
              <Link 
                to={`/topic/${chapter.id}/${topic.id}`}
                key={topic.id} 
                className={`block p-4 sm:p-6 rounded-2xl border ${isUnlocked ? 'border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 cursor-pointer' : 'border-border/50 bg-secondary/10 opacity-70'} transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Topic {index + 1}
                      </div>
                      <h3 className={`text-lg font-bold ${!isUnlocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {topic.title}
                      </h3>
                    </div>
                  </div>

                  {isUnlocked && (
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span
                        className="px-6 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full font-bold transition-colors text-sm"
                      >
                        {isCompleted ? 'Review' : 'Learn'}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
