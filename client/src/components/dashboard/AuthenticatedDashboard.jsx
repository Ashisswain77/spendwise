import { useState, useMemo } from 'react'
import { useUser } from '@clerk/react'
import toast from 'react-hot-toast'

import useTransactions from '../../hooks/useTransactions'
import DashboardHeader from './DashboardHeader'
import SummaryCards from './SummaryCards'
import MonthlyBarChart from '../charts/MonthlyBarChart'
import CategoryDoughnutChart from '../charts/CategoryDoughnutChart'
import TransactionModal from '../transactions/TransactionModal'
import TransactionList from '../transactions/TransactionList'
import BudgetTracker from '../budgets/BudgetTracker'
import GoalTracker from '../goals/GoalTracker'
import { CATEGORY_COLORS } from '../../utils/categories'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
      toast.success('Transaction updated successfully!')
    } else {
      addTransaction(savedTx)
      toast.success(`${savedTx.type === 'income' ? 'Income' : 'Expense'} of ₹${savedTx.amount.toLocaleString('en-IN')} added!`)
    }
    handleCloseModal()
  }

  const handleDeleteTransaction = (id) => {
    deleteTransaction(id)
    toast.success('Transaction deleted successfully.')
  }

  const handleDeleteMultiple = (ids) => {
    deleteMultipleTransactions(ids)
    toast.success(`${ids.length} transactions deleted successfully.`)
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
      {activeTab === 'Goals' && <GoalTracker />}

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
