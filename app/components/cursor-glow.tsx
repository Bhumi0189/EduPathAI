import React, { useEffect, useRef } from "react"

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX - 150}px`
        glowRef.current.style.top = `${e.clientY - 150}px`
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={glowRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.35) 0%, rgba(139,92,246,0.15) 70%, transparent 100%)",
        filter: "blur(60px)",
        opacity: 0.8,
        pointerEvents: "none",
  // keep the glow behind UI content (VR hub uses z-10), so use a low z-index
  zIndex: 2,
        transition: "left 0.18s cubic-bezier(0.4,0,0.2,1), top 0.18s cubic-bezier(0.4,0,0.2,1)",
        mixBlendMode: "lighten",
      }}
    />
  )
}