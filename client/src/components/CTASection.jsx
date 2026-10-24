import { SignUpButton, Show } from '@clerk/react'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import SpendWiseLogo from './Logo'

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Transform Your Financial Habits Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Ready to take full control of your wealth with{' '}
          <span className="inline-block align-middle my-1">
            <SpendWiseLogo className="h-9 sm:h-12 lg:h-14 w-auto inline-block align-middle" textColor="#FFFFFF" />
          </span>
          ?
        </h2>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
          Start tracking expenses in ₹ INR, automate your 50/30/20 budgets, and reach your savings milestones with zero friction.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-xl shadow-emerald-600/30 transition duration-150 cursor-pointer">
                <span>Get Started for Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          </Show>
          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition"
          >
            Review Interactive Demo
          </a>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Instant 30-Second Setup
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            No Bank Passwords Required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Cancel or Export Anytime
          </span>
        </div>
      </div>
    </section>
  )
}
