import React, { useState } from 'react';
import type { GateType } from '../../services/quantumSimulator';
import { Info } from 'lucide-react';

interface GatePaletteProps {
  selectedGate: GateType | null;
  onSelectGate: (gate: GateType | null) => void;
}

interface GateDef {
  type: GateType;
  label: string;
  name: string;
  category: 'single' | 'control' | 'measure';
  color: string;
  borderColor: string;
  matrix: string;
  description: string;
}

const GATE_DEFS: GateDef[] = [
  {
    type: 'H',
    label: 'H',
    name: 'Hadamard Gate',
    category: 'single',
    color: 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30',
    borderColor: 'border-blue-500/50',
    matrix: '1/√2 [[1, 1], [1, -1]]',
    description: 'Creates equal superposition between |0⟩ and |1⟩.',
  },
  {
    type: 'X',
    label: 'X',
    name: 'Pauli-X (NOT)',
    category: 'single',
    color: 'bg-rose-600/20 text-rose-400 hover:bg-rose-600/30',
    borderColor: 'border-rose-500/50',
    matrix: '[[0, 1], [1, 0]]',
    description: 'Flips qubit state |0⟩ ↔ |1⟩ (Quantum NOT).',
  },
  {
    type: 'Y',
    label: 'Y',
    name: 'Pauli-Y Gate',
    category: 'single',
    color: 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30',
    borderColor: 'border-emerald-500/50',
    matrix: '[[0, -i], [i, 0]]',
    description: 'Bit and phase flip around Y axis of Bloch sphere.',
  },
  {
    type: 'Z',
    label: 'Z',
    name: 'Pauli-Z Gate',
    category: 'single',
    color: 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30',
    borderColor: 'border-purple-500/50',
    matrix: '[[1, 0], [0, -1]]',
    description: 'Flips the phase of state |1⟩ by π (180°).',
  },
  {
    type: 'S',
    label: 'S',
    name: 'Phase (π/2) Gate',
    category: 'single',
    color: 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30',
    borderColor: 'border-amber-500/50',
    matrix: '[[1, 0], [0, i]]',
    description: 'Rotates phase of state |1⟩ by 90° (sqrt of Z).',
  },
  {
    type: 'T',
    label: 'T',
    name: 'π/4 Phase Gate',
    category: 'single',
    color: 'bg-teal-600/20 text-teal-400 hover:bg-teal-600/30',
    borderColor: 'border-teal-500/50',
    matrix: '[[1, 0], [0, e^(iπ/4)]]',
    description: 'Rotates phase of state |1⟩ by 45° (sqrt of S).',
  },
  {
    type: 'CX',
    label: 'CNOT',
    name: 'Controlled-NOT',
    category: 'control',
    color: 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30',
    borderColor: 'border-indigo-500/50',
    matrix: 'Controlled X',
    description: 'Flips target qubit if control qubit is in state |1⟩. Creates entanglement!',
  },
  {
    type: 'CZ',
    label: 'CZ',
    name: 'Controlled-Z',
    category: 'control',
    color: 'bg-violet-600/20 text-violet-400 hover:bg-violet-600/30',
    borderColor: 'border-violet-500/50',
    matrix: 'Controlled Z',
    description: 'Flips phase of |11⟩ state by π.',
  },
  {
    type: 'SWAP',
    label: 'SWAP',
    name: 'Swap Gate',
    category: 'control',
    color: 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30',
    borderColor: 'border-cyan-500/50',
    matrix: 'Swap Qubit States',
    description: 'Exchanges quantum states between two qubits.',
  },
  {
    type: 'M',
    label: 'M',
    name: 'Measurement',
    category: 'measure',
    color: 'bg-zinc-700/40 text-zinc-200 hover:bg-zinc-700/60',
    borderColor: 'border-zinc-500/50',
    matrix: 'Computational Basis',
    description: 'Collapses qubit superposition into classical bit 0 or 1.',
  },
];

export const GatePalette: React.FC<GatePaletteProps> = ({
  selectedGate,
  onSelectGate,
}) => {
  const [hoveredGate, setHoveredGate] = useState<GateDef | null>(null);

  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Quantum Gate Palette
        </h3>
        {selectedGate && (
          <button
            onClick={() => onSelectGate(null)}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Deselect Gate
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Click a gate to select, then click on any wire slot in the circuit board to place it.
      </p>

      {/* Gate Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {GATE_DEFS.map((gate) => {
          const isSelected = selectedGate === gate.type;
          return (
            <button
              key={gate.type}
              onClick={() => onSelectGate(isSelected ? null : gate.type)}
              onMouseEnter={() => setHoveredGate(gate)}
              onMouseLeave={() => setHoveredGate(null)}
              className={`
                h-11 flex flex-col items-center justify-center rounded-lg border font-mono font-bold text-sm transition-all duration-200 relative
                ${gate.color} ${gate.borderColor}
                ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-md shadow-primary/20' : ''}
              `}
            >
              <span>{gate.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hover Info Tooltip Panel */}
      {hoveredGate && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30 border border-border/60 text-xs animate-in fade-in duration-150">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-semibold text-foreground flex items-center gap-2">
              <span>{hoveredGate.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {hoveredGate.matrix}
              </span>
            </div>
            <p className="text-muted-foreground">{hoveredGate.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
