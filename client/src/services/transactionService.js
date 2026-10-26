/**
 * Service for managing user transactions, defaults, budgets, and persistence.
 */

export const DEFAULT_TRANSACTIONS = [
  { id: '1', title: 'Salary Credit - TechCorp', amount: 85000, type: 'income', category: 'Salary', date: '2026-10-01', mode: 'Bank Transfer' },
  { id: '2', title: 'Apartment Monthly Rent', amount: 18000, type: 'expense', category: 'Home', date: '2026-10-03', mode: 'Net Banking' },
  { id: '3', title: 'Nature Basket Groceries', amount: 3420, type: 'expense', category: 'Groceries', date: '2026-10-12', mode: 'UPI' },
  { id: '4', title: 'Freelance UI/UX Milestone', amount: 22000, type: 'income', category: 'Freelance', date: '2026-10-14', mode: 'IMPS' },
  { id: '5', title: 'Weekend Dining & Cafe', amount: 2850, type: 'expense', category: 'Food & drink', date: '2026-10-15', mode: 'UPI' },
  { id: '6', title: 'JioFiber & Gas Utility Bill', amount: 2150, type: 'expense', category: 'Bills & fees', date: '2026-10-21', mode: 'UPI' },
]

export const DEFAULT_BUDGETS = [
  { id: '1', category: 'Home', limit: 20000, period: 'Monthly', color: 'bg-amber-800' },
  { id: '2', category: 'Food & drink', limit: 12000, period: 'Monthly', color: 'bg-orange-500' },
  { id: '3', category: 'Groceries', limit: 10000, period: 'Monthly', color: 'bg-amber-600' },
  { id: '4', category: 'Bills & fees', limit: 5000, period: 'Monthly', color: 'bg-teal-500' },
  { id: '5', category: 'Shopping', limit: 6000, period: 'Monthly', color: 'bg-pink-500' },
  { id: '6', category: 'Transport', limit: 4000, period: 'Monthly', color: 'bg-amber-500' },
]

export function getStorageKey(userId) {
  return userId ? `spendwise_tx_${userId}` : 'spendwise_tx_guest'
}

export function loadStoredTransactions(userId) {
  if (typeof window === 'undefined') return DEFAULT_TRANSACTIONS
  try {
    const key = getStorageKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.error('Error loading stored transactions:', err)
  }
  return DEFAULT_TRANSACTIONS
}

export function saveStoredTransactions(userId, transactions) {
  if (typeof window === 'undefined') return
  try {
    const key = getStorageKey(userId)
    localStorage.setItem(key, JSON.stringify(transactions))
  } catch (err) {
    console.error('Error saving stored transactions:', err)
  }
}

export function loadStoredBudgets(userId) {
  if (typeof window === 'undefined') return []
  try {
    const key = userId ? `spendwise_budgets_${userId}` : 'spendwise_budgets_guest'
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.error('Error loading stored budgets:', err)
  }
  return []
}

export function saveStoredBudgets(userId, budgets) {
  if (typeof window === 'undefined') return
  try {
    const key = userId ? `spendwise_budgets_${userId}` : 'spendwise_budgets_guest'
    localStorage.setItem(key, JSON.stringify(budgets))
  } catch (err) {
    console.error('Error saving stored budgets:', err)
  }
}

export function loadStoredGoals(userId) {
  if (typeof window === 'undefined') return []
  try {
    const key = userId ? `spendwise_goals_${userId}` : 'spendwise_goals_guest'
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    console.error('Error loading stored goals:', err)
  }
  return []
}

export function saveStoredGoals(userId, goals) {
  if (typeof window === 'undefined') return
  try {
    const key = userId ? `spendwise_goals_${userId}` : 'spendwise_goals_guest'
    localStorage.setItem(key, JSON.stringify(goals))
  } catch (err) {
    console.error('Error saving stored goals:', err)
  }
}
