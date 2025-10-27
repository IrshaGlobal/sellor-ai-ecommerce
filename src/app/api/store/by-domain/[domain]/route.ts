import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  context: { params: Promise<{ domain: string }> }
) {
  try {
    const params = await context.params
    const domain = params.domain

    // Find store by custom domain
    const store = await db.store.findFirst({
      where: {
        customDomain: domain,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        customDomain: true,
        logo: true,
        banner: true,
        theme: true
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error finding store by domain:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}