'use client';

import React from 'react';
import { CheckCircle, Play } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

// Define TypeScript interface for ModuleCard props
interface ModuleCardProps {
  icon: React.ReactNode; // Support both emojis and Lucide icons
  title: string;
  description: string;
  module: string;
  onStart: (module: string) => void;
  isCompleted: boolean;
}

// Enhanced ModuleCard with realistic 3D tilt, advanced lighting, and micro-interactions
const ModuleCard: React.FC<ModuleCardProps> = ({ icon, title, description, module, onStart, isCompleted }) => (
  <Tilt
    tiltMaxAngleX={15} // Maximum tilt rotation (degrees) on X-axis
    tiltMaxAngleY={15} // Maximum tilt rotation (degrees) on Y-axis
    scale={1.05} // Slight scale-up on hover
    transitionSpeed={400} // Transition speed
    glareEnable={true} // Enable glare effect
    glareMaxOpacity={0.3} // Subtle glare intensity
    className="relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500 group cursor-pointer border transform hover:-translate-y-3 hover:shadow-[0_15px_50px_rgba(59,130,246,0.5)]"
    style={{
      background: isCompleted
        ? 'linear-gradient(135deg, rgba(6, 95, 70, 0.95), rgba(20, 83, 45, 0.95))'
        : 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 58, 138, 0.95), rgba(49, 46, 129, 0.95))',
      borderColor: isCompleted ? 'rgba(22, 163, 74, 0.7)' : 'rgba(59, 130, 246, 0.6)',
    }}
  >
    {/* Dynamic glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/25 via-indigo-600/30 to-purple-600/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />

    {/* Glassmorphism texture */}
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-8 group-hover:opacity-14 transition-opacity duration-500" />

    {/* Glowing border effect */}
    <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-blue-500/70 transition-all duration-500" />

    <div className="relative z-10">
      {/* Enhanced 3D icon with realistic shadow and hover animation */}
      <div className="text-7xl mb-6 text-center transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-400 ease-out drop-shadow-[0_8px_16px_rgba(59,130,246,0.7)]">
        {icon}
      </div>

      {/* Enhanced title with dynamic gradient and subtle animation */}
      <h3 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-500">
        {title}
      </h3>

      {/* Enhanced description with smoother text rendering */}
      <p className={`text-base mb-6 leading-relaxed font-medium tracking-wide ${isCompleted ? 'text-white/95' : 'text-slate-100/90'}`}>
        {description}
      </p>

      {/* Enhanced button with micro-interactions and realistic depth */}
      <button
        onClick={() => onStart(module)}
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-400 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
          isCompleted
            ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 border border-green-500/70 hover:border-green-400/80'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border border-blue-500/70 hover:border-blue-400/80'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle size={24} className="group-hover:scale-110 transition-transform duration-300" />
            Completed
          </>
        ) : (
          <>
            <Play size={24} className="group-hover:scale-110 transition-transform duration-300" />
            Start Module
          </>
        )}
      </button>
    </div>

    {/* Enhanced completion badge with realistic glow and pulse */}
    {isCompleted && (
      <div className="absolute top-4 right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse-slow">
        <CheckCircle size={20} className="text-white drop-shadow-md" />
      </div>
    )}
    </Tilt>
    
);

export default ModuleCard;