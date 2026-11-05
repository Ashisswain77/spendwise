import { useState, useEffect, useRef } from 'react'
import {
  Receipt,
  SlidersHorizontal,
  BarChart3,
  Target,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  Plus,
  Pause,
  Play,
  ArrowUpRight,
  Wallet,
  AlertTriangle,
} from 'lucide-react'
import { formatINR } from '../../utils/currency'
import ScrollReveal from '../../components/common/ScrollReveal'

const features = [
  {
    id: 0,
    icon: Receipt,
    badge: 'Ledger & CSV',
    title: 'Expense & Income Tracking',
    description: 'Log transactions in seconds with UPI/Card wallet tags, search filters, and 1-click Google Sheets CSV export.',
  },
  {
    id: 1,
    icon: SlidersHorizontal,
    badge: 'Monthly Ceilings',
    title: 'Smart Category Budgets',
    description: 'Set Overall and category-wise monthly limits in ₹ INR with automatic 80% warning and overrun alerts.',
  },
  {
    id: 2,
    icon: BarChart3,
    badge: 'Cashflow Intelligence',
    title: 'Visual Spending Analytics',
    description: 'Reconcile monthly inflow vs. outflow trends and inspect category-wise expense share in real time.',
  },
  {
    id: 3,
    icon: Target,
    badge: 'Wealth Milestones',
    title: 'Savings Goals & Deposits',
    description: 'Create target milestones, log incremental contributions, and watch your goals auto-complete at 100%.',
  },
]

const sampleFeedInitial = [
  { id: 1, title: 'Swiggy Gourmet Meal', cat: 'Food & Dining', mode: 'UPI', amount: 450, type: 'expense', date: '2026-11-05' },
  { id: 2, title: 'Monthly Salary Credit', cat: 'Salary', mode: 'Net Banking', amount: 85000, type: 'income', date: '2026-11-01' },
  { id: 3, title: 'Uber Airport Ride', cat: 'Transport', mode: 'Credit Card', amount: 620, type: 'expense', date: '2026-10-30' },
]

export default function Features() {
  const [activeTab, setActiveTab] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const nextIdRef = useRef(10)

  // Feature 0: Interactive Expense & Income Ledger
  const [selectedMode, setSelectedMode] = useState('UPI')
  const [feedItems, setFeedItems] = useState(sampleFeedInitial)
  const [csvExported, setCsvExported] = useState(false)

  // Feature 1: Interactive Smart Budgeting
  const [budgetCap, setBudgetCap] = useState(40000)

  // Feature 2: Interactive Analytics Highlight
  const [highlightedCat, setHighlightedCat] = useState('Rent & Housing')

  // Feature 3: Interactive Savings Goal
  const [goalSaved, setGoalSaved] = useState(75000)
  const [contributions, setContributions] = useState([
    { id: 1, amount: 25000, date: 'Oct 15' },
    { id: 2, amount: 50000, date: 'Nov 01' },
  ])
  const goalTarget = 100000
  const goalPercent = Math.min(100, Math.round((goalSaved / goalTarget) * 100))

  // Auto-advance feature showcase every 6.5s unless paused
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % features.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const handleLogQuickPreset = (preset) => {
    setIsAutoPlaying(false)
    nextIdRef.current += 1
    const newEntry = {
      id: nextIdRef.current,
      title: preset.label,
      cat: preset.cat,
      mode: selectedMode,
      amount: preset.amount,
      type: preset.type,
      date: 'Today',
      isNew: true,
    }
    setFeedItems((prev) => [newEntry, ...prev.slice(0, 3)])
  }

  const handleSimulateCsv = () => {
    setIsAutoPlaying(false)
    setCsvExported(true)
    setTimeout(() => setCsvExported(false), 2500)
  }

  const handleDepositGoal = (amount) => {
    setIsAutoPlaying(false)
    nextIdRef.current += 1
    const depId = nextIdRef.current
    setGoalSaved((prev) => {
      const next = Math.min(goalTarget, prev + amount)
      return next
    })
    setContributions((prev) => [
      { id: depId, amount, date: 'Just now' },
      ...prev.slice(0, 3),
    ])
  }

  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between max-w-4xl mx-auto md:max-w-none mb-10 sm:mb-12 gap-4">
            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Interactive Capability Showcase</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Everything you need. Nothing you don&apos;t.
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
                Click any capability below—or watch them cycle automatically—to test drive SpendWise&apos;s live tools.
              </p>
            </div>

            {/* Auto-Play Showcase Toggle */}
            <div className="flex items-center justify-center md:justify-end">
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Auto-Tour Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-slate-500" />
                    <span>Resume Auto-Tour</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {features.map((item, idx) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <ScrollReveal key={item.title} variant="fade-up" delay={idx * 80}>
                <div
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsAutoPlaying(false)
                  }}
                  className={`relative h-full p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden group ${
                    isActive
                      ? 'bg-slate-50 dark:bg-slate-900 border-emerald-500 dark:border-emerald-500 shadow-lg shadow-emerald-500/10 -translate-y-1'
                      : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:-translate-y-1'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                            : 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Active bottom indicator bar */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold">
                    <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                      {isActive ? 'Live in stage below' : 'Click to preview'}
                    </span>
                    <ArrowUpRight
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400 translate-x-0.5 -translate-y-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Interactive Feature Sandbox Stage */}
        <ScrollReveal variant="zoom-in" delay={150}>
          <div
            onMouseEnter={() => setIsAutoPlaying(false)}
            className="p-5 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md transition-all duration-300"
          >
            {/* =====================================================================
                STAGE 0: EXPENSE & INCOME TRACKING + CSV EXPORT
               ===================================================================== */}
            {activeTab === 0 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Feature 01 &bull; Instant Ledger &amp; Google Sheets Export
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      Log a sample transaction &amp; test 1-click CSV formatting
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Wallet Mode:</span>
                    {['UPI', 'Credit Card', 'Net Banking', 'Cash'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setSelectedMode(mode)
                          setIsAutoPlaying(false)
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                          selectedMode === mode
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left: Quick Tap Presets */}
                  <div className="lg:col-span-5 space-y-2.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Tap a preset to append to ledger:
                    </span>
                    {[
                      { label: 'Chai & Samosa Break', amount: 180, cat: 'Food & Dining', type: 'expense' },
                      { label: 'Nature Basket Groceries', amount: 2450, cat: 'Groceries', type: 'expense' },
                      { label: 'Client Milestone Payout', amount: 18000, cat: 'Freelance', type: 'income' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleLogQuickPreset(item)}
                        className="w-full p-3.5 text-left rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-2xs hover:-translate-y-0.5"
                      >
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            + {item.label}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                            {item.cat} &bull; via <strong>{selectedMode}</strong>
                          </span>
                        </div>
                        <span
                          className={`text-xs sm:text-sm font-extrabold font-mono ${
                            item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {item.type === 'income' ? `+${formatINR(item.amount)}` : `-${formatINR(item.amount)}`}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right: Animated Live Mini-Ledger */}
                  <div className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Live Reconciled Ledger ({feedItems.length} entries)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSimulateCsv}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>{csvExported ? 'Exported YYYY-MM-DD CSV!' : 'Preview CSV Export'}</span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                      {feedItems.map((tx) => (
                        <div
                          key={tx.id}
                          className={`py-2.5 flex items-center justify-between gap-2 text-xs transition-all ${
                            tx.isNew ? 'animate-slideInRight bg-emerald-50/60 dark:bg-emerald-950/30 px-2.5 rounded-xl' : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{tx.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {tx.cat} &bull; <span className="font-mono uppercase">{tx.mode}</span> &bull; {tx.date}
                            </p>
                          </div>
                          <span
                            className={`font-extrabold font-mono shrink-0 ${
                              tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {tx.type === 'income' ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =====================================================================
                STAGE 1: SMART BUDGETING SIMULATOR
               ===================================================================== */}
            {activeTab === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Feature 02 &bull; Overall &amp; Category Ceilings
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      Test real-time utilization thresholds &amp; overrun alerts
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 mr-1 hidden sm:inline">Monthly Limit:</span>
                    {[20000, 40000, 65000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setBudgetCap(amt)
                          setIsAutoPlaying(false)
                        }}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Overall Monthly Budget', spent: 24500, limit: budgetCap },
                    { name: 'Food & Dining Limit', spent: 9200, limit: Math.round(budgetCap * 0.3) },
                  ].map((b) => {
                    const pct = Math.round((b.spent / b.limit) * 100)
                    const isOver = b.spent > b.limit
                    const isWarning = !isOver && pct >= 80
                    return (
                      <div
                        key={b.name}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-900 dark:text-white">{b.name}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${
                              isOver
                                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                : isWarning
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isOver && <AlertTriangle className="w-3 h-3" />}
                            {pct}% utilized
                          </span>
                        </div>

                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>
                            Spent: <strong className="text-slate-900 dark:text-white">{formatINR(b.spent)}</strong> / {formatINR(b.limit)}
                          </span>
                          <span className={isOver ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                            {isOver
                              ? `${formatINR(b.spent - b.limit)} over limit`
                              : `${formatINR(b.limit - b.spent)} safe cushion`}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* =====================================================================
                STAGE 2: SPENDING ANALYTICS SIMULATOR
               ===================================================================== */}
            {activeTab === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Feature 03 &bull; Category Outflow Distribution
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      Visual cashflow &amp; category share breakdown
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Total Monthly Outflow: {formatINR(50000)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {[
                    { name: 'Rent & Housing', share: 42, amount: 21000, color: 'bg-emerald-500', desc: 'Fixed monthly lease & maintenance' },
                    { name: 'Groceries & Food', share: 24, amount: 12000, color: 'bg-teal-500', desc: 'Supermarket & dining deliveries' },
                    { name: 'SIP & Investments', share: 20, amount: 10000, color: 'bg-indigo-500', desc: 'Automated index fund wealth building' },
                    { name: 'Shopping & Leisure', share: 14, amount: 7000, color: 'bg-amber-500', desc: 'Weekend movies, apparel & travel' },
                  ].map((item) => {
                    const isSelected = highlightedCat === item.name
                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          setHighlightedCat(item.name)
                          setIsAutoPlaying(false)
                        }}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-slate-950 border-emerald-500 shadow-md -translate-y-0.5'
                            : 'bg-white/80 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{item.share}%</span>
                        </div>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono mb-2">
                          {formatINR(item.amount)}
                        </p>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                          <div
                            className={`h-1.5 rounded-full ${item.color} transition-all duration-500`}
                            style={{ width: `${item.share}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* =====================================================================
                STAGE 3: SAVINGS GOALS SIMULATOR
               ===================================================================== */}
            {activeTab === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Feature 04 &bull; Milestone Savings &amp; Contribution History
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      Target: Emergency Reserve Fund ({formatINR(goalTarget)})
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      disabled={goalSaved >= goalTarget}
                      onClick={() => handleDepositGoal(5000)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition active:scale-95 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Deposit +₹5,000</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAutoPlaying(false)
                        setGoalSaved(60000)
                        setContributions([{ id: 1, amount: 60000, date: 'Initial' }])
                      }}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-slate-800 dark:text-slate-200">
                      Saved so far: <span className="text-emerald-600 dark:text-emerald-400 font-mono">{formatINR(goalSaved)}</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">{goalPercent}% Completed</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden">
                    <div
                      className="h-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500"
                      style={{ width: `${goalPercent}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Recent Deposits:</span>
                      {contributions.map((c) => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-mono font-semibold"
                        >
                          +{formatINR(c.amount)} ({c.date})
                        </span>
                      ))}
                    </div>

                    {goalPercent >= 100 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1 animate-scalePop">
                        <CheckCircle2 className="w-4 h-4" />
                        Goal Completed! 🎉
                      </span>
                    ) : (
                      <span>{formatINR(goalTarget - goalSaved)} remaining to reach target</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
