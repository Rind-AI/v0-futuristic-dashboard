import { type NextRequest, NextResponse } from "next/server"
import { AyrshareAPI } from "@/lib/ayrshare-api"

export const maxDuration = 30

interface PostRequest {
  content: string
  platforms: string[]
  mediaUrls?: string[]
  scheduleDate?: string
  facebookPageId?: string
  instagramImageUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PostRequest = await request.json()
    const { content, platforms, mediaUrls, scheduleDate, facebookPageId, instagramImageUrl } = body

    if (!content || !platforms?.length) {
      return NextResponse.json({ error: "Content and platforms are required" }, { status: 400 })
    }

    const ayrshare = new AyrshareAPI({
      apiKey: process.env.AYRSHARE_API_KEY!,
    })

    // Prepare post data
    const postData: any = {
      post: content,
      platforms,
      shortenLinks: true,
    }

    // Add media if provided
    if (mediaUrls?.length) {
      postData.mediaUrls = mediaUrls
    }

    // Add schedule date if provided
    if (scheduleDate) {
      postData.scheduleDate = scheduleDate
    }

    // Add platform-specific options
    if (facebookPageId) {
      postData.facebookOptions = { pageId: facebookPageId }
    }

    if (instagramImageUrl) {
      postData.instagramOptions = { imageUrl: instagramImageUrl }
    }

    // Create the post
    const result = await ayrshare.createPost(postData)

    return NextResponse.json({
      success: true,
      postId: result.id,
      postIds: result.postIds,
      postUrls: result.postUrls,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Ayrshare post error:", error)

    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }

      if (error.message.includes("unauthorized")) {
        return NextResponse.json({ error: "Invalid API key or unauthorized access." }, { status: 401 })
      }
    }

    return NextResponse.json({ error: "Failed to create post. Please try again." }, { status: 500 })
  }
}
