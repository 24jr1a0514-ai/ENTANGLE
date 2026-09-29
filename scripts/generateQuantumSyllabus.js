import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const syllabusPath = path.join(__dirname, 'quantum_syllabus.txt');
const content = fs.readFileSync(syllabusPath, 'utf8');

const chapters = [];
let currentChapter = null;

content.split('\n').forEach(line => {
  line = line.trim();
  if (!line) return;
  
  if (line.startsWith('CHAPTER')) {
    const titleMatch = line.match(/CHAPTER \d+\s*—\s*(.*)/);
    if (titleMatch) {
      currentChapter = {
        title: titleMatch[1].trim(),
        topics: []
      };
      chapters.push(currentChapter);
    }
  } else if (/^\d+\./.test(line)) {
    const topicMatch = line.match(/^\d+\.\s*(.*)/);
    if (topicMatch && currentChapter) {
      currentChapter.topics.push(topicMatch[1].trim());
    }
  }
});

function getVideoData(topic, chapterId) {
  const t = topic.toLowerCase();
  
  const createVideo = (title, embedId, description, duration, channel) => ({
    chapterId,
    title,
    embedId,
    duration,
    channel,
    description,
    keyTimestamps: [
      { time: '00:00', seconds: 0, label: 'Introduction' },
      { time: '02:30', seconds: 150, label: `Understanding ${topic}` },
      { time: '05:45', seconds: 345, label: 'Summary & Real-world Applications' }
    ]
  });

  // Determine categories based on keywords
  if (t.includes('superposition') || t.includes('state')) {
    return {
      school: createVideo(`Superposition Made Easy`, "zNzzGgp2K1o", `A simple, beginner-friendly explanation of quantum superposition without complex math.`, "06:15", "Quantum For Kids"),
      intermediate: createVideo(`Understanding Superposition`, "F_Riqjdh2oM", `Exploring superposition with basic linear algebra and Qiskit.`, "10:15", "Qiskit Basics"),
      undergraduate: createVideo(`Superposition & State Vectors`, "lZ3bPUKo5zc", `Mathematical formulation of superposition in Hilbert space using Dirac notation.`, "45:00", "MIT OpenCourseWare"),
      postgraduate: createVideo(`Advanced Superposition Dynamics`, "lZ3bPUKo5zc", `Time evolution of superposition states in open quantum systems and decoherence.`, "55:00", "Advanced Physics Research"),
      others: createVideo(`Quantum Superposition Explained`, "JhHMJCUmq28", `General overview of superposition and its implications for computing.`, "08:45", "Science Simplified")
    };
  } else if (t.includes('entangle') || t.includes('bell')) {
    return {
      school: createVideo(`Quantum Entanglement for Beginners`, "ZuvK-od647c", `Spooky action at a distance explained with everyday examples.`, "05:30", "Science For Everyone"),
      intermediate: createVideo(`Bell States & Entanglement`, "0RryziToQ9c", `Creating entangled pairs using quantum circuits.`, "12:00", "Qiskit Intro"),
      undergraduate: createVideo(`Quantum Correlation & Bell's Theorem`, "lZ3bPUKo5zc", `Deep dive into Bell inequalities and mathematical proof of entanglement.`, "50:00", "University Physics"),
      postgraduate: createVideo(`Multipartite Entanglement`, "lZ3bPUKo5zc", `GHZ states, W states, and advanced entanglement witnesses.`, "60:00", "Quantum Research"),
      others: createVideo(`What is Quantum Entanglement?`, "JhHMJCUmq28", `A visual guide to how particles connect across space.`, "09:00", "Visual Science")
    };
  } else if (t.includes('algorithm') || t.includes('shor') || t.includes('grover')) {
    return {
      school: createVideo(`How Quantum Computers Solve Problems`, "g_IaVepNDT4", `A high-level look at why quantum algorithms are faster.`, "07:00", "Tech Explained"),
      intermediate: createVideo(`Intro to Quantum Algorithms`, "F_Riqjdh2oM", `Basic explanation of Grover's search and Shor's factoring.`, "15:30", "Qiskit Learning"),
      undergraduate: createVideo(`Shor's & Grover's Algorithms`, "wUwZZaI5u0c", `Mathematical walkthrough of the Quantum Fourier Transform and Oracle design.`, "45:00", "CS Advanced"),
      postgraduate: createVideo(`Complexity Classes in Quantum Algorithms`, "wUwZZaI5u0c", `BQP, QMA, and advanced algorithm design.`, "55:00", "Quantum Theory"),
      others: createVideo(`Quantum Algorithms Explained`, "g_IaVepNDT4", `Understanding the power of quantum computing.`, "11:20", "Domain of Science")
    };
  } else if (t.includes('error') || t.includes('noise')) {
    return {
      school: createVideo(`Fixing Quantum Mistakes`, "JhHMJCUmq28", `Why quantum computers make errors and how we fix them.`, "06:00", "Simple Science"),
      intermediate: createVideo(`Intro to Quantum Error Correction`, "0RryziToQ9c", `Bit-flip codes, phase-flip codes, and the Shor code.`, "18:00", "Qiskit Education"),
      undergraduate: createVideo(`Surface Codes & Fault Tolerance`, "lZ3bPUKo5zc", `Stabilizer formalism and topological quantum error correction.`, "48:00", "University Engineering"),
      postgraduate: createVideo(`Advanced Fault-Tolerant Thresholds`, "lZ3bPUKo5zc", `Transversal gates, magic state distillation, and error thresholds.`, "65:00", "Research Seminars"),
      others: createVideo(`Quantum Error Correction`, "g_IaVepNDT4", `The biggest challenge in building quantum computers.`, "14:00", "Tech Today")
    };
  } else if (t.includes('hardware') || t.includes('superconducting') || t.includes('ion')) {
    return {
      school: createVideo(`Inside a Quantum Computer`, "JhHMJCUmq28", `Looking at the freezing cold wires inside a quantum chip.`, "08:15", "Hardware Intro"),
      intermediate: createVideo(`Quantum Hardware Technologies`, "0RryziToQ9c", `Superconducting qubits vs. Trapped Ions.`, "20:00", "Tech Deep Dive"),
      undergraduate: createVideo(`Microwave Control of Qubits`, "lZ3bPUKo5zc", `Physics of transmon qubits, resonators, and readout mechanisms.`, "52:00", "Quantum Engineering"),
      postgraduate: createVideo(`Decoherence Mechanisms in Solid State`, "lZ3bPUKo5zc", `Two-level system defects, charge noise, and flux noise analysis.`, "70:00", "Advanced Physics"),
      others: createVideo(`Building a Quantum Computer`, "g_IaVepNDT4", `The engineering behind quantum machines.`, "16:45", "Science Tech")
    };
  }
  
  // Default for gates, circuits, and general topics
  return {
    school: createVideo(`Intro to ${topic}`, "JhHMJCUmq28", `A basic overview of ${topic} for beginners.`, "05:00", "Quantum Basics"),
    intermediate: createVideo(`Understanding ${topic}`, "F_Riqjdh2oM", `Intermediate concepts and circuit examples for ${topic}.`, "14:00", "Qiskit Intro"),
    undergraduate: createVideo(`Mathematical Foundations of ${topic}`, "lZ3bPUKo5zc", `Rigorous mathematical treatment of ${topic} using linear algebra.`, "40:00", "University CS"),
    postgraduate: createVideo(`Advanced Topics in ${topic}`, "lZ3bPUKo5zc", `Research-level discussion and theoretical analysis of ${topic}.`, "55:00", "Quantum Seminars"),
    others: createVideo(`${topic} Explained`, "g_IaVepNDT4", `Comprehensive explanation of ${topic}.`, "12:30", "Tech Education")
  };
}

const learningPaths = ['school', 'intermediate', 'undergraduate', 'postgraduate', 'others'];

const generatedChapters = chapters.map((chap, chIdx) => {
  const pages = chap.topics.map((topic, tpIdx) => {
    
    const getVisualObject = (topicStr, domain) => {
      let type = 'analogy';
      let visualData = {};
      
      const t = topicStr.toLowerCase();
      
      if (t.includes('superposition') || t.includes('state') || t.includes('qubit') || t.includes('sphere')) {
        type = 'bloch-sphere';
        visualData = { state: t.includes('superposition') ? 'superposition' : '|1>', title: `State Representation` };
      } else if (t.includes('gate') || t.includes('circuit') || t.includes('entangle') || t.includes('teleport')) {
        type = 'circuit';
        visualData = { gates: t.includes('cnot') || t.includes('entangle') || t.includes('teleport') ? ['H', 'CNOT'] : ['X', 'H', 'Z'], title: `Quantum Circuit` };
      } else if (t.includes('algorithm') || t.includes('search') || t.includes('shor') || t.includes('grover')) {
        type = 'flowchart';
        visualData = { steps: ['Initialize States', 'Apply Operations', 'Interference', 'Measurement'], title: `Algorithm Flow` };
      } else if (t.includes('math') || t.includes('fourier') || t.includes('transform') || t.includes('matrix') || t.includes('error')) {
        type = 'math';
        visualData = { expression: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle', details: ['α: Probability amplitude for |0⟩', 'β: Probability amplitude for |1⟩', '|α|² + |β|² = 1'], title: `Mathematical Model` };
      } else {
        type = 'analogy';
        visualData = { concept: `Like a spinning coin in the air, a quantum state isn't just one fixed outcome until it is observed.`, title: `Real-World Analogy` };
      }
      
      visualData.type = type;
      visualData.caption = `Visual representation of ${topicStr} tailored for ${domain} level learners.`;
      
      return `[[VISUAL:${JSON.stringify(visualData)}]]`;
    };

    const buildTheory = (domain) => {
      const visual = getVisualObject(topic, domain);
      
      if (domain === 'school') {
        return `### 1. Topic Introduction
Welcome to this lesson on **${topic}**. Don't worry if it sounds complicated—we're going to break it down into simple pieces!

### 2. Simple/Conceptual Explanation
In simple words, **${topic}** is a special rule of quantum computing. Imagine a spinning coin that hasn't landed yet. While it's spinning, it isn't just heads or tails; it's a mix of both. This is how quantum computers look at information!

### 3. Visual Representation
${visual}

### 4. Detailed Theory
When scientists work with ${topic}, they are using tiny particles like electrons. Instead of just being ON or OFF (like a normal light switch), these particles can be in multiple states. This allows computers to do many things at once, making them much faster at solving puzzles than normal computers.

### 5. Example
Think of it like being in a maze. A normal computer tries one path at a time. A quantum computer using ${topic} can explore many paths at the exact same time!

### 6. Mathematical Explanation
We don't need complex math here. Just know that if a normal computer does 1 thing, a quantum computer can do 2, then 4, then 8 things at once!

### 7. Practical/Application Connection
This principle is used in making super-secure secret codes and finding the best routes for delivery trucks.

### 8. Key Points
- ${topic} extends classical binary logic.
- It uses qubits, not regular bits.
- Allows exploring multiple options at once.`;
      } else if (domain === 'intermediate') {
        return `### 1. Topic Introduction
Welcome to the intermediate module on **${topic}**. Here we bridge the gap between simple analogies and real quantum science.

### 2. Simple/Conceptual Explanation
**${topic}** is a quantum phenomenon where particles exist in a combination of states until they are measured. It's the core difference between classical and quantum computing.

### 3. Visual Representation
${visual}

### 4. Detailed Theory
In quantum mechanics, ${topic} describes how a quantum state evolves. Instead of deterministic 1s and 0s, we deal with probability amplitudes. When we measure the system, it collapses into a definite state based on these probabilities.

### 5. Example
Consider a simple quantum circuit. Applying a Hadamard gate puts a qubit into a superposition. If we have two qubits, applying a CNOT gate can entangle them, creating a correlated state.

### 6. Mathematical Explanation
Mathematically, a state can be represented as |ψ⟩ = α|0⟩ + β|1⟩, where α and β are probability amplitudes, and the total probability must equal 1.

### 7. Practical/Application Connection
This principle allows quantum gates to manipulate data in ways normal logic gates cannot, leading to breakthroughs in cryptography and optimization.

### 8. Key Points
- ${topic} extends classical binary logic.
- It uses qubits and probability amplitudes.
- Measurement collapses the quantum state.`;
      } else if (domain === 'undergraduate') {
        return `### 1. Topic Introduction
Welcome to the undergraduate module on **${topic}**. This section requires a solid understanding of linear algebra and quantum mechanics.

### 2. Simple/Conceptual Explanation
**${topic}** is a fundamental quantum phenomenon that allows quantum states to exist as linear combinations of basis states in a Hilbert space.

### 3. Visual Representation
${visual}

### 4. Detailed Theory
A quantum system's state is described by a state vector in a complex Hilbert space. The principle of ${topic} dictates the unitary evolution of these states via the Schrödinger equation. When multiple qubits are involved, the state space grows exponentially as a tensor product of individual qubit spaces.

### 5. Example
Consider a 2-qubit system. The state is an element of C^4. Applying a tensor product of Hadamard gates creates a uniform superposition across all 4 basis states.

### 6. Mathematical Explanation
The state can be written as |ψ⟩ = Σ c_i |i⟩ where the sum of |c_i|^2 equals 1. Applying a unitary operator U transforms the state to U|ψ⟩.

### 7. Practical/Application Connection
It is the mathematical foundation that allows quantum algorithms, such as Shor's and Grover's, to achieve exponential and quadratic speedups, applied in phase estimation and QFT.

### 8. Key Points
- Described by complex Hilbert spaces.
- Evolves via Unitary operators.
- Interference is driven by complex probability amplitudes.`;
      } else if (domain === 'postgraduate') {
        return `### 1. Topic Introduction
Advanced analysis of **${topic}**. This module covers the theoretical and mathematical rigor suitable for graduate research.

### 2. Simple/Conceptual Explanation
**${topic}** involves the manipulation of density matrices in open quantum systems and the formalization of quantum channels and entanglement measures.

### 3. Visual Representation
${visual}

### 4. Detailed Theory
We generalize pure states to mixed states using the density operator ρ = Σ p_i |ψ_i⟩⟨ψ_i|. The evolution of an open quantum system under ${topic} is described by completely positive trace-preserving (CPTP) maps, often formulated via the Kraus representation or the Lindblad master equation.

### 5. Example
When a system interacts with an environment, the partial trace over the environment yields a reduced density matrix, demonstrating decoherence associated with ${topic}.

### 6. Mathematical Explanation
Evolution is given by E(ρ) = Σ E_k ρ E_k^† where Σ E_k^† E_k = I. 

### 7. Practical/Application Connection
Crucial for experimental realization of qubits (e.g., superconducting circuits, trapped ions) and understanding their T1 and T2 relaxation times for quantum error correction.

### 8. Key Points
- Generalized via density matrices.
- Evolution via CPTP maps and Lindbladians.
- Foundational for Quantum Error Correction.`;
      } else {
        return `### 1. Topic Introduction
Professional deep-dive into **${topic}**.

### 2. Simple/Conceptual Explanation
**${topic}** is a core operational principle in enterprise quantum computing, bridging hardware execution and algorithmic design.

### 3. Visual Representation
${visual}

### 4. Detailed Theory
Implementing ${topic} requires understanding the hardware abstraction layer. Whether using Qiskit, Cirq, or directly sending microwave pulses, the translation of logical operations to physical operations dictates performance.

### 5. Example
Like optimizing a classical compiler for a specific CPU architecture, adapting ${topic} for a specific QPU topology is essential.

### 6. Mathematical Explanation
Focus on the error rates: Total Fidelity F ≈ Π (1 - e_i), where e_i is the error rate of the individual gate implementing ${topic}.

### 7. Practical/Application Connection
Used in VQE (Variational Quantum Eigensolver) and QAOA (Quantum Approximate Optimization Algorithm) for near-term NISQ devices.

### 8. Key Points
- Focuses on practical implementation.
- Requires noise-aware compilation.
- Critical for NISQ era applications.`;
      }
    };

    const explanation = {
      school: `In this section, we explore **${topic}**. Concepts are explained in simple English with minimal math.`,
      intermediate: `In this section, we explore **${topic}**. Concepts include foundational mathematics and basic formulas.`,
      undergraduate: `In this section, we explore **${topic}**. Detailed theory with full mathematical formalism and algorithms.`,
      postgraduate: `In this section, we explore **${topic}**. Advanced research-level theory, algorithms, and deep mathematical formalism.`,
      others: `In this section, we explore **${topic}**. Practical industry-focused explanations and applications.`
    };

    const theory = {
      school: buildTheory('school'),
      intermediate: buildTheory('intermediate'),
      undergraduate: buildTheory('undergraduate'),
      postgraduate: buildTheory('postgraduate'),
      others: buildTheory('others')
    };

    function getPracticalExamples(topicStr, domain) {
      const t = topicStr.toLowerCase();
      
      const formatExample = (title, what, why, steps, expected, outcome, code = null) => {
        let result = `### 1. Example: ${title}\n\n`;
        result += `**What are we doing?**\n${what}\n\n`;
        result += `**Why is this related to the topic?**\n${why}\n\n`;
        result += `**Steps:**\n${steps}\n\n`;
        if (code) {
          result += `**Code/Implementation:**\n\`\`\`python\n${code}\n\`\`\`\n\n`;
        }
        result += `**Expected Result:**\n${expected}\n\n`;
        result += `**What you should understand:**\n${outcome}\n`;
        return result;
      };

      if (domain === 'school') {
        if (t.includes('superposition') || t.includes('state')) {
          return formatExample(
            "Coin Toss Analogy",
            "We are tossing a coin and covering it with our hand before looking at it.",
            "It shows how a qubit can be in a mix of 0 and 1 before we measure it.",
            "1. Toss the coin.\n2. Catch it and cover it.\n3. Acknowledge it is in a 'superposition' of Heads and Tails.\n4. Uncover it (Measure).",
            "The coin becomes exactly Heads or Tails.",
            "Measurement forces a quantum state into a definite classical state."
          );
        } else if (t.includes('entangle')) {
          return formatExample(
            "Magic Dice",
            "Rolling two connected magic dice on opposite sides of the room.",
            "It demonstrates how entangled particles always give correlated results no matter the distance.",
            "1. Create the magic link between the dice.\n2. Separate them.\n3. Roll both at the same time.",
            "Both dice land on the exact same number every time.",
            "Entangled qubits instantly share their outcomes."
          );
        } else if (t.includes('gate') || t.includes('circuit')) {
          return formatExample(
            "Light Switch Circuit",
            "Flipping switches to change a lightbulb's state.",
            "Quantum gates act like these switches but for qubits.",
            "1. Start with the light off (State 0).\n2. Flip the switch (Apply X gate).\n3. Check the light.",
            "The light turns on (State 1).",
            "Gates change the state of qubits."
          );
        } else if (t.includes('algorithm') || t.includes('search')) {
          return formatExample(
            "Finding a Card",
            "Finding a specific card in a deck without checking every single one.",
            "Quantum algorithms can search faster than checking one by one.",
            "1. Spread the cards out.\n2. Use a magic trick (quantum algorithm) to make the target card glow.\n3. Pick the glowing card.",
            "You find the card instantly.",
            "Quantum algorithms use interference to highlight the right answer."
          );
        } else {
          return formatExample(
            `Exploring ${topicStr} in Real Life`,
            `Using a simple everyday analogy to understand ${topicStr}.`,
            `Connecting abstract quantum concepts to things we see every day.`,
            "1. Think of a real-world object.\n2. Apply the quantum rule.\n3. See the difference.",
            "The object behaves in a 'quantum' way.",
            `Understanding the core idea behind ${topicStr}.`
          );
        }
      } else if (domain === 'intermediate') {
        if (t.includes('superposition')) {
          return formatExample(
            "Creating Superposition with Qiskit",
            "We are writing a small Python program to put a qubit into superposition using a Hadamard gate.",
            "This is the practical way to create the superposition state mathematically and physically.",
            "1. Initialize a Quantum Circuit with 1 qubit.\n2. Apply the H gate.\n3. Add a measurement.\n4. Run it on a simulator 1000 times.",
            "Around 500 times the result is '0', and 500 times the result is '1'.",
            "The H gate creates a 50/50 superposition, which becomes classical only upon measurement.",
            "from qiskit import QuantumCircuit, Aer, execute\nqc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.measure(0, 0)\nbackend = Aer.get_backend('qasm_simulator')\nresult = execute(qc, backend, shots=1000).result()\nprint(result.get_counts())"
          );
        } else if (t.includes('entangle') || t.includes('bell')) {
          return formatExample(
            "Building a Bell State",
            "Creating an entangled pair of qubits using Qiskit.",
            "This proves we can program entanglement by correlating two qubits.",
            "1. Initialize a Quantum Circuit with 2 qubits.\n2. Apply H gate to Qubit 0.\n3. Apply CNOT gate with Qubit 0 as control and Qubit 1 as target.\n4. Measure both.",
            "The results are always '00' or '11' with roughly equal probability. Never '01' or '10'.",
            "The CNOT gate entangles the target qubit with the control qubit.",
            "from qiskit import QuantumCircuit, Aer, execute\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure([0,1], [0,1])\nbackend = Aer.get_backend('qasm_simulator')\nresult = execute(qc, backend).result()\nprint(result.get_counts())"
          );
        } else if (t.includes('gate') || t.includes('circuit')) {
          return formatExample(
            "Applying Pauli Gates",
            "Using X, Y, and Z gates on a qubit.",
            "Shows how single-qubit operations modify the quantum state on the Bloch sphere.",
            "1. Apply X to flip |0> to |1>.\n2. Apply Z to flip the phase.\n3. Measure the results.",
            "The state flips definitively or acquires a phase shift that can be detected via interference.",
            "Quantum gates are just matrices rotating the state vector.",
            "from qiskit import QuantumCircuit\nqc = QuantumCircuit(1)\nqc.x(0)\nqc.z(0)\nprint(qc.draw())"
          );
        } else if (t.includes('algorithm') || t.includes('search')) {
          return formatExample(
            "2-Qubit Grover's Search",
            "Implementing a small search algorithm.",
            "Shows how amplitude amplification works in practice.",
            "1. Initialize in superposition.\n2. Apply Oracle to mark state |11>.\n3. Apply Diffusion operator.\n4. Measure.",
            "The measurement returns '11' with 100% probability.",
            "Quantum interference can be programmed to boost correct answers."
          );
        } else {
          return formatExample(
            `Programming ${topicStr}`,
            `Using Qiskit to build a basic example of ${topicStr}.`,
            `Translates the theory of ${topicStr} into executable code.`,
            "1. Define the quantum register.\n2. Apply the relevant quantum operations.\n3. Simulate and plot a histogram.",
            "The histogram reflects the theoretical probability distribution.",
            `How to implement ${topicStr} in a quantum framework.`
          );
        }
      } else if (domain === 'undergraduate') {
        if (t.includes('superposition')) {
          return formatExample(
            "Interference and Phase Kickback",
            "Demonstrating that relative phase matters by creating and then reversing superposition.",
            "Shows that superposition is not just classical probability, but involves complex amplitudes that can interfere.",
            "1. Apply H to |0>.\n2. Apply Z to change relative phase.\n3. Apply H again.\n4. Measure.",
            "The output is deterministically |1>, proving the Z gate modified the superposition before measurement.",
            "Superposition enables destructive and constructive interference.",
            "from qiskit import QuantumCircuit, Aer, execute\nqc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.z(0)\nqc.h(0)\nqc.measure(0, 0)\nbackend = Aer.get_backend('qasm_simulator')\nprint(execute(qc, backend, shots=100).result().get_counts())"
          );
        } else if (t.includes('entangle')) {
          return formatExample(
            "Quantum Teleportation Protocol",
            "Transferring the state of Qubit 0 to Qubit 2 using entanglement.",
            "The ultimate application of entanglement and Bell measurements.",
            "1. Create Bell pair between Q1 and Q2.\n2. Prepare Q0 in a random state.\n3. Perform Bell measurement on Q0 and Q1.\n4. Apply conditional Pauli gates to Q2.",
            "Q2 assumes the exact state that Q0 initially had.",
            "Entanglement allows quantum information to be transferred without transmitting the physical qubit.",
            "from qiskit import QuantumCircuit\nqc = QuantumCircuit(3, 2)\nqc.h(1)\nqc.cx(1, 2) # Entangle\nqc.cx(0, 1)\nqc.h(0) # Bell basis\nqc.measure([0,1], [0,1])\nqc.cx(1, 2)\nqc.cz(0, 2)"
          );
        } else if (t.includes('algorithm') || t.includes('shor')) {
          return formatExample(
            "Quantum Fourier Transform (QFT)",
            "Implementing a 3-qubit QFT circuit.",
            "QFT is the core subroutine of Shor's algorithm and Phase Estimation.",
            "1. Apply H gate to MSB.\n2. Apply controlled-phase rotations from other qubits.\n3. Repeat for next bits.\n4. Swap outputs.",
            "The state vector is transformed into the frequency domain.",
            "QFT achieves exponential speedup over the classical FFT.",
            "from qiskit.circuit.library import QFT\nqft = QFT(num_qubits=3, do_swaps=True).decompose()\nprint(qft.draw())"
          );
        } else if (t.includes('error')) {
          return formatExample(
            "3-Qubit Bit Flip Code",
            "Protecting a single logical qubit against a single bit-flip error.",
            "Introduces the concept of syndrome measurement without destroying the state.",
            "1. Encode: |ψ> -> α|000> + β|111>.\n2. Inject random X error.\n3. Measure parity (syndromes) using ancilla qubits.\n4. Apply correction based on syndrome.",
            "The logical state |ψ> is recovered perfectly.",
            "Redundancy and entanglement allow error correction in quantum systems."
          );
        } else {
          return formatExample(
            `Mathematical Simulation of ${topicStr}`,
            `Using statevectors to analyze ${topicStr}.`,
            `Provides a rigorous mathematical understanding rather than just measurement statistics.`,
            "1. Build the unitary matrix for the circuit.\n2. Multiply it by the initial state vector.\n3. Calculate the expectation values.",
            "The mathematical expectation matches the theoretical prediction.",
            `Linear algebra is the foundation of ${topicStr}.`
          );
        }
      } else if (domain === 'postgraduate') {
        if (t.includes('error') || t.includes('correction')) {
          return formatExample(
            "Surface Code Stabilizer Measurement",
            "Simulating the measurement of weight-4 plaquette and star operators in a topological code.",
            "Demonstrates fault-tolerant error correction on a 2D lattice, essential for scalable architectures.",
            "1. Define a 2D grid of data and ancilla qubits.\n2. Construct the stabilizer circuits (CX loops).\n3. Introduce a depolarizing noise model.\n4. Perform Minimum Weight Perfect Matching (MWPM) decoding.",
            "The logical error rate decreases exponentially as the code distance increases, provided the noise is below threshold.",
            "Topological codes are the leading candidate for fault-tolerant quantum computation.",
            "# Pseudocode for stabilizer measurement\n# qc.h(ancilla)\n# qc.cx(ancilla, data_qubits)\n# qc.h(ancilla)\n# qc.measure(ancilla, classical_reg)\n# decode_mwpm(syndromes)"
          );
        } else if (t.includes('hardware')) {
          return formatExample(
            "Simulating Transmon Decoherence",
            "Using Qiskit Dynamics or QuTiP to model the Lindblad master equation for a superconducting qubit.",
            "Connecting hardware physics to abstract quantum information.",
            "1. Define the Hamiltonian for a transmon (Duffing oscillator).\n2. Add collapse operators for T1 (relaxation) and T_phi (dephasing).\n3. Solve the master equation over time.",
            "The Bloch vector decays towards the z-axis (T2*) and then to the ground state |0> (T1).",
            "Real qubits are open quantum systems subject to environmental noise."
          );
        } else {
          return formatExample(
            `Advanced Research Application of ${topicStr}`,
            `Implementing a Variational Quantum Algorithm (VQA) leveraging ${topicStr}.`,
            `Shows how ${topicStr} is utilized in cutting-edge NISQ research.`,
            "1. Parameterize a quantum circuit (Ansatz).\n2. Define a cost function (Hamiltonian expectation).\n3. Use a classical optimizer to update the parameters.",
            "The optimizer converges to the ground state energy of the target molecule or optimization problem.",
            `Hybrid quantum-classical algorithms represent the near-term application of ${topicStr}.`
          );
        }
      } else {
        // Others (Professional/Industry)
        return formatExample(
          `Industry Implementation of ${topicStr}`,
          `Deploying ${topicStr} on a cloud-based Quantum Processing Unit (QPU).`,
          `Bridges the gap between theory and enterprise deployment.`,
          "1. Build the circuit using an SDK (Qiskit/Cirq).\n2. Transpile the circuit for the specific QPU topology (routing, layout).\n3. Apply readout error mitigation.\n4. Send to IBM Quantum or AWS Braket.",
          "The mitigated results closely match the ideal simulator results despite hardware noise.",
          `Real-world execution requires compiling, transpiling, and error mitigation for ${topicStr}.`
        );
      }
    }

    function getQuizData(topicStr, domain) {
      const t = topicStr.toLowerCase();
      
      const createQ = (id, type, question, options, correctAnswers, explanation, imageUrl = undefined) => {
        return { id, type, question, options, correctAnswers, explanation, imageUrl };
      };

      const q = [];
      const diff = domain === 'school' ? 'Easy' : (domain === 'undergraduate' || domain === 'postgraduate') ? 'Hard' : 'Medium';

      if (t.includes('superposition')) {
        q.push(createQ('q1', 'single', 'What does superposition mean in quantum computing?',
          ['A qubit is permanently 0', 'A qubit is permanently 1', 'A qubit exists as a combination of 0 and 1 until measured', 'Two qubits are connected'],
          [2], 'Superposition is the ability of a quantum system to be in multiple states simultaneously before measurement.'));
        
        q.push(createQ('q2', 'true-false', 'A classical computer bit can easily be placed into a quantum superposition.',
          ['True', 'False'], [1], 'False. Classical bits are strictly deterministic (0 or 1). Only qubits can exhibit quantum superposition.'));
          
        q.push(createQ('q3', 'multiple', 'Which of these gates can create a superposition from the |0⟩ state? (Select all)',
          ['X Gate', 'Hadamard (H) Gate', 'CNOT Gate', 'RX(pi/2) Gate'],
          [1, 3], 'The H gate and RX(pi/2) gate generate superposition states. The X gate merely flips the state.'));
          
        if (diff === 'Hard') {
          q.push(createQ('q4', 'scenario', 'You apply a Hadamard gate to |1⟩. What is the resulting state and the measurement probability?',
            ['|+⟩ with 100% chance of 1', '|-⟩ with 50% chance of 0 and 50% chance of 1', '|1⟩ with 100% chance of 1', '|-⟩ with 100% chance of 0'],
            [1], 'H|1⟩ creates the |-⟩ state (1/√2(|0⟩ - |1⟩)), which has a 50/50 probability of being measured as 0 or 1.'));
        } else {
          q.push(createQ('q4', 'picture', 'In the Bloch sphere visual representation, where does a state in equal superposition lie?',
            ['At the North Pole', 'At the South Pole', 'On the Equator', 'Inside the sphere'],
            [2], 'The North and South poles represent definite 0 and 1. The equator represents equal superpositions (like |+⟩ and |-⟩).', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bloch_sphere.svg/400px-Bloch_sphere.svg.png'));
        }
        
        q.push(createQ('q5', 'single', 'What happens immediately after you measure a qubit that is in superposition?',
          ['It stays in superposition', 'It collapses to a definite state (0 or 1)', 'It gets entangled', 'It becomes a classical computer'],
          [1], 'Measurement causes the wavefunction to collapse, forcing the qubit into a definite classical state.'));
      } else if (t.includes('entangle')) {
        q.push(createQ('q1', 'single', 'What is quantum entanglement?',
          ['When a qubit is in two states at once', 'A strong correlation between qubits where the state of one instantly dictates the state of the other', 'A way to clone qubits', 'When a computer crashes'],
          [1], 'Entanglement is a special connection between qubits such that their properties become perfectly correlated regardless of distance.'));
          
        q.push(createQ('q2', 'true-false', 'If two qubits are entangled, measuring one will have no effect on the other.',
          ['True', 'False'], [1], 'False. Measuring one entangled qubit instantly collapses the state of the other correlated qubit.'));
          
        q.push(createQ('q3', 'scenario', 'Alice and Bob share an entangled Bell pair (|00⟩ + |11⟩). Alice measures her qubit and gets a 1. What will Bob measure?',
          ['Definitely 0', 'Definitely 1', '50% chance of 0, 50% of 1', 'It depends on how far apart they are'],
          [1], 'Because the state is perfectly correlated (|00⟩ + |11⟩), if Alice measures 1, the system collapses to |11⟩, so Bob must also measure 1.'));
          
        if (diff === 'Hard') {
          q.push(createQ('q4', 'multiple', 'Which of the following circuits correctly generates a Bell state?',
            ['H(q0) -> CNOT(q0, q1)', 'X(q0) -> H(q1)', 'X(q1) -> H(q0) -> CNOT(q0, q1)', 'H(q0) -> H(q1)'],
            [0, 2], 'H followed by CNOT creates entanglement. If X is applied first, it creates a different Bell state, but it is still maximally entangled.'));
        } else {
          q.push(createQ('q4', 'multiple', 'What are real-world applications that rely on quantum entanglement? (Select all)',
            ['Quantum Teleportation', 'Making classical games faster', 'Superdense Coding', 'Quantum Key Distribution (QKD)'],
            [0, 2, 3], 'Teleportation, superdense coding, and QKD all use entanglement as a core resource.'));
        }
        
        q.push(createQ('q5', 'single', 'Did Albert Einstein support the idea of quantum entanglement initially?',
          ['Yes, he invented it', 'No, he famously called it "spooky action at a distance"', 'Yes, he won a Nobel prize for it', 'He didn\'t know about it'],
          [1], 'Einstein famously doubted the completeness of quantum mechanics due to entanglement, calling it "spooky action at a distance."'));
      } else if (t.includes('gate') || t.includes('circuit')) {
        q.push(createQ('q1', 'single', 'What is the quantum equivalent of the classical NOT gate?',
          ['Hadamard Gate', 'Pauli-X Gate', 'CNOT Gate', 'Pauli-Z Gate'],
          [1], 'The Pauli-X gate flips |0⟩ to |1⟩ and |1⟩ to |0⟩, making it the quantum NOT gate.'));
          
        q.push(createQ('q2', 'multiple', 'Which gates are single-qubit gates? (Select all)',
          ['Pauli-X', 'Pauli-Y', 'CNOT', 'Hadamard (H)', 'Toffoli'],
          [0, 1, 3], 'X, Y, and H gates act on a single qubit. CNOT acts on 2, and Toffoli acts on 3.'));
          
        q.push(createQ('q3', 'scenario', 'You apply a Pauli-Z gate to the state |0⟩. What happens?',
          ['It changes to |1⟩', 'It changes to -|0⟩', 'Nothing visibly changes, the state remains |0⟩', 'It goes into superposition'],
          [2], 'The Z gate applies a phase of -1 to the |1⟩ state. Since the state is purely |0⟩, the Z gate leaves it completely unchanged.'));
          
        if (diff === 'Hard') {
          q.push(createQ('q4', 'single', 'What is the matrix representation of the Pauli-Y gate?',
            ['[0 1; 1 0]', '[1 0; 0 -1]', '[0 -i; i 0]', '[1 1; 1 -1]/sqrt(2)'],
            [2], 'The Pauli-Y matrix contains imaginary units: [0, -i; i, 0].'));
        } else {
          q.push(createQ('q4', 'true-false', 'Quantum gates must be reversible operations.',
            ['True', 'False'], [0], 'True. All quantum gates (except measurement) are unitary operations, which means they are perfectly reversible.'));
        }
        
        q.push(createQ('q5', 'single', 'What does the CNOT gate do?',
          ['Flips the target qubit if the control qubit is |1⟩', 'Flips the control qubit if the target is |1⟩', 'Entangles all qubits in the circuit automatically', 'Measures the qubits'],
          [0], 'The Controlled-NOT (CNOT) gate flips the state of the target qubit ONLY when the control qubit is in the |1⟩ state.'));
      } else if (t.includes('algorithm')) {
        q.push(createQ('q1', 'single', `What is the primary advantage of quantum algorithms over classical algorithms?`,
          ['They run on smaller computers', 'They can solve certain specific problems exponentially or quadratically faster using quantum phenomena', 'They use less electricity', 'They are easier to program'],
          [1], 'Quantum algorithms leverage superposition, entanglement, and interference to drastically reduce the complexity of certain calculations.'));
          
        q.push(createQ('q2', 'multiple', `Which of the following are famous quantum algorithms? (Select all)`,
          ["Shor's Algorithm", "Grover's Algorithm", "Dijkstra's Algorithm", 'Quantum Phase Estimation'],
          [0, 1, 3], "Shor's, Grover's, and QPE are quantum algorithms. Dijkstra's is a classical pathfinding algorithm."));
          
        q.push(createQ('q3', 'true-false', `A quantum algorithm simply runs classical code but faster.`,
          ['True', 'False'], [1], 'False. Quantum algorithms use an entirely different paradigm based on quantum physics (interference, amplitudes), not just faster clock speeds.'));
          
        if (diff === 'Hard') {
          q.push(createQ('q4', 'scenario', `In an algorithm utilizing amplitude amplification, what role does the "oracle" play?`,
            ['It measures the qubits', 'It applies a negative phase shift to the correct target states', 'It increases the probability of all states equally', 'It copies the correct answer'],
            [1], 'The oracle identifies the solution(s) by flipping their phase, which the subsequent diffusion operator uses to amplify their probabilities.'));
        } else {
          q.push(createQ('q4', 'single', `Why are quantum algorithms probabilistic?`,
            ['Because scientists are guessing the code', 'Because quantum states collapse based on probability amplitudes during measurement', 'Because the hardware is broken', 'Because classical computers randomize the output'],
            [1], 'Quantum mechanics is inherently probabilistic upon measurement, so quantum algorithms are designed to maximize the probability of measuring the correct answer.'));
        }
        
        q.push(createQ('q5', 'single', `What does Shor's algorithm do?`,
          ['Searches an unstructured database', 'Factors large numbers exponentially faster than classical computers', 'Sorts lists instantly', 'Generates Bitcoin'],
          [1], 'Shor\'s algorithm is famous for its ability to factor integers in polynomial time, posing a threat to RSA cryptography.'));
      } else {
        // Generic fallback for any other topic
        q.push(createQ('q1', 'single', `What is the main theoretical focus of ${topicStr}?`,
          [`It acts as a substitute for classical memory`, `It is a core quantum principle/technique vital to quantum computation`, `It is only used in classical physics`, `It is an internet protocol`],
          [1], `${topicStr} plays a critical role in advancing quantum computing theory and application.`));
          
        q.push(createQ('q2', 'true-false', `In the context of quantum computing, ${topicStr} relies purely on standard binary logic (0s and 1s).`,
          ['True', 'False'], [1], `False. ${topicStr}, like all quantum computing concepts, operates on the principles of quantum mechanics, transcending binary logic.`));
          
        q.push(createQ('q3', 'multiple', `Which of the following are typically associated with ${topicStr}? (Select all)`,
          [`Quantum states`, `Deterministic outcomes`, `Complex mathematical spaces`, `Macroscopic classical objects`],
          [0, 2], `${topicStr} deals with quantum states mapped in complex Hilbert spaces, avoiding purely deterministic classical outcomes.`));
          
        if (diff === 'Hard') {
          q.push(createQ('q4', 'scenario', `If a researcher implements ${topicStr} in a noisy quantum environment (NISQ), what is the most likely challenge?`,
            [`The code won't compile`, `Decoherence and quantum noise will disrupt the delicate states required for ${topicStr}`, `The classical computer will crash`, `It will run too fast to observe`],
            [1], `Near-Term Intermediate Scale Quantum (NISQ) devices suffer from high error rates and decoherence, severely impacting complex processes like ${topicStr}.`));
        } else {
          q.push(createQ('q4', 'single', `How does ${topicStr} improve computing capabilities?`,
            [`By adding more RAM to a computer`, `By exploiting quantum mechanical properties for specific tasks`, `By upgrading the CPU clock speed`, `By using better cooling systems`],
            [1], `It provides computational advantages specifically by harnessing quantum mechanics.`));
        }
        
        q.push(createQ('q5', 'single', `Why is studying ${topicStr} important?`,
          [`It helps build better classical smartphones`, `It is a fundamental step toward building fault-tolerant, scalable quantum computers`, `It replaces the need for mathematics`, `It is just a theoretical anomaly`],
          [1], `Mastering ${topicStr} is essential for unlocking the full potential and practical deployment of quantum technologies.`));
      }

      return q;
    }

    const quizzes = {
      school: getQuizData(topic, 'school'),
      intermediate: getQuizData(topic, 'intermediate'),
      undergraduate: getQuizData(topic, 'undergraduate'),
      postgraduate: getQuizData(topic, 'postgraduate'),
      others: getQuizData(topic, 'others')
    };

    const examples = {
      school: getPracticalExamples(topic, 'school'),
      intermediate: getPracticalExamples(topic, 'intermediate'),
      undergraduate: getPracticalExamples(topic, 'undergraduate'),
      postgraduate: getPracticalExamples(topic, 'postgraduate'),
      others: getPracticalExamples(topic, 'others')
    };

    const puzzles = {
      school: getPuzzlesData(topic, 'school'),
      intermediate: getPuzzlesData(topic, 'intermediate'),
      undergraduate: getPuzzlesData(topic, 'undergraduate'),
      postgraduate: getPuzzlesData(topic, 'postgraduate'),
      others: getPuzzlesData(topic, 'others')
    };

    return {
      id: `quantum-c${chIdx + 1}-p${tpIdx + 1}`,
      title: topic,
      keyConcepts: [topic, "Theory", "Application"],
      explanation: explanation,
      theory,
      examples: examples,
      math: '\\langle \\psi | H | \\psi \\rangle',
      flashcards: {
        school: getFlashcardsData(topic, 'school', chIdx + 1, tpIdx + 1),
        intermediate: getFlashcardsData(topic, 'intermediate', chIdx + 1, tpIdx + 1),
        undergraduate: getFlashcardsData(topic, 'undergraduate', chIdx + 1, tpIdx + 1),
        postgraduate: getFlashcardsData(topic, 'postgraduate', chIdx + 1, tpIdx + 1),
        others: getFlashcardsData(topic, 'others', chIdx + 1, tpIdx + 1)
      },
      demo: getDemoData(topic),
      video: getVideoData(topic, `quantum-c${chIdx + 1}`),
      quizzes: quizzes,
      puzzles: puzzles
    };
  });

  return {
    id: `quantum-c${chIdx + 1}`,
    title: chap.title,
    pages: pages
  };
});

function getPuzzlesData(topic, domain, chIdx, tpIdx) {
  const t = topic.toLowerCase();
  
  let puzzle = `### Interactive Puzzle: Mastering ${topic}\n\n`;
  
  if (t.includes('superposition')) {
    puzzle += `**Challenge:** A quantum state for this topic is initialized. If you apply a Hadamard gate, the probability amplitude changes. For ${topic}, calculate the measurement probabilities if the state is $\\cos(${tpIdx * 10}^\\circ)|0\\rangle + \\sin(${tpIdx * 10}^\\circ)|1\\rangle$.\n\n`;
    puzzle += `*Hint: Use the Born rule.*`;
  } else if (t.includes('entangle') || t.includes('bell')) {
    puzzle += `**Challenge:** Two qubits are entangled in relation to ${topic}. If Qubit A is measured as |1⟩, Qubit B collapses. Construct a circuit that produces this specific entangled state starting from |00⟩, using exactly ${tpIdx % 2 === 0 ? 2 : 3} gates.\n\n`;
    puzzle += `*Hint: CNOT is required.*`;
  } else if (t.includes('algorithm') || t.includes('search') || t.includes('shor')) {
    puzzle += `**Challenge:** You are implementing ${topic} for a dataset of size N=${100 * (tpIdx + 1)}. Determine the exact number of oracle queries required to find the marked item with >90% probability.\n\n`;
    puzzle += `*Hint: The formula is approximately $(\\pi / 4) \\times \\sqrt{N}$.*`;
  } else if (t.includes('error') || t.includes('noise')) {
    puzzle += `**Challenge:** A quantum device running ${topic} experiences a bit-flip error on qubit ${tpIdx % 5}. Draw the syndrome measurement circuit required to detect this specific error without measuring the data qubit directly.\n\n`;
    puzzle += `*Hint: Use ancilla qubits.*`;
  } else if (t.includes('hardware') || t.includes('qubit')) {
    puzzle += `**Challenge:** The coherence time (T1) of the hardware for ${topic} is ${10 + tpIdx * 5} µs, and your gate time is ${50 + tpIdx} ns. How many sequential operations can you perform before the probability of error exceeds 50%?\n\n`;
    puzzle += `*Hint: Calculate the ratio of coherence time to gate time.*`;
  } else if (t.includes('math') || t.includes('matrix')) {
    puzzle += `**Challenge:** Write the $2^{${(tpIdx % 3) + 1}} \\times 2^{${(tpIdx % 3) + 1}}$ unitary matrix representation for the operations described in ${topic}. Prove that $U^\\dagger U = I$.\n\n`;
    puzzle += `*Hint: The rows and columns must be orthonormal.*`;
  } else if (t.includes('cryptography') || t.includes('qkd')) {
    puzzle += `**Challenge:** In a protocol applied to ${topic}, Eve intercepts ${tpIdx * 2 + 10}% of the photons. Calculate the Quantum Bit Error Rate (QBER) and determine if the key is secure.\n\n`;
    puzzle += `*Hint: The theoretical secure threshold is roughly 11%.*`;
  } else if (t.includes('teleport')) {
    puzzle += `**Challenge:** To teleport the state related to ${topic}, Alice performs a Bell measurement yielding outcome ${tpIdx % 4}. Which Pauli gate must Bob apply to recover the state?\n\n`;
    puzzle += `*Hint: Outcomes 0,1,2,3 correspond to I, X, Z, ZX.*`;
  } else {
    const hash = topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const gateOptions = ['Hadamard', 'Pauli-X', 'Pauli-Y', 'Pauli-Z', 'CNOT', 'Phase (S)', 'T', 'Toffoli'];
    const g1 = gateOptions[hash % gateOptions.length];
    const g2 = gateOptions[(hash + 1) % gateOptions.length];
    
    puzzle += `**Challenge:** A quantum sequence dedicated to ${topic} requires the application of a ${g1} gate followed by a ${g2} gate. Map the state evolution step-by-step from an initial state of $|0\\rangle$ (or $|00\\rangle$ if multi-qubit).\n\n`;
    puzzle += `*Hint: Multiply the state vector by the corresponding matrices.*`;
  }
  
  puzzle += `\n\n### Interview Questions for ${topic}\n\n`;
  puzzle += `1. **Technical:** How does the concept of ${topic} scale when we increase the number of qubits from ${tpIdx + 2} to ${tpIdx + 10}?\n`;
  puzzle += `2. **Conceptual:** If a client asks you to explain the physical intuition behind ${topic}, what real-world analogy would you use?\n`;
  if (domain === 'undergraduate' || domain === 'postgraduate') {
    puzzle += `3. **Mathematical/Advanced:** Provide a formal proof or derivation demonstrating the limits of ${topic} under a depolarizing channel with error rate $p=0.0${(tpIdx % 9) + 1}$.\n`;
  }

  return puzzle;
}

function getDemoData(topic) {
  const t = topic.toLowerCase();
  
  if (t.includes('superposition') || t.includes('state')) {
    return {
      type: 'superposition',
      title: `Interactive Demo: ${topic}`,
      stepDuration: 3000,
      steps: [
        { state: '0', description: 'The qubit starts in a classical |0⟩ state.' },
        { state: 'superposition', math: '|ψ⟩ = α|0⟩ + β|1⟩', description: 'A Hadamard gate is applied, putting the qubit into a quantum superposition of 0 and 1.' },
        { state: '1', description: 'Upon measurement, the state collapses into a definitive classical state (e.g. |1⟩).' }
      ]
    };
  } else if (t.includes('entangle') || t.includes('bell')) {
    return {
      type: 'entanglement',
      title: `Interactive Demo: ${topic}`,
      stepDuration: 3000,
      steps: [
        { q1: '0', q2: '0', entangled: false, description: 'Two independent qubits start in the |0⟩ state.' },
        { q1: 'superposition', q2: '0', entangled: false, description: 'The first qubit is put into superposition.' },
        { q1: 'superposition', q2: 'superposition', entangled: true, description: 'A CNOT gate entangles them. Their states are now perfectly correlated!' },
        { q1: '1', q2: '1', entangled: true, description: 'If we measure the first qubit as |1⟩, the second qubit immediately collapses to |1⟩.' }
      ]
    };
  } else if (t.includes('circuit') || t.includes('gate') || t.includes('phase')) {
    return {
      type: 'circuit',
      title: `Interactive Demo: ${topic}`,
      gates: ['H', 'X', 'Z', 'M'],
      stepDuration: 2000,
      steps: [
        { activeGateIndex: -1, finalState: '?', description: 'We start with an initial qubit state |ψ⟩.' },
        { activeGateIndex: 0, finalState: '?', description: 'Applying a Hadamard (H) gate creates a superposition.' },
        { activeGateIndex: 1, finalState: '?', description: 'Applying a Pauli-X gate flips the amplitudes.' },
        { activeGateIndex: 2, finalState: '?', description: 'Applying a Pauli-Z gate flips the phase of the |1⟩ component.' },
        { activeGateIndex: 3, finalState: 'measured', description: 'Measurement collapses the qubit to a classical bit.' }
      ]
    };
  } else if (t.includes('error') || t.includes('noise') || t.includes('correction')) {
    return {
      type: 'error-correction',
      title: `Interactive Demo: ${topic}`,
      stepDuration: 3500,
      steps: [
        { hasError: false, recovered: true, description: 'The logical qubit is encoded redundantly across multiple physical qubits.' },
        { hasError: true, recovered: false, description: 'Environmental noise causes a bit-flip error on one of the physical qubits!' },
        { hasError: false, recovered: true, description: 'Syndrome measurement detects the error, and a correction operation restores the state.' }
      ]
    };
  } else if (t.includes('algorithm') || t.includes('search') || t.includes('shor') || t.includes('transform')) {
    return {
      type: 'algorithm',
      title: `Interactive Demo: ${topic}`,
      stages: ['Initialize', 'Superposition', 'Oracle / Compute', 'Interference', 'Measure'],
      stepDuration: 2500,
      steps: [
        { stageIndex: 0, description: 'Initialize the quantum register to a known state.' },
        { stageIndex: 1, math: 'H^⊗n |0⟩', description: 'Apply Hadamard gates to create an equal superposition of all possible states.' },
        { stageIndex: 2, description: 'The quantum oracle marks the solution by flipping its phase.' },
        { stageIndex: 3, description: 'Amplitude amplification or quantum interference increases the probability of measuring the correct answer.' },
        { stageIndex: 4, description: 'Measure the register to obtain the classical result.' }
      ]
    };
  }

  // Fallback
  return {
    type: 'superposition',
    title: `Interactive Demo: ${topic}`,
    steps: [
      { state: 'superposition', description: `Explore the quantum phenomena of ${topic}.` }
    ]
  };
}

function getFlashcardsData(topic, domain, chapterIdx, topicIdx) {
  const t = topic.toLowerCase();
  let cards = [];
  
  const addCard = (front, back, formula, keyPoints) => {
    cards.push({
      id: `fc-c${chapterIdx}-t${topicIdx}-${cards.length + 1}`,
      front,
      back,
      ...(formula ? { formula } : {}),
      ...(keyPoints ? { keyPoints } : {})
    });
  };

  // Domain specific complexity
  if (domain === 'school') {
    if (t.includes('superposition')) {
      addCard(`What is ${topic}?`, `A quantum state where a qubit exists in a combination of 0 and 1.`, null, ["Like a spinning coin", "Mix of two states"]);
      addCard(`What happens when we measure it?`, `The qubit stops spinning and picks either 0 or 1.`, null, ["Measurement forces a decision"]);
      addCard(`Why is it useful?`, `It lets quantum computers explore many paths at once!`, null, ["Makes computers faster"]);
      addCard(`What is a Qubit?`, `A quantum bit, the basic unit of quantum information.`, null, ["Can be 0, 1, or both"]);
      addCard(`How is it different from a normal bit?`, `A normal bit is strictly 0 or 1, never both.`, null, ["Classical bits are rigid"]);
    } else if (t.includes('entangle')) {
      addCard(`What is ${topic}?`, `Two qubits become magically linked so that what happens to one happens to the other.`, null, ["Spooky action at a distance"]);
      addCard(`What if we separate them?`, `They stay connected no matter how far apart they are!`, null, ["Instant connection"]);
      addCard(`Who discovered this?`, `Einstein called it "spooky action at a distance".`, null, ["Famous physics puzzle"]);
      addCard(`How is it used?`, `For super secure messaging and quantum teleportation.`, null, ["Quantum internet"]);
      addCard(`Does it transfer matter?`, `No, it only transfers quantum information.`, null, ["Not like sci-fi teleportation"]);
    } else if (t.includes('gate') || t.includes('circuit')) {
      addCard(`What is a quantum gate?`, `Like a classical logic gate, it changes the state of qubits.`, null, ["Building block of circuits"]);
      addCard(`What does the Hadamard (H) gate do?`, `It puts a qubit into a superposition.`, null, ["Creates quantum magic"]);
      addCard(`What is a quantum circuit?`, `A series of quantum gates connected by wires representing qubits.`, null, ["Reads from left to right"]);
      addCard(`What does measurement do in a circuit?`, `It reads the final result and turns qubits into regular bits.`, null, ["End of the quantum calculation"]);
      addCard(`Can you reverse a quantum gate?`, `Yes, almost all quantum gates can be reversed!`, null, ["Quantum computing is reversible"]);
    } else {
      addCard(`What is ${topic}?`, `It is a fundamental concept in quantum computing.`, null, ["Core quantum principle"]);
      addCard(`Why do we need ${topic}?`, `To build faster and more powerful computers.`, null, ["Essential for quantum advantage"]);
      addCard(`Is ${topic} used in normal computers?`, `No, this is special to quantum mechanics.`, null, ["Quantum only"]);
      addCard(`How does ${topic} work?`, `It uses the rules of subatomic particles to process information.`, null, ["Physics meets computer science"]);
      addCard(`What is the main benefit?`, `Solving complex puzzles that normal computers cannot.`, null, ["Super fast calculations"]);
    }
  } else if (domain === 'intermediate') {
    if (t.includes('superposition')) {
      addCard(`Define ${topic}`, `The ability of a quantum system to be in multiple basis states simultaneously.`, null, ["Linear combination of states", "|ψ⟩ = α|0⟩ + β|1⟩"]);
      addCard(`What are α and β?`, `Probability amplitudes for the |0⟩ and |1⟩ states.`, "|α|² + |β|² = 1", ["Complex numbers", "Squares give probability"]);
      addCard(`What gate creates superposition?`, `The Hadamard (H) gate.`, "H|0⟩ = |+⟩", ["Creates equal superposition"]);
      addCard(`What is Measurement?`, `The process that collapses a superposition into a definitive classical bit.`, null, ["Irreversible process", "Probabilistic outcome"]);
      addCard(`What is the Bloch Sphere?`, `A 3D geometric representation of a single qubit state.`, null, ["Poles are |0⟩ and |1⟩", "Equator is superposition"]);
    } else if (t.includes('entangle')) {
      addCard(`Define ${topic}`, `A quantum state of multiple particles that cannot be described independently of each other.`, null, ["Non-local correlations"]);
      addCard(`What is a Bell State?`, `One of four maximally entangled two-qubit states.`, "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2", ["Basis for quantum teleportation"]);
      addCard(`How do you create entanglement?`, `By applying a Hadamard gate followed by a CNOT gate.`, null, ["H on control qubit", "CNOT targets second qubit"]);
      addCard(`What is Bell's Theorem?`, `Proves that quantum mechanics is incompatible with local hidden-variable theories.`, null, ["Rules out classical explanation"]);
      addCard(`What is Quantum Teleportation?`, `Transferring a quantum state using entanglement and classical communication.`, null, ["Destroys original state", "No-cloning theorem applies"]);
    } else if (t.includes('algorithm') || t.includes('search')) {
      addCard(`What is a quantum algorithm?`, `A step-by-step procedure running on a quantum computer to solve a problem.`, null, ["Exploits superposition and entanglement"]);
      addCard(`What is Grover's Algorithm?`, `A quantum algorithm for searching an unsorted database.`, "O(√N) time complexity", ["Quadratic speedup"]);
      addCard(`What is Shor's Algorithm?`, `A quantum algorithm for integer factorization.`, "O((log N)³) time complexity", ["Exponential speedup", "Breaks RSA cryptography"]);
      addCard(`What is an Oracle?`, `A black-box quantum gate that recognizes the correct solution.`, null, ["Flips the phase of the target state"]);
      addCard(`What is Amplitude Amplification?`, `A technique to increase the probability of measuring the correct answer.`, null, ["Used in Grover's algorithm"]);
    } else {
      addCard(`What is ${topic}?`, `A key concept enabling quantum computational advantage over classical systems.`, null, ["Quantum computing core"]);
      addCard(`How is ${topic} represented mathematically?`, `Using vectors and matrices in a complex Hilbert space.`, null, ["Linear algebra foundation"]);
      addCard(`What role does ${topic} play in algorithms?`, `It helps manipulate probability amplitudes to amplify correct answers.`, null, ["Interference", "Algorithm design"]);
      addCard(`How do we visualize ${topic}?`, `Often using quantum circuit diagrams or state vectors.`, null, ["Visual tools in Qiskit"]);
      addCard(`What is the biggest challenge for ${topic}?`, `Maintaining coherence and minimizing quantum noise.`, null, ["Decoherence", "Error rates"]);
      addCard(`Key takeaway for ${topic}?`, `It differentiates quantum information processing from classical logic.`, null, ["Fundamental shift in computing"]);
    }
  } else if (domain === 'undergraduate') {
    if (t.includes('superposition') || t.includes('state')) {
      addCard(`Formal Definition of ${topic}`, `A principle stating that any two quantum states can be added together to form another valid quantum state.`, "|ψ⟩ = Σ c_i |ϕ_i⟩", ["Hilbert space property"]);
      addCard(`What is the normalization condition?`, `The sum of the absolute squares of the amplitudes must equal 1.`, "Σ |c_i|² = 1", ["Preserves probability"]);
      addCard(`How does it relate to the Schrödinger equation?`, `It represents the linearity of the Schrödinger equation governing state evolution.`, "iℏ ∂|ψ⟩/∂t = H|ψ⟩", ["Linear PDE consequence"]);
      addCard(`What is a relative phase?`, `The complex phase difference between probability amplitudes in a superposition.`, "|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩", ["Creates interference effects", "Bloch sphere azimuth"]);
      addCard(`What is interference?`, `The phenomenon where probability amplitudes can add constructively or destructively.`, null, ["Core to quantum algorithm speedup"]);
      addCard(`How does superposition scale?`, `For n qubits, the state space is a 2^n dimensional complex vector space.`, null, ["Exponential scaling"]);
    } else if (t.includes('entangle')) {
      addCard(`Formal Definition of ${topic}`, `A composite state that cannot be factored into a tensor product of subsystem states.`, "|ψ_AB⟩ ≠ |ψ_A⟩ ⊗ |ψ_B⟩", ["Non-separable state"]);
      addCard(`What is the density matrix of a subsystem of an entangled state?`, `It is a mixed state, obtained by taking the partial trace over the other subsystem.`, "ρ_A = Tr_B(|ψ⟩⟨ψ|)", ["Reduced density operator"]);
      addCard(`What is the CHSH inequality?`, `A specific form of Bell's inequality used to experimentally prove entanglement.`, "S ≤ 2 (Classical), S ≤ 2√2 (Quantum)", ["Tsirelson's bound"]);
      addCard(`What is a Schmidt decomposition?`, `A way to express a bipartite pure state in terms of orthonormal bases for each subsystem.`, "|ψ⟩ = Σ λ_i |u_i⟩|v_i⟩", ["Measures entanglement entropy"]);
      addCard(`What is Monogamy of Entanglement?`, `A principle stating that if A is maximally entangled with B, neither can be entangled with C.`, null, ["Fundamental limit on sharing"]);
      addCard(`What is Superdense Coding?`, `Transmitting two classical bits using one qubit, assuming prior shared entanglement.`, null, ["Inverse of teleportation"]);
    } else if (t.includes('algorithm') || t.includes('shor') || t.includes('grover')) {
      addCard(`What is the purpose of ${topic}?`, `To exploit quantum mechanics for asymptotic speedups in computational complexity.`, null, ["BQP vs BPP"]);
      addCard(`What is an Oracle?`, `A black-box quantum operation used to encode the problem instance into a phase shift.`, "U_f |x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩", ["Reversible computation"]);
      addCard(`What is the Quantum Fourier Transform (QFT)?`, `A quantum analogue of the discrete Fourier transform, used in period finding.`, "O(n²) gates for n qubits", ["Core of Shor's Algorithm"]);
      addCard(`What is Amplitude Amplification?`, `A technique to increase the probability amplitude of a target state.`, null, ["Grover's Algorithm basis", "O(√N) speedup"]);
      addCard(`What is Phase Estimation?`, `An algorithm to estimate the eigenvalue of a unitary operator.`, "U|ψ⟩ = e^{2πiθ}|ψ⟩", ["Uses QFT dagger"]);
      addCard(`What are the complexity bounds for ${topic}?`, `Understanding the limits, such as the optimality of Grover's search.`, null, ["Lower bounds in query complexity"]);
    } else {
      addCard(`What is the formal definition of ${topic}?`, `A specialized concept within quantum information science.`, null, ["Undergraduate level rigour"]);
      addCard(`What mathematical structure describes ${topic}?`, `Unitary operators acting on a complex Hilbert space.`, "U^† U = I", ["Preserves inner product"]);
      addCard(`How does ${topic} relate to measurement?`, `It dictates the probabilistic outcome via projection operators.`, "P_m = ⟨ψ|M_m^† M_m|ψ⟩", ["POVMs and Projectors"]);
      addCard(`What is the physical significance of ${topic}?`, `It maps abstract mathematical models to physical quantum hardware behaviors.`, null, ["Hamiltonian dynamics"]);
      addCard(`What are the major theorems for ${topic}?`, `Key results that bound the capabilities of quantum systems.`, null, ["No-cloning", "No-communication"]);
      addCard(`What is the application of ${topic}?`, `Algorithm design, error correction, and quantum communication.`, null, ["Broad utility"]);
    }
  } else {
    // postgraduate and others
    if (t.includes('error') || t.includes('correction')) {
      addCard(`What is the Threshold Theorem in ${topic}?`, `States that arbitrarily long quantum computation is possible if error rate is below a certain threshold.`, "p < p_th", ["Fault tolerance"]);
      addCard(`What are Stabilizer Codes?`, `A class of quantum error correcting codes defined by an Abelian subgroup of the Pauli group.`, "S |ψ⟩ = |ψ⟩ ∀ S ∈ S", ["Gottesman-Knill theorem"]);
      addCard(`What is the Surface Code?`, `A topological quantum error correcting code with a 2D lattice of qubits.`, null, ["High threshold", "Only nearest-neighbor interactions"]);
      addCard(`What is a logical operator?`, `An operator that commutes with the stabilizer and acts non-trivially on the code space.`, null, ["Transversal gates"]);
      addCard(`What is Magic State Distillation?`, `A protocol to prepare high-fidelity non-Clifford resources for universal fault-tolerant computation.`, null, ["Bypasses Eastin-Knill theorem"]);
      addCard(`What are continuous variable (CV) codes?`, `Error correction for systems with infinite-dimensional Hilbert spaces, like bosonic modes.`, null, ["GKP codes", "Hardware efficient"]);
    } else if (t.includes('hardware')) {
      addCard(`What is the relaxation time (T1) in ${topic}?`, `The characteristic time for a qubit to decay from the excited state to the ground state.`, null, ["Energy relaxation", "Longitudinal coherence"]);
      addCard(`What is the dephasing time (T2) in ${topic}?`, `The time over which the relative phase between |0⟩ and |1⟩ is lost.`, "1/T2 = 1/(2T1) + 1/T_phi", ["Transverse coherence"]);
      addCard(`What is a Transmon qubit?`, `A type of superconducting charge qubit designed to have reduced sensitivity to charge noise.`, "E_J / E_C ≫ 1", ["Anharmonic oscillator"]);
      addCard(`What is the role of a microwave resonator?`, `Used for qubit readout via dispersive shift and for coupling qubits via a cavity bus.`, null, ["Circuit QED"]);
      addCard(`What are Trapped Ion qubits?`, `Atomic ions confined by electromagnetic fields, manipulated using laser pulses.`, null, ["High fidelity", "Long coherence times"]);
      addCard(`What is cross-talk?`, `Unwanted interactions or interference between qubits or control signals in a QPU.`, null, ["Limits multi-qubit gate fidelity"]);
    } else {
      addCard(`Advanced analysis of ${topic}`, `Involves deep understanding of open quantum systems, decoherence, and channel capacities.`, null, ["Postgraduate rigor"]);
      addCard(`How is ${topic} modeled in open systems?`, `Using the Lindblad master equation to describe non-unitary evolution.`, "dρ/dt = -i[H,ρ] + L(ρ)", ["CPTP maps"]);
      addCard(`What are the current research challenges for ${topic}?`, `Scaling qubit numbers while maintaining coherence and gate fidelities.`, null, ["NISQ era limitations"]);
      addCard(`How does ${topic} impact quantum complexity theory?`, `Provides bounds on computational power, relating BQP to PH and PSPACE.`, null, ["Complexity classes"]);
      addCard(`What are the cryptographic implications of ${topic}?`, `Evaluating the security of QKD protocols against collective and coherent attacks.`, null, ["Device-independent QKD"]);
      addCard(`What is the role of tensor networks in ${topic}?`, `Used to simulate strongly correlated quantum systems and optimize quantum circuits.`, null, ["MPS", "PEPS", "MERA"]);
    }
  }
  
  // Guarantee minimum cards
  while (cards.length < 5) {
     addCard(`Concept Review: ${topic}`, `Essential principle related to ${topic} for ${domain} level.`, null, ["Review theory section"]);
  }
  
  // Create 3 extra varied cards to reach the desired quantity for large/medium topics
  if (t.length > 10) {
      addCard(`Additional Property of ${topic}`, `It heavily relies on the fundamental rules of quantum mechanics.`, null, ["Quantum uniqueness"]);
      addCard(`Common Misconception about ${topic}`, `Many people think it operates exactly like classical computing, but it is fundamentally different.`, null, ["Paradigm shift"]);
      addCard(`Future Outlook for ${topic}`, `It is one of the most active areas of research in physics and computer science today.`, null, ["Rapidly evolving field"]);
  }

  return cards;
}

const quantumCurriculum = {
  domain: 'quantum',
  chapters: generatedChapters
};

const outputContent = `// AUTO-GENERATED BY scripts/generateQuantumSyllabus.js
import type { CurriculumDomain } from '../types';

export const quantumCurriculum: CurriculumDomain = ${JSON.stringify(quantumCurriculum, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'curriculum.ts');
fs.writeFileSync(outputPath, outputContent, 'utf-8');
console.log(`Successfully generated curriculum.ts with 5 standard tracks at ${outputPath}`);
