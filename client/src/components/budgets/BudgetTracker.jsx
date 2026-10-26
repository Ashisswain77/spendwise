import { DEFAULT_BUDGETS } from '../../services/transactionService'
import { formatINR } from '../../utils/currency'

export default function BudgetTracker({
  transactions,
  onBackToDashboard,
}) {
  // Aggregate expenses by category
  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = t.category || 'Other'
      acc[cat] = (acc[cat] || 0) + t.amount
      return acc
    }, {})

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs animate-fadeIn space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Category Budgets</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track spend velocity against monthly target caps
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {DEFAULT_BUDGETS.map((b) => {
          const spent = expenseByCategory[b.category] || 0
          const pct = Math.min(100, Math.round((spent / b.limit) * 100))
          const isOver = spent > b.limit

          return (
            <div key={b.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{b.category}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  <span className={`font-bold ${isOver ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {formatINR(spent)}
                  </span>{' '}
                  / {formatINR(b.limit)} ({pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-rose-500' : b.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
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
