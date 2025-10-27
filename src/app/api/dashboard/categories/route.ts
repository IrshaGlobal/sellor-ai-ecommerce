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

    // Fetch categories for the store
    const categories = await db.category.findMany({
      where: { storeId },
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : request.cookies.get('seller_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }
    
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

      const categoryData = await request.json()
      const storeId = user.sellerProfile.stores[0].id

      // Get the highest position to place new category at the end
      const lastCategory = await db.category.findFirst({
        where: { storeId },
        orderBy: { position: 'desc' }
      })

      const newPosition = lastCategory ? lastCategory.position + 1 : 0

      // Create category
      const category = await db.category.create({
        data: {
          name: categoryData.name,
          slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: categoryData.description,
          storeId,
          position: newPosition,
          isActive: true
        }
      })

      return NextResponse.json(category)
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}