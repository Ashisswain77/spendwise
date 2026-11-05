import api from './api'

/**
 * Maps a MongoDB backend goal document to frontend format.
 * Converts integer paise to rupees.
 */
export function mapBackendGoal(g) {
  if (!g) return null

  const targetRupees = typeof g.targetAmountInPaise === 'number' ? g.targetAmountInPaise / 100 : g.targetAmount || 0
  const savedRupees = typeof g.amountSavedInPaise === 'number' ? g.amountSavedInPaise / 100 : g.amountSaved || 0

  const targetDateStr = g.targetDate
    ? typeof g.targetDate === 'string'
      ? g.targetDate.split('T')[0]
      : new Date(g.targetDate).toISOString().split('T')[0]
    : ''

  const contributions = (g.contributions || []).map((c) => ({
    ...c,
    id: c._id || c.id,
    _id: c._id || c.id,
    amount: typeof c.amountInPaise === 'number' ? c.amountInPaise / 100 : c.amount || 0,
    amountInPaise: c.amountInPaise,
    date: c.date
      ? typeof c.date === 'string'
        ? c.date.split('T')[0]
        : new Date(c.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  }))

  return {
    ...g,
    id: g._id || g.id,
    _id: g._id || g.id,
    name: g.name,
    targetAmount: targetRupees,
    targetAmountInPaise: g.targetAmountInPaise ?? Math.round(targetRupees * 100),
    amountSaved: savedRupees,
    amountSavedInPaise: g.amountSavedInPaise ?? Math.round(savedRupees * 100),
    targetDate: targetDateStr,
    status: g.status || (savedRupees >= targetRupees && targetRupees > 0 ? 'completed' : 'active'),
    contributions,
  }
}

/**
 * Maps frontend goal data to backend API payload with targetAmountInPaise.
 */
export function mapFrontendToBackendGoal(g) {
  const numericTarget = typeof g.targetAmount === 'number' ? g.targetAmount : parseFloat(g.targetAmount) || 0
  const numericSaved = typeof g.amountSaved === 'number' ? g.amountSaved : parseFloat(g.amountSaved) || 0

  return {
    name: g.name?.trim(),
    targetAmountInPaise: Math.round(numericTarget * 100),
    amountSavedInPaise: Math.round(numericSaved * 100),
    targetDate: g.targetDate ? new Date(g.targetDate).toISOString() : null,
  }
}

/**
 * Fetch all goals from the backend with optional status filter.
 */
export async function fetchGoals(status = 'all') {
  const res = await api.get('/goals', { params: { status } })
  const rawList = res.data?.data || []
  return rawList.map(mapBackendGoal)
}

/**
 * Fetch a single goal by ID along with its contribution history.
 */
export async function fetchGoalById(id) {
  const res = await api.get(`/goals/${id}`)
  return mapBackendGoal(res.data?.data)
}

/**
 * Create a new savings goal on the backend.
 */
export async function createGoal(goalData) {
  const payload = mapFrontendToBackendGoal(goalData)
  const res = await api.post('/goals', payload)
  return mapBackendGoal(res.data?.data)
}

/**
 * Update an existing savings goal on the backend.
 */
export async function updateGoal(id, goalData) {
  const payload = {}
  if (goalData.name) payload.name = goalData.name.trim()
  if (goalData.targetAmount !== undefined) {
    payload.targetAmountInPaise = Math.round(Number(goalData.targetAmount) * 100)
  }
  if (goalData.amountSaved !== undefined) {
    payload.amountSavedInPaise = Math.round(Number(goalData.amountSaved) * 100)
  }
  if (goalData.targetDate !== undefined) {
    payload.targetDate = goalData.targetDate ? new Date(goalData.targetDate).toISOString() : null
  }
  if (goalData.status) payload.status = goalData.status

  const res = await api.patch(`/goals/${id}`, payload)
  return mapBackendGoal(res.data?.data)
}

/**
 * Delete a savings goal on the backend.
 */
export async function deleteGoal(id) {
  const res = await api.delete(`/goals/${id}`)
  return res.data
}

/**
 * Add a savings deposit contribution to a goal on the backend.
 */
export async function addGoalContribution(goalId, amountInRupees) {
  const numericAmount = typeof amountInRupees === 'number' ? amountInRupees : parseFloat(amountInRupees) || 0
  const paise = Math.round(numericAmount * 100)

  const res = await api.post(`/goals/${goalId}/contributions`, {
    amountInPaise: paise,
    date: new Date().toISOString(),
  })

  return {
    goal: mapBackendGoal(res.data?.data?.goal),
    contribution: res.data?.data?.contribution,
  }
}

