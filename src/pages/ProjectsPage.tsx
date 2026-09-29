import { ExternalLink, Play } from 'lucide-react';

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "Quantum Random Number Generator",
      description: "Build a true random number generator using the superposition principle on a real quantum computer.",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
      youtubeUrl: "https://www.youtube.com/results?search_query=quantum+random+number+generator+qiskit",
      tags: ["Beginner", "Qiskit", "Superposition"]
    },
    {
      id: 2,
      title: "Quantum Teleportation Protocol",
      description: "Learn how to teleport quantum information from one qubit to another using entanglement.",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
      youtubeUrl: "https://www.youtube.com/results?search_query=quantum+teleportation+qiskit",
      tags: ["Intermediate", "Entanglement", "Circuits"]
    },
    {
      id: 3,
      title: "Solving Sudoku with Grover's Algorithm",
      description: "Implement Grover's search algorithm to solve a simple Sudoku puzzle exponentially faster.",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
      youtubeUrl: "https://www.youtube.com/results?search_query=grover+algorithm+sudoku+qiskit",
      tags: ["Advanced", "Algorithms", "Optimization"]
    },
    {
      id: 4,
      title: "Variational Quantum Eigensolver (VQE)",
      description: "Use Quantum Machine Learning to find the ground state energy of a molecule like Lithium Hydride.",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
      youtubeUrl: "https://www.youtube.com/results?search_query=vqe+qiskit+chemistry",
      tags: ["Advanced", "QML", "Chemistry"]
    },
    {
      id: 5,
      title: "Quantum Error Correction (Shor Code)",
      description: "Implement the 9-qubit Shor code to protect your quantum information from bit-flip and phase-flip errors.",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
      youtubeUrl: "https://www.youtube.com/results?search_query=quantum+error+correction+qiskit",
      tags: ["Intermediate", "Error Correction"]
    },
    {
      id: 6,
      title: "Bernstein-Vazirani Algorithm",
      description: "Discover a secret number in a single try using quantum parallelism.",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
      youtubeUrl: "https://www.youtube.com/results?search_query=bernstein+vazirani+qiskit",
      tags: ["Beginner", "Algorithms"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 quantum-text-gradient">
          Quantum Projects
        </h1>
        <p className="text-muted-foreground text-lg">
          Follow along with these popular YouTube tutorials to build your own quantum applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.05)] transition-all group flex flex-col">
            <div className="relative aspect-video overflow-hidden bg-secondary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-purple-500/40 mix-blend-overlay z-10 pointer-events-none"></div>
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/60 backdrop-blur-sm transition-opacity duration-300 z-20">
                <a 
                  href={project.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-red-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg transform hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5" />
                  Watch Tutorial
                </a>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-6">
                {project.description}
              </p>
              
              <a 
                href={project.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                View on YouTube <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
