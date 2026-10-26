import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  PlusCircle,
  Tag,
  CreditCard,
  Building,
  ShoppingBag,
  Coffee,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatINR } from '../../utils/currency'

const timeframeData = {
  '3M': [
    { month: 'Aug', income: 82000, expenses: 35100 },
    { month: 'Sep', income: 85000, expenses: 38450 },
    { month: 'Oct', income: 88000, expenses: 37000 },
  ],
  '6M': [
    { month: 'May', income: 72000, expenses: 34500 },
    { month: 'Jun', income: 75000, expenses: 41200 },
    { month: 'Jul', income: 80000, expenses: 36800 },
    { month: 'Aug', income: 82000, expenses: 35100 },
    { month: 'Sep', income: 85000, expenses: 38450 },
    { month: 'Oct', income: 88000, expenses: 37000 },
  ],
  '1Y': [
    { month: 'Nov', income: 68000, expenses: 32000 },
    { month: 'Jan', income: 70000, expenses: 34000 },
    { month: 'Mar', income: 74000, expenses: 36000 },
    { month: 'May', income: 72000, expenses: 34500 },
    { month: 'Jul', income: 80000, expenses: 36800 },
    { month: 'Oct', income: 88000, expenses: 37000 },
  ],
}

const defaultCategories = [
  { id: 'housing', name: 'Rent & Housing', amount: 16000, budget: 18000, icon: Building, color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 'food', name: 'Food & Dining', amount: 9400, budget: 12000, icon: Coffee, color: 'text-teal-400 bg-teal-500/10' },
  { id: 'shopping', name: 'Shopping & Leisure', amount: 5250, budget: 8000, icon: ShoppingBag, color: 'text-indigo-400 bg-indigo-500/10' },
  { id: 'utilities', name: 'Utilities & Bills', amount: 4100, budget: 5000, icon: CreditCard, color: 'text-amber-400 bg-amber-500/10' },
]

const defaultTransactions = [
  { id: 1, title: 'Swiggy Gourmet Order', category: 'Food & Dining', amount: -640, date: 'Today, 2:30 PM', type: 'expense', mode: 'UPI' },
  { id: 2, title: 'Client Milestone Payout', category: 'Freelance Inflow', amount: 24500, date: 'Yesterday', type: 'income', mode: 'IMPS' },
  { id: 3, title: 'JioFiber Broadband Bill', category: 'Utilities', amount: -1179, date: '22 Oct', type: 'expense', mode: 'AutoPay' },
  { id: 4, title: 'Monthly Mutual Fund SIP', category: 'Investment', amount: -10000, date: '20 Oct', type: 'expense', mode: 'UPI' },
]

export default function DashboardPreview() {
  const [timeframe, setTimeframe] = useState('6M')
  const [transactions, setTransactions] = useState(defaultTransactions)
  const [balance, setBalance] = useState(145280)
  const [inflow, setInflow] = useState(85000)
  const [outflow, setOutflow] = useState(38450)
  const [categories, setCategories] = useState(defaultCategories)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [lastActionType, setLastActionType] = useState(null)

  // Dynamic Savings Rate calculation
  const savingsRate = inflow > 0 ? Math.round(((inflow - outflow) / inflow) * 100) : 0
  const netSavings = inflow - outflow

  // Live action simulators
  const handleAddAction = (action) => {
    const newTx = {
      id: Date.now(),
      title: action.title,
      category: action.category,
      amount: action.type === 'income' ? action.amount : -action.amount,
      date: 'Just now',
      type: action.type,
      mode: action.mode,
      isNew: true,
    }

    setTransactions([newTx, ...transactions.slice(0, 3)])
    setLastActionType(action.type)

    if (action.type === 'income') {
      setBalance((prev) => prev + action.amount)
      setInflow((prev) => prev + action.amount)
      toast.success(`Inflow added: +${formatINR(action.amount)} (${action.title})`)
    } else {
      setBalance((prev) => prev - action.amount)
      setOutflow((prev) => prev + action.amount)
      // Update category budget if matches
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name.toLowerCase().includes(action.category.toLowerCase().split(' ')[0])
            ? { ...cat, amount: cat.amount + action.amount }
            : cat
        )
      )
      toast.success(`Expense logged: ${formatINR(action.amount)} for ${action.category}`)
    }

    setTimeout(() => setLastActionType(null), 1200)
  }

  const handleReset = () => {
    setTransactions(defaultTransactions)
    setBalance(145280)
    setInflow(85000)
    setOutflow(38450)
    setCategories(defaultCategories)
    setSelectedCategory(null)
    toast.success('Reset demo data to default')
  }

  return (
    <section id="demo" className="py-14 md:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none animate-pulseGlow" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-teal-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Live Product Centerpiece</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Financial clarity you can see &amp; touch.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Try the actions below to see how live balances, cash flow trends, and budget progress recalculate on the fly.
          </p>
        </div>

        {/* Dashboard Shell Frame */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-xl transition-all duration-300">
          {/* Top Window Bar with Action Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-2 text-xs font-semibold text-slate-300">
                SpendWise Dashboard &bull; Live Preview
              </span>
            </div>

            {/* Quick Action Simulator Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">
                Test In Action:
              </span>
              <button
                type="button"
                onClick={() =>
                  handleAddAction({
                    title: 'Swiggy Dinner Delivery',
                    category: 'Food & Dining',
                    amount: 450,
                    type: 'expense',
                    mode: 'UPI',
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3 text-rose-400" />
                <span>+ ₹450 Food</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAddAction({
                    title: 'Freelance Design Payout',
                    category: 'Freelance Inflow',
                    amount: 15000,
                    type: 'income',
                    mode: 'IMPS',
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>+ ₹15k Inflow</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAddAction({
                    title: 'Metro & Fuel Card Recharge',
                    category: 'Utilities & Bills',
                    amount: 1200,
                    type: 'expense',
                    mode: 'AutoPay',
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3 text-amber-400" />
                <span>+ ₹1.2k Bill</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                title="Reset preview data"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1. INR Balance & Metric Cards with Dynamic Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-7">
            <div
              className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border transition-all duration-300 ${
                lastActionType
                  ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/10 scale-101'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Total Balance</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2 transition-all">
                {formatINR(balance)}
              </p>
              <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">
                All accounts reconciled
              </span>
            </div>

            <div
              className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border transition-all duration-300 ${
                lastActionType === 'income'
                  ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/10 scale-101'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Monthly Inflow</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
                {formatINR(inflow)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Salary &amp; Freelance</span>
            </div>

            <div
              className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border transition-all duration-300 ${
                lastActionType === 'expense'
                  ? 'border-rose-500/80 shadow-lg shadow-rose-500/10 scale-101'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Monthly Outflow</span>
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
                {formatINR(outflow)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {Math.round((outflow / 50000) * 100)}% of ₹50K target
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all duration-300">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Net Savings Rate</span>
                <PiggyBank className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
                {formatINR(netSavings)}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                {savingsRate}% retained this month
              </span>
            </div>
          </div>

          {/* 2. Spending Trends Chart with Interactive Timeframe Switcher */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 mb-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/50">
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  Income vs. Expenses Cash Flow Trend
                </span>
                <span className="text-[11px] text-slate-400">
                  Interactive Recharts area projection in ₹ INR
                </span>
              </div>

              {/* Timeframe selector controls */}
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                  {['3M', '6M', '1Y'].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer ${
                        timeframe === tf
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 ml-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Inflow
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Outflow
                  </span>
                </div>
              </div>
            </div>

            <div className="h-60 sm:h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeframeData[timeframe]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatINR(value), '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#inflowGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#F43F5E"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#outflowGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3 & 4. Budget Progress and Recent Transactions Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. Budget Progress with Interactive Category Click */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Category Budget Progress</h3>
                  <span className="text-[10px] text-slate-400">Click a card to inspect remaining allowance</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400">October Ceiling</span>
              </div>

              <div className="space-y-3">
                {categories.map((cat) => {
                  const percent = Math.round((cat.amount / cat.budget) * 100)
                  const remaining = cat.budget - cat.amount
                  const isSelected = selectedCategory === cat.id
                  const Icon = cat.icon
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-emerald-500/70 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${cat.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white block">{cat.name}</span>
                            <span className="text-[10px] text-slate-400">
                              Cap: {formatINR(cat.budget)}
                              {isSelected && ` &bull; Left: ${formatINR(Math.max(0, remaining))}`}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-white">{formatINR(cat.amount)}</span>
                          <span
                            className={`block text-[10px] font-semibold ${
                              percent > 90 ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {percent}% used
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            percent > 90 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 4. Recent Transactions with Live Feed Updates */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Recent Transactions</h3>
                    <span className="text-[10px] text-slate-400">Updated in real-time</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">{transactions.length} recorded</span>
                </div>

                <div className="divide-y divide-slate-800/70">
                  {transactions.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      className={`py-2.5 flex items-center justify-between gap-3 transition-all duration-300 ${
                        t.isNew ? 'bg-emerald-500/10 px-2 rounded-lg' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {t.type === 'income' ? '+' : '-'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{t.title}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <span className="inline-flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" />
                              {t.category}
                            </span>
                            <span>&bull;</span>
                            <span>{t.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-bold ${
                            t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {t.type === 'income' ? `+${formatINR(t.amount)}` : formatINR(t.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                <span>Automated ledger reconciliation</span>
                <span className="text-emerald-400 font-medium">Synced with Clerk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


