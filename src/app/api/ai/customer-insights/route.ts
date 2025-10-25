import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { 
      storeId,
      timeRange = '30d', // '7d', '30d', '90d', '1y'
      insightTypes = ['all'], // 'behavior', 'preferences', 'trends', 'recommendations'
      customerData,
      salesData,
      productData
    } = await request.json()

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Build comprehensive context for AI analysis
    const prompt = `You are an advanced AI business analyst specializing in e-commerce customer insights and behavior analysis.

Store Data Analysis:
- Time Range: ${timeRange}
- Store ID: ${storeId}
- Analysis Types: ${insightTypes.join(', ')}

Customer Data Summary:
${customerData ? `
- Total Customers: ${customerData.totalCustomers || 0}
- New Customers: ${customerData.newCustomers || 0}
- Returning Customers: ${customerData.returningCustomers || 0}
- Average Order Value: $${customerData.averageOrderValue || 0}
- Customer Lifetime Value: $${customerData.customerLifetimeValue || 0}
- Top Customer Locations: ${customerData.topLocations?.join(', ') || 'Not available'}
` : 'No customer data available'}

Sales Performance:
${salesData ? `
- Total Revenue: $${salesData.totalRevenue || 0}
- Total Orders: ${salesData.totalOrders || 0}
- Conversion Rate: ${salesData.conversionRate || 0}%
- Average Order Value: $${salesData.averageOrderValue || 0}
- Top Selling Products: ${salesData.topProducts?.map((p: any) => `${p.name} (${p.sales} units)`).join(', ') || 'Not available'}
- Sales by Category: ${Object.entries(salesData.salesByCategory || {}).map(([cat, val]) => `${cat}: $${val}`).join(', ') || 'Not available'}
` : 'No sales data available'}

Product Performance:
${productData ? `
- Total Products: ${productData.totalProducts || 0}
- Active Products: ${productData.activeProducts || 0}
- Low Stock Products: ${productData.lowStockProducts || 0}
- Out of Stock Products: ${productData.outOfStockProducts || 0}
- Top Rated Products: ${productData.topRated?.map((p: any) => `${p.name} (${p.rating}⭐)`).join(', ') || 'Not available'}
- Most Viewed Products: ${productData.mostViewed?.map((p: any) => p.name).join(', ') || 'Not available'}
` : 'No product data available'}

Your task:
1. Analyze the provided data to generate actionable customer insights
2. Identify trends, patterns, and opportunities
3. Provide specific recommendations for business growth
4. Highlight potential issues or areas for improvement
5. Predict future trends based on current data

Generate insights in these categories:
- Customer Behavior Analysis
- Purchase Patterns and Preferences
- Product Performance Insights
- Sales and Revenue Trends
- Marketing and Engagement Recommendations
- Growth Opportunities

Format your response as JSON:
{
  "customerBehavior": {
    "summary": "Overall customer behavior analysis",
    "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  },
  "purchasePatterns": {
    "summary": "Purchase pattern analysis",
    "trends": ["Trend 1", "Trend 2"],
    "opportunities": ["Opportunity 1", "Opportunity 2"]
  },
  "productInsights": {
    "summary": "Product performance insights",
    "topPerformers": ["Product 1", "Product 2"],
    "underperformers": ["Product 1", "Product 2"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  },
  "salesTrends": {
    "summary": "Sales trend analysis",
    "growthAreas": ["Area 1", "Area 2"],
    "concerns": ["Concern 1", "Concern 2"]
  },
  "marketingInsights": {
    "summary": "Marketing and engagement insights",
    "channels": ["Channel 1", "Channel 2"],
    "campaigns": ["Campaign idea 1", "Campaign idea 2"]
  },
  "growthOpportunities": {
    "summary": "Growth opportunities",
    "immediateActions": ["Action 1", "Action 2"],
    "longTermStrategies": ["Strategy 1", "Strategy 2"]
  },
  "overallScore": 85,
  "keyMetrics": {
    "customerSatisfaction": "High",
    "growthPotential": "Medium",
    "marketPosition": "Strong"
  }
}`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst with deep expertise in e-commerce, customer behavior analysis, and data-driven insights. Provide actionable, specific recommendations based on the data provided.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2000
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let insights
    try {
      insights = JSON.parse(responseContent)
    } catch (parseError) {
      // Fallback: create basic insights
      insights = {
        customerBehavior: {
          summary: 'Limited customer data available',
          keyInsights: ['Focus on customer acquisition', 'Improve retention strategies'],
          recommendations: ['Implement loyalty program', 'Enhance customer support']
        },
        purchasePatterns: {
          summary: 'Basic purchase patterns observed',
          trends: ['Seasonal variations detected'],
          opportunities: ['Cross-selling opportunities', 'Upselling potential']
        },
        productInsights: {
          summary: 'Product performance analysis',
          topPerformers: ['Product A', 'Product B'],
          underperformers: ['Product C', 'Product D'],
          recommendations: ['Optimize product mix', 'Focus on high-margin items']
        },
        salesTrends: {
          summary: 'Sales trend analysis',
          growthAreas: ['Online sales', 'Mobile commerce'],
          concerns: ['Seasonal fluctuations', 'Competition']
        },
        marketingInsights: {
          summary: 'Marketing insights',
          channels: ['Social media', 'Email marketing'],
          campaigns: ['Seasonal promotion', 'New product launch']
        },
        growthOpportunities: {
          summary: 'Growth opportunities',
          immediateActions: ['Optimize conversion rate', 'Expand product range'],
          longTermStrategies: ['Market expansion', 'Brand development']
        },
        overallScore: 70,
        keyMetrics: {
          customerSatisfaction: 'Medium',
          growthPotential: 'High',
          marketPosition: 'Developing'
        }
      }
    }

    return NextResponse.json({
      success: true,
      insights,
      timeRange,
      generatedAt: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Error generating customer insights:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate customer insights',
        details: error.message 
      },
      { status: 500 }
    )
  }
}