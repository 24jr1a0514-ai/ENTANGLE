
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, BookOpen, Beaker, Code2 } from 'lucide-react';
import { courses } from '../data/courses';

export default function DashboardPage() {
  const { userProfile } = useAuth();

  let domainCompletedLessonsCount = 0;
  let domainCompletedQuizzesCount = 0;
  
  const activeCourse = courses.find(c => c.id === userProfile?.activeCourseId);
  const domainData = activeCourse?.curriculum;

  let currentChapter = null;
  let progress = 0;
  let totalChapters = 1;

  if (domainData) {
    totalChapters = domainData.chapters.length;
    
    // Count only completed lessons that belong to the current domain
    domainCompletedLessonsCount = domainData.chapters.filter((c: any) => 
      (userProfile?.completedLessons || []).includes(c.id)
    ).length;
    
    // Count only completed quizzes that belong to the current domain
    domainCompletedQuizzesCount = domainData.chapters.filter((c: any) => 
      (userProfile?.completedQuizzes || []).includes(c.id)
    ).length;

    // Find the first chapter not in completedLessons
    currentChapter = domainData.chapters.find((c: any) => 
      !(userProfile?.completedLessons || []).includes(c.id)
    ) || domainData.chapters[domainData.chapters.length - 1];

    progress = totalChapters > 0 ? Math.round((domainCompletedLessonsCount / totalChapters) * 100) : 0;
  }

  const dashOffset = 289 - (289 * progress) / 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {userProfile?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Continue your quantum journey. You're doing great!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Current Course</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-32 h-32 rounded-full border-8 border-secondary flex items-center justify-center relative">
                {/* SVG Progress Circle Mock */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeDasharray="289" strokeDashoffset={dashOffset} strokeLinecap="round" />
                </svg>
                <div className="text-2xl font-bold">{progress}%</div>
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h3 className="text-lg font-bold capitalize">{activeCourse?.title || 'Quantum'} Track</h3>
                  <p className="text-sm text-muted-foreground">{currentChapter?.title || 'Get Started'}</p>
                </div>
                {domainData ? (
                  <Link to={`/lessons/${currentChapter?.id || ''}`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors w-full md:w-auto justify-center">
                    <PlayCircle className="w-5 h-5" />
                    Continue Learning
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium w-full md:w-auto justify-center">
                    Content Coming Soon
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <BookOpen className="w-8 h-8 text-blue-500 mb-3" />
              <div className="text-2xl font-bold">{domainCompletedLessonsCount}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
              <div className="text-2xl font-bold">{domainCompletedQuizzesCount}</div>
              <div className="text-sm text-muted-foreground">Quizzes Passed</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Recommended Next</h2>
            <div className="space-y-4">
              {userProfile?.activeCourseId === 'quantum-computing' && (
                <>
                  <Link to="/quantum-lab" className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-secondary transition-colors bg-primary/5 border border-primary/20">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Beaker className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        Quantum Circuit Practice
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">LAB</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Build circuits & complete challenges</div>
                    </div>
                  </Link>
                  <Link to="/coding" className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-secondary transition-colors bg-purple-500/5 border border-purple-500/20">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        Practice Quantum Coding
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-mono">CODE</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Qiskit & OpenQASM 2.0 coding problems</div>
                    </div>
                  </Link>
                </>
              )}
              {domainData ? (
                <>
                  <Link to={`/lessons/${currentChapter?.id || ''}`} className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-secondary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <PlayCircle className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{currentChapter?.title || 'Next Lesson'}</div>
                      <div className="text-xs text-muted-foreground mt-1">10 min read</div>
                    </div>
                  </Link>
                  <Link to={`/quizzes/${currentChapter?.id || ''}`} className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-secondary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <CheckSquare className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{currentChapter?.title || 'Next Quiz'} Quiz</div>
                      <div className="text-xs text-muted-foreground mt-1">Test your knowledge</div>
                    </div>
                  </Link>
                  <Link to={`/practice/${userProfile?.activeCourseId}`} className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-secondary transition-colors bg-emerald-500/5 border border-emerald-500/20">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5 capitalize">
                        {activeCourse?.title || 'Coding'} Practice
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">CODE</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Open your coding playground</div>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Recommendations will appear once course content is available.
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

// Needed to make typescript happy about the CheckSquare import
import { CheckSquare } from 'lucide-react';
