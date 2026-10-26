import { useState, useMemo, useEffect, useRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import toast from 'react-hot-toast'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function CalendarDropdown({
  selectedDate,
  onSelectDate,
  transactions = [],
}) {
  const today = new Date()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const calendarRef = useRef(null)

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false)
      }
    }
    if (calendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [calendarOpen])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay()
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate()
    const days = []

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, current: false, dateStr: null })
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(calMonth + 1).padStart(2, '0')
      const dd = String(d).padStart(2, '0')
      days.push({ day: d, current: true, dateStr: `${calYear}-${mm}-${dd}` })
    }
    // Next month trailing days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, current: false, dateStr: null })
    }
    return days
  }, [calYear, calMonth])

  // Map of dates with transactions to display dot indicators
  const datesWithTransactions = useMemo(() => {
    const set = new Set()
    transactions.forEach((t) => {
      if (t.date) set.add(t.date)
    })
    return set
  }, [transactions])

  const navigateCalendar = (delta) => {
    let nextMonth = calMonth + delta
    let nextYear = calYear
    if (nextMonth < 0) {
      nextMonth = 11
      nextYear -= 1
    } else if (nextMonth > 11) {
      nextMonth = 0
      nextYear += 1
    }
    setCalMonth(nextMonth)
    setCalYear(nextYear)
  }

  const goToToday = () => {
    const t = new Date()
    setCalMonth(t.getMonth())
    setCalYear(t.getFullYear())
    const mm = String(t.getMonth() + 1).padStart(2, '0')
    const dd = String(t.getDate()).padStart(2, '0')
    const todayStr = `${t.getFullYear()}-${mm}-${dd}`
    onSelectDate(todayStr)
    setCalendarOpen(false)
    toast('Filtering for today', { icon: '📅' })
  }

  const handleSelectDay = (dateStr) => {
    if (!dateStr) return
    if (selectedDate === dateStr) {
      onSelectDate(null) // toggle off
      toast('Showing all dates', { icon: '📅' })
    } else {
      onSelectDate(dateStr)
      const formatted = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      toast(`Filtering for ${formatted}`, { icon: '📅' })
    }
    setCalendarOpen(false)
  }

  const calendarButtonLabel = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : `${FULL_MONTH_NAMES[calMonth]} ${calYear}`

  return (
    <div className="relative" ref={calendarRef}>
      <button
        type="button"
        onClick={() => setCalendarOpen(!calendarOpen)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer shadow-xs ${
          selectedDate
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-300 dark:hover:border-emerald-700'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span>{calendarButtonLabel}</span>
        <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${calendarOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Calendar Panel */}
      {calendarOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 animate-fadeIn">
          {/* Calendar Header: Month/Year nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateCalendar(-1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {FULL_MONTH_NAMES[calMonth]} {calYear}
              </span>
              <button
                type="button"
                onClick={goToToday}
                className="px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900 transition cursor-pointer"
              >
                Today
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigateCalendar(1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_LABELS.map((day) => (
              <span key={day} className="text-[11px] font-semibold text-slate-400 py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => {
              const isSelected = item.dateStr && selectedDate === item.dateStr
              const hasActivity = item.dateStr && datesWithTransactions.has(item.dateStr)

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!item.current}
                  onClick={() => handleSelectDay(item.dateStr)}
                  className={`relative h-9 flex flex-col items-center justify-center rounded-xl text-xs font-semibold transition cursor-pointer ${
                    !item.current
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.day}</span>
                  {hasActivity && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer controls: Clear selection */}
          {selectedDate && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Filtering single date</span>
              <button
                type="button"
                onClick={() => {
                  onSelectDate(null)
                  setCalendarOpen(false)
                }}
                className="text-rose-500 hover:text-rose-600 font-semibold cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
