import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { productName, category, features, tone } = await request.json()

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const prompt = `Generate a compelling product description for an e-commerce store.

Product Details:
- Name: ${productName}
- Category: ${category || 'General'}
- Key Features: ${features || 'Not specified'}
- Tone: ${tone || 'Professional and engaging'}

Requirements:
1. Write a catchy, SEO-friendly title (max 60 characters)
2. Create a short description (1-2 sentences, max 160 characters)
3. Write a detailed description (2-3 paragraphs)
4. Include 3-5 bullet points highlighting key benefits
5. Add relevant keywords for SEO
6. Make it persuasive and conversion-focused

Format the response as JSON:
{
  "title": "SEO-optimized title",
  "shortDescription": "Brief description for meta tags",
  "detailedDescription": "Full product description with paragraphs",
  "bulletPoints": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "seoMetaDescription": "Meta description for search engines"
}`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert e-commerce copywriter specializing in creating compelling, SEO-optimized product descriptions that drive conversions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let generatedContent
    try {
      generatedContent = JSON.parse(responseContent)
    } catch (parseError) {
      // If JSON parsing fails, create a structured response manually
      generatedContent = {
        title: productName,
        shortDescription: responseContent.slice(0, 160),
        detailedDescription: responseContent,
        bulletPoints: [
          'High-quality product',
          'Great value for money',
          'Excellent customer reviews'
        ],
        keywords: [productName.toLowerCase(), category?.toLowerCase() || 'product'],
        seoMetaDescription: responseContent.slice(0, 160)
      }
    }

    return NextResponse.json({
      success: true,
      data: generatedContent
    })

  } catch (error: any) {
    console.error('Error generating product description:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate product description',
        details: error.message 
      },
      { status: 500 }
    )
  }
}