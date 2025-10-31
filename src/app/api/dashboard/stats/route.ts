import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID required' },
        { status: 400 }
      )
    }

    // Calculate total products
    const totalProducts = await db.product.count({
      where: { storeId, status: 'ACTIVE' }
    })

    // Calculate total orders
    const totalOrders = await db.order.count({
      where: { storeId, status: 'COMPLETED' }
    })

    // Calculate total revenue from completed orders
    const orders = await db.order.findMany({
      where: { storeId, status: 'COMPLETED' },
      select: { total: true }
    })
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Calculate total unique customers
    const customers = await db.order.findMany({
      where: { storeId, status: 'COMPLETED' },
      select: { customerId: true },
      distinct: ['customerId']
    })
    const totalCustomers = customers.length

    // Calculate order trend (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const orderTrendData = await db.order.findMany({
      where: {
        storeId,
        status: 'COMPLETED',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { createdAt: true }
    })

    // Group orders by date
    const orderTrendMap = new Map<string, number>()
    orderTrendData.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      orderTrendMap.set(date, (orderTrendMap.get(date) || 0) + 1)
    })

    const orderTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      return {
        date: dateStr,
        count: orderTrendMap.get(dateStr) || 0
      }
    })

    // Calculate revenue trend (last 30 days)
    const revenueTrendData = await db.order.findMany({
      where: {
        storeId,
        status: 'COMPLETED',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { createdAt: true, total: true }
    })

    const revenueTrendMap = new Map<string, number>()
    revenueTrendData.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      revenueTrendMap.set(date, (revenueTrendMap.get(date) || 0) + (order.total || 0))
    })

    const revenueTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      return {
        date: dateStr,
        amount: revenueTrendMap.get(dateStr) || 0
      }
    })

    // Get top products
    const topProducts = await db.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { storeId, status: 'COMPLETED' }
      },
      _sum: { quantity: true }
    })

    const topProductsWithNames = await Promise.all(
      topProducts
        .sort((a, b) => (b._sum.quantity || 0) - (a._sum.quantity || 0))
        .slice(0, 5)
        .map(async (item) => {
          const product = await db.product.findUnique({
            where: { id: item.productId },
            select: { name: true }
          })
          return {
            id: item.productId,
            name: product?.name || 'Unknown Product',
            sold: item._sum.quantity || 0
          }
        })
    )

    // Get recent orders
    const recentOrders = await db.order.findMany({
      where: { storeId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        customerId: true,
        total: true,
        createdAt: true,
        customer: {
          select: { firstName: true, lastName: true }
        }
      }
    })

    const recentOrdersFormatted = recentOrders.map(order => ({
      id: order.id,
      customer: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Guest',
      amount: order.total || 0,
      date: order.createdAt.toISOString().split('T')[0]
    }))

    const stats = {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      orderTrend,
      revenueTrend,
      topProducts: topProductsWithNames,
      recentOrders: recentOrdersFormatted
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}