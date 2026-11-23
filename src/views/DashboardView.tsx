import { useState, useEffect } from 'react'
import { LayoutDashboard, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { apiFetch } from '../services/api'

interface PrimarySavingsResponse {
  id: string
  name: string
  slug: string
  balance: number
  currency: string
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
  const [balance, setBalance] = useState<number | null>(null)
  const [currency, setCurrency] = useState<string>('USD')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrimarySavings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/accounts/slug/primary-savings')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: PrimarySavingsResponse = await response.json()
      setBalance(data.balance)
      if (data.currency) {
        setCurrency(data.currency)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrimarySavings()
  }, [])

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
                onClick={fetchPrimarySavings}
                className="inline-flex items-center px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className={`text-3xl font-bold ${balance !== null && balance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {balance !== null ? formatCurrency(balance, currency) : '$---,--'}
            </div>
          )}
          <div className="flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +12.4% from last month
          </div>
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

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <div className="divide-y divide-slate-100">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                +
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Salary Deposit</p>
                <p className="text-xs text-slate-500">Acme Corp • Today, 9:00 AM</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-emerald-600">+$3,400.00</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                -
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Grocery Store</p>
                <p className="text-xs text-slate-500">Supermarket • Yesterday, 4:15 PM</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-900">-$124.50</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                -
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Electric Bill</p>
                <p className="text-xs text-slate-500">Utility Provider • Nov 18, 2026</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-900">-$85.20</span>
          </div>
        </div>
      </div>
    </div>
  )
}
