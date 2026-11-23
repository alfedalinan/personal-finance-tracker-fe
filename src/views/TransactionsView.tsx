import { ArrowUpDown, Search, Filter, Plus } from 'lucide-react'

export default function TransactionsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500">Manage and view all your income and expense records.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
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
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">Salary Deposit</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Income</span></td>
                <td className="py-4 px-6 text-slate-500">Nov 23, 2026</td>
                <td className="py-4 px-6 text-right font-semibold text-emerald-600">+$3,400.00</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">Grocery Store</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">Food & Dining</span></td>
                <td className="py-4 px-6 text-slate-500">Nov 22, 2026</td>
                <td className="py-4 px-6 text-right font-semibold text-slate-900">-$124.50</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">Electric Bill</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">Utilities</span></td>
                <td className="py-4 px-6 text-slate-500">Nov 18, 2026</td>
                <td className="py-4 px-6 text-right font-semibold text-slate-900">-$85.20</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">Coffee Shop</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">Food & Dining</span></td>
                <td className="py-4 px-6 text-slate-500">Nov 17, 2026</td>
                <td className="py-4 px-6 text-right font-semibold text-slate-900">-$4.75</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">Freelance Project</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Income</span></td>
                <td className="py-4 px-6 text-slate-500">Nov 15, 2026</td>
                <td className="py-4 px-6 text-right font-semibold text-emerald-600">+$1,450.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
