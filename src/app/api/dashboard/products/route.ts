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

    // Fetch products for the store
    const products = await db.product.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        comparePrice: true,
        status: true,
        featured: true,
        inventory: true,
        images: true,
        createdAt: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
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

      const productData = await request.json()
      const storeId = user.sellerProfile.stores[0].id
      const sellerId = user.sellerProfile.id

      // Create product
      const product = await db.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          comparePrice: productData.comparePrice,
          inventory: productData.inventory,
          featured: productData.featured,
          status: productData.status,
          images: productData.images || [],
          storeId,
          sellerId,
          slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          sku: `PRD-${Date.now()}`, // Generate unique SKU
          trackInventory: true,
          requiresShipping: true,
          taxable: true,
          // Create category relation if provided
          ...(productData.categoryId && {
            categories: {
              create: {
                categoryId: productData.categoryId
              }
            }
          })
        }
      })

      // Create variants if provided
      if (productData.variants && productData.variants.length > 0) {
        const variantData = productData.variants.map((variant: any, index: number) => ({
          name: variant.name,
          sku: variant.sku || `${product.sku}-V${index + 1}`,
          price: variant.price,
          comparePrice: variant.comparePrice,
          inventory: variant.inventory,
          productId: product.id,
          position: index,
          options: variant.options || {}
        }))

        await db.productVariant.createMany({
          data: variantData
        })
      }

      return NextResponse.json(product)
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}