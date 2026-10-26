import { useState } from 'react'
import { UserPlus, Wallet, TrendingUp, ArrowRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your account in seconds with secure Clerk authentication. No invasive bank credentials required.',
    previewTitle: 'Step 1: Zero-Friction Authentication',
    previewBadge: 'Secured by Clerk',
    previewText: 'Get started immediately using Google, Apple, or Email. Your session is cryptographically secured with zero sensitive bank login requirements.',
  },
  {
    step: '02',
    icon: Wallet,
    title: 'Track Your Money',
    description: 'Record daily income and expenses in Indian Rupees with fast categories and payment mode tags.',
    previewTitle: 'Step 2: Instant INR Transaction Entry',
    previewBadge: 'paise-precision engine',
    previewText: 'Log daily spending across UPI, Net Banking, Credit Cards, or Cash. Transactions automatically reconcile into your live ledger.',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Understand Your Spending',
    description: 'Review automatic monthly budget progress, interactive cash flow trends, and your net savings rate.',
    previewTitle: 'Step 3: Actionable Financial Insights',
    previewBadge: '54.7% Retained Rate',
    previewText: 'Track your savings rate, detect recurring budget overruns, and see month-over-month cash flow trends with crystal-clear visual charts.',
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span>Simple 3-Step Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How SpendWise works.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Click through each step to see what your experience looks like.
          </p>
        </div>

        {/* 3 Interactive Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {steps.map((s, idx) => {
            const Icon = s.icon
            const isActive = activeStep === idx
            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-102'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-2xl font-black font-mono transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {s.step}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
                    <span>{s.title}</span>
                    {isActive && (
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                        Inspecting
                      </span>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Interactive Step Detail Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-950 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {steps[activeStep].previewBadge}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {steps[activeStep].previewTitle}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {steps[activeStep].previewText}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}


