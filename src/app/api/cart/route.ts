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

export async function PATCH(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json()
    const customerId = request.cookies.get('customer_id')?.value

    if (!itemId || quantity === undefined || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    // Find cart item
    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId },
      include: {
        product: true
      }
    })

    if (!cartItem || cartItem.customerId !== customerId) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Check inventory
    if (quantity > cartItem.product.inventory) {
      return NextResponse.json(
        { error: 'Not enough inventory' },
        { status: 400 }
      )
    }

    // Update cart item quantity
    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })

    // Return updated cart
    const updatedCart = await db.cartItem.findMany({
      where: { customerId },
      include: {
        product: true
      }
    })

    return NextResponse.json({
      message: 'Cart item updated successfully',
      cart: updatedCart
    })

  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json()
    const customerId = request.cookies.get('customer_id')?.value

    if (!itemId || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find cart item
    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId }
    })

    if (!cartItem || cartItem.customerId !== customerId) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Delete cart item
    await db.cartItem.delete({
      where: { id: itemId }
    })

    // Return updated cart
    const updatedCart = await db.cartItem.findMany({
      where: { customerId },
      include: {
        product: true
      }
    })

    return NextResponse.json({
      message: 'Cart item removed successfully',
      cart: updatedCart
    })

  } catch (error) {
    console.error('Delete cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}