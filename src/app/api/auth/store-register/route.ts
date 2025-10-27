import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, storeSlug, acceptsMarketing } = await request.json()

    if (!email || !storeSlug) {
      return NextResponse.json(
        { error: 'Email and store slug are required' },
        { status: 400 }
      )
    }

    // Find the store by slug
    const store = await db.store.findUnique({
      where: { slug: storeSlug }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Check if customer already exists in this store
    const existingCustomer = await db.storeCustomer.findUnique({
      where: {
        storeId_email: {
          storeId: store.id,
          email: email
        }
      }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'An account with this email already exists in this store' },
        { status: 409 }
      )
    }

    // Hash password if provided
    let hashedPassword: string | null = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // Create the store customer
    const customer = await db.storeCustomer.create({
      data: {
        storeId: store.id,
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        acceptsMarketing: acceptsMarketing || false
      },
      include: {
        store: true
      }
    })

    // Create JWT token with store context
    const token = jwt.sign(
      {
        customerId: customer.id,
        storeId: store.id,
        storeSlug: store.slug,
        email: customer.email,
        type: 'store_customer'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie with store context
    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          logo: store.logo
        }
      }
    })

    response.cookies.set('store_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Store registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}