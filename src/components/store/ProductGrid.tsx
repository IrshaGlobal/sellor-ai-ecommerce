'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useStore } from '@/contexts/StoreContext'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  comparePrice?: number
  images?: string[]
  status: string
  featured: boolean
  inventory: number
}

interface ProductGridProps {
  products: Product[]
  storeSlug: string
}

export function ProductGrid({ products, storeSlug }: ProductGridProps) {
  const { customer } = useStore()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async (productId: string) => {
    if (!customer) {
      window.location.href = `/store/${storeSlug}/login`
      return
    }

    setAddingToCart(productId)
    try {
      const response = await fetch(`/api/store/${storeSlug}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      })

      if (response.ok) {
        // Show success message or update cart count
        console.log('Added to cart')
      } else {
        console.error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No products found in this store.</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const imageUrl = product.images?.[0] || '/placeholder-product.jpg'
        const isOutOfStock = product.inventory === 0
        const hasDiscount = product.comparePrice && product.comparePrice > product.price

        return (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <Link href={`/store/${storeSlug}/product/${product.slug}`}>
                  <div className="aspect-square relative">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Featured
                    </Badge>
                  )}
                  {hasDiscount && (
                    <Badge variant="destructive">
                      Sale
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/store/${storeSlug}/product/${product.slug}`}>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.comparePrice?.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Rating placeholder */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(0)</span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={isOutOfStock || addingToCart === product.id}
                >
                  {addingToCart === product.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : isOutOfStock ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}