import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    const token = authorization?.startsWith('Bearer ')
      ? authorization.split(' ')[1]
      : request.cookies.get('store_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // Fetch the customer with store info
      const customer = await db.storeCustomer.findUnique({
        where: { id: decoded.customerId },
        include: {
          store: true
        }
      })

      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 401 }
        )
      }

      // Verify the token matches the store
      if (customer.storeId !== decoded.storeId) {
        return NextResponse.json(
          { error: 'Invalid store context' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          store: {
            id: customer.store.id,
            name: customer.store.name,
            slug: customer.store.slug,
            logo: customer.store.logo
          }
        }
      })

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}