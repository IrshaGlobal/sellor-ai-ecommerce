'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, User, DollarSign, Calendar, Eye, CheckCircle, Truck, XCircle } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  fulfillmentStatus: string
  total: number
  currency: string
  createdAt: string
  customer: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    total: number
    image?: string
    product: {
      id: string
      name: string
      images: string[]
    }
  }>
}

const statusColors = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PROCESSING: 'purple',
  SHIPPED: 'green',
  DELIVERED: 'green',
  CANCELLED: 'red'
}

const paymentStatusColors = {
  PENDING: 'yellow',
  PAID: 'green',
  FAILED: 'red',
  REFUNDED: 'gray'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [store, setStore] = useState<any>(null)
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
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        
        if (userData.user.role !== 'SELLER' || !userData.user.sellerProfile?.stores || userData.user.sellerProfile.stores.length === 0) {
          router.push('/dashboard')
          return
        }

        setStore(userData.user.sellerProfile.stores[0])
        fetchOrders(userData.user.sellerProfile.stores[0].id)
      } else {
        router.push('/auth')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOrders = async (storeId: string) => {
    try {
      const response = await fetch(`/api/dashboard/orders?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/dashboard/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchOrders(store.id)
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status')
    }
  }

  const getStatusBadge = (status: string, type: 'order' | 'payment' | 'fulfillment') => {
    const colors = type === 'order' ? statusColors : type === 'payment' ? paymentStatusColors : statusColors
    const color = colors[status as keyof typeof colors] || 'gray'
    
    return (
      <Badge variant={color as any}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">Orders</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">When customers make purchases, orders will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Orders List */}
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(order.status, 'order')}
                        {getStatusBadge(order.paymentStatus, 'payment')}
                        {getStatusBadge(order.fulfillmentStatus, 'fulfillment')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>
                          {order.customer.firstName && order.customer.lastName 
                            ? `${order.customer.firstName} ${order.customer.lastName}`
                            : order.customer.email
                          }
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            {item.image || item.product.images?.[0] ? (
                              <img
                                src={item.image || item.product.images[0]}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${item.total.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Total and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">
                            Total: ${order.total.toFixed(2)} {order.currency}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Link>
                          </Button>
                          
                          {/* Status Update Actions */}
                          {order.status === 'PENDING' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                          )}
                          
                          {order.status === 'CONFIRMED' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                            >
                              <Package className="h-4 w-4 mr-1" />
                              Process
                            </Button>
                          )}
                          
                          {order.status === 'PROCESSING' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Ship
                            </Button>
                          )}
                          
                          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}