'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface StoreCustomer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  store: {
    id: string
    name: string
    slug: string
    logo?: string
  }
}

interface StoreContextType {
  customer: StoreCustomer | null
  storeSlug: string | null
  isLoading: boolean
  login: (email: string, password: string, storeSlug: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, firstName: string, lastName: string, storeSlug: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)
  const [storeSlug, setStoreSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Extract store slug from current path
    const path = window.location.pathname
    if (path.startsWith('/store/')) {
      const slug = path.split('/')[2]
      setStoreSlug(slug)
    }
  }, [])

  useEffect(() => {
    // Check for existing token on mount and when storeSlug changes
    if (storeSlug) {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('store_token='))
        ?.split('=')[1]

      if (token) {
        verifyToken(token)
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [storeSlug])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-store-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
        setStoreSlug(data.customer.store.slug)
      } else {
        // Remove invalid token
        document.cookie = 'store_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      // Remove invalid token
      document.cookie = 'store_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string, storeSlug: string) => {
    try {
      const response = await fetch('/api/auth/store-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, storeSlug }),
      })

      const data = await response.json()

      if (response.ok) {
        setCustomer(data.customer)
        setStoreSlug(storeSlug)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    storeSlug: string
  ) => {
    try {
      const response = await fetch('/api/auth/store-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName, 
          storeSlug,
          acceptsMarketing: false
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setCustomer(data.customer)
        setStoreSlug(storeSlug)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    // Remove token
    document.cookie = 'store_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setCustomer(null)
    // Don't reset storeSlug as it should come from URL
  }

  return (
    <StoreContext.Provider value={{
      customer,
      storeSlug,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}