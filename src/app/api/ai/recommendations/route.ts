import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { 
      productId, 
      userHistory, 
      viewedProducts, 
      cartItems, 
      allProducts,
      recommendationType = 'similar' // 'similar', 'complementary', 'trending', 'personalized'
    } = await request.json()

    if (!allProducts || !Array.isArray(allProducts)) {
      return NextResponse.json(
        { error: 'Products data is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Build context for AI recommendations
    const currentProduct = allProducts.find((p: any) => p.id === productId)
    
    let prompt = `You are an AI recommendation engine for an e-commerce store. 

Current Product: ${currentProduct ? `
- Name: ${currentProduct.name}
- Description: ${currentProduct.description || 'No description'}
- Price: $${currentProduct.price}
- Category: ${currentProduct.category?.name || 'Uncategorized'}
- Features: ${currentProduct.features || 'Not specified'}
` : 'No current product selected'}

User Context:
- Recently Viewed: ${viewedProducts?.map((p: any) => p.name).join(', ') || 'None'}
- Cart Items: ${cartItems?.map((p: any) => p.name).join(', ') || 'None'}
- Purchase History: ${userHistory?.map((p: any) => p.name).join(', ') || 'None'}

Available Products:
${allProducts.slice(0, 20).map((p: any) => `
- ${p.name} | $${p.price} | ${p.category?.name || 'Uncategorized'} | ${p.description?.slice(0, 100) || 'No description'}
`).join('\n')}

Recommendation Type: ${recommendationType}

Instructions:
1. Analyze the current product and user behavior
2. Recommend 5-8 products that best match the criteria
3. Consider factors like: category compatibility, price range, features, user preferences
4. For "similar" recommendations: Find products with similar characteristics
5. For "complementary" recommendations: Find products that go well together
6. For "trending" recommendations: Find popular and highly-rated products
7. For "personalized" recommendations: Consider user's viewing and purchase history
8. Exclude the current product from recommendations
9. Prioritize in-stock products
10. Provide a brief reason for each recommendation

Format your response as JSON:
{
  "recommendations": [
    {
      "productId": "product_id",
      "reason": "Brief explanation of why this product is recommended",
      "score": 0.95
    }
  ],
  "strategy": "Brief explanation of the recommendation strategy used"
}`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert e-commerce recommendation engine. Always respond with valid JSON only.'
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
    let recommendations
    try {
      recommendations = JSON.parse(responseContent)
    } catch (parseError) {
      // Fallback: create basic recommendations
      const filteredProducts = allProducts
        .filter((p: any) => p.id !== productId && p.status === 'ACTIVE')
        .slice(0, 6)

      recommendations = {
        recommendations: filteredProducts.map((p: any) => ({
          productId: p.id,
          reason: 'Popular product that matches your interests',
          score: 0.8
        })),
        strategy: 'Fallback recommendation based on product availability'
      }
    }

    // Validate and enhance recommendations
    const validRecommendations = recommendations.recommendations
      .filter((rec: any) => {
        const product = allProducts.find((p: any) => p.id === rec.productId)
        return product && product.status === 'ACTIVE' && product.inventory > 0
      })
      .slice(0, 8) // Limit to 8 recommendations

    // Add full product data to recommendations
    const enrichedRecommendations = validRecommendations.map((rec: any) => {
      const product = allProducts.find((p: any) => p.id === rec.productId)
      return {
        ...rec,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice,
          images: product.images,
          category: product.category,
          featured: product.featured
        }
      }
    })

    return NextResponse.json({
      success: true,
      recommendations: enrichedRecommendations,
      strategy: recommendations.strategy || 'AI-powered personalized recommendations',
      totalProducts: allProducts.length,
      recommendationType
    })

  } catch (error: any) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error.message 
      },
      { status: 500 }
    )
  }
}