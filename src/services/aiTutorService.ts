import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  isThinking?: boolean;
}

export interface UserContextOptions {
  selectedModel?: string;
  userProfile?: {
    name?: string;
    level?: number;
    completedLessons?: string[];
    completedQuizzes?: string[];
    learningPath?: string | null;
  };
}

export function getStoredApiKey(): string {
  try {
    const key = localStorage.getItem('entangle_gemini_api_key');
    if (key && key.trim()) return key.trim();
  } catch (e) {
    console.error('localStorage access failed', e);
  }
  try {
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {}
  return '';
}

export function setStoredApiKey(key: string): void {
  try {
    const trimmed = key ? key.trim() : '';
    if (trimmed) {
      localStorage.setItem('entangle_gemini_api_key', trimmed);
    } else {
      localStorage.removeItem('entangle_gemini_api_key');
    }
  } catch (e) {
    console.error('localStorage access failed', e);
  }
}

export async function fetchAiTutorResponse(
  prompt: string,
  learningPath: string = 'intermediate',
  chatHistory: ChatMessage[] = [],
  options?: UserContextOptions
): Promise<string> {
  const apiKey = getStoredApiKey();
  const selectedModel = options?.selectedModel || '';
  const isOfflineRequested = selectedModel.includes('Offline') || selectedModel.includes('Built-in');

  // If Gemini API Key is available and offline mode is not forced, try Gemini API
  if (apiKey && !isOfflineRequested) {
    try {
      const userContextSummary = options?.userProfile
        ? `User Context: Name="${options.userProfile.name || 'Learner'}", Level=${options.userProfile.level || 1}, Completed Lessons=[${(options.userProfile.completedLessons || []).join(', ')}], Completed Quizzes=[${(options.userProfile.completedQuizzes || []).join(', ')}]`
        : `User Context: Selected learning level="${learningPath}"`;

      const systemInstructionText = `You are an advanced, empathetic, and highly capable AI Learning Assistant for the ENTANGLE education platform. Your goal is to help students learn effectively, focusing primarily on their active course (e.g. Quantum Computing) but capable of helping with related topics like programming, math, and physics.

CRITICAL TEACHING GUIDELINES:
1. ALWAYS answer the learner's actual question directly. Do NOT respond with generic predefined choices or menu-like responses. Do NOT repeatedly ask the learner what they want to do next.
2. TEACH, DON'T JUST TELL: Act as a Socratic tutor, but only ask a follow-up question when the learner's request is genuinely unclear or when specifically checking for understanding. Otherwise, explain the concept clearly and step-by-step.
3. REAL-WORLD EXAMPLES: If the learner asks for a real-world example or analogy, immediately give a highly relevant, simple real-world example. Connect the analogy back to the quantum/technical concept.
4. ADAPTIVE DIFFICULTY: Tailor explanations to the user's active learning level ("${learningPath}"). Start with a simple explanation. If the user asks "why" or "how", go deeper and explain the reasoning clearly. If the user says "I don't understand", explain it again using an even simpler approach and a completely different real-world analogy.
5. TONE & EMPATHY: Be friendly, encouraging, and patient. Never make the learner feel bad for asking basic questions.

CODING & DEBUGGING:
- Code Generation: If the learner asks for code, provide clean, well-commented code examples and explain it.
- Line-by-Line Explanation: If requested, explain the code line-by-line clearly.
- Debugging: When the user asks to debug code or asks for help with an error, identify the exact error, explain *why* it happened, and provide the corrected code. Provide hints if they specifically want to figure it out themselves.

ASSESSMENT & REVISION:
- Practice: Generate practice questions, MCQs, coding exercises, and scenarios when asked. Do NOT immediately reveal the answers; ask the learner to try first.
- Summaries & Comparisons: Summarize difficult topics in simple bullet points. Compare and contrast related concepts clearly.
- Exam Prep: Help with revision by asking targeted questions based on the learner's progress.

CONTEXT AWARENESS:
${userContextSummary}
- Use the learner's progress (Completed Lessons, Quizzes) to personalize your examples and assess what they already know.
- Use the current topic as context, but allow questions about related topics.
- Maintain the context of the current conversation to answer follow-up questions effectively.

INTENT RECOGNITION:
- Greetings/Casual: Respond naturally and briefly. (e.g., "Hey! 👋 What would you like to learn today?")
- Non-related topics: Politely answer general science/math/programming questions, but guide the user back to their curriculum if they ask completely unrelated things.`;

      // Build conversation turns for Gemini API (user / model)
      const rawHistory = chatHistory
        .filter((msg) => msg.content.trim().length > 0)
        .map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

      // Gemini API requires the conversation to start with a 'user' role and strictly alternate.
      const historyTurns: { role: string; parts: { text: string }[] }[] = [];
      for (const msg of rawHistory) {
        if (historyTurns.length === 0) {
          if (msg.role === 'user') {
            historyTurns.push(msg);
          }
        } else {
          if (msg.role !== historyTurns[historyTurns.length - 1].role) {
            historyTurns.push(msg);
          } else {
            // Combine consecutive messages of the same role to maintain strict alternation
            historyTurns[historyTurns.length - 1].parts[0].text += '\n\n' + msg.parts[0].text;
          }
        }
      }

      const contents = historyTurns.length > 0
        ? historyTurns
        : [{ role: 'user', parts: [{ text: prompt }] }];

      let attempt = 0;
      const maxAttempts = 3;
      let lastError = null;

      const ai = new GoogleGenAI({ apiKey });

      while (attempt < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contents,
            config: {
              systemInstruction: systemInstructionText,
            }
          });

          if (response.text) {
            return response.text;
          }
          throw new Error("Gemini API returned an empty response.");
        } catch (err: any) {
          attempt++;
          console.error(`Gemini API request failed (Attempt ${attempt}/${maxAttempts}):`, err);
          
          const status = err.status || err.response?.status;
          const errMessage = err.message || 'Unknown error';

          if (status === 400) {
            return `⚠️ **Gemini API Configuration Error**\n\nThe request was invalid. Please check the model configuration. Error: ${errMessage}`;
          } else if (status === 401 || status === 403) {
             return `⚠️ **Gemini API Key Error**\n\nYour API key is invalid or lacks permissions. Please check your API key in the settings.`;
          } else if (status === 404) {
             return `⚠️ **Gemini Model Not Found Error**\n\nThe configured model is not found or not supported. Please check the model configuration. Error: ${errMessage}`;
          } else if (status === 429) {
             lastError = `⚠️ **AI Tutor is temporarily unavailable. Please try again in a moment.**`;
          } else if (status >= 500) {
             lastError = `⚠️ **AI Tutor is temporarily unavailable. Please try again in a moment.**`;
          } else {
             lastError = `⚠️ **Gemini API Error**\n\nError ${status || errMessage}`;
          }

          if (status >= 400 && status < 500 && status !== 429) {
             return lastError;
          }

          if (attempt >= maxAttempts) {
             return lastError;
          }

          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }
      }
      return lastError || "Unknown Error";
    } catch (err: any) {
      console.error("Gemini API request failed in outer try-catch:", err);
      return `⚠️ **Gemini API Error**\n\nI couldn't process your request due to an API error: ${err.message || 'Network failure'}.\n\nPlease check your API key and connection.`;
    }
  }

  // Fallback to built-in Quantum AI Engine
  return generateVersatileAiResponse(prompt, learningPath, chatHistory, options);
}

function generateVersatileAiResponse(
  prompt: string,
  path: string,
  _chatHistory: ChatMessage[],
  _options?: UserContextOptions
): string {
  const rawQuery = prompt.trim();
  const query = rawQuery.toLowerCase();
  const level = path.toLowerCase();
  const isBeginner = level === 'school' || level === 'beginner';
  const isAdvanced = level === 'undergraduate' || level === 'postgraduate' || level === 'advanced';

  // ----------------------------------------------------
  // 1. GREETINGS & INTENT: Respond naturally and briefly
  // ----------------------------------------------------
  const greetingPattern = /^(hi+|hello+|hey+|hlo+|hlooo+|hllo+|howdy|greetings|good\s*(morning|afternoon|evening)|yo|sup|what'?s\s*up)(\s+.*)?$/i;
  const isGreetingWord = /^(hi+|hello+|hey+|hlo+|hlooo+|hllo+|howdy|yo|sup)$/i.test(query);

  if (isGreetingWord || (greetingPattern.test(query) && !isQuantumTopic(query) && !isQuizRequest(query) && !isCodeRequest(query))) {
    return `Hey! 👋 I'm your Quantum Tutor. What would you like to learn today?`;
  }

  if (/^(how are you|how's it going|how do you do)/i.test(query)) {
    return `I'm doing great! ⚡ Operating with high quantum coherence and ready to help you learn. What would you like to explore today?`;
  }

  if (/^(thank you|thanks|thx|awesome|great|cool|perfect|good job)/i.test(query)) {
    return `You're very welcome! 😊 Let me know if you have any more questions about quantum computing, Qiskit, or your lessons!`;
  }

  if (/^(bye|goodbye|cya|see you|catch you later)/i.test(query)) {
    return `Goodbye! 👋 Keep exploring the quantum realm, and see you next time! ⚛️`;
  }

  if (/^(who are you|what is your name|what can you do|help me|tell me about yourself)/i.test(query)) {
    const trackLabel = level.toUpperCase();
    return `🤖 **Hi! I'm your Quantum AI Tutor**

I'm here to support your learning journey on the **${trackLabel}** track!

**Here is what I can help you with:**
1. **Explain Quantum Concepts**: Qubits, superposition, measurement, gates, entanglement, and quantum algorithms.
2. **Qiskit Coding & Debugging**: Write clean Python Qiskit code and fix circuit syntax or logic errors.
3. **Quizzes & Practice**: Test your knowledge with custom questions tailored to your level.
4. **General & Science Support**: Answer math, programming, or physics questions.

What topic would you like to explore first?`;
  }

  // ----------------------------------------------------
  // 2. QUIZZES & PRACTICE: Do NOT reveal answers upfront
  // ----------------------------------------------------
  if (isQuizRequest(query)) {
    return generateQuizResponse(query, level);
  }

  // ----------------------------------------------------
  // 3. QISKIT HELP & CODE DEBUGGING
  // ----------------------------------------------------
  if (isCodeRequest(query) || query.includes('qiskit')) {
    return generateQiskitResponse(query);
  }

  // ----------------------------------------------------
  // 4. QUANTUM TOPICS (Definition → Intuition → Example → Equation/Circuit/Code)
  // ----------------------------------------------------
  if (query.includes('qubit') || query.includes('quantum bit')) {
    return explainQubit(isBeginner, isAdvanced);
  }

  if (query.includes('superposition')) {
    return explainSuperposition(isBeginner, isAdvanced);
  }

  if (query.includes('measurement') || query.includes('collapse') || query.includes('born rule')) {
    return explainMeasurement(isBeginner, isAdvanced);
  }

  if (query.includes('bell state') || query.includes('entangle')) {
    return explainEntanglement(isBeginner, isAdvanced);
  }

  if (query.includes('gate') || query.includes('hadamard') || query.includes('cnot') || query.includes('pauli')) {
    return explainQuantumGates(isBeginner, isAdvanced);
  }

  if (query.includes('shor') || query.includes('factor')) {
    return explainShorAlgorithm(isBeginner, isAdvanced);
  }

  if (query.includes('grover') || query.includes('search')) {
    return explainGroverAlgorithm(isBeginner, isAdvanced);
  }

  if (query.includes('qft') || query.includes('fourier')) {
    return explainQFT(isBeginner, isAdvanced);
  }

  if (query.includes('vqe') || query.includes('variational eigensolver')) {
    return explainVQE(isBeginner, isAdvanced);
  }

  if (query.includes('qaoa')) {
    return explainQAOA(isBeginner, isAdvanced);
  }

  if (query.includes('error correction') || query.includes('surface code') || query.includes('qec')) {
    return explainQEC(isBeginner, isAdvanced);
  }

  if (query.includes('qml') || query.includes('quantum machine learning') || query.includes('quantum neural')) {
    return explainQML(isBeginner, isAdvanced);
  }

  // ----------------------------------------------------
  // 5. GENERAL NON-QUANTUM QUESTIONS (Math / General Science / Coding)
  // ----------------------------------------------------
  if (/^(\d+\s*[\+\-\*\/]\s*\d+)/.test(query)) {
    try {
      // Simple evaluator for safe basic math
      const mathMatch = query.match(/^(\d+)\s*([\+\-\*\/])\s*(\d+)/);
      if (mathMatch) {
        const a = parseFloat(mathMatch[1]);
        const op = mathMatch[2];
        const b = parseFloat(mathMatch[3]);
        let res = 0;
        if (op === '+') res = a + b;
        if (op === '-') res = a - b;
        if (op === '*') res = a * b;
        if (op === '/') res = b !== 0 ? a / b : NaN;
        return `🧮 **${a} ${op} ${b} = ${res}**`;
      }
    } catch (e) {
      // Fall through
    }
  }

  // ----------------------------------------------------
  // 6. DEFAULT INTELLECTUAL TUTOR RESPONSE
  // ----------------------------------------------------
  return `💡 **Learning Note on: "${rawQuery}"**

That's a great question! However, I am currently running on my limited offline built-in engine. To get a fully contextual, step-by-step explanation or a real-world example, please add a Gemini API Key in the settings (bottom left corner). 

In the meantime, feel free to ask about specific topics like qubits, superposition, measurement, or Qiskit code!`;
}

// Helper functions for topic matching
function isQuantumTopic(q: string): boolean {
  return /(qubit|superposition|measurement|gate|entangl|bell|shor|grover|qft|vqe|qaoa|error correction|qml|quantum)/i.test(q);
}

function isQuizRequest(q: string): boolean {
  return /(quiz|practice|test me|questions|exercise)/i.test(q);
}

function isCodeRequest(q: string): boolean {
  return /(qiskit|python|code|script|circuit|openqasm|qasm|debug|fix my code|error|import)/i.test(q);
}

// --------------------------------------------------------------------
// EXPLANATION BUILDERS (Definition → Intuition → Example → Equation/Code)
// --------------------------------------------------------------------

function explainQubit(isBeginner: boolean, isAdvanced: boolean): string {
  if (isBeginner) {
    return `⚛️ **What is a Qubit?**

• **Definition**: A qubit (short for quantum bit) is the basic unit of information in a quantum computer.
• **Intuition**: A classical bit in your phone or laptop is like a light switch—it can only be strictly OFF (0) or ON (1). A qubit is like a spinning coin—while it is spinning on a table, it has a chance of landing on Heads (0) or Tails (1) at the same time until it stops!
• **Example**: If you toss a coin, while it's in the air it holds probabilities of both outcomes. Measurement is catching the coin to see the final result.
• **Equation**: $|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$ (where $|\alpha|^2 + |\beta|^2 = 1$).`;
  }

  if (isAdvanced) {
    return `⚛️ **The Qubit (Two-Level Quantum System)**

• **Definition**: A qubit is a two-dimensional quantum mechanical system whose state space is a 2D complex Hilbert space $\\mathcal{H} \\cong \\mathbb{C}^2$.
• **Intuition**: Unlike classical bits restricted to discrete values $\{0, 1\}$, a pure qubit state corresponds to a point on the unit sphere $\\mathbb{S}^2$ called the **Bloch Sphere**.
• **Example**: Computational basis states are orthonormal vectors $|0\\rangle = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $|1\\rangle = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$. Pure states satisfy $\\text{Tr}(\\rho^2) = 1$.
• **Equation**:
$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle, \\quad \\theta \\in [0, \\pi], \\phi \\in [0, 2\\pi)$$

• **Qiskit Implementation**:
\`\`\`python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.h(0)  # Superposition state (|0> + |1>)/sqrt(2)
state = Statevector.from_instruction(qc)
print("Qubit statevector:", state)
\`\`\``;
  }

  // Intermediate
  return `⚛️ **What is a Qubit?**

• **Definition**: A qubit (quantum bit) is the fundamental unit of quantum information, capable of existing in state $|0\\rangle$, state $|1\\rangle$, or any quantum superposition of both.
• **Intuition**: While a classical bit can only store 0 or 1, a qubit's state vector moves smoothly across a 3D sphere called the **Bloch Sphere**.
• **Example**: Applying a Hadamard gate ($H$) to state $|0\\rangle$ puts the qubit into an equal superposition state $|+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$.
• **Equation**:
$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle \\quad \\text{where } |\\alpha|^2 + |\\beta|^2 = 1$$
Where $|\\alpha|^2$ is the probability of measuring $0$ and $|\\beta|^2$ is the probability of measuring $1$.

• **Qiskit Code**:
\`\`\`python
from qiskit import QuantumCircuit
qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)
print(qc)
\`\`\``;
}

function explainSuperposition(isBeginner: boolean, isAdvanced: boolean): string {
  if (isBeginner) {
    return `✨ **Understanding Quantum Superposition**

• **Definition**: Superposition is the ability of a quantum system to exist in multiple states at the same time until it is measured.
• **Intuition**: Think of playing two notes on a piano simultaneously to create a single chord. The musical chord isn't just Note A or Note B—it is a combination of both sounding together!
• **Example**: When you pass a qubit through a Hadamard gate, it enters a superposition where it is 50% $|0\rangle$ and 50% $|1\rangle$.
• **Equation**: $|\\psi\\rangle = \\frac{1}{\\sqrt{2}}|0\\rangle + \\frac{1}{\\sqrt{2}}|1\\rangle$`;
  }

  if (isAdvanced) {
    return `✨ **Quantum Superposition & Linear State Spaces**

• **Definition**: Superposition is a direct consequence of the linearity of the Schrödinger equation and the vector space axioms of Hilbert space $\\mathcal{H}$, allowing any linear combination of valid state vectors $\\sum_i c_i |i\\rangle$ to form a valid physical state.
• **Intuition**: Quantum interference occurs because complex probability amplitudes $c_i \\in \\mathbb{C}$ can interfere constructively or destructively depending on relative phase $e^{i\\phi}$.
• **Example**: Interferometry experiments (such as the Mach-Zehnder interferometer) demonstrate constructive interference on state $|0\\rangle$ and destructive interference on state $|1\\rangle$.
• **Equation**:
$$|\\psi\\rangle = \\sum_{i} c_i |i\\rangle, \\quad \\sum_{i} |c_i|^2 = 1$$

• **Qiskit Circuit**:
\`\`\`python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.h(0) # Applies Hadamard operator H = 1/sqrt(2) * [[1, 1], [1, -1]]
print("State:", Statevector(qc))
\`\`\``;
  }

  return `✨ **Understanding Quantum Superposition**

• **Definition**: Superposition is the principle that a quantum system can exist in a linear combination of its basis states simultaneously until measurement occurs.
• **Intuition**: Imagine a coin spinning rapidly on a table. While spinning, it isn't strictly Heads or Tails—it is in a combined state of both.
• **Example**: In quantum algorithms, $n$ qubits in superposition allow a quantum computer to evaluate $2^n$ state configurations in a single computational step.
• **Equation**:
$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$$
Measurement yields outcome $0$ with probability $P(0) = |\\alpha|^2$ and $1$ with probability $P(1) = |\\beta|^2$.

• **Qiskit Code**:
\`\`\`python
from qiskit import QuantumCircuit
qc = QuantumCircuit(1, 1)
qc.h(0)            # Create superposition
qc.measure(0, 0)   # Collapse to definite state (0 or 1)
\`\`\``;
}

function explainMeasurement(isBeginner: boolean, isAdvanced: boolean): string {
  if (isBeginner) {
    return `🔍 **Quantum Measurement & State Collapse**

• **Definition**: Measurement is the act of looking at or checking a qubit's value, which forces its superposition to collapse into a single definite result ($0$ or $1$).
• **Intuition**: Imagine a spinning coin. As soon as you slam your hand down to catch it, the coin stops spinning and is forced to show either Heads or Tails.
• **Example**: If a qubit is in a 50/50 superposition, measuring it will give $0$ half the time and $1$ half the time when repeated many times.
• **Equation**: $P(0) = 50\\%, \\quad P(1) = 50\\%$`;
  }

  if (isAdvanced) {
    return `🔍 **Quantum Measurement & Projective Operators**

• **Definition**: A projective measurement is described by a set of Hermitian projection operators $\{P_m\}$ satisfying $\\sum_m P_m = I$ and $P_m P_{m'} = \\delta_{mm'} P_m$.
• **Intuition**: Measurement acts as an irreversible projection of the state vector $|\psi\rangle$ onto one of the eigenvectors of the observable operator.
• **Example**: Von Neumann projective measurement of state $|\psi\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$ in computational basis $Z = |0\\rangle\\langle 0| - |1\\rangle\\langle 1|$.
• **Equation**:
$$\\text{Born's Rule: } P(m) = \\langle \\psi | P_m | \\psi \\rangle, \\quad |\\psi'\\rangle = \\frac{P_m |\\psi\\rangle}{\\sqrt{P(m)}}$$`;
  }

  return `🔍 **Quantum Measurement & Collapse**

• **Definition**: Quantum measurement extracts classical information from a quantum state, causing the superposition $|\psi\rangle$ to non-reversibly collapse into an eigenstate of the measured basis.
• **Intuition**: Before measurement, a qubit possesses probabilistic possibilities. After measurement, it retains only the observed classical outcome.
• **Example**: Born's Rule dictates that state $|\psi\rangle = \frac{\sqrt{3}}{2}|0\rangle + \frac{1}{2}|1\rangle$ yields outcome $0$ with $75\%$ probability ($(\sqrt{3}/2)^2 = 0.75$) and outcome $1$ with $25\%$ probability.
• **Equation**: $P(i) = |\langle i | \psi \rangle|^2$`;
}

function explainEntanglement(isBeginner: boolean, isAdvanced: boolean): string {
  if (isBeginner) {
    return `🔗 **Quantum Entanglement & Bell States**

• **Definition**: Entanglement is a special quantum connection between two qubits where measuring one instantly tells you the exact state of the other, no matter how far apart they are.
• **Intuition**: Imagine a pair of magical shoes placed in two separate boxes. If you open Box A and find a Left shoe, you instantly know Box B holds the Right shoe!
• **Example**: Creating a Bell State uses a Hadamard gate on Qubit 0 and a CNOT gate connecting Qubit 0 to Qubit 1.
• **Equation**: $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$`;
  }

  if (isAdvanced) {
    return `🔗 **Quantum Entanglement & Bell State Formalism**

• **Definition**: A quantum state $|\psi_{AB}\rangle \in \mathcal{H}_A \otimes \mathcal{H}_B$ is entangled if it cannot be factored as a tensor product of single-qubit states $|\phi_A\rangle \otimes |\chi_B\rangle$.
• **Intuition**: Entangled systems exhibit non-local quantum correlations that violate Bell's Inequalities (CHSH inequality $S \le 2$ classically vs $S = 2\sqrt{2}$ quantumly).
• **Example**: The 4 Maximally Entangled Maximally Mixed-Reduced Bell Basis States:
$$|\\Phi^{\\pm}\\rangle = \\frac{|00\\rangle \\pm |11\\rangle}{\\sqrt{2}}, \\quad |\\Psi^{\\pm}\\rangle = \\frac{|01\\rangle \\pm |10\\rangle}{\\sqrt{2}}$$

• **Qiskit Bell State Circuit**:
\`\`\`python
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.h(0)        # Hadamard on q0
qc.cx(0, 1)    # CNOT with control q0, target q1
qc.measure([0, 1], [0, 1])
print(qc)
\`\`\``;
  }

  return `🔗 **Quantum Entanglement & Bell States**

• **Definition**: Entanglement is a quantum phenomenon where two or more qubits become correlated such that the quantum state of one qubit cannot be described independently of the second qubit.
• **Intuition**: If two qubits are entangled in state $|\Phi^+\rangle$, measuring Qubit 0 as $0$ guarantees Qubit 1 will also yield $0$.
• **Example**: Bell State $|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$.
• **Equation**:
$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$

• **Qiskit Code**:
\`\`\`python
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])
print(qc)
\`\`\``;
}

function explainQuantumGates(isBeginner: boolean, isAdvanced: boolean): string {
  if (isBeginner) {
    return `🔲 **Quantum Gates Overview**

• **Definition**: Quantum gates are operations that change the state of qubits in a quantum circuit.
• **Intuition**: Just like classical logic gates (AND, OR, NOT) process bits, quantum gates rotate qubits to process quantum information.
• **Example**:
  - **Pauli-X Gate**: Flips $|0\rangle \to |1\rangle$ (Quantum NOT).
  - **Hadamard (H) Gate**: Turns $|0\rangle$ into a 50/50 superposition state.
  - **CNOT Gate**: Linked gate that flips a second qubit if the first qubit is $1$.`;
  }

  if (isAdvanced) {
    return `🔲 **Unitary Operator Formalism of Quantum Gates**

• **Definition**: Quantum gates are unitary operators $U$ acting on Hilbert space $\\mathcal{H}$ satisfying $U^\\dagger U = U U^\\dagger = I$, preserving inner products and probability norms.
• **Matrix Representations**:
  - **Pauli-X**: $X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$
  - **Pauli-Z**: $Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$
  - **Hadamard**: $H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$
  - **CNOT**: $CNOT = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\end{pmatrix}$

• **Rotation Gates**: $R_x(\\theta) = e^{-i \\theta X / 2} = \\cos(\\theta/2)I - i \\sin(\\theta/2)X$.`;
  }

  return `🔲 **Quantum Gates & Circuit Operations**

• **Definition**: A quantum gate is a reversible unitary transformation applied to one or more qubits to perform quantum logic.
• **Intuition**: Gates rotate the state vector $|\psi\rangle$ on the Bloch sphere around the $X$, $Y$, or $Z$ axes.
• **Example**:
  - **$X$ Gate (NOT)**: Flips $|0\rangle \leftrightarrow |1\rangle$.
  - **$H$ Gate (Hadamard)**: Maps $|0\rangle \to |+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}$.
  - **$CNOT$ Gate**: Entangles 2 qubits.

• **Qiskit Code**:
\`\`\`python
from qiskit import QuantumCircuit
qc = QuantumCircuit(2)
qc.x(0)      # Apply X gate to q0
qc.h(1)      # Apply H gate to q1
qc.cx(0, 1)  # CNOT from q0 -> q1
print(qc)
\`\`\``;
}

function explainShorAlgorithm(_isBeginner: boolean, _isAdvanced: boolean): string {
  return `🔐 **Shor's Factoring Algorithm**

• **Definition**: Shor's Algorithm is a quantum algorithm that factors large integers $N$ in polynomial time $\\mathcal{O}((\\log N)^3)$.
• **Intuition**: Classical computers factor large numbers by trying options slowly (exponential time). Shor's algorithm converts integer factoring into a period-finding problem solved rapidly using quantum interference!
• **Example**: Factoring $N = 15$ into $3 \\times 5$ using Quantum Fourier Transform (QFT).
• **Cybersecurity Impact**: Threatens RSA-2048 encryption once fault-tolerant quantum hardware is realized.`;
}

function explainGroverAlgorithm(_isBeginner: boolean, _isAdvanced: boolean): string {
  return `🔍 **Grover's Quantum Search Algorithm**

• **Definition**: Grover's Algorithm searches an unsorted database of $N$ items with quadratic speedup in $\\mathcal{O}(\\sqrt{N})$ iterations vs classical $\\mathcal{O}(N)$.
• **Intuition**: Think of finding a single needle in a haystack. Grover's algorithm uses amplitude amplification to increase the probability wave of the target item while dampening wrong answers.
• **Example**: Searching 1,000,000 items takes ~1,000 quantum evaluations vs 500,000 classical checks!
• **Core Operators**:
  1. **Oracle ($U_w$)**: Flips phase of target state $|w\rangle$.
  2. **Diffuser ($D$)**: Reflects amplitudes about the mean amplitude.`;
}

function explainQFT(_isBeginner: boolean, _isAdvanced: boolean): string {
  return `🌊 **Quantum Fourier Transform (QFT)**

• **Definition**: QFT is the quantum analogue of the Discrete Fourier Transform (DFT), mapping quantum state $|x\rangle \to \frac{1}{\sqrt{N}}\sum_{y=0}^{N-1} e^{2\pi i x y / N} |y\rangle$.
• **Intuition**: QFT shifts information from the computational state basis into relative phase rotations, enabling order-finding and phase estimation algorithms.
• **Complexity**: Runs in $\\mathcal{O}((\\log N)^2)$ quantum steps vs classical FFT $\\mathcal{O}(N \\log N)$.`;
}

function explainVQE(_isBeginner: boolean, _isAdvanced: boolean): string {
  return `🧪 **Variational Quantum Eigensolver (VQE)**

• **Definition**: VQE is a hybrid quantum-classical algorithm designed for NISQ computers to estimate ground state energies of chemical molecules and Hamiltonians.
• **Intuition**: The QPU prepares a parameterized trial state $|\psi(\\theta)\rangle$ and measures energy $\langle H \rangle$, while a classical optimizer updates parameters $\\theta$ to minimize energy.
• **Equation**: Variational Principle: $E(\\theta) = \\langle \\psi(\\theta)| H |\\psi(\\theta)\\rangle \\ge E_0$.`;
}

function explainQAOA(_isBeginner: boolean, _isAdvanced: boolean): string {
  return `📊 **Quantum Approximate Optimization Algorithm (QAOA)**

• **Definition**: QAOA is a variational quantum algorithm designed to find approximate solutions to combinatorial optimization problems (e.g. Max-Cut, Traveling Salesperson).
• **Intuition**: Alternates between applying a cost Hamiltonian $H_C$ and a mixer Hamiltonian $H_B$ across $p$ layers to steer qubits toward optimal solutions.`;
}

function explainQEC(_isBeginner: boolean, _isAdvanced: boolean): string {
  return `🛡️ **Quantum Error Correction (QEC)**

• **Definition**: QEC protects quantum information from environmental decoherence and bit/phase flips by encoding logical qubits across multiple physical qubits.
• **Intuition**: Because of the No-Cloning Theorem, we cannot copy qubits. Instead, QEC uses syndrome measurements to detect errors without measuring (and destroying) the underlying quantum state!
• **Example**: Shor 9-qubit code and Surface Codes.`;
}

function explainQML(_isBeginner: boolean, _isAdvanced: boolean): string {
  return `🧠 **Quantum Machine Learning (QML)**

• **Definition**: QML integrates quantum algorithms with machine learning models, leveraging high-dimensional Hilbert spaces for kernel methods and Variational Quantum Classifiers (VQC).
• **Intuition**: Uses parameterized quantum circuits (PQCs) as trainable layers analogous to neural network weights.`;
}

// --------------------------------------------------------------------
// QISKIT GUIDE & DEBUGGING HANDLER
// --------------------------------------------------------------------
function generateQiskitResponse(query: string): string {
  if (query.includes('debug') || query.includes('error') || query.includes('fix') || query.includes('import') || query.includes('deprecated')) {
    return `💻 **Qiskit Code Debugging & Modern Syntax Guide**

Let's fix your Qiskit code! Here are common Qiskit errors and how to resolve them:

### 1. Deprecated \`execute()\` or \`IBMQ\` Import Error
- **Issue**: In Qiskit 1.0+, functions like \`from qiskit import execute\` or \`from qiskit.providers.ibmq\` were removed.
- **Fix**: Use \`QuantumCircuit\`, \`Statevector\`, or \`qiskit_aer.AerSimulator\`.

### 2. Corrected Qiskit 1.0+ Working Example
\`\`\`python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

# Create circuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# Inspect state before measurement or run circuit
print("Circuit Layout:")
print(qc)
\`\`\`

If you have a specific error message or code snippet, paste it here and I will diagnose it line by line!`;
  }

  return `💻 **Qiskit Syntax & Circuit Guide**

Here is how to write clean, modern **Qiskit** code (compatible with Qiskit 1.0+):

### 1. Create a Quantum Circuit
\`\`\`python
from qiskit import QuantumCircuit

# Initialize 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Apply Gates
qc.h(0)        # Hadamard gate on qubit 0 (superposition)
qc.x(1)        # Pauli-X gate on qubit 1 (flip 0 to 1)
qc.cx(0, 1)    # Controlled-NOT (CNOT) from q0 -> q1

# Measure qubits into classical bits
qc.measure([0, 1], [0, 1])

# Print ASCII diagram
print(qc)
\`\`\`

### 2. Check Quantum Statevector
\`\`\`python
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)

# Extract exact statevector
sv = Statevector.from_instruction(qc)
print("Statevector:", sv)
\`\`\`

Would you like me to generate code for a specific quantum algorithm or help debug your script?`;
}

// --------------------------------------------------------------------
// QUIZ GENERATOR
// --------------------------------------------------------------------
function generateQuizResponse(query: string, level: string): string {
  const isBeginner = level === 'school' || level === 'beginner';
  const isAdvanced = level === 'undergraduate' || level === 'postgraduate' || level === 'advanced';

  let topicName = "Quantum Computing Basics";
  if (query.includes('gate')) topicName = "Quantum Gates";
  else if (query.includes('superposition')) topicName = "Superposition";
  else if (query.includes('qubit')) topicName = "Qubits";
  else if (query.includes('entangl') || query.includes('bell')) topicName = "Quantum Entanglement";

  if (isBeginner) {
    return `🎯 **Practice Quiz: ${topicName} (Beginner Level)**

**Question 1**: What is the key difference between a classical bit and a quantum qubit?
- A) A qubit can only be stored on a giant magnet.
- B) A classical bit is only 0 or 1, while a qubit can be in a superposition of both until measured.
- C) A qubit never collapses.

**Question 2**: Which quantum gate acts like a classical NOT gate by flipping $|0\\rangle$ to $|1\\rangle$?
- A) Hadamard (H) gate
- B) Pauli-X gate
- C) Measurement gate

**Question 3**: What happens when you measure a qubit in a 50/50 superposition?
- A) It stays in superposition forever.
- B) It collapses to a single definite outcome ($0$ or $1$).
- C) It doubles into two qubits.

*Reply with your answers (e.g. 1-B, 2-B, 3-B) and I'll grade them for you! (Ask if you want the answers revealed.)*`;
  }

  if (isAdvanced) {
    return `🎯 **Practice Quiz: ${topicName} (Advanced Level)**

**Question 1**: What is the state produced by applying the Hadamard operator $H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$ to state $|1\\rangle$?
- A) $|+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$
- B) $|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$
- C) $|+i\\rangle = \\frac{|0\\rangle + i|1\\rangle}{\\sqrt{2}}$

**Question 2**: Which of the following state vectors represents a maximally entangled two-qubit Bell state?
- A) $|\\psi\\rangle = \\frac{1}{2}(|00\\rangle + |01\\rangle + |10\\rangle + |11\\rangle)$
- B) $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$
- C) $|\\psi\\rangle = |0\\rangle \\otimes |1\\rangle$

**Question 3**: In Grover's Algorithm, what is the geometric function of the Diffuser Operator $D$?
- A) Rotates the state vector by $\\pi/2$ around the Z-axis.
- B) Reflects state vector amplitudes about the mean amplitude $\\langle a \\rangle$.
- C) Measures qubits in the Fourier basis.

*Reply with your answers (e.g. 1-B, 2-B, 3-B) and I will evaluate your solutions!*`;
  }

  // Intermediate
  return `🎯 **Practice Quiz: ${topicName} (Intermediate Level)**

**Question 1**: What state is created when you apply a Hadamard ($H$) gate to computational basis state $|0\\rangle$?
- A) $|1\\rangle$
- B) $|+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$
- C) $|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$

**Question 2**: Which 2-qubit gate flips the target qubit if and only if the control qubit is in state $|1\\rangle$?
- A) SWAP gate
- B) CNOT (Controlled-NOT) gate
- C) Pauli-Z gate

**Question 3**: What is the probability of measuring state $0$ for qubit $|\psi\\rangle = \\frac{\\sqrt{3}}{2}|0\\rangle + \\frac{1}{2}|1\\rangle$?
- A) $25\\%$
- B) $50\\%$
- C) $75\\%$

*Reply with your answers (e.g. 1-B, 2-B, 3-C) and I will grade them for you! (Ask if you'd like step-by-step explanations.)*`;
}
