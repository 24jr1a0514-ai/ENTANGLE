import React, { useState } from 'react';
import type { CodeExecutionResult } from '../../services/qasmInterpreter';
import { Terminal, CheckCircle2, XCircle } from 'lucide-react';

interface TerminalOutputProps {
  result: CodeExecutionResult | null;
  testPassed?: boolean | null;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  result,
  testPassed,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'ascii' | 'state'>('console');

  if (!result) {
    return (
      <div className="p-6 bg-card rounded-xl border border-border flex flex-col items-center justify-center text-center min-h-[240px]">
        <Terminal className="w-8 h-8 text-muted-foreground mb-2" />
        <h4 className="text-sm font-semibold text-foreground">Console Ready</h4>
        <p className="text-xs text-muted-foreground max-w-xs mt-1">
          Click <strong>Run Execution</strong> to execute your code and view statevector results.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border overflow-hidden shadow-lg">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Quantum Execution Terminal
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              result.success
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {result.success ? 'Execution OK' : 'Syntax Error'}
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-secondary p-0.5 rounded-lg border border-border text-[11px] font-medium">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-2.5 py-0.5 rounded-md transition-colors ${
              activeTab === 'console'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Console Stdout
          </button>
          <button
            onClick={() => setActiveTab('ascii')}
            className={`px-2.5 py-0.5 rounded-md transition-colors ${
              activeTab === 'ascii'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Circuit Diagram
          </button>
        </div>
      </div>

      {/* Test Runner Status Banner */}
      {testPassed !== undefined && testPassed !== null && (
        <div
          className={`px-4 py-2.5 border-b text-xs font-semibold flex items-center justify-between ${
            testPassed
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {testPassed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>
              {testPassed
                ? `Test Cases Passed! Your quantum program output matches target state.`
                : `Test Cases Failed. Review output statevector and try again.`}
            </span>
          </div>

        </div>
      )}

      {/* Console Content */}
      <div className="p-4 bg-muted/20 font-mono text-xs text-foreground min-h-[220px] max-h-[360px] overflow-y-auto">
        {activeTab === 'console' && (
          <div className="space-y-1">
            {result.logs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.startsWith('[Error]')
                    ? 'text-rose-400 font-bold'
                    : log.startsWith('[Simulator]')
                    ? 'text-emerald-400 font-bold'
                    : log.startsWith('[Gate]') || log.startsWith('[Qiskit]')
                    ? 'text-blue-300'
                    : 'text-muted-foreground'
                }
              >
                {log}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ascii' && (
          <pre className="p-3 bg-muted/40 rounded-lg text-xs font-mono text-purple-300 overflow-x-auto border border-border/50 leading-loose">
            {result.asciiCircuit || 'No circuit diagram generated.'}
          </pre>
        )}
      </div>
    </div>
  );
};
