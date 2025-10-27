import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Create a sample seller
    const hashedPassword = await bcrypt.hash('seller123', 10)
    
    const seller = await db.user.create({
      data: {
        email: 'seller@example.com',
        password: hashedPassword,
        name: 'John Seller',
        role: 'SELLER'
      }
    })

    // Create seller profile
    const sellerProfile = await db.sellerProfile.create({
      data: {
        userId: seller.id,
        storeName: 'Demo Store',
        storeDescription: 'A wonderful demo store for testing',
        businessEmail: 'seller@example.com',
        isApproved: true,
        subscriptionPlan: 'PROFESSIONAL'
      }
    })

    // Create a store
    const store = await db.store.create({
      data: {
        sellerId: sellerProfile.id,
        name: 'Demo Store',
        slug: 'demo-store',
        description: 'A wonderful demo store for testing ShopHub platform',
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b'
        },
        isActive: true
      }
    })

    // Create sample categories
    const electronicsCategory = await db.category.create({
      data: {
        storeId: store.id,
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets'
      }
    })

    const clothingCategory = await db.category.create({
      data: {
        storeId: store.id,
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel'
      }
    })

    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        shortDescription: 'Premium wireless headphones',
        sku: 'WH-001',
        price: 99.99,
        comparePrice: 149.99,
        status: 'ACTIVE' as const,
        featured: true,
        trackInventory: true,
        inventory: 50,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
        tags: 'electronics,audio,bluetooth'
      },
      {
        name: 'Smart Watch',
        slug: 'smart-watch',
        description: 'Feature-rich smartwatch with health tracking',
        shortDescription: 'Modern smartwatch',
        sku: 'SW-002',
        price: 199.99,
        comparePrice: 299.99,
        status: 'ACTIVE' as const,
        featured: true,
        trackInventory: true,
        inventory: 30,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
        tags: 'electronics,wearable,smart'
      },
      {
        name: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description: 'Comfortable 100% cotton t-shirt',
        shortDescription: 'Basic cotton tee',
        sku: 'CT-003',
        price: 19.99,
        status: 'ACTIVE' as const,
        featured: false,
        trackInventory: true,
        inventory: 100,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
        tags: 'clothing,casual,basic'
      }
    ]

    for (const productData of products) {
      const product = await db.product.create({
        data: {
          ...productData,
          storeId: store.id,
          sellerId: sellerProfile.id
        }
      })

      // Link to appropriate category
      if (productData.tags?.includes('electronics')) {
        await db.productCategory.create({
          data: {
            productId: product.id,
            categoryId: electronicsCategory.id
          }
        })
      } else if (productData.tags?.includes('clothing')) {
        await db.productCategory.create({
          data: {
            productId: product.id,
            categoryId: clothingCategory.id
          }
        })
      }
    }

    // Create a sample customer for this store
    const customerPassword = await bcrypt.hash('customer123', 10)
    const customer = await db.storeCustomer.create({
      data: {
        storeId: store.id,
        email: 'customer@example.com',
        password: customerPassword,
        firstName: 'Jane',
        lastName: 'Customer',
        acceptsMarketing: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        seller: {
          email: 'seller@example.com',
          password: 'seller123'
        },
        customer: {
          email: 'customer@example.com',
          password: 'customer123',
          storeSlug: 'demo-store'
        },
        store: {
          slug: 'demo-store',
          name: 'Demo Store'
        }
      }
    })

  } catch (error) {
    console.error('Seed data error:', error)
    return NextResponse.json(
      { error: 'Failed to create sample data' },
      { status: 500 }
    )
  }
}