import { useState } from 'react'
import { Show } from '@clerk/react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BackgroundAnimation from './components/common/BackgroundAnimation'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')

  return (
    <div className="relative min-h-screen bg-white/90 dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900/40 dark:selection:text-emerald-200">
      {/* Minimal Geometric Background Animation Throughout Entire Page */}
      <BackgroundAnimation />

      {/* Navigation Header */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Body */}
      <main className="flex-1">
        {/* Public Visitor Experience: Streamlined, minimal, conversion-focused */}
        <Show when="signed-out">
          <LandingPage />
        </Show>

        {/* Authenticated User Experience */}
        <Show when="signed-in">
          <DashboardPage activeTab={activeTab} onTabChange={setActiveTab} />
        </Show>
      </main>

      {/* Footer Navigation: Landing Page Only */}
      <Show when="signed-out">
        <Footer />
      </Show>
    </div>
  )
}
