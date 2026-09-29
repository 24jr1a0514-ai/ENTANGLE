import { useState } from 'react';
import type { CodeExecutionResult } from '../services/qasmInterpreter';
import { parseAndExecuteQuantumCode } from '../services/qasmInterpreter';
import { CODING_CHALLENGES } from '../data/codingChallenges';
import type { CodingChallenge } from '../data/codingChallenges';
import { CodeEditor } from '../components/coding/CodeEditor';
import { TerminalOutput } from '../components/coding/TerminalOutput';
import { BlochSphere } from '../components/quantum/BlochSphere';
import { StateVisualizer } from '../components/quantum/StateVisualizer';
import { useAuth } from '../contexts/AuthContext';

import {
  Code2,
  Award,
  Terminal,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export default function CodingSandboxPage() {
  const {} = useAuth();

  const [activeTab, setActiveTab] = useState<'practice' | 'sandbox'>('practice');
  const [language, setLanguage] = useState<'qiskit' | 'qasm'>('qiskit');

  // Selected coding practice challenge
  const [activeChallenge, setActiveChallenge] = useState<CodingChallenge>(CODING_CHALLENGES[0]);
  const [code, setCode] = useState<string>(CODING_CHALLENGES[0].starterQiskit);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Execution & Test Results
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [testPassed, setTestPassed] = useState<boolean | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [editorKey, setEditorKey] = useState<number>(0);

  // Handle Switch Practice Challenge
  const handleSelectChallenge = (ch: CodingChallenge) => {
    setActiveChallenge(ch);
    setCode(language === 'qiskit' ? ch.starterQiskit : ch.starterQasm);
    setShowHint(false);
    setExecutionResult(null);
    setTestPassed(null);
  };

  // Handle Language Change
  const handleLanguageChange = (lang: string) => {
    if (lang !== 'qiskit' && lang !== 'qasm') return;
    setLanguage(lang as 'qiskit' | 'qasm');
    if (activeTab === 'practice' && activeChallenge) {
      setCode(lang === 'qiskit' ? activeChallenge.starterQiskit : activeChallenge.starterQasm);
    }
  };

  // Run Code Execution & Validate Challenge
  const handleRunExecution = () => {
    const res = parseAndExecuteQuantumCode(code, language);
    setExecutionResult(res);

    if (activeTab === 'practice' && activeChallenge && res.success && res.circuitState) {
      const isCorrect = activeChallenge.validateSolution(res.circuitState.probabilities);
      setTestPassed(isCorrect);

      if (isCorrect && !completedChallenges.includes(activeChallenge.id)) {
        setCompletedChallenges((prev) => [...prev, activeChallenge.id]);
      }
    } else {
      setTestPassed(null);
    }
  };

  const handleResetCode = () => {
    if (activeTab === 'practice' && activeChallenge) {
      setCode(language === 'qiskit' ? activeChallenge.starterQiskit : activeChallenge.starterQasm);
    } else {
      setCode('');
    }
    setExecutionResult(null);
    setTestPassed(null);
    setEditorKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-card rounded-2xl border border-primary/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Code2 className="w-7 h-7 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Quantum Coding Practice & Sandbox
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Write Python Qiskit and OpenQASM 2.0 quantum programs, execute statevector simulations, and solve interactive coding problems.
          </p>
        </div>

        {/* Quick Mode Stats */}
        <div className="flex items-center gap-3 bg-secondary/80 px-4 py-2 rounded-xl border border-border">
          <Award className="w-5 h-5 text-amber-500" />
          <div className="text-xs">
            <div className="text-muted-foreground">Practice Solved</div>
            <div className="font-bold text-foreground">
              {completedChallenges.length} / {CODING_CHALLENGES.length} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('practice')}
          className={`pb-3 px-1 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'practice'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          Practice Coding Exercises ({CODING_CHALLENGES.length})
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`pb-3 px-1 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'sandbox'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Freeform Coding Sandbox
        </button>
      </div>

      {/* MODE 1: PRACTICE EXERCISES */}
      {activeTab === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Practice Problems Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Select Problem
            </h3>
            <div className="space-y-2.5">
              {CODING_CHALLENGES.map((ch) => {
                const isActive = activeChallenge.id === ch.id;
                const isDone = completedChallenges.includes(ch.id);

                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChallenge(ch)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-primary/10 border-primary shadow-md'
                        : 'bg-card border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {ch.category}
                      </span>

                    </div>
                    <div className="font-bold text-sm text-foreground flex items-center justify-between">
                      <span>{ch.title}</span>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{ch.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center & Right Column: Problem Workspace */}
          <div className="lg:col-span-2 space-y-5">
            {/* Active Problem Description */}
            <div className="p-5 bg-card rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-primary uppercase">{activeChallenge.category}</span>
                  <h2 className="text-lg font-bold text-foreground">{activeChallenge.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Hint'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">{activeChallenge.description}</p>

              {/* Instructions checklist */}
              <div className="space-y-1 bg-muted/30 p-3 rounded-lg border border-border/50 text-xs">
                <div className="font-semibold text-foreground mb-1">Instructions:</div>
                {activeChallenge.instructions.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{inst}</span>
                  </div>
                ))}
              </div>

              {showHint && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                  💡 <strong>Hint:</strong> {activeChallenge.hint}
                </div>
              )}
            </div>

            {/* Code Editor */}
            <CodeEditor
              key={`practice-editor-${activeChallenge.id}-${editorKey}`}
              code={code}
              onCodeChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRunCode={handleRunExecution}
              onResetCode={handleResetCode}
            />

            {/* Execution & Test Terminal */}
            <TerminalOutput
              result={executionResult}
              testPassed={testPassed}
            />

            {/* Qubit Bloch Spheres if execution result active */}
            {executionResult?.circuitState && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Execution Bloch Spheres
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {executionResult.circuitState.blochSpheres.map((bloch, q) => (
                    <BlochSphere key={q} qubitIndex={q} bloch={bloch} size={180} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: FREEFORM CODING SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <CodeEditor
              key={`sandbox-editor-${editorKey}`}
              code={code}
              onCodeChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRunCode={handleRunExecution}
              onResetCode={handleResetCode}
            />

            {/* Terminal Output & Circuit Diagram */}
            <TerminalOutput result={executionResult} />
          </div>

          {/* Quantum State Visualizer Table & Histogram */}
          {executionResult?.circuitState && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Statevector Amplitudes & Probabilities
              </h3>
              <StateVisualizer state={executionResult.circuitState} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
