import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PlusCircle, MinusCircle, X, AlertCircle, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/categories'

export default function TransactionModal({
  modalType,
  initialTransaction = null,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialTransaction)
  const effectiveType = initialTransaction?.type || modalType

  const [formTitle, setFormTitle] = useState(initialTransaction?.title || '')
  const [formAmount, setFormAmount] = useState(initialTransaction ? String(initialTransaction.amount) : '')
  const [formCategory, setFormCategory] = useState(
    initialTransaction?.category || (effectiveType === 'income' ? 'Salary' : 'Food & drink')
  )
  const [formDate, setFormDate] = useState(
    initialTransaction?.date || new Date().toISOString().split('T')[0]
  )
  const [formMode, setFormMode] = useState(initialTransaction?.mode || 'UPI')
  const [formError, setFormError] = useState('')

  // Lock body scroll and close on Escape key when modal is open
  useEffect(() => {
    if (!modalType && !initialTransaction) return
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
  }, [modalType, initialTransaction, onClose])

  if ((!modalType && !initialTransaction) || typeof document === 'undefined') return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    const numericAmount = parseFloat(formAmount)
    if (!formTitle.trim()) {
      const msg = 'Please enter a description or merchant name.'
      setFormError(msg)
      toast.error(msg)
      return
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      const msg = 'Please enter a valid amount greater than ₹0.'
      setFormError(msg)
      toast.error(msg)
      return
    }
    if (!formDate) {
      const msg = 'Please select a valid date.'
      setFormError(msg)
      toast.error(msg)
      return
    }

    onSave({
      id: initialTransaction?.id || Date.now().toString(),
      title: formTitle.trim(),
      amount: numericAmount,
      type: effectiveType,
      category: formCategory,
      date: formDate,
      mode: formMode,
    })
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span>Edit {effectiveType === 'income' ? 'Income' : 'Expense'}</span>
              </>
            ) : effectiveType === 'income' ? (
              <>
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Record New Income</span>
              </>
            ) : (
              <>
                <MinusCircle className="w-4 h-4 text-rose-600" />
                <span>Record New Expense</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Description / Note *
            </label>
            <input
              type="text"
              required
              placeholder={effectiveType === 'income' ? 'e.g. October Salary, Freelance project' : 'e.g. Swiggy, Apartment Rent, Electricity'}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Amount in ₹ (INR) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 1500"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:border-emerald-600 focus:outline-hidden cursor-pointer"
              >
                {effectiveType === 'income' ? (
                  INCOME_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                ) : (
                  EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Wallet / Payment Mode
              </label>
              <select
                value={formMode}
                onChange={(e) => setFormMode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:border-emerald-600 focus:outline-hidden cursor-pointer"
              >
                <option value="DEFAULT">DEFAULT</option>
                <option value="UPI">UPI (GPay / PhonePe)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="AutoPay">AutoPay / Mandate</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              {isEditing ? 'Save Changes' : `Save ${effectiveType === 'income' ? 'Income' : 'Expense'}`}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
