import { useState, useEffect, useMemo } from 'react'
import { useUser } from '@clerk/react'
import {
  loadStoredTransactions,
  saveStoredTransactions,
} from '../services/transactionService'

export function useTransactions() {
  const { user } = useUser()
  const userId = user?.id || null

  const [prevUserId, setPrevUserId] = useState(userId)
  const [transactions, setTransactions] = useState(() => loadStoredTransactions(userId))
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateRange, setDateRange] = useState('this_month')

  // Adjust state during render when user changes (React recommended pattern)
  if (userId !== prevUserId) {
    setPrevUserId(userId)
    setTransactions(loadStoredTransactions(userId))
  }

  // Save to localStorage when transactions update
  useEffect(() => {
    saveStoredTransactions(userId, transactions)
  }, [transactions, userId])

  const addTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev])
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Filtered transactions based on selected date or date range
  const filteredTransactions = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    if (selectedDate) {
      return transactions.filter((t) => t.date === selectedDate)
    }

    return transactions.filter((t) => {
      const d = new Date(t.date)
      if (isNaN(d.getTime())) return false

      if (dateRange === 'this_month') {
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth
      }
      if (dateRange === 'last_month') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
        return d.getFullYear() === lastMonthYear && d.getMonth() === lastMonth
      }
      if (dateRange === 'this_year') {
        return d.getFullYear() === currentYear
      }
      return true
    })
  }, [transactions, selectedDate, dateRange])

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [filteredTransactions])

  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [filteredTransactions])

  const remaining = totalIncome - totalExpenses

  return {
    transactions,
    filteredTransactions,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    totalIncome,
    totalExpenses,
    remaining,
    addTransaction,
    deleteTransaction,
  }
}

export default useTransactions
