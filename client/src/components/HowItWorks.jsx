import { UserPlus, Sliders, TrendingUp, ArrowRight } from 'lucide-react'
import { SignUpButton, Show } from '@clerk/react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Sign Up in 30 Seconds',
    description:
      'Get started instantly with enterprise-grade Clerk authentication. No complex forms or invasive bank credentials required.',
  },
  {
    step: '02',
    icon: Sliders,
    title: 'Set Budgets & Log Spending',
    description:
      'Configure monthly category targets in ₹ INR. Add expenses with quick tags for UPI, Cards, Net Banking, or Cash in two clicks.',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Unlock Insights & Build Wealth',
    description:
      'Watch your cashflow charts update in real time. Identify money leaks, optimize discretionary spending, and achieve savings milestones.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span>Simple 3-Step Setup</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How SpendWise works.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3">
            From zero to complete financial clarity in three straightforward steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={s.step}
                className="p-8 rounded-3xl bg-slate-950/70 border border-slate-800 relative flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-emerald-500 font-mono">
                      {s.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-slate-700 z-10 pointer-events-none">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA trigger */}
        <div className="mt-12 text-center">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer">
                <span>Start Your 30-Second Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
          </Show>
        </div>
      </div>
    </section>
  )
}
