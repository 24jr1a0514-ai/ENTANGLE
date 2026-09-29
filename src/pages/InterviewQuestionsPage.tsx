import { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import { Search, BookOpenCheck, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, Sparkles, Filter } from 'lucide-react';

export default function InterviewQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('iq-1');
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Fundamentals', 'Gates & Circuits', 'Algorithms', 'Coding & Qiskit', 'Hardware & Security'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered Questions
  const filteredQuestions = INTERVIEW_QUESTIONS.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/10 border border-border p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
              <Sparkles className="w-3.5 h-3.5" /> Quantum Career Prep
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight quantum-text-gradient">
              Quantum Computing Interview Questions
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Master top interview questions frequently asked by leading quantum research labs, tech giants (IBM, Google, Microsoft), and quantum startups.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 min-w-[220px] shadow-lg flex flex-col items-center justify-center text-center">
            <BookOpenCheck className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {masteredIds.length} / {INTERVIEW_QUESTIONS.length}
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Questions Mastered
            </div>
            <div className="w-full bg-secondary h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${(masteredIds.length / INTERVIEW_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section: Search & Filters */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search interview questions by keyword (e.g. Hadamard, Bell State, Qiskit, Shor, VQE)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-secondary/60 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-sm font-medium transition-all"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-border/50">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20'
                    : 'bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Difficulty:
            </span>
            <div className="flex bg-secondary p-1 rounded-xl border border-border text-xs font-semibold">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
            <p className="text-lg font-semibold mb-2">No matching interview questions found</p>
            <p className="text-sm">Try broadening your search query or changing category filters.</p>
          </div>
        ) : (
          filteredQuestions.map((q, index) => {
            const isExpanded = expandedId === q.id;
            const isMastered = masteredIds.includes(q.id);

            return (
              <div
                key={q.id}
                className={`bg-card border rounded-2xl transition-all duration-200 overflow-hidden shadow-lg ${
                  isExpanded ? 'border-primary/60 ring-1 ring-primary/20' : 'border-border hover:border-border/80'
                }`}
              >
                {/* Question Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-6 cursor-pointer flex items-start justify-between gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-sm font-extrabold text-muted-foreground/60 mt-0.5 font-mono">
                      #{index + 1}
                    </span>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary text-foreground border border-border">
                          {q.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(
                            q.difficulty
                          )}`}
                        >
                          {q.difficulty}
                        </span>
                        {isMastered && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Mastered
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-foreground leading-snug">
                        {q.question}
                      </h3>

                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {q.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(q.id);
                      }}
                      className={`p-2 rounded-xl border transition-colors ${
                        isMastered
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                      }`}
                      title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>

                    <button className="p-2 rounded-xl bg-secondary border border-border text-muted-foreground">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-border/60 bg-muted/10 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    {/* Detailed Answer */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                        Detailed Explanation
                      </h4>
                      <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                        {q.answer}
                      </div>
                    </div>

                    {/* Formula or Code Snippet */}
                    {q.formulaOrCode && (
                      <div className="bg-secondary/80 border border-border rounded-xl p-4 font-mono text-xs relative overflow-x-auto">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/60 text-muted-foreground font-sans">
                          <span className="font-bold text-xs uppercase tracking-wide">
                            Formula / Code Notation
                          </span>
                          <button
                            onClick={() => handleCopyCode(q.formulaOrCode!, q.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors text-xs"
                          >
                            {copiedId === q.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy Code
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-primary-foreground font-mono whitespace-pre-wrap leading-relaxed">
                          {q.formulaOrCode}
                        </pre>
                      </div>
                    )}

                    {/* Key Takeaway Box */}
                    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-xl">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-primary mb-1">
                        Key Interview Takeaway
                      </h4>
                      <p className="text-sm font-medium text-foreground/90">{q.keyTakeaway}</p>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-muted-foreground">
                        Tip: Practice explaining this answer aloud in under 90 seconds!
                      </span>
                      <button
                        onClick={() => toggleMastered(q.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isMastered
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                        }`}
                      >
                        {isMastered ? '✓ Mastered' : 'Mark as Mastered'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
