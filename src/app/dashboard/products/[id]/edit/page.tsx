'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ArrowLeft, Save, Package, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import AIDescriptionGenerator from '@/components/dashboard/AIDescriptionGenerator'
import AIImageGenerator from '@/components/dashboard/AIImageGenerator'
import SEOOptimizer from '@/components/dashboard/SEOOptimizer'

interface Variant {
  id?: string
  name: string
  sku: string
  price: string
  inventory: string
  options: { size?: string; color?: string; material?: string; [key: string]: string | undefined }
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [store, setStore] = useState<any>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState<Variant[]>([
    { name: '', sku: '', price: '', inventory: '', options: {} }
  ])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    inventory: '0',
    featured: false,
    status: 'ACTIVE'
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (store) {
      fetchCategories()
      fetchProduct()
    }
  }, [store])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/dashboard/categories?storeId=${store.id}`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/dashboard/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const product = await response.json()

        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price.toString(),
          comparePrice: product.comparePrice?.toString() || '',
          inventory: product.inventory.toString(),
          featured: product.featured || false,
          status: product.status || 'ACTIVE'
        })

        setUploadedImages(product.images || [])
        setSelectedCategory(product.categoryId || '')

        if (product.variants && product.variants.length > 0) {
          setHasVariants(true)
          setVariants(product.variants.map((v: any) => ({
            id: v.id,
            name: v.name,
            sku: v.sku || '',
            price: v.price.toString(),
            inventory: v.inventory.toString(),
            options: v.options || {}
          })))
        }
      } else if (response.status === 404) {
        router.push('/dashboard/products')
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
      router.push('/dashboard/products')
    } finally {
      setIsLoading(false)
    }
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()

        if (userData.user.role !== 'SELLER' || !userData.user.sellerProfile?.stores || userData.user.sellerProfile.stores.length === 0) {
          router.push('/dashboard')
          return
        }

        setStore(userData.user.sellerProfile.stores[0])
      } else {
        router.push('/auth')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth')
    }
  }

  const handleAIGeneratedContent = (content: any) => {
    setFormData(prev => ({
      ...prev,
      name: content.title || prev.name,
      description: content.detailedDescription || prev.description
    }))
  }

  const handleAIGeneratedImage = (imageUrl: string) => {
    setUploadedImages(prev => [imageUrl, ...prev])
  }

  const handleSEODataGenerated = (seoData: any) => {
    setFormData(prev => ({
      ...prev,
      name: seoData.metaTitle || prev.name,
      description: seoData.seoDescription || prev.description
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const token = localStorage.getItem('token')

      const productData: any = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        inventory: parseInt(formData.inventory),
        featured: formData.featured,
        status: formData.status,
        images: uploadedImages,
        categoryId: selectedCategory || null
      }

      if (hasVariants) {
        productData.variants = variants.filter(v => v.name && v.price)
      }

      const response = await fetch(`/api/dashboard/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        alert('Product updated successfully!')
        router.push('/dashboard/products')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/dashboard/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Product deleted successfully!')
        router.push('/dashboard/products')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataObj = new FormData()
        formDataObj.append('file', file)

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formDataObj
        })

        if (response.ok) {
          const data = await response.json()
          return data.url
        } else {
          throw new Error('Upload failed')
        }
      })

      const imageUrls = await Promise.all(uploadPromises)
      setUploadedImages(prev => [...prev, ...imageUrls])
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants(prev => [...prev, { name: '', sku: '', price: '', inventory: '', options: {} }])
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: any) => {
    setVariants(prev => prev.map((variant, i) =>
      i === index ? { ...variant, [field]: value } : variant
    ))
  }

  const updateVariantOption = (variantIndex: number, optionName: string, value: string) => {
    setVariants(prev => prev.map((variant, i) =>
      i === variantIndex
        ? { ...variant, options: { ...variant.options, [optionName]: value } }
        : variant
    ))
  }

  if (!store || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">Edit Product</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Edit the basic details about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Description Generator */}
          <AIDescriptionGenerator onContentGenerated={handleAIGeneratedContent} />

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Product Category</CardTitle>
              <CardDescription>
                Select a category to help customers find your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories available.
                    <Link href="/dashboard/categories/new" className="text-primary hover:underline ml-1">
                      Create your first category
                    </Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Product Images</span>
              </CardTitle>
              <CardDescription>
                Add or update high-quality images to showcase your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload files</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                  {isUploading && (
                    <p className="text-sm text-primary mt-2">Uploading...</p>
                  )}
                </div>
              </div>

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div className="space-y-4">
                  <Label>Uploaded Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {index === 0 ? 'Main' : `Image ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Image Generator */}
          <AIImageGenerator
            onImageGenerated={handleAIGeneratedImage}
            productName={formData.name}
            productCategory={categories.find(c => c.id === selectedCategory)?.name}
          />

          {/* SEO Optimizer */}
          <SEOOptimizer
            onSEODataGenerated={handleSEODataGenerated}
            productName={formData.name}
            description={formData.description}
            category={categories.find(c => c.id === selectedCategory)?.name}
          />

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Update your product prices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare at Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.comparePrice}
                    onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>
                Update your stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="inventory">Stock Quantity</Label>
                <Input
                  id="inventory"
                  type="number"
                  min="0"
                  value={formData.inventory}
                  onChange={(e) => handleInputChange('inventory', e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                Edit different versions of your product (e.g., sizes, colors)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Variants</Label>
                  <p className="text-sm text-muted-foreground">
                    Create multiple versions of this product
                  </p>
                </div>
                <Switch
                  checked={hasVariants}
                  onCheckedChange={setHasVariants}
                />
              </div>

              {hasVariants && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Product Variants</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariant}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Variant
                    </Button>
                  </div>

                  {variants.map((variant, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Variant {index + 1}</Label>
                          {variants.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariant(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Variant Name</Label>
                            <Input
                              value={variant.name}
                              onChange={(e) => updateVariant(index, 'name', e.target.value)}
                              placeholder="e.g., Small, Red, Cotton"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>SKU</Label>
                            <Input
                              value={variant.sku}
                              onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                              placeholder="e.g., TSHIRT-S-RED"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={variant.price}
                              onChange={(e) => updateVariant(index, 'price', e.target.value)}
                              placeholder="0.00"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Inventory</Label>
                            <Input
                              type="number"
                              min="0"
                              value={variant.inventory}
                              onChange={(e) => updateVariant(index, 'inventory', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Size</Label>
                            <Input
                              value={variant.options.size || ''}
                              onChange={(e) => updateVariantOption(index, 'size', e.target.value)}
                              placeholder="S, M, L, XL"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Color</Label>
                            <Input
                              value={variant.options.color || ''}
                              onChange={(e) => updateVariantOption(index, 'color', e.target.value)}
                              placeholder="Red, Blue, Green"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Material</Label>
                            <Input
                              value={variant.options.material || ''}
                              onChange={(e) => updateVariantOption(index, 'material', e.target.value)}
                              placeholder="Cotton, Silk, Wool"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Product Options</CardTitle>
              <CardDescription>
                Additional settings for your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Product</Label>
                  <p className="text-sm text-muted-foreground">
                    Display this product on your store's homepage
                  </p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete Product'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this product? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center justify-end gap-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center space-x-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/dashboard/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
