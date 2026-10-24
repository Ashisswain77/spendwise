import { useState } from 'react'
import { useUser, UserButton } from '@clerk/react'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ShieldCheck,
  PlusCircle,
  Tag,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import { formatINR } from '../utils/currency'

const initialUserTransactions = [
  { id: 1, title: 'October Salary Inflow', category: 'Salary', amount: 85000, date: '01 Oct', type: 'income', mode: 'Bank Transfer' },
  { id: 2, title: 'Apartment Rent Payment', category: 'Housing', amount: -18000, date: '03 Oct', type: 'expense', mode: 'Net Banking' },
  { id: 3, title: 'Nature Basket Groceries', category: 'Groceries', amount: -3420, date: '12 Oct', type: 'expense', mode: 'UPI' },
  { id: 4, title: 'Nifty 50 Index Fund SIP', category: 'Investments', amount: -12500, date: '15 Oct', type: 'expense', mode: 'AutoPay' },
  { id: 5, title: 'Electricity & Gas Utility', category: 'Bills', amount: -2150, date: '21 Oct', type: 'expense', mode: 'UPI' },
]

export default function AuthenticatedDashboard() {
  const { user } = useUser()
  const [transactions, setTransactions] = useState(initialUserTransactions)
  const [balance, setBalance] = useState(145280)
  const [toast, setToast] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newCategory, setNewCategory] = useState('Food & Dining')

  const handleAddTransaction = (e) => {
    e.preventDefault()
    const numericAmount = parseFloat(newAmount)
    if (!newTitle.trim() || isNaN(numericAmount) || numericAmount <= 0) return

    const newTx = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      amount: -numericAmount,
      date: 'Today',
      type: 'expense',
      mode: 'UPI',
    }

    setTransactions([newTx, ...transactions])
    setBalance((prev) => prev - numericAmount)
    setNewTitle('')
    setNewAmount('')
    setShowAddModal(false)
    setToast(`Added ${formatINR(numericAmount)} expense successfully!`)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authenticated with Clerk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center flex-wrap gap-2">
            <span>Welcome back,</span>
            <span className="text-emerald-700">{user?.firstName || 'Valued Spender'}</span>!
          </h2>

          <p className="text-slate-600 text-sm mt-1">
            Active Account: <span className="font-semibold text-slate-800">{user?.primaryEmailAddress?.emailAddress}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm shadow-emerald-600/30 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
          <div className="p-1 rounded-xl bg-slate-50 border border-slate-200">
            <UserButton />
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {toast}
          </span>
          <button type="button" onClick={() => setToast('')} className="text-emerald-100 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Balance</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {formatINR(balance)}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">All accounts reconciled</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Monthly Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {formatINR(85000)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Salary + freelance inflows</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Monthly Outflow</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {formatINR(36070)}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">₹13,930 remaining in budget</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Emergency Fund Goal</span>
            <PiggyBank className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {formatINR(112500)}
          </p>
          <p className="text-xs text-slate-500 mt-1">75% of ₹1,50,000 target</p>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Active Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time transactions recorded under your Clerk session.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg text-slate-600">
            {transactions.length} Entries
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <div key={t.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 rounded-xl px-2 transition">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold ${
                    t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Tag className="w-3 h-3 text-emerald-600" />
                      {t.category}
                    </span>
                    <span>&bull;</span>
                    <span>{t.mode}</span>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t.date}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`text-base font-bold ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                }`}
              >
                {t.type === 'income' ? `+${formatINR(t.amount)}` : formatINR(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Record New Transaction</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-light leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Merchant
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Zomato, Rent, Metro Smart Card"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Amount in ₹ (INR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g., 450"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 focus:outline-hidden bg-white"
                >
                  <option value="Food & Dining">Food &amp; Dining</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Housing">Housing &amp; Rent</option>
                  <option value="Utilities">Utilities &amp; Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Investments">Investments &amp; SIPs</option>
                  <option value="Travel">Travel &amp; Commute</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
