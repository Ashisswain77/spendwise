import { useState, useEffect, useMemo } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useUser } from '@clerk/react'
import { formatINR } from '../../utils/currency'
import { loadStoredBudgets, saveStoredBudgets } from '../../services/transactionService'
import BudgetModal from './BudgetModal'

export default function BudgetTracker({ transactions = [] }) {
  const { user } = useUser()
  const userId = user?.id || null

  const [prevUserId, setPrevUserId] = useState(userId)
  const [budgets, setBudgets] = useState(() => loadStoredBudgets(userId))
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  // Sync with user storage if user changes
  if (userId !== prevUserId) {
    setPrevUserId(userId)
    setBudgets(loadStoredBudgets(userId))
  }

  // Save budgets whenever updated
  useEffect(() => {
    saveStoredBudgets(userId, budgets)
  }, [budgets, userId])

  // Calculate expenses by category
  const expenseByCategory = useMemo(() => {
    const map = {}
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        const cat = t.category || 'Other'
        map[cat] = (map[cat] || 0) + t.amount
      }
    })
    return map
  }, [transactions])

  const totalAllExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  // Summary Metrics
  const { totalBudgetLimit, totalSpentInBudgets, remainingBudget } = useMemo(() => {
    if (budgets.length === 0) {
      return { totalBudgetLimit: 0, totalSpentInBudgets: 0, remainingBudget: 0 }
    }

    let limitSum = 0
    let spentSum = 0

    budgets.forEach((b) => {
      limitSum += b.limit
      if (b.category === 'Overall') {
        spentSum += totalAllExpenses
      } else {
        spentSum += expenseByCategory[b.category] || 0
      }
    })

    return {
      totalBudgetLimit: limitSum,
      totalSpentInBudgets: spentSum,
      remainingBudget: Math.max(0, limitSum - spentSum),
    }
  }, [budgets, expenseByCategory, totalAllExpenses])

  const handleOpenCreateModal = () => {
    setEditingBudget(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (b) => {
    setEditingBudget(b)
    setModalOpen(true)
  }

  const handleSaveBudget = (savedBudget) => {
    if (editingBudget) {
      setBudgets((prev) =>
        prev.map((b) => (b.id === savedBudget.id ? savedBudget : b))
      )
    } else {
      setBudgets((prev) => [savedBudget, ...prev])
    }
    setModalOpen(false)
    setEditingBudget(null)
  }

  const handleDeleteBudget = (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* =========================================================================
          1. HEADER (Title, Subtitle, + Add Budget Button)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Budgets
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Track your spending limits
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8a4f1e] hover:bg-[#784318] text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-98 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* =========================================================================
          2. THREE SUMMARY CARDS (Total Budget, Total Spent, Remaining)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Budget Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
            Total Budget
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatINR(totalBudgetLimit)}
          </p>
        </div>

        {/* Total Spent Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
            Total Spent
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatINR(totalSpentInBudgets)}
          </p>
        </div>

        {/* Remaining Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
            Remaining
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatINR(remainingBudget)}
          </p>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN CONTENT: EMPTY STATE OR ACTIVE BUDGETS LIST
         ========================================================================= */}
      {budgets.length === 0 ? (
        /* Empty State matching Screenshot 1 exactly */
        <div className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#0d0d0f] p-12 sm:p-16 text-center shadow-xs">
          {/* Concentric Bullseye / Target Icon */}
          <div className="w-12 h-12 rounded-full bg-[#f7efe6] dark:bg-[#2c2016] text-[#8a4f1e] dark:text-[#d48b55] flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No budgets yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 mb-5">
            Set spending limits to track your money
          </p>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8a4f1e] hover:bg-[#784318] text-white font-bold text-xs shadow-xs transition active:scale-98 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Budget</span>
          </button>
        </div>
      ) : (
        /* Populated Budgets Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const spent =
              b.category === 'Overall'
                ? totalAllExpenses
                : expenseByCategory[b.category] || 0
            const pct = Math.min(100, Math.round((spent / b.limit) * 100))
            const remaining = b.limit - spent
            const isOver = spent > b.limit

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition space-y-4"
              >
                {/* Budget Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{b.category === 'Overall' ? 'All categories (overall)' : b.category}</span>
                    </h4>
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[10px] font-semibold text-slate-500 dark:text-zinc-400 mt-1">
                      {b.period || 'Monthly'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(b)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
                      title="Edit budget"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBudget(b.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-400 dark:hover:text-rose-400 dark:hover:bg-zinc-800 transition cursor-pointer"
                      title="Delete budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : pct >= 80
                          ? 'bg-amber-500'
                          : 'bg-[#8a4f1e]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    <span>{pct}% spent</span>
                    <span className={isOver ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>
                      {isOver
                        ? `${formatINR(spent - b.limit)} over`
                        : `${formatINR(remaining)} left`}
                    </span>
                  </div>
                </div>

                {/* Amount details */}
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-zinc-400">Spent: <strong className="text-slate-800 dark:text-zinc-200">{formatINR(spent)}</strong></span>
                  <span className="text-slate-500 dark:text-zinc-400">Limit: <strong className="text-slate-900 dark:text-white">{formatINR(b.limit)}</strong></span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* =========================================================================
          4. NEW / EDIT BUDGET MODAL POPUP
         ========================================================================= */}
      <BudgetModal
        isOpen={modalOpen}
        initialBudget={editingBudget}
        onClose={() => {
          setModalOpen(false)
          setEditingBudget(null)
        }}
        onSave={handleSaveBudget}
      />
    </div>
  )
}
