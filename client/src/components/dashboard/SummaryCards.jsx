import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatINR } from '../../utils/currency'

export default function SummaryCards({
  remaining,
  totalIncome,
  totalExpenses,
  selectedDate,
  dateRange,
}) {
  const periodLabel = selectedDate ? 'on this date' : dateRange.replace('_', ' ')

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Net Cash Flow / Remaining */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Remaining Cash Flow
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              remaining >= 0
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
            }`}
          >
            {remaining >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {remaining >= 0 ? 'Surplus' : 'Deficit'}
          </span>
        </div>
        <p
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            remaining >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {formatINR(remaining)}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Net income minus expenses {periodLabel}
        </p>
      </div>

      {/* 2. Total Inflow / Income */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-green-300 dark:hover:border-green-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Income
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Inflow
          </span>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {formatINR(totalIncome)}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Salary, freelance &amp; credits {periodLabel}
        </p>
      </div>

      {/* 3. Total Outflow / Expenses */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Expenses
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
            <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Outflow
          </span>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {formatINR(totalExpenses)}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Bills, EMIs, food &amp; lifestyle {periodLabel}
        </p>
      </div>
    </div>
  )
}
