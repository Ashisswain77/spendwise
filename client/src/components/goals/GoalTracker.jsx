import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Flag, Pencil, Trash2, Calendar, CheckCircle2, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react'
import { useUser } from '@clerk/react'
import toast from 'react-hot-toast'
import { formatINR } from '../../utils/currency'
import { loadStoredGoals, saveStoredGoals } from '../../services/transactionService'
import GoalModal from './GoalModal'
import GoalDepositModal from './GoalDepositModal'

export default function GoalTracker() {
  const { user } = useUser()
  const userId = user?.id || null

  const [prevUserId, setPrevUserId] = useState(userId)
  const [goals, setGoals] = useState(() => loadStoredGoals(userId))
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [depositGoal, setDepositGoal] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'in_progress' | 'completed'
  const [deletingGoalId, setDeletingGoalId] = useState(null)

  // Sync with user storage if user changes
  if (userId !== prevUserId) {
    setPrevUserId(userId)
    setGoals(loadStoredGoals(userId))
  }

  // Save goals whenever updated
  useEffect(() => {
    saveStoredGoals(userId, goals)
  }, [goals, userId])

  // Lock body scroll and handle Escape key for delete confirmation
  useEffect(() => {
    if (!deletingGoalId) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDeletingGoalId(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [deletingGoalId])

  const handleOpenCreateModal = () => {
    setEditingGoal(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (goal) => {
    setEditingGoal(goal)
    setModalOpen(true)
  }

  const handleSaveGoal = (goalData) => {
    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) => (g.id === goalData.id ? { ...g, ...goalData } : g))
      )
      toast.success(`Savings goal "${goalData.name}" updated!`)
    } else {
      setGoals((prev) => [goalData, ...prev])
      toast.success(`Savings goal "${goalData.name}" created!`)
    }
    setModalOpen(false)
    setEditingGoal(null)
  }

  const handleDeleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    setDeletingGoalId(null)
    toast.success('Savings goal deleted.')
  }

  const handleDepositFunds = (goalId, amount) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newSaved = Number(g.amountSaved || 0) + Number(amount)
          const target = Number(g.targetAmount || 0)
          if (newSaved >= target && Number(g.amountSaved || 0) < target) {
            toast.success(`🎉 Congratulations! You reached your goal for "${g.name}"!`, {
              duration: 5000,
            })
          } else {
            toast.success(`Deposited ₹${Number(amount).toLocaleString('en-IN')} to "${g.name}"!`)
          }
          return {
            ...g,
            amountSaved: newSaved,
            updatedAt: new Date().toISOString(),
          }
        }
        return g
      })
    )
  }

  // Summary Metrics
  const { totalTarget, totalSaved, totalRemaining, completedCount } = useMemo(() => {
    let targetSum = 0
    let savedSum = 0
    let compCount = 0

    goals.forEach((g) => {
      targetSum += Number(g.targetAmount || 0)
      savedSum += Number(g.amountSaved || 0)
      if (Number(g.amountSaved || 0) >= Number(g.targetAmount || 0)) {
        compCount += 1
      }
    })

    return {
      totalTarget: targetSum,
      totalSaved: savedSum,
      totalRemaining: Math.max(0, targetSum - savedSum),
      completedCount: compCount,
    }
  }, [goals])

  const overallPercent =
    totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    if (filter === 'completed') {
      return goals.filter((g) => Number(g.amountSaved) >= Number(g.targetAmount))
    }
    if (filter === 'in_progress') {
      return goals.filter((g) => Number(g.amountSaved) < Number(g.targetAmount))
    }
    return goals
  }, [goals, filter])

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // Days remaining helper
  const getDaysRemaining = (dateStr) => {
    if (!dateStr) return null
    try {
      const target = new Date(dateStr)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const diffTime = target - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays < 0) return { text: 'Overdue', color: 'text-rose-500' }
      if (diffDays === 0) return { text: 'Due today', color: 'text-amber-500' }
      if (diffDays === 1) return { text: '1 day left', color: 'text-amber-500' }
      return { text: `${diffDays} days left`, color: 'text-slate-500 dark:text-slate-400' }
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header matching Reference Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Goals
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track your savings goals
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#8a4f1e] hover:bg-[#734017] transition-colors cursor-pointer shadow-sm active:scale-[0.99] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Goal
        </button>
      </div>

      {/* Empty State matching Reference Screenshot 1 */}
      {goals.length === 0 ? (
        <div className="border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black rounded-2xl py-16 sm:py-20 px-6 text-center shadow-xs">
          <div className="max-w-md mx-auto">
            <Flag className="w-12 h-12 text-[#9a806d] dark:text-[#7d695b] stroke-[1.5] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
              No goals yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Set a financial goal to track your progress
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#8a4f1e] hover:bg-[#734017] transition-colors cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Goal
            </button>
          </div>
        </div>
      ) : (
        /* Goals View with Metrics, Filters and Cards */
        <div className="space-y-6">
          {/* Summary Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-black rounded-xl p-4 border border-slate-200/90 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Target</span>
                <span className="p-1.5 rounded-lg bg-[#f6eee5] dark:bg-[#2c2016] text-[#8a4f1e] dark:text-[#d6986c]">
                  <Flag className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                {formatINR(totalTarget)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across {goals.length} target{goals.length === 1 ? '' : 's'}</p>
            </div>

            <div className="bg-white dark:bg-black rounded-xl p-4 border border-slate-200/90 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Saved</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {formatINR(totalSaved)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accumulated savings</p>
            </div>

            <div className="bg-white dark:bg-black rounded-xl p-4 border border-slate-200/90 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Remaining</span>
                <span className="p-1.5 rounded-lg bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-stone-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                {formatINR(totalRemaining)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">To reach all goals</p>
            </div>

            <div className="bg-white dark:bg-black rounded-xl p-4 border border-slate-200/90 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall Progress</span>
                <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{overallPercent}%</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({completedCount}/{goals.length} achieved)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#8a4f1e] h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#8a4f1e] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
                }`}
              >
                All ({goals.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  filter === 'in_progress'
                    ? 'bg-[#8a4f1e] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
                }`}
              >
                In Progress ({goals.length - completedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  filter === 'completed'
                    ? 'bg-[#8a4f1e] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredGoals.map((goal) => {
              const target = Number(goal.targetAmount || 0)
              const saved = Number(goal.amountSaved || 0)
              const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0
              const isCompleted = saved >= target
              const remaining = Math.max(0, target - saved)
              const daysInfo = getDaysRemaining(goal.targetDate)

              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-black rounded-2xl border border-slate-200/90 dark:border-neutral-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Badge + Goal Name + Action buttons */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#f6eee5] dark:bg-[#2c2016] text-[#8a4f1e] dark:text-[#d6986c] flex items-center justify-center shrink-0">
                          <Flag className="w-5 h-5 stroke-[1.75]" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                            {goal.name}
                          </h4>
                          {goal.targetDate ? (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              <span>{formatDate(goal.targetDate)}</span>
                              {daysInfo && (
                                <span className={`text-[11px] font-medium ${daysInfo.color}`}>
                                  • {daysInfo.text}
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">No target date</p>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(goal)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition cursor-pointer"
                          title="Edit goal"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingGoalId(goal.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                          title="Delete goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Percent */}
                    <div className="space-y-2 my-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          Progress
                        </span>
                        <span
                          className={`font-bold ${
                            isCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-[#8a4f1e] dark:text-[#d6986c]'
                          }`}
                        >
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-[#8a4f1e]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Amounts breakdown */}
                    <div className="bg-stone-50/70 dark:bg-neutral-900/60 rounded-xl p-3 border border-stone-100 dark:border-neutral-800/80 space-y-1.5 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-500 dark:text-slate-400">Saved:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatINR(saved)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-500 dark:text-slate-400">Target:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {formatINR(target)}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-200/60 dark:border-neutral-800 flex justify-between items-baseline">
                        <span className="text-slate-500 dark:text-slate-400">
                          {isCompleted ? 'Status:' : 'Remaining:'}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Goal Reached!
                          </span>
                        ) : (
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {formatINR(remaining)} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Deposit / Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800/80">
                    <button
                      type="button"
                      onClick={() => setDepositGoal(goal)}
                      className="w-full py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Savings to Goal
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Goal Modal (New / Edit) */}
      <GoalModal
        isOpen={modalOpen}
        initialGoal={editingGoal}
        onClose={() => {
          setModalOpen(false)
          setEditingGoal(null)
        }}
        onSave={handleSaveGoal}
      />

      {/* Goal Deposit Modal (Add Funds) */}
      <GoalDepositModal
        isOpen={Boolean(depositGoal)}
        goal={depositGoal}
        onClose={() => setDepositGoal(null)}
        onDeposit={handleDepositFunds}
      />

      {/* Delete Confirmation Modal (Portaled to document.body to cover full screen) */}
      {deletingGoalId && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setDeletingGoalId(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-white dark:bg-[#121212] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-neutral-800 animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white text-center">
                Delete Savings Goal?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1.5 mb-5">
                Are you sure you want to delete this goal? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingGoalId(null)}
                  className="flex-1 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteGoal(deletingGoalId)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
