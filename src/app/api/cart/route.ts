import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, storeId } = await request.json()

    if (!productId || !quantity || !storeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get or create customer session (simplified for now)
    let customerId = request.cookies.get('customer_id')?.value

    if (!customerId) {
      // Create a new customer
      const customer = await db.storeCustomer.create({
        data: {
          storeId,
          email: `guest_${Date.now()}@example.com`,
          firstName: 'Guest',
          lastName: 'User'
        }
      })
      customerId = customer.id
    }

    // Check if product exists and has enough inventory
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        variants: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.inventory < quantity) {
      return NextResponse.json(
        { error: 'Not enough inventory' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingCartItem = await db.cartItem.findFirst({
      where: {
        customerId,
        productId,
        storeId
      }
    })

    if (existingCartItem) {
      // Update existing cart item
      const newQuantity = existingCartItem.quantity + quantity
      if (newQuantity > product.inventory) {
        return NextResponse.json(
          { error: 'Not enough inventory' },
          { status: 400 }
        )
      }

      await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      // Create new cart item
      await db.cartItem.create({
        data: {
          customerId,
          productId,
          storeId,
          quantity
        }
      })
    }

    return NextResponse.json({
      message: 'Product added to cart successfully',
      customerId
    })

  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const customerId = request.cookies.get('customer_id')?.value

    if (!customerId) {
      return NextResponse.json([])
    }

    const cartItems = await db.cartItem.findMany({
      where: { customerId },
      include: {
        product: true
      }
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}