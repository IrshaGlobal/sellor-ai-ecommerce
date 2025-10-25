import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const customerId = request.headers.get('x-customer-id')
    const storeId = request.headers.get('x-store-id')

    if (!customerId || !storeId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const cartItems = await db.cartItem.findMany({
      where: {
        customerId: customerId,
        storeId: storeId
      },
      include: {
        product: {
          include: {
            images: true
          }
        },
        variant: true
      }
    })

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.variant?.price || item.product.price
      return total + (price * item.quantity)
    }, 0)

    return NextResponse.json({
      items: cartItems,
      subtotal,
      itemCount: cartItems.reduce((total, item) => total + item.quantity, 0)
    })

  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const customerId = request.headers.get('x-customer-id')
    const storeId = request.headers.get('x-store-id')

    if (!customerId || !storeId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, variantId, quantity } = await request.json()

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    // Verify product belongs to this store
    const product = await db.product.findFirst({
      where: {
        id: productId,
        storeId: storeId
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found in this store' },
        { status: 404 }
      )
    }

    // Check inventory
    if (variantId) {
      const variant = await db.productVariant.findUnique({
        where: { id: variantId }
      })
      
      if (!variant || variant.inventory < quantity) {
        return NextResponse.json(
          { error: 'Insufficient inventory' },
          { status: 400 }
        )
      }
    } else if (product.trackInventory && product.inventory < quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      )
    }

    // Add or update cart item
    const cartItem = await db.cartItem.upsert({
      where: {
        customerId_storeId_productId_variantId: {
          customerId: customerId,
          storeId: storeId,
          productId: productId,
          variantId: variantId || null
        }
      },
      update: {
        quantity: {
          increment: quantity
        }
      },
      create: {
        customerId: customerId,
        storeId: storeId,
        productId: productId,
        variantId: variantId,
        quantity: quantity
      },
      include: {
        product: true,
        variant: true
      }
    })

    return NextResponse.json({
      success: true,
      cartItem
    })

  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const customerId = request.headers.get('x-customer-id')
    const storeId = request.headers.get('x-store-id')

    if (!customerId || !storeId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, variantId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    await db.cartItem.deleteMany({
      where: {
        customerId: customerId,
        storeId: storeId,
        productId: productId,
        variantId: variantId || null
      }
    })

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}