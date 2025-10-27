'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)
  const [storeSlug, setStoreSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (pathname.startsWith('/store/')) {
      const slug = pathname.split('/')[2]
      setStoreSlug(slug)
    } else {
      setStoreSlug(null)
    }
  }, [pathname])

  useEffect(() => {
    if (storeSlug) {
      verifySession()
    } else {
      setCustomer(null)
      setIsLoading(false)
    }
  }, [storeSlug])

  const verifySession = async () => {
    try {
      const response = await fetch('/api/auth/verify-store-token', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
        setStoreSlug(data.customer.store.slug)
      } else {
        setCustomer(null)
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = useCallback(async (email: string, password: string, storeSlug: string) => {
    try {
      const response = await fetch('/api/auth/store-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, storeSlug }),
      })

      const data = await response.json()

      if (response.ok) {
        await verifySession()
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const register = useCallback(async (
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
        credentials: 'include',
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
        await verifySession()
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const logout = useCallback(() => {
    fetch('/api/auth/store-logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(() => null)
    setCustomer(null)
    // Don't reset storeSlug as it should come from URL
  }, [])

  const contextValue = useMemo(() => ({
    customer,
    storeSlug,
    isLoading,
    login,
    register,
    logout
  }), [customer, storeSlug, isLoading, login, register, logout])

  return (
    <StoreContext.Provider value={contextValue}>
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