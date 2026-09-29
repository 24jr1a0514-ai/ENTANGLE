import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Activity, Box, Sparkles, Zap, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import type { LearningPath } from '../../types';

interface DemoProps {
  data: any;
  learningPath: LearningPath;
}

export const QuantumInteractiveDemo: React.FC<DemoProps> = ({ data, learningPath }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlayTimer, setAutoPlayTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const steps = data.steps || [];
  const totalSteps = steps.length;

  // Cleanup timer on unmount or when not playing
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, data.stepDuration || 2500);
      setAutoPlayTimer(timer);
      return () => clearTimeout(timer);
    } else if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, totalSteps, data.stepDuration]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (autoPlayTimer) clearTimeout(autoPlayTimer);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(c => c + 1);
    setIsPlaying(false);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
    setIsPlaying(false);
  };

  if (!data || !data.type) return null;

  const currentStepData = steps[currentStep] || {};

  return (
    <div className="w-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Demo Viewport */}
      <div className="relative w-full aspect-video bg-black/60 border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Title Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-center">
          <h3 className="font-bold text-lg quantum-text-gradient">{data.title || "Interactive Demo"}</h3>
          <div className="text-xs font-mono bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
            Step {currentStep + 1} of {Math.max(1, totalSteps)}
          </div>
        </div>

        {/* Animation Canvas */}
        <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden z-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center"
            >
              <DemoRenderer type={data.type} stepData={currentStepData} learningPath={learningPath} globalData={data} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Explanation Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
          <motion.p 
            key={`desc-${currentStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-foreground/90 font-medium md:text-lg max-w-2xl mx-auto"
          >
            {currentStepData.description || "Interactive visualization"}
          </motion.p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-xl border border-border">
        <div className="flex items-center space-x-2">
          <button 
            onClick={reset}
            className="p-3 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className="p-3 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center min-w-[3rem]"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="p-3 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium text-sm">Prev</span>
          </button>
          
          {/* Progress dots */}
          <div className="hidden md:flex space-x-1 px-4">
            {steps.map((_: any, i: number) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentStep ? 'bg-primary scale-125' : i < currentStep ? 'bg-primary/50' : 'bg-border'}`}
              />
            ))}
          </div>

          <button 
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
            className="p-3 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <span className="hidden sm:inline font-medium text-sm">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Renderers for different Demo Types ---

const DemoRenderer = ({ type, stepData, learningPath, globalData }: any) => {
  const isSimple = learningPath === 'school' || learningPath === 'intermediate';

  switch (type) {
    case 'superposition':
      return (
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ 
              rotateX: stepData.state === 'superposition' ? [0, 360] : 0,
              rotateY: stepData.state === 'superposition' ? [0, 360] : 0,
              scale: stepData.state === 'superposition' ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className={`w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center border-4 shadow-[0_0_50px_rgba(var(--primary),0.3)]
              ${stepData.state === '0' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 
                stepData.state === '1' ? 'bg-red-500/20 border-red-500 text-red-500' : 
                'bg-gradient-to-tr from-blue-500/40 to-red-500/40 border-purple-400 text-white backdrop-blur-md'}`}
          >
            <span className="text-4xl md:text-6xl font-bold font-mono">
              {stepData.state === 'superposition' ? '0/1' : stepData.state}
            </span>
          </motion.div>
          {!isSimple && stepData.math && (
            <div className="mt-8 font-mono text-xl text-primary bg-background/50 px-4 py-2 rounded-lg border border-border">
              {stepData.math}
            </div>
          )}
        </div>
      );

    case 'entanglement':
      return (
        <div className="flex items-center justify-center w-full max-w-2xl gap-8 md:gap-24">
          <Qubit visualState={stepData.q1} color="blue" />
          
          {/* Entanglement Link */}
          {stepData.entangled && (
            <motion.div 
              className="absolute w-full h-[2px] z-0 flex items-center justify-center max-w-[200px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <Sparkles className="absolute text-purple-400 w-8 h-8 animate-spin-slow" />
            </motion.div>
          )}

          <Qubit visualState={stepData.q2} color="red" />
        </div>
      );
      
    case 'circuit':
      return (
        <div className="flex flex-col space-y-12 overflow-x-auto w-full p-4 items-center">
          <div className="flex space-x-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-border -z-10 -translate-y-1/2" />
            
            <div className="font-bold text-xl h-16 flex items-center bg-background px-2">|ψ⟩</div>
            
            {globalData.gates?.map((gate: string, i: number) => (
              <motion.div 
                key={i}
                animate={stepData.activeGateIndex === i ? { scale: 1.2, boxShadow: '0 0 20px rgba(var(--primary), 0.5)' } : { scale: 1, boxShadow: 'none' }}
                className={`w-16 h-16 rounded border-2 flex items-center justify-center font-bold text-2xl font-mono bg-background
                  ${stepData.activeGateIndex === i ? 'border-primary text-primary' : 
                    stepData.activeGateIndex > i ? 'border-primary/40 text-primary/40' : 'border-border text-foreground'}`}
              >
                {gate}
              </motion.div>
            ))}
            
            <div className="font-bold text-xl h-16 flex items-center bg-background px-2">
               {stepData.finalState || '?'}
            </div>
          </div>
        </div>
      );

    case 'algorithm':
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="relative w-full max-w-3xl h-64 flex items-center justify-between">
            {globalData.stages?.map((stage: string, i: number) => (
              <div key={i} className="flex flex-col items-center relative z-10 w-32">
                <motion.div 
                  animate={{
                    backgroundColor: stepData.stageIndex === i ? 'hsl(var(--primary))' : stepData.stageIndex > i ? 'hsl(var(--primary)/0.2)' : 'hsl(var(--muted))',
                    borderColor: stepData.stageIndex === i ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                    scale: stepData.stageIndex === i ? 1.1 : 1
                  }}
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 transition-colors"
                >
                  {i === 0 ? <Box /> : i === globalData.stages.length - 1 ? <Activity /> : <Cpu />}
                </motion.div>
                <span className={`text-center font-semibold text-sm ${stepData.stageIndex === i ? 'text-primary' : 'text-muted-foreground'}`}>
                  {stage}
                </span>
              </div>
            ))}

            {/* Connecting line */}
            <div className="absolute top-8 left-16 right-16 h-[2px] bg-border -z-0">
               <motion.div 
                 className="h-full bg-primary"
                 initial={{ width: 0 }}
                 animate={{ width: `${(stepData.stageIndex / (globalData.stages.length - 1)) * 100}%` }}
                 transition={{ duration: 0.5 }}
               />
            </div>
          </div>
          
          {!isSimple && stepData.math && (
            <div className="mt-8 font-mono bg-black/50 border border-primary/30 text-primary px-6 py-3 rounded-xl">
              {stepData.math}
            </div>
          )}
        </div>
      );

    case 'error-correction':
      return (
        <div className="flex items-center justify-center space-x-12">
          <div className="flex flex-col items-center">
             <div className="text-xs mb-2 text-muted-foreground">Logical Qubit</div>
             <Qubit visualState="pure" color="blue" />
          </div>
          <ArrowRight className="w-8 h-8 text-muted-foreground" />
          
          <div className="relative">
             <motion.div
               animate={stepData.hasError ? { rotate: [0, -10, 10, -10, 0] } : {}}
               transition={{ duration: 0.5 }}
             >
                <div className="grid grid-cols-2 gap-4">
                  <Qubit visualState={stepData.hasError ? "error" : "pure"} color="blue" size="small" />
                  <Qubit visualState="pure" color="blue" size="small" />
                  <Qubit visualState="pure" color="blue" size="small" />
                </div>
             </motion.div>
             
             {stepData.hasError && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                 className="absolute -top-4 -right-4 text-red-500"
               >
                 <ShieldAlert className="w-8 h-8" />
               </motion.div>
             )}
          </div>
          
          <ArrowRight className="w-8 h-8 text-muted-foreground" />
          
          <div className="flex flex-col items-center">
             <div className="text-xs mb-2 text-muted-foreground">Recovered State</div>
             <Qubit visualState={stepData.recovered ? "pure" : "unknown"} color="blue" />
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center">
           <Zap className="w-24 h-24 text-primary opacity-50 mb-6 animate-pulse" />
           <p className="text-xl font-bold text-muted-foreground">Visualization Type: {type}</p>
        </div>
      );
  }
};

const Qubit = ({ visualState, color, size = "large" }: any) => {
  const s = size === "small" ? "w-16 h-16 text-xl" : "w-32 h-32 md:w-40 md:h-40 text-4xl md:text-5xl";
  const col = color === "blue" ? "text-blue-400 border-blue-400/50 bg-blue-400/10 shadow-blue-400/20" : "text-red-400 border-red-400/50 bg-red-400/10 shadow-red-400/20";
  
  return (
    <motion.div 
      className={`rounded-full border-4 flex items-center justify-center font-bold font-mono shadow-xl relative z-10 bg-background ${s} ${col}`}
      animate={{ 
        rotate: visualState === 'superposition' || visualState === 'unknown' ? 360 : 0,
        opacity: visualState === 'error' ? [1, 0.5, 1] : 1
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    >
      {visualState === 'superposition' || visualState === 'unknown' ? '?' : visualState === 'error' ? 'ERR' : visualState}
    </motion.div>
  );
};
