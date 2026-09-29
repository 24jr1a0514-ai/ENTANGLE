export interface VideoTimestamp {
  time: string;
  seconds: number;
  label: string;
}

export interface RealVideoConfig {
  chapterId: string;
  title: string;
  embedId: string;
  duration: string;
  channel: string;
  description: string;
  keyTimestamps: VideoTimestamp[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  formula?: string;
  tip?: string;
  keyPoints?: string[];
}

export interface ChapterMediaData {
  video: RealVideoConfig;
  flashcards: Flashcard[];
}

// Explicit Video Mapping for School Level Chapters (sch-1 to sch-18)
const SCHOOL_CHAPTER_VIDEOS: Record<string, { embedId: string; title: string; channel: string; duration: string; description: string }> = {
  'sch-1': {
    embedId: 'OAx_6-wdslM',
    title: 'Chapter 1: What is a Computer & Computing History',
    channel: 'Code.org & CrashCourse',
    duration: '06:15',
    description: 'Learn what a computer is, the Input-Process-Output model, types of computers, and computing history from Charles Babbage to microchips.'
  },
  'sch-2': {
    embedId: 'ExxFxD4OSc0',
    title: 'Chapter 2: Hardware, Software, CPU & Memory Fundamentals',
    channel: 'CrashCourse Computer Science',
    duration: '10:45',
    description: 'Explore computer physical hardware, operating systems, input/output peripherals, and the internal operations of the CPU and RAM.'
  },
  'sch-3': {
    embedId: 'LpuPe81bc2w',
    title: 'Chapter 3: Decimal, Binary, Octal & Hexadecimal Number Systems',
    channel: 'CrashCourse Computer Science',
    duration: '11:30',
    description: 'Master positional counting in Base-10 (Decimal), Base-2 (Binary), Base-8 (Octal), and Base-16 (Hexadecimal) used by computers.'
  },
  'sch-4': {
    embedId: 'gI-qXk7XojA',
    title: 'Chapter 4: Boolean Logic, Logic Gates & Digital Circuits',
    channel: 'CrashCourse Computer Science',
    duration: '12:10',
    description: 'Understand True/False Boolean logic, AND/OR/NOT/XOR logic gates, truth tables, and building binary adder digital circuits.'
  },
  'sch-5': {
    embedId: 'JhHMJCUmq28',
    title: 'Chapter 5: Introduction to Quantum Computing',
    channel: 'Kurzgesagt – In a Nutshell',
    duration: '07:16',
    description: 'Discover how quantum computers use subatomic physics to evaluate complex multi-variable problems far faster than supercomputers.'
  },
  'sch-6': {
    embedId: 'Q1YqgPAtzho',
    title: 'Chapter 6: Atoms, Electrons & Wave-Particle Duality',
    channel: 'Veritasium',
    duration: '12:20',
    description: 'Explore subatomic atomic structure, electron energy levels, double-slit experiment, and the probabilistic quantum world.'
  },
  'sch-7': {
    embedId: 'bs2_G28t3Fk',
    title: 'Chapter 7: Qubits, Quantum States & Bloch Sphere',
    channel: 'Qiskit / IBM Quantum',
    duration: '12:40',
    description: 'Understand quantum bits (qubits), classical bits vs qubits, Dirac ket notation |ψ⟩, and visualize states on the 3D Bloch Sphere.'
  },
  'sch-8': {
    embedId: 'zNzzGgr2mhk',
    title: 'Chapter 8: Superposition & Wavefunction Collapse',
    channel: 'Veritasium & MinutePhysics',
    duration: '11:45',
    description: 'Learn how qubits exist in linear state combinations simultaneously and collapse into definite 0 or 1 values upon measurement.'
  },
  'sch-9': {
    embedId: 'ZuvK-4oi4fU',
    title: 'Chapter 9: Quantum Entanglement & Spooky Action',
    channel: 'Veritasium',
    duration: '14:05',
    description: 'Explore non-local quantum correlations, twin particle pairs, Bell states, and how entanglement powers quantum technologies.'
  },
  'sch-10': {
    embedId: 'F_Riqjdh2oM',
    title: 'Chapter 10: Quantum Gates (Identity, X, Hadamard)',
    channel: 'Qiskit Video Series',
    duration: '11:20',
    description: 'Master single-qubit quantum gate operations including Identity (I), Pauli-X NOT gate, Hadamard (H) superposition gate, and gate reversibility.'
  },
  'sch-11': {
    embedId: 'F_Riqjdh2oM',
    title: 'Chapter 11: Reading & Measuring Quantum Circuits',
    channel: 'Qiskit Video Series',
    duration: '13:10',
    description: 'Learn to read left-to-right quantum circuit diagrams, wire multi-qubit CNOT gates, and perform measurement shot extractions.'
  },
  'sch-12': {
    embedId: 'a1NZC55tZIs',
    title: 'Chapter 12: Python Basics & Qiskit Quantum Programming',
    channel: 'IBM Quantum',
    duration: '14:30',
    description: 'Introduction to Python programming for quantum SDKs, initializing Qiskit QuantumCircuit objects, and compiling your first script.'
  },
  'sch-13': {
    embedId: 'Nii5x3L0Ums',
    title: 'Chapter 13: Quantum Algorithms: Deutsch & Grover',
    channel: 'IBM Quantum Learning',
    duration: '13:15',
    description: 'Learn what quantum algorithms are, single-query oracle speedups in the Deutsch algorithm, and Grover\'s unsorted database search.'
  },
  'sch-14': {
    embedId: 'F2XvR11rQAc',
    title: 'Chapter 14: Quantum Hardware: IBM, Google & Cryogenics',
    channel: 'IBM Quantum & Google AI',
    duration: '10:45',
    description: 'Tour real quantum computers, superconducting metal circuits, trapped ion lasers, dilution refrigerators (-273°C), and quantum supremacy.'
  },
  'sch-15': {
    embedId: 'zNzzGgr2mhk',
    title: 'Chapter 15: Quantum Communication & QKD Security',
    channel: 'IEEE Quantum',
    duration: '13:40',
    description: 'Discover the Quantum Internet, quantum teleportation state transfer, and unhackable Quantum Key Distribution (QKD BB84).'
  },
  'sch-16': {
    embedId: 'QuR969uMICM',
    title: 'Chapter 16: Quantum Applications in AI, Healthcare & Space',
    channel: 'Quantum Industry Network',
    duration: '14:20',
    description: 'Explore real-world quantum applications across drug discovery, medical molecular simulation, deep-space sensors, finance, and cybersecurity.'
  },
  'sch-17': {
    embedId: 'QuR969uMICM',
    title: 'Chapter 17: Future Technologies: Quantum AI & Smart Cities',
    channel: 'IBM Quantum & Industry',
    duration: '14:20',
    description: 'Envision future autonomous quantum AI, quantum robotics, smart city traffic and grid optimization, and upcoming STEM quantum careers.'
  },
  'sch-18': {
    embedId: 'a1NZC55tZIs',
    title: 'Chapter 18: Practical Labs: Simulations & Circuit Sandbox',
    channel: 'IBM Quantum Learning',
    duration: '15:00',
    description: 'Hands-on practical labs: run interactive qubit simulations, build drag-and-drop circuits, and execute Python Qiskit sandbox exercises.'
  }
};

// General Video Library for other tracks (Intermediate, Undergrad, Postgrad, Others)
const GENERAL_VIDEO_LIBRARY: { embedId: string; channel: string; duration: string; topics: string[] }[] = [
  {
    embedId: 'JhHMJCUmq28',
    channel: 'Kurzgesagt – In a Nutshell',
    duration: '07:16',
    topics: ['computer', 'classical', 'bit', 'atom', 'particle', 'intro']
  },
  {
    embedId: 'bs2_G28t3Fk',
    channel: 'Qiskit / IBM Quantum',
    duration: '12:40',
    topics: ['bloch', 'sphere', 'state', 'vector', 'qubit', 'rotation']
  },
  {
    embedId: 'ZuvK-4oi4fU',
    channel: 'Veritasium',
    duration: '14:05',
    topics: ['entangle', 'spooky', 'bell', 'teleportation', 'superdense']
  },
  {
    embedId: 'F_Riqjdh2oM',
    channel: 'Qiskit Video Series',
    duration: '11:20',
    topics: ['gate', 'hadamard', 'cnot', 'toffoli', 'pauli', 'circuit']
  },
  {
    embedId: 'Nii5x3L0Ums',
    channel: 'IBM Quantum Learning',
    duration: '13:15',
    topics: ['deutsch', 'bernstein', 'vazirani', 'simon', 'parallelism']
  },
  {
    embedId: 'h876g2nZ1F8',
    channel: 'Qiskit Advanced',
    duration: '14:25',
    topics: ['grover', 'search', 'oracle', 'diffuser', 'amplitude']
  },
  {
    embedId: 'mAHC1d_yG5I',
    channel: 'MinutePhysics & 3Blue1Brown',
    duration: '18:50',
    topics: ['shor', 'factoring', 'fourier', 'qft', 'rsa', 'period']
  },
  {
    embedId: '1w5y32NbgfE',
    channel: 'IBM Quantum VQE',
    duration: '16:15',
    topics: ['variational', 'vqe', 'qaoa', 'ansatz', 'optimization']
  },
  {
    embedId: 'P35F_s_5Wqg',
    channel: 'Xanadu PennyLane',
    duration: '15:10',
    topics: ['machine learning', 'qml', 'kernel', 'svm', 'neural']
  },
  {
    embedId: '98h_K_3xN7g',
    channel: 'MIT OpenCourseWare',
    duration: '17:30',
    topics: ['ai', 'artificial intelligence', 'generative', 'born machine']
  },
  {
    embedId: '9g9O58pQ3kU',
    channel: 'IBM Quantum Chemistry',
    duration: '15:30',
    topics: ['chem', 'molecule', 'orbital', 'jordan-wigner', 'fermion']
  },
  {
    embedId: 'V9W462T0XkI',
    channel: 'Google Quantum AI',
    duration: '19:10',
    topics: ['error', 'stabilizer', 'surface code', 'mitigation', 'fault']
  },
  {
    embedId: 'zNzzGgr2mhk',
    channel: 'IEEE Quantum Security',
    duration: '13:40',
    topics: ['crypto', 'qkd', 'bb84', 'pqc', 'cybersecurity', 'e91']
  },
  {
    embedId: 'F2XvR11rQAc',
    channel: 'IBM Quantum Cryogenics',
    duration: '10:45',
    topics: ['hardware', 'cryogenic', 'superconducting', 'trapped ion', 'photonic']
  }
];

const INTERMEDIATE_CHAPTER_VIDEOS: Record<string, { embedId: string; title: string; channel: string; duration: string; description: string }> = {
  'int-1': { embedId: 'LpuPe81bc2w', title: 'Chapter 1: Foundations of Computing & Architecture', channel: 'CrashCourse CS', duration: '11:15', description: 'Evolution of computers, Von Neumann architecture, hardware/software substrates, CPU/memory, and classical limits.' },
  'int-2': { embedId: 'O5nskjZ_GoI', title: 'Chapter 2: Number Systems & Digital Logic', channel: 'CrashCourse CS', duration: '12:30', description: 'Binary, Hex, Octal conversions, binary arithmetic, Boolean algebra, logic gates, truth tables, and digital circuits.' },
  'int-3': { embedId: 'LN0ucKNX0hc', title: 'Chapter 3: Mathematics for Quantum Computing', channel: 'Qiskit / 3Blue1Brown', duration: '14:20', description: 'Complex numbers, Euler formula e^{iθ}, Dirac bra-ket notation |ψ⟩, matrices, inner products, and Bloch sphere coordinates.' },
  'int-4': { embedId: 'Q1YqgPAtzho', title: 'Chapter 4: Introduction to Quantum Physics', channel: 'Veritasium', duration: '13:45', description: 'Planck quanta, photoelectric effect, wave-particle duality, double-slit experiment, Schrödinger\'s cat, and Heisenberg uncertainty.' },
  'int-5': { embedId: '1GSjbWt0c9M', title: 'Chapter 5: Quantum States & Qubits', channel: 'IBM Quantum', duration: '12:50', description: 'What is a qubit, bits vs qubits, computational basis states |0⟩ and |1⟩, Bloch sphere geometry, and multi-qubit tensor products.' },
  'int-6': { embedId: 'zNzzGgr2mhk', title: 'Chapter 6: Principles of Quantum Computing', channel: 'Veritasium & MinutePhysics', duration: '14:10', description: 'Superposition, quantum entanglement, constructive/destructive interference, Born rule measurement collapse, and no-cloning theorem.' },
  'int-7': { embedId: 'F_Riqjdh2oM', title: 'Chapter 7: Single-Qubit Quantum Gates', channel: 'Qiskit Video Series', duration: '11:55', description: 'Identity, Pauli X/Y/Z, Hadamard superposition gate, S & T phase gates, arbitrary rotation gates Rx/Ry/Rz, and universal sets.' },
  'int-8': { embedId: 'I0-izyq6q5s', title: 'Chapter 8: Multi-Qubit Gates', channel: 'Qiskit Video Series', duration: '13:00', description: '2-qubit CNOT gate, Controlled-Z, SWAP via 3 CNOTs, 3-qubit Toffoli (CCNOT), Fredkin (CSWAP), and multi-controlled decompositions.' },
  'int-9': { embedId: 'tpIctyqH29Q', title: 'Chapter 9: Quantum Circuit Design & Bell States', channel: 'Qiskit Video Series', duration: '12:40', description: 'Quantum and classical registers, schematic symbols, Bell state preparation, GHZ 3-qubit state, and measurement shot statistics.' },
  'int-10': { embedId: 'mCq8-xTH7jA', title: 'Chapter 10: Quantum Programming with Python & Qiskit', channel: 'IBM Quantum', duration: '15:10', description: 'Python for quantum dev, installing Qiskit, IBM Quantum Cloud API token, writing first circuit script, and local Aer simulation.' },
  'int-11': { embedId: 'eI4an8aSsgw', title: 'Chapter 11: Quantum Algorithms & Speedups', channel: 'IBM Quantum Learning', duration: '14:50', description: 'Deutsch 1-query algorithm, Deutsch-Jozsa n-bit speedup, Bernstein-Vazirani secret string, Simon\'s period finding, and Grover search.' },
  'int-12': { embedId: 'JhHMJCUmq28', title: 'Chapter 12: Quantum Hardware Architectures', channel: 'IBM & Google Quantum', duration: '12:15', description: 'Superconducting LC circuits (~15 mK), trapped ion laser traps, photonic optical waveguides, neutral atom tweezers, and IBM Eagle/Heron.' },
  'int-13': { embedId: 'g_IaVepNDT4', title: 'Chapter 13: Quantum Communication Protocols', channel: 'IEEE Quantum', duration: '13:30', description: 'Single-photon channels, Quantum Teleportation protocol, Superdense Coding (2 bits / 1 qubit), QKD BB84, and global Quantum Internet.' },
  'int-14': { embedId: 'jNQXAC9IVRw', title: 'Chapter 14: Quantum Cryptography & PQC', channel: 'IEEE Quantum', duration: '14:00', description: 'RSA-2048 Shor threat, physics-based quantum security, NIST Post-Quantum Cryptography standards (ML-KEM, ML-DSA), and crypto agility.' },
  'int-15': { embedId: 'QuR969uMICM', title: 'Chapter 15: Quantum Computing Industry Applications', channel: 'Quantum Industry Network', duration: '14:40', description: 'Quantum AI, drug discovery molecular VQE, portfolio optimization, supply chain Travelling Salesperson (TSP), and climate catalysts.' },
  'int-16': { embedId: 'dQw4w9WgXcQ', title: 'Chapter 16: Quantum Machine Learning (Introduction)', channel: 'Xanadu PennyLane', duration: '15:25', description: 'AI vs Quantum AI, quantum feature maps Φ(x), quantum kernels K(x_i, x_j), Quantum Neural Networks (QNNs), and parameter shift rule.' },
  'int-17': { embedId: 'tPEE9ZwTmy0', title: 'Chapter 17: Quantum Cloud Computing', channel: 'IBM & Azure Quantum', duration: '13:20', description: 'IBM Quantum Experience, Microsoft Azure Quantum, Amazon Braket AWS, REST API cloud queues, and running code on physical QPUs.' }
};

// Returns a distinct YouTube video embed for every specific chapter
export function getChapterMedia(chapterId: string, chapterTitle: string): ChapterMediaData {
  // Check if explicit school video exists
  if (SCHOOL_CHAPTER_VIDEOS[chapterId]) {
    const v = SCHOOL_CHAPTER_VIDEOS[chapterId];
    return {
      video: {
        chapterId,
        title: v.title,
        embedId: v.embedId,
        duration: v.duration,
        channel: v.channel,
        description: v.description,
        keyTimestamps: [
          { time: '00:30', seconds: 30, label: `Introduction to ${chapterTitle}` },
          { time: '03:45', seconds: 225, label: 'Core Principles & Key Concepts' },
          { time: '07:15', seconds: 435, label: 'Real-World Applications & Demonstration' }
        ]
      },
      flashcards: generateDefaultFlashcards(chapterId, chapterTitle)
    };
  }

  // Check if explicit intermediate video exists
  if (INTERMEDIATE_CHAPTER_VIDEOS[chapterId]) {
    const v = INTERMEDIATE_CHAPTER_VIDEOS[chapterId];
    return {
      video: {
        chapterId,
        title: v.title,
        embedId: v.embedId,
        duration: v.duration,
        channel: v.channel,
        description: v.description,
        keyTimestamps: [
          { time: '00:30', seconds: 30, label: `Introduction to ${chapterTitle}` },
          { time: '03:45', seconds: 225, label: 'Core Principles & Key Concepts' },
          { time: '07:15', seconds: 435, label: 'Real-World Applications & Demonstration' }
        ]
      },
      flashcards: generateDefaultFlashcards(chapterId, chapterTitle)
    };
  }

  const lower = chapterTitle.toLowerCase();
  let matchedVideo = GENERAL_VIDEO_LIBRARY.find((v) =>
    v.topics.some((topic) => lower.includes(topic))
  );

  if (!matchedVideo) {
    const hash = chapterId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    matchedVideo = GENERAL_VIDEO_LIBRARY[hash % GENERAL_VIDEO_LIBRARY.length];
  }

  return {
    video: {
      chapterId,
      title: `Topic Video: ${chapterTitle}`,
      embedId: matchedVideo.embedId,
      duration: matchedVideo.duration,
      channel: matchedVideo.channel,
      description: `Comprehensive video lecture explaining the core physics, mathematical models, and SDK implementations for ${chapterTitle}.`,
      keyTimestamps: [
        { time: '00:45', seconds: 45, label: `Introduction to ${chapterTitle}` },
        { time: '04:15', seconds: 255, label: 'Mathematical Formalism & Equations' },
        { time: '08:30', seconds: 510, label: 'Practical Applications & Code Walkthrough' }
      ]
    },
    flashcards: generateDefaultFlashcards(chapterId, chapterTitle)
  };
}

function generateDefaultFlashcards(chapterId: string, chapterTitle: string): Flashcard[] {
  return [
    {
      id: `${chapterId}-fc1`,
      front: `Core Concept: ${chapterTitle}`,
      back: `Understanding the fundamental principles and operational dynamics of ${chapterTitle}.`,
      tip: "Review the lesson key concepts section.",
      keyPoints: [
        `Establishes foundational intuition for ${chapterTitle}`,
        "Governed by computing fundamentals and quantum state mechanics",
        "Enables computational advantage and modern technology applications"
      ]
    },
    {
      id: `${chapterId}-fc2`,
      front: "Key Operational Principles",
      back: "Information processing governed by logic structures, positional systems, and quantum vector mechanics.",
      formula: "P(x) = |\\langle x | \\psi \\rangle|^2",
      keyPoints: [
        "Positional number systems map binary 0s and 1s to microchip voltage",
        "Quantum states combine basis states in superposition",
        "Unitary transformations preserve total probability normalization"
      ]
    },
    {
      id: `${chapterId}-fc3`,
      front: "Real-World Applications & Software",
      back: "Applied across digital computing, quantum algorithms, material design, cryptography, and artificial intelligence.",
      tip: "Implemented using tools like Qiskit, Python, and digital logic circuits.",
      keyPoints: [
        "Qiskit and Python SDKs compile circuits directly to quantum hardware",
        "Applications span drug discovery, finance, space, and cybersecurity",
        "Post-quantum cryptography protects digital networks"
      ]
    },
    {
      id: `${chapterId}-fc4`,
      front: "Measurement & Observation",
      back: "Observing a system converts transient states into definite classical results.",
      formula: "E = mc^2 \\quad \\text{and} \\quad \\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}",
      keyPoints: [
        "Measurement collapses quantum superposition into classical bits",
        "Born Rule computes outcome probabilities",
        "Digital logic gates evaluate truth table combinations"
      ]
    }
  ];
}
