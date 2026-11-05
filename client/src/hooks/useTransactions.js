import { useState, useEffect, useMemo, useCallback } from 'react'
import { useUser, useAuth } from '@clerk/react'
import {
  fetchTransactions,
  createTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  deleteMultipleTransactions as apiDeleteMultipleTransactions,
  migrateLocalStorageData,
} from '../services/transactionService'

export function useTransactions() {
  const { user } = useUser()
  const { isLoaded, isSignedIn } = useAuth()
  const userId = user?.id || null

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateRange, setDateRange] = useState('this_month')

  // Load transactions from backend API
  const loadTransactions = useCallback(async (silent = false) => {
    if (!isSignedIn) {
      setTransactions([])
      setLoading(false)
      return
    }

    if (!silent) setLoading(true)
    setError(null)

    try {
      // First, run one-time safe migration of existing browser data if not already migrated
      if (userId) {
        await migrateLocalStorageData(userId).catch((err) =>
          console.warn('Migration non-fatal error:', err)
        )
      }

      const { transactions: fetchedList } = await fetchTransactions({ limit: 100 })
      setTransactions(fetchedList)
    } catch (err) {
      console.error('Failed to load transactions:', err)
      setError(err?.response?.data?.message || err.message || 'Failed to load transactions')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [isSignedIn, userId])

  // Initial load when user authentication state is resolved
  useEffect(() => {
    if (!isLoaded) return

    let ignore = false

        const run = async () => {
          if (!isSignedIn) {
            if (!ignore) {
              setTransactions([])
              setLoading(false)
            }
            return
          }

            if (!ignore) setLoading(true)
            setError(null)

            try {
              if (userId) {
                await migrateLocalStorageData(userId).catch((err) =>
                  console.warn('Migration non-fatal error:', err)
                )
              }
              const { transactions: fetchedList } = await fetchTransactions({ limit: 100 })
              if (!ignore) setTransactions(fetchedList)
            } catch (err) {
              if (!ignore) {
                console.error('Failed to load transactions:', err)
                setError(err?.response?.data?.message || err.message || 'Failed to load transactions')
              }
            } finally {
              if (!ignore) setLoading(false)
            }
          }

          run()

          return () => { ignore = true }
        }, [isLoaded, isSignedIn, userId])

  // Add transaction with optimistic update and rollback
  const addTransaction = async (newTx) => {
    const tempId = `temp_${Date.now()}`
    const optimisticTx = {
      ...newTx,
      id: tempId,
      _id: tempId,
      amount: typeof newTx.amount === 'number' ? newTx.amount : parseFloat(newTx.amount) || 0,
      mode: newTx.wallet || newTx.mode || 'Cash',
      wallet: newTx.wallet || newTx.mode || 'Cash',
    }

    // Optimistically update UI
    setTransactions((prev) => [optimisticTx, ...prev])

    try {
      const created = await createTransaction(newTx)
      // Replace optimistic item with persisted backend document
      setTransactions((prev) =>
        prev.map((t) => (t.id === tempId ? created : t))
      )
      return created
    } catch (err) {
      // Rollback on failure
      setTransactions((prev) => prev.filter((t) => t.id !== tempId))
      throw err
    }
  }

  // Update transaction with optimistic update and rollback
  const updateTransaction = async (updatedTx) => {
    const targetId = updatedTx.id || updatedTx._id
    const previousTx = transactions.find((t) => (t.id || t._id) === targetId)

    // Optimistic update
    setTransactions((prev) =>
      prev.map((t) => ((t.id || t._id) === targetId ? { ...t, ...updatedTx } : t))
    )

    try {
      const persisted = await apiUpdateTransaction(targetId, updatedTx)
      setTransactions((prev) =>
        prev.map((t) => ((t.id || t._id) === targetId ? persisted : t))
      )
      return persisted
    } catch (err) {
      // Rollback to previous state
      if (previousTx) {
        setTransactions((prev) =>
          prev.map((t) => ((t.id || t._id) === targetId ? previousTx : t))
        )
      }
      throw err
    }
  }

  // Delete transaction with optimistic update and rollback
  const deleteTransaction = async (id) => {
    const previousTx = transactions.find((t) => (t.id || t._id) === id)

    // Optimistically remove
    setTransactions((prev) => prev.filter((t) => (t.id || t._id) !== id))

    try {
      await apiDeleteTransaction(id)
    } catch (err) {
      // Rollback on failure
      if (previousTx) {
        setTransactions((prev) => [previousTx, ...prev])
      }
      throw err
    }
  }

  // Delete multiple transactions
  const deleteMultipleTransactions = async (ids = []) => {
    const idsSet = new Set(ids)
    const backupTxs = transactions.filter((t) => idsSet.has(t.id || t._id))

    // Optimistically remove
    setTransactions((prev) => prev.filter((t) => !idsSet.has(t.id || t._id)))

    try {
      await apiDeleteMultipleTransactions(ids)
    } catch (err) {
      // Rollback on failure
      setTransactions((prev) => [...backupTxs, ...prev])
      throw err
    }
  }

  const refreshTransactions = () => {
    return loadTransactions(true)
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
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [filteredTransactions])

  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [filteredTransactions])

  const remaining = totalIncome - totalExpenses

  return {
    transactions,
    filteredTransactions,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    totalIncome,
    totalExpenses,
    remaining,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
    refreshTransactions,
  }
}

export default useTransactions
