import { useState, useEffect } from 'react'
import { LayoutDashboard, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Plus } from 'lucide-react'
import { apiFetch } from '../services/api'

interface Transaction {
  id: number | string
  description: string
  category?: string
  date: string
  amount: number
}

interface AccountSummary {
  id: number | string
  name: string
  type: string
  currentBalance: number
  slug?: string
  transactions?: Transaction[]
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  const absVal = Math.abs(amount)
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absVal)

  if (amount < 0) {
    return `-${formatted}`
  }
  return formatted
}

export default function DashboardView() {
  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccountsSummary = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/accounts/summary')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: AccountSummary[] = await response.json()
      setAccounts(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts summary')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccountsSummary()
  }, [])

  const totalBalance = accounts.reduce((acc, account) => acc + (account.currentBalance ?? 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your financial activity and balances.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Total Balance</span>
            <Wallet className="w-5 h-5 text-indigo-600" />
          </div>
          {isLoading ? (
            <div className="text-3xl font-bold text-slate-300 animate-pulse">$---,--</div>
          ) : error ? (
            <div className="space-y-2 py-1">
              <div className="text-xs text-rose-600 font-medium">Failed to load balance</div>
              <button
                onClick={fetchAccountsSummary}
                className="inline-flex items-center px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className={`text-3xl font-bold ${totalBalance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {formatCurrency(totalBalance)}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Monthly Income</span>
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">$4,850.00</div>
          <div className="flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +4.1% vs average
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Monthly Expenses</span>
            <ArrowUpRight className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">$1,920.40</div>
          <div className="flex items-center text-xs text-rose-600 font-medium">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            -2.3% vs average
          </div>
        </div>
      </div>

      {/* Error Banner if API fails */}
      {error && !isLoading && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="text-sm font-medium">Failed to load account summaries: {error}</div>
          <button
            onClick={fetchAccountsSummary}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton for Accounts */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-slate-200 rounded"></div>
                  <div className="h-4 w-24 bg-slate-100 rounded"></div>
                </div>
                <div className="h-8 w-28 bg-slate-200 rounded"></div>
              </div>
              <div className="h-20 bg-slate-50 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty Account State */}
      {!isLoading && !error && accounts.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">No accounts found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Get started by linking your bank account or adding a new financial account to view your consolidated balance and recent transactions.
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Link Account
          </button>
        </div>
      )}

      {/* Accounts & Transaction Lists */}
      {!isLoading && !error && accounts.length > 0 && (
        <div className="space-y-6">
          {accounts.map((account) => (
            <div key={account.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{account.type}</h2>
                  <p className="text-sm text-slate-500">{account.name}</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Balance</div>
                  <div className={`text-2xl font-bold ${account.currentBalance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {formatCurrency(account.currentBalance)}
                  </div>
                </div>
              </div>

              {/* Transactions Section */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent Transactions</h3>
                {!account.transactions || account.transactions.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No Current Transaction at this point
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          <th className="py-2.5 px-4">Description</th>
                          <th className="py-2.5 px-4">Category</th>
                          <th className="py-2.5 px-4">Date</th>
                          <th className="py-2.5 px-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {account.transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-slate-900">{tx.description}</td>
                            <td className="py-3 px-4">
                              {tx.category ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                  {tx.category}
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                            <td className={`py-3 px-4 text-right font-semibold ${tx.amount < 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                              {formatCurrency(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
