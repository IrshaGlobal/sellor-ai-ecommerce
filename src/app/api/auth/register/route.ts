import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password, storeName } = await request.json()

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with seller profile first
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'SELLER',
        sellerProfile: {
          create: {
            storeName: storeName,
            storeDescription: `Welcome to ${storeName}!`
          }
        }
      },
      include: {
        sellerProfile: true
      }
    })

    // Generate unique slug
    let slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    let counter = 1
    let originalSlug = slug

    // Check if slug already exists and make it unique
    while (true) {
      try {
        const existingStore = await db.store.findUnique({
          where: { slug }
        })
        
        if (!existingStore) {
          break
        }
        
        slug = `${originalSlug}-${counter}`
        counter++
      } catch (error) {
        break
      }
    }

    // Create store linked to seller profile
    const store = await db.store.create({
      data: {
        name: storeName,
        slug: slug,
        description: `Welcome to ${storeName}!`,
        sellerId: user.sellerProfile!.id
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Fetch user with store and seller profile
    const userWithStore = await db.user.findUnique({
      where: { id: user.id },
      include: {
        sellerProfile: {
          include: {
            stores: true
          }
        }
      }
    })

    const token = jwt.sign(
      {
        userId: userWithStore!.id,
        email: userWithStore!.email,
        role: userWithStore!.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      message: 'Store created successfully',
      user: userWithStore,
      store
    })

    response.cookies.set('seller_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}