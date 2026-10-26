import Hero from './landing/Hero'
import DashboardPreview from './landing/DashboardPreview'
import Features from './landing/Features'
import HowItWorks from './landing/HowItWorks'
import CTASection from './landing/CTASection'

export default function LandingPage() {
  return (
    <div className="space-y-0">
      <Hero />
      <DashboardPreview />
      <Features />
      <HowItWorks />
      <CTASection />
    </div>
  )
}
