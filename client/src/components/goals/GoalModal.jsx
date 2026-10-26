import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Flag, X, AlertCircle, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GoalModal({
  isOpen,
  initialGoal = null,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialGoal)

  const [prevInitialGoal, setPrevInitialGoal] = useState(initialGoal)
  const [name, setName] = useState(initialGoal?.name || '')
  const [targetAmount, setTargetAmount] = useState(
    initialGoal?.targetAmount !== undefined ? String(initialGoal.targetAmount) : ''
  )
  const [amountSaved, setAmountSaved] = useState(
    initialGoal?.amountSaved !== undefined ? String(initialGoal.amountSaved) : ''
  )
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || '')
  const [error, setError] = useState('')

  // Adjust state during render when initialGoal prop changes
  if (initialGoal !== prevInitialGoal) {
    setPrevInitialGoal(initialGoal)
    setName(initialGoal?.name || '')
    setTargetAmount(
      initialGoal?.targetAmount !== undefined ? String(initialGoal.targetAmount) : ''
    )
    setAmountSaved(
      initialGoal?.amountSaved !== undefined ? String(initialGoal.amountSaved) : ''
    )
    setTargetDate(initialGoal?.targetDate || '')
    setError('')
  }

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const cleanName = name.trim()
    if (!cleanName) {
      const msg = 'Please enter a goal name.'
      setError(msg)
      toast.error(msg)
      return
    }

    const numericTarget = parseFloat(targetAmount)
    if (isNaN(numericTarget) || numericTarget <= 0) {
      const msg = 'Please enter a valid target amount greater than ₹0.'
      setError(msg)
      toast.error(msg)
      return
    }

    const numericSaved = amountSaved === '' ? 0 : parseFloat(amountSaved)
    if (isNaN(numericSaved) || numericSaved < 0) {
      const msg = 'Amount saved cannot be negative.'
      setError(msg)
      toast.error(msg)
      return
    }

    const goalData = {
      id: initialGoal?.id || Date.now().toString(),
      name: cleanName,
      targetAmount: numericTarget,
      amountSaved: numericSaved,
      targetDate: targetDate || '',
      createdAt: initialGoal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(goalData)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-neutral-800 text-left relative animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#f6eee5] dark:bg-[#2c2016] flex items-center justify-center text-[#8a4f1e] dark:text-[#d6986c] shrink-0">
              <Flag className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {isEditing ? 'Edit Goal' : 'New Goal'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isEditing ? 'Update your savings target' : 'Set a new savings target'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Name */}
          <div>
            <label
              htmlFor="goal-name-input"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Goal Name
            </label>
            <input
              id="goal-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., New MacBook"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a4f1e]/40 focus:border-[#8a4f1e] transition-all"
              autoFocus
            />
          </div>

          {/* Target Amount */}
          <div>
            <label
              htmlFor="goal-target-input"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 text-base font-normal select-none">
                ₹
              </span>
              <input
                id="goal-target-input"
                type="number"
                min="0"
                step="any"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a4f1e]/40 focus:border-[#8a4f1e] transition-all"
              />
            </div>
          </div>

          {/* Amount Saved */}
          <div>
            <label
              htmlFor="goal-saved-input"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Amount Saved
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 text-base font-normal select-none">
                ₹
              </span>
              <input
                id="goal-saved-input"
                type="number"
                min="0"
                step="any"
                value={amountSaved}
                onChange={(e) => setAmountSaved(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a4f1e]/40 focus:border-[#8a4f1e] transition-all"
              />
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label
              htmlFor="goal-date-input"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Target Date
            </label>
            <div className="relative">
              <input
                id="goal-date-input"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a4f1e]/40 focus:border-[#8a4f1e] transition-all"
              />
            </div>
          </div>

          {/* Bottom Action */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="bg-[#8a4f1e] hover:bg-[#734017] text-white px-7 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm active:scale-[0.99] flex items-center gap-1.5"
            >
              {!isEditing && <Plus className="w-4 h-4 -ml-0.5" />}
              {isEditing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
