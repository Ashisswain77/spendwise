import { useState } from 'react'
import { Calculator, Sparkles, ShieldAlert, HeartHandshake, ArrowRight } from 'lucide-react'
import { formatINR } from '../utils/currency'
import { SignUpButton, Show } from '@clerk/react'

export default function BudgetCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(80000)

  const needs = Math.round(monthlyIncome * 0.5)
  const wants = Math.round(monthlyIncome * 0.3)
  const savings = Math.round(monthlyIncome * 0.2)
  const yearlySavings = savings * 12

  const presetIncomes = [40000, 75000, 120000, 200000]

  return (
    <section id="budget" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>50/30/20 Smart Budgeting Rule</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            See how much you could save in ₹ INR.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Slide or pick your monthly in-hand income to calculate the proven 50/30/20 budgeting structure and discover your potential annual wealth accumulation.
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10">
          <div className="space-y-6">
            {/* Income Input & Presets */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <label htmlFor="income-slider" className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Monthly Take-Home Income
                </label>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {formatINR(monthlyIncome)}
                </span>
              </div>

              {/* Slider */}
              <input
                id="income-slider"
                type="range"
                min="20000"
                max="300000"
                step="5000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-hidden"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-3">
                <span className="text-xs text-slate-500 font-medium">Quick presets:</span>
                {presetIncomes.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMonthlyIncome(amt)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      monthlyIncome === amt
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Pillars Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">50% Needs</span>
                  <ShieldAlert className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-xl font-bold text-slate-900">{formatINR(needs)}</p>
                <p className="text-xs text-slate-500 mt-1">Rent, groceries, utilities, EMIs, and healthcare essentials.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">30% Wants</span>
                  <HeartHandshake className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-xl font-bold text-slate-900">{formatINR(wants)}</p>
                <p className="text-xs text-slate-500 mt-1">Dining out, entertainment, shopping, and leisure travel.</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">20% Savings</span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl font-bold text-emerald-700">{formatINR(savings)}</p>
                <p className="text-xs text-emerald-800/80 mt-1">SIP investments, emergency fund, and wealth compounding.</p>
              </div>
            </div>

            {/* Annual Potential Wealth Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  1-Year Projected Wealth Accumulation
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {formatINR(yearlySavings)}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Saved annually by adhering to your SpendWise automated budget.
                </p>
              </div>

              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition cursor-pointer shrink-0">
                    <span>Lock In Your Budget</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </SignUpButton>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
