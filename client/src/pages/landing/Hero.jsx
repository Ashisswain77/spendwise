import { useState } from 'react'
import { SignUpButton, Show } from '@clerk/react'
import {
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Calculator,
  ChevronDown,
  ShieldCheck,
  FileSpreadsheet,
  Target,
  Zap,
} from 'lucide-react'
import { formatINR } from '../../utils/currency'
import ScrollReveal from '../../components/common/ScrollReveal'
import { smoothScrollTo } from '../../utils/scroll'

const incomePresets = [
  { label: '₹40,000/mo', income: 40000 },
  { label: '₹75,000/mo', income: 75000 },
  { label: '₹1,20,000/mo', income: 120000 },
  { label: '₹2,00,000/mo', income: 200000 },
]

const featureHighlights = [
  { icon: Zap, label: 'Paise-Level Precision', target: '#features' },
  { icon: Target, label: 'Milestone Savings Goals', target: '#features' },
  { icon: FileSpreadsheet, label: 'Google Sheets CSV Export', target: '#features' },
  { icon: ShieldCheck, label: 'Clerk Enterprise Auth', target: '#how-it-works' },
]

export default function Hero() {
  const [selectedIncome, setSelectedIncome] = useState(75000)

  const needs = Math.round(selectedIncome * 0.5)
  const wants = Math.round(selectedIncome * 0.3)
  const savings = Math.round(selectedIncome * 0.2)

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[340px] bg-emerald-500/12 dark:bg-emerald-500/15 blur-[135px] rounded-full pointer-events-none -z-10 animate-pulseGlow" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Category Pill */}
        <ScrollReveal variant="fade-down" delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200/90 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-2xs transition-transform hover:scale-105 duration-200 cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>Personal Finance &amp; Budget Tracker Built for India</span>
          </div>
        </ScrollReveal>

        {/* Strong Headline with Shimmer Gradient */}
        <ScrollReveal variant="fade-up" delay={80}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Take Control of{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent animate-shimmerText">
              Every Rupee.
            </span>
          </h1>
        </ScrollReveal>

        {/* Supporting Sentence */}
        <ScrollReveal variant="fade-up" delay={160}>
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mt-6">
            Track daily expenses across UPI &amp; cards, set smart monthly category budgets, and hit your savings goals with crystal-clear analytics.
          </p>
        </ScrollReveal>

        {/* Conversion CTAs */}
        <ScrollReveal variant="fade-up" delay={240}>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignUpButton>
            </Show>

            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault()
                smoothScrollTo('#demo')
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Explore Live Dashboard</span>
            </a>
          </div>
        </ScrollReveal>

        {/* Feature Highlight Pills */}
        <ScrollReveal variant="fade-up" delay={300}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {featureHighlights.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => smoothScrollTo(item.target)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 hover:-translate-y-0.5 transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </ScrollReveal>

        {/* Interactive Quick 50/30/20 Rupee Estimator */}
        <ScrollReveal variant="zoom-in" delay={360}>
          <div className="mt-10 p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 max-w-2xl mx-auto shadow-lg shadow-slate-900/5 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Interactive 50 / 30 / 20 INR Rule Estimator
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Slide or tap a preset to preview your ideal monthly allocation
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {incomePresets.map((preset) => (
                  <button
                    key={preset.income}
                    type="button"
                    onClick={() => setSelectedIncome(preset.income)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      selectedIncome === preset.income
                        ? 'bg-emerald-600 text-white shadow-xs scale-102'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Range Slider */}
            <div className="pt-4 pb-2">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Monthly Take-Home Income
                </span>
                <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatINR(selectedIncome)} / month
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={300000}
                step={5000}
                value={selectedIncome}
                onChange={(e) => setSelectedIncome(Number(e.target.value))}
                aria-label="Monthly Take-Home Income in INR"
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/80 transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Needs (50%)
                  </span>
                </div>
                <p className="text-xs sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                  {formatINR(needs)}
                </p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
                  Rent, Bills &amp; Groceries
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/80 transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Wants (30%)
                  </span>
                </div>
                <p className="text-xs sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                  {formatINR(wants)}
                </p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
                  Dining, Travel &amp; Leisure
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/70 transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Savings (20%)
                  </span>
                </div>
                <p className="text-xs sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                  {formatINR(savings)}
                </p>
                <span className="text-[10px] text-emerald-700/70 dark:text-emerald-400/70 hidden sm:block mt-0.5">
                  SIPs &amp; Emergency Goals
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Smooth Scroll Down Cue */}
        <ScrollReveal variant="fade-up" delay={450}>
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => smoothScrollTo('#demo')}
              className="inline-flex flex-col items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer group"
              aria-label="Scroll to interactive dashboard demo"
            >
              <span>Scroll to test drive</span>
              <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-emerald-500" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
