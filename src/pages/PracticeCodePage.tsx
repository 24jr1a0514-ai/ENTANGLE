import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CodeEditor } from '../components/coding/CodeEditor';
import { courses } from '../data/courses';

import {
  Code2,
  Terminal,
  Play,
  Eraser,
  Save,
  CheckCircle2,
  XCircle,
  Keyboard
} from 'lucide-react';

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

export default function PracticeCodePage() {
  const { courseId } = useParams();
  
  // Find the active course to determine the language and title
  const activeCourse = courses.find(c => c.id === courseId);
  const courseTitle = activeCourse ? activeCourse.title : (courseId?.toUpperCase() || 'Coding');
  const language = courseId || 'javascript'; // Default fallback

  const getStarterCode = () => {
    return 'print("Hello, Quantum World!")';
  };

  const [code, setCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [editorKey, setEditorKey] = useState<number>(0);

  // Set initial starter code when language changes
  useEffect(() => {
    setCode(getStarterCode());
    setExecutionResult(null);
    setCustomInput('');
  }, [language]);

  // Mock Execution
  const handleRunExecution = () => {
    setIsExecuting(true);
    setExecutionResult(null);

    // Simulate network delay and execution
    setTimeout(() => {
      let mockOutput = "";
      let success = true;
      let mockError = "";

      // Very simple mock execution logic for demo purposes
      if (code.trim() === '') {
        success = false;
        mockError = "Compile Error: No code to execute.";
      } else if (code.includes('print')) {
        mockOutput = code.split('print(')[1]?.split(')')[0]?.replace(/["']/g, "") || "Output";
      } else {
        mockOutput = "Executed successfully (Mock).";
      }

      if (customInput) {
        mockOutput += `\n[Received Input: ${customInput}]`;
      }

      setExecutionResult({
        success,
        output: mockOutput,
        error: mockError
      });

      setIsExecuting(false);
    }, 800);
  };

  const handleResetCode = () => {
    setCode(getStarterCode());
    setExecutionResult(null);
    setEditorKey(prev => prev + 1);
  };

  const handleClearCode = () => {
    setCode('');
    setEditorKey(prev => prev + 1);
  };

  const handleSaveCode = () => {
    // Mock save
    alert('Code saved successfully!');
  };

  return (
    <div className="space-y-6 pb-12 h-full flex flex-col">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-card rounded-2xl border border-primary/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Code2 className="w-7 h-7 text-primary animate-pulse" />
            {/* The language label is non-editable and clearly displayed */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {courseTitle} Coding Practice
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            A freeform playground to write, run, and test your {courseTitle} code directly in the browser.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearCode}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary border border-border/60 transition-colors"
          >
            <Eraser className="w-4 h-4" /> Clear
          </button>
          <button
            onClick={handleSaveCode}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary border border-border/60 transition-colors"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px]">
          <CodeEditor 
            key={editorKey}
            code={code} 
            onChange={setCode} 
            language={language} 
            readOnly={isExecuting}
            onRunCode={handleRunExecution}
            onResetCode={handleResetCode}
          />
        </div>

        {/* Right Column: Input & Output */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Custom Input */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-1/3">
            <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/30">
               <div className="flex items-center gap-2">
                 <Keyboard className="w-4 h-4 text-muted-foreground" />
                 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Custom Input</span>
               </div>
            </div>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 p-3 bg-transparent text-foreground font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-0"
              placeholder="Enter custom standard input (stdin) here..."
            />
          </div>

          {/* Output Console */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col flex-1">
            <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/30">
               <div className="flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-muted-foreground" />
                 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output Console</span>
               </div>
               {executionResult && (
                 <div className="flex items-center gap-1">
                    {executionResult.success ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Success
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Error
                      </span>
                    )}
                 </div>
               )}
            </div>
            
            <div className="flex-1 p-4 bg-black/95 font-mono text-xs overflow-y-auto">
              {isExecuting ? (
                 <div className="text-primary animate-pulse flex items-center gap-2">
                   <Play className="w-3 h-3" /> Executing code...
                 </div>
              ) : executionResult ? (
                 <div className="space-y-2">
                    {executionResult.success ? (
                      <div className="text-green-400 whitespace-pre-wrap">{executionResult.output}</div>
                    ) : (
                      <div className="text-red-400 whitespace-pre-wrap">{executionResult.error || "An unknown error occurred."}</div>
                    )}
                 </div>
              ) : (
                 <div className="text-gray-500 italic h-full flex items-center justify-center">
                    Click 'Run Execution' to compile and run your code.
                 </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
