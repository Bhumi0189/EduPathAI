import React, { useState } from "react"

const initialBubbles = [
  { left: "10%", size: 14, delay: "0s", duration: "6s", color: "rgba(255, 255, 255, 0.9)" },
  { left: "22%", size: 12, delay: "0.5s", duration: "5.5s", color: "rgba(255, 255, 255, 0.9)" },
  { left: "35%", size: 16, delay: "1s", duration: "6.2s", color: "rgba(255, 255, 255, 0.9)" },
  { left: "50%", size: 10, delay: "0.2s", duration: "5.2s", color: "rgba(255, 255, 255, 0.9)" },
  { left: "65%", size: 13, delay: "0.8s", duration: "5.8s", color: "rgba(255, 255, 255, 0.9)" },
  { left: "80%", size: 11, delay: "1.2s", duration: "5.4s", color: "rgba(255, 255, 255, 0.9)" },
  { left: "15%", size: 18, delay: "0.3s", duration: "6.5s", color: "rgba(255, 255, 255, 0.9)" },
  { left: "45%", size: 15, delay: "0.7s", duration: "5.6s", color: "rgba(255, 255, 255, 0.9)" },
  { left: "75%", size: 14, delay: "1.1s", duration: "6.1s", color: "rgba(255, 255, 255, 0.9)" },
]

export function Bubbles() {
  const [bubbles, setBubbles] = useState(
    initialBubbles.map((b, i) => ({ ...b, id: i, popping: false }))
  )

  // Pop a random bubble when background is clicked
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      const unpopped = bubbles.filter(b => !b.popping)
      if (unpopped.length === 0) return
      const randomId = unpopped[Math.floor(Math.random() * unpopped.length)].id
      handlePop(randomId)
    }
  }

  const handlePop = (id: number) => {
    setBubbles(bubs =>
      bubs.map(b =>
        b.id === id ? { ...b, popping: true } : b
      )
    )
    setTimeout(() => {
      setBubbles(bubs => bubs.filter(b => b.id !== id))
    }, 350)
  }

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-0 overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full blur animate-bubble transition-all duration-300 ${
            bubble.popping ? "scale-150 opacity-0" : "cursor-pointer"
          }`}
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
            bottom: -bubble.size,
          }}
          onClick={(e) => {
            e.stopPropagation() // Prevent background click from firing too
            handlePop(bubble.id)
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-110vh) scale(1.05);
            opacity: 0;
          }
        }

        .animate-bubble {
          animation-name: bubble;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}
