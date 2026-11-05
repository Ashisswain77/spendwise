import api from './api'
import { CATEGORY_CONFIG } from '../utils/categories'

/**
 * Maps a MongoDB backend budget document to frontend format.
 * Converts integer paise to rupees and preserves spending calculation fields.
 */
export function mapBackendBudget(b) {
  if (!b) return null

  const limitRupees = typeof b.limitInPaise === 'number' ? b.limitInPaise / 100 : b.limit || 0
  const spentRupees = typeof b.spentInPaise === 'number' ? b.spentInPaise / 100 : b.spent || 0
  const remainingRupees = typeof b.remainingInPaise === 'number' ? b.remainingInPaise / 100 : Math.max(0, limitRupees - spentRupees)

  return {
    ...b,
    id: b._id || b.id,
    _id: b._id || b.id,
    limit: limitRupees,
    limitInPaise: b.limitInPaise ?? Math.round(limitRupees * 100),
    spent: spentRupees,
    spentInPaise: b.spentInPaise ?? Math.round(spentRupees * 100),
    remaining: remainingRupees,
    remainingInPaise: b.remainingInPaise ?? Math.round(remainingRupees * 100),
    period: b.period,
    category: b.category,
    color: CATEGORY_CONFIG[b.category]?.badgeColor || (b.category === 'Overall' ? 'bg-[#8a4f1e]' : 'bg-emerald-500'),
    percentageUsed: b.percentageUsed ?? (limitRupees > 0 ? Math.min(100, Math.round((spentRupees / limitRupees) * 100)) : 0),
    isOverBudget: b.isOverBudget ?? (spentRupees > limitRupees),
  }
}

/**
 * Maps frontend budget data to backend API payload with limitInPaise and YYYY-MM period.
 */
export function mapFrontendToBackendBudget(b) {
  const numericLimit = typeof b.limit === 'number' ? b.limit : parseFloat(b.limit) || 0
  const paise = Math.round(numericLimit * 100)

  // Ensure period is in YYYY-MM format
  let periodStr = b.period
  if (!periodStr || periodStr === 'Monthly' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(periodStr)) {
    periodStr = new Date().toISOString().slice(0, 7)
  }

  return {
    category: b.category?.trim() || 'Overall',
    limitInPaise: paise,
    period: periodStr,
  }
}

/**
 * Fetch budgets from backend with optional period filter (defaults to current month YYYY-MM).
 */
export async function fetchBudgets(period) {
  const currentPeriod = period || new Date().toISOString().slice(0, 7)
  const res = await api.get('/budgets', { params: { period: currentPeriod } })
  const rawList = res.data?.data || []
  return rawList.map(mapBackendBudget)
}

/**
 * Create a new budget on the backend.
 */
export async function createBudget(budgetData) {
  const payload = mapFrontendToBackendBudget(budgetData)
  const res = await api.post('/budgets', payload)
  return mapBackendBudget(res.data?.data)
}

/**
 * Update an existing budget on the backend.
 */
export async function updateBudget(id, budgetData) {
  const payload = {}
  if (budgetData.limit !== undefined) {
    payload.limitInPaise = Math.round(Number(budgetData.limit) * 100)
  }
  if (budgetData.category) {
    payload.category = budgetData.category.trim()
  }
  if (budgetData.period && /^\d{4}-(0[1-9]|1[0-2])$/.test(budgetData.period)) {
    payload.period = budgetData.period
  }

  const res = await api.patch(`/budgets/${id}`, payload)
  return mapBackendBudget(res.data?.data)
}

/**
 * Delete a budget on the backend.
 */
export async function deleteBudget(id) {
  const res = await api.delete(`/budgets/${id}`)
  return res.data
}

