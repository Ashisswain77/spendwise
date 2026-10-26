import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useUser } from '@clerk/react'
import { CheckCircle2, X, Target } from 'lucide-react'

import useTransactions from '../../hooks/useTransactions'
import DashboardHeader from './DashboardHeader'
import SummaryCards from './SummaryCards'
import MonthlyBarChart from '../charts/MonthlyBarChart'
import CategoryDoughnutChart from '../charts/CategoryDoughnutChart'
import TransactionModal from '../transactions/TransactionModal'
import TransactionList from '../transactions/TransactionList'
import BudgetTracker from '../budgets/BudgetTracker'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CATEGORY_COLORS = {
  'Salary': '#10B981',
  'Freelance': '#06B6D4',
  'Investments': '#6366F1',
  'Housing & Rent': '#F43F5E',
  'Food & Dining': '#F59E0B',
  'Food & drink': '#F59E0B',
  'Utilities & Bills': '#8B5CF6',
  'Shopping': '#EC4899',
  'Transport': '#14B8A6',
  'Healthcare': '#EF4444',
  'Other': '#64748B',
}

export default function AuthenticatedDashboard({ activeTab = 'Dashboard', onTabChange = () => {} }) {
  const { user } = useUser()
  const {
    transactions,
    filteredTransactions,
    selectedDate,
    setSelectedDate,
    dateRange,
    totalIncome,
    totalExpenses,
    remaining,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
    refreshTransactions,
  } = useTransactions()

  const [chartPeriod, setChartPeriod] = useState('monthly')
  const [modalType, setModalType] = useState(null)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [toast, setToast] = useState('')

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleOpenAddModal = (type = 'expense') => {
    setEditingTransaction(null)
    setModalType(type)
  }

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx)
    setModalType(tx.type || 'expense')
  }

  const handleCloseModal = () => {
    setModalType(null)
    setEditingTransaction(null)
  }

  const handleSaveTransaction = (savedTx) => {
    if (editingTransaction) {
      updateTransaction(savedTx)
      setToast('Transaction updated successfully!')
    } else {
      addTransaction(savedTx)
      setToast(`${savedTx.type === 'income' ? 'Income' : 'Expense'} of ₹${savedTx.amount.toLocaleString('en-IN')} added!`)
    }
    handleCloseModal()
  }

  const handleDeleteTransaction = (id) => {
    deleteTransaction(id)
    setToast('Transaction deleted successfully.')
  }

  const handleDeleteMultiple = (ids) => {
    deleteMultipleTransactions(ids)
    setToast(`${ids.length} transactions deleted successfully.`)
  }

  // 12-Month Bar Chart Aggregation
  const monthlyChartData = useMemo(() => {
    const monthlyMap = {}
    MONTH_NAMES.forEach((m, idx) => {
      monthlyMap[idx] = { month: m, income: 0, expenses: 0 }
    })

    const baseTrends = [
      { month: 'Jan', income: 70000, expenses: 32000 },
      { month: 'Feb', income: 72000, expenses: 34000 },
      { month: 'Mar', income: 75000, expenses: 38000 },
      { month: 'Apr', income: 76000, expenses: 36000 },
      { month: 'May', income: 78000, expenses: 35000 },
      { month: 'Jun', income: 80000, expenses: 40000 },
      { month: 'Jul', income: 82000, expenses: 37000 },
      { month: 'Aug', income: 84000, expenses: 39000 },
      { month: 'Sep', income: 85000, expenses: 38000 },
      { month: 'Oct', income: 0, expenses: 0 },
      { month: 'Nov', income: 85000, expenses: 36000 },
      { month: 'Dec', income: 90000, expenses: 42000 },
    ]

    baseTrends.forEach((b, idx) => {
      monthlyMap[idx].income = b.income
      monthlyMap[idx].expenses = b.expenses
    })

    transactions.forEach((t) => {
      const d = new Date(t.date)
      if (!isNaN(d.getTime())) {
        const mIdx = d.getMonth()
        if (mIdx >= 0 && mIdx < 12) {
          if (t.type === 'income') {
            monthlyMap[mIdx].income = (monthlyMap[mIdx].income || 0) + t.amount
          } else {
            monthlyMap[mIdx].expenses = (monthlyMap[mIdx].expenses || 0) + t.amount
          }
        }
      }
    })

    return MONTH_NAMES.map((_, idx) => monthlyMap[idx])
  }, [transactions])

  // Category-wise expense doughnut data
  const categoryDoughnutData = useMemo(() => {
    const catMap = {}
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = t.category || 'Other'
        catMap[cat] = (catMap[cat] || 0) + t.amount
      })

    const list = Object.keys(catMap).map((cat) => ({
      name: cat,
      value: catMap[cat],
      color: CATEGORY_COLORS[cat] || '#64748B',
      percent: totalExpenses > 0 ? Math.round((catMap[cat] / totalExpenses) * 100) : 0,
    }))

    return list.sort((a, b) => b.value - a.value)
  }, [filteredTransactions, totalExpenses])

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Toast Notification Alert */}
      {toast && typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed top-20 right-6 z-[100] p-4 rounded-2xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {toast}
            </span>
            <button type="button" onClick={() => setToast('')} className="text-emerald-100 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>,
          document.body
        )}

      {/* DASHBOARD HEADER: Only shown on Dashboard tab */}
      {activeTab === 'Dashboard' && (
        <DashboardHeader
          userName={user?.firstName}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          transactions={transactions}
          onOpenModal={handleOpenAddModal}
        />
      )}

      {/* ACTIVE SUBVIEWS / TABS */}
      {activeTab === 'Dashboard' && (
        <div className="space-y-8">
          {/* Summary Metric Cards */}
          <SummaryCards
            remaining={remaining}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            selectedDate={selectedDate}
            dateRange={dateRange}
          />

          {/* Visual Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyBarChart
              data={monthlyChartData}
              period={chartPeriod}
              onPeriodChange={setChartPeriod}
            />
            <CategoryDoughnutChart
              categoryData={categoryDoughnutData}
              totalExpenses={totalExpenses}
              dateRange={dateRange}
              onAddExpense={() => handleOpenAddModal('expense')}
            />
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'History' && (
        <TransactionList
          transactions={transactions}
          onAddTransaction={() => handleOpenAddModal('expense')}
          onUpdateTransaction={handleOpenEditModal}
          onDeleteTransaction={handleDeleteTransaction}
          onDeleteMultiple={handleDeleteMultiple}
          onRefresh={refreshTransactions}
        />
      )}

      {/* BUDGET TAB */}
      {activeTab === 'Budget' && (
        <BudgetTracker
          transactions={transactions}
          onBackToDashboard={() => onTabChange('Dashboard')}
        />
      )}

      {/* GOALS TAB */}
      {activeTab === 'Goals' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs text-center animate-fadeIn space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Savings &amp; Financial Goals</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Set and track savings milestones, emergency funds, and future purchase targets. Financial goal planning is coming soon!
          </p>
          <button
            type="button"
            onClick={() => onTabChange('Dashboard')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* TRANSACTION MODAL (Add / Edit) */}
      <TransactionModal
        modalType={modalType}
        initialTransaction={editingTransaction}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
      />
    </div>
  )
}
