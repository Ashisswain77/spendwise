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
  ArrowUpRight,
  PlusCircle,
  Tag,
  CreditCard,
  Building,
  ShoppingBag,
  Coffee,
  CheckCircle,
} from 'lucide-react'
import { formatINR } from '../utils/currency'

const initialMonthlyData = [
  { month: 'Nov', income: 72000, expenses: 34500, savings: 37500 },
  { month: 'Dec', income: 75000, expenses: 41200, savings: 33800 },
  { month: 'Jan', income: 80000, expenses: 36800, savings: 43200 },
  { month: 'Feb', income: 82000, expenses: 35100, savings: 46900 },
  { month: 'Mar', income: 85000, expenses: 38450, savings: 46550 },
  { month: 'Apr (Est)', income: 88000, expenses: 37000, savings: 51000 },
]

const initialCategories = [
  { name: 'Rent & Housing', amount: 16000, budget: 18000, color: 'bg-emerald-500', icon: Building },
  { name: 'Groceries & Dining', amount: 9400, budget: 12000, color: 'bg-teal-500', icon: Coffee },
  { name: 'Shopping & Leisure', amount: 5250, budget: 8000, color: 'bg-indigo-500', icon: ShoppingBag },
  { name: 'Utilities & Bills', amount: 4100, budget: 5000, color: 'bg-amber-500', icon: CreditCard },
  { name: 'SIP & Investments', amount: 15000, budget: 15000, color: 'bg-emerald-600', icon: PiggyBank },
]

const initialTransactions = [
  { id: 1, title: 'Swiggy Gourmet Order', category: 'Food & Dining', amount: -640, date: 'Today, 2:30 PM', type: 'expense', mode: 'UPI' },
  { id: 2, title: 'Client Milestone Payout', category: 'Freelance Inflow', amount: 24500, date: 'Yesterday', type: 'income', mode: 'IMPS' },
  { id: 3, title: 'JioFiber Broadband Bill', category: 'Utilities', amount: -1179, date: '22 Oct', type: 'expense', mode: 'AutoPay' },
  { id: 4, title: 'Monthly Mutual Fund SIP', category: 'Investment', amount: -10000, date: '20 Oct', type: 'expense', mode: 'UPI' },
  { id: 5, title: 'Amazon Electronics Purchase', category: 'Shopping', amount: -2899, date: '18 Oct', type: 'expense', mode: 'Credit Card' },
]

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('chart') // 'chart' | 'categories' | 'ledger'
  const [transactions, setTransactions] = useState(initialTransactions)
  const [balance, setBalance] = useState(145280)
  const [toastMessage, setToastMessage] = useState('')

  // Interactive transaction simulator
  const handleQuickAdd = () => {
    const mockExpense = {
      id: Date.now(),
      title: 'Coffee & Snacks at Blue Tokai',
      category: 'Food & Dining',
      amount: -320,
      date: 'Just now',
      type: 'expense',
      mode: 'UPI',
    }
    setTransactions([mockExpense, ...transactions])
    setBalance((prev) => prev - 320)
    setToastMessage('₹320 coffee expense added to preview!')
    setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <section id="demo" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-teal-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Platform Demo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Financial clarity you can feel.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3">
            Preview the live SpendWise dashboard interface below. Click tabs to inspect cash flows, category budgets, and transaction ledgers.
          </p>
        </div>

        {/* Dashboard Shell Frame */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-xl">
          {/* Top Live Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-7">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Total Net Balance</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
                {formatINR(balance)}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                +14.2% MoM Inflow
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Monthly Inflow</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
                {formatINR(85000)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Salary &amp; Freelance</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Monthly Outflow</span>
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
                {formatINR(38450)}
              </p>
              <span className="text-[11px] text-emerald-400 mt-1 block">76.9% of ₹50K budget</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Net Savings Rate</span>
                <PiggyBank className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
                {formatINR(46550)}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                54.7% retained this month
              </span>
            </div>
          </div>

          {/* Interactive Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('chart')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'chart'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cash Flow Trends
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                INR Category Budgets
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'ledger'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Recent Transactions ({transactions.length})
              </button>
            </div>

            {/* Quick Add Demo Button */}
            <div className="flex items-center gap-3">
              {toastMessage && (
                <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1 animate-fadeIn">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {toastMessage}
                </span>
              )}
              <button
                type="button"
                onClick={handleQuickAdd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Simulate Expense (+ ₹320)
              </button>
            </div>
          </div>

          {/* View 1: Recharts AreaChart (Cash Flow Trends) */}
          {activeTab === 'chart' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Inflow vs. Outflow Trends (Last 6 Months in ₹ INR)</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    Income
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    Expenses
                  </span>
                </div>
              </div>

              <div className="h-72 sm:h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={initialMonthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
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
                      fill="url(#incomeGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#expenseGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* View 2: Category Budgets */}
          {activeTab === 'categories' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialCategories.map((cat) => {
                  const percent = Math.round((cat.amount / cat.budget) * 100)
                  const Icon = cat.icon
                  return (
                    <div
                      key={cat.name}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl ${cat.color} bg-opacity-20 text-emerald-400`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
                            <span className="text-[11px] text-slate-400">Budget: {formatINR(cat.budget)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white">{formatINR(cat.amount)}</span>
                          <span className={`block text-[11px] font-semibold ${percent > 90 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {percent}% used
                          </span>
                        </div>
                      </div>
                      {/* Visual progress bar */}
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-3">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
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
          )}

          {/* View 3: Recent Transactions Ledger */}
          {activeTab === 'ledger' && (
            <div className="divide-y divide-slate-800/80 animate-fadeIn">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="py-3 sm:py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl text-xs font-bold ${
                        t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {t.category}
                        </span>
                        <span>&bull;</span>
                        <span>{t.mode}</span>
                        <span>&bull;</span>
                        <span>{t.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {t.type === 'income' ? `+${formatINR(t.amount)}` : formatINR(t.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
