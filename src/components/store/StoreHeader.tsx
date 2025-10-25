'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useStore } from '@/contexts/StoreContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, User, Search, Menu } from 'lucide-react'

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  banner?: string
  theme?: any
}

interface StoreHeaderProps {
  store: Store
}

export function StoreHeader({ store }: StoreHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { customer, logout } = useStore()

  useEffect(() => {
    if (customer) {
      fetchCartCount()
    }
  }, [customer, store.slug])

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`/api/store/${store.slug}/cart`)
      if (response.ok) {
        const data = await response.json()
        setCartCount(data.itemCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/store/${store.slug}`} className="flex items-center space-x-2">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {store.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-xl font-bold text-gray-900">
                {store.name}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href={`/store/${store.slug}`}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
            <Link 
              href={`/store/${store.slug}/products`}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Products
            </Link>
            <Link 
              href={`/store/${store.slug}/about`}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              About
            </Link>
            <Link 
              href={`/store/${store.slug}/contact`}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link href={`/store/${store.slug}/cart`}>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            {/* User Account */}
            {customer ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/store/${store.slug}/account`}>
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/store/${store.slug}/orders`}>
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={`/store/${store.slug}/auth`}>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link 
                href={`/store/${store.slug}`}
                className="text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                Home
              </Link>
              <Link 
                href={`/store/${store.slug}/products`}
                className="text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                Products
              </Link>
              <Link 
                href={`/store/${store.slug}/about`}
                className="text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                About
              </Link>
              <Link 
                href={`/store/${store.slug}/contact`}
                className="text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}