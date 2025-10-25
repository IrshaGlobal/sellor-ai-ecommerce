import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { message, storeContext, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Build system prompt based on store context
    const systemPrompt = `You are a helpful AI customer service assistant for an e-commerce store. 

Store Context:
${storeContext ? `
- Store Name: ${storeContext.name || 'Online Store'}
- Store Description: ${storeContext.description || 'A modern e-commerce store'}
- Products: ${storeContext.products?.slice(0, 5).map((p: any) => `${p.name} - $${p.price}`).join('\n') || 'Various products available'}
` : 'You are helping with a general e-commerce store.'}

Your role:
1. Be friendly, professional, and helpful
2. Help customers find products and answer questions
3. Provide information about products, pricing, and policies
4. Assist with order inquiries and support
5. If you don't know something, be honest and suggest contacting human support
6. Keep responses concise but informative
7. Always maintain a positive and helpful tone

Guidelines:
- If customers ask about specific products, mention available options
- For pricing questions, be clear about costs
- For shipping, mention standard policies (3-5 business days unless specified)
- For returns, mention 30-day return policy
- For technical issues, suggest basic troubleshooting or human support
- Always end with a helpful question or offer of further assistance`

    // Build conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ]

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 500
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    return NextResponse.json({
      success: true,
      response: responseContent
    })

  } catch (error: any) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error.message 
      },
      { status: 500 }
    )
  }
}