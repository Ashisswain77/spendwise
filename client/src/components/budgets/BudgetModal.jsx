import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronDown, ChevronsUpDown, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { EXPENSE_CATEGORIES, CATEGORY_CONFIG } from '../../utils/categories'

export default function BudgetModal({
  isOpen,
  initialBudget = null,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialBudget)

  const [prevInitialBudget, setPrevInitialBudget] = useState(initialBudget)
  const [category, setCategory] = useState(
    initialBudget?.category === 'Overall' ? '' : initialBudget?.category || ''
  )
  const [amount, setAmount] = useState(initialBudget ? String(initialBudget.limit) : '5000')
  const [period, setPeriod] = useState(initialBudget?.period || 'Monthly')
  const [error, setError] = useState('')

  // Adjust state during render when initialBudget prop changes
  if (initialBudget !== prevInitialBudget) {
    setPrevInitialBudget(initialBudget)
    setCategory(initialBudget?.category === 'Overall' ? '' : initialBudget?.category || '')
    setAmount(initialBudget ? String(initialBudget.limit) : '5000')
    setPeriod(initialBudget?.period || 'Monthly')
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

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      const msg = 'Please enter a valid budget amount greater than ₹0.'
      setError(msg)
      toast.error(msg)
      return
    }

    const budgetData = {
      id: initialBudget?.id || Date.now().toString(),
      category: category.trim() === '' ? 'Overall' : category,
      limit: numericAmount,
      period: period,
      color: CATEGORY_CONFIG[category]?.badgeColor || 'bg-emerald-500',
    }

    onSave(budgetData)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white dark:bg-[#121214] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-zinc-800 animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Bullseye / Target concentric circles icon */}
            <div className="w-11 h-11 rounded-full bg-[#f7efe6] dark:bg-[#2c2016] text-[#8a4f1e] dark:text-[#d48b55] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Budget' : 'New Budget'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Set a spending limit for a category
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-lg transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              Category (leave empty for overall)
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs font-medium focus:border-amber-700 dark:focus:border-amber-600 focus:outline-hidden cursor-pointer"
              >
                <option value="">All categories (overall)</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* 2. Budget Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              Budget Amount
            </label>
            <input
              type="number"
              step="1"
              required
              placeholder="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs font-medium focus:border-amber-700 dark:focus:border-amber-600 focus:outline-hidden"
            />
          </div>

          {/* 3. Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              Period
            </label>
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs font-medium focus:border-amber-700 dark:focus:border-amber-600 focus:outline-hidden cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#8a4f1e] hover:bg-[#784318] active:scale-98 rounded-xl shadow-xs transition cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
