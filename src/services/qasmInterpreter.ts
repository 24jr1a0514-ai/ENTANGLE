import type { PlacedGate, GateType, CircuitState } from './quantumSimulator';
import {
  simulateCircuit,
  runShots,
  formatComplex,
} from './quantumSimulator';

export interface CodeExecutionResult {
  success: boolean;
  logs: string[];
  numQubits: number;
  gates: PlacedGate[];
  circuitState?: CircuitState;
  asciiCircuit?: string;
  error?: string;
}

export function parseAndExecuteQuantumCode(
  code: string,
  language: 'qiskit' | 'qasm'
): CodeExecutionResult {
  const logs: string[] = [];
  const gates: PlacedGate[] = [];
  let numQubits = 2;

  try {
    const lines = code
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

    let currentStep = 0;

    if (language === 'qasm') {
      for (const line of lines) {
        if (line.startsWith('OPENQASM') || line.startsWith('include')) continue;

        const qregMatch = line.match(/qreg\s+q\[(\d+)\];/);
        if (qregMatch) {
          numQubits = Math.min(4, Math.max(1, parseInt(qregMatch[1])));
          logs.push(`[QASM] Initialized qreg q[${numQubits}]`);
          continue;
        }

        // Single qubit gate: h q[0]; x q[1]; etc.
        const singleMatch = line.match(/^(h|x|y|z|s|t|measure)\s+q\[(\d+)\]/i);
        if (singleMatch) {
          const type = singleMatch[1].toUpperCase() as GateType;
          const qubit = parseInt(singleMatch[2]);
          if (qubit < numQubits) {
            gates.push({
              id: Math.random().toString(36).substring(2, 9),
              type: type === ('MEASURE' as any) ? 'M' : type,
              qubit,
              step: currentStep++,
            });
            logs.push(`[Gate] Applied ${type} on qubit |q${qubit}⟩`);
          }
          continue;
        }

        // Controlled gate: cx q[0], q[1];
        const ctrlMatch = line.match(/^(cx|cz|swap)\s+q\[(\d+)\]\s*,\s*q\[(\d+)\]/i);
        if (ctrlMatch) {
          const type = ctrlMatch[1].toUpperCase() as GateType;
          const q1 = parseInt(ctrlMatch[2]);
          const q2 = parseInt(ctrlMatch[3]);
          if (q1 < numQubits && q2 < numQubits) {
            gates.push({
              id: Math.random().toString(36).substring(2, 9),
              type,
              qubit: q2,
              controlQubit: q1,
              step: currentStep++,
            });
            logs.push(`[Gate] Applied ${type} (control |q${q1}⟩ -> target |q${q2}⟩)`);
          }
          continue;
        }
      }
    } else {
      // Qiskit Python execution parser
      for (const line of lines) {
        // QuantumCircuit(numQubits)
        const initMatch = line.match(/QuantumCircuit\s*\(\s*(\d+)/i);
        if (initMatch) {
          numQubits = Math.min(4, Math.max(1, parseInt(initMatch[1])));
          logs.push(`[Qiskit] Created QuantumCircuit with ${numQubits} qubits`);
          continue;
        }

        // Single qubit gate: qc.h(0), qc.x(1), qc.measure(0, 0)
        const singleMatch = line.match(/\.([hxyzst]|measure)\s*\(\s*(\d+)/i);
        if (singleMatch) {
          const gateName = singleMatch[1].toLowerCase();
          const qubit = parseInt(singleMatch[2]);
          const type: GateType = gateName === 'measure' ? 'M' : (gateName.toUpperCase() as GateType);

          if (qubit < numQubits) {
            gates.push({
              id: Math.random().toString(36).substring(2, 9),
              type,
              qubit,
              step: currentStep++,
            });
            logs.push(`[Qiskit] qc.${gateName}(${qubit})`);
          }
          continue;
        }

        // Controlled gate: qc.cx(0, 1), qc.cz(0, 1), qc.swap(0, 1)
        const ctrlMatch = line.match(/\.(cx|cz|swap)\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        if (ctrlMatch) {
          const gateName = ctrlMatch[1].toLowerCase();
          const type: GateType = gateName.toUpperCase() as GateType;
          const ctrl = parseInt(ctrlMatch[2]);
          const tgt = parseInt(ctrlMatch[3]);

          if (ctrl < numQubits && tgt < numQubits) {
            gates.push({
              id: Math.random().toString(36).substring(2, 9),
              type,
              qubit: tgt,
              controlQubit: ctrl,
              step: currentStep++,
            });
            logs.push(`[Qiskit] qc.${gateName}(control=${ctrl}, target=${tgt})`);
          }
          continue;
        }
      }
    }

    // Run statevector simulation
    const state = simulateCircuit(numQubits, gates);
    logs.push(`[Simulator] Statevector simulation completed successfully.`);

    // Generate ASCII Circuit Representation
    const asciiLines: string[] = [];
    for (let q = 0; q < numQubits; q++) {
      let wireStr = `q_${q}: |0⟩ ─`;
      const qGates = gates.filter((g) => g.qubit === q || g.controlQubit === q);
      if (qGates.length === 0) {
        wireStr += '─────────────────';
      } else {
        for (const g of qGates) {
          if (g.controlQubit === q) {
            wireStr += '──■──';
          } else {
            wireStr += `──[${g.type}]──`;
          }
        }
      }
      asciiLines.push(wireStr);
    }

    // Print statevector amplitudes summary to logs
    logs.push('\nStatevector Amplitudes:');
    const dim = 1 << numQubits;
    for (let i = 0; i < dim; i++) {
      const stateKey = i.toString(2).padStart(numQubits, '0');
      const amp = state.stateVector[i];
      const prob = (state.probabilities[i] * 100).toFixed(1);
      if (state.probabilities[i] > 1e-4) {
        logs.push(`  |${stateKey}⟩: ${formatComplex(amp)}  (Prob: ${prob}%)`);
      }
    }

    // Run 1000 empirical shots
    const shots = runShots(numQubits, state.probabilities, 1000);
    logs.push('\nMeasurement Shots (1000 runs):');
    Object.entries(shots).forEach(([st, cnt]) => {
      logs.push(`  |${st}⟩: ${cnt} counts (${((cnt / 1000) * 100).toFixed(1)}%)`);
    });

    return {
      success: true,
      logs,
      numQubits,
      gates,
      circuitState: state,
      asciiCircuit: asciiLines.join('\n'),
    };
  } catch (err: any) {
    return {
      success: false,
      logs: [`[Error] Syntax or execution exception: ${err?.message || err}`],
      numQubits: 2,
      gates: [],
      error: err?.message || 'Execution error',
    };
  }
}
