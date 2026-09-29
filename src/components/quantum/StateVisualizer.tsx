import React, { useState } from 'react';
import type { CircuitState } from '../../services/quantumSimulator';
import {
  formatComplex,
  runShots,
} from '../../services/quantumSimulator';
import { BarChart2, Play, RefreshCw } from 'lucide-react';

interface StateVisualizerProps {
  state: CircuitState;
}

export const StateVisualizer: React.FC<StateVisualizerProps> = ({ state }) => {
  const [numShots, setNumShots] = useState<number>(1000);
  const [shotResults, setShotResults] = useState<Record<string, number> | null>(null);

  const handleRunShots = () => {
    const results = runShots(state.numQubits, state.probabilities, numShots);
    setShotResults(results);
  };

  const dim = 1 << state.numQubits;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* State Vector Amplitudes Table */}
      <div className="p-5 bg-card rounded-xl border border-border flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-1">
            Quantum State Vector
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Amplitudes αᵢ + iβᵢ across the 2ⁿ = {dim} basis states.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground bg-muted/30">
                  <th className="py-2 px-3">Basis |ψ⟩</th>
                  <th className="py-2 px-3">Amplitude (α + iβ)</th>
                  <th className="py-2 px-3">Probability |α|²</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: dim }).map((_, i) => {
                  const stateKey = i.toString(2).padStart(state.numQubits, '0');
                  const amp = state.stateVector[i];
                  const prob = state.probabilities[i];
                  const isNonZero = prob > 1e-4;

                  return (
                    <tr
                      key={stateKey}
                      className={`border-b border-border/40 transition-colors ${
                        isNonZero ? 'bg-primary/5 font-semibold text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <td className="py-2 px-3 text-primary font-bold">|{stateKey}⟩</td>
                      <td className="py-2 px-3">{formatComplex(amp)}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span>{(prob * 100).toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${prob * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Measurement Probability Histogram & Shot Simulator */}
      <div className="p-5 bg-card rounded-xl border border-border flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              Measurement Probabilities
            </h3>

            <div className="flex items-center gap-2">
              <select
                value={numShots}
                onChange={(e) => setNumShots(parseInt(e.target.value))}
                className="text-xs bg-secondary border border-border rounded-md px-2 py-1 text-foreground"
              >
                <option value={100}>100 Shots</option>
                <option value={1000}>1000 Shots</option>
                <option value={8192}>8192 Shots</option>
              </select>
              <button
                onClick={handleRunShots}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Play className="w-3 h-3" />
                Run Shots
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Exact theoretical state probability distribution & empirical shot sampling.
          </p>

          {/* Histogram Chart */}
          <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-border">
            {Array.from({ length: dim }).map((_, i) => {
              const stateKey = i.toString(2).padStart(state.numQubits, '0');
              const prob = state.probabilities[i];
              const shotCount = shotResults ? shotResults[stateKey] || 0 : null;

              return (
                <div key={stateKey} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono text-muted-foreground mb-1">
                    {(prob * 100).toFixed(0)}%{shotCount !== null ? ` (${shotCount})` : ''}
                  </span>
                  <div className="w-full flex items-end justify-center h-full bg-muted/20 rounded-t-md overflow-hidden relative">
                    {/* Theoretical probability bar */}
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md transition-all duration-300 group-hover:from-blue-500 group-hover:to-pink-500"
                      style={{ height: `${Math.max(4, prob * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-foreground mt-1.5">
                    |{stateKey}⟩
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shot Sampling Results Readout */}
        {shotResults && (
          <div className="mt-3 p-3 bg-muted/30 border border-border/60 rounded-lg text-xs">
            <div className="flex items-center justify-between font-semibold mb-1.5">
              <span className="text-foreground">Shot Counts ({numShots} runs):</span>
              <button
                onClick={() => setShotResults(null)}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-3 font-mono">
              {Object.entries(shotResults).map(([st, count]) => (
                <span key={st} className="bg-card px-2 py-1 rounded border border-border">
                  |{st}⟩: <strong className="text-primary">{count}</strong> (
                  {((count / numShots) * 100).toFixed(1)}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
