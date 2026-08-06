import React from "react";

export function SmokeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Layer 1 - Slow drifting smoke */}
      <div className="absolute top-1/5 left-1/5 w-[700px] h-[500px] bg-gradient-to-br from-blue-600/25 via-indigo-500/15 to-purple-600/15 rounded-[50%] blur-4xl animate-smoke1" />
      {/* Layer 2 - Medium drifting smoke */}
      <div className="absolute top-1/3 left-1/2 w-[600px] h-[450px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-purple-700/15 rounded-[50%] blur-4xl animate-smoke2" />
      {/* Layer 3 - Fast wispy smoke */}
      <div className="absolute top-2/5 left-3/4 w-[550px] h-[400px] bg-gradient-to-tl from-blue-400/15 via-purple-500/15 to-indigo-900/10 rounded-[50%] blur-4xl animate-smoke3" />
      {/* Layer 4 - Subtle background haze */}
      <div className="absolute top-1/2 left-1/4 w-[650px] h-[450px] bg-gradient-to-b from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-[50%] blur-5xl animate-smoke4" />
      <style jsx global>{`
        @keyframes smoke1 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50px, -60px) scale(1.1) rotate(15deg);
            opacity: 0.9;
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.7;
          }
        }
        @keyframes smoke2 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translate(40px, -50px) scale(1.15) rotate(-12deg);
            opacity: 0.85;
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.6;
          }
        }
        @keyframes smoke3 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.65;
          }
          50% {
            transform: translate(-30px, 40px) scale(1.12) rotate(10deg);
            opacity: 0.9;
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.65;
          }
        }
        @keyframes smoke4 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translate(20px, -70px) scale(1.08) rotate(-8deg);
            opacity: 0.75;
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.5;
          }
        }
        .animate-smoke1 {
          animation: smoke1 16s ease-in-out infinite alternate;
        }
        .animate-smoke2 {
          animation: smoke2 18s ease-in-out infinite alternate;
        }
        .animate-smoke3 {
          animation: smoke3 14s ease-in-out infinite alternate;
        }
        .animate-smoke4 {
          animation: smoke4 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}