/**
 * Centralized API configuration and helper utilities.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5088'

/**
 * Helper function to construct full API request URLs.
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
  return `${cleanBase}${cleanEndpoint}`
}

/**
 * Centralized fetch wrapper for making API calls.
 */
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = getApiUrl(endpoint)
  return fetch(url, options)
}
