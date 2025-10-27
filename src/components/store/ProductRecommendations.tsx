'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, ShoppingCart, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  category?: {
    id: string
    name: string
  }
  featured: boolean
  status?: string
}

interface Recommendation {
  productId: string
  reason: string
  score: number
  product: Product
}

interface ProductRecommendationsProps {
  currentProductId?: string
  storeSlug: string
  type?: 'similar' | 'complementary' | 'trending' | 'personalized'
  title?: string
  maxItems?: number
}

export default function ProductRecommendations({
  currentProductId,
  storeSlug,
  type = 'similar',
  title = 'Recommended for You',
  maxItems = 4
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [storeSlug])

  useEffect(() => {
    if (allProducts.length > 0) {
      fetchRecommendations()
    }
  }, [allProducts, currentProductId, type])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}/products`)
      if (response.ok) {
        const products = await response.json()
        setAllProducts(products.filter((p: Product) => p.status === 'ACTIVE'))
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchRecommendations = async () => {
    if (!allProducts.length) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: currentProductId,
          allProducts,
          recommendationType: type,
          userHistory: [], // TODO: Get from user context
          viewedProducts: [], // TODO: Get from user context
          cartItems: [] // TODO: Get from cart context
        })
      })

      const result = await response.json()

      if (result.success) {
        setRecommendations(result.recommendations.slice(0, maxItems))
      } else {
        throw new Error(result.error || 'Failed to load recommendations')
      }
    } catch (error: any) {
      console.error('Failed to fetch recommendations:', error)
      // Fallback to random products
      const fallbackProducts = allProducts
        .filter(p => p.id !== currentProductId)
        .sort(() => Math.random() - 0.5)
        .slice(0, maxItems)

      setRecommendations(fallbackProducts.map(product => ({
        productId: product.id,
        reason: 'Popular product you might like',
        score: 0.8,
        product
      })))
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (product: Product) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      })

      if (response.ok) {
        toast({
          title: 'Added to cart!',
          description: `${product.name} has been added to your cart.`
        })
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.productId} className="group">
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="relative">
                  {rec.product.images?.[0] ? (
                    <img
                      src={rec.product.images[0]}
                      alt={rec.product.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-1"></div>
                        <p className="text-xs">No image</p>
                      </div>
                    </div>
                  )}
                  
                  {rec.product.featured && (
                    <Badge className="absolute top-2 left-2 text-xs">
                      Featured
                    </Badge>
                  )}
                  
                  {rec.score > 0.9 && (
                    <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                      {Math.round(rec.score * 100)}% Match
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/store/${storeSlug}/product/${rec.product.slug}`}>
                          {rec.product.name}
                        </Link>
                      </h4>
                      {rec.product.category && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {rec.product.category.name}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm">${rec.product.price.toFixed(2)}</span>
                        {rec.product.comparePrice && (
                          <span className="text-xs text-gray-500 line-through ml-1">
                            ${rec.product.comparePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rec.reason}
                    </p>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 text-xs"
                        onClick={() => addToCart(rec.product)}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/store/${storeSlug}/product/${rec.product.slug}`}>
                          <Eye className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              AI-powered recommendations based on product analysis and user preferences
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}