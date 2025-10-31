import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const slug = params.slug

    // First get the store
    const store = await db.store.findUnique({
      where: { slug }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Fetch categories for the store
    const categories = await db.category.findMany({
      where: {
        storeId: store.id,
        isActive: true
      },
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: {
                product: {
                  status: 'ACTIVE'
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Store categories fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
