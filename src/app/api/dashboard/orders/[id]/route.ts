import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // Fetch user to verify store ownership
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        include: {
          sellerProfile: {
            include: {
              stores: true
            }
          }
        }
      })

      if (!user || user.role !== 'SELLER' || !user.sellerProfile?.stores || user.sellerProfile.stores.length === 0) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      const { status } = await request.json()
  const params = await context.params
  const orderId = params.id
  const id = orderId
      const storeId = user.sellerProfile.stores[0].id

      // Verify order belongs to store
      const order = await db.order.findFirst({
        where: { 
          id,
          storeId 
        }
      })

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      // Update order status
      const updatedOrder = await db.order.update({
        where: { id },
        data: { status }
      })

      return NextResponse.json(updatedOrder)
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}