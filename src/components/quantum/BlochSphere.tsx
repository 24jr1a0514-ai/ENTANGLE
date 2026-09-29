import React from 'react';
import type { QubitBlochState } from '../../services/quantumSimulator';

interface BlochSphereProps {
  qubitIndex: number;
  bloch: QubitBlochState;
  size?: number;
}

export const BlochSphere: React.FC<BlochSphereProps> = ({
  qubitIndex,
  bloch,
  size = 220,
}) => {
  const center = size / 2;
  const radius = size * 0.38;

  // Project 3D (x, y, z) onto 2D canvas with isometric perspective
  // standard math coordinate: +z UP, +x forward-right, +y right
  const isoX = (x: number, y: number) => center + radius * (y * 0.9 - x * 0.45);
  const isoY = (x: number, y: number, z: number) => center - radius * (z * 0.85 - x * 0.35 + y * 0.15);

  const arrowX = isoX(bloch.x, bloch.y);
  const arrowY = isoY(bloch.x, bloch.y, bloch.z);

  // Axis end points
  const zTop = { x: isoX(0, 0), y: isoY(0, 0, 1) };
  const zBottom = { x: isoX(0, 0), y: isoY(0, 0, -1) };
  const xEnd = { x: isoX(1, 0), y: isoY(1, 0, 0) };
  const xStart = { x: isoX(-1, 0), y: isoY(-1, 0, 0) };
  const yEnd = { x: isoX(0, 1), y: isoY(0, 1, 0) };
  const yStart = { x: isoX(0, -1), y: isoY(0, -1, 0) };

  const formatDeg = (rad: number) => `${Math.round((rad * 180) / Math.PI)}°`;

  return (
    <div className="flex flex-col items-center p-4 bg-card/60 rounded-xl border border-border/80 shadow-lg backdrop-blur-sm">
      <div className="flex justify-between items-center w-full mb-2">
        <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          Qubit |q{qubitIndex}⟩
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-mono">
          P(|1⟩) = {(bloch.prob1 * 100).toFixed(1)}%
        </span>
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <radialGradient id={`sphere-grad-${qubitIndex}`} cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.6" />
            </radialGradient>
            <filter id={`glow-${qubitIndex}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sphere Outer Outline */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill={`url(#sphere-grad-${qubitIndex})`}
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="1.5"
          />

          {/* Equator (XY Plane) Ellipse */}
          <ellipse
            cx={center}
            cy={center}
            rx={radius * 0.95}
            ry={radius * 0.35}
            fill="none"
            stroke="rgba(148, 163, 184, 0.25)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Prime Meridian Ellipse */}
          <ellipse
            cx={center}
            cy={center}
            rx={radius * 0.35}
            ry={radius * 0.95}
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Z Axis (Vertical) */}
          <line
            x1={zBottom.x}
            y1={zBottom.y}
            x2={zTop.x}
            y2={zTop.y}
            stroke="#60a5fa"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          {/* X Axis */}
          <line
            x1={xStart.x}
            y1={xStart.y}
            x2={xEnd.x}
            y2={xEnd.y}
            stroke="#f43f5e"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          {/* Y Axis */}
          <line
            x1={yStart.x}
            y1={yStart.y}
            x2={yEnd.x}
            y2={yEnd.y}
            stroke="#10b981"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />

          {/* Pole Labels */}
          <text x={zTop.x} y={zTop.y - 8} fill="#93c5fd" fontSize="11" fontWeight="bold" textAnchor="middle">
            |0⟩ (+Z)
          </text>
          <text x={zBottom.x} y={zBottom.y + 14} fill="#93c5fd" fontSize="11" fontWeight="bold" textAnchor="middle">
            |1⟩ (-Z)
          </text>
          <text x={xEnd.x + 10} y={xEnd.y + 4} fill="#fda4af" fontSize="10" textAnchor="start">
            +X
          </text>
          <text x={yEnd.x + 10} y={yEnd.y + 4} fill="#6ee7b7" fontSize="10" textAnchor="start">
            +Y
          </text>

          {/* State Vector Arrow Line */}
          <line
            x1={center}
            y1={center}
            x2={arrowX}
            y2={arrowY}
            stroke="#ec4899"
            strokeWidth="3"
            strokeLinecap="round"
            filter={`url(#glow-${qubitIndex})`}
          />

          {/* Arrow Center Point */}
          <circle cx={center} cy={center} r="3" fill="#60a5fa" />

          {/* State Vector Tip */}
          <circle
            cx={arrowX}
            cy={arrowY}
            r="6"
            fill="#f43f5e"
            stroke="#ffffff"
            strokeWidth="1.5"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* State Angles & Coordinates Readout */}
      <div className="w-full mt-2 grid grid-cols-2 gap-2 text-xs font-mono bg-muted/40 p-2 rounded-lg border border-border/50">
        <div>
          <span className="text-muted-foreground">θ:</span> <span className="text-foreground">{formatDeg(bloch.theta)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">ϕ:</span> <span className="text-foreground">{formatDeg(bloch.phi)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">x:</span> <span className="text-rose-400">{bloch.x.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">y:</span> <span className="text-emerald-400">{bloch.y.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
