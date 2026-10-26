import { useState, useMemo } from 'react'
import {
  TrendingUp,
  Trash2,
  Building,
  Coffee,
  ShoppingBag,
  CreditCard,
  Scale,
} from 'lucide-react'
import { formatINR } from '../../utils/currency'

export default function TransactionList({
  transactions,
  onDeleteTransaction,
  onBackToDashboard,
}) {
  const [historySearch, setHistorySearch] = useState('')
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all')

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Salary':
      case 'Housing & Rent':
        return <Building className="w-4 h-4" />
      case 'Food & Dining':
        return <Coffee className="w-4 h-4" />
      case 'Shopping':
        return <ShoppingBag className="w-4 h-4" />
      case 'Investments':
        return <TrendingUp className="w-4 h-4" />
      case 'Utilities & Bills':
        return <CreditCard className="w-4 h-4" />
      default:
        return <Scale className="w-4 h-4" />
    }
  }

  const filteredHistory = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(historySearch.toLowerCase()) ||
        t.category.toLowerCase().includes(historySearch.toLowerCase())
      const matchType = historyTypeFilter === 'all' || t.type === historyTypeFilter
      return matchSearch && matchType
    })
  }, [transactions, historySearch, historyTypeFilter])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs animate-fadeIn space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Transaction History</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredHistory.length} total recorded operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search merchant, category..."
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden"
          />
          <select
            value={historyTypeFilter}
            onChange={(e) => setHistoryTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto pr-1">
        {filteredHistory.map((t) => (
          <div key={t.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  t.type === 'income'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {getCategoryIcon(t.category)}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.category} &bull; {t.date} &bull; {t.mode || 'UPI'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-bold text-sm ${
                  t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {t.type === 'income' ? `+ ${formatINR(t.amount)}` : `- ${formatINR(t.amount)}`}
              </span>
              <button
                type="button"
                onClick={() => onDeleteTransaction(t.id)}
                className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition cursor-pointer"
                title="Delete transaction"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {onBackToDashboard && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  )
}
