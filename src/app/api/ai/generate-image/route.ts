import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt, productName, category, style, size = '1024x1024' } = await request.json()

    if (!prompt && !productName) {
      return NextResponse.json(
        { error: 'Prompt or product name is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Build a detailed prompt for product image generation
    let fullPrompt = prompt

    if (!fullPrompt && productName) {
      const categoryContext = category ? ` ${category}` : ''
      fullPrompt = `Professional product photography of ${productName}${categoryContext}, clean white background, studio lighting, high quality, commercial product shot, e-commerce style`
    }

    // Add style modifiers
    const styleModifiers = {
      'realistic': 'photorealistic, high detail, professional photography',
      'minimalist': 'minimalist, clean, simple background, white space',
      'lifestyle': 'lifestyle photography, natural setting, real-world usage',
      'studio': 'studio photography, professional lighting, seamless background',
      'creative': 'creative, artistic, unique perspective, eye-catching'
    }

    if (style && styleModifiers[style as keyof typeof styleModifiers]) {
      fullPrompt += `, ${styleModifiers[style as keyof typeof styleModifiers]}`
    }

    // Add common product photography enhancements
    fullPrompt += ', 4k, ultra detailed, sharp focus, professional lighting'

    console.log('Generating image with prompt:', fullPrompt)

    const response = await zai.images.generations.create({
      prompt: fullPrompt,
      size: size as any // Type assertion for supported sizes
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('No image generated')
    }

    const imageBase64 = response.data[0].base64

    if (!imageBase64) {
      throw new Error('No image data received')
    }

    // Convert base64 to a data URL
    const dataUrl = `data:image/png;base64,${imageBase64}`

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      prompt: fullPrompt,
      size
    })

  } catch (error: any) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error.message 
      },
      { status: 500 }
    )
  }
}