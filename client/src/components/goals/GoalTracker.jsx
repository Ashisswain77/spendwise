import { useState, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Flag, Pencil, Trash2, Calendar, CheckCircle2, TrendingUp, Sparkles, ArrowUpRight, RotateCw } from 'lucide-react'
import { useAuth } from '@clerk/react'
import toast from 'react-hot-toast'
import { formatINR } from '../../utils/currency'
import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addGoalContribution,
} from '../../services/goalService'
import GoalModal from './GoalModal'
import GoalDepositModal from './GoalDepositModal'

export default function GoalTracker() {
  const { isSignedIn } = useAuth()

  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [depositGoal, setDepositGoal] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'in_progress' | 'completed'
  const [deletingGoalId, setDeletingGoalId] = useState(null)

  // Fetch goals from backend API
  const loadGoals = useCallback(async (silent = false) => {
    if (!isSignedIn) {
      setGoals([])
      setLoading(false)
      return
    }

    if (!silent) setLoading(true)
    setError(null)

    try {
      const data = await fetchGoals('all')
      setGoals(data)
    } catch (err) {
      console.error('Failed to load goals from backend:', err)
      setError(err?.response?.data?.message || err.message || 'Failed to load savings goals')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [isSignedIn])

  useEffect(() => {
  let ignore = false

  const run = async () => {
    if (!isSignedIn) {
      if (!ignore) {
        setGoals([])
        setLoading(false)
      }
      return
    }

    try {
      const data = await fetchGoals('all')
      if (!ignore) {
        setGoals(data)
        setError(null)
      }
    } catch (err) {
      if (!ignore) {
        console.error('Failed to load goals from backend:', err)
        setError(err?.response?.data?.message || err.message || 'Failed to load savings goals')
      }
    } finally {
      if (!ignore) setLoading(false)
    }
  }

  run()
  return () => { ignore = true }
}, [isSignedIn])

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

const handleSaveGoal = async (goalData) => {
  try {
    if (editingGoal) {
      const targetId = editingGoal.id || editingGoal._id
      const updated = await updateGoal(targetId, goalData)
      setGoals((prev) =>
        prev.map((g) => ((g.id || g._id) === targetId ? updated : g))
      )
      toast.success(`Savings goal "${goalData.name}" updated!`)
    } else {
      const created = await createGoal(goalData)
      setGoals((prev) => [created, ...prev])
      toast.success(`Savings goal "${goalData.name}" created!`)
    }
    setModalOpen(false)
    setEditingGoal(null)
  } catch (err) {
    console.error('Failed to save goal:', err)
  }
}

const handleDeleteGoal = async (id) => {
  const backupGoals = [...goals]
  // Optimistic removal
  setGoals((prev) => prev.filter((g) => (g.id || g._id) !== id))
  setDeletingGoalId(null)

  try {
    await deleteGoal(id)
    toast.success('Savings goal deleted.')
  } catch (err) {
    // Rollback
    setGoals(backupGoals)
    console.error('Failed to delete goal:', err)
  }
}

const handleDepositFunds = async (goalId, amount) => {
  try {
    const { goal: updatedGoal } = await addGoalContribution(goalId, amount)
    setGoals((prev) =>
      prev.map((g) => ((g.id || g._id) === goalId ? updatedGoal : g))
    )
    if (updatedGoal.status === 'completed') {
      toast.success(`🎉 Congratulations! You reached your goal for "${updatedGoal.name}"!`, {
        duration: 5000,
      })
    } else {
      toast.success(`Deposited ₹${Number(amount).toLocaleString('en-IN')} to "${updatedGoal.name}"!`)
    }
  } catch (err) {
    console.error('Failed to record goal deposit:', err)
  }
}

// Summary Metrics
const { totalTarget, totalSaved, totalRemaining, completedCount } = useMemo(() => {
  let targetSum = 0
  let savedSum = 0
  let compCount = 0

  goals.forEach((g) => {
    targetSum += Number(g.targetAmount || 0)
    savedSum += Number(g.amountSaved || 0)
    if (Number(g.amountSaved || 0) >= Number(g.targetAmount || 0) || g.status === 'completed') {
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
    return goals.filter(
      (g) => Number(g.amountSaved || 0) >= Number(g.targetAmount || 0) || g.status === 'completed'
    )
  }
  if (filter === 'in_progress') {
    return goals.filter(
      (g) => Number(g.amountSaved || 0) < Number(g.targetAmount || 0) && g.status !== 'completed'
    )
  }
  return goals
}, [goals, filter])

return (
  <div className="space-y-6 animate-fadeIn pb-12">
    {/* 1. Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Savings Goals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
          Track and build your target savings for big milestones
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => loadGoals(true)}
          className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#121212] transition cursor-pointer"
          title="Refresh goals"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8a4f1e] hover:bg-[#784318] text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Goal</span>
        </button>
      </div>
    </div>

    {/* 2. Top Summary Metric Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Target */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
            Total Target
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#8a4f1e]/10 dark:bg-[#8a4f1e]/20 text-[#8a4f1e] flex items-center justify-center">
            <Flag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {formatINR(totalTarget)}
        </div>
        <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
          Across {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
        </p>
      </div>

      {/* Total Saved */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
            Total Saved
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
          {formatINR(totalSaved)}
        </div>
        <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
          {overallPercent}% of total target
        </p>
      </div>

      {/* Remaining to Goal */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
            Remaining
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {formatINR(totalRemaining)}
        </div>
        <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
          Amount left to reach all goals
        </p>
      </div>

      {/* Completed Goals */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
            Completed
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {completedCount} / {goals.length}
        </div>
        <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
          {goals.length - completedCount} in progress
        </p>
      </div>
    </div>

    {error && (
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs sm:text-sm">
        {error}
      </div>
    )}

    {/* 3. Overall Progress Bar */}
    {goals.length > 0 && (
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-neutral-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300">Overall Savings Progress</span>
          <span className="text-[#8a4f1e] dark:text-[#d48b55] font-bold">{overallPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8a4f1e] to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-neutral-500">
          <span>{formatINR(totalSaved)} saved</span>
          <span>{formatINR(totalTarget)} target</span>
        </div>
      </div>
    )}

    {/* 4. Filter Pills */}
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200/60 dark:border-neutral-800 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${filter === 'all'
              ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
        >
          All Goals ({goals.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('in_progress')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${filter === 'in_progress'
              ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
        >
          In Progress ({goals.length - completedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${filter === 'completed'
              ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
        >
          Completed ({completedCount})
        </button>
      </div>
    </div>

    {/* 5. Main Goals List / Grid */}
    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-neutral-800 shadow-xs space-y-4 animate-pulse"
          >
            <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-1/2"></div>
            <div className="h-2.5 bg-slate-100 dark:bg-neutral-800 rounded-full w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    ) : filteredGoals.length === 0 ? (
      <div className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#121212] p-12 sm:p-16 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#8a4f1e]/10 dark:bg-[#8a4f1e]/20 text-[#8a4f1e] flex items-center justify-center">
          <Flag className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {filter === 'completed'
            ? 'No completed goals yet'
            : filter === 'in_progress'
              ? 'No in-progress goals'
              : 'No savings goals set'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 mb-5 max-w-sm mx-auto">
          {filter === 'completed'
            ? 'Keep saving towards your active goals to mark them complete!'
            : 'Create a savings target to begin tracking your deposits and financial milestones.'}
        </p>
        {filter === 'all' && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8a4f1e] hover:bg-[#784318] text-white font-bold text-xs shadow-xs transition active:scale-98 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Your First Goal</span>
          </button>
        )}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGoals.map((goal) => {
          const saved = Number(goal.amountSaved || 0)
          const target = Number(goal.targetAmount || 0)
          const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0
          const isCompleted = saved >= target || goal.status === 'completed'
          const remaining = Math.max(0, target - saved)
          const goalId = goal.id || goal._id

          return (
            <div
              key={goalId}
              className={`p-5 rounded-2xl bg-white dark:bg-[#121212] border transition-all shadow-xs flex flex-col justify-between ${isCompleted
                  ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200/80 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
                }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCompleted
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-[#8a4f1e]/10 text-[#8a4f1e] dark:bg-[#8a4f1e]/20 dark:text-[#d48b55]'
                        }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Flag className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {goal.name}
                      </h4>
                      {goal.targetDate && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(goal.targetDate).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition cursor-pointer"
                      title="Edit goal"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingGoalId(goalId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-neutral-400 dark:hover:text-rose-400 dark:hover:bg-neutral-800 transition cursor-pointer"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amounts Overview */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 dark:text-neutral-400">Current Saved:</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {formatINR(saved)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-slate-400 dark:text-neutral-500">
                    <span>Target:</span>
                    <span className="font-semibold text-slate-700 dark:text-neutral-300">
                      {formatINR(target)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-[#8a4f1e]'
                        }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-500 dark:text-neutral-400'}>
                      {percent}% achieved
                    </span>
                    <span className="text-slate-400 dark:text-neutral-500">
                      {isCompleted ? 'Completed 🎉' : `${formatINR(remaining)} left`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action: Add Savings Deposit Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-neutral-800/80">
                <button
                  type="button"
                  disabled={isCompleted}
                  onClick={() => setDepositGoal(goal)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 opacity-80 cursor-default'
                      : 'bg-[#8a4f1e]/10 hover:bg-[#8a4f1e]/20 text-[#8a4f1e] dark:bg-[#8a4f1e]/20 dark:hover:bg-[#8a4f1e]/30 dark:text-[#d48b55] active:scale-[0.98]'
                    }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Goal Reached</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Add Savings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )}

    {/* 6. Modals */}
    <GoalModal
      isOpen={modalOpen}
      initialGoal={editingGoal}
      onClose={() => {
        setModalOpen(false)
        setEditingGoal(null)
      }}
      onSave={handleSaveGoal}
    />

    <GoalDepositModal
      isOpen={Boolean(depositGoal)}
      goal={depositGoal}
      onClose={() => setDepositGoal(null)}
      onDeposit={handleDepositFunds}
    />

    {/* 7. Delete Confirmation Dialog */}
    {deletingGoalId &&
      createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingGoalId(null)
          }}
        >
          <div className="bg-white dark:bg-[#121212] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-neutral-800 text-left animate-scaleUp">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Delete Savings Goal?
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">
              This will permanently delete this savings goal and all associated contribution records. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setDeletingGoalId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteGoal(deletingGoalId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer shadow-xs"
              >
                Delete Goal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
  </div>
)
}
