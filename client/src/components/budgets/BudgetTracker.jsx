import { useState, useEffect, useMemo, useCallback } from 'react'
import { Plus, Pencil, Trash2, RotateCw } from 'lucide-react'
import { useUser, useAuth } from '@clerk/react'
import toast from 'react-hot-toast'
import { formatINR } from '../../utils/currency'
import {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../../services/budgetService'
import BudgetModal from './BudgetModal'

export default function BudgetTracker({ transactions = [] }) {
  const { user } = useUser()
  const { isSignedIn } = useAuth()
  const userId = user?.id || null

  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  // Current period in YYYY-MM
  const currentPeriod = useMemo(() => new Date().toISOString().slice(0, 7), [])

  // Fetch budgets from backend
  const loadBudgets = useCallback(async (silent = false) => {
    if (!isSignedIn) {
      setBudgets([])
      setLoading(false)
      return
    }

    if (!silent) setLoading(true)
    setError(null)

    try {
      const data = await fetchBudgets(currentPeriod)
      setBudgets(data)
    } catch (err) {
      console.error('Failed to load budgets from backend:', err)
      setError(err?.response?.data?.message || err.message || 'Failed to load budgets')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [isSignedIn, currentPeriod])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])

  // Current month client-side fallback calculations
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const expenseByCategory = useMemo(() => {
    const map = {}
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        const d = new Date(t.date)
        if (!isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          const cat = t.category || 'Other'
          map[cat] = (map[cat] || 0) + (t.amount || 0)
        }
      }
    })
    return map
  }, [transactions, currentYear, currentMonth])

  const totalMonthlyExpenses = useMemo(() => {
    return transactions
      .filter((t) => {
        if (t.type !== 'expense') return false
        const d = new Date(t.date)
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonth
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [transactions, currentYear, currentMonth])

  // Summary Metrics (respecting backend Overall and category aggregations)
  const { totalBudgetLimit, totalSpentInBudgets, remainingBudget } = useMemo(() => {
    if (budgets.length === 0) {
      return { totalBudgetLimit: 0, totalSpentInBudgets: 0, remainingBudget: 0 }
    }

    let limitSum = 0
    let categorySpentSum = 0
    let hasOverallBudget = false

    budgets.forEach((b) => {
      limitSum += b.limit || 0
      if (b.category === 'Overall') {
        hasOverallBudget = true
      } else {
        const spent = b.spent !== undefined ? b.spent : (expenseByCategory[b.category] || 0)
        categorySpentSum += spent
      }
    })

    const overallBudget = budgets.find((b) => b.category === 'Overall')
    const overallSpent = overallBudget?.spent !== undefined ? overallBudget.spent : totalMonthlyExpenses

    const spentSum = hasOverallBudget
      ? Math.max(overallSpent, categorySpentSum)
      : categorySpentSum

    return {
      totalBudgetLimit: limitSum,
      totalSpentInBudgets: spentSum,
      remainingBudget: Math.max(0, limitSum - spentSum),
    }
  }, [budgets, expenseByCategory, totalMonthlyExpenses])

  const handleOpenCreateModal = () => {
    setEditingBudget(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (b) => {
    setEditingBudget(b)
    setModalOpen(true)
  }

  const handleSaveBudget = async (savedBudget) => {
    // Validate duplicate prevention locally before sending
    const isDuplicate = budgets.some(
      (b) =>
        (b.id || b._id) !== (savedBudget.id || savedBudget._id) &&
        b.category.toLowerCase() === savedBudget.category.toLowerCase() &&
        (b.period || currentPeriod) === (savedBudget.period || currentPeriod)
    )
    if (isDuplicate) {
      const displayCat = savedBudget.category === 'Overall' ? 'All categories (overall)' : savedBudget.category
      toast.error(`A budget for "${displayCat}" in period ${savedBudget.period || currentPeriod} already exists.`)
      return
    }

    try {
      if (editingBudget) {
        const targetId = editingBudget.id || editingBudget._id
        const updated = await updateBudget(targetId, savedBudget)
        setBudgets((prev) =>
          prev.map((b) => ((b.id || b._id) === targetId ? updated : b))
        )
        toast.success(`Budget updated for ${savedBudget.category}!`)
      } else {
        const created = await createBudget({
          ...savedBudget,
          period: savedBudget.period || currentPeriod,
        })
        setBudgets((prev) => [created, ...prev])
        toast.success(`Budget created for ${savedBudget.category}!`)
      }
      setModalOpen(false)
      setEditingBudget(null)
    } catch (err) {
      console.error('Failed to persist budget:', err)
    }
  }

  const handleDeleteBudget = async (id) => {
    const backupBudgets = [...budgets]
    // Optimistic removal
    setBudgets((prev) => prev.filter((b) => (b.id || b._id) !== id))

    try {
      await deleteBudget(id)
      toast.success('Budget deleted successfully.')
    } catch (err) {
      // Rollback
      setBudgets(backupBudgets)
      console.error('Failed to delete budget:', err)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Budget Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Track category spending against monthly financial limits
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadBudgets(true)}
            className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0d0d0f] transition cursor-pointer"
            title="Refresh budgets"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8a4f1e] hover:bg-[#784318] text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Budget</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Budget Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
            Total Budget
          </p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {formatINR(totalBudgetLimit)}
          </p>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Across {budgets.length} active {budgets.length === 1 ? 'limit' : 'limits'}
          </p>
        </div>

        {/* Total Spent Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
            Total Spent
          </p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {formatINR(totalSpentInBudgets)}
          </p>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Current month spending
          </p>
        </div>

        {/* Remaining Budget Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">
            Remaining Budget
          </p>
          <p
            className={`text-2xl sm:text-3xl font-black mt-2 ${
              remainingBudget > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {formatINR(remainingBudget)}
          </p>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Available until end of month
          </p>
        </div>
      </div>

      {/* MAIN CONTENT: SKELETON / EMPTY STATE / ACTIVE BUDGETS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-4 animate-pulse"
            >
              <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-1/2"></div>
              <div className="h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full w-full"></div>
              <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-[#0d0d0f] p-12 sm:p-16 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f7efe6] dark:bg-[#2c2016] text-[#8a4f1e] dark:text-[#d48b55] flex items-center justify-center">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
              b.spent !== undefined
                ? b.spent
                : b.category === 'Overall'
                ? totalMonthlyExpenses
                : expenseByCategory[b.category] || 0

            const limitVal = b.limit || 0
            const pct =
              b.percentageUsed !== undefined
                ? b.percentageUsed
                : limitVal > 0
                ? Math.min(100, Math.round((spent / limitVal) * 100))
                : 0

            const remainingVal =
              b.remaining !== undefined ? b.remaining : Math.max(0, limitVal - spent)
            const isOver = b.isOverBudget !== undefined ? b.isOverBudget : spent > limitVal

            const bId = b.id || b._id

            return (
              <div
                key={bId}
                className="p-5 rounded-2xl bg-white dark:bg-[#0d0d0f] border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition space-y-4"
              >
                {/* Budget Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{b.category === 'Overall' ? 'All categories (overall)' : b.category}</span>
                    </h4>
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[10px] font-semibold text-slate-500 dark:text-zinc-400 mt-1">
                      {b.period || currentPeriod}
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
                      onClick={() => handleDeleteBudget(bId)}
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
                        ? `${formatINR(spent - limitVal)} over`
                        : `${formatINR(remainingVal)} left`}
                    </span>
                  </div>
                </div>

                {/* Amount details */}
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-zinc-400">
                    Spent: <strong className="text-slate-800 dark:text-zinc-200">{formatINR(spent)}</strong>
                  </span>
                  <span className="text-slate-500 dark:text-zinc-400">
                    Limit: <strong className="text-slate-900 dark:text-white">{formatINR(limitVal)}</strong>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <BudgetModal
        isOpen={modalOpen}
        initialBudget={editingBudget}
        existingBudgets={budgets}
        onClose={() => {
          setModalOpen(false)
          setEditingBudget(null)
        }}
        onSave={handleSaveBudget}
      />
    </div>
  )
}
