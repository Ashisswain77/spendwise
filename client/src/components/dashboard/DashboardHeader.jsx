import { PlusCircle, MinusCircle } from 'lucide-react'
import CalendarDropdown from './CalendarDropdown'

export default function DashboardHeader({
  userName,
  selectedDate,
  onSelectDate,
  transactions,
  onOpenModal,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pt-2">
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back, {userName || 'there'} 👋
        </h1>

        {/* Modern Calendar Dropdown */}
        <CalendarDropdown
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          transactions={transactions}
        />
      </div>

      {/* Action Buttons: New Income & New Expense */}
      <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto pt-1">
        <button
          type="button"
          onClick={() => onOpenModal('income')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-xs transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Income</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenModal('expense')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs transition cursor-pointer"
        >
          <MinusCircle className="w-4 h-4 text-rose-500" />
          <span>New Expense</span>
        </button>
      </div>
    </div>
  )
}
