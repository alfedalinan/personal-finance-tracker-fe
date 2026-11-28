/**
 * Centralized API configuration and helper utilities.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012'

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
  return `${cleanBase}${cleanEndpoint}`
}

export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = getApiUrl(endpoint)
  const token = sessionStorage.getItem('auth_token')
  const headers = new Headers(options?.headers || {})
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user')
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
  }

  return response
}

export interface AccountOption {
  id: number;
  name: string;
  type?: string;
  currentBalance?: number;
}

export interface CategoryOption {
  id: number;
  name: string;
  type?: string;
}

export interface CreateTransactionPayload {
  accountId: number;
  categoryId: number;
  description: string;
  amount: number;
}

export async function fetchAccounts(): Promise<AccountOption[]> {
  try {
    const response = await apiFetch('/api/accounts/list')
    if (response.ok) {
      const data = await response.json()
      const list = Array.isArray(data) ? data : (data.accounts || data.data || data.items || [])
      if (list.length > 0) return list
    }
  } catch {
    // fallback below
  }

  try {
    const response = await apiFetch('/api/accounts/summary')
    if (response.ok) {
      const data = await response.json()
      const list = Array.isArray(data) ? data : (data.accounts || data.data || data.items || [])
      return list.map((a: { id: number; name?: string; accountName?: string; type?: string }) => ({
        id: a.id,
        name: a.name || a.accountName || `Account #${a.id}`,
        type: a.type
      }))
    }
  } catch {
    // ignore
  }

  throw new Error('Failed to fetch accounts from server')
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  try {
    const response = await apiFetch('/api/categories/list')
    if (response.ok) {
      const data = await response.json()
      const list = Array.isArray(data) ? data : (data.categories || data.data || data.items || [])
      if (list.length > 0) return list
    }
  } catch {
    // fallback below
  }

  return [
    { id: 1, name: 'Food & Dining', type: 'Expense' },
    { id: 2, name: 'Income', type: 'Income' },
    { id: 3, name: 'Utilities', type: 'Expense' },
    { id: 4, name: 'Transport', type: 'Expense' },
    { id: 5, name: 'Entertainment', type: 'Expense' },
  ]
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Record<string, unknown>> {
  const response = await apiFetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`Failed to create transaction (status ${response.status}): ${errorText}`)
  }
  const text = await response.text()
  return text ? JSON.parse(text) : {}
}
