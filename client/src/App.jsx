import { Show } from '@clerk/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DashboardPreview from './components/DashboardPreview'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import AuthenticatedDashboard from './components/AuthenticatedDashboard'
import BackgroundAnimation from './components/BackgroundAnimation'

export default function App() {
  return (
    <div className="relative min-h-screen bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900/40 dark:selection:text-emerald-200 transition-colors">
      {/* Minimal Geometric Background Animation Throughout Entire Page */}
      <BackgroundAnimation />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Body */}
      <main className="flex-1">
        {/* Public Visitor Experience: Streamlined, minimal, conversion-focused */}
        <Show when="signed-out">
          <Hero />
          <DashboardPreview />
          <Features />
          <HowItWorks />
          <CTASection />
        </Show>

        {/* Authenticated User Experience */}
        <Show when="signed-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AuthenticatedDashboard />
          </div>
        </Show>
      </main>

      {/* Footer Navigation */}
      <Footer />
    </div>
  )
}
