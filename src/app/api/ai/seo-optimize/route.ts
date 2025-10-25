import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { 
      productName, 
      description, 
      category, 
      targetKeywords,
      contentType = 'product', // 'product', 'category', 'store'
      existingContent
    } = await request.json()

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const prompt = `You are an expert SEO specialist specializing in e-commerce optimization. 

Content to Optimize:
- Name: ${productName}
- Description: ${description || 'No description provided'}
- Category: ${category || 'General'}
- Target Keywords: ${targetKeywords || 'Not specified'}
- Content Type: ${contentType}
- Existing Content: ${existingContent || 'None'}

Your task:
1. Generate SEO-optimized content that ranks well on search engines
2. Focus on user intent and search behavior
3. Include relevant keywords naturally
4. Create compelling meta descriptions and titles
5. Optimize for both users and search engines
6. Follow SEO best practices for e-commerce

Requirements:
- Meta title: 50-60 characters, includes primary keyword
- Meta description: 150-160 characters, compelling and clickable
- SEO description: 200-300 words, keyword-rich but natural
- Focus keywords: 5-8 relevant keywords
- Search intent: Identify primary search intent
- Content suggestions: Brief bullet points for content improvement

Format your response as JSON:
{
  "metaTitle": "SEO-optimized meta title",
  "metaDescription": "Compelling meta description",
  "seoDescription": "SEO-optimized detailed description",
  "focusKeywords": ["keyword1", "keyword2", "keyword3"],
  "longTailKeywords": ["long tail keyword 1", "long tail keyword 2"],
  "searchIntent": "informational/commercial/transactional/navigational",
  "contentSuggestions": [
    "Suggestion 1 for content improvement",
    "Suggestion 2 for content improvement"
  ],
  "seoScore": 85,
  "recommendations": [
    "SEO recommendation 1",
    "SEO recommendation 2"
  ]
}`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a world-class SEO expert with deep knowledge of e-commerce optimization, search engine algorithms, and user behavior. Always provide actionable, data-driven SEO recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let seoContent
    try {
      seoContent = JSON.parse(responseContent)
    } catch (parseError) {
      // Fallback: create basic SEO content
      seoContent = {
        metaTitle: productName.length > 55 ? productName.slice(0, 55) : productName,
        metaDescription: description ? description.slice(0, 160) : `Buy ${productName} online. High-quality ${category || 'products'} at great prices.`,
        seoDescription: description || `${productName} is a premium ${category || 'product'} designed for quality and performance.`,
        focusKeywords: [productName.toLowerCase(), category?.toLowerCase() || 'product'],
        longTailKeywords: [`best ${productName}`, `${productName} for sale`, `buy ${productName} online`],
        searchIntent: 'commercial',
        contentSuggestions: ['Add more detailed product specifications', 'Include customer reviews and testimonials'],
        seoScore: 70,
        recommendations: ['Add more specific details', 'Include relevant keywords naturally']
      }
    }

    // Validate and enhance the response
    const enhancedContent = {
      ...seoContent,
      metaTitle: seoContent.metaTitle || productName,
      metaDescription: seoContent.metaDescription || description?.slice(0, 160) || `High-quality ${productName} available now.`,
      seoDescription: seoContent.seoDescription || description || `Discover the benefits of ${productName}.`,
      focusKeywords: Array.isArray(seoContent.focusKeywords) ? seoContent.focusKeywords : [productName.toLowerCase()],
      longTailKeywords: Array.isArray(seoContent.longTailKeywords) ? seoContent.longTailKeywords : [],
      contentSuggestions: Array.isArray(seoContent.contentSuggestions) ? seoContent.contentSuggestions : [],
      recommendations: Array.isArray(seoContent.recommendations) ? seoContent.recommendations : [],
      seoScore: Math.min(100, Math.max(0, parseInt(seoContent.seoScore) || 75))
    }

    return NextResponse.json({
      success: true,
      data: enhancedContent
    })

  } catch (error: any) {
    console.error('Error generating SEO content:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate SEO content',
        details: error.message 
      },
      { status: 500 }
    )
  }
}