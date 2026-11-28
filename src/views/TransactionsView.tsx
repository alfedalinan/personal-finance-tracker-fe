import { useState, useEffect } from 'react'
import { ArrowUpDown, Search, Filter, Plus, CheckCircle2 } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'
import { apiFetch } from '../services/api'
import { formatTransactionDate } from '../utils/dateUtils'

interface TransactionItem {
  id: number | string
  description: string
  category?: string
  categoryName?: string
  categoryType?: string
  dateOfTransaction: string
  amount: number
  accountName?: string
}

export default function TransactionsView() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/accounts/summary')
      if (response.ok) {
        const data = await response.json()
        const accs = Array.isArray(data) ? data : (data.accounts || data.data || data.items || [])
        const allTx: TransactionItem[] = []
        accs.forEach((acc: { name?: string; transactions?: TransactionItem[] }) => {
          if (Array.isArray(acc.transactions)) {
            const enriched = acc.transactions.map(tx => ({
              ...tx,
              accountName: acc.name || 'Unknown Account'
            }))
            allTx.push(...enriched)
          }
        })
        setTransactions(allTx)
        return
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleSuccess = (msg: string) => {
    setToastMessage(msg)
    fetchTransactions()
    const timer = setTimeout(() => setToastMessage(null), 4000)
    return () => clearTimeout(timer)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="text-sm font-medium">Failed to load transactions: {error}</div>
          <button
            onClick={fetchTransactions}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500">Manage and view all your income and expense records.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button className="inline-flex items-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors">
            <Filter className="w-4 h-4 mr-2 text-slate-500" />
            Filter
          </button>
          <button className="inline-flex items-center px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors">
            <ArrowUpDown className="w-4 h-4 mr-2 text-slate-500" />
            Sort By
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Account</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    {isLoading ? 'Loading transactions...' : 'No transactions recorded yet.'}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isIncome = tx.categoryType === 'Income' || tx.amount > 0
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">{tx.description}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{tx.accountName || '-'}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-750'}`}>
                          {tx.categoryName ?? tx.category ?? 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">{formatTransactionDate(tx.dateOfTransaction)}</td>
                      <td className={`py-4 px-6 text-right font-semibold ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {isIncome ? `+$${Math.abs(tx.amount).toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

