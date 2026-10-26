import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertCircle, ArrowUpRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatINR } from '../../utils/currency'

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000]

export default function GoalDepositModal({
  isOpen,
  goal = null,
  onClose,
  onDeposit,
}) {
  const [depositAmount, setDepositAmount] = useState('1000')
  const [error, setError] = useState('')

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

  if (!isOpen || !goal || typeof document === 'undefined') return null

  const remaining = Math.max(0, goal.targetAmount - goal.amountSaved)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const val = parseFloat(depositAmount)
    if (isNaN(val) || val <= 0) {
      const msg = 'Please enter a valid amount greater than ₹0.'
      setError(msg)
      toast.error(msg)
      return
    }

    onDeposit(goal.id, val)
    onClose()
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
      <div className="bg-white dark:bg-[#121212] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-neutral-800 text-left relative animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Add Savings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[230px]">
              Contribute towards <span className="font-semibold text-slate-700 dark:text-slate-300">{goal.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Current Stats */}
        <div className="bg-slate-50 dark:bg-neutral-900 rounded-xl p-3 mb-4 text-xs space-y-1 border border-slate-100 dark:border-neutral-800">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Current Saved:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatINR(goal.amountSaved)}</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Target:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatINR(goal.targetAmount)}</span>
          </div>
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium pt-1 border-t border-slate-200/60 dark:border-neutral-800">
            <span>Remaining to reach goal:</span>
            <span>{formatINR(remaining)}</span>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="deposit-amount-input"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Deposit Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                ₹
              </span>
              <input
                id="deposit-amount-input"
                type="number"
                min="1"
                step="any"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full pl-7 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8a4f1e]/40 focus:border-[#8a4f1e]"
                autoFocus
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Quick Add
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(String(amt))}
                  className="px-2.5 py-1 text-xs rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-stone-700 dark:text-stone-300 transition-colors font-medium cursor-pointer"
                >
                  +{formatINR(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#8a4f1e] hover:bg-[#734017] text-white px-5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Deposit Funds
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
