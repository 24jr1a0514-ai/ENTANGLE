import { Link, useNavigate } from 'react-router-dom';
import { Atom, ChevronRight, BookOpen, Code, Video, Puzzle, CircuitBoard, Sparkles, Brain, Code2 } from 'lucide-react';
import { courses } from '../data/courses';

export default function LandingPage() {
  const navigate = useNavigate();
  // Find the QC course (we assume it exists since it's the only one left)
  const qcCourse = courses.find(c => c.id === 'quantum-computing');

  const handleStartLearning = () => {
    // If we have a direct route or signup to login
    navigate('/signup');
  };

  const features = [
    { name: 'Theory & Visuals', icon: <BookOpen className="w-5 h-5 text-purple-400" /> },
    { name: 'Video Lectures', icon: <Video className="w-5 h-5 text-purple-400" /> },
    { name: 'Interactive Demos', icon: <Atom className="w-5 h-5 text-purple-400" /> },
    { name: 'Quantum Circuit Practice', icon: <CircuitBoard className="w-5 h-5 text-purple-400" /> },
    { name: 'Coding Examples', icon: <Code className="w-5 h-5 text-purple-400" /> },
    { name: 'Quizzes & Flashcards', icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
    { name: 'Topic-Specific Puzzles', icon: <Puzzle className="w-5 h-5 text-purple-400" /> },
    { name: 'AI Tutor', icon: <Brain className="w-5 h-5 text-purple-400" /> },
    { name: 'Practical Labs', icon: <Code2 className="w-5 h-5 text-purple-400" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Atom className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight quantum-text-gradient">ENTANGLE</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#syllabus" className="hover:text-primary transition-colors">Syllabus</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#ai-tutor" className="hover:text-primary transition-colors">AI Tutor</a>
        </nav>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Start Learning
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-24 lg:py-32 xl:py-48 flex justify-center items-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-5xl">
              Master <span className="quantum-text-gradient">Quantum Computing</span> From Scratch.
            </h1>
            <p className="text-muted-foreground md:text-xl max-w-[800px]">
              The ultimate platform to learn, practice, and build in the quantum realm. Explore interactive circuits, in-depth theory, and dynamic labs designed to make quantum mechanics intuitive.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={handleStartLearning} className="group px-8 py-3 text-base font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                Start Learning <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#syllabus" className="px-8 py-3 text-base font-medium border border-border bg-card hover:bg-card/80 rounded-full transition-all flex items-center justify-center">
                View Syllabus
              </a>
            </div>
          </div>
        </section>

        <section id="syllabus" className="w-full py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">A Complete Learning Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our Quantum Computing curriculum includes {qcCourse?.curriculum?.chapters?.length || 50} comprehensive chapters, covering everything from fundamental state vectors to advanced quantum algorithms and error correction.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div onClick={handleStartLearning} className="bg-card p-8 rounded-3xl border border-border flex flex-col md:flex-row gap-8 shadow-2xl hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/10 transition-colors" />
                <div className="flex-1 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20 mb-6">
                    <Atom className="w-4 h-4" /> Official Course
                  </div>
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">Quantum Computing</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
                    Dive into Qubits, Superposition, Entanglement, Quantum Teleportation, Shor's Algorithm, Grover's Search, and modern Quantum Hardware. Access hands-on circuit labs, theoretical breakdowns, and interview-ready challenges.
                  </p>
                  <span className="inline-flex items-center gap-2 font-bold text-primary">
                    View Course Details <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
                <div className="md:w-64 flex-shrink-0 flex items-center justify-center border-t md:border-t-0 md:border-l border-border/50 pt-8 md:pt-0 md:pl-8 z-10">
                   <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute w-full h-full border-2 border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute w-32 h-32 border-2 border-blue-500/40 rounded-full animate-[spin_7s_linear_infinite_reverse]" />
                    <Atom className="w-16 h-16 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How Entangle Works</h2>
            <div className="grid md:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
              <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-border z-0" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Learn the Theory</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Grasp the complex math and physics of quantum states with visual and intuitive explanations.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <span className="text-3xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Build Circuits</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Get hands-on experience designing and running circuits using real quantum gates.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Solve Puzzles</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Challenge yourself with topic-specific puzzles that test your deep understanding.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <span className="text-3xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Master Algorithms</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Apply your knowledge to fully comprehend Shor's and Grover's algorithm.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">An Unmatched Feature Set</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="bg-card p-6 rounded-xl border border-border flex flex-col items-center text-center gap-4 shadow-sm hover:border-primary/30 transition-colors">
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    {feature.icon}
                  </div>
                  <span className="font-bold text-base md:text-lg">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 flex justify-center text-sm text-muted-foreground">
        <p>© 2026 Entangle. Dedicated entirely to Quantum Education.</p>
      </footer>
    </div>
  );
}
