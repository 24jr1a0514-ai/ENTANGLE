export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Fundamentals' | 'Gates & Circuits' | 'Algorithms' | 'Coding & Qiskit' | 'Hardware & Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  answer: string;
  keyTakeaway: string;
  formulaOrCode?: string;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ==================== FUNDAMENTALS (1-11) ====================
  {
    id: 'iq-1',
    question: 'What is the fundamental difference between a classical bit and a quantum qubit?',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    summary: 'Explains binary states (0 vs 1) versus quantum state vectors in linear superposition.',
    answer: 'A classical bit is a binary unit of information that can strictly exist in one of two physical states: 0 OR 1. In contrast, a quantum bit (qubit) is a two-level quantum mechanical system described by a state vector |ψ⟩ in complex Hilbert space.\n\nA qubit can exist in state |0⟩, state |1⟩, or any linear superposition α|0⟩ + β|1⟩, where α and β are complex probability amplitudes satisfying |α|² + |β|² = 1. This allows n qubits to represent a superposition of 2ⁿ classical numbers simultaneously.',
    keyTakeaway: 'Bits are 0 OR 1 (deterministic); Qubits are 0 AND 1 in superposition (probabilistic).',
    formulaOrCode: '|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle, \\quad \\text{where } |\\alpha|^2 + |\\beta|^2 = 1'
  },
  {
    id: 'iq-2',
    question: 'What is the Bloch Sphere and what do its poles and equator represent?',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    summary: 'Geometric visualization of single-qubit states on a unit sphere.',
    answer: 'The Bloch Sphere is a 3D unit sphere geometric representation of a pure single-qubit state. Any point on the surface corresponds to a unique single-qubit state defined by polar angle θ and azimuthal angle φ.\n\n• North Pole (θ = 0): Represents state |0⟩.\n• South Pole (θ = π): Represents state |1⟩.\n• Equator (θ = π/2): Represents equal superposition states, such as |+⟩ = (|0⟩ + |1⟩)/√2 and |-⟩ = (|0⟩ - |1⟩)/√2.\n\nSingle-qubit quantum gates correspond to 3D rotations of the state vector around the Bloch sphere axes.',
    keyTakeaway: 'Bloch Sphere maps single-qubit state vectors: North Pole = |0⟩, South Pole = |1⟩, Equator = Superposition.',
    formulaOrCode: '|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle'
  },
  {
    id: 'iq-3',
    question: 'Explain Quantum Entanglement in simple terms. Why did Einstein call it "spooky action at a distance"?',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    summary: 'Non-local quantum correlations between composite qubit systems.',
    answer: 'Quantum Entanglement is a quantum phenomenon where two or more qubits become deeply correlated such that the quantum state of one particle cannot be described independently of the state of the other.\n\nWhen two qubits are entangled, measuring the state of Qubit A instantly dictates the measurement result of Qubit B—even if they are separated by light-years!\n\nEinstein doubted that information could travel faster than light, calling this instantaneous correlation "spooky action at a distance." However, experiments (like Bell test violations) proved entanglement is real. Because measurement outcomes are intrinsically random, entanglement cannot transmit faster-than-light signals, maintaining compatibility with Special Relativity.',
    keyTakeaway: 'Entangled qubits share a single joint state vector; measuring one instantly reveals the outcome of the twin qubit.'
  },
  {
    id: 'iq-4',
    question: 'What is Quantum Measurement and Wavefunction Collapse?',
    category: 'Fundamentals',
    difficulty: 'Intermediate',
    summary: 'Projective measurement (POVM), Born Rule, and irreversible state collapse.',
    answer: 'Quantum Measurement is the act of inspecting a quantum system with a classical measuring device. According to the Born Rule, measuring a qubit in state α|0⟩ + β|1⟩ in the computational basis yields:\n\n• Outcome 0 with probability P(0) = |α|²\n• Outcome 1 with probability P(1) = |β|²\n\nUpon measurement, the superposition instantly collapses into the observed basis state (|0⟩ or |1⟩), destroying all prior amplitude phase information. Measurement is an irreversible, non-unitary operation.',
    keyTakeaway: 'Measurement is non-unitary; it forces a superposition into a single classical state with probability |amp|².',
    formulaOrCode: 'P(x) = |\\langle x | \\psi \\rangle|^2, \\quad |\\psi\\rangle \\xrightarrow{\\text{Measure } x} |x\\rangle'
  },
  {
    id: 'iq-5',
    question: 'What is the difference between a Pure State and a Mixed State? How are Density Matrices used?',
    category: 'Fundamentals',
    difficulty: 'Advanced',
    summary: 'State representation using density matrix ρ = Σ pᵢ |ψᵢ⟩⟨ψᵢ|.',
    answer: 'A Pure State is a quantum system described by a single state vector |ψ⟩ with complete quantum information. Its density matrix is ρ = |ψ⟩⟨ψ| and satisfies Tr(ρ²) = 1.\n\nA Mixed State represents a statistical ensemble of pure states with classical probabilities pᵢ, written as ρ = Σ pᵢ |ψᵢ⟩⟨ψᵢ|, satisfying Tr(ρ²) < 1. Mixed states arise when a system is entangled with an environment (decoherence) or when state preparation is incomplete.\n\nDensity matrices are essential for describing open quantum systems, thermal states, and sub-system entanglement via partial trace.',
    keyTakeaway: 'Pure state: Tr(ρ²) = 1 (single vector); Mixed state: Tr(ρ²) < 1 (statistical ensemble / decoherence).',
    formulaOrCode: '\\rho = \\sum_i p_i |\\psi_i\\rangle\\langle\\psi_i|, \\quad \\text{Pure: } \\text{Tr}(\\rho^2)=1, \\; \\text{Mixed: } \\text{Tr}(\\rho^2)<1'
  },
  {
    id: 'iq-6',
    question: 'What are Hilbert Spaces and Complex Inner Products in quantum mechanics?',
    category: 'Fundamentals',
    difficulty: 'Intermediate',
    summary: 'Vector space structure governing quantum state vectors and normalization.',
    answer: 'A Hilbert Space (ℋ) is a complete complex vector space equipped with an inner product ⟨ψ|ϕ⟩. Quantum state vectors live in Hilbert space.\n\nKey Properties:\n1. Complex Coefficients: State vectors have complex amplitudes α, β ∈ ℂ.\n2. Inner Product Norm: The inner product of a state with itself equals 1 (⟨ψ|ψ⟩ = 1), enforcing probability normalization.\n3. Orthogonality: Two states |ψ⟩ and |ϕ⟩ are orthogonal if ⟨ψ|ϕ⟩ = 0, meaning they can be perfectly distinguished in a single measurement.\n4. Dimension: An n-qubit system has a Hilbert space of dimension 2ⁿ.',
    keyTakeaway: 'Quantum states inhabit a 2ⁿ-dimensional complex Hilbert space where inner product ⟨ψ|ψ⟩ = 1 enforces total probability.',
    formulaOrCode: '\\langle \\psi | \\phi \\rangle = \\sum_{i} \\alpha_i^* \\beta_i, \\quad \\text{Dimension } \\dim(\\mathcal{H}) = 2^n'
  },
  {
    id: 'iq-7',
    question: 'Explain T1 Relaxation Time vs T2 Dephasing Time in physical qubits.',
    category: 'Fundamentals',
    difficulty: 'Advanced',
    summary: 'Qubit decoherence metrics: energy relaxation (T1) and phase coherence (T2).',
    answer: 'Physical qubits decay over time due to interaction with environmental noise. Decoherence is measured by two primary characteristic relaxation times:\n\n• T1 (Energy Relaxation Time): The average time it takes for an excited qubit state |1⟩ to decay thermally to ground state |0⟩ by emitting energy. Also called longitudinal relaxation.\n• T2 (Dephasing Time): The average time over which the relative phase relationship between |0⟩ and |1⟩ in a superposition is randomized. Also called transverse relaxation.\n\nRelationship: T2 is bounded by 2 T1 (T2 ≤ 2 T1). High-fidelity quantum algorithms require execution times much shorter than T1 and T2.',
    keyTakeaway: 'T1 measures energy decay (|1⟩ → |0⟩); T2 measures phase loss in superposition. Algorithm runtime must be ≪ T1, T2.',
    formulaOrCode: 'T_2 \\le 2 T_1, \\quad P(|1\\rangle, t) = e^{-t / T_1}'
  },
  {
    id: 'iq-8',
    question: 'What is the EPR Paradox and Bell\'s Inequality?',
    category: 'Fundamentals',
    difficulty: 'Advanced',
    summary: 'Local hidden variable theories vs quantum mechanical non-locality.',
    answer: 'In 1935, Einstein, Podolsky, and Rosen (EPR) argued that quantum mechanics was incomplete because entanglement implied faster-than-light influence unless "local hidden variables" predetermined measurement results.\n\nIn 1964, John Bell derived Bell\'s Inequality, showing that ANY local hidden variable theory places a strict mathematical limit (|S| ≤ 2) on correlations between separated measurements.\n\nQuantum mechanics predicts violations up to S = 2√2 ≈ 2.828 (Tsirelson\'s bound). Countless experiments (awarded the 2022 Nobel Prize) confirmed Bell inequality violations, proving that the universe is fundamentally non-local!',
    keyTakeaway: 'Bell inequality violations (|S| > 2) rule out local hidden variables, proving quantum non-locality.',
    formulaOrCode: '|S_{\\text{classical}}| \\le 2, \\quad S_{\\text{quantum}} = 2\\sqrt{2} \\approx 2.828'
  },
  {
    id: 'iq-9',
    question: 'What is the Dirac Bra-Ket notation and how do Bras and Kets relate?',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    summary: 'Standard linear algebra notation for quantum column vectors |ψ⟩ and row vectors ⟨ψ|.',
    answer: 'Invented by Paul Dirac, Bra-Ket notation simplifies quantum linear algebra:\n\n• Ket |ψ⟩: Represents a column vector in Hilbert space representing a quantum state.\n• Bra ⟨ψ|: Represents the Hermitian conjugate (transpose conjugate) of |ψ⟩, forming a row vector.\n• Inner Product ⟨ψ|ϕ⟩: A complex scalar representing overlap probability amplitude.\n• Outer Product |ψ⟩⟨ϕ|: A linear operator (matrix) mapping states to states.\n\nFor basis states: |0⟩ = [1, 0]ᵀ and |1⟩ = [0, 1]ᵀ. The conjugate bra ⟨0| = [1, 0].',
    keyTakeaway: 'Ket |ψ⟩ is column vector; Bra ⟨ψ| is row vector (transpose conjugate). Inner product ⟨ψ|ϕ⟩ is a scalar.',
    formulaOrCode: '|0\\rangle = \\begin{pmatrix}1\\\\0\\end{pmatrix}, \\quad \\langle 0| = \\begin{pmatrix}1 & 0\\end{pmatrix}, \\quad \\langle 0|0\\rangle = 1'
  },
  {
    id: 'iq-10',
    question: 'What is Quantum Superposition and how does constructive/destructive interference work?',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    summary: 'Linear combination of states and phase interference in amplitude summation.',
    answer: 'Superposition allows a quantum system to exist in a linear combination of all valid basis states simultaneously. When gates manipulate state amplitudes α and β, these amplitudes can interfere like waves:\n\n• Constructive Interference: Amplitudes with the same phase add together (α₁ + α₂), increasing the measurement probability.\n• Destructive Interference: Amplitudes with opposite phases cancel each other out (α₁ - α₂ = 0), reducing or eliminating measurement probability.\n\nQuantum algorithms exploit interference to cancel out incorrect computational paths while amplifying the correct solution!',
    keyTakeaway: 'Superposition enables parallel paths; interference cancels wrong answers and amplifies the correct solution.',
    formulaOrCode: 'H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}, \\quad H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}'
  },
  {
    id: 'iq-11',
    question: 'What is Global Phase vs Relative Phase in a qubit state?',
    category: 'Fundamentals',
    difficulty: 'Intermediate',
    summary: 'Why global phase eⁱᵍ is unobservable, but relative phase eⁱφ alters superposition measurement.',
    answer: '• Global Phase: A phase factor e^{iγ} multiplying the entire state vector: e^{iγ}(α|0⟩ + β|1⟩). Global phase has NO physical or observable effect because |e^{iγ}|² = 1. Probabilities of measuring 0 or 1 remain identical.\n\n• Relative Phase: A phase difference between terms: α|0⟩ + e^{iφ}β|1⟩. Relative phase φ IS physically observable because it alters how the qubit interferes when acted upon by gates (such as Hadamard). For example, |+⟩ = (|0⟩ + |1⟩)/√2 and |-⟩ = (|0⟩ - |1⟩)/√2 have different relative phases (0 vs π) and yield completely different results after an H gate!',
    keyTakeaway: 'Global phase eⁱᵍ cannot be detected; Relative phase eⁱφ determines quantum interference behavior.',
    formulaOrCode: 'H(|+\\rangle) = |0\\rangle, \\quad H(|-\\rangle) = |1\\rangle \\implies \\text{Relative Phase is Observable}'
  },

  // ==================== GATES & CIRCUITS (12-23) ====================
  {
    id: 'iq-12',
    question: 'What are the Pauli X, Y, Z gates and what rotations do they perform on the Bloch Sphere?',
    category: 'Gates & Circuits',
    difficulty: 'Beginner',
    summary: 'Single-qubit Pauli operator matrices and 180-degree axis rotations.',
    answer: 'The Pauli matrices (X, Y, Z) are single-qubit fundamental gates that perform 180° (π radians) rotations around the X, Y, and Z axes of the Bloch sphere:\n\n1. Pauli-X (NOT Gate): Bit-flip operator. Swaps |0⟩ ↔ |1⟩. Matrix: [[0, 1], [1, 0]].\n2. Pauli-Y Gate: Bit and phase flip operator. Swaps |0⟩ → i|1⟩ and |1⟩ → -i|0⟩. Matrix: [[0, -i], [i, 0]].\n3. Pauli-Z Gate: Phase-flip operator. Leaves |0⟩ unchanged, flips |1⟩ → -|1⟩. Matrix: [[1, 0], [0, -1]].\n\nAll Pauli gates are Hermitian (X† = X), Unitary (X† X = I), and involutory (X² = Y² = Z² = I).',
    keyTakeaway: 'Pauli X = Bit Flip, Z = Phase Flip, Y = Bit+Phase Flip. All are 180° Bloch rotations and self-inverses.',
    formulaOrCode: 'X = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}, \\quad Y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}, \\quad Z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}'
  },
  {
    id: 'iq-13',
    question: 'What is the Hadamard (H) gate, and what happens when you apply H twice (H · H)?',
    category: 'Gates & Circuits',
    difficulty: 'Intermediate',
    summary: 'Single-qubit superposition gate and unitary self-inverse property.',
    answer: 'The Hadamard (H) gate is a fundamental single-qubit quantum gate that transforms computational basis states into equal superposition states. It maps |0⟩ → |+⟩ = (|0⟩ + |1⟩)/√2 and |1⟩ → |-⟩ = (|0⟩ - |1⟩)/√2.\n\nBecause the Hadamard matrix is both Hermitian (H† = H) and Unitary (H† H = I), applying the Hadamard gate twice in succession equals the Identity matrix (H · H = H² = I). Thus, H is its own inverse: applying H to an equal superposition state brings the qubit back to its original basis state |0⟩ or |1⟩!',
    keyTakeaway: 'Hadamard creates superposition; H · H = I (applying H twice restores the original basis state).',
    formulaOrCode: 'H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}, \\quad H(H|0\\rangle) = |0\\rangle'
  },
  {
    id: 'iq-14',
    question: 'What are the Phase (S) and T gates? How do they relate to the Pauli-Z gate?',
    category: 'Gates & Circuits',
    difficulty: 'Intermediate',
    summary: 'Phase rotation gates Z, S (π/2), and T (π/4).',
    answer: 'The S gate and T gate are single-qubit phase rotation gates that add relative phase around the Z-axis of the Bloch sphere:\n\n• Pauli-Z Gate: Adds a π (180°) phase shift to state |1⟩: Z = [[1, 0], [0, e^{iπ} = -1]].\n• Phase S Gate (√Z): Adds a π/2 (90°) phase shift to state |1⟩. S² = Z. Matrix: [[1, 0], [0, i]].\n• T Gate (π/8 Gate / ⁴√Z): Adds a π/4 (45°) phase shift to state |1⟩. T² = S, and T⁴ = Z. Matrix: [[1, 0], [0, e^{iπ/4}]].\n\nThe T gate is non-Clifford and essential for fault-tolerant universal quantum computation.',
    keyTakeaway: 'T² = S, S² = Z. The T gate (π/4 phase) is non-Clifford, enabling universal quantum computation.',
    formulaOrCode: 'S = \\begin{pmatrix}1&0\\\\0&i\\end{pmatrix}, \\quad T = \\begin{pmatrix}1&0\\\\0&e^{i\\pi/4}\\end{pmatrix}, \\quad T^2 = S, \\; S^2 = Z'
  },
  {
    id: 'iq-15',
    question: 'How do you construct a 2-qubit Bell State (|Φ⁺⟩) using quantum gates?',
    category: 'Gates & Circuits',
    difficulty: 'Intermediate',
    summary: 'Creating maximal 2-qubit entanglement starting from state |00⟩.',
    answer: 'To create the maximally entangled Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 starting from initial state |00⟩:\n\n1. Apply a Hadamard (H) gate to Qubit 0: Transforms state from |00⟩ to (|00⟩ + |10⟩)/√2.\n2. Apply a CNOT gate with Qubit 0 as control and Qubit 1 as target: Flips Qubit 1 whenever Qubit 0 is |1⟩, producing state (|00⟩ + |11⟩)/√2.\n\nMeasuring Qubit 0 will now yield 0 or 1 with 50% probability, and Qubit 1 will yield the exact same result 100% of the time!',
    keyTakeaway: 'Hadamard on Qubit 0 followed by CNOT(0, 1) creates the Bell state |Φ⁺⟩.',
    formulaOrCode: '|00\\rangle \\xrightarrow{H_0} \\frac{|00\\rangle + |10\\rangle}{\\sqrt{2}} \\xrightarrow{\\text{CNOT}_{01}} \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}} = |\\Phi^+\\rangle'
  },
  {
    id: 'iq-16',
    question: 'What is the CNOT (Controlled-NOT) gate and how does its truth table work?',
    category: 'Gates & Circuits',
    difficulty: 'Beginner',
    summary: '2-qubit entangling gate operation.',
    answer: 'The CNOT (Controlled-NOT) gate is a fundamental 2-qubit gate that performs a conditional NOT operation.\n\nOperation:\n• Qubit 0 (Control): Remains unchanged.\n• Qubit 1 (Target): Flips (0→1 or 1→0) IF AND ONLY IF the Control Qubit is in state |1⟩.\n\nTruth Table:\n|00⟩ → |00⟩\n|01⟩ → |01⟩\n|10⟩ → |11⟩ (Target flipped!)\n|11⟩ → |10⟩ (Target flipped!)\n\nMatrix Representation: A 4x4 matrix with identity block for control=0 and X block for control=1.',
    keyTakeaway: 'CNOT flips target qubit if control is |1⟩; it is essential for generating multi-qubit entanglement.',
    formulaOrCode: '\\text{CNOT} = \\begin{pmatrix} 1&0&0&0 \\\\ 0&1&0&0 \\\\ 0&0&0&1 \\\\ 0&0&1&0 \\end{pmatrix}'
  },
  {
    id: 'iq-17',
    question: 'What are the Toffoli (CCNOT) and Fredkin (CSWAP) 3-qubit gates?',
    category: 'Gates & Circuits',
    difficulty: 'Intermediate',
    summary: 'Universal reversible 3-qubit classical logic gates.',
    answer: '• Toffoli Gate (CCNOT): A 3-qubit gate with 2 control qubits and 1 target qubit. Flips the target qubit if and only if BOTH control qubits are |1⟩. The Toffoli gate is universal for classical reversible computation (can implement AND, NAND, OR gates).\n\n• Fredkin Gate (CSWAP): A 3-qubit gate with 1 control qubit and 2 target qubits. Swaps the states of the two target qubits if and only if the control qubit is |1⟩.\n\nBoth Toffoli and Fredkin gates can be decomposed into single-qubit gates and CNOT gates (typically requiring 6 CNOTs and T-gates).',
    keyTakeaway: 'Toffoli (CCNOT) flips target if two controls are 1; Fredkin (CSWAP) swaps targets if control is 1. Universal for reversible logic.',
    formulaOrCode: '\\text{Toffoli: } |c_1, c_2, t\\rangle \\mapsto |c_1, c_2, t \\oplus (c_1 \\cdot c_2)\\rangle'
  },
  {
    id: 'iq-18',
    question: 'What is a Universal Gate Set in quantum computing? Give examples.',
    category: 'Gates & Circuits',
    difficulty: 'Intermediate',
    summary: 'A set of gates capable of approximating any arbitrary unitary transformation U.',
    answer: 'A Universal Gate Set is a finite set of quantum gates that can approximate any arbitrary multi-qubit unitary transformation U to arbitrary precision ε.\n\nAccording to the Solovay-Kitaev Theorem, any single-qubit operation can be approximated with O(log^c(1/ε)) gates from a discrete universal set.\n\nStandard Universal Gate Sets:\n1. {H, S, T, CNOT}: Clifford gates {H, S, CNOT} + non-Clifford T gate.\n2. {Rx(θ), Ry(θ), Rz(θ), CNOT}: Continuous single-qubit rotations + 2-qubit CNOT.\n3. {Toffoli, Hadamard}: Universal for real-amplitude quantum computation.',
    keyTakeaway: 'Universal gate sets (e.g. {H, T, CNOT}) can approximate any unitary matrix U to arbitrary precision ε.',
    formulaOrCode: '\\text{Universal Set: } \\{H, S, T, \\text{CNOT}\\}, \\quad \\text{Solovay-Kitaev: } O(\\log^c(1/\\varepsilon))'
  },
  {
    id: 'iq-19',
    question: 'Why are all Quantum Gates represented by Unitary Matrices?',
    category: 'Gates & Circuits',
    difficulty: 'Intermediate',
    summary: 'Unitary matrix property U†U = I preserving vector norm and probability.',
    answer: 'Quantum state evolution in closed systems is governed by the Schrödinger equation, requiring operators to preserve total probability normalization (Σ |cᵢ|² = 1).\n\nA matrix U is Unitary if its Hermitian conjugate U† equals its inverse: U† U = U U† = I.\n\nKey Properties of Unitary Operators:\n1. Probability Preservation: Preserves inner products ⟨Uψ|Uϕ⟩ = ⟨ψ|U†U|ϕ⟩ = ⟨ψ|ϕ⟩.\n2. Reversibility: Every quantum gate operation is 100% reversible by applying U†.\n3. Eigenvalues: All eigenvalues of a unitary matrix lie on the complex unit circle (e^{iθ}).',
    keyTakeaway: 'Unitary matrices (U†U = I) preserve total probability equal to 1 and guarantee gate reversibility.',
    formulaOrCode: 'U^\\dagger U = I, \\quad \\Vert U|\\psi\\rangle \\Vert = \\Vert |\\psi\\rangle \\Vert = 1'
  },
  {
    id: 'iq-20',
    question: 'What is the difference between Circuit Depth and Circuit Width?',
    category: 'Gates & Circuits',
    difficulty: 'Beginner',
    summary: 'Circuit metrics: width (number of qubits) vs depth (critical time steps).',
    answer: '• Circuit Width: The total number of qubits (wires) utilized in the quantum circuit. Determined by the algorithm design and problem size.\n\n• Circuit Depth: The maximum length of the longest path of sequential quantum gates from input to output, where gates acting on independent qubits in parallel count as 1 time step.\n\nSignificance in NISQ Era:\nDue to short qubit coherence times (T1, T2), modern NISQ hardware can only execute shallow circuits with low depth before noise dominates calculation results.',
    keyTakeaway: 'Width = number of qubits; Depth = number of sequential gate time steps. Low depth is critical on NISQ devices.',
    formulaOrCode: '\\text{Width} = n \\text{ Qubits}, \\quad \\text{Depth} = t \\text{ Critical Time Steps}'
  },
  {
    id: 'iq-21',
    question: 'What is the Uncomputation Pattern in quantum circuits and why is it necessary?',
    category: 'Gates & Circuits',
    difficulty: 'Advanced',
    summary: 'Reversing temporary ancilla qubit operations to clean up entanglement before measurement.',
    answer: 'Uncomputation is a design pattern in quantum circuits where temporary (ancilla) qubits used to store intermediate classical or quantum calculations are reset back to state |0⟩ by applying the inverse operations (U†).\n\nWhy Uncomputation is Crucial:\nIf intermediate calculations leave ancilla qubits entangled with data qubits, measuring or discarding the ancilla qubits acts as a measurement collapse, destroying quantum phase interference in the main algorithm!\n\nPattern: Prepare Ancilla → Compute U → Copy Result (CNOT) → Uncompute U†. This leaves the ancilla cleanly unentangled |0⟩.',
    keyTakeaway: 'Uncomputation (U†) resets ancilla qubits back to |0⟩, preventing unwanted entanglement collapse.',
    formulaOrCode: '|x\\rangle|0\\rangle|0\\rangle \\xrightarrow{U} |x\\rangle|f(x)\\rangle|\\text{anc}\\rangle \\xrightarrow{\\text{CNOT}} |x\\rangle|y \\oplus f(x)\\rangle|\\text{anc}\\rangle \\xrightarrow{U^\\dagger} |x\\rangle|y \\oplus f(x)\\rangle|0\\rangle'
  },
  {
    id: 'iq-22',
    question: 'Explain the protocol steps for Quantum Teleportation.',
    category: 'Gates & Circuits',
    difficulty: 'Intermediate',
    summary: 'Transferring an unknown qubit state |ψ⟩ using Bell pair entanglement and 2 classical bits.',
    answer: 'Quantum Teleportation transmits an unknown state |ψ⟩ = α|0⟩ + β|1⟩ from Alice to Bob using an entangled Bell pair and 2 classical communication bits:\n\nProtocol Steps:\n1. Entanglement Setup: Alice and Bob share an entangled Bell pair (|00⟩ + |11⟩)/√2.\n2. Alice\'s Operations: Alice performs a CNOT gate between her state |ψ⟩ and her Bell qubit, followed by a Hadamard gate on |ψ⟩.\n3. Alice\'s Measurement: Alice measures both of her qubits, obtaining 2 classical bits (00, 01, 10, or 11).\n4. Classical Transmission: Alice sends the 2 classical bits to Bob via telephone/internet.\n5. Bob\'s Reconstruction: Bob applies Pauli gates based on the 2 bits (00→I, 01→X, 10→Z, 11→ZX), perfectly reconstructing |ψ⟩!\n\nNote: The original state |ψ⟩ at Alice\'s end is destroyed by measurement (respecting No-Cloning).',
    keyTakeaway: 'Quantum teleportation transmits state |ψ⟩ using 1 shared Bell pair + 2 classical bits; original state is destroyed.',
    formulaOrCode: '|\\psi\\rangle_{\\text{Alice}} \\otimes |\\Phi^+\\rangle_{AB} \\xrightarrow{\\text{CNOT, H}} \\text{Measure 2 Bits} \\xrightarrow{\\text{Send 2 Bits}} \\text{Bob applies } Z^{b_1}X^{b_2} \\implies |\\psi\\rangle_{\\text{Bob}}'
  },
  {
    id: 'iq-23',
    question: 'What is SWAP gate and how can it be constructed using CNOT gates?',
    category: 'Gates & Circuits',
    difficulty: 'Beginner',
    summary: 'Swapping 2 qubit states using 3 alternating CNOT gates.',
    answer: 'The SWAP gate exchanges the quantum states of two qubits: SWAP|a, b⟩ = |b, a⟩.\n\nCNOT Construction:\nA 2-qubit SWAP gate can be constructed using exactly 3 alternating CNOT gates:\n1. CNOT(0, 1)\n2. CNOT(1, 0)\n3. CNOT(0, 1)\n\nImportance in Hardware:\nOn physical QPUs with limited connectivity (e.g. heavy-hex coupling), SWAP gates are inserted during transpilation to route non-adjacent qubits next to each other.',
    keyTakeaway: 'SWAP exchanges 2 qubit states; constructed from 3 alternating CNOT gates.',
    formulaOrCode: '\\text{SWAP}_{01} = \\text{CNOT}_{01} \\cdot \\text{CNOT}_{10} \\cdot \\text{CNOT}_{01}'
  },

  // ==================== ALGORITHMS (24-35) ====================
  {
    id: 'iq-24',
    question: 'Explain the Deutsch-Jozsa Algorithm and its constant vs. balanced speedup.',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    summary: 'First deterministic quantum algorithm showing exponential query speedup.',
    answer: 'The Deutsch-Jozsa algorithm determines whether a black-box function f: {0,1}ⁿ → {0,1} is Constant (returns 0 for all inputs, or 1 for all inputs) or Balanced (returns 0 for half of inputs, 1 for the other half).\n\n• Classical Complexity: In the worst case, a classical computer must query the function 2ⁿ⁻¹ + 1 times to be 100% certain.\n• Quantum Complexity: The Deutsch-Jozsa algorithm determines whether f is constant or balanced in just ONE single query!\n\nHow it works: It initializes n qubits in superposition, applies the function oracle f(x) using phase kickback, and applies Hadamard gates. If all measured qubits are |0...0⟩, f is constant; otherwise, f is balanced.',
    keyTakeaway: 'Deutsch-Jozsa determines if a function is constant or balanced in 1 query vs 2ⁿ⁻¹+1 classical queries.',
    formulaOrCode: '\\text{Classical Queries: } 2^{n-1}+1, \\quad \\text{Quantum Queries: } 1'
  },
  {
    id: 'iq-25',
    question: 'How does Grover\'s Search Algorithm achieve quadratic speedup O(√N) over classical search O(N)?',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Quantum amplitude amplification algorithm for unsorted database lookup.',
    answer: 'Grover\'s algorithm finds a unique target item in an unsorted database of N items in O(√N) steps, compared to classical linear search which requires O(N) queries.\n\nKey Steps:\n1. Equal Superposition: Apply Hadamard gates to put all N states in equal amplitude.\n2. Oracle Reflection: The quantum oracle flips the phase of the target state |w⟩ from +A to -A.\n3. Diffuser Operation (Reflection about Mean): The diffusion operator reflects all state amplitudes about their average, dramatically boosting the target state\'s probability amplitude while shrinking non-target amplitudes.\n\nRepeating the Oracle + Diffuser loop ~π/4 √N times boosts the target state probability close to 100%.',
    keyTakeaway: 'Grover flips target phase and reflects about average, amplifying target amplitude in O(√N) steps.',
    formulaOrCode: '\\text{Classical Queries: } O(N), \\quad \\text{Grover Queries: } \\frac{\\pi}{4}\\sqrt{N} = O(\\sqrt{N})'
  },
  {
    id: 'iq-26',
    question: 'Explain the Quantum Fourier Transform (QFT) and its role in Shor\'s Factoring Algorithm.',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Quantum analogue of Discrete Fourier Transform for period finding.',
    answer: 'The Quantum Fourier Transform (QFT) is the quantum analogue of the classical Discrete Fourier Transform (DFT). It transforms computational basis states |j⟩ into phase-encoded Fourier states.\n\nWhile classical Fast Fourier Transform (FFT) takes O(N 2ᴺ) operations, QFT runs in O(n²) quantum gate operations for n = log(N) qubits—an exponential speedup!\n\nRole in Shor\'s Algorithm:\nShor\'s algorithm factors large integers N in polynomial time O((log N)³) by turning factoring into a period-finding problem for a modular exponentiation function f(x) = a^x mod N. QFT extracts the hidden periodic period r from the quantum state amplitudes.',
    keyTakeaway: 'QFT extracts periodic frequencies exponentially faster than classical FFT, powering Shor\'s factoring speedup.',
    formulaOrCode: 'QFT: |j\\rangle \\mapsto \\frac{1}{\\sqrt{N}} \\sum_{k=0}^{N-1} e^{2\\pi i j k / N} |k\\rangle, \\quad O(n^2) \\text{ Gates}'
  },
  {
    id: 'iq-27',
    question: 'What are Variational Quantum Algorithms (VQE & QAOA)? How do NISQ hybrid loops work?',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Parameterized quantum circuits combined with classical optimization loops.',
    answer: 'Variational Quantum Algorithms (VQAs) are hybrid algorithms designed for Noisy Intermediate-Scale Quantum (NISQ) devices with limited qubit count and gate depth.\n\nHow the Hybrid Loop Works:\n1. Parameterized Quantum Circuit (Ansatz): A shallow quantum circuit U(θ) prepares a trial quantum state |ψ(θ)⟩.\n2. Quantum Measurement: The QPU evaluates the expectation value of a target Hamiltonian ⟨H⟩_θ.\n3. Classical Optimizer: A classical computer receives ⟨H⟩_θ and updates parameters θ using algorithms like SPSA, COBYLA, or Adam.\n4. Repeat: The loop iterates until the minimum ground state energy (VQE) or cost function (QAOA) converges.',
    keyTakeaway: 'VQAs offload trial state evaluation to noisy QPUs while classical optimizers tune gate angles θ.',
    formulaOrCode: 'E(\\vec{\\theta}) = \\langle \\psi(\\vec{\\theta}) | H | \\psi(\\vec{\\theta}) \\rangle, \\quad \\vec{\\theta}^* = \\arg\\min E(\\vec{\\theta})'
  },
  {
    id: 'iq-28',
    question: 'What is the Bernstein-Vazirani Algorithm and how does it find a hidden bitstring?',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    summary: 'Finding a hidden n-bit string s in a single query vs n classical queries.',
    answer: 'The Bernstein-Vazirani algorithm finds a secret n-bit binary string s ∈ {0,1}ⁿ hidden inside an oracle function f(x) = s · x (mod 2).\n\n• Classical Complexity: A classical computer must query the oracle with 100...0, 010...0, etc., taking n individual queries to learn all n bits of s.\n• Quantum Complexity: The Bernstein-Vazirani algorithm discovers the entire secret string s in a SINGLE quantum query!\n\nProcedure:\nPrepare n input qubits in |0⟩ⁿ and 1 target qubit in |-⟩. Apply Hadamard gates, evaluate the oracle f(x), apply Hadamard gates to input qubits, and measure. The measured bits yield the exact secret string s!',
    keyTakeaway: 'Bernstein-Vazirani finds secret string s in 1 query vs n classical queries using Fourier sampling.',
    formulaOrCode: '\\text{Classical Queries: } n, \\quad \\text{Quantum Queries: } 1, \\quad f(x) = s \\cdot x \\pmod 2'
  },
  {
    id: 'iq-29',
    question: 'What is Simon\'s Algorithm and why was it historic for quantum complexity theory?',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'First algorithm demonstrating exponential quantum speedup over probabilistic classical algorithms.',
    answer: 'Simon\'s algorithm finds a hidden period bitstring s for a 2-to-1 function f(x) = f(y) ⇔ x ⊕ y ∈ {0ⁿ, s}.\n\n• Classical Complexity: Any randomized classical algorithm requires Ω(2^{n/2}) queries (due to the Birthday Paradox) to find collision pairs and extract s.\n• Quantum Complexity: Simon\'s algorithm finds s in O(n) quantum queries!\n\nHistoric Impact:\nSimon\'s algorithm provided the first mathematical proof of an exponential speedup for a quantum algorithm over ANY classical probabilistic algorithm, directly inspiring Peter Shor to invent Shor\'s factoring algorithm.',
    keyTakeaway: 'Simon\'s algorithm demonstrates exponential speedup O(n) vs Ω(2ⁿ/²) classical queries, inspiring Shor\'s algorithm.',
    formulaOrCode: '\\text{Classical Queries: } O(2^{n/2}), \\quad \\text{Quantum Queries: } O(n), \\quad f(x) = f(y) \\iff y = x \\oplus s'
  },
  {
    id: 'iq-30',
    question: 'Explain Quantum Phase Estimation (QPE) and its algorithmic importance.',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Estimating eigenvalue phase θ where U|u⟩ = e²ᵖⁱⁱθ |u⟩ using controlled unitaries and QFT†.',
    answer: 'Quantum Phase Estimation (QPE) is a key foundational subroutine used in Shor\'s algorithm, HHL matrix inversion, and quantum chemistry simulation.\n\nGoal: Given a unitary operator U and its eigenvector |u⟩ such that U|u⟩ = e^{2πiθ}|u⟩, QPE estimates the phase θ to t bits of precision.\n\nSteps:\n1. State Preparation: Initialize t evaluation qubits in superposition H^{\\otimes t} and target register in eigenvector |u⟩.\n2. Controlled-U Rotations: Apply controlled-U^{2^j} operations to inject phase e^{2πi 2^j θ}.\n3. Inverse QFT (QFT†): Apply inverse QFT to evaluation qubits to convert phase values into computational basis state |2^t θ⟩.\n4. Measurement: Measure evaluation qubits to read out binary digits of phase θ.',
    keyTakeaway: 'QPE estimates phase θ of unitary eigenvector U|u⟩ = e²ᵖⁱⁱθ |u⟩ using controlled power unitaries and QFT†.',
    formulaOrCode: 'U|u\\rangle = e^{2\\pi i \\theta}|u\\rangle, \\quad |0\\rangle^{\\otimes t}|u\\rangle \\xrightarrow{\\text{Controlled-}U, \\text{QFT}^\\dagger} |2^t \\theta\\rangle|u\\rangle'
  },
  {
    id: 'iq-31',
    question: 'How does QAOA (Quantum Approximate Optimization Algorithm) solve combinatorial problems like Max-Cut?',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Alternating cost and mixer Hamiltonians for graph partitioning and QUBO.',
    answer: 'QAOA is a variational quantum algorithm designed to find approximate solutions for NP-hard combinatorial optimization problems (e.g. Max-Cut, Travelling Salesperson, QUBO).\n\nFormulation:\n1. Cost Hamiltonian (H_C): Encodes the problem constraints into diagonal Pauli-Z terms. Energy corresponds to graph cut value.\n2. Mixer Hamiltonian (H_B): Sum of Pauli-X gates on all qubits to drive state transitions.\n3. Circuit Ansatz: Alternates p layers of cost evolution e^{-i γₗ H_C} and mixer evolution e^{-i βₗ H_B} starting from superposition |+⟩ⁿ.\n4. Parameter Optimization: Classical optimizer adjusts 2p parameters (γ, β) to maximize expected graph cut ⟨H_C⟩.',
    keyTakeaway: 'QAOA alternates cost Hamiltonian H_C (Pauli-Z) and mixer Hamiltonian H_B (Pauli-X) to solve Max-Cut.',
    formulaOrCode: '|\\gamma, \\beta\\rangle = \\prod_{l=1}^p e^{-i \\beta_l H_B} e^{-i \\gamma_l H_C} |+\\rangle^{\\otimes n}'
  },
  {
    id: 'iq-32',
    question: 'What are Quantum Feature Maps and Quantum Kernels in Quantum Machine Learning (QML)?',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Mapping classical data x into high-dimensional Hilbert space for quantum SVM classification.',
    answer: 'Quantum Machine Learning (QML) uses quantum feature maps Φ(x) to embed classical data vector x into a high-dimensional quantum Hilbert space state |Φ(x)⟩.\n\nQuantum Kernel Estimation:\nClassical SVMs struggle when data is non-linearly separable. In QML, a quantum computer evaluates the inner product kernel matrix:\nK(x_i, x_j) = |⟨Φ(x_i)|Φ(x_j)⟩|²\nby running a circuit U(x_i) followed by U†(x_j) and measuring probability of state |0...0⟩.\n\nAdvantage: Quantum feature maps (like ZZFeatureMap) can project data into Hilbert spaces that are exponentially hard to compute classically, allowing linear separation of complex data.',
    keyTakeaway: 'Quantum feature maps Φ(x) embed data in Hilbert space; Quantum Kernel K(xᵢ,xⱼ) evaluates overlap for SVMs.',
    formulaOrCode: 'K(x_i, x_j) = |\\langle \\Phi(x_i) | \\Phi(x_j) \\rangle|^2 = |\\langle 0 | U^\\dagger(x_j) U(x_i) | 0 \\rangle|^2'
  },
  {
    id: 'iq-33',
    question: 'What is the Barren Plateau problem in Variational Quantum Circuit optimization?',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Exponential gradient vanishing phenomenon in deep random parameterized circuits.',
    answer: 'A Barren Plateau is a fundamental phenomenon in Variational Quantum Algorithms (VQAs) where cost function gradients decrease exponentially with the number of qubits n.\n\nCause:\nDeep, random parameterized ansatzes behave like Haar-random unitary states. According to McClean et al. (2018), the variance of cost function partial derivatives satisfies Var[∂_θ C] ∈ O(2⁻ⁿ).\n\nConsequence:\nOn large qubit systems, gradient values become smaller than quantum measurement shot noise, causing classical optimizers to stall completely.\n\nMitigation Strategies:\n• Using problem-inspired shallow ansatzes (e.g. Hardware-Efficient or ADAPT-VQE).\n• Local cost functions instead of global cost functions.\n• Layer-by-layer parameter initialization.',
    keyTakeaway: 'Barren plateaus cause gradients to vanish exponentially O(2⁻ⁿ), requiring shallow, problem-inspired ansatzes.',
    formulaOrCode: '\\text{Var}_{\\theta} \\left[ \\frac{\\partial C}{\\partial \\theta_k} \\right] \\in O(2^{-n}) \\implies \\text{Exponential Gradient Vanishing}'
  },
  {
    id: 'iq-34',
    question: 'What is the HHL Algorithm and what speedup does it provide for linear systems Ax = b?',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Harrow-Hassidim-Lloyd algorithm for solving linear systems Ax = b exponentially faster.',
    answer: 'The HHL algorithm (Harrow, Hassidim, Lloyd - 2009) solves linear systems of equations Ax = b on a quantum computer.\n\n• Classical Complexity: Conjugate gradient methods take O(N s κ) operations for N x N matrix A with sparsity s and condition number κ.\n• Quantum Complexity: HHL finds the quantum state vector |x⟩ proportional to A⁻¹|b⟩ in O(log(N) s² κ²) time—an exponential speedup in matrix dimension N!\n\nKey Steps: State preparation |b⟩ → Quantum Phase Estimation of A → Controlled rotation of ancilla qubit by 1/λᵢ → Inverse QPE → Measurement filter.',
    keyTakeaway: 'HHL solves linear systems Ax = b in O(log N) time vs O(N) classical time, providing exponential speedup in N.',
    formulaOrCode: '\\text{Classical: } O(N s \\kappa), \\quad \\text{HHL Quantum: } O((\\log N) s^2 \\kappa^2)'
  },
  {
    id: 'iq-35',
    question: 'What is the Parameter Shift Rule and why is it used instead of finite differences for QNN gradients?',
    category: 'Algorithms',
    difficulty: 'Advanced',
    summary: 'Analytic gradient evaluation of parameterized quantum circuits on real quantum hardware.',
    answer: 'The Parameter Shift Rule evaluates EXACT analytical partial derivatives of quantum circuit expectation values ⟨O⟩_θ with respect to gate parameters θ on physical hardware.\n\nFormula:\n∂⟨O⟩ / ∂θ = [ ⟨O⟩_{θ + π/2} - ⟨O⟩_{θ - π/2} ] / 2\n\nWhy Finite Differences Fail on QPU:\nNumerical finite differences (f(θ+ε) - f(θ))/ε fail on real quantum devices because measurement shot noise swamps small ε perturbations. Parameter shift shifts parameters by large angles (±π/2), yielding exact analytic gradients unaffected by numerical instability!',
    keyTakeaway: 'Parameter shift evaluates exact analytic gradients by shifting θ by ±π/2, bypassing shot-noise numerical issues.',
    formulaOrCode: '\\frac{\\partial \\langle O \\rangle}{\\partial \\theta} = \\frac{\\langle O \\rangle_{\\theta + \\pi/2} - \\langle O \\rangle_{\\theta - \\pi/2}}{2}'
  },

  // ==================== CODING & QISKIT (36-44) ====================
  {
    id: 'iq-36',
    question: 'Write a Qiskit (Python 1.0+) code snippet to create a Bell State and measure it.',
    category: 'Coding & Qiskit',
    difficulty: 'Intermediate',
    summary: 'Complete Qiskit Python 1.0+ program generating and simulating a Bell state.',
    answer: 'Here is the canonical modern Qiskit code snippet using QuantumCircuit and Statevector / Sampler:\n\n```python\nfrom qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector\n\n# 1. Create a 2-qubit, 2-classical bit circuit\nqc = QuantumCircuit(2, 2)\n\n# 2. Put Qubit 0 into superposition\nqc.h(0)\n\n# 3. Entangle Qubit 0 and Qubit 1\nqc.cx(0, 1)\n\n# 4. Measure both qubits into classical bits\nqc.measure([0, 1], [0, 1])\n\n# Print circuit representation\nprint("Quantum Circuit:")\nprint(qc.draw())\n```',
    keyTakeaway: 'Modern Qiskit uses QuantumCircuit(2, 2), qc.h(0), qc.cx(0, 1), and qc.measure() to build Bell states.',
    formulaOrCode: 'qc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure([0, 1], [0, 1])'
  },
  {
    id: 'iq-37',
    question: 'What is Qiskit Transpilation and why is it required before executing code on physical QPUs?',
    category: 'Coding & Qiskit',
    difficulty: 'Intermediate',
    summary: 'Mapping virtual circuits onto physical hardware coupling graphs and native gate sets.',
    answer: 'Qiskit Transpilation is the compilation process of rewriting an abstract quantum circuit into an optimized circuit compatible with a target physical Quantum Processing Unit (QPU).\n\nWhy Transpilation is Mandatory:\n1. Native Gate Matching: Physical QPUs only support a native gate set (e.g. RZ, SX, CNOT, ECR). Non-native gates (Hadamard, Toffoli) must be decomposed.\n2. Topology Routing: Qubits on a physical chip are connected in a specific coupling graph (e.g. heavy-hex). CNOT gates between non-adjacent qubits require routing via SWAP gates.\n3. Optimization: Transpilers cancel redundant adjacent gates (e.g. H · H = I) to minimize circuit depth and execution noise.',
    keyTakeaway: 'Transpilation maps virtual circuits to physical hardware native gates, layout topology, and optimized depth.',
    formulaOrCode: 'from qiskit.compiler import transpile\ncompiled_qc = transpile(qc, backend=backend, optimization_level=3)'
  },
  {
    id: 'iq-38',
    question: 'Explain Qiskit Primitives: Sampler vs. Estimator.',
    category: 'Coding & Qiskit',
    difficulty: 'Intermediate',
    summary: 'Core execution interfaces in Qiskit 1.0+ for quasi-probabilities vs operator expectation values.',
    answer: 'In Qiskit 1.0+, execution is standardized into two core Primitive interfaces:\n\n1. Sampler Primitive:\n• Purpose: Evaluates quantum circuits and returns bitstring quasi-probability counts (e.g. {"00": 512, "11": 512}).\n• Primary Use Cases: Quantum algorithms producing discrete output bitstrings, such as Grover search, Shor factoring, and Bernstein-Vazirani.\n\n2. Estimator Primitive:\n• Purpose: Evaluates expected value ⟨ψ|H|ψ⟩ of target observable Hamiltonians H.\n• Primary Use Cases: Variational algorithms calculating continuous energy values, such as VQE chemistry ground states, QAOA graph cut costs, and QML loss functions.',
    keyTakeaway: 'Sampler returns bitstring shot counts; Estimator calculates Hamiltonian expectation values ⟨ψ|H|ψ⟩.',
    formulaOrCode: 'from qiskit.primitives import StatevectorSampler, StatevectorEstimator'
  },
  {
    id: 'iq-39',
    question: 'How do Parameterized Circuits work in Qiskit using Parameter objects?',
    category: 'Coding & Qiskit',
    difficulty: 'Intermediate',
    summary: 'Creating reusable circuits with symbolic rotation angles θ for variational optimization.',
    answer: 'Parameterized circuits allow developers to construct a quantum circuit containing symbolic parameters (angles θ) without recompiling the circuit structure for every optimization step.\n\nQiskit Usage:\n```python\nfrom qiskit.circuit import QuantumCircuit, Parameter\n\n# Create symbolic parameters\ntheta = Parameter("θ")\nphi = Parameter("φ")\n\nqc = QuantumCircuit(1)\nqc.rx(theta, 0)\nqc.rz(phi, 0)\n\n# Assign numerical values at runtime\nbound_qc = qc.assign_parameters({theta: 1.57, phi: 3.14})\n```\nBenefit: Enables fast parameter updates during VQE/QAOA classical optimization loops.',
    keyTakeaway: 'Parameter objects allow symbolic rotation angles qc.rx(theta, 0), avoiding costly re-transpilation.',
    formulaOrCode: 'theta = Parameter("\\theta")\nqc.rx(theta, 0)\nbound_qc = qc.assign_parameters({theta: np.pi/2})'
  },
  {
    id: 'iq-40',
    question: 'What is the difference between Statevector Simulation and Shot-Based Simulation in Qiskit?',
    category: 'Coding & Qiskit',
    difficulty: 'Beginner',
    summary: 'Exact state vector amplitudes vs statistical sampling shot noise.',
    answer: '• Statevector Simulation:\n  - Computes the exact 2ⁿ complex probability amplitude vector |ψ⟩ using exact linear algebra.\n  - Deterministic: Returns exact mathematical values without measurement shot noise.\n  - Memory Limit: Limited to ~30 qubits because storing 2³⁰ complex numbers requires ~16 GB RAM.\n\n• Shot-Based Simulation (Aer / Sampler):\n  - Simulates physical measurement collapse by taking N discrete samples (shots, e.g. 1024 or 8192 shots).\n  - Realistic: Includes statistical sampling noise (shot noise ∝ 1/√N) matching real hardware execution.\n  - Scalability: Can simulate larger noisy circuits using tensor network approximations.',
    keyTakeaway: 'Statevector computes exact math (no noise, memory bound ~30 qubits); Shot-based simulates sampling (shot noise ∝ 1/√N).',
    formulaOrCode: '\\text{Shot Noise Error} \\propto \\frac{1}{\\sqrt{\\text{Shots}}}, \\quad \\text{Statevector Memory} = 2^n \\times 16 \\text{ Bytes}'
  },
  {
    id: 'iq-41',
    question: 'How do Mid-Circuit Measurements and Dynamic Circuits work in Qiskit?',
    category: 'Coding & Qiskit',
    difficulty: 'Advanced',
    summary: 'Real-time measurement and conditional classical control flow inside running circuits.',
    answer: 'Dynamic Circuits allow real-time mid-circuit measurements and classical control flow (if-statements, loops, resets) during circuit execution before all qubits are finished.\n\nQiskit Syntax:\nqc = QuantumCircuit(2, 1)\nqc.h(0)\nqc.measure(0, 0)\nwith qc.if_test((c[0], 1)):\n    qc.x(1)\n\nApplications: Essential for Quantum Teleportation, active Quantum Error Correction syndrome resets, and Repeat-Until-Success algorithms.',
    keyTakeaway: 'Dynamic circuits allow mid-circuit measurement and classical conditional logic with qc.if_test().',
    formulaOrCode: 'with qc.if_test((c[0], 1)):\n    qc.x(1)'
  },
  {
    id: 'iq-42',
    question: 'How do you build a custom Quantum Noise Model in Qiskit Aer?',
    category: 'Coding & Qiskit',
    difficulty: 'Advanced',
    summary: 'Simulating thermal relaxation (T1, T2) and readout errors in Qiskit Aer.',
    answer: 'Qiskit Aer allows developers to build custom noise models to simulate real physical quantum hardware noise on local computers.\n\nKey Noise Types:\n1. Depolarizing Noise: Randomly replaces qubit state with maximum mixed state I/2.\n2. Thermal Relaxation Noise: Models physical T1 energy decay and T2 dephasing.\n3. Readout Error: Models measurement state flipping (0 measured as 1 or 1 measured as 0).\n\nCode Pattern:\nfrom qiskit_aer.noise import NoiseModel, depolarizing_error\nnoise_model = NoiseModel()\nnoise_model.add_all_qubit_quantum_error(depolarizing_error(0.01, 1), ["u1", "u2", "u3"])',
    keyTakeaway: 'Qiskit Aer NoiseModel simulates gate errors, T1/T2 relaxation, and measurement readout errors locally.',
    formulaOrCode: 'noise_model = NoiseModel()\nnoise_model.add_all_qubit_quantum_error(depolarizing_error(0.01, 1), ["cx"])'
  },
  {
    id: 'iq-43',
    question: 'What is OpenQASM 3.0 and how does it differ from OpenQASM 2.0?',
    category: 'Coding & Qiskit',
    difficulty: 'Intermediate',
    summary: 'Intermediate representation language for quantum circuits with advanced control flow.',
    answer: 'OpenQASM (Open Quantum Assembly Language) is an imperative programming language representation for quantum circuits.\n\nDifferences:\n• OpenQASM 2.0: Static circuit description language. Supported basic gate applications and final measurements, but no complex control flow or timing.\n• OpenQASM 3.0: Modern hardware-agnostic specification. Supports dynamic control flow (while loops, arbitrary subroutines, classical variables), pulse-level timing calibration, and real-time classical feedback.\n\nQiskit Integration: `dumps(qc)` and `loads(qasm_str)` convert Qiskit QuantumCircuit objects to/from OpenQASM 3 strings.',
    keyTakeaway: 'OpenQASM 3.0 adds real-time classical control flow, loops, pulse calibration, and dynamic timing to quantum assembly.',
    formulaOrCode: 'from qiskit.qasm3 import dumps\nqasm_string = dumps(qc)'
  },
  {
    id: 'iq-44',
    question: 'How do Fake Backends in Qiskit help simulate real IBM Quantum devices?',
    category: 'Coding & Qiskit',
    difficulty: 'Beginner',
    summary: 'Using snapshot calibration data (FakeBrisbane, FakeSherbrooke) for offline realistic testing.',
    answer: 'Qiskit provides Fake Backend objects (e.g. `FakeBrisbane`, `FakeSherbrooke`) inside `qiskit_ibm_runtime.fake_provider` that mimic real physical IBM Quantum hardware offline.\n\nWhy Use Fake Backends:\n1. Coupling Graph & Topology: Includes exact physical qubit connectivity maps for transpilation testing.\n2. Measured Calibration Data: Includes real T1, T2 times, readout errors, and gate error rates captured during actual device calibration.\n3. Free Offline Execution: Allows testing hardware-constrained code locally without needing an active IBM Quantum API key or waiting in cloud queues!',
    keyTakeaway: 'Fake backends provide offline device topology and real calibration error data for hardware testing.',
    formulaOrCode: 'from qiskit_ibm_runtime.fake_provider import FakeBrisbane\nbackend = FakeBrisbane()'
  },

  // ==================== HARDWARE & SECURITY (45-54) ====================
  {
    id: 'iq-45',
    question: 'Compare Superconducting Qubits vs Trapped Ion Qubits. What are their pros and cons?',
    category: 'Hardware & Security',
    difficulty: 'Intermediate',
    summary: 'Hardware modality trade-offs between speed, coherence time, and connectivity.',
    answer: '• Superconducting Qubits (IBM, Google, Rigetti):\n  - Mechanics: Lithographic LC circuits made of superconducting metals (niobium/aluminum) operating near absolute zero (~15 mK).\n  - Pros: Ultra-fast gate speeds (nanoseconds), chip scalability via semiconductor manufacturing.\n  - Cons: Short coherence times (~100 μs), limited nearest-neighbor connectivity requiring SWAP routing.\n\n• Trapped Ion Qubits (IonQ, Quantinuum):\n  - Mechanics: Individual charged Ytterbium or Barium ions suspended in vacuum traps using RF electric fields and manipulated by lasers.\n  - Pros: Long coherence times (seconds/minutes), high-fidelity gates (>99.9%), all-to-all qubit connectivity.\n  - Cons: Slower gate speeds (microseconds to milliseconds), optical laser control scalability challenges.',
    keyTakeaway: 'Superconducting = Fast gates & scalable chips (shorter coherence); Trapped Ion = Long coherence & all-to-all connectivity (slower gates).'
  },
  {
    id: 'iq-46',
    question: 'What are Photonic Quantum Computers and Neutral Atom Quantum Computers?',
    category: 'Hardware & Security',
    difficulty: 'Advanced',
    summary: 'Alternative QPU modalities: room-temperature optical light vs optical-tweezer atomic arrays.',
    answer: '• Photonic Quantum Computing (Xanadu, PsiQuantum):\n  - Mechanics: Encodes qubits in squeezed light states or single photons traveling through optical waveguides.\n  - Key Advantage: Operates at room temperature (no dilution fridges needed) and photons travel long distances at light speed naturally.\n  - Challenge: Photons do not interact naturally; 2-qubit gates require probabilistic measurement interference.\n\n• Neutral Atom Quantum Computing (QuEra, Pasqal):\n  - Mechanics: Uncharged neutral Rubidium/Cesium atoms trapped in 2D/3D grids using optical laser tweezers and excited to high-energy Rydberg states.\n  - Key Advantage: Dynamic reconfigurable qubit geometry (tweezers physically move atoms) and large qubit counts (256+ qubits).',
    keyTakeaway: 'Photonic = Room-temperature light waveguides; Neutral Atoms = Reconfigurable 2D/3D laser tweezer grids with Rydberg interactions.'
  },
  {
    id: 'iq-47',
    question: 'Why is a Dilution Refrigerator necessary for Superconducting Quantum Computers?',
    category: 'Hardware & Security',
    difficulty: 'Beginner',
    summary: 'Cooling superconducting chips to ~15 mK to prevent thermal energy state corruption.',
    answer: 'Superconducting quantum computers must operate inside cryogenic Dilution Refrigerators at temperatures around 15 millikelvin (-273.13°C)—colder than deep space!\n\nWhy Ultra-Cold Temperatures Are Required:\n1. Superconductivity: Aluminum and niobium circuits only display zero electrical resistance below their critical temperature T_c.\n2. Thermal Energy Suppression: At room temperature, thermal energy k_B T is millions of times larger than the tiny microwave energy difference ΔE = ℏω between qubit states |0⟩ and |1⟩. Cooling to 15 mK ensures thermal noise does not randomly flip qubits from |0⟩ to |1⟩!',
    keyTakeaway: 'Dilution fridges cool QPUs to ~15 mK so thermal energy k_B T is smaller than qubit transition energy ℏω.',
    formulaOrCode: 'k_B T \\ll \\hbar \\omega_{01}, \\quad T \\approx 15 \\text{ mK} = -273.13^\\circ\\text{C}'
  },
  {
    id: 'iq-48',
    question: 'What is the No-Cloning Theorem in quantum mechanics? Prove why cloning is impossible.',
    category: 'Hardware & Security',
    difficulty: 'Intermediate',
    summary: 'Mathematical proof prohibiting exact duplication of arbitrary unknown quantum states.',
    answer: 'The No-Cloning Theorem proves that it is physically impossible to create an exact duplicate copy of an arbitrary unknown quantum state |ψ⟩.\n\nProof Intuition:\nSuppose a unitary cloning operator U existed such that U(|ψ⟩|0⟩) = |ψ⟩|ψ⟩ and U(|ϕ⟩|0⟩) = |ϕ⟩|ϕ⟩ for any arbitrary states.\nTaking the inner product of both equations:\n⟨ψ|ϕ⟩ = (⟨ψ|ϕ⟩)²\nThis quadratic equation x = x² has only two solutions: x = 0 or x = 1.\nThus, cloning is ONLY possible if |ψ⟩ and |ϕ⟩ are orthogonal or identical! An arbitrary unknown state cannot be cloned.',
    keyTakeaway: 'Linearity of quantum mechanics forbids copying unknown states, enforcing physical quantum security.',
    formulaOrCode: '\\langle \\psi | \\phi \\rangle = (\\langle \\psi | \\phi \\rangle)^2 \\implies \\langle \\psi | \\phi \\rangle \\in \\{0, 1\\}'
  },
  {
    id: 'iq-49',
    question: 'Why is Quantum Error Correction (QEC) necessary and how do surface codes protect logical qubits?',
    category: 'Hardware & Security',
    difficulty: 'Advanced',
    summary: 'Redundant physical qubit encoding and stabilizer syndrome measurements.',
    answer: 'Quantum systems are susceptible to environmental noise (decoherence, bit-flips X, and phase-flips Z). Because quantum measurement destroys superposition, we cannot check qubits directly.\n\nQEC Solution:\nQEC encodes 1 protected Logical Qubit across an array of physical qubits using stabilizer codes. Surface codes arrange physical qubits on a 2D grid with alternating Data Qubits and Ancilla Syndrome Qubits.\n\nSyndrome measurements check stabilizer operators (Z-type for bit flips, X-type for phase flips) without measuring data qubits directly. This detects and corrects errors continuously before they corrupt computation.',
    keyTakeaway: 'Surface codes perform indirect syndrome measurements on ancilla qubits to fix physical errors without collapsing logical data.',
    formulaOrCode: 'S_i |\\psi_L\\rangle = +1 |\\psi_L\\rangle, \\quad \\text{Threshold error } p_c \\approx 1\\%'
  },
  {
    id: 'iq-50',
    question: 'What is the Eastin-Knill Theorem and why does it affect fault-tolerant gate implementation?',
    category: 'Hardware & Security',
    difficulty: 'Advanced',
    summary: 'No quantum error-correcting code can implement a universal gate set using only transversal gates.',
    answer: 'The Eastin-Knill Theorem (2009) is a fundamental theorem in quantum error correction stating that NO quantum error-correcting code can implement a continuous universal gate set using only transversal (fault-tolerant logical) gates.\n\nTransversal Gates:\nTransversal gates act qubit-by-qubit independently across code blocks, preventing physical error propagation.\n\nImplication:\nWhile Clifford gates (CNOT, H, S) can be implemented transversally in many codes, non-Clifford gates (like the T gate required for universality) CANNOT be transversal.\n\nSolution: Fault-tolerant architectures must use Magic State Distillation to distill noisy ancilla states into pure T-states!',
    keyTakeaway: 'Eastin-Knill proves transversal gates cannot be universal; non-Clifford T-gates require magic state distillation.',
    formulaOrCode: '\\text{Transversal Gates } U_L = U^{\\otimes n} \\implies \\text{Cannot be Universal for QEC}'
  },
  {
    id: 'iq-51',
    question: 'How does Quantum Key Distribution (QKD BB84) guarantee unhackable security using physics?',
    category: 'Hardware & Security',
    difficulty: 'Intermediate',
    summary: 'Information-theoretic security guaranteed by No-Cloning and measurement collapse.',
    answer: 'Quantum Key Distribution (QKD), such as the BB84 protocol, allows two parties (Alice and Bob) to create a shared, secret random encryption key.\n\nWhy Physics Guarantees Security:\n1. Single Photons: Alice transmits secret bit values encoded in single-photon polarization bases (Rectilinear +/-, Diagonal ↗↘).\n2. Eavesdropper Detection: If a hacker (Eve) intercepts a photon, quantum mechanics forces Eve to measure it. Measurement collapses the state and introduces detectable error rates (Quantum Bit Error Rate - QBER > 11%).\n3. No-Cloning Theorem: Eve cannot clone the photon to inspect later.\n\nIf QBER is low, Alice and Bob perform privacy amplification to generate an unhackable One-Time Pad key!',
    keyTakeaway: 'QKD uses quantum collapse & no-cloning so any eavesdropping attempt instantly leaves detectable trace errors.',
    formulaOrCode: '\\text{QBER} > 11\\% \\implies \\text{Abort Key Generation (Eve Detected)}'
  },
  {
    id: 'iq-52',
    question: 'What is Post-Quantum Cryptography (PQC) and why is RSA vulnerable to Shor\'s algorithm?',
    category: 'Hardware & Security',
    difficulty: 'Intermediate',
    summary: 'Transitioning from vulnerable RSA/ECC to lattice-based quantum-resistant algorithms.',
    answer: 'RSA and Elliptic Curve Cryptography (ECC) rely on the classical hardness of Integer Factorization and Discrete Logarithms. Shor\'s algorithm solves integer factorization in polynomial time O((log N)³), rendering current RSA-2048 keys breakable by future quantum computers.\n\nPost-Quantum Cryptography (PQC):\nPQC refers to new mathematical cryptographic algorithms designed to run on standard classical hardware that are resistant to attacks from both classical and quantum computers.\n\nNIST Standards (2024):\n• ML-KEM (CRYSTALS-Kyber): For general public-key encryption & key exchange.\n• ML-DSA (CRYSTALS-Dilithium): For digital signatures.\nThese standards rely on hard lattice problems (e.g. Learning With Errors - LWE) that have no known quantum speedup.',
    keyTakeaway: 'Shor breaks RSA/ECC; NIST PQC standards (ML-KEM, ML-DSA) use lattice math to keep systems secure.',
    formulaOrCode: '\\text{Shor RSA Factoring: } O((\\log N)^3) \\text{ vs Classical } O(e^{c \\sqrt[3]{\\log N \\log \\log N}})'
  },
  {
    id: 'iq-53',
    question: 'What is Quantum Supremacy (Quantum Advantage) and how was it benchmarked?',
    category: 'Hardware & Security',
    difficulty: 'Intermediate',
    summary: 'Demonstrating a QPU executing a task beyond the reach of the world\'s fastest supercomputers.',
    answer: 'Quantum Supremacy (or Quantum Advantage) is the technical milestone demonstrating a quantum processor performing a well-defined computational task that is practically impossible for any classical supercomputer to execute in a reasonable timeframe.\n\nHistoric Milestones:\n1. Google Sycamore (2019): A 53-qubit superconducting chip performed Random Circuit Sampling in 200 seconds, a task estimated to take classical supercomputers thousands of years.\n2. USTC Jiuzhang (2020): Gaussian Boson Sampling using photonic quantum hardware.\n\nSignificance: Proves that quantum speedup is physically real and not just theoretical math!',
    keyTakeaway: 'Quantum supremacy proves physical QPUs can outperform top supercomputers on specific tasks.',
    formulaOrCode: '\\text{Sycamore QPU: } 200 \\text{ seconds vs Supercomputer: } 10,000 \\text{ years}'
  },
  {
    id: 'iq-54',
    question: 'What is Quantum Volume (QV) and why is it a better benchmark than raw qubit count?',
    category: 'Hardware & Security',
    difficulty: 'Intermediate',
    summary: 'Single metric measuring qubit count, gate fidelity, connectivity, and circuit depth.',
    answer: 'Quantum Volume (QV) is a holistic metric introduced by IBM to quantify the overall capability and computational power of a quantum processor.\n\nWhy Raw Qubit Count is Misleading:\nA system with 100 noisy qubits and low gate fidelity cannot execute complex algorithms. Quantum Volume evaluates:\n• Number of physical qubits\n• Single-qubit and 2-qubit gate error rates\n• Qubit connectivity graph\n• Compiler transpilation efficiency\n• Readout fidelity\n\nDefinition: The maximum size square random circuit of width d and depth d that the QPU can execute with high success probability. Measured as QV = 2ᵈ.',
    keyTakeaway: 'Quantum Volume (QV = 2ᵈ) measures true QPU power considering qubit count, gate fidelity, depth, and connectivity.',
    formulaOrCode: '\\text{Quantum Volume } V_Q = 2^d, \\quad \\text{where } d = \\text{max square circuit depth}'
  }
];
