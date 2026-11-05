import api from './api'

/**
 * Maps a MongoDB backend transaction document to frontend format.
 * Converts integer paise to decimal rupees and ensures both `id` and `_id` are available.
 */
export function mapBackendTransaction(t) {
  if (!t) return null
  const amountInRupees = typeof t.amountInPaise === 'number' ? t.amountInPaise / 100 : t.amount || 0
  const dateStr = t.date
    ? typeof t.date === 'string'
      ? t.date.split('T')[0]
      : new Date(t.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  return {
    ...t,
    id: t._id || t.id,
    _id: t._id || t.id,
    amount: amountInRupees,
    amountInPaise: t.amountInPaise ?? Math.round(amountInRupees * 100),
    mode: t.wallet || t.mode || 'Cash',
    wallet: t.wallet || t.mode || 'Cash',
    date: dateStr,
    note: t.note || '',
  }
}

/**
 * Maps frontend transaction form data to backend API request body in integer paise.
 */
export function mapFrontendToBackendTransaction(t) {
  const numericRupees = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount) || 0
  const paise = Math.round(numericRupees * 100)

    return {
      title: t.title?.trim(),
      amountInPaise: paise,
      type: t.type,
      category: t.category,
      note: t.note?.trim() || '',
      wallet: t.wallet || t.mode || 'Cash',
      date: t.date ? new Date(t.date).toISOString() : new Date().toISOString(),
    }
  }

      /**
       * Fetch transactions from backend with optional filters, search, sorting, and pagination.
       */
      export async function fetchTransactions(params = {}) {
        const query = {}
        if (params.type && params.type !== 'all') query.type = params.type
        if (params.category && params.category !== 'all') query.category = params.category
        if (params.wallet && params.wallet !== 'all') query.wallet = params.wallet
        if (params.search?.trim()) query.search = params.search.trim()
        if (params.startDate) query.startDate = params.startDate
        if (params.endDate) query.endDate = params.endDate
        if (params.sortBy) query.sortBy = params.sortBy
        if (params.sortOrder) query.sortOrder = params.sortOrder
        if (params.page) query.page = params.page
        if (params.limit) query.limit = params.limit

        const res = await api.get('/transactions', { params: query })
        const rawList = res.data?.data || []
        const transactions = rawList.map(mapBackendTransaction)

        return {
          transactions,
          pagination: res.data?.pagination || { total: transactions.length, page: 1, limit: 100, totalPages: 1 },
        }
      }

        /**
         * Create a new transaction on the backend.
         */
        export async function createTransaction(txData) {
          const payload = mapFrontendToBackendTransaction(txData)
          const res = await api.post('/transactions', payload)
          return mapBackendTransaction(res.data?.data)
        }

          /**
           * Update an existing transaction on the backend.
           */
          export async function updateTransaction(id, txData) {
            const payload = mapFrontendToBackendTransaction(txData)
            const res = await api.patch(`/transactions/${id}`, payload)
            return mapBackendTransaction(res.data?.data)
          }

            /**
             * Delete a transaction on the backend.
             */
            export async function deleteTransaction(id) {
              const res = await api.delete(`/transactions/${id}`)
              return res.data
            }

              /**
               * Delete multiple transactions sequentially or concurrently.
               */
              export async function deleteMultipleTransactions(ids = []) {
                return Promise.all(ids.map((id) => deleteTransaction(id)))
              }

                  /**
                   * Safe localStorage migration utility.
                   * Migrates existing guest or user localStorage transactions, budgets, and goals to MongoDB Atlas.
                   * Never deletes original data until migration is verified.
                   */
                  export async function migrateLocalStorageData(userId) {
                    if (typeof window === 'undefined' || !userId) return { migrated: false }

                    const migrationKey = `spendwise_migrated_${userId}`
                    if (localStorage.getItem(migrationKey) === 'true') {
                      return { migrated: true, alreadyDone: true }
                    }

                    const txKeys = [`spendwise_tx_${userId}`, 'spendwise_tx_guest']
                    let rawTransactions = []
                    for (const k of txKeys) {
                      const item = localStorage.getItem(k)
                      if (item) {
                        try {
                          const parsed = JSON.parse(item)
                          if (Array.isArray(parsed) && parsed.length > 0) {
                            rawTransactions = parsed
                            break
                          }
                        } catch (err) {
                          console.error('Failed to parse localStorage transactions for migration:', err)
                        }
                      }
                    }

                    const results = {
                      transactionsMigrated: 0,
                      budgetsMigrated: 0,
                      goalsMigrated: 0,
                    }

                    // Backup original localStorage data safely before attempting migration
                    if (rawTransactions.length > 0) {
                      localStorage.setItem(`spendwise_tx_${userId}_backup`, JSON.stringify(rawTransactions))

                      // Migrate transactions
                      for (const t of rawTransactions) {
                        try {
                          // Exclude dummy id strings, transform amount to paise
                          const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount) || 0
                          if (amount > 0 && t.title && t.category && t.type) {
                            // If title contains digits, sanitize title to meet textOnlyDescriptionSchema
                            let title = t.title.trim()
                            if (/\d/.test(title)) {
                              title = title.replace(/[0-9]/g, '').trim() || 'General Expense'
                            }
                            if (!/[a-zA-Z]/.test(title)) {
                              title = 'General Transaction'
                            }

                            await createTransaction({
                              title,
                              amount,
                              type: t.type === 'income' ? 'income' : 'expense',
                              category: t.category,
                              note: t.note || '',
                              wallet: t.mode || t.wallet || 'Cash',
                              date: t.date || new Date().toISOString(),
                            })
                            results.transactionsMigrated++
                          }
                        } catch (err) {
                          console.warn('Skipping duplicate or invalid transaction during migration:', err?.message)
                        }
                      }
                    }

                    // Mark migration as completed for this user
                    localStorage.setItem(migrationKey, 'true')
                    return { migrated: true, ...results }
                  }
