import { useState } from 'react'
import {
  List as ListIcon,
  LayoutGrid,
  Plus,
  FileSpreadsheet,
  RotateCw,
  Search,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Utensils,
  ShoppingBag,
  CreditCard,
  Building,
  TrendingUp,
  CircleDollarSign,
  HeartPulse,
  Truck,
  Layers,
} from 'lucide-react'
import { formatINR } from '../../utils/currency'

export default function TransactionList({
  transactions = [],
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onDeleteMultiple,
  onRefresh,
}) {
  // View mode: 'list' or 'grid'
  const [viewMode, setViewMode] = useState('list')

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | 'income' | 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [walletFilter, setWalletFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all') // 'all' | 'today' | 'week' | 'month' | 'last_month' | 'year'

  // Selection state for checkboxes
  const [selectedIds, setSelectedIds] = useState(new Set())

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Refresh spinner animation state
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Unique lists for dropdowns
  const categories = (() => {
    const set = new Set()
    transactions.forEach((t) => {
      if (t.category) set.add(t.category)
    })
    return Array.from(set).sort()
  })()

  const wallets = (() => {
    const set = new Set(['DEFAULT'])
    transactions.forEach((t) => {
      if (t.mode) set.add(t.mode)
    })
    return Array.from(set).sort()
  })()

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setWalletFilter('all')
    setTimeFilter('all')
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  // Handle refresh
  const handleRefreshClick = () => {
    setIsRefreshing(true)
    if (onRefresh) onRefresh()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  // Google Sheets / CSV Export
  const handleExportSheets = () => {
    if (filteredTransactions.length === 0) return

    const headers = ['Date', 'Category', 'Note', 'Wallet', 'Type', 'Amount (INR)']
    const rows = filteredTransactions.map((t) => [
      `"${t.date}"`,
      `"${t.category || ''}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${t.mode || 'DEFAULT'}"`,
      `"${t.type}"`,
      t.amount,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `SpendWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter logic
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  const filteredTransactions = transactions.filter((t) => {
    // 1. Text Search (matches note/title, category, amount, or wallet)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const matchTitle = (t.title || '').toLowerCase().includes(query)
      const matchCat = (t.category || '').toLowerCase().includes(query)
      const matchWallet = (t.mode || 'DEFAULT').toLowerCase().includes(query)
      const matchAmount = String(t.amount).includes(query)
      if (!matchTitle && !matchCat && !matchWallet && !matchAmount) {
        return false
      }
    }

    // 2. Type Filter
    if (typeFilter !== 'all' && t.type !== typeFilter) {
      return false
    }

    // 3. Category Filter
    if (categoryFilter !== 'all' && t.category !== categoryFilter) {
      return false
    }

    // 4. Wallet Filter
    if (walletFilter !== 'all') {
      const wallet = t.mode || 'DEFAULT'
      if (wallet !== walletFilter) return false
    }

    // 5. Time Filter
    if (timeFilter !== 'all') {
      const txDate = new Date(t.date)
      if (isNaN(txDate.getTime())) return false

      if (timeFilter === 'today') {
        if (t.date !== todayStr) return false
      } else if (timeFilter === 'week') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (txDate < sevenDaysAgo) return false
      } else if (timeFilter === 'month') {
        if (txDate.getFullYear() !== now.getFullYear() || txDate.getMonth() !== now.getMonth()) {
          return false
        }
      } else if (timeFilter === 'last_month') {
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
        const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
        if (txDate.getFullYear() !== lastYear || txDate.getMonth() !== lastMonth) {
          return false
        }
      } else if (timeFilter === 'year') {
        if (txDate.getFullYear() !== now.getFullYear()) return false
      }
    }

    return true
  })

  // Summary totals for filtered transactions
  let filteredIncome = 0
  let filteredExpense = 0
  filteredTransactions.forEach((t) => {
    if (t.type === 'income') filteredIncome += t.amount
    else filteredExpense += t.amount
  })
  const filteredNet = filteredIncome - filteredExpense

  // Pagination calculation
  const totalItems = filteredTransactions.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + pageSize)
  const endIndex = Math.min(startIndex + paginatedTransactions.length, totalItems)

  // Selection handlers
  const isAllSelected =
    paginatedTransactions.length > 0 &&
    paginatedTransactions.every((t) => selectedIds.has(t.id))

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      const next = new Set(selectedIds)
      paginatedTransactions.forEach((t) => next.add(t.id))
      setSelectedIds(next)
    }
  }

  const handleToggleSelectOne = (id) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return
    if (onDeleteMultiple) {
      onDeleteMultiple(Array.from(selectedIds))
    }
    setSelectedIds(new Set())
  }

  // Category visual icon & color mapper (Theme adaptive)
  const getCategoryMeta = (category, type) => {
    if (type === 'income') {
      return {
        icon: <CircleDollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
        bg: 'bg-emerald-50 border border-emerald-200/80 dark:bg-emerald-950/80 dark:border-emerald-800/60',
      }
    }

    switch (category) {
      case 'Food & Dining':
      case 'Food & drink':
        return {
          icon: <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          bg: 'bg-amber-50 border border-amber-200/80 dark:bg-amber-950/80 dark:border-amber-800/60',
        }
      case 'Coffee':
        return {
          icon: <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          bg: 'bg-amber-50 border border-amber-200/80 dark:bg-amber-950/80 dark:border-amber-800/60',
        }
      case 'Housing & Rent':
        return {
          icon: <Building className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
          bg: 'bg-rose-50 border border-rose-200/80 dark:bg-rose-950/80 dark:border-rose-800/60',
        }
      case 'Shopping':
        return {
          icon: <ShoppingBag className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />,
          bg: 'bg-pink-50 border border-pink-200/80 dark:bg-pink-950/80 dark:border-pink-800/60',
        }
      case 'Investments':
        return {
          icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />,
          bg: 'bg-cyan-50 border border-cyan-200/80 dark:bg-cyan-950/80 dark:border-cyan-800/60',
        }
      case 'Utilities & Bills':
        return {
          icon: <CreditCard className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
          bg: 'bg-purple-50 border border-purple-200/80 dark:bg-purple-950/80 dark:border-purple-800/60',
        }
      case 'Transport':
        return {
          icon: <Truck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />,
          bg: 'bg-teal-50 border border-teal-200/80 dark:bg-teal-950/80 dark:border-teal-800/60',
        }
      case 'Healthcare':
        return {
          icon: <HeartPulse className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />,
          bg: 'bg-red-50 border border-red-200/80 dark:bg-red-950/80 dark:border-red-800/60',
        }
      default:
        return {
          icon: <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
          bg: 'bg-slate-100 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700/60',
        }
    }
  }

  // Format date helper: "26 Oct 2026"
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr + 'T00:00:00')
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* =========================================================================
          1. TOP ACTION BAR (View Mode, + Add, Google Sheets, Refresh)
         ========================================================================= */}
      <div className="flex items-center justify-end gap-2.5">
        {/* List / Grid Segmented Toggle */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-zinc-800/90 p-1 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
        </div>

        {/* + Add Button */}
        <button
          type="button"
          onClick={() => onAddTransaction && onAddTransaction()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#e09f3e] hover:bg-[#d09033] text-zinc-950 font-bold text-xs sm:text-sm shadow-sm transition active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add</span>
        </button>

        {/* Google Sheets Export Button */}
        <button
          type="button"
          onClick={handleExportSheets}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#141414] hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
          title="Export transactions to Google Sheets / CSV"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Google Sheets</span>
        </button>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefreshClick}
          className="p-2 rounded-xl bg-white dark:bg-[#141414] hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800/90 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          title="Refresh transaction history"
          aria-label="Refresh"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* =========================================================================
          2. FILTERS & SEARCH BAR
         ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] sm:min-w-[240px]">
          <input
            type="text"
            placeholder="Search by note, amount..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-zinc-800/90 text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 text-xs focus:border-emerald-500 dark:focus:border-zinc-600 focus:outline-hidden"
          />
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        </div>

        {/* All Types Select */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-300 text-xs font-medium focus:border-emerald-500 dark:focus:border-zinc-600 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        </div>

        {/* All Categories Select */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-300 text-xs font-medium focus:border-emerald-500 dark:focus:border-zinc-600 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        </div>

        {/* All Wallets Select */}
        <div className="relative">
          <select
            value={walletFilter}
            onChange={(e) => {
              setWalletFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-300 text-xs font-medium focus:border-emerald-500 dark:focus:border-zinc-600 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Wallets</option>
            {wallets.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        </div>

        {/* Date / Time Select with Calendar Icon */}
        <div className="relative flex items-center">
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="appearance-none pl-8 pr-7 py-2 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-300 text-xs font-medium focus:border-emerald-500 dark:focus:border-zinc-600 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="year">This Year</option>
            </select>
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 pointer-events-none" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Reset Filter Text Link */}
        {(searchQuery || typeFilter !== 'all' || categoryFilter !== 'all' || walletFilter !== 'all' || timeFilter !== 'all') && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium px-2 py-1 transition cursor-pointer"
          >
            Reset
          </button>
        )}

        {/* Bulk Action: Delete Selected */}
        {selectedIds.size > 0 && (
          <button
            type="button"
            onClick={handleBulkDelete}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected ({selectedIds.size})</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          3. MAIN VIEW: LIST TABLE OR GRID
         ========================================================================= */}
      {viewMode === 'list' ? (
        <div className="rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 bg-white dark:bg-[#0d0d0f] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              {/* Table Header */}
              <thead className="bg-slate-50/90 dark:bg-[#121214] border-b border-slate-200/80 dark:border-zinc-800/80 text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-emerald-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                      aria-label="Select all transactions on this page"
                    />
                  </th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Note</th>
                  <th className="py-3.5 px-3">Wallet</th>
                  <th className="py-3.5 px-3 text-right sm:text-left">Amount</th>
                  <th className="py-3.5 px-3 hidden sm:table-cell">Date</th>
                  <th className="py-3.5 pr-4 pl-3 text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                      No transactions match the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => {
                    const isSelected = selectedIds.has(tx.id)
                    const meta = getCategoryMeta(tx.category, tx.type)
                    const isExpense = tx.type === 'expense'

                    return (
                      <tr
                        key={tx.id}
                        className={`group transition-colors ${
                          isSelected
                            ? 'bg-emerald-50/60 dark:bg-zinc-800/40'
                            : 'hover:bg-slate-50/80 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 pl-4 pr-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectOne(tx.id)}
                            className="rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-emerald-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                            aria-label={`Select transaction ${tx.title}`}
                          />
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${meta.bg}`}>
                              {meta.icon}
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-zinc-200 whitespace-nowrap">
                              {tx.category || '-'}
                            </span>
                          </div>
                        </td>

                        {/* Note */}
                        <td className="py-3.5 px-3 max-w-[280px] truncate text-slate-600 dark:text-zinc-300 font-medium">
                          {tx.title || '-'}
                        </td>

                        {/* Wallet badge */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-[10px] font-mono font-bold tracking-wider text-slate-600 dark:text-zinc-400 uppercase">
                            {tx.mode || 'DEFAULT'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-right sm:text-left">
                          <span
                            className={`font-bold font-mono text-xs sm:text-sm ${
                              isExpense ? 'text-rose-600 dark:text-[#f87171]' : 'text-emerald-600 dark:text-[#34d399]'
                            }`}
                          >
                            {isExpense ? `- ${formatINR(tx.amount)}` : `+ ${formatINR(tx.amount)}`}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-3 whitespace-nowrap hidden sm:table-cell text-slate-500 dark:text-zinc-400 font-medium">
                          {formatDateDisplay(tx.date)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 pr-4 pl-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => onUpdateTransaction && onUpdateTransaction(tx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
                              title="Edit transaction"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteTransaction && onDeleteTransaction(tx.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-400 dark:hover:text-rose-400 dark:hover:bg-zinc-800 transition cursor-pointer"
                              title="Delete transaction"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {paginatedTransactions.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 dark:text-zinc-500 bg-white dark:bg-[#0d0d0f] rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 shadow-xs">
              No transactions match the selected filters.
            </div>
          ) : (
            paginatedTransactions.map((tx) => {
              const isSelected = selectedIds.has(tx.id)
              const meta = getCategoryMeta(tx.category, tx.type)
              const isExpense = tx.type === 'expense'

              return (
                <div
                  key={tx.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-50/50 dark:bg-zinc-800/50 border-emerald-500/60'
                      : 'bg-white dark:bg-[#0d0d0f] hover:bg-slate-50/80 dark:hover:bg-[#121215] border-slate-200/90 dark:border-zinc-800/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(tx.id)}
                        className="rounded border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-emerald-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                      />
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.bg}`}>
                        {meta.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-zinc-200 text-xs">{tx.category || '-'}</p>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-[9px] font-mono font-bold tracking-wider text-slate-600 dark:text-zinc-400 uppercase mt-0.5">
                          {tx.mode || 'DEFAULT'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateTransaction && onUpdateTransaction(tx)}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
                        title="Edit transaction"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction && onDeleteTransaction(tx.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-400 dark:hover:text-rose-400 dark:hover:bg-zinc-800 transition cursor-pointer"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium line-clamp-2 mb-3 min-h-[32px]">
                    {tx.title || '-'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60 text-xs">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                      {formatDateDisplay(tx.date)}
                    </span>
                    <span
                      className={`font-bold font-mono text-sm ${
                        isExpense ? 'text-rose-600 dark:text-[#f87171]' : 'text-emerald-600 dark:text-[#34d399]'
                      }`}
                    >
                      {isExpense ? `- ${formatINR(tx.amount)}` : `+ ${formatINR(tx.amount)}`}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* =========================================================================
          4. FOOTER & PAGINATION BAR (Matching screenshot, dual-theme)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-500 dark:text-zinc-400">
        {/* Left side: Showing counts and totals (Exp / Inc / Net) */}
        <div className="space-y-1">
          <p className="text-slate-500 dark:text-zinc-500">
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} transactions
          </p>
          <div className="flex items-center gap-3 font-semibold text-xs">
            <span className="text-rose-600 dark:text-[#f87171]">
              Exp: {formatINR(filteredExpense)}
            </span>
            <span className="text-emerald-600 dark:text-[#34d399]">
              Inc: {formatINR(filteredIncome)}
            </span>
            <span className="text-emerald-600 dark:text-[#34d399]">
              Net: {filteredNet >= 0 ? `+${formatINR(filteredNet)}` : formatINR(filteredNet)}
            </span>
          </div>
        </div>

        {/* Right side: Per page dropdown & pagination controls */}
        <div className="flex items-center gap-3">
          {/* Per page selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-zinc-500 text-xs">Per page</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="appearance-none pl-2.5 pr-6 py-1 rounded-lg bg-white dark:bg-[#141414] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Page navigation controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-[#141414] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                {safeCurrentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-white dark:bg-[#141414] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
