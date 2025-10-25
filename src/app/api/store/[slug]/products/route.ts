import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const storeSlug = params.slug

    // First get the store
    const store = await db.store.findUnique({
      where: { slug: storeSlug }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Fetch products for the store
    const products = await db.product.findMany({
      where: { 
        storeId: store.id,
        status: 'ACTIVE'
      },
      orderBy: { 
        featured: 'desc',
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        variants: {
          where: {
            inventory: {
              gt: 0
            }
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Store products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}