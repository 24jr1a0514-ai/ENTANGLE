import React from 'react';
import { Play, RotateCcw, FileCode, Code2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onCodeChange?: (code: string) => void;
  onChange?: (code: string) => void; // For backwards compatibility
  language: string;
  onLanguageChange?: (lang: 'qiskit' | 'qasm' | string) => void;
  onRunCode: () => void;
  onResetCode?: () => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  onChange,
  language,
  onLanguageChange,
  onRunCode,
  onResetCode,
  readOnly = false,
}) => {
  const lineCount = code.split('\n').length;
  
  const handleChange = (val: string) => {
    if (onCodeChange) onCodeChange(val);
    if (onChange) onChange(val);
  };

  const isQuantum = language === 'qiskit' || language === 'qasm';

  let placeholder = '';
  if (language === 'qiskit') placeholder = '# Write Qiskit code here...\nfrom qiskit import QuantumCircuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)';
  else if (language === 'qasm') placeholder = '// Write OpenQASM 2.0 code here...\nOPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nh q[0];\ncx q[0], q[1];';
  else if (language === 'python') placeholder = '# Write your Python code here...\nprint("Hello World!")';
  else placeholder = '// Write your code here...';

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border overflow-hidden shadow-lg h-full min-h-[400px]">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {isQuantum ? 'Quantum Code Editor' : 'Code Editor'}
            </span>
          </div>

          {/* Language Switcher (Only for Quantum / When explicitly provided) */}
          {onLanguageChange && isQuantum && (
            <div className="flex bg-secondary p-0.5 rounded-lg border border-border text-xs font-medium">
              <button
                onClick={() => onLanguageChange('qiskit')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  language === 'qiskit'
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Python (Qiskit)
              </button>
              <button
                onClick={() => onLanguageChange('qasm')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  language === 'qasm'
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                OpenQASM 2.0
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onResetCode && (
            <button
              type="button"
              onClick={onResetCode}
              disabled={readOnly}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary border border-border/60 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Code
            </button>
          )}

          <button
            type="button"
            onClick={onRunCode}
            disabled={readOnly}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-150 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Execution
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex flex-1 font-mono text-xs bg-card text-foreground overflow-hidden">
        {/* Line Numbers */}
        <div className="py-3 px-3 bg-muted/20 border-r border-border text-muted-foreground/50 select-none text-right font-mono min-w-[40px] overflow-hidden">
          {Array.from({ length: Math.max(12, lineCount) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
          readOnly={readOnly}
          className="flex-1 p-3 bg-transparent text-foreground font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-primary/30 h-full"
          placeholder={placeholder}
        />
      </div>

      {/* Footer shortcut bar */}
      <div className="px-4 py-2 bg-muted/20 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileCode className="w-3 h-3 text-primary" />
          {isQuantum ? 'Supports `.h()`, `.x()`, `.z()`, `.s()`, `.t()`, `.cx()`, `.cz()`, `.swap()`, `.measure()`' : 'Editor'}
        </span>
        <span>Lines: {lineCount}</span>
      </div>
    </div>
  );
};
