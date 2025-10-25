'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, Search, Copy, Check, TrendingUp, Lightbulb } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SEOData {
  metaTitle: string
  metaDescription: string
  seoDescription: string
  focusKeywords: string[]
  longTailKeywords: string[]
  searchIntent: string
  contentSuggestions: string[]
  seoScore: number
  recommendations: string[]
}

interface SEOOptimizerProps {
  onSEODataGenerated: (data: SEOData) => void
  productName?: string
  description?: string
  category?: string
}

export default function SEOOptimizer({ 
  onSEODataGenerated, 
  productName, 
  description, 
  category 
}: SEOOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [seoData, setSeoData] = useState<SEOData | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    productName: productName || '',
    description: description || '',
    category: category || '',
    targetKeywords: '',
    contentType: 'product'
  })

  const handleOptimize = async () => {
    if (!formData.productName.trim()) {
      toast({
        title: 'Error',
        description: 'Product name is required',
        variant: 'destructive'
      })
      return
    }

    setIsOptimizing(true)
    try {
      const response = await fetch('/api/ai/seo-optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setSeoData(result.data)
        onSEODataGenerated(result.data)
        toast({
          title: 'SEO Optimization Complete!',
          description: `SEO score: ${result.data.seoScore}/100`
        })
      } else {
        throw new Error(result.error || 'Failed to optimize SEO')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to optimize SEO',
        variant: 'destructive'
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
      toast({
        title: 'Copied!',
        description: `${field} copied to clipboard`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive'
      })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'commercial': return 'bg-blue-100 text-blue-800'
      case 'transactional': return 'bg-green-100 text-green-800'
      case 'informational': return 'bg-purple-100 text-purple-800'
      case 'navigational': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          AI SEO Optimizer
        </CardTitle>
        <CardDescription>
          Optimize your content for search engines with AI-powered SEO analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Electronics, Clothing, Books"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your product..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetKeywords">Target Keywords</Label>
          <Input
            id="targetKeywords"
            placeholder="Enter keywords separated by commas"
            value={formData.targetKeywords}
            onChange={(e) => setFormData(prev => ({ ...prev, targetKeywords: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentType">Content Type</Label>
          <Select value={formData.contentType} onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Product Page</SelectItem>
              <SelectItem value="category">Category Page</SelectItem>
              <SelectItem value="store">Store Homepage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing || !formData.productName.trim()}
          className="w-full"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Optimizing SEO...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Optimize for SEO
            </>
          )}
        </Button>

        {/* SEO Results */}
        {seoData && (
          <div className="space-y-6 mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">SEO Analysis Results</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">SEO Score:</span>
                <span className={`text-lg font-bold ${getScoreColor(seoData.seoScore)}`}>
                  {seoData.seoScore}/100
                </span>
              </div>
            </div>

            <Progress value={seoData.seoScore} className="w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium">Meta Title</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {seoData.metaTitle.length}/60 chars
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(seoData.metaTitle, 'Meta Title')}
                    >
                      {copiedField === 'Meta Title' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-sm p-2 bg-background rounded border">{seoData.metaTitle}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium">Meta Description</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {seoData.metaDescription.length}/160 chars
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(seoData.metaDescription, 'Meta Description')}
                    >
                      {copiedField === 'Meta Description' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-sm p-2 bg-background rounded border">{seoData.metaDescription}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm font-medium">SEO Description</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(seoData.seoDescription, 'SEO Description')}
                >
                  {copiedField === 'SEO Description' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm p-2 bg-background rounded border whitespace-pre-wrap">{seoData.seoDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Focus Keywords</Label>
                <div className="flex flex-wrap gap-1">
                  {seoData.focusKeywords.map((keyword, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Search Intent</Label>
                <Badge className={getIntentColor(seoData.searchIntent)}>
                  {seoData.searchIntent.charAt(0).toUpperCase() + seoData.searchIntent.slice(1)}
                </Badge>
              </div>
            </div>

            {seoData.longTailKeywords.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Long-tail Keywords</Label>
                <div className="flex flex-wrap gap-1">
                  {seoData.longTailKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {seoData.recommendations.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  SEO Recommendations
                </Label>
                <ul className="text-sm space-y-1">
                  {seoData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}