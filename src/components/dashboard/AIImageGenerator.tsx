'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wand2, Download, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface GeneratedImage {
  url: string
  prompt: string
  size: string
}

interface AIImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void
  productName?: string
  productCategory?: string
}

export default function AIImageGenerator({ 
  onImageGenerated, 
  productName, 
  productCategory 
}: AIImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [formData, setFormData] = useState({
    prompt: '',
    style: 'studio',
    size: '1024x1024'
  })
  const { toast } = useToast()

  const handleGenerate = async () => {
    const promptToUse = formData.prompt || `${productName || 'product'} ${productCategory || ''}`.trim()
    
    if (!promptToUse) {
      toast({
        title: 'Error',
        description: 'Please provide a prompt or product name',
        variant: 'destructive'
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          productName: productName,
          category: productCategory,
          style: formData.style,
          size: formData.size
        })
      })

      const result = await response.json()

      if (result.success) {
        const newImage: GeneratedImage = {
          url: result.imageUrl,
          prompt: result.prompt,
          size: result.size
        }
        
        setGeneratedImages(prev => [newImage, ...prev].slice(0, 6)) // Keep last 6 images
        onImageGenerated(result.imageUrl)
        
        toast({
          title: 'Success!',
          description: 'Product image generated successfully'
        })
      } else {
        throw new Error(result.error || 'Failed to generate image')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate image',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      // Convert data URL to blob
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'generated-product-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: 'Downloaded!',
        description: 'Image has been downloaded successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download image',
        variant: 'destructive'
      })
    }
  }

  const handleUseImage = (imageUrl: string) => {
    onImageGenerated(imageUrl)
    toast({
      title: 'Image Selected!',
      description: 'Image has been added to your product'
    })
  }

  const regenerateImage = () => {
    handleGenerate()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          AI Product Image Generator
        </CardTitle>
        <CardDescription>
          Generate professional product images with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the product image you want to generate..."
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              rows={3}
            />
            {productName && !formData.prompt && (
              <p className="text-sm text-muted-foreground">
                Will use: "{productName} {productCategory}" as prompt
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Image Style</Label>
              <Select value={formData.style} onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio Photography</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Image Size</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                  <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                  <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Generated Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative group">
                    <img
                      src={image.url}
                      alt={`Generated product image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUseImage(image.url)}
                      >
                        Use This Image
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(image.url, `product-image-${index + 1}.png`)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {image.size}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={regenerateImage}
                        className="text-xs h-6 px-2"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Tips for Better Results:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be specific about materials, colors, and style</li>
            <li>• Include lighting preferences (e.g., "soft natural light")</li>
            <li>• Mention the background (e.g., "white background", "marble surface")</li>
            <li>• Specify angles (e.g., "top-down view", "45-degree angle")</li>
            <li>• Use "studio" style for clean, professional product photos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}