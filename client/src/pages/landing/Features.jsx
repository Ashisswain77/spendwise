import { useState } from 'react'
import { Receipt, SlidersHorizontal, BarChart3, Target, CheckCircle2, Sparkles } from 'lucide-react'
import { formatINR } from '../../utils/currency'

const features = [
  {
    id: 0,
    icon: Receipt,
    title: 'Expense Tracking',
    description: 'Log daily income and expenses in seconds with automatic category tagging.',
  },
  {
    id: 1,
    icon: SlidersHorizontal,
    title: 'Smart Budgeting',
    description: 'Set monthly category limits in ₹ INR and keep overspending under control.',
  },
  {
    id: 2,
    icon: BarChart3,
    title: 'Spending Analytics',
    description: 'Visualize your cash flow trends and see exactly where your money goes.',
  },
  {
    id: 3,
    icon: Target,
    title: 'Savings Goals',
    description: 'Set milestone targets and track your personal savings pace effortlessly.',
  },
]

export default function Features() {
  const [activeTab, setActiveTab] = useState(0)

  // Interactive state for Feature 0 (Expense Tracking)
  const [selectedMode, setSelectedMode] = useState('UPI')
  const [loggedExpense, setLoggedExpense] = useState('₹450 Swiggy Meal (Food & Dining)')

  // Interactive state for Feature 1 (Smart Budgeting)
  const [budgetCap, setBudgetCap] = useState(40000)

  // Interactive state for Feature 3 (Savings Goals)
  const [goalSaved, setGoalSaved] = useState(45000)
  const goalTarget = 100000
  const goalPercent = Math.min(100, Math.round((goalSaved / goalTarget) * 100))

  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
            <span>Essential Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Click any capability below to test drive its live functionality on the go.
          </p>
        </div>

        {/* 4 Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {features.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <div
                key={item.title}
                onClick={() => setActiveTab(item.id)}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                  isActive
                    ? 'bg-slate-50 dark:bg-slate-900 border-emerald-500 dark:border-emerald-500 shadow-md scale-102'
                    : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-1.5 flex items-center justify-between">
                    <span>{item.title}</span>
                    {isActive && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Active</span>}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Interactive Feature Sandbox Component */}
        <div className="p-5 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm animate-fadeIn">
          {/* View 0: Expense Tracking Simulator */}
          {activeTab === 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Interactive Demo &bull; Instant Transaction Logging
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Try logging a payment mode &amp; merchant
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Mode:</span>
                  {['UPI', 'Credit Card', 'Cash'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSelectedMode(mode)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                        selectedMode === mode
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { label: 'Chai & Snacks', amount: 150, cat: 'Food & Dining' },
                  { label: 'Nature Basket', amount: 1850, cat: 'Groceries' },
                  { label: 'Uber Ride', amount: 380, cat: 'Transport' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setLoggedExpense(`${formatINR(item.amount)} ${item.label} (${item.cat}) via ${selectedMode}`)}
                    className="p-3 text-left rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      Tap to Log: {item.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                      {formatINR(item.amount)} &bull; {item.cat}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs">
                <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                  <strong>Simulated Ledger Entry:</strong> {loggedExpense}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  <CheckCircle2 className="w-4 h-4 inline mr-1" />
                  Auto-Categorized
                </span>
              </div>
            </div>
          )}

          {/* View 1: Smart Budgeting Simulator */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Interactive Demo &bull; Dynamic Budget Ceiling
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Adjust monthly budget limit in ₹ INR
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  {[25000, 40000, 75000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBudgetCap(amt)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                        budgetCap === amt
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Food &amp; Dining Spending: {formatINR(18500)}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {Math.round((18500 / budgetCap) * 100)}% of {formatINR(budgetCap)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (18500 / budgetCap) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Remaining safety cushion: <strong>{formatINR(Math.max(0, budgetCap - 18500))}</strong> before threshold alert.
                </span>
              </div>
            </div>
          )}

          {/* View 2: Spending Analytics Simulator */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Interactive Demo &bull; Category Analytics Distribution
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Visual cashflow intelligence
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {[
                  { name: 'Rent & Housing', share: '42%', amount: 21000, color: 'bg-emerald-500' },
                  { name: 'Groceries & Food', share: '24%', amount: 12000, color: 'bg-teal-500' },
                  { name: 'SIP & Wealth', share: '20%', amount: 10000, color: 'bg-indigo-500' },
                  { name: 'Discretionary', share: '14%', amount: 7000, color: 'bg-amber-500' },
                ].map((item) => (
                  <div key={item.name} className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{formatINR(item.amount)}</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.share} total outflow</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View 3: Savings Goals Simulator */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Interactive Demo &bull; Milestone Savings Progress
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Target: Emergency Reserve Fund ({formatINR(goalTarget)})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setGoalSaved((prev) => Math.min(goalTarget, prev + 2500))}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tap to Deposit +₹2,500</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Saved: {formatINR(goalSaved)}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{goalPercent}% Reached</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${goalPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{formatINR(goalTarget - goalSaved)} remaining to reach full milestone</span>
                  {goalPercent >= 50 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Halfway Milestone Achieved!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


