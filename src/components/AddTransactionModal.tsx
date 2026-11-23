import { useState, useEffect, useCallback } from 'react'
import { X, AlertCircle, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react'
import { fetchAccounts, fetchCategories, createTransaction, AccountOption, CategoryOption } from '../services/api'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  const [accounts, setAccounts] = useState<AccountOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState<boolean>(true)
  const [dropdownError, setDropdownError] = useState<string | null>(null)

  const [accountId, setAccountId] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const [touched, setTouched] = useState({
    accountId: false,
    categoryId: false,
    amount: false,
    description: false,
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const loadDropdownData = useCallback(async () => {
    setIsLoadingDropdowns(true)
    setDropdownError(null)
    try {
      const [accs, cats] = await Promise.all([fetchAccounts(), fetchCategories()])
      setAccounts(accs)
      setCategories(cats)
      if (accs.length > 0 && !accountId) {
        setAccountId(String(accs[0].id))
      }
      if (cats.length > 0 && !categoryId) {
        setCategoryId(String(cats[0].id))
      }
    } catch (err: unknown) {
      setDropdownError(err instanceof Error ? err.message : 'Failed to load accounts and categories')
    } finally {
      setIsLoadingDropdowns(false)
    }
  }, [accountId, categoryId])

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null)
      setTouched({ accountId: false, categoryId: false, amount: false, description: false })
      loadDropdownData()
    }
  }, [isOpen, loadDropdownData])

  if (!isOpen) return null

  const isAccountValid = accountId !== '' && !isNaN(Number(accountId)) && Number(accountId) > 0
  const isCategoryValid = categoryId !== '' && !isNaN(Number(categoryId)) && Number(categoryId) > 0
  const isAmountValid = amount.trim() !== '' && !isNaN(Number(amount)) && Number(amount) !== 0
  const isDescriptionValid = description.trim().length > 0

  const isFormValid = isAccountValid && isCategoryValid && isAmountValid && isDescriptionValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ accountId: true, categoryId: true, amount: true, description: true })

    if (!isFormValid) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await createTransaction({
        accountId: Number(accountId),
        categoryId: Number(categoryId),
        description: description.trim(),
        amount: Number(amount),
      })
      onSuccess('Transaction recorded successfully!')
      onClose()
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden transition-all transform">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Add New Transaction</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {dropdownError ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>{dropdownError}</span>
              </div>
              <button
                type="button"
                onClick={loadDropdownData}
                className="inline-flex items-center px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Retry
              </button>
            </div>
          ) : isLoadingDropdowns ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">Loading form options...</p>
            </div>
          ) : (
            <>
              {/* Account Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Account <span className="text-rose-500">*</span>
                </label>
                <select
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value)
                    setTouched((prev) => ({ ...prev, accountId: true }))
                  }}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    touched.accountId && !isAccountValid
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                >
                  <option value="" disabled>Select an account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} {acc.type ? `(${acc.type})` : ''}
                    </option>
                  ))}
                </select>
                {touched.accountId && !isAccountValid && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> Please select a valid account.
                  </p>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value)
                    setTouched((prev) => ({ ...prev, categoryId: true }))
                  }}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    touched.categoryId && !isCategoryValid
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.type ? `(${cat.type})` : ''}
                    </option>
                  ))}
                </select>
                {touched.categoryId && !isCategoryValid && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> Please select a valid category.
                  </p>
                )}
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Amount <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">$</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00 (supports decimals & negative values)"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value)
                      setTouched((prev) => ({ ...prev, amount: true }))
                    }}
                    className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      touched.amount && !isAmountValid
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {touched.amount && !isAmountValid && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> Please enter a valid non-zero amount (decimals and negative numbers supported).
                  </p>
                )}
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grocery shopping, Salary deposit"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setTouched((prev) => ({ ...prev, description: true }))
                  }}
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    touched.description && !isDescriptionValid
                      ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {touched.description && !isDescriptionValid && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> Description is required.
                  </p>
                )}
              </div>

              {submitError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center">
                  <AlertCircle className="w-4 h-4 text-rose-600 mr-2 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </>
          )}

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting || isLoadingDropdowns || Boolean(dropdownError)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Add Transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
