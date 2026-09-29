export const quizContent: Record<string, { question: string, options: string[], answer: number, explanation: string }[]> = {
  // School Quizzes (Chapters 1 to 18)
  'sch-1': [
    {
      question: "What is an electronic computer?",
      options: ["A device that accepts input data, processes it, and produces output", "A box that creates food recipes", "A screen that only plays movies", "A machine that needs no electricity"],
      answer: 0,
      explanation: "A computer follows the Input-Process-Output model to perform calculations and solve problems."
    },
    {
      question: "Which computer type handles massive scientific calculations and simulations?",
      options: ["Microcomputer", "Supercomputer", "Smartwatch", "Calculator"],
      answer: 1,
      explanation: "Supercomputers combine thousands of processors to tackle huge tasks like climate modeling."
    }
  ],
  'sch-2': [
    {
      question: "Which component acts as the 'brain' of a computer?",
      options: ["Hard Drive", "CPU (Central Processing Unit)", "Keyboard", "Power Cable"],
      answer: 1,
      explanation: "The CPU executes instructions and carries out calculations for the computer."
    },
    {
      question: "What is the main difference between RAM and storage?",
      options: ["RAM is long-term, storage is short-term", "RAM is ultra-fast temporary memory, while storage saves files permanently", "Storage is only used when the PC is OFF", "There is no difference"],
      answer: 1,
      explanation: "RAM keeps active apps open quickly in volatile memory, while storage saves your files long-term."
    }
  ],
  'sch-3': [
    {
      question: "Which number system uses only two digits: 0 and 1?",
      options: ["Decimal (Base-10)", "Binary (Base-2)", "Octal (Base-8)", "Hexadecimal (Base-16)"],
      answer: 1,
      explanation: "Binary is base-2, representing LOW (0) and HIGH (1) voltage states in microchips."
    },
    {
      question: "What is the decimal equivalent of the binary number 1011₂?",
      options: ["9", "10", "11", "13"],
      answer: 2,
      explanation: "1011₂ = (1×8) + (0×4) + (1×2) + (1×1) = 8 + 0 + 2 + 1 = 11."
    }
  ],
  'sch-4': [
    {
      question: "Which logic gate flips a bit from 0 to 1 or 1 to 0?",
      options: ["AND Gate", "OR Gate", "NOT Gate (Inverter)", "XOR Gate"],
      answer: 2,
      explanation: "The NOT gate inverts the input bit value."
    },
    {
      question: "When does an AND gate produce an output of 1?",
      options: ["When at least one input is 1", "When ALL inputs are 1", "When both inputs are 0", "Never"],
      answer: 1,
      explanation: "An AND gate requires all of its inputs to be 1 to output 1."
    }
  ],
  'sch-5': [
    {
      question: "How do quantum computers process information differently than classical computers?",
      options: ["They use light switches only", "They use qubits that can exist in superposition of 0 and 1 simultaneously", "They run slower than pocket calculators", "They do not use electricity"],
      answer: 1,
      explanation: "Quantum computers use qubits in superposition to evaluate millions of possibilities at once."
    },
    {
      question: "Why do we need quantum computers?",
      options: ["To play 2D pixel games faster", "To solve massive problems like molecular drug discovery and optimization beyond classical supercomputers", "To replace home keyboards", "To turn off the internet"],
      answer: 1,
      explanation: "Quantum hardware solves complex multi-variable problems that would take supercomputers thousands of years."
    }
  ],
  'sch-6': [
    {
      question: "What is Wave-Particle Duality?",
      options: ["Water turning into ice", "Subatomic entities like light and electrons exhibiting both wave and particle properties", "Two waves canceling each other out", "A double rainbow"],
      answer: 1,
      explanation: "In quantum physics, microscopic particles behave as both solid particles and spreading waves."
    }
  ],
  'sch-7': [
    {
      question: "If a classical bit is like a coin lying flat, what is a qubit like?",
      options: ["A coin melted into water", "A spinning coin standing on edge holding probabilities of both Heads and Tails", "A square block", "A paper bill"],
      answer: 1,
      explanation: "While spinning, a coin represents a qubit in a superposition state before it is measured."
    },
    {
      question: "On the simple 3D Bloch Sphere, what do the North and South poles represent?",
      options: ["The sun and moon", "State |0⟩ at the North Pole and state |1⟩ at the South Pole", "Positive and negative gravity", "RAM and CPU"],
      answer: 1,
      explanation: "The North Pole represents computational basis state |0⟩ and the South Pole represents |1⟩."
    }
  ],
  'sch-8': [
    {
      question: "What happens when you measure a qubit in superposition?",
      options: ["It spins faster", "Its superposition collapses into a single definite state (0 or 1)", "It creates a new qubit", "Nothing changes"],
      answer: 1,
      explanation: "Measurement forces a superposition to collapse into a single observed classical outcome."
    }
  ],
  'sch-9': [
    {
      question: "What is quantum entanglement?",
      options: ["Tangled wires inside a computer tower", "A special quantum connection where measuring one qubit instantly determines the state of another", "A computer virus", "A type of battery"],
      answer: 1,
      explanation: "Entangled qubits share a linked state across any distance."
    }
  ],
  'sch-10': [
    {
      question: "Which quantum gate puts a qubit into equal superposition?",
      options: ["Identity (I) Gate", "Pauli-X Gate", "Hadamard (H) Gate", "Measurement Meter"],
      answer: 2,
      explanation: "The Hadamard (H) gate transforms basis state |0⟩ into equal superposition state |+⟩."
    }
  ],
  'sch-11': [
    {
      question: "How do you read a quantum circuit diagram?",
      options: ["Right to left", "Left to right along horizontal qubit lines", "Bottom to top only", "Diagonally"],
      answer: 1,
      explanation: "Quantum circuit diagrams are read sequentially from left to right along qubit wires."
    }
  ],
  'sch-12': [
    {
      question: "Which programming language is most widely used for quantum SDKs like Qiskit?",
      options: ["C++", "Python", "HTML", "BASIC"],
      answer: 1,
      explanation: "Python is the primary language for Qiskit, Cirq, and PennyLane quantum SDKs."
    }
  ],
  'sch-13': [
    {
      question: "What did the Deutsch Algorithm prove?",
      options: ["Quantum computers can run games", "Quantum algorithms can solve a problem in fewer queries than any classical algorithm", "How to build a transistor", "That bits are faster than qubits"],
      answer: 1,
      explanation: "Deutsch's algorithm demonstrated the first mathematical proof of quantum computational speedup."
    }
  ],
  'sch-14': [
    {
      question: "Why do superconducting quantum computers use dilution refrigerators?",
      options: ["To prevent fans from making noise", "To cool qubits down near absolute zero (-273°C) so thermal heat doesn't ruin quantum states", "To save electricity", "To freeze water"],
      answer: 1,
      explanation: "Near absolute zero temperature, thermal vibrations drop enough for superconducting qubits to operate."
    }
  ],
  'sch-15': [
    {
      question: "What is Quantum Key Distribution (QKD)?",
      options: ["Sending physical metal keys in the mail", "A method of creating unhackable secret encryption keys protected by quantum physics", "A database password manager", "A type of keyboard"],
      answer: 1,
      explanation: "QKD uses photon quantum states so any eavesdropping collapses the state and alerts users."
    }
  ],
  'sch-16': [
    {
      question: "How will quantum computing help medical healthcare?",
      options: ["By printing medical bandages", "By simulating complex molecules and protein folding to discover new life-saving drugs quickly", "By replacing doctors", "By scanning barcodes"],
      answer: 1,
      explanation: "Quantum computers simulate molecular chemistry to accelerate new pharmaceutical discoveries."
    }
  ],
  'sch-17': [
    {
      question: "How can quantum computing help smart cities?",
      options: ["By painting buildings blue", "By optimizing traffic light timing across millions of cars to eliminate traffic jams", "By building taller towers", "By turning off street lights"],
      answer: 1,
      explanation: "Quantum optimization algorithms analyze millions of traffic variables to smooth city travel."
    }
  ],
  'sch-18': [
    {
      question: "In a quantum circuit builder, what happens when you place a Hadamard (H) gate on qubit 0?",
      options: ["The qubit turns off", "Qubit 0 enters an equal superposition state (|0⟩ + |1⟩)/√2", "The circuit deletes itself", "It measures the qubit"],
      answer: 1,
      explanation: "The Hadamard gate creates a 50/50 superposition state on the target qubit wire."
    }
  ],

  // Intermediate Quizzes (Chapters 1 to 17)
  'int-1': [
    { question: "Which architecture model separates the CPU (ALU and Registers) from RAM via a system bus?", options: ["Harvard Architecture", "Von Neumann Architecture", "Turing Engine", "Quantum Lattice"], answer: 1, explanation: "Von Neumann architecture separates the processing unit from memory connected via a system bus." },
    { question: "Why does classical computing hit a physical barrier at sub-nanometer scales?", options: ["Lack of copper", "Quantum tunneling causes electrical leakage through thin gates", "Bits turn into bytes", "CPUs run out of RAM"], answer: 1, explanation: "At atomic scales, quantum tunneling allows electrons to leak across thin transistor gates." }
  ],
  'int-2': [
    { question: "How many binary bits are represented by a single hexadecimal digit?", options: ["2 bits", "4 bits (a nibble)", "8 bits", "16 bits"], answer: 1, explanation: "Since 16 = 2⁴, one hex digit represents exactly 4 binary bits." },
    { question: "According to De Morgan's Law, what does NOT(A AND B) equal?", options: ["NOT(A) AND NOT(B)", "NOT(A) OR NOT(B)", "A OR B", "A XOR B"], answer: 1, explanation: "De Morgan's Law states that #(A · B) = #A + #B." }
  ],
  'int-3': [
    { question: "According to Euler's formula, what is e^{iπ} equal to?", options: ["0", "1", "-1", "i"], answer: 2, explanation: "e^{iπ} = cos(π) + i sin(π) = -1 + 0 = -1." },
    { question: "What is the bra ⟨0| of the column ket vector |0⟩ = [1, 0]ᵀ?", options: ["Column vector [0, 1]ᵀ", "Row vector [1, 0]", "Scalar 1", "Matrix [[1,0],[0,1]]"], answer: 1, explanation: "The bra ⟨0| is the conjugate transpose row vector [1, 0]." }
  ],
  'int-4': [
    { question: "Who resolved the Ultraviolet Catastrophe in 1900 by assuming energy is quantized in units E = hf?", options: ["Albert Einstein", "Max Planck", "Niels Bohr", "Erwin Schrödinger"], answer: 1, explanation: "Max Planck discovered energy quantization E = hf in 1900." },
    { question: "According to Heisenberg's Uncertainty Principle, what two properties cannot be measured simultaneously with exact precision?", options: ["Mass and Charge", "Position and Momentum", "Temperature and Volume", "Spin and Speed"], answer: 1, explanation: "Δx · Δp ≥ ℏ/2 limits simultaneous precision of position and momentum." }
  ],
  'int-5': [
    { question: "On the 3D Bloch sphere, what state is located at the South Pole?", options: ["State |0⟩", "State |1⟩", "State |+⟩", "State |-⟩"], answer: 1, explanation: "The North Pole represents |0⟩, and the South Pole represents |1⟩." },
    { question: "How many basis states exist in a multi-qubit Hilbert space with n = 3 qubits?", options: ["3 basis states", "6 basis states", "8 basis states (2³)", "16 basis states"], answer: 2, explanation: "An n-qubit system has 2ⁿ basis states (for 3 qubits, 2³ = 8)." }
  ],
  'int-6': [
    { question: "According to the Born Rule, what determines the probability of measuring state x from state |ψ⟩?", options: ["The sum of amplitudes", "The squared magnitude of the complex amplitude |c_x|²", "The global phase angle", "The qubit voltage"], answer: 1, explanation: "The Born Rule states P(x) = |⟨x|ψ⟩|² = |c_x|²." },
    { question: "What does the No-Cloning Theorem prohibit?", options: ["Measuring qubits", "Creating an exact duplicate copy of an arbitrary unknown quantum state", "Using CNOT gates", "Running Python scripts"], answer: 1, explanation: "Linearity of quantum mechanics forbids making exact copies of unknown quantum states." }
  ],
  'int-7': [
    { question: "Which single-qubit gate transforms computational basis states into equal superpositions |+⟩ and |-⟩?", options: ["Pauli-X Gate", "Pauli-Z Gate", "Hadamard (H) Gate", "Identity Gate"], answer: 2, explanation: "The Hadamard gate H creates equal superposition states H|0⟩ = |+⟩." },
    { question: "How does the Phase S gate relate to the Pauli-Z gate?", options: ["S = Z²", "S² = Z (S adds a π/2 phase shift)", "S = H", "S has no relation"], answer: 1, explanation: "The S gate is the square root of Z, applying a π/2 phase shift." }
  ],
  'int-8': [
    { question: "What action does the 2-qubit CNOT gate perform?", options: ["Flips target qubit unconditionally", "Flips target qubit IF and ONLY IF control qubit is in state |1⟩", "Swaps control and target", "Measures both qubits"], answer: 1, explanation: "CNOT flips target qubit conditionally when control is |1⟩." },
    { question: "How many CNOT gates are required to construct a 2-qubit SWAP gate?", options: ["1 CNOT", "2 CNOTs", "3 alternating CNOTs", "4 CNOTs"], answer: 2, explanation: "SWAP = CNOT(0,1) · CNOT(1,0) · CNOT(0,1)." }
  ],
  'int-9': [
    { question: "Which 2-gate sequence creates the maximally entangled Bell state |Φ⁺⟩ = (|00⟩+|11⟩)/√2 from state |00⟩?", options: ["X on Qubit 0, X on Qubit 1", "Hadamard on Qubit 0, then CNOT(0, 1)", "CNOT(0, 1), then Hadamard on Qubit 0", "Z on Qubit 0, Z on Qubit 1"], answer: 1, explanation: "Applying H on Qubit 0 creates (|00⟩+|10⟩)/√2; CNOT(0,1) entangles to (|00⟩+|11⟩)/√2." },
    { question: "What is the 3-qubit maximally entangled state (|000⟩+|111⟩)/√2 called?", options: ["Bell State", "GHZ State", "W State", "Shor State"], answer: 1, explanation: "Greenberger-Horne-Zeilinger (GHZ) state is (|000⟩+|111⟩)/√2." }
  ],
  'int-10': [
    { question: "Which Python command installs the open-source IBM Qiskit SDK?", options: ["npm install qiskit", "pip install qiskit qiskit-aer", "python get qiskit", "import qiskit"], answer: 1, explanation: "Qiskit is installed via pip install qiskit qiskit-aer." },
    { question: "In Qiskit, how do you add a Hadamard gate to qubit 0 of QuantumCircuit `qc`?", options: ["qc.add_h(0)", "qc.h(0)", "qc.hadamard[0]", "qc.gate('H', 0)"], answer: 1, explanation: "The standard Qiskit method to apply a Hadamard gate is `qc.h(0)`." }
  ],
  'int-11': [
    { question: "How many queries does the Deutsch-Jozsa algorithm take to evaluate an n-bit constant vs balanced function?", options: ["2^{n-1} + 1 queries", "n queries", "1 quantum query", "2^n queries"], answer: 2, explanation: "Deutsch-Jozsa evaluates constant vs balanced status in exactly 1 query." },
    { question: "What is the query time complexity of Grover's search algorithm for an unsorted database of N items?", options: ["O(N)", "O(log N)", "O(√N)", "O(N²)"], answer: 2, explanation: "Grover's algorithm achieves quadratic speedup O(√N) queries." }
  ],
  'int-12': [
    { question: "Why must Superconducting Quantum Computers operate inside cryogenic dilution fridges at ~15 mK?", options: ["To prevent chips from melting", "So thermal energy k_B T is much smaller than qubit transition energy ℏω", "To speed up laser optics", "To save electricity"], answer: 1, explanation: "Cooling to 15 mK suppresses thermal noise from flipping qubit states." },
    { question: "Which hardware modality uses laser tweezers to trap uncharged atoms in 2D/3D grids?", options: ["Superconducting Circuits", "Trapped Ions", "Neutral Atom Quantum Computing", "Photonic Computing"], answer: 2, explanation: "Neutral atom systems (like QuEra) use optical laser tweezers." }
  ],
  'int-13': [
    { question: "What resources are required to teleport an unknown qubit state |ψ⟩ from Alice to Bob?", options: ["1 classical bit and 2 qubits", "1 shared entangled Bell pair + 2 classical bits", "Fiber optic cable only", "No resources"], answer: 1, explanation: "Quantum Teleportation requires 1 pre-shared Bell pair + 2 classical bits." },
    { question: "How does QKD BB84 detect eavesdroppers (Eve)?", options: ["By locking the network", "Measurement collapses photon states, raising QBER above 11%", "By tracking IP addresses", "By slowing down light"], answer: 1, explanation: "Eavesdropping causes measurement collapse, introducing error rates QBER > 11%." }
  ],
  'int-14': [
    { question: "Why is classical RSA-2048 encryption vulnerable to future quantum computers?", options: ["RSA passwords are short", "Shor's algorithm solves integer factorization in polynomial time O((log N)³)", "Grover's algorithm deletes keys", "RSA uses 0s and 1s"], answer: 1, explanation: "Shor's algorithm factors large integers in polynomial time, breaking RSA." },
    { question: "What mathematical foundation do NIST Post-Quantum Cryptography standards (like ML-KEM) rely on?", options: ["Integer factoring", "Lattice-based hard problems", "Sudoku puzzles", "Linear regression"], answer: 1, explanation: "NIST PQC standards rely on hard lattice problems like Learning With Errors." }
  ],
  'int-15': [
    { question: "How does quantum computing accelerate drug discovery in healthcare?", options: ["By printing test tubes", "By simulating exact molecular ground-state energies and protein folding", "By replacing doctors", "By running faster Excel spreadsheets"], answer: 1, explanation: "Quantum algorithms simulate molecular electronic structures accurately." },
    { question: "Which classic NP-hard problem in logistics is solved efficiently using quantum optimization?", options: ["Sorting lists", "Travelling Salesperson Problem (TSP)", "Binary search", "Playing chess"], answer: 1, explanation: "Quantum optimization solves Travelling Salesperson supply chain routes." }
  ],
  'int-16': [
    { question: "In Quantum Machine Learning, what does a Quantum Feature Map Φ(x) do?", options: ["Plots a 2D graph", "Embeds classical data vectors into high-dimensional quantum Hilbert state space", "Compresses images", "Deletes redundant features"], answer: 1, explanation: "Feature maps embed data into Hilbert space for quantum kernel evaluation." },
    { question: "Which rule is used to compute exact analytic gradients of Quantum Neural Networks on physical hardware?", options: ["Chain Rule", "Parameter Shift Rule", "Finite Differences", "Euler Method"], answer: 1, explanation: "The Parameter Shift Rule evaluates exact analytic QNN gradients." }
  ],
  'int-17': [
    { question: "What are IBM Qiskit Runtime Primitives?", options: ["Physical lasers", "Sampler and Estimator cloud execution services", "Python installation scripts", "Hardware fridges"], answer: 1, explanation: "Qiskit Runtime Primitives provide Sampler and Estimator cloud execution." },
    { question: "Which cloud platform provides access to Amazon Braket managed quantum services?", options: ["Google Cloud Platform", "Microsoft Azure", "Amazon Web Services (AWS)", "IBM Cloud"], answer: 2, explanation: "Amazon Braket is AWS's managed quantum cloud computing platform." }
  ],

  // Undergraduate Quizzes
  'ug-1': [
    {
      question: "Who proposed using quantum systems to simulate quantum physics in 1982?",
      options: ["Albert Einstein", "Richard Feynman", "Alan Turing", "David Deutsch"],
      answer: 1,
      explanation: "Richard Feynman famously noted that nature isn't classical, so simulating it requires a quantum computer."
    },
    {
      question: "What did the Deutsch-Jozsa Algorithm prove?",
      options: ["Quantum computers can play chess", "Exponential speedup over deterministic classical algorithms", "That P = NP", "How to factor large numbers"],
      answer: 1,
      explanation: "It was the first to demonstrate exponential speedup for a specific oracle problem."
    }
  ],
  'ug-3': [
    {
      question: "What is a Hilbert Space?",
      options: ["A place to store physical qubits", "A vacuum chamber", "A vector space equipped with an inner product", "A real-only number line"],
      answer: 2,
      explanation: "A Hilbert space is a mathematical concept: a complex vector space with an inner product that allows length and angle definitions."
    }
  ],

  // Postgraduate Quizzes
  'pg-1': [
    {
      question: "What is a density matrix primarily used for?",
      options: ["To encrypt data", "To describe mixed quantum states", "To build a physical qubit", "To simulate classical mechanics"],
      answer: 1,
      explanation: "Density matrices handle statistical ensembles (mixed states), unlike state vectors which only describe pure states."
    },
    {
      question: "How do you find the reduced density matrix of subsystem A from a joint system AB?",
      options: ["Take the determinant of AB", "Take the partial trace over B", "Multiply A by B", "Invert the matrix AB"],
      answer: 1,
      explanation: "The partial trace operation 'traces out' the degrees of freedom of subsystem B."
    }
  ],

  // Professional / Others Quizzes
  'oth-1': [
    {
      question: "What is Qiskit?",
      options: ["A type of physical qubit", "An open-source quantum programming framework", "A classical supercomputer", "A quantum algorithm"],
      answer: 1,
      explanation: "Qiskit is an SDK created by IBM for working with quantum computers at the level of circuits, pulses, and algorithms."
    }
  ]
};
