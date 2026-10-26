import { useEffect, useState } from 'react'

export default function BackgroundAnimation() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let animationFrameId
    const handleMouseMove = (e) => {
      // Throttle mouse updates via requestAnimationFrame for 60fps smoothness
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY })
        if (!isHovered) setIsHovered(true)
      })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isHovered])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
      aria-hidden="true"
    >
      {/* 1. Defined Geometric Dot Grid Pattern (Sharp, structured, not vague) */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 dark:opacity-35" />

      {/* 2. Interactive Cursor Spotlight (Subtly illuminates grid where user moves) */}
      {isHovered && (
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            transform: `translate3d(${mousePos.x - 250}px, ${mousePos.y - 250}px, 0)`,
            background:
              'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, rgba(16, 185, 129, 0.03) 40%, transparent 70%)',
            willChange: 'transform',
          }}
        />
      )}

      {/* 3. Subtle Drifting Ambient Light Orbs (Gentle, controlled, minimal) */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-emerald-500/8 dark:bg-emerald-500/10 blur-[100px] animate-drift1 pointer-events-none"
        style={{ willChange: 'transform' }}
      />

      <div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-teal-500/7 dark:bg-teal-500/9 blur-[110px] animate-drift2 pointer-events-none"
        style={{ willChange: 'transform' }}
      />

      <div
        className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-emerald-600/6 dark:bg-emerald-600/8 blur-[120px] animate-drift1 pointer-events-none"
        style={{ willChange: 'transform' }}
      />

      {/* 4. Fine Corner Accents / Technical Calibration Marks (Fintech terminal touch) */}
      <svg
        className="absolute top-6 left-6 w-5 h-5 text-emerald-600/20 dark:text-emerald-400/20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 10V4h6" />
      </svg>
      <svg
        className="absolute top-6 right-6 w-5 h-5 text-emerald-600/20 dark:text-emerald-400/20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20 10V4h-6" />
      </svg>
    </div>
  )
}
