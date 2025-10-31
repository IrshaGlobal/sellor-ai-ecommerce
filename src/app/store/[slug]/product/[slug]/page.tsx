'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ArrowLeft
} from 'lucide-react'
import { useStore } from '@/contexts/StoreContext'

interface ProductVariant {
  id: string
  name: string
  price: number
  inventory: number
  options?: any
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  description?: string
  images: string[]
  inventory: number
  featured: boolean
  status: string
  variants?: ProductVariant[]
  category?: {
    id: string
    name: string
  }
}

interface Review {
  id: string
  rating: number
  comment: string
  author: string
  date: string
}

interface StoreData {
  id: string
  name: string
  slug: string
  logo?: string
  banner?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { customer } = useStore()

  const storeSlug = params.slug as string
  const productSlug = params.product as string

  const [store, setStore] = useState<StoreData | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    fetchStoreData()
    fetchProduct()
    fetchRelatedProducts()
  }, [storeSlug, productSlug])

  const fetchStoreData = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}`)
      if (response.ok) {
        const data = await response.json()
        setStore(data)
      }
    } catch (error) {
      console.error('Failed to fetch store:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}/products`)
      if (response.ok) {
        const products: Product[] = await response.json()
        const foundProduct = products.find(p => p.slug === productSlug)

        if (foundProduct) {
          setProduct(foundProduct)
          // Set first variant as default if variants exist
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            setSelectedVariant(foundProduct.variants[0].id)
          }
          // Mock reviews (in real app, would fetch from database)
          const mockReviews: Review[] = [
            {
              id: '1',
              rating: 5,
              comment: 'Great product! Highly recommended.',
              author: 'John Doe',
              date: '2024-01-15'
            },
            {
              id: '2',
              rating: 4,
              comment: 'Good quality, fast shipping.',
              author: 'Jane Smith',
              date: '2024-01-10'
            }
          ]
          setReviews(mockReviews)

          // Calculate average rating
          if (mockReviews.length > 0) {
            const avgRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length
            setAverageRating(Math.round(avgRating * 10) / 10)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}/products`)
      if (response.ok) {
        const products: Product[] = await response.json()
        // Get 4 random products (excluding current product) for "related products"
        const related = products
          .filter(p => p.slug !== productSlug && p.status === 'ACTIVE')
          .sort(() => Math.random() - 0.5)
          .slice(0, 4)
        setRelatedProducts(related)
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!customer) {
      router.push(`/store/${storeSlug}/auth`)
      return
    }

    if (!product) return

    setIsAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          storeId: store?.id
        })
      })

      if (response.ok) {
        alert('Product added to cart successfully!')
        setQuantity(1)
      } else {
        alert('Failed to add product to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding product to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 99) {
      setQuantity(value)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!store || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">This product doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href={`/store/${storeSlug}`}>Back to Store</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.inventory === 0
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const currentVariant = product.variants?.find(v => v.id === selectedVariant)
  const displayPrice = currentVariant?.price || product.price

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" asChild>
              <Link href={`/store/${storeSlug}`} className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div>
            <div className="relative bg-white rounded-lg overflow-hidden mb-4">
              <div className="aspect-square relative">
                <Image
                  src={product.images?.[currentImageIndex] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                )}
                {hasDiscount && (
                  <Badge variant="destructive">Sale</Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === index
                        ? 'border-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-white p-6 rounded-lg">
            {/* Category */}
            {product.category && (
              <Badge variant="secondary" className="mb-3">
                {product.category.name}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {averageRating > 0 ? `${averageRating} stars` : 'No reviews yet'} ({reviews.length} reviews)
              </span>
            </div>

            <Separator className="mb-4" />

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${displayPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.comparePrice?.toFixed(2)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-green-600 font-medium mt-2">
                  Save ${(product.comparePrice! - product.price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <p className="text-red-600 font-medium">Out of Stock</p>
              ) : (
                <p className="text-green-600 font-medium">
                  {product.inventory} in stock
                </p>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant
                </label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name} - ${variant.price.toFixed(2)}
                        {variant.inventory === 0 && ' (Out of Stock)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity Picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99 || isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-6">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.author}</p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Link href={`/store/${storeSlug}/product/${relatedProduct.slug}`}>
                        <div className="aspect-square relative bg-gray-200">
                          <Image
                            src={relatedProduct.images?.[0] || '/placeholder-product.jpg'}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="p-4">
                      <Link href={`/store/${storeSlug}/product/${relatedProduct.slug}`}>
                        <h3 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 mb-2">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold text-gray-900">
                        ${relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
