'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Package, ShoppingCart, Users, BarChart3, Settings, Plus, ArrowRight } from 'lucide-react'

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  isActive?: boolean
  createdAt?: string
}

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  orderTrend?: Array<{ date: string; count: number }>
  revenueTrend?: Array<{ date: string; amount: number }>
  topProducts?: Array<{ id: string; name: string; sold: number }>
  recentOrders?: Array<{ id: string; customer: string; amount: number; date: string }>
}

export default function Dashboard() {
  const [store, setStore] = useState<Store | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
      return
    }

    try {
      // Fetch user data
      const userResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        console.log('User data:', userData) // Debug log
        
        if (userData.user.role !== 'SELLER') {
          console.log('User is not a seller, redirecting to home')
          router.push('/')
          return
        }

        // Fetch store data
        if (userData.user.sellerProfile?.stores && userData.user.sellerProfile.stores.length > 0) {
          console.log('Store found:', userData.user.sellerProfile.stores[0]) // Debug log
          setStore(userData.user.sellerProfile.stores[0])
          fetchStats(userData.user.sellerProfile.stores[0].id)
        } else {
          console.log('No stores found for user')
        }
      } else {
        console.log('User response not ok:', userResponse.status)
        router.push('/auth')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async (storeId: string) => {
    try {
      const response = await fetch(`/api/dashboard/stats?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Store Found</h1>
          <p className="text-gray-600 mb-4">You don't have a store yet.</p>
          <Button onClick={() => router.push('/auth')}>
            Create Your Store
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Sellor.ai</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="w-6 h-6 rounded" />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {store.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="font-medium">{store.name}</span>
                <Badge variant={store.isActive ? 'default' : 'secondary'}>
                  {store.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/store/${store.slug}`} target="_blank">
                  View Store
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back to {store.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your store, products, and track your sales performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with these common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/products">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Products
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Orders
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Store Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Order Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Orders (Last 30 Days)</CardTitle>
              <CardDescription>
                Daily order count trend
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.orderTrend && stats.orderTrend.length > 0 ? (
                <div className="h-48 flex items-end justify-between gap-1">
                  {stats.orderTrend.map((trend, idx) => {
                    const maxCount = Math.max(...stats.orderTrend!.map(t => t.count), 1)
                    const heightPercent = (trend.count / maxCount) * 100
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-primary/60 hover:bg-primary rounded-t-sm transition-colors"
                        style={{ height: `${heightPercent || 5}%`, minHeight: '4px' }}
                        title={`${trend.date}: ${trend.count} orders`}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  No order data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue (Last 30 Days)</CardTitle>
              <CardDescription>
                Daily revenue trend
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.revenueTrend && stats.revenueTrend.length > 0 ? (
                <div className="h-48 flex items-end justify-between gap-1">
                  {stats.revenueTrend.map((trend, idx) => {
                    const maxAmount = Math.max(...stats.revenueTrend!.map(t => t.amount), 1)
                    const heightPercent = (trend.amount / maxAmount) * 100
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-green-600/60 hover:bg-green-600 rounded-t-sm transition-colors"
                        style={{ height: `${heightPercent || 5}%`, minHeight: '4px' }}
                        title={`${trend.date}: $${trend.amount.toFixed(2)}`}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  No revenue data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Best-selling products
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.topProducts && stats.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {stats.topProducts.map((product, idx) => (
                    <div key={product.id} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">#{idx + 1}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sold} sold</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{product.sold}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No sales data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium">${order.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}