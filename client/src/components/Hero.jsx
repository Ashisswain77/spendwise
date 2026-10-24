import { SignUpButton, Show } from '@clerk/react'
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react'
import SpendWiseLogo from './Logo'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-18 md:pb-24">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-teal-300/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Innovation Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>India&apos;s Modern Personal Finance &amp; Budget Tracker</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
          Master Your Finances. <br className="hidden sm:inline" />
          Track Every Rupee with{' '}
          <span className="inline-block align-middle my-1">
            <SpendWiseLogo className="h-10 sm:h-14 lg:h-16 w-auto inline-block align-middle" />
          </span>
        </h1>

        {/* Value Proposition Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mt-6">
          Track daily expenses, set category-wise INR budgets, monitor savings milestones, and gain actionable visual insights into your spending habits—all in one clean, lightning-fast dashboard.
        </p>

        {/* Primary CTAs */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-lg shadow-emerald-600/30 transition duration-150 cursor-pointer">
                <span>Start Tracking Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          </Show>

          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition duration-150"
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Interactive Demo</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            100% Free Tier Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            No Credit Card Required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Bank-Grade Privacy &amp; Clerk Auth
          </span>
        </div>
      </div>
    </section>
  )
}
