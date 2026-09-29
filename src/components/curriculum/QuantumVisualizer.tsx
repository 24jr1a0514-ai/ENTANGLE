import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap } from 'lucide-react';
import type { LearningPath } from '../../types';

interface VisualizerProps {
  data: any;
  learningPath: LearningPath;
}

export const QuantumVisualizer: React.FC<VisualizerProps> = ({ data, learningPath }) => {
  if (!data || !data.type) return null;

  return (
    <div className="my-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full overflow-x-auto">
      <div className="bg-secondary/10 border border-border/50 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-3 opacity-50">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Interactive Visual</span>
        </div>
        
        {data.title && (
          <h3 className="text-xl font-bold mb-6 text-foreground quantum-text-gradient">{data.title}</h3>
        )}

        <div className="flex items-center justify-center min-h-[200px]">
          {data.type === 'bloch-sphere' && <BlochSphereVisualizer {...data} depth={learningPath} />}
          {data.type === 'circuit' && <CircuitVisualizer {...data} depth={learningPath} />}
          {data.type === 'flowchart' && <FlowchartVisualizer {...data} depth={learningPath} />}
          {data.type === 'analogy' && <AnalogyVisualizer {...data} depth={learningPath} />}
          {data.type === 'math' && <MathVisualizer {...data} depth={learningPath} />}
        </div>
        
        {data.caption && (
          <p className="mt-6 text-sm text-center text-muted-foreground italic border-t border-border/50 pt-4">
            {data.caption}
          </p>
        )}
      </div>
    </div>
  );
};

// --- Sub-visualizers ---

const BlochSphereVisualizer = ({ state, depth }: any) => {
  // Simplified Bloch sphere 2D representation
  const isSimple = depth === 'school' || depth === 'intermediate';
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 rounded-full border-2 border-primary/40 flex items-center justify-center bg-background/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
        {/* Axes */}
        <div className="absolute w-full h-[1px] bg-border/50" />
        <div className="absolute h-full w-[1px] bg-border/50" />
        
        {/* Equator (perspective) */}
        {!isSimple && (
          <div className="absolute w-full h-12 rounded-[100%] border border-border/40" />
        )}
        
        {/* Poles */}
        <div className="absolute -top-6 font-bold text-foreground">|0⟩</div>
        <div className="absolute -bottom-6 font-bold text-foreground">|1⟩</div>
        
        {!isSimple && (
          <>
            <div className="absolute -right-6 font-semibold text-muted-foreground">|+⟩</div>
            <div className="absolute -left-6 font-semibold text-muted-foreground">|-⟩</div>
          </>
        )}

        {/* State Vector */}
        <motion.div 
          className="absolute w-1/2 h-[2px] bg-primary origin-left"
          initial={{ rotate: 0 }}
          animate={{ rotate: state === 'superposition' ? -45 : state === '|1>' ? 90 : -90 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
        </motion.div>
      </div>
      
      {isSimple && (
        <div className="mt-8 text-center text-muted-foreground">
          Think of this like a globe. The arrow can point anywhere on the surface, not just North or South!
        </div>
      )}
    </div>
  );
};

const CircuitVisualizer = ({ gates }: any) => {
  return (
    <div className="flex items-center space-x-2 font-mono text-sm md:text-base overflow-x-auto pb-4">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center h-12">
          <span className="mr-4 font-bold">q[0] |0⟩</span>
          <div className="w-12 h-[2px] bg-border relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border" />
          </div>
        </div>
        {(gates.includes('CNOT') || gates.includes('CX')) && (
           <div className="flex items-center h-12">
             <span className="mr-4 font-bold">q[1] |0⟩</span>
             <div className="w-12 h-[2px] bg-border" />
           </div>
        )}
      </div>

      {gates.map((gate: string, i: number) => (
        <div key={i} className="flex flex-col space-y-8 relative">
          {gate === 'H' || gate === 'X' || gate === 'Y' || gate === 'Z' ? (
            <div className="flex items-center h-12">
              <div className="w-4 h-[2px] bg-border" />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="w-12 h-12 bg-primary/20 border-2 border-primary rounded flex items-center justify-center font-bold text-primary shadow-sm"
              >
                {gate}
              </motion.div>
              <div className="w-4 h-[2px] bg-border" />
            </div>
          ) : gate === 'CNOT' || gate === 'CX' ? (
            <div className="relative h-32 w-16">
              {/* Control Wire */}
              <div className="absolute top-6 w-full h-[2px] bg-border" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full z-10" />
              
              {/* Vertical Connection */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 h-20 w-[2px] bg-primary" />
              
              {/* Target Wire */}
              <div className="absolute bottom-6 w-full h-[2px] bg-border" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center bg-background z-10">
                <div className="w-4 h-[2px] bg-primary" />
                <div className="absolute h-4 w-[2px] bg-primary" />
              </div>
            </div>
          ) : (
            <div className="flex items-center h-12">
              <div className="w-4 h-[2px] bg-border" />
              <div className="w-16 h-12 bg-secondary border border-border rounded flex items-center justify-center text-xs">
                {gate}
              </div>
              <div className="w-4 h-[2px] bg-border" />
            </div>
          )}
        </div>
      ))}
      
      <div className="flex flex-col space-y-8">
        <div className="flex items-center h-12">
          <div className="w-12 h-[2px] bg-border" />
          <div className="h-8 w-4 bg-muted border border-border flex items-center justify-center"><Activity className="w-3 h-3 text-muted-foreground" /></div>
        </div>
        {(gates.includes('CNOT') || gates.includes('CX')) && (
           <div className="flex items-center h-12">
             <div className="w-12 h-[2px] bg-border" />
             <div className="h-8 w-4 bg-muted border border-border flex items-center justify-center"><Activity className="w-3 h-3 text-muted-foreground" /></div>
           </div>
        )}
      </div>
    </div>
  );
};

const FlowchartVisualizer = ({ steps }: any) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2 md:gap-4 flex-wrap">
      {steps.map((step: string, i: number) => (
        <React.Fragment key={i}>
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className="bg-card border border-border shadow-sm p-4 rounded-xl min-w-[120px] text-center"
          >
            <span className="font-semibold text-foreground text-sm md:text-base">{step}</span>
          </motion.div>
          {i < steps.length - 1 && (
            <div className="hidden md:block text-muted-foreground">
              <ArrowRight className="w-6 h-6" />
            </div>
          )}
          {i < steps.length - 1 && (
            <div className="block md:hidden text-muted-foreground my-1">
              <ArrowRight className="w-5 h-5 rotate-90" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const AnalogyVisualizer = ({ concept }: any) => {
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        animate={{ rotateY: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-purple-500 shadow-xl flex items-center justify-center mb-6"
      >
        <Zap className="w-10 h-10 text-white" />
      </motion.div>
      <div className="text-center max-w-sm">
        <h4 className="font-bold text-lg mb-2">Real World Analogy</h4>
        <p className="text-muted-foreground">{concept}</p>
      </div>
    </div>
  );
};

const MathVisualizer = ({ expression, details, depth }: any) => {
  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <div className="w-full bg-black/40 border border-border/50 rounded-xl p-6 font-mono text-center overflow-x-auto shadow-inner text-lg md:text-2xl text-primary/90">
        {expression}
      </div>
      {details && depth !== 'school' && (
        <div className="mt-4 text-sm text-muted-foreground bg-secondary/20 p-4 rounded-lg border border-border/30 w-full text-left">
          <ul className="list-disc pl-5 space-y-1">
            {details.map((d: string, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
