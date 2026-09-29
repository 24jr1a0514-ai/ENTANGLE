import React, { useState } from 'react';
import type { GateType, PlacedGate } from '../../services/quantumSimulator';
import { Trash2, Plus, Minus, Play, RotateCcw } from 'lucide-react';

interface CircuitCanvasProps {
  numQubits: number;
  onNumQubitsChange: (n: number) => void;
  gates: PlacedGate[];
  onGatesChange: (gates: PlacedGate[]) => void;
  selectedGate: GateType | null;
  currentStep: number;
  onStepChange: (step: number) => void;
  maxSteps?: number;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  numQubits,
  onNumQubitsChange,
  gates,
  onGatesChange,
  selectedGate,
  currentStep,
  onStepChange,
  maxSteps = 8,
}) => {
  const [controlPending, setControlPending] = useState<{
    type: GateType;
    step: number;
    qubit: number;
  } | null>(null);

  const handleCellClick = (qubit: number, step: number) => {
    if (!selectedGate) return;

    // Check if there is already a gate at this location
    const existingGate = gates.find((g) => g.qubit === qubit && g.step === step);

    if (existingGate) {
      // Remove existing gate
      onGatesChange(gates.filter((g) => g.id !== existingGate.id));
      setControlPending(null);
      return;
    }

    if (['CX', 'CZ', 'SWAP'].includes(selectedGate)) {
      if (!controlPending) {
        // Step 1: select control qubit
        setControlPending({ type: selectedGate, step, qubit });
      } else {
        // Step 2: select target qubit on the same step
        if (controlPending.step === step && controlPending.qubit !== qubit) {
          const newGate: PlacedGate = {
            id: Math.random().toString(36).substring(2, 9),
            type: selectedGate,
            qubit: qubit, // target
            controlQubit: controlPending.qubit, // control
            step,
          };
          onGatesChange([...gates, newGate]);
          setControlPending(null);
        } else {
          setControlPending(null);
        }
      }
    } else {
      // Single qubit gate or measurement
      const newGate: PlacedGate = {
        id: Math.random().toString(36).substring(2, 9),
        type: selectedGate,
        qubit,
        step,
      };
      onGatesChange([...gates, newGate]);
      setControlPending(null);
    }
  };

  const handleRemoveGate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onGatesChange(gates.filter((g) => g.id !== id));
  };

  const handleClearCircuit = () => {
    onGatesChange([]);
    setControlPending(null);
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-card rounded-xl border border-border">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Qubit Wires:</span>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border">
            <button
              onClick={() => onNumQubitsChange(Math.max(1, numQubits - 1))}
              disabled={numQubits <= 1}
              className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-sm font-bold text-foreground">{numQubits}</span>
            <button
              onClick={() => onNumQubitsChange(Math.min(4, numQubits + 1))}
              disabled={numQubits >= 4}
              className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Scrubber */}
        <div className="flex items-center gap-3 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/60">
          <Play className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-semibold text-foreground">Step Execution:</span>
          <input
            type="range"
            min={0}
            max={maxSteps - 1}
            value={currentStep}
            onChange={(e) => onStepChange(parseInt(e.target.value))}
            className="w-32 accent-primary cursor-pointer"
          />
          <span className="text-xs font-mono text-primary font-bold">
            Step {currentStep} / {maxSteps - 1}
          </span>
        </div>

        <button
          onClick={handleClearCircuit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/30"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Circuit
        </button>
      </div>

      {controlPending && (
        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs text-indigo-400 flex items-center justify-between">
          <span>
            Select target qubit on <strong>Step {controlPending.step}</strong> for{' '}
            <strong>{controlPending.type}</strong> gate (Control set on |q{controlPending.qubit}⟩)
          </span>
          <button
            onClick={() => setControlPending(null)}
            className="underline text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Circuit Grid Canvas */}
      <div className="relative overflow-x-auto py-4 px-2">
        <div className="min-w-[650px] flex flex-col gap-6">
          {Array.from({ length: numQubits }).map((_, q) => (
            <div key={q} className="relative flex items-center h-12">
              {/* Qubit Wire Label */}
              <div className="w-16 font-mono text-sm font-semibold text-primary shrink-0 flex items-center gap-1">
                <span>|q{q}⟩</span>
                <span className="text-xs text-muted-foreground">= |0⟩</span>
              </div>

              {/* Wire Horizontal Line */}
              <div className="absolute left-16 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-border z-0" />

              {/* Step Grid Slots */}
              <div className="flex-1 grid grid-cols-8 gap-3 relative z-10 pl-2">
                {Array.from({ length: maxSteps }).map((_, s) => {
                  const gate = gates.find((g) => (g.qubit === q || g.controlQubit === q) && g.step === s);
                  const isControlStep = controlPending?.step === s && controlPending?.qubit === q;
                  const isStepActive = s === currentStep;

                  return (
                    <div
                      key={s}
                      onClick={() => handleCellClick(q, s)}
                      className={`
                        h-11 w-full rounded-lg flex items-center justify-center relative cursor-pointer border transition-all duration-150
                        ${isStepActive ? 'bg-primary/10 border-primary/40' : 'bg-card/80 border-border/40 hover:border-primary/60 hover:bg-muted/30'}
                        ${isControlStep ? 'ring-2 ring-indigo-500 animate-pulse' : ''}
                      `}
                    >
                      {/* Gate rendering inside cell */}
                      {gate && (
                        <div className="group relative w-full h-full flex items-center justify-center">
                          {/* If this qubit is the control qubit for CX/CZ/SWAP */}
                          {gate.controlQubit === q ? (
                            <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-background shadow-md" />
                          ) : (
                            /* Target Qubit Gate */
                            <div
                              className={`
                                w-9 h-9 rounded-md flex items-center justify-center font-mono font-bold text-xs shadow-md border
                                ${
                                  gate.type === 'CX'
                                    ? 'bg-indigo-600 text-white border-indigo-400'
                                    : gate.type === 'H'
                                    ? 'bg-blue-600 text-white border-blue-400'
                                    : gate.type === 'X'
                                    ? 'bg-rose-600 text-white border-rose-400'
                                    : gate.type === 'Z'
                                    ? 'bg-purple-600 text-white border-purple-400'
                                    : gate.type === 'M'
                                    ? 'bg-zinc-700 text-white border-zinc-500'
                                    : 'bg-teal-600 text-white border-teal-400'
                                }
                              `}
                            >
                              {gate.type === 'CX' ? '⊕' : gate.type}
                            </div>
                          )}

                          {/* Trash overlay button */}
                          <button
                            onClick={(e) => handleRemoveGate(gate.id, e)}
                            className="absolute -top-1 -right-1 hidden group-hover:flex w-4 h-4 rounded-full bg-destructive text-white items-center justify-center p-0.5 shadow"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
