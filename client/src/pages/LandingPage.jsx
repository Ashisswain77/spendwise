import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import Hero from './landing/Hero'
import DashboardPreview from './landing/DashboardPreview'
import Features from './landing/Features'
import HowItWorks from './landing/HowItWorks'
import FAQSection from './landing/FAQSection'
import CTASection from './landing/CTASection'
import { smoothScrollTo } from '../utils/scroll'

export default function LandingPage() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="space-y-0 relative">
      <Hero />
      <DashboardPreview />
      <Features />
      <HowItWorks />
      <FAQSection />
      <CTASection />

      {/* Floating Smooth Scroll-to-Top Button */}
      <button
        type="button"
        onClick={() => smoothScrollTo('#')}
        aria-label="Scroll back to top"
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500/40 transition-all duration-300 cursor-pointer ${
          showBackToTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  )
}
