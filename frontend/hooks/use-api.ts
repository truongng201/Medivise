import { useState, useCallback } from 'react'
import { AuthManager } from '@/lib/auth'

interface UseApiOptions {
  role: 'patient' | 'doctor'
}

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T = any>({ role }: UseApiOptions) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const request = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await AuthManager.apiRequest(endpoint, options, role)
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [role])

  const get = useCallback((endpoint: string) => {
    return request(endpoint, { method: 'GET' })
  }, [request])

  const post = useCallback((endpoint: string, body?: any) => {
    return request(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
  }, [request])

  const put = useCallback((endpoint: string, body?: any) => {
    return request(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    })
  }, [request])

  const del = useCallback((endpoint: string) => {
    return request(endpoint, { method: 'DELETE' })
  }, [request])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    request,
    get,
    post,
    put,
    delete: del,
    reset
  }
}
