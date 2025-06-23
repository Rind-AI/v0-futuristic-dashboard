import { type NextRequest, NextResponse } from "next/server"
import { TwitterAPI } from "@/lib/social-apis/twitter"
import { LinkedInAPI } from "@/lib/social-apis/linkedin"
import { FacebookAPI } from "@/lib/social-apis/facebook"
import { InstagramAPI } from "@/lib/social-apis/instagram"

export const maxDuration = 30

interface PostRequest {
  platform: string
  content: string
  accessToken: string
  pageId?: string // For Facebook pages
  instagramBusinessAccountId?: string // For Instagram business accounts
  imageUrl?: string // For Instagram posts
}

const configs = {
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/twitter/callback`,
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/linkedin/callback`,
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID!,
    appSecret: process.env.FACEBOOK_APP_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/facebook/callback`,
  },
  instagram: {
    appId: process.env.INSTAGRAM_APP_ID!,
    appSecret: process.env.INSTAGRAM_APP_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/instagram/callback`,
  },
}

export async function POST(request: NextRequest) {
  try {
    const body: PostRequest = await request.json()
    const { platform, content, accessToken, pageId, instagramBusinessAccountId, imageUrl } = body

    if (!platform || !content || !accessToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let result: { id: string; url: string }

    switch (platform.toLowerCase()) {
      case "twitter":
        const twitterAPI = new TwitterAPI(configs.twitter)
        result = await twitterAPI.postTweet(content, accessToken)
        break

      case "linkedin":
        const linkedinAPI = new LinkedInAPI(configs.linkedin)
        result = await linkedinAPI.createPost(content, accessToken)
        break

      case "facebook":
        if (!pageId) {
          return NextResponse.json({ error: "Page ID required for Facebook posts" }, { status: 400 })
        }
        const facebookAPI = new FacebookAPI(configs.facebook)
        result = await facebookAPI.createPost(content, pageId, accessToken)
        break

      case "instagram":
        if (!instagramBusinessAccountId || !imageUrl) {
          return NextResponse.json(
            {
              error: "Instagram Business Account ID and image URL required for Instagram posts",
            },
            { status: 400 },
          )
        }
        const instagramAPI = new InstagramAPI(configs.instagram)
        result = await instagramAPI.createMedia(content, imageUrl, accessToken, instagramBusinessAccountId)
        break

      default:
        return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      platform,
      postId: result.id,
      postUrl: result.url,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Post creation error:", error)

    // Handle specific API errors
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again later.",
          },
          { status: 429 },
        )
      }

      if (error.message.includes("unauthorized") || error.message.includes("invalid token")) {
        return NextResponse.json(
          {
            error: "Authentication failed. Please reconnect your account.",
          },
          { status: 401 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create post. Please try again.",
      },
      { status: 500 },
    )
  }
}
