import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password, storeSlug } = await request.json()

    if (!email || !password || !storeSlug) {
      return NextResponse.json(
        { error: 'Email, password, and store slug are required' },
        { status: 400 }
      )
    }

    // Find the store by slug
    const store = await db.store.findUnique({
      where: { slug: storeSlug },
      include: { seller: true }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Find the customer in this specific store
    const customer = await db.storeCustomer.findUnique({
      where: {
        storeId_email: {
          storeId: store.id,
          email: email
        }
      },
      include: {
        store: true
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password (if customer has password)
    if (customer.password) {
      const isPasswordValid = await bcrypt.compare(password, customer.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
    } else if (password) {
      // If customer doesn't have password but one was provided
      return NextResponse.json(
        { error: 'Account exists but uses email-only login. Please use email login option.' },
        { status: 401 }
      )
    }

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
    console.error('Store login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}