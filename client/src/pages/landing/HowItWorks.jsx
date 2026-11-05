import { useState } from 'react'
import { UserPlus, Wallet, TrendingUp, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Sign Up in Seconds',
    description: 'Create your account with secure Clerk authentication. No invasive bank passwords or SMS permissions required.',
    previewTitle: 'Step 1: Zero-Friction Clerk Authentication',
    previewBadge: 'Secured by Clerk',
    previewText:
      'Get started immediately using Google or Email. Your session is cryptographically verified with JWT tokens and strict per-user data isolation.',
    highlights: ['Google OAuth & Email Sign-In', 'Zero Bank Password Scraping', 'Isolated User Ledger'],
  },
  {
    step: '02',
    icon: Wallet,
    title: 'Log & Budget in ₹ INR',
    description: 'Record daily income and expenses with paise precision, tag UPI or Cards, and set monthly category ceilings.',
    previewTitle: 'Step 2: Instant INR Ledger & Monthly Budgets',
    previewBadge: 'Paise-Precision Engine',
    previewText:
      'Log daily spending across UPI, Credit Cards, Net Banking, or Cash. Set Overall and category budgets that calculate utilization on the fly.',
    highlights: ['UPI, Card & Cash Tags', 'Overall + Category Ceilings', '1-Click Google Sheets CSV'],
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Hit Your Savings Goals',
    description: 'Review monthly cash flow charts, spot category overruns early, and deposit into milestone savings goals.',
    previewTitle: 'Step 3: Visual Cashflow & Milestone Goals',
    previewBadge: '54.7% Retained Rate',
    previewText:
      'Track your net savings rate, compare monthly income vs. expenses, and record incremental deposits toward your personal financial targets.',
    highlights: ['Monthly & Yearly Bar Charts', 'Category Doughnut Breakdown', 'Milestone Contribution History'],
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simple 3-Step Workflow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How SpendWise works.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Click through each step below to see how your financial workflow comes together.
            </p>
          </div>
        </ScrollReveal>

        {/* Animated Progress Track Indicator (Desktop) */}
        <ScrollReveal variant="fade-up" delay={80}>
          <div className="hidden md:block max-w-3xl mx-auto mb-8">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Interactive Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {steps.map((s, idx) => {
            const Icon = s.icon
            const isActive = activeStep === idx
            const isCompleted = idx < activeStep
            return (
              <ScrollReveal key={s.step} variant="fade-up" delay={idx * 100}>
                <div
                  onClick={() => setActiveStep(idx)}
                  className={`h-full p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/10 -translate-y-1'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:-translate-y-1'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className={`text-2xl font-black font-mono transition-colors ${
                          isActive || isCompleted ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        {s.step}
                      </span>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
                      <span>{s.title}</span>
                      {isActive && (
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Interactive Step Detail Card */}
        <ScrollReveal variant="zoom-in" delay={200}>
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {steps[activeStep].previewBadge}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {steps[activeStep].previewTitle}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {steps[activeStep].previewText}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {steps[activeStep].highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300/90 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 mr-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Step {activeStep + 1} of {steps.length}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 cursor-pointer shadow-xs"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
