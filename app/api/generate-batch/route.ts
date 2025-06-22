import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

interface BatchRequest {
  contentType: string
  brandTopic: string
  targetAudience: string
  tone: string
  platforms: string[]
  includeHashtags: boolean
  includeCTA: boolean
  creativity: number
  batchSize: number
  customInstructions?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: BatchRequest = await req.json()
    const batchSize = Math.min(body.batchSize || 10, 20) // Limit to 20 for safety

    const batchPrompt = `
      Generate ${batchSize} unique and diverse social media posts about ${body.brandTopic} for ${body.targetAudience}.
      Content type: ${body.contentType}
      Tone: ${body.tone}
      Platforms: ${body.platforms.join(", ")}
      
      Requirements for each post:
      - Unique angle or perspective
      - Varied hooks and openings
      - Different content formats (tips, questions, stories, facts, etc.)
      - ${body.includeHashtags ? "Include relevant hashtags" : "No hashtags"}
      - ${body.includeCTA ? "Include call-to-action" : "No call-to-action"}
      - Optimize for engagement
      
      Format: Return as numbered list (1. Post content here 2. Next post content...)
      
      ${body.customInstructions ? `Additional instructions: ${body.customInstructions}` : ""}
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: batchPrompt,
      temperature: body.creativity / 100,
      maxTokens: 2000,
    })

    // Parse the numbered list into individual posts
    const posts = text
      .split(/\d+\.\s/)
      .filter((post) => post.trim().length > 0)
      .map((content, index) => ({
        id: `batch_${Date.now()}_${index}`,
        content: content.trim(),
        platforms: body.platforms,
        characterCount: content.trim().length,
        wordCount: content.trim().split(" ").length,
        createdAt: new Date().toISOString(),
      }))

    return NextResponse.json({
      success: true,
      posts: posts.slice(0, batchSize), // Ensure we don't exceed requested size
      totalGenerated: posts.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Batch generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate batch content" }, { status: 500 })
  }
}
