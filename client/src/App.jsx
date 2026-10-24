import { Show } from '@clerk/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DashboardPreview from './components/DashboardPreview'
import Features from './components/Features'
import BudgetCalculator from './components/BudgetCalculator'
import UseCases from './components/UseCases'
import HowItWorks from './components/HowItWorks'
import SecuritySection from './components/SecuritySection'
import FAQSection from './components/FAQSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import AuthenticatedDashboard from './components/AuthenticatedDashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Body */}
      <main className="flex-1">
        {/* Public Visitor Experience */}
        <Show when="signed-out">
          <Hero />
          <DashboardPreview />
          <Features />
          <BudgetCalculator />
          <UseCases />
          <HowItWorks />
          <SecuritySection />
          <FAQSection />
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
