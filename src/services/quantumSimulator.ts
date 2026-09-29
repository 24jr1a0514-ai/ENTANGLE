export interface Complex {
  re: number;
  im: number;
}

export function complex(re: number, im: number = 0): Complex {
  return { re, im };
}

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function multiply(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function normSq(c: Complex): number {
  return c.re * c.re + c.im * c.im;
}

export function formatComplex(c: Complex): string {
  if (Math.abs(c.re) < 1e-6 && Math.abs(c.im) < 1e-6) return "0";
  const reStr = Math.abs(c.re) >= 1e-6 ? c.re.toFixed(3) : "";
  const imAbs = Math.abs(c.im).toFixed(3);
  if (Math.abs(c.im) < 1e-6) return reStr;
  if (!reStr) {
    return c.im < 0 ? `-${imAbs}i` : `${imAbs}i`;
  }
  return c.im < 0 ? `${reStr} - ${imAbs}i` : `${reStr} + ${imAbs}i`;
}

export type GateType = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CX' | 'CZ' | 'SWAP' | 'M';

export interface PlacedGate {
  id: string;
  type: GateType;
  qubit: number; // primary target qubit wire
  controlQubit?: number; // control qubit for CX/CZ/SWAP
  step: number; // column index on circuit grid
}

export interface QubitBlochState {
  x: number;
  y: number;
  z: number;
  theta: number;
  phi: number;
  prob1: number;
}

const INV_SQRT2 = 1 / Math.SQRT2;

// Gate 2x2 Matrices
export const GATES_2X2: Record<string, Complex[][]> = {
  H: [
    [complex(INV_SQRT2), complex(INV_SQRT2)],
    [complex(INV_SQRT2), complex(-INV_SQRT2)],
  ],
  X: [
    [complex(0), complex(1)],
    [complex(1), complex(0)],
  ],
  Y: [
    [complex(0), complex(0, -1)],
    [complex(0, 1), complex(0)],
  ],
  Z: [
    [complex(1), complex(0)],
    [complex(0), complex(-1)],
  ],
  S: [
    [complex(1), complex(0)],
    [complex(0), complex(0, 1)],
  ],
  T: [
    [complex(1), complex(0)],
    [complex(0), complex(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))],
  ],
};

export interface CircuitState {
  numQubits: number;
  stateVector: Complex[];
  probabilities: number[];
  blochSpheres: QubitBlochState[];
  measurements: Record<number, number>; // qubit -> measured bit (0 or 1)
}

// Compute n-qubit initial state |00...0>
export function getInitialStateVector(numQubits: number): Complex[] {
  const dim = 1 << numQubits;
  const sv: Complex[] = new Array(dim).fill(null).map(() => complex(0, 0));
  sv[0] = complex(1, 0);
  return sv;
}

// Apply single qubit 2x2 matrix to target qubit in n-qubit statevector
export function applySingleQubitGate(
  sv: Complex[],
  numQubits: number,
  targetQubit: number,
  gateMatrix: Complex[][]
): Complex[] {
  const dim = 1 << numQubits;
  const newSv: Complex[] = new Array(dim).fill(null).map(() => complex(0, 0));

  const targetBit = numQubits - 1 - targetQubit;

  for (let i = 0; i < dim; i++) {
    const bitVal = (i >> targetBit) & 1;
    const pairIndex = i ^ (1 << targetBit);

    if (bitVal === 0) {
      // i is the |0> state for target bit, pairIndex is |1> state
      const v0 = sv[i];
      const v1 = sv[pairIndex];

      const res0 = add(multiply(gateMatrix[0][0], v0), multiply(gateMatrix[0][1], v1));
      const res1 = add(multiply(gateMatrix[1][0], v0), multiply(gateMatrix[1][1], v1));

      newSv[i] = res0;
      newSv[pairIndex] = res1;
    }
  }

  return newSv;
}

// Apply CNOT (CX) or Controlled-Z (CZ)
export function applyControlledGate(
  sv: Complex[],
  numQubits: number,
  controlQubit: number,
  targetQubit: number,
  type: 'CX' | 'CZ'
): Complex[] {
  const dim = 1 << numQubits;
  const newSv: Complex[] = [...sv.map((c) => ({ ...c }))];

  const controlBit = numQubits - 1 - controlQubit;
  const targetBit = numQubits - 1 - targetQubit;

  for (let i = 0; i < dim; i++) {
    const ctrlVal = (i >> controlBit) & 1;
    if (ctrlVal === 1) {
      if (type === 'CX') {
        const tgtVal = (i >> targetBit) & 1;
        if (tgtVal === 0) {
          const pairIndex = i | (1 << targetBit);
          const temp = newSv[i];
          newSv[i] = newSv[pairIndex];
          newSv[pairIndex] = temp;
        }
      } else if (type === 'CZ') {
        const tgtVal = (i >> targetBit) & 1;
        if (tgtVal === 1) {
          newSv[i] = multiply(newSv[i], complex(-1, 0));
        }
      }
    }
  }

  return newSv;
}

// Apply SWAP gate between 2 qubits
export function applySwapGate(
  sv: Complex[],
  numQubits: number,
  q1: number,
  q2: number
): Complex[] {
  const dim = 1 << numQubits;
  const newSv: Complex[] = [...sv.map((c) => ({ ...c }))];

  const bit1 = numQubits - 1 - q1;
  const bit2 = numQubits - 1 - q2;

  for (let i = 0; i < dim; i++) {
    const v1 = (i >> bit1) & 1;
    const v2 = (i >> bit2) & 1;
    if (v1 !== v2 && v1 === 1) {
      // Swap bits in basis state index
      const swappedIndex = (i ^ (1 << bit1)) ^ (1 << bit2);
      const temp = newSv[i];
      newSv[i] = newSv[swappedIndex];
      newSv[swappedIndex] = temp;
    }
  }

  return newSv;
}

// Calculate Bloch Sphere coordinates (x, y, z) for specified qubit from state vector
export function getQubitBlochState(
  sv: Complex[],
  numQubits: number,
  qubitIndex: number
): QubitBlochState {
  const dim = 1 << numQubits;
  const targetBit = numQubits - 1 - qubitIndex;

  let rho00 = 0;
  let rho11 = 0;
  let rho01 = complex(0, 0);

  for (let i = 0; i < dim; i++) {
    const bitVal = (i >> targetBit) & 1;
    const p = normSq(sv[i]);

    if (bitVal === 0) {
      rho00 += p;
      const pairIndex = i | (1 << targetBit);
      // rho01 += c0 * c1*
      const c0 = sv[i];
      const c1Conj = complex(sv[pairIndex].re, -sv[pairIndex].im);
      rho01 = add(rho01, multiply(c0, c1Conj));
    } else {
      rho11 += p;
    }
  }

  const x = 2 * rho01.re;
  const y = 2 * rho01.im;
  const z = rho00 - rho11;

  const theta = Math.acos(Math.max(-1, Math.min(1, z)));
  const phi = Math.atan2(y, x);

  return {
    x: Math.max(-1, Math.min(1, x)),
    y: Math.max(-1, Math.min(1, y)),
    z: Math.max(-1, Math.min(1, z)),
    theta,
    phi: phi < 0 ? phi + 2 * Math.PI : phi,
    prob1: rho11,
  };
}

// Simulate full circuit execution up to maxStep
export function simulateCircuit(
  numQubits: number,
  gates: PlacedGate[],
  maxStep?: number
): CircuitState {
  let sv = getInitialStateVector(numQubits);

  const sortedGates = [...gates]
    .filter((g) => maxStep === undefined || g.step <= maxStep)
    .sort((a, b) => a.step - b.step);

  const measurements: Record<number, number> = {};

  for (const gate of sortedGates) {
    if (gate.type in GATES_2X2) {
      sv = applySingleQubitGate(sv, numQubits, gate.qubit, GATES_2X2[gate.type]);
    } else if (gate.type === 'CX' && gate.controlQubit !== undefined) {
      sv = applyControlledGate(sv, numQubits, gate.controlQubit, gate.qubit, 'CX');
    } else if (gate.type === 'CZ' && gate.controlQubit !== undefined) {
      sv = applyControlledGate(sv, numQubits, gate.controlQubit, gate.qubit, 'CZ');
    } else if (gate.type === 'SWAP' && gate.controlQubit !== undefined) {
      sv = applySwapGate(sv, numQubits, gate.qubit, gate.controlQubit);
    } else if (gate.type === 'M') {
      // Record probability of target qubit
      const bloch = getQubitBlochState(sv, numQubits, gate.qubit);
      measurements[gate.qubit] = bloch.prob1 > 0.5 ? 1 : 0;
    }
  }

  const probabilities = sv.map((c) => normSq(c));

  const blochSpheres = Array.from({ length: numQubits }, (_, q) =>
    getQubitBlochState(sv, numQubits, q)
  );

  return {
    numQubits,
    stateVector: sv,
    probabilities,
    blochSpheres,
    measurements,
  };
}

// Run shots (e.g. 1000 runs) sampled according to probabilities
export function runShots(
  numQubits: number,
  probabilities: number[],
  numShots: number = 1000
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (let i = 0; i < numShots; i++) {
    const r = Math.random();
    let cumulative = 0;
    let selectedState = 0;

    for (let s = 0; s < probabilities.length; s++) {
      cumulative += probabilities[s];
      if (r <= cumulative) {
        selectedState = s;
        break;
      }
    }

    const stateKey = selectedState.toString(2).padStart(numQubits, '0');
    counts[stateKey] = (counts[stateKey] || 0) + 1;
  }

  return counts;
}

// Code Exporters
export function generateQiskitCode(numQubits: number, gates: PlacedGate[]): string {
  const lines = [
    'from qiskit import QuantumCircuit',
    'import numpy as np',
    '',
    `# Initialize a ${numQubits}-qubit quantum circuit`,
    `qc = QuantumCircuit(${numQubits}, ${numQubits})`,
    '',
  ];

  const sortedGates = [...gates].sort((a, b) => a.step - b.step);

  for (const g of sortedGates) {
    switch (g.type) {
      case 'H':
        lines.push(`qc.h(${g.qubit})`);
        break;
      case 'X':
        lines.push(`qc.x(${g.qubit})`);
        break;
      case 'Y':
        lines.push(`qc.y(${g.qubit})`);
        break;
      case 'Z':
        lines.push(`qc.z(${g.qubit})`);
        break;
      case 'S':
        lines.push(`qc.s(${g.qubit})`);
        break;
      case 'T':
        lines.push(`qc.t(${g.qubit})`);
        break;
      case 'CX':
        if (g.controlQubit !== undefined) {
          lines.push(`qc.cx(${g.controlQubit}, ${g.qubit})`);
        }
        break;
      case 'CZ':
        if (g.controlQubit !== undefined) {
          lines.push(`qc.cz(${g.controlQubit}, ${g.qubit})`);
        }
        break;
      case 'SWAP':
        if (g.controlQubit !== undefined) {
          lines.push(`qc.swap(${g.qubit}, ${g.controlQubit})`);
        }
        break;
      case 'M':
        lines.push(`qc.measure(${g.qubit}, ${g.qubit})`);
        break;
    }
  }

  lines.push('');
  lines.push('# Print circuit representation');
  lines.push('print(qc)');

  return lines.join('\n');
}

export function generateOpenQasmCode(numQubits: number, gates: PlacedGate[]): string {
  const lines = [
    'OPENQASM 2.0;',
    'include "qelib1.inc";',
    '',
    `qreg q[${numQubits}];`,
    `creg c[${numQubits}];`,
    '',
  ];

  const sortedGates = [...gates].sort((a, b) => a.step - b.step);

  for (const g of sortedGates) {
    switch (g.type) {
      case 'H':
        lines.push(`h q[${g.qubit}];`);
        break;
      case 'X':
        lines.push(`x q[${g.qubit}];`);
        break;
      case 'Y':
        lines.push(`y q[${g.qubit}];`);
        break;
      case 'Z':
        lines.push(`z q[${g.qubit}];`);
        break;
      case 'S':
        lines.push(`s q[${g.qubit}];`);
        break;
      case 'T':
        lines.push(`t q[${g.qubit}];`);
        break;
      case 'CX':
        if (g.controlQubit !== undefined) {
          lines.push(`cx q[${g.controlQubit}], q[${g.qubit}];`);
        }
        break;
      case 'CZ':
        if (g.controlQubit !== undefined) {
          lines.push(`cz q[${g.controlQubit}], q[${g.qubit}];`);
        }
        break;
      case 'SWAP':
        if (g.controlQubit !== undefined) {
          lines.push(`swap q[${g.qubit}], q[${g.controlQubit}];`);
        }
        break;
      case 'M':
        lines.push(`measure q[${g.qubit}] -> c[${g.qubit}];`);
        break;
    }
  }

  return lines.join('\n');
}
