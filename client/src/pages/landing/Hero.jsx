import { useState } from 'react'
import { SignUpButton, Show } from '@clerk/react'
import { ArrowRight, LayoutDashboard, Sparkles, Calculator } from 'lucide-react'
import { formatINR } from '../../utils/currency'

const incomePresets = [
  { label: '₹40,000/mo', income: 40000 },
  { label: '₹75,000/mo', income: 75000 },
  { label: '₹1,20,000/mo', income: 120000 },
]

export default function Hero() {
  const [selectedIncome, setSelectedIncome] = useState(75000)

  const needs = selectedIncome * 0.5
  const wants = selectedIncome * 0.3
  const savings = selectedIncome * 0.2

  return (
    <section className="relative overflow-hidden pt-14 pb-14 md:pt-20 md:pb-20">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulseGlow" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-6 animate-fadeIn transition-transform hover:scale-105 duration-200 cursor-default">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
          <span>Personal Finance &amp; Budget Tracker for India</span>
        </div>

        {/* Strong Headline with fadeInUp animation */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] animate-fadeInUp">
          Take Control of Every Rupee.
        </h1>

        {/* Short Supporting Sentence */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mt-6 animate-fadeInUp">
          Track expenses, manage monthly budgets, and reach your savings goals with complete clarity and peace of mind.
        </p>

        {/* Two Conversion CTAs */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none animate-fadeInUp">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 cursor-pointer group">
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
          </Show>

          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Explore Dashboard</span>
          </a>
        </div>

        {/* Interactive "Action on the Go": Quick 50/30/20 Rupee Estimator */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 max-w-2xl mx-auto shadow-xs text-left animate-fadeInUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Quick INR Budget Estimator
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">Monthly Inflow:</span>
              {incomePresets.map((preset) => (
                <button
                  key={preset.income}
                  type="button"
                  onClick={() => setSelectedIncome(preset.income)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    selectedIncome === preset.income
                      ? 'bg-emerald-600 text-white shadow-xs scale-102'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-3.5 text-center">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 transition-all hover:-translate-y-0.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 block">Needs (50%)</span>
              <p className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {formatINR(needs)}
              </p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 transition-all hover:-translate-y-0.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 block">Wants (30%)</span>
              <p className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {formatINR(wants)}
              </p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 transition-all hover:-translate-y-0.5">
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">Savings (20%)</span>
              <p className="text-xs sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatINR(savings)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
