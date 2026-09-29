export interface CodingChallenge {
  id: string;
  title: string;
  category: 'Superposition' | 'Entanglement' | 'Quantum Gates' | 'Protocols' | 'Algorithms' | 'Phase';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  starterQiskit: string;
  starterQasm: string;
  hint: string;
  validateSolution: (probabilities: number[]) => boolean;
}

export const CODING_CHALLENGES: CodingChallenge[] = [
  // 1
  {
    id: 'superposition-101-code',
    title: '1. Hello Quantum (Single Qubit Superposition)',
    category: 'Superposition',
    difficulty: 'Beginner',
    description: 'Write Python Qiskit code to place a single qubit in equal superposition |+⟩ = (|0⟩ + |1⟩)/√2.',
    instructions: [
      'Initialize QuantumCircuit(1, 1).',
      'Apply Hadamard gate qc.h(0).',
      'Measure qubit 0 into classical bit 0.'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

# Initialize 1-qubit circuit
qc = QuantumCircuit(1, 1)

# Write your code here:
# Apply Hadamard gate to q0

qc.measure(0, 0)
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

// Write your code here:
// h q[0];
measure q[0] -> c[0];
`,
    hint: 'Use qc.h(0) in Qiskit, or h q[0]; in OpenQASM.',
    validateSolution: (probs) =>
      probs.length === 2 && Math.abs(probs[0] - 0.5) < 1e-2 && Math.abs(probs[1] - 0.5) < 1e-2,
  },
  // 2
  {
    id: 'bit-flip-x-code',
    title: '2. Quantum NOT Gate (Pauli-X Bit Flip)',
    category: 'Quantum Gates',
    difficulty: 'Beginner',
    description: 'Flip qubit state from ground state |0⟩ to state |1⟩ using the Pauli-X gate.',
    instructions: [
      'Initialize QuantumCircuit(1, 1).',
      'Apply Pauli-X gate qc.x(0).',
      'Measure qubit 0.'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# Write your code here:
# Apply Pauli-X gate to q0

qc.measure(0, 0)
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

// Write your code here:
// x q[0];
measure q[0] -> c[0];
`,
    hint: 'Use qc.x(0) in Qiskit, or x q[0]; in OpenQASM.',
    validateSolution: (probs) =>
      probs.length === 2 && Math.abs(probs[1] - 1.0) < 1e-2,
  },
  // 3
  {
    id: 'superposition-duo-code',
    title: '3. Two-Qubit Equal Superposition',
    category: 'Superposition',
    difficulty: 'Beginner',
    description: 'Put both qubits of a 2-qubit register into equal superposition state (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2.',
    instructions: [
      'Initialize QuantumCircuit(2, 2).',
      'Apply Hadamard gate qc.h(0).',
      'Apply Hadamard gate qc.h(1).',
      'Measure both qubits.'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Write your code here:
# 1. Apply H to q0
# 2. Apply H to q1

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// Write your code here:
// h q[0];
// h q[1];
measure q -> c;
`,
    hint: 'Use qc.h(0) and qc.h(1) in Qiskit.',
    validateSolution: (probs) =>
      probs.length === 4 && probs.every((p) => Math.abs(p - 0.25) < 1e-2),
  },
  // 4
  {
    id: 'pauli-z-code',
    title: '4. Pauli-Z Phase Flip Gate',
    category: 'Phase',
    difficulty: 'Beginner',
    description: 'Apply a Pauli-Z phase flip gate to map state |+⟩ to |-⟩.',
    instructions: [
      'Apply Hadamard gate qc.h(0).',
      'Apply Pauli-Z gate qc.z(0).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# Apply H then Z gate
qc.h(0)
# Write code here: apply Z to q0

qc.measure(0, 0)
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

h q[0];
// z q[0];
measure q[0] -> c[0];
`,
    hint: 'Use qc.z(0) in Qiskit, or z q[0]; in OpenQASM.',
    validateSolution: (probs) =>
      probs.length === 2 && Math.abs(probs[0] - 0.5) < 1e-2 && Math.abs(probs[1] - 0.5) < 1e-2,
  },
  // 5
  {
    id: 's-gate-code',
    title: '5. S Gate Phase Shift (π/2)',
    category: 'Phase',
    difficulty: 'Intermediate',
    description: 'Apply an S gate to rotate phase by π/2, creating state |+i⟩ = (|0⟩ + i|1⟩)/√2.',
    instructions: [
      'Apply Hadamard qc.h(0).',
      'Apply S gate qc.s(0).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

qc.h(0)
# Apply S gate to q0

qc.measure(0, 0)
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

h q[0];
// s q[0];
measure q[0] -> c[0];
`,
    hint: 'Use qc.s(0) in Qiskit, or s q[0]; in OpenQASM.',
    validateSolution: (probs) =>
      probs.length === 2 && Math.abs(probs[0] - 0.5) < 1e-2 && Math.abs(probs[1] - 0.5) < 1e-2,
  },
  // 6
  {
    id: 't-gate-code',
    title: '6. T Gate Non-Clifford Rotation (π/4)',
    category: 'Phase',
    difficulty: 'Intermediate',
    description: 'Apply a T gate (π/4 phase rotation) essential for universal quantum execution.',
    instructions: [
      'Apply Hadamard qc.h(0).',
      'Apply T gate qc.t(0).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

qc.h(0)
# Apply T gate to q0

qc.measure(0, 0)
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

h q[0];
// t q[0];
measure q[0] -> c[0];
`,
    hint: 'Use qc.t(0) in Qiskit, or t q[0]; in OpenQASM.',
    validateSolution: (probs) =>
      probs.length === 2 && Math.abs(probs[0] - 0.5) < 1e-2 && Math.abs(probs[1] - 0.5) < 1e-2,
  },
  // 7
  {
    id: 'bell-state-phi-plus-code',
    title: '7. Construct Bell State (|Φ⁺⟩)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    description: 'Write code to entangle two qubits into the Bell state (|00⟩ + |11⟩)/√2.',
    instructions: [
      'Apply Hadamard qc.h(0).',
      'Apply CNOT qc.cx(0, 1).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Write your code here:
# 1. Apply H to q0
# 2. Apply CNOT with ctrl q0 and target q1

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// h q[0];
// cx q[0], q[1];
measure q -> c;
`,
    hint: 'Use qc.h(0) then qc.cx(0, 1) in Qiskit.',
    validateSolution: (probs) =>
      probs.length === 4 &&
      Math.abs(probs[0] - 0.5) < 1e-2 &&
      Math.abs(probs[3] - 0.5) < 1e-2 &&
      Math.abs(probs[1]) < 1e-2,
  },
  // 8
  {
    id: 'bell-state-phi-minus-code',
    title: '8. Construct Bell State (|Φ⁻⟩)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    description: 'Create the negative-phase Bell state (|00⟩ - |11⟩)/√2.',
    instructions: [
      'Apply Pauli-X qc.x(0).',
      'Apply Hadamard qc.h(0).',
      'Apply CNOT qc.cx(0, 1).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Write code: X(0) -> H(0) -> CX(0, 1)

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// x q[0];
// h q[0];
// cx q[0], q[1];
measure q -> c;
`,
    hint: 'Apply X(0), H(0), then CX(0, 1).',
    validateSolution: (probs) =>
      probs.length === 4 &&
      Math.abs(probs[0] - 0.5) < 1e-2 &&
      Math.abs(probs[3] - 0.5) < 1e-2,
  },
  // 9
  {
    id: 'bell-state-psi-plus-code',
    title: '9. Construct Bell State (|Ψ⁺⟩)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    description: 'Create the third Bell state (|01⟩ + |10⟩)/√2.',
    instructions: [
      'Apply H(0) and X(1).',
      'Apply CNOT qc.cx(0, 1).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Write code: H(0) and X(1) -> CX(0, 1)

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// h q[0];
// x q[1];
// cx q[0], q[1];
measure q -> c;
`,
    hint: 'Apply H(0), X(1), then CX(0, 1).',
    validateSolution: (probs) =>
      probs.length === 4 &&
      Math.abs(probs[1] - 0.5) < 1e-2 &&
      Math.abs(probs[2] - 0.5) < 1e-2,
  },
  // 10
  {
    id: 'bell-state-psi-minus-code',
    title: '10. Construct Bell State (|Ψ⁻⟩)',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    description: 'Create the anti-symmetric Bell state (|01⟩ - |10⟩)/√2.',
    instructions: [
      'Apply X(0), H(0), X(1).',
      'Apply CNOT qc.cx(0, 1).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Write code: X(0), H(0), X(1) -> CX(0, 1)

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// x q[0];
// h q[0];
// x q[1];
// cx q[0], q[1];
measure q -> c;
`,
    hint: 'Apply X(0), H(0), X(1), then CX(0, 1).',
    validateSolution: (probs) =>
      probs.length === 4 &&
      Math.abs(probs[1] - 0.5) < 1e-2 &&
      Math.abs(probs[2] - 0.5) < 1e-2,
  },
  // 11
  {
    id: 'ghz-3-qubit-code',
    title: '11. 3-Qubit GHZ State Entanglement',
    category: 'Entanglement',
    difficulty: 'Advanced',
    description: 'Entangle three qubits simultaneously into the GHZ state (|000⟩ + |111⟩)/√2.',
    instructions: [
      'Apply H(0).',
      'Apply CNOT qc.cx(0, 1).',
      'Apply CNOT qc.cx(1, 2).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(3, 3)

# Write code: H(0) -> CX(0,1) -> CX(1,2)

qc.measure([0, 1, 2], [0, 1, 2])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

// h q[0];
// cx q[0], q[1];
// cx q[1], q[2];
measure q -> c;
`,
    hint: 'Use qc.h(0), qc.cx(0, 1), and qc.cx(1, 2).',
    validateSolution: (probs) =>
      probs.length === 8 &&
      Math.abs(probs[0] - 0.5) < 1e-2 &&
      Math.abs(probs[7] - 0.5) < 1e-2,
  },
  // 12
  {
    id: 'swap-gate-code',
    title: '12. SWAP Gate Qubit Exchange',
    category: 'Quantum Gates',
    difficulty: 'Intermediate',
    description: 'Swap quantum state information between Qubit 0 and Qubit 1.',
    instructions: [
      'Apply X(1) to initialize |01⟩.',
      'Apply SWAP gate qc.swap(0, 1).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

qc.x(1) # Start in |01>
# Apply SWAP gate to exchange q0 and q1

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

x q[1];
// swap q[0], q[1];
measure q -> c;
`,
    hint: 'Use qc.swap(0, 1) in Qiskit, or swap q[0], q[1]; in OpenQASM.',
    validateSolution: (probs) =>
      probs.length === 4 && Math.abs(probs[2] - 1.0) < 1e-2,
  },
  // 13
  {
    id: 'cz-gate-code',
    title: '13. Controlled-Z (CZ) Phase Gate',
    category: 'Phase',
    difficulty: 'Intermediate',
    description: 'Conditionally flip phase on state |11⟩ using the CZ gate.',
    instructions: [
      'Apply H(0) and H(1).',
      'Apply CZ gate qc.cz(0, 1).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

qc.h(0)
qc.h(1)
# Apply CZ gate to q0, q1

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
h q[1];
// cz q[0], q[1];
measure q -> c;
`,
    hint: 'Use qc.cz(0, 1) in Qiskit, or cz q[0], q[1]; in OpenQASM.',
    validateSolution: (probs) =>
      probs.length === 4 && probs.every((p) => Math.abs(p - 0.25) < 1e-2),
  },
  // 14
  {
    id: 'toffoli-ccx-code',
    title: '14. Toffoli (CCX) 3-Qubit Reversible Gate',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Execute Toffoli (Controlled-Controlled-NOT) to flip q₂ when both q₀ and q₁ are |1⟩.',
    instructions: [
      'Apply X(0) and X(1).',
      'Apply CCX gate qc.ccx(0, 1, 2).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(3, 3)

qc.x(0)
qc.x(1)
# Apply Toffoli (ccx) gate with ctrl q0, q1 and target q2

qc.measure([0, 1, 2], [0, 1, 2])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

x q[0];
x q[1];
// ccx q[0], q[1], q[2];
measure q -> c;
`,
    hint: 'Use qc.ccx(0, 1, 2) in Qiskit, or ccx q[0], q[1], q[2]; in OpenQASM.',
    validateSolution: (probs) =>
      probs.length === 8 && Math.abs(probs[7] - 1.0) < 1e-2,
  },
  // 15
  {
    id: 'deutsch-constant-code',
    title: '15. Deutsch Algorithm (Constant Function)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Evaluate a constant function in 1 query yielding state P(|00⟩) = 100%.',
    instructions: [
      'Apply H(0), X(1), H(1).',
      'Apply final H(0).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

qc.h(0)
qc.x(1)
qc.h(1)

# Apply final H on q0
qc.h(0)

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
x q[1];
h q[1];
h q[0];
measure q -> c;
`,
    hint: 'Use H(0), X(1), H(1), then final H(0).',
    validateSolution: (probs) =>
      probs.length === 4 && (Math.abs(probs[0] - 1.0) < 1e-2 || Math.abs(probs[1] - 1.0) < 1e-2),
  },
  // 16
  {
    id: 'deutsch-balanced-code',
    title: '16. Deutsch Algorithm (Balanced Function)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Evaluate a balanced oracle function yielding state P(|11⟩) = 100%.',
    instructions: [
      'Apply H(0), X(1), H(1).',
      'Apply CNOT qc.cx(0, 1).',
      'Apply final H(0).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

qc.h(0)
qc.x(1)
qc.h(1)

# Apply CNOT oracle q0 -> q1
qc.cx(0, 1)

# Apply final H on q0
qc.h(0)

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
x q[1];
h q[1];
cx q[0], q[1];
h q[0];
measure q -> c;
`,
    hint: 'Apply H(0), X(1), H(1), CX(0,1), then H(0).',
    validateSolution: (probs) =>
      probs.length === 4 && (Math.abs(probs[3] - 1.0) < 1e-2 || Math.abs(probs[2] - 1.0) < 1e-2),
  },
  // 17
  {
    id: 'bernstein-vazirani-code',
    title: '17. Bernstein-Vazirani Secret Bitstring (s = 11)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Recover secret bitstring s = 11 in a single quantum query!',
    instructions: [
      'Apply H(0), H(1), X(2), H(2).',
      'Apply CNOT q₀→q₂ and q₁→q₂.',
      'Apply final H(0), H(1).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(3, 3)

qc.h(0)
qc.h(1)
qc.x(2)
qc.h(2)

# Write code: CX(0,2) and CX(1,2)
qc.cx(0, 2)
qc.cx(1, 2)

# Write code: final H(0) and H(1)
qc.h(0)
qc.h(1)

qc.measure([0, 1, 2], [0, 1, 2])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

h q[0];
h q[1];
x q[2];
h q[2];
cx q[0], q[2];
cx q[1], q[2];
h q[0];
h q[1];
measure q -> c;
`,
    hint: 'Use CX(0,2), CX(1,2), H(0), H(1).',
    validateSolution: (probs) =>
      probs.length === 8 && (Math.abs(probs[3] - 1.0) < 1e-2 || Math.abs(probs[6] - 1.0) < 1e-2),
  },
  // 18
  {
    id: 'grover-search-code',
    title: '18. Grover\'s 2-Qubit Search (Target |11⟩)',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Implement Grover search iteration amplifying target state |11⟩ probability to 100%.',
    instructions: [
      'Superposition: H(0), H(1).',
      'Oracle: CZ(0, 1).',
      'Diffuser: H(0),H(1) -> X(0),X(1) -> CZ(0,1) -> X(0),X(1) -> H(0),H(1).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Superposition
qc.h(0)
qc.h(1)

# Oracle
qc.cz(0, 1)

# Diffuser
qc.h(0)
qc.h(1)
qc.x(0)
qc.x(1)
qc.cz(0, 1)
qc.x(0)
qc.x(1)
qc.h(0)
qc.h(1)

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
h q[1];
cz q[0], q[1];
h q[0];
h q[1];
x q[0];
x q[1];
cz q[0], q[1];
x q[0];
x q[1];
h q[0];
h q[1];
measure q -> c;
`,
    hint: 'Execute the Grover diffuser sequence H-X-CZ-X-H on both qubits.',
    validateSolution: (probs) =>
      probs.length === 4 && Math.abs(probs[3] - 1.0) < 1e-2,
  },
  // 19
  {
    id: 'qml-feature-map-code',
    title: '19. Quantum Machine Learning (QML) Feature Map',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Encode 2D classical data x = (π/2, π/4) into quantum Hilbert space via Rz-Ry rotations.',
    instructions: [
      'Apply H(0) and H(1).',
      'Apply Rz rotation or S gate to encode feature angle.'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

qc.h(0)
qc.h(1)
qc.s(0)
qc.t(1)

qc.measure([0, 1], [0, 1])
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
h q[1];
s q[0];
t q[1];
measure q -> c;
`,
    hint: 'Use H(0), H(1), S(0), T(1) to create feature map encoding.',
    validateSolution: (probs) =>
      probs.length === 4 && probs.every((p) => Math.abs(p - 0.25) < 1e-2),
  },
  // 20
  {
    id: 'qkd-bb84-code',
    title: '20. Quantum Key Distribution (BB84 QKD Protocol)',
    category: 'Protocols',
    difficulty: 'Advanced',
    description: 'Encode Alice secret bit key into diagonal basis (|x⟩) and decode Bob photon state.',
    instructions: [
      'Alice prepares photon |1⟩ with X(0) and selects diagonal basis with H(0).',
      'Bob measures in diagonal basis with H(0).'
    ],
    starterQiskit: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# Alice prepares key bit 1 in diagonal basis
qc.x(0)
qc.h(0)

# Bob measures in diagonal basis
qc.h(0)

qc.measure(0, 0)
print(qc)`,
    starterQasm: `OPENQASM 2.0;
include "qelib1.inc";

qreg q[1];
creg c[1];

x q[0];
h q[0];
h q[0];
measure q[0] -> c[0];
`,
    hint: 'Apply X(0) -> H(0) for Alice encoding, and H(0) for Bob decoding.',
    validateSolution: (probs) =>
      probs.length === 2 && Math.abs(probs[1] - 1.0) < 1e-2,
  }
];
