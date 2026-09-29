import { useState, useMemo } from 'react';
import type { GateType, PlacedGate } from '../services/quantumSimulator';
import {
  simulateCircuit,
  generateQiskitCode,
  generateOpenQasmCode,
} from '../services/quantumSimulator';
import { QUANTUM_CHALLENGES, PRESET_CIRCUITS } from '../data/quantumChallenges';
import type { Challenge, PresetCircuit } from '../data/quantumChallenges';
import { GatePalette } from '../components/quantum/GatePalette';
import { CircuitCanvas } from '../components/quantum/CircuitCanvas';
import { BlochSphere } from '../components/quantum/BlochSphere';
import { StateVisualizer } from '../components/quantum/StateVisualizer';
import { useAuth } from '../contexts/AuthContext';

import {
  Beaker,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Code,
  Sparkles,
  Layers,
  Award,
  ArrowRight,
  ListOrdered,
  Zap,
} from 'lucide-react';

export default function QuantumLabPage() {
  const {} = useAuth();

  const [activeTab, setActiveTab] = useState<'sandbox' | 'challenges' | 'code'>('challenges');

  // Circuit state
  const [numQubits, setNumQubits] = useState<number>(2);
  const [gates, setGates] = useState<PlacedGate[]>([
    { id: '1', type: 'H', qubit: 0, step: 0 },
    { id: '2', type: 'CX', qubit: 1, controlQubit: 0, step: 1 },
  ]);
  const [selectedGate, setSelectedGate] = useState<GateType | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(7);

  // Practice Mode state
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Run quantum simulation
  const circuitState = useMemo(() => {
    return simulateCircuit(numQubits, gates, currentStep);
  }, [numQubits, gates, currentStep]);

  // Handle Load Preset
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_CIRCUITS.find((p: PresetCircuit) => p.id === presetId);
    if (preset) {
      setNumQubits(preset.numQubits);
      setGates(preset.gates);
      setActiveChallenge(null);
    }
  };

  // Handle Select Challenge
  const handleSelectChallenge = (ch: Challenge) => {
    setActiveChallenge(ch);
    setNumQubits(ch.numQubits);
    setGates(ch.initialGates || []);
    setShowHint(false);
    setChallengeCompleted(false);
    setActiveTab('sandbox');
  };

  // Check Challenge Solution
  const handleValidateChallenge = () => {
    if (!activeChallenge) return;
    const isCorrect = activeChallenge.validateProbabilities(circuitState.probabilities);
    if (isCorrect) {
      setChallengeCompleted(true);
    } else {
      alert("Circuit output doesn't match the target state yet! Check the step-by-step guide or hint.");
    }
  };

  const qiskitCode = useMemo(() => generateQiskitCode(numQubits, gates), [numQubits, gates]);
  const openQasmCode = useMemo(() => generateOpenQasmCode(numQubits, gates), [numQubits, gates]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-card rounded-2xl border border-primary/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight quantum-text-gradient">
              Interactive Quantum Circuit Lab
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
              Lab Simulator 2.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Build, simulate, and practice quantum circuits in real-time with 3D Bloch sphere visualization.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-secondary p-1.5 rounded-xl border border-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'challenges'
                ? 'bg-primary text-primary-foreground font-bold shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award className="w-4 h-4" /> Practice Challenges
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'sandbox'
                ? 'bg-primary text-primary-foreground font-bold shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Beaker className="w-4 h-4" /> Circuit Workbench
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'code'
                ? 'bg-primary text-primary-foreground font-bold shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="w-4 h-4" /> Qiskit & QASM Code
          </button>
        </div>
      </div>

      {/* TAB 1: PRACTICE CHALLENGES LIST */}
      {activeTab === 'challenges' && (
        <div className="space-y-6 animate-in fade-in">
          {/* STEP-BY-STEP PRACTICE GUIDE BANNER */}
          <div className="p-6 bg-gradient-to-r from-purple-950/70 via-card to-blue-950/60 rounded-3xl border border-primary/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-foreground tracking-wide">
                4-Step Circuit Practice Guide
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-secondary/80 rounded-2xl border border-border space-y-1">
                <span className="font-bold text-primary">Step 1</span>
                <p className="font-semibold text-foreground">Pick a Challenge</p>
                <p className="text-muted-foreground text-[11px]">Select a topic challenge below (Superposition, Bell State, GHZ).</p>
              </div>

              <div className="p-3 bg-secondary/80 rounded-2xl border border-border space-y-1">
                <span className="font-bold text-primary">Step 2</span>
                <p className="font-semibold text-foreground">Follow Guided Steps</p>
                <p className="text-muted-foreground text-[11px]">Follow step-by-step instructions to place H, X, or CNOT gates.</p>
              </div>

              <div className="p-3 bg-secondary/80 rounded-2xl border border-border space-y-1">
                <span className="font-bold text-primary">Step 3</span>
                <p className="font-semibold text-foreground">Monitor 3D State</p>
                <p className="text-muted-foreground text-[11px]">Watch 3D Bloch sphere vector rotations & statevector table in real-time.</p>
              </div>

              <div className="p-3 bg-secondary/80 rounded-2xl border border-border space-y-1">
                <span className="font-bold text-primary">Step 4</span>
                <p className="font-semibold text-foreground">Validate</p>
                <p className="text-muted-foreground text-[11px]">Click "Validate Solution" to verify probabilities!</p>
              </div>
            </div>
          </div>

          {/* Preset Circuits & Practice Challenges Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Available Quantum Practice Challenges
              </h2>
              <span className="text-xs text-muted-foreground">{QUANTUM_CHALLENGES.length} Active Challenges</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUANTUM_CHALLENGES.map((ch) => (
                <div
                  key={ch.id}
                  className="p-5 bg-card border border-border hover:border-primary/50 rounded-3xl transition-all flex flex-col justify-between space-y-4 shadow-md group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                        {ch.category} • {ch.difficulty}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Validate
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ch.description}
                    </p>

                    <div className="p-2.5 bg-muted/40 rounded-xl text-xs font-mono text-foreground/90 border border-border/40">
                      🎯 Target: {ch.targetDescription}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectChallenge(ch)}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                  >
                    Start Step-by-Step Practice <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Load Presets */}
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Or Load Preset Circuit Architecture
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRESET_CIRCUITS.map((p: PresetCircuit) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      handleLoadPreset(p.id);
                      setActiveTab('sandbox');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-muted text-secondary-foreground text-xs font-semibold border border-border transition-colors flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-primary" /> {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CIRCUIT WORKBENCH & SIMULATOR */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6 animate-in fade-in">
          {/* STEP-BY-STEP PRACTICE GUIDE PANEL */}
          {activeChallenge && (
            <div className="p-5 bg-gradient-to-r from-purple-950/80 via-card to-blue-950/70 rounded-3xl border border-primary/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-foreground tracking-wide">
                    Step-by-Step Guide: {activeChallenge.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                  💡 <strong>Hint:</strong> {activeChallenge.hint}
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-2 pt-1">
                {activeChallenge.steps.map((stepText, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-foreground/90 bg-muted/40 p-2.5 rounded-xl border border-border/50">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
                      {sIdx + 1}
                    </span>
                    <span className="leading-tight pt-0.5">{stepText}</span>
                  </div>
                ))}
              </div>

              {/* Challenge Completion Banner */}
              {challengeCompleted ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-between">
                  <p className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Challenge Completed!
                  </p>
                  <button
                    onClick={() => setActiveTab('challenges')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs"
                  >
                    Next Challenge →
                  </button>
                </div>
              ) : (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleValidateChallenge}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Validate Solution
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Workbench Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Gate Palette Sidebar */}
            <div className="lg:col-span-1 bg-card border border-border p-4 rounded-3xl shadow-sm space-y-4">
              <GatePalette
                selectedGate={selectedGate}
                onSelectGate={setSelectedGate}
              />
            </div>

            {/* Circuit Wire Canvas */}
            <div className="lg:col-span-3 bg-card border border-border p-5 rounded-3xl shadow-sm space-y-6">
              <CircuitCanvas
                numQubits={numQubits}
                onNumQubitsChange={setNumQubits}
                gates={gates}
                onGatesChange={setGates}
                selectedGate={selectedGate}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
              />

              {/* 3D Bloch Sphere & Statevector Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                <BlochSphere qubitIndex={0} bloch={circuitState.blochSpheres[0]} />
                <StateVisualizer state={circuitState} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QISKIT & OPENQASM CODE EXPORTER */}
      {activeTab === 'code' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Qiskit Code Block */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Code className="w-4 h-4" /> Qiskit Python Script
                </span>
                <button
                  onClick={() => copyToClipboard(qiskitCode, 'qiskit')}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-secondary hover:bg-muted border border-border transition-colors font-semibold"
                >
                  {copiedCode === 'qiskit' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === 'qiskit' ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              <div className="p-4 bg-[#0d1117] rounded-2xl border border-border/60 overflow-x-auto">
                <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
                  <code>{qiskitCode}</code>
                </pre>
              </div>
            </div>

            {/* OpenQASM 2.0 Code Block */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <Code className="w-4 h-4" /> OpenQASM 2.0 Specification
                </span>
                <button
                  onClick={() => copyToClipboard(openQasmCode, 'qasm')}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-secondary hover:bg-muted border border-border transition-colors font-semibold"
                >
                  {copiedCode === 'qasm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === 'qasm' ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              <div className="p-4 bg-[#0d1117] rounded-2xl border border-border/60 overflow-x-auto">
                <pre className="text-xs font-mono text-purple-300 leading-relaxed">
                  <code>{openQasmCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
