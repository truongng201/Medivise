import { redirect } from 'next/navigation'

export interface AuthData {
  account: {
    role: string
    profile_picture_url: string
    email: string
    account_id: number
  }
  access_token: string
  refresh_token: string
}

export class AuthManager {
  private static readonly AUTH_KEY = 'authData'
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

  /**
   * Get auth data from localStorage
   */
  static getAuthData(): AuthData | null {
    if (typeof window === 'undefined') return null
    
    try {
      const authDataStr = localStorage.getItem(this.AUTH_KEY)
      if (!authDataStr) return null
      
      return JSON.parse(authDataStr) as AuthData
    } catch (error) {
      console.error('Error parsing auth data:', error)
      this.clearAuthData()
      return null
    }
  }

  /**
   * Set auth data in localStorage
   */
  static setAuthData(authData: AuthData): void {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData))
  }

  /**
   * Clear auth data from localStorage
   */
  static clearAuthData(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.AUTH_KEY)
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getAuthData() !== null
  }

  /**
   * Redirect to login if not authenticated
   */
  static requireAuth(): AuthData {
    const authData = this.getAuthData()
    if (!authData) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('Authentication required')
    }
    return authData
  }

  /**
   * Get new access token using refresh token
   */
  static async refreshAccessToken(role: 'patient' | 'doctor'): Promise<string | null> {
    const authData = this.getAuthData()
    if (!authData) return null

    try {
      const endpoint = '/api/v1/auth/get_new_access_token'
       

      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: authData.refresh_token,
          role: authData.account.role
        })
      })

      if (response.ok) {
        const data = await response.json()
        const newAccessToken = data.data?.access_token || data.data?.access_token || data.access_token

        if (newAccessToken) {
          // Update the access token in storage
          const updatedAuthData = {
            ...authData,
            access_token: newAccessToken
          }
          this.setAuthData(updatedAuthData)
          return newAccessToken
        }
      } else {
        console.error('Failed to refresh token:', response.status, response.statusText)
      }

      return null
    } catch (error) {
      console.error('Error refreshing access token:', error)
      return null
    }
  }

  /**
   * Make authenticated API request with automatic token refresh
   */
  static async authenticatedRequest(
    url: string, 
    options: RequestInit = {}, 
    role: 'patient' | 'doctor'
  ): Promise<Response> {
    const authData = this.getAuthData()
    if (!authData) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('Authentication required')
    }

    // Add authorization header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${authData.access_token}`,
      ...options.headers
    }

    const requestOptions = {
      ...options,
      headers
    }

    // Make the first request
    let response = await fetch(url, requestOptions)

    // If we get 401, try to refresh token
    if (response.status === 401) {
      const newAccessToken = await this.refreshAccessToken(role)
      
      if (newAccessToken) {
        // Retry with new token
        const updatedHeaders = {
          ...headers,
          'Authorization': `${newAccessToken}`
        }
        
        response = await fetch(url, {
          ...requestOptions,
          headers: updatedHeaders
        })
      } else {
        // Refresh failed, redirect to login
        this.clearAuthData()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        throw new Error('Authentication failed')
      }
    }

    return response
  }

  /**
   * Get patient info with automatic token refresh
   */
  static async getPatientInfo(): Promise<any> {
    return this.apiRequest('/api/v1/patient/get_patient_info', { method: 'GET' }, 'patient')
  }

  /**
   * Get doctor info with automatic token refresh
   */
  static async getDoctorInfo(): Promise<any> {
    return this.apiRequest('/api/v1/doctor/get_doctor_info', { method: 'GET' }, 'doctor')
  }

  /**
   * Make an API request to any endpoint with auth handling
   */
  static async apiRequest(
    endpoint: string,
    options: RequestInit = {},
    role: 'patient' | 'doctor'
  ): Promise<any> {
    const url = `${this.API_BASE_URL}${endpoint}`
    
    try {
      const response = await this.authenticatedRequest(url, options, role)
      
      if (response.ok) {
        const data = await response.json()
        return data.data || data
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || `API request failed with status ${response.status}`)
      }
    } catch (error) {
      console.error(`Error making API request to ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    this.clearAuthData()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}
