import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { courses } from '../data/courses';
import { parseTopicContent } from '../utils/topicContentParser';
import { QuantumVideoPlayer } from '../components/curriculum/QuantumVideoPlayer';
import { FlashcardDeck } from '../components/curriculum/FlashcardDeck';
import { QuantumVisualizer } from '../components/curriculum/QuantumVisualizer';
import { QuantumInteractiveDemo } from '../components/curriculum/QuantumInteractiveDemo';
import { QuizComponent } from '../components/curriculum/QuizComponent';
import { 
  ChevronLeft, ArrowRight, Video, Sparkles, BookOpen, 
  Code, PlayCircle, Puzzle, CheckCircle, CheckCircle2, Lock 
} from 'lucide-react';

export default function TopicPage() {
  const { chapterId, topicId } = useParams<{ chapterId: string, topicId: string }>();
  const { user, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  type ModuleTab = 'theory' | 'demo' | 'video' | 'flashcards' | 'examples' | 'quizzes' | 'puzzles';
  
  const moduleOrder: ModuleTab[] = [
    'theory', 'demo', 'video', 'flashcards', 'examples', 'quizzes', 'puzzles'
  ];

  const [activeTab, setActiveTab] = useState<ModuleTab>('theory');
  const [isCompleting, setIsCompleting] = useState(false);

  const activeCourse = courses.find(c => c.id === userProfile?.activeCourseId);
  const domainData = activeCourse?.curriculum;

  if (!domainData) {
    return <div className="p-8">Loading...</div>;
  }
  
  const chapter = domainData.chapters.find((c) => c.id === chapterId);
  const topic = chapter?.pages.find((p) => p.id === topicId);

  if (!chapter || !topic) {
    return (
      <div className="p-8 text-center animate-in fade-in mt-20">
        <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
        <Link to={`/chapter/${chapterId}`} className="text-primary hover:underline font-medium">
          Return to Chapter
        </Link>
      </div>
    );
  }

  // Parse the content dynamically
  const parsedContent = useMemo(() => {
    const learningPath = userProfile?.learningPath || 'others';
    
    // Extract standard-specific content or fallback to string
    const getStandardContent = (content: Record<string, string> | string | undefined): string => {
      if (!content) return '';
      if (typeof content === 'string') return content;
      return content[learningPath] || content['others'] || Object.values(content)[0] || '';
    };

    const getStandardArrayContent = (content: any): any[] => {
      if (!content) return [];
      if (Array.isArray(content)) return content;
      return content[learningPath] || content['others'] || Object.values(content)[0] || [];
    };

    const getVideoContent = (content: any): any => {
      if (!content) return undefined;
      // If it's a direct object with embedId
      if (content.embedId) return content;
      // If it's standard-based
      return content[learningPath] || content['others'] || Object.values(content)[0];
    };

    const explanation = getStandardContent(topic.explanation);
    const theory = getStandardContent(topic.theory);
    const examples = getStandardContent(topic.examples);

    const parsed = parseTopicContent(topic.title, explanation, chapter.id);
    return {
      theory: theory || parsed.theory,
      examples: examples || parsed.examples,
      quizzes: getStandardArrayContent(topic.quizzes).length > 0 ? getStandardArrayContent(topic.quizzes) : parsed.quizzes,
      puzzles: getStandardContent(topic.puzzles) || parsed.puzzles,
      flashcards: getStandardArrayContent(topic.flashcards).length > 0 ? getStandardArrayContent(topic.flashcards) : parsed.flashcards,
      video: getVideoContent(topic.video) || parsed.video,
      demo: topic.demo || ""
    };
  }, [topic, chapter.id, userProfile?.learningPath]);

  const completedModules = userProfile?.completedModules || [];
  const isTopicCompleted = userProfile?.completedLessons?.includes(topic.id);

  const isModuleCompleted = (mod: ModuleTab) => {
    return completedModules.includes(`${topic.id}-${mod}`);
  };

  const isModuleUnlocked = (_mod?: any) => {
    return true; // All modules are unlocked and accessible independently
  };

  const handleCompleteModule = async () => {
    if (!user || !topic) return;
    setIsCompleting(true);
    try {
      // If it's the last module, we complete the whole topic
      if (activeTab === 'puzzles') {
        await userService.markLessonCompleted(user.uid, topic.id);
        await userService.markModuleCompleted(user.uid, `${topic.id}-${activeTab}`);
        await refreshProfile();
        
        // Find next topic to auto-navigate
        const currentIndex = chapter.pages.findIndex(p => p.id === topic.id);
        if (currentIndex !== -1 && currentIndex < chapter.pages.length - 1) {
          const nextTopic = chapter.pages[currentIndex + 1];
          navigate(`/topic/${chapter.id}/${nextTopic.id}`);
        } else {
          // If it's the last topic, return to chapter
          navigate(`/chapter/${chapter.id}`);
        }
      } else {
        // Just complete this module and move to next
        await userService.markModuleCompleted(user.uid, `${topic.id}-${activeTab}`);
        await refreshProfile();
        
        const idx = moduleOrder.indexOf(activeTab);
        if (idx < moduleOrder.length - 1) {
          setActiveTab(moduleOrder[idx + 1]);
        }
      }
    } catch (e) {
      console.error('Failed to mark module complete', e);
    } finally {
      setIsCompleting(false);
    }
  };

  const renderTabButton = (id: ModuleTab, icon: React.ReactNode, label: string) => {
    const active = activeTab === id;
    const completed = isModuleCompleted(id);
    const unlocked = isModuleUnlocked(id);
    
    return (
      <button 
        onClick={() => unlocked && setActiveTab(id)} 
        disabled={!unlocked}
        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
          active 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : unlocked 
              ? 'hover:bg-secondary text-foreground'
              : 'opacity-50 cursor-not-allowed text-muted-foreground bg-secondary/20'
        }`}
      >
        <div className="flex items-center gap-3">
          {icon} 
          {label}
        </div>
        {completed ? (
          <CheckCircle2 className={`w-4 h-4 ${active ? 'text-primary-foreground' : 'text-emerald-500'}`} />
        ) : !unlocked ? (
          <Lock className="w-3 h-3 opacity-50" />
        ) : null}
      </button>
    );
  };

  // Helper to render text with injected visualizers
  const renderTheoryWithVisuals = (text: string, learningPath: string) => {
    if (!text) return null;
    const parts = text.split(/(\[\[VISUAL:.*?\]\])/s);
    
    return parts.map((part, i) => {
      if (part.startsWith('[[VISUAL:') && part.endsWith(']]')) {
        try {
          const jsonStr = part.replace('[[VISUAL:', '').replace(']]', '');
          const data = JSON.parse(jsonStr);
          return <QuantumVisualizer key={i} data={data} learningPath={learningPath as any} />;
        } catch (e) {
          return <span key={i} className="text-red-500 block p-4 border border-red-500/50 rounded-lg">Visual Render Error: Invalid Configuration</span>;
        }
      }
      
      // Skip empty text parts
      if (!part.trim()) return null;
      
      return <p key={i} className="whitespace-pre-line mb-6">{part}</p>;
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-300">
      <Link
        to={`/chapter/${chapter.id}`}
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Chapter
      </Link>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row min-h-[650px]">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 bg-secondary/30 border-b md:border-b-0 md:border-r border-border p-4 flex flex-col gap-2 shrink-0">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Learning Modules
          </div>
          
          {renderTabButton('theory', <BookOpen className="w-4 h-4" />, 'Detailed Theory')}
          {renderTabButton('demo', <PlayCircle className="w-4 h-4" />, 'Interactive Demo')}
          {renderTabButton('video', <Video className="w-4 h-4" />, 'Video Lecture')}
          {renderTabButton('flashcards', <Sparkles className="w-4 h-4" />, 'Flashcards')}
          {renderTabButton('examples', <Code className="w-4 h-4" />, 'Practical Examples')}
          {renderTabButton('quizzes', <CheckCircle className="w-4 h-4" />, 'Quizzes')}
          {renderTabButton('puzzles', <Puzzle className="w-4 h-4" />, 'Puzzles')}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col relative overflow-hidden">
          <div className="mb-8 border-b border-border/50 pb-4 shrink-0">
            <h1 className="text-3xl font-bold tracking-tight quantum-text-gradient mb-2">
              {topic.title}
            </h1>
            <div className="flex gap-2">
              {topic.keyConcepts?.map((concept, i) => (
                <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md">
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-20">
            {activeTab === 'theory' && (
              <div className="prose prose-invert max-w-none text-base leading-relaxed animate-in fade-in slide-in-from-bottom-4">
                {renderTheoryWithVisuals(parsedContent.theory, userProfile?.learningPath || 'others')}
              </div>
            )}

            {activeTab === 'demo' && (
              parsedContent.demo ? (
                <QuantumInteractiveDemo 
                  data={
                    typeof parsedContent.demo === 'string' 
                      ? { type: 'unknown', title: topic.title, description: parsedContent.demo } 
                      : parsedContent.demo || { type: 'unknown' }
                  } 
                  learningPath={userProfile?.learningPath || 'others'} 
                />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 h-full flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-2xl bg-secondary/10">
                  <PlayCircle className="w-16 h-16 text-primary/50 mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-foreground">Interactive Demo: {topic.title}</h3>
                  <p className="text-muted-foreground mt-2 text-center max-w-md">
                    Interact with {topic.title} concepts. (Interactive visualizations and sandboxes will load here).
                  </p>
                </div>
              )
            )}

            {activeTab === 'video' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <QuantumVideoPlayer 
                  key={parsedContent.video?.embedId || topic.id} 
                  video={parsedContent.video} 
                  topicVideos={[]} 
                />
              </div>
            )}

            {activeTab === 'flashcards' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <FlashcardDeck cards={parsedContent.flashcards} />
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="prose prose-invert max-w-none text-base leading-relaxed animate-in fade-in slide-in-from-bottom-4">
                {(() => {
                  if (!parsedContent.examples) return null;
                  const text = parsedContent.examples;
                  const codeBlockRegex = /```[\s\S]*?```/g;
                  const parts = text.split(codeBlockRegex);
                  const codeBlocks = text.match(codeBlockRegex) || [];
                  
                  return parts.map((part, i) => {
                    const lines = part.split('\n');
                    const withLines = lines.map((line, k) => {
                      if (line.trim().startsWith('### ')) {
                        return <h3 key={k} className="text-xl font-bold mt-6 mb-3 text-primary quantum-text-gradient">{line.replace('### ', '').trim()}</h3>;
                      }
                      
                      const withBold = line.split(/(\*\*.*?\*\*)/g).map((subPart, j) => {
                        if (subPart.startsWith('**') && subPart.endsWith('**')) {
                          return <strong key={j} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{subPart}</span>;
                      });

                      // Don't render empty divs for pure newlines, but preserve spacing
                      if (line.trim() === '') return <div key={k} className="h-2"></div>;

                      return <div key={k} className="leading-relaxed">{withBold}</div>;
                    });
              
                    return (
                      <div key={i}>
                        {withLines}
                        {codeBlocks[i] && (
                          <pre className="bg-black/80 p-4 rounded-lg overflow-x-auto border border-border/50 my-4 font-mono text-sm text-emerald-400 shadow-inner">
                            <code>{codeBlocks[i].replace(/```(python|jsx|tsx)?/g, '').replace(/```/g, '').trim()}</code>
                          </pre>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 h-full">
                {Array.isArray(parsedContent.quizzes) ? (
                  <QuizComponent questions={parsedContent.quizzes} />
                ) : (
                  <div className="prose prose-invert max-w-none bg-secondary/20 p-6 rounded-2xl border border-border">
                    <p className="whitespace-pre-line">{parsedContent.quizzes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'puzzles' && (
              <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 bg-primary/5 p-6 rounded-2xl border border-primary/20">
                {(parsedContent.puzzles || '').split('\n').map((line, k) => {
                  if (line.trim() === '') return <div key={k} className="h-2"></div>;
                  
                  if (line.trim().startsWith('### ')) {
                    return <h3 key={k} className="text-xl font-bold mt-6 mb-3 text-primary quantum-text-gradient">{line.replace('### ', '').trim()}</h3>;
                  }

                  const withBold = line.split(/(\*\*.*?\*\*)/g).map((subPart, j) => {
                    if (subPart.startsWith('**') && subPart.endsWith('**')) {
                      return <strong key={j} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
                    }
                    return <span key={j}>{subPart}</span>;
                  });

                  return <div key={k} className="leading-relaxed">{withBold}</div>;
                })}
              </div>
            )}
          </div>

          {/* Module Completion Action */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-card/90 backdrop-blur border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isModuleCompleted(activeTab) ? (
                <span className="text-green-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Module Completed
                </span>
              ) : (
                "Review the content above to complete this module."
              )}
            </div>

            <button
              onClick={handleCompleteModule}
              disabled={isCompleting}
              className={`px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg text-sm ${
                isModuleCompleted(activeTab) && activeTab !== 'puzzles'
                  ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isCompleting ? 'Saving...' : 
                activeTab === 'puzzles' ? (
                  isTopicCompleted ? 'Continue to Next Topic' : <>Master Topic <ArrowRight className="w-4 h-4" /></>
                ) : (
                  isModuleCompleted(activeTab) ? <>Next Module <ArrowRight className="w-4 h-4" /></> : <>Complete & Continue <ArrowRight className="w-4 h-4" /></>
                )
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
