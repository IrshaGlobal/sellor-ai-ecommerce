import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const storeSlug = params.slug

    // Fetch store by slug
    const store = await db.store.findUnique({
      where: { slug },
      include: {
        seller: {
          select: {
            id: true,
            storeName: true,
            storeDescription: true
          }
        }
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    if (!store.isActive) {
      return NextResponse.json(
        { error: 'Store is not active' },
        { status: 404 }
      )
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('Store fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}