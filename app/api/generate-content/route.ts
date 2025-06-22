import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

interface ContentRequest {
  contentType: string
  brandTopic: string
  targetAudience: string
  tone: string
  platforms: string[]
  includeHashtags: boolean
  includeCTA: boolean
  creativity: number
  customInstructions?: string
}

const platformPrompts = {
  twitter: (params: ContentRequest) => `
    Create a viral Twitter/X post about ${params.brandTopic} for ${params.targetAudience}.
    Content type: ${params.contentType}
    Tone: ${params.tone}
    
    Requirements:
    - Maximum 280 characters
    - Hook that creates curiosity in first line
    - ${params.includeHashtags ? "Include 2-3 relevant hashtags" : "No hashtags"}
    - ${params.includeCTA ? "Include compelling call-to-action" : "No call-to-action"}
    - Use strategic line breaks for readability
    - Make it engaging and shareable
    
    ${params.customInstructions ? `Additional instructions: ${params.customInstructions}` : ""}
  `,

  linkedin: (params: ContentRequest) => `
    Write a professional LinkedIn post about ${params.brandTopic} for ${params.targetAudience}.
    Content type: ${params.contentType}
    Tone: ${params.tone}
    
    Requirements:
    - Start with personal insight or industry observation
    - Use bullet points for key information
    - Professional yet engaging language
    - ${params.includeHashtags ? "Include 3-5 relevant professional hashtags" : "No hashtags"}
    - ${params.includeCTA ? "End with engaging question to drive comments" : "No call-to-action"}
    - Establish thought leadership
    - 150-300 words optimal length
    
    ${params.customInstructions ? `Additional instructions: ${params.customInstructions}` : ""}
  `,

  instagram: (params: ContentRequest) => `
    Create an Instagram caption about ${params.brandTopic} for ${params.targetAudience}.
    Content type: ${params.contentType}
    Tone: ${params.tone}
    
    Requirements:
    - Strong hook in first line (before "more" cutoff)
    - Tell a story or share experience
    - Use emojis strategically (not overwhelming)
    - Break text into short, readable paragraphs
    - ${params.includeHashtags ? "Include 15-20 relevant hashtags at the end" : "No hashtags"}
    - ${params.includeCTA ? "Include clear call-to-action" : "No call-to-action"}
    - Authentic and relatable voice
    
    ${params.customInstructions ? `Additional instructions: ${params.customInstructions}` : ""}
  `,

  facebook: (params: ContentRequest) => `
    Write a Facebook post about ${params.brandTopic} for ${params.targetAudience}.
    Content type: ${params.contentType}
    Tone: ${params.tone}
    
    Requirements:
    - Engaging opening that stops the scroll
    - Conversational and community-focused
    - Include storytelling elements
    - ${params.includeHashtags ? "Include 3-5 relevant hashtags" : "No hashtags"}
    - ${params.includeCTA ? "Include call-to-action that encourages engagement" : "No call-to-action"}
    - Optimize for comments and shares
    - 100-250 words optimal
    
    ${params.customInstructions ? `Additional instructions: ${params.customInstructions}` : ""}
  `,

  tiktok: (params: ContentRequest) => `
    Create a TikTok video script/caption about ${params.brandTopic} for ${params.targetAudience}.
    Content type: ${params.contentType}
    Tone: ${params.tone}
    
    Requirements:
    - Hook within first 3 seconds
    - Trendy and current language
    - Include video concept/visual ideas
    - ${params.includeHashtags ? "Include trending and niche hashtags (10-15)" : "No hashtags"}
    - ${params.includeCTA ? "Include engaging call-to-action" : "No call-to-action"}
    - Fast-paced and entertaining
    - Consider current TikTok trends
    
    ${params.customInstructions ? `Additional instructions: ${params.customInstructions}` : ""}
  `,
}

export async function POST(req: NextRequest) {
  try {
    const body: ContentRequest = await req.json()

    const results = await Promise.all(
      body.platforms.map(async (platform) => {
        const prompt =
          platformPrompts[platform as keyof typeof platformPrompts]?.(body) || platformPrompts.twitter(body)

        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt,
          temperature: body.creativity / 100,
          maxTokens: 500,
        })

        return {
          platform,
          content: text.trim(),
          characterCount: text.trim().length,
          wordCount: text.trim().split(" ").length,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate content" }, { status: 500 })
  }
}
