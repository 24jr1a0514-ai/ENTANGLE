import type { PlacedGate } from '../services/quantumSimulator';

export interface Challenge {
  id: string;
  title: string;
  category: 'Basics' | 'Entanglement' | 'Algorithms' | 'Phase';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  numQubits: number;
  targetDescription: string;
  hint: string;
  steps: string[];
  initialGates?: PlacedGate[];
  validateProbabilities: (probabilities: number[]) => boolean;
}

export interface PresetCircuit {
  id: string;
  name: string;
  numQubits: number;
  gates: PlacedGate[];
}

export const PRESET_CIRCUITS: PresetCircuit[] = [
  {
    id: 'bell-state-preset',
    name: 'Bell State (|Φ⁺⟩)',
    numQubits: 2,
    gates: [
      { id: 'p1', type: 'H', qubit: 0, step: 0 },
      { id: 'p2', type: 'CX', qubit: 1, controlQubit: 0, step: 1 }
    ]
  },
  {
    id: 'ghz-state-preset',
    name: '3-Qubit GHZ State',
    numQubits: 3,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, step: 0 },
      { id: 'g2', type: 'CX', qubit: 1, controlQubit: 0, step: 1 },
      { id: 'g3', type: 'CX', qubit: 2, controlQubit: 1, step: 2 }
    ]
  },
  {
    id: 'quantum-teleportation-preset',
    name: 'Quantum Teleportation Circuit',
    numQubits: 3,
    gates: [
      { id: 't1', type: 'H', qubit: 1, step: 0 },
      { id: 't2', type: 'CX', qubit: 2, controlQubit: 1, step: 1 },
      { id: 't3', type: 'CX', qubit: 1, controlQubit: 0, step: 2 },
      { id: 't4', type: 'H', qubit: 0, step: 3 }
    ]
  }
];

export const QUANTUM_CHALLENGES: Challenge[] = [
  // 1
  {
    id: 'superposition-101',
    title: '1. Create Superposition (|v⟩ = (|0⟩ + |1⟩)/√2)',
    category: 'Basics',
    difficulty: 'Beginner',
    numQubits: 1,
    description: 'Transform a single qubit from ground state |0⟩ into equal superposition state |+⟩.',
    targetDescription: 'P(|0⟩) = 50%, P(|1⟩) = 50%',
    hint: 'Apply a single Hadamard (H) gate to qubit q₀.',
    steps: [
      'Select the Hadamard (H) gate from the Single-Qubit Gates palette.',
      'Place the H gate on Qubit Wire 0 at Step 0.',
      'Observe the 3D Bloch sphere vector shift to the equator (+X axis).',
      'Click "Validate Solution" to verify P(|0⟩)=50% and P(|1⟩)=50%!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 2 && Math.abs(probs[0] - 0.5) < 1e-3 && Math.abs(probs[1] - 0.5) < 1e-3,
  },
  // 2
  {
    id: 'bit-flip-x',
    title: '2. Qubit Bit Flip (|0⟩ → |1⟩)',
    category: 'Basics',
    difficulty: 'Beginner',
    numQubits: 1,
    description: 'Flip the qubit state from |0⟩ to state |1⟩ using a single quantum logic gate.',
    targetDescription: 'P(|1⟩) = 100%',
    hint: 'Use the Pauli-X (X) gate, which acts as the quantum NOT gate.',
    steps: [
      'Select the Pauli-X (X) gate from the Single-Qubit Gates palette.',
      'Place the X gate on Qubit Wire 0 at Step 0.',
      'Observe the 3D Bloch sphere vector rotate 180° down to the South Pole (|1⟩).',
      'Click "Validate Solution" to confirm P(|1⟩) = 100%.'
    ],
    validateProbabilities: (probs) =>
      probs.length === 2 && Math.abs(probs[1] - 1.0) < 1e-3,
  },
  // 3
  {
    id: 'pauli-y-spin',
    title: '3. Pauli-Y Spin Rotation',
    category: 'Basics',
    difficulty: 'Beginner',
    numQubits: 1,
    description: 'Apply a Pauli-Y gate to rotate the qubit 180° around the Y-axis of the Bloch sphere.',
    targetDescription: 'P(|1⟩) = 100% with phase +i',
    hint: 'Place a Pauli-Y (Y) gate on Qubit Wire 0.',
    steps: [
      'Select the Pauli-Y (Y) gate from the Single-Qubit Gates palette.',
      'Place the Y gate on Qubit Wire 0 at Step 0.',
      'Notice the state vector flip to |1⟩ with complex phase +i.',
      'Click "Validate Solution" to complete the challenge.'
    ],
    validateProbabilities: (probs) =>
      probs.length === 2 && Math.abs(probs[1] - 1.0) < 1e-3,
  },
  // 4
  {
    id: 'pauli-z-phase',
    title: '4. Pauli-Z Phase Flip',
    category: 'Phase',
    difficulty: 'Beginner',
    numQubits: 1,
    description: 'Flip the phase of state |1⟩ without changing the |0⟩ component.',
    targetDescription: 'P(|0⟩) = 50%, P(|1⟩) = 50% with -1 phase on |1⟩',
    hint: 'Apply an H gate to enter superposition, then apply a Z gate to flip phase.',
    steps: [
      'Place an H gate on Wire 0 at Step 0 to enter state |+⟩.',
      'Place a Pauli-Z (Z) gate on Wire 0 at Step 1 to map |+⟩ → |-⟩.',
      'Verify the state vector: (|0⟩ - |1⟩)/√2.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 2 && Math.abs(probs[0] - 0.5) < 1e-3 && Math.abs(probs[1] - 0.5) < 1e-3,
  },
  // 5
  {
    id: 's-gate-phase',
    title: '5. S Gate Phase Shift (π/2)',
    category: 'Phase',
    difficulty: 'Intermediate',
    numQubits: 1,
    description: 'Apply a π/2 phase shift to create state |+i⟩ = (|0⟩ + i|1⟩)/√2.',
    targetDescription: 'P(|0⟩) = 50%, P(|1⟩) = 50% on Y-axis equator',
    hint: 'Place an H gate then an S gate on Wire 0.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place S gate on Wire 0 at Step 1.',
      'Observe the Bloch vector point along the +Y axis equator.',
      'Click "Validate Solution" to complete the challenge!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 2 && Math.abs(probs[0] - 0.5) < 1e-3 && Math.abs(probs[1] - 0.5) < 1e-3,
  },
  // 6
  {
    id: 't-gate-pi4',
    title: '6. T Gate π/4 Rotation',
    category: 'Phase',
    difficulty: 'Intermediate',
    numQubits: 1,
    description: 'Apply a non-Clifford T gate (π/4 phase rotation) essential for universal quantum computing.',
    targetDescription: 'P(|0⟩) = 50%, P(|1⟩) = 50% with e^(iπ/4) phase',
    hint: 'Apply H gate then T gate on Wire 0.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place T gate on Wire 0 at Step 1.',
      'Observe the 45° phase angle shift on the Bloch equator.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 2 && Math.abs(probs[0] - 0.5) < 1e-3 && Math.abs(probs[1] - 0.5) < 1e-3,
  },
  // 7
  {
    id: 'bell-state-generator',
    title: '7. Create Bell State (|Φ⁺⟩)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    numQubits: 2,
    description: 'Entangle two qubits into Bell state (|00⟩ + |11⟩)/√2.',
    targetDescription: 'P(|00⟩) = 50%, P(|11⟩) = 50%, P(|01⟩) = 0%, P(|10⟩) = 0%',
    hint: 'Apply H to q₀, then apply CNOT (CX) with control q₀ and target q₁.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place CNOT (CX) with Control q₀ and Target q₁ at Step 1.',
      'Verify statevector table probabilities for |00⟩ and |11⟩ equal 50%.',
      'Click "Validate Solution" to complete the challenge!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 &&
      Math.abs(probs[0] - 0.5) < 1e-3 &&
      Math.abs(probs[3] - 0.5) < 1e-3 &&
      Math.abs(probs[1]) < 1e-3 &&
      Math.abs(probs[2]) < 1e-3,
  },
  // 8
  {
    id: 'bell-state-phi-minus',
    title: '8. Create Bell State (|Φ⁻⟩)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    numQubits: 2,
    description: 'Create the second Bell basis state: (|00⟩ - |11⟩)/√2.',
    targetDescription: 'P(|00⟩) = 50%, P(|11⟩) = 50% with negative phase',
    hint: 'Apply X to q₀, then H to q₀, then CNOT q₀→q₁.',
    steps: [
      'Place X gate on Wire 0 at Step 0.',
      'Place H gate on Wire 0 at Step 1.',
      'Place CNOT gate (Control q₀ → Target q₁) at Step 2.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 &&
      Math.abs(probs[0] - 0.5) < 1e-3 &&
      Math.abs(probs[3] - 0.5) < 1e-3 &&
      Math.abs(probs[1]) < 1e-3,
  },
  // 9
  {
    id: 'bell-state-psi-plus',
    title: '9. Create Bell State (|Ψ⁺⟩)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    numQubits: 2,
    description: 'Create the third Bell basis state: (|01⟩ + |10⟩)/√2.',
    targetDescription: 'P(|01⟩) = 50%, P(|10⟩) = 50%',
    hint: 'Apply H to q₀, X to q₁, then CNOT q₀→q₁.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place X gate on Wire 1 at Step 0.',
      'Place CNOT (Control q₀ → Target q₁) at Step 1.',
      'Verify P(|01⟩) = 50% and P(|10⟩) = 50%.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 &&
      Math.abs(probs[1] - 0.5) < 1e-3 &&
      Math.abs(probs[2] - 0.5) < 1e-3,
  },
  // 10
  {
    id: 'bell-state-psi-minus',
    title: '10. Create Bell State (|Ψ⁻⟩)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    numQubits: 2,
    description: 'Create the anti-symmetric Bell state: (|01⟩ - |10⟩)/√2.',
    targetDescription: 'P(|01⟩) = 50%, P(|10⟩) = 50% with -1 phase',
    hint: 'Apply X to q₀, H to q₀, X to q₁, then CNOT q₀→q₁.',
    steps: [
      'Place X gate on Wire 0 at Step 0.',
      'Place H gate on Wire 0 at Step 1.',
      'Place X gate on Wire 1 at Step 1.',
      'Place CNOT (Control q₀ → Target q₁) at Step 2.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 &&
      Math.abs(probs[1] - 0.5) < 1e-3 &&
      Math.abs(probs[2] - 0.5) < 1e-3,
  },
  // 11
  {
    id: 'ghz-3-qubit',
    title: '11. Create 3-Qubit GHZ State',
    category: 'Entanglement',
    difficulty: 'Advanced',
    numQubits: 3,
    description: 'Entangle three qubits simultaneously into GHZ state: (|000⟩ + |111⟩)/√2.',
    targetDescription: 'P(|000⟩) = 50%, P(|111⟩) = 50%',
    hint: 'Place H on q₀, CNOT q₀→q₁, then CNOT q₁→q₂.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place CNOT 1: Control q₀ → Target q₁ at Step 1.',
      'Place CNOT 2: Control q₁ → Target q₂ at Step 2.',
      'Verify states |000⟩ and |111⟩ have 50% probability.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 8 &&
      Math.abs(probs[0] - 0.5) < 1e-3 &&
      Math.abs(probs[7] - 0.5) < 1e-3,
  },
  // 12
  {
    id: 'w-state-3-qubit',
    title: '12. Create 3-Qubit W State',
    category: 'Entanglement',
    difficulty: 'Advanced',
    numQubits: 3,
    description: 'Create the W State (|001⟩ + |010⟩ + |100⟩)/√3, resilient against single qubit loss.',
    targetDescription: 'P(|001⟩) = 33.3%, P(|010⟩) = 33.3%, P(|100⟩) = 33.3%',
    hint: 'Apply H gate to q₀ and q₁, and use controlled gates to distribute excitation.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place H gate on Wire 1 at Step 0.',
      'Place CNOT q₀→q₂ at Step 1.',
      'Place CNOT q₁→q₂ at Step 2.',
      'Click "Validate Solution" to complete the W State challenge!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 8 && probs.filter((p) => p > 0.15).length >= 3,
  },
  // 13
  {
    id: 'cz-controlled-phase',
    title: '13. Controlled Phase CZ Gate',
    category: 'Phase',
    difficulty: 'Intermediate',
    numQubits: 2,
    description: 'Apply a CZ gate to conditionally flip the phase of state |11⟩.',
    targetDescription: 'Phase flip on |11⟩ state',
    hint: 'Apply H to q₀ and q₁, then apply CZ with control q₀ and target q₁.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place H gate on Wire 1 at Step 0.',
      'Place CZ gate (Control q₀ → Target q₁) at Step 1.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 && probs.every((p) => Math.abs(p - 0.25) < 1e-3),
  },
  // 14
  {
    id: 'swap-gate-exchange',
    title: '14. SWAP Gate Qubit Exchange',
    category: 'Basics',
    difficulty: 'Intermediate',
    numQubits: 2,
    description: 'Swap quantum information between Qubit 0 and Qubit 1.',
    targetDescription: 'P(|10⟩) = 100% after starting in |01⟩',
    hint: 'Apply X to q₁, then apply SWAP between q₀ and q₁.',
    steps: [
      'Place X gate on Wire 1 at Step 0 to initialize state |01⟩.',
      'Place SWAP gate between Wire 0 and Wire 1 at Step 1.',
      'Verify state flips from |01⟩ → |10⟩.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 && Math.abs(probs[2] - 1.0) < 1e-3,
  },
  // 15
  {
    id: 'toffoli-3-qubit-ccx',
    title: '15. Toffoli (CCX) 3-Qubit Gate',
    category: 'Algorithms',
    difficulty: 'Advanced',
    numQubits: 3,
    description: 'Execute the universal reversible Toffoli gate (Controlled-Controlled-NOT).',
    targetDescription: 'P(|111⟩) = 100% when starting in |110⟩',
    hint: 'Apply X to q₀ and q₁, then apply Toffoli (CCX) with controls q₀,q₁ and target q₂.',
    steps: [
      'Place X gate on Wire 0 at Step 0.',
      'Place X gate on Wire 1 at Step 0.',
      'Place CCX (Toffoli) with Controls q₀,q₁ and Target q₂ at Step 1.',
      'Verify state flips to |111⟩.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 8 && Math.abs(probs[7] - 1.0) < 1e-3,
  },
  // 16
  {
    id: 'deutsch-jozsa-constant',
    title: '16. Deutsch Algorithm (Constant Function)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    numQubits: 2,
    description: 'Prove a 1-bit function is constant in a single quantum evaluation.',
    targetDescription: 'P(|00⟩) = 100% or P(|01⟩) = 100%',
    hint: 'Prepare q₀ in |+⟩ and q₁ in |-⟩, leave oracle identity, then apply H to q₀.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place X gate at Step 0 and H gate at Step 1 on Wire 1.',
      'Apply H gate on Wire 0 at Step 2.',
      'Verify final outcome yields P(|00⟩) = 100%.',
      'Click "Validate Solution"!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 && (Math.abs(probs[0] - 1.0) < 1e-3 || Math.abs(probs[1] - 1.0) < 1e-3),
  },
  // 17
  {
    id: 'deutsch-jozsa-balanced',
    title: '17. Deutsch Algorithm (Balanced Function)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    numQubits: 2,
    description: 'Prove a 1-bit function is balanced in a single quantum evaluation!',
    targetDescription: 'P(|11⟩) = 100% or P(|10⟩) = 100%',
    hint: 'Prepare q₀ in |+⟩ and q₁ in |-⟩, apply CNOT oracle, then apply H to q₀.',
    steps: [
      'Place H gate on Wire 0 at Step 0.',
      'Place X gate at Step 0 and H gate at Step 1 on Wire 1.',
      'Place CNOT (Control q₀ → Target q₁) at Step 2.',
      'Place H gate on Wire 0 at Step 3.',
      'Click "Validate Solution" to confirm balanced outcome!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 && (Math.abs(probs[3] - 1.0) < 1e-3 || Math.abs(probs[2] - 1.0) < 1e-3),
  },
  // 18
  {
    id: 'bernstein-vazirani-secret',
    title: '18. Bernstein-Vazirani Secret Bitstring (s = 11)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    numQubits: 3,
    description: 'Find secret bitstring s = 11 in a single quantum query instead of N classical queries!',
    targetDescription: 'P(|110⟩) = 100%',
    hint: 'Put q₀,q₁ in |+⟩ and ancilla q₂ in |-⟩, apply CNOT from q₀→q₂ and q₁→q₂, then apply H to q₀,q₁.',
    steps: [
      'Place H gates on Wire 0 and Wire 1 at Step 0.',
      'Place X at Step 0 and H at Step 1 on Wire 2 (Ancilla).',
      'Place CNOT q₀→q₂ at Step 2.',
      'Place CNOT q₁→q₂ at Step 3.',
      'Place H gates on Wire 0 and Wire 1 at Step 4.',
      'Click "Validate Solution" to reveal secret bitstring 11!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 8 && (Math.abs(probs[3] - 1.0) < 1e-3 || Math.abs(probs[6] - 1.0) < 1e-3),
  },
  // 19
  {
    id: 'grover-search-2-qubit',
    title: '19. Grover\'s Search (Target |11⟩)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    numQubits: 2,
    description: 'Amplifies the amplitude of target state |11⟩ using Grover search iteration.',
    targetDescription: 'P(|11⟩) = 100%',
    hint: 'Apply H to q₀,q₁, CZ phase oracle to |11⟩, then diffuser H-X-CZ-X-H.',
    steps: [
      'Superposition: place H on Wire 0 and Wire 1 at Step 0.',
      'Oracle: place CZ (Control q₀ → Target q₁) at Step 1.',
      'Diffuser Step 1: place H on Wire 0 and Wire 1 at Step 2.',
      'Diffuser Step 2: place X on Wire 0 and Wire 1 at Step 3.',
      'Diffuser Step 3: place CZ q₀→q₁ at Step 4.',
      'Diffuser Step 4: place X on Wire 0,1 at Step 5 and H on Wire 0,1 at Step 6.',
      'Click "Validate Solution" to achieve 100% target state probability!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 4 && Math.abs(probs[3] - 1.0) < 1e-3,
  },
  // 20
  {
    id: 'quantum-teleportation-protocol',
    title: '20. Quantum Teleportation Protocol',
    category: 'Entanglement',
    difficulty: 'Advanced',
    numQubits: 3,
    description: 'Teleport an unknown single qubit state from Alice (q₀) to Bob (q₂) using entanglement!',
    targetDescription: 'Teleported state transfer to q₂',
    hint: 'Create Bell pair on q₁,q₂, apply CNOT q₀→q₁ and H to q₀, measure and apply corrective gates to q₂.',
    steps: [
      'Prepare Alice unknown state: place X gate on Wire 0 at Step 0.',
      'Create shared Bell pair: place H on Wire 1 at Step 0 and CNOT q₁→q₂ at Step 1.',
      'Alice Bell measurement: place CNOT q₀→q₁ at Step 2 and H on Wire 0 at Step 3.',
      'Bob Correction: place CNOT q₁→q₂ at Step 4 and CZ q₀→q₂ at Step 5.',
      'Click "Validate Solution" to complete the ultimate Quantum Teleportation challenge!'
    ],
    validateProbabilities: (probs) =>
      probs.length === 8 && probs.some((p) => Math.abs(p - 0.25) < 1e-3 || Math.abs(p - 0.5) < 1e-3),
  }
];
