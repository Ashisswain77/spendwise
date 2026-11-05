import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-triggered entrance animation wrapper using IntersectionObserver.
 */
export default function ScrollReveal({
  children,
  className = '',
  variant = 'fade-up', // 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in'
  delay = 0,
  duration = 650,
  threshold = 0.12,
  once = true,
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setIsVisible(true), 0)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(node)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once])

  const hiddenTransform = {
    'fade-up': 'translate3d(0, 28px, 0)',
    'fade-down': 'translate3d(0, -28px, 0)',
    'fade-left': 'translate3d(-28px, 0, 0)',
    'fade-right': 'translate3d(28px, 0, 0)',
    'zoom-in': 'scale(0.95) translate3d(0, 16px, 0)',
  }[variant] || 'translate3d(0, 28px, 0)'

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : hiddenTransform,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
