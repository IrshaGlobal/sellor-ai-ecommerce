'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ShoppingCart, Store, Star, Filter, Grid, List } from 'lucide-react'
import AIChatWidget from '@/components/store/AIChatWidget'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  comparePrice?: number
  images: string[]
  status: string
  featured: boolean
  inventory: number
  category?: {
    id: string
    name: string
  }
  variants?: Array<{
    id: string
    name: string
    price: number
    inventory: number
    options: any
  }>
}

interface StoreData {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  banner?: string
  settings?: any
}

export default function StorePage() {
  const params = useParams()
  const storeSlug = params.slug as string
  
  const [store, setStore] = useState<StoreData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (storeSlug) {
      fetchStoreData()
      fetchProducts()
      fetchCategories()
    }
  }, [storeSlug])

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

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}/categories`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = !selectedCategory || product.category?.id === selectedCategory
      return matchesSearch && matchesCategory && product.status === 'ACTIVE'
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        default:
          return 0
      }
    })

  const addToCart = async (product: Product) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          storeId: store?.id
        })
      })

      if (response.ok) {
        // Update cart count or show success message
        alert('Product added to cart!')
      } else {
        alert('Failed to add product to cart')
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add product to cart')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-4">This store doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      {store.banner && (
        <div className="relative h-64 bg-gray-200">
          <img
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="flex items-center justify-center space-x-3 mb-4">
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="w-16 h-16 rounded-lg" />
                ) : (
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <Store className="w-8 h-8" />
                  </div>
                )}
                <h1 className="text-4xl font-bold">{store.name}</h1>
              </div>
              {store.description && (
                <p className="text-lg max-w-2xl mx-auto">{store.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation and Search */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href={`/store/${storeSlug}`} className="flex items-center space-x-2">
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="w-8 h-8 rounded" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                )}
                <span className="font-semibold">{store.name}</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button variant="outline" size="sm" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        !selectedCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
                <div>
                  <h3 className="font-medium mb-3">View</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredProducts.map((product) => (
                  <Card key={product.id} className={viewMode === 'list' ? 'flex' : ''}>
                    <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={`object-cover rounded-t-lg ${
                            viewMode === 'list' ? 'w-full h-48 rounded-l-lg rounded-t-none' : 'w-full h-48'
                          }`}
                        />
                      ) : (
                        <div className={`bg-gray-200 flex items-center justify-center ${
                          viewMode === 'list' ? 'w-full h-48 rounded-l-lg rounded-t-none' : 'w-full h-48 rounded-t-lg'
                        }`}>
                          <div className="text-gray-400 text-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                            <p className="text-sm">No image</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          {product.category && (
                            <Badge variant="secondary" className="text-xs mb-2">
                              {product.category.name}
                            </Badge>
                          )}
                        </div>
                        {product.featured && (
                          <Badge variant="default" className="text-xs">Featured</Badge>
                        )}
                      </div>
                      
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                          {product.comparePrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.comparePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => addToCart(product)}
                          disabled={product.inventory === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`/store/${storeSlug}/product/${product.slug}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget 
        storeContext={{
          name: store.name,
          description: store.description,
          products: products.slice(0, 10) // Send first 10 products for context
        }}
      />
    </div>
  )
}