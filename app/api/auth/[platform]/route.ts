import { type NextRequest, NextResponse } from "next/server"
import { TwitterAPI } from "@/lib/social-apis/twitter"
import { LinkedInAPI } from "@/lib/social-apis/linkedin"
import { FacebookAPI } from "@/lib/social-apis/facebook"
import { InstagramAPI } from "@/lib/social-apis/instagram"

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

export async function GET(request: NextRequest, { params }: { params: { platform: string } }) {
  const { platform } = params
  // --- generate a CSRF state value (works in all runtimes) --------------
  const state =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  // ──────────────────────────────────────────────────────────────
  // 1. Guard-clause: make sure we actually have the credentials
  // ──────────────────────────────────────────────────────────────
  const REQUIRED_ENV: Record<string, string[]> = {
    twitter: ["TWITTER_CLIENT_ID", "TWITTER_CLIENT_SECRET", "NEXT_PUBLIC_BASE_URL"],
    linkedin: ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET", "NEXT_PUBLIC_BASE_URL"],
    facebook: ["FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET", "NEXT_PUBLIC_BASE_URL"],
    instagram: ["INSTAGRAM_APP_ID", "INSTAGRAM_APP_SECRET", "NEXT_PUBLIC_BASE_URL"],
  }

  const missing = (REQUIRED_ENV[platform] || []).filter((k) => !process.env[k])
  if (missing.length) {
    return NextResponse.json(
      {
        error: `Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`,
      },
      { status: 400 },
    )
  }

  let authUrl: string

  try {
    switch (platform) {
      case "twitter":
        const twitterAPI = new TwitterAPI(configs.twitter)
        authUrl = twitterAPI.getAuthUrl(state)
        break
      case "linkedin":
        const linkedinAPI = new LinkedInAPI(configs.linkedin)
        authUrl = linkedinAPI.getAuthUrl(state)
        break
      case "facebook":
        const facebookAPI = new FacebookAPI(configs.facebook)
        authUrl = facebookAPI.getAuthUrl(state)
        break
      case "instagram":
        const instagramAPI = new InstagramAPI(configs.instagram)
        authUrl = instagramAPI.getAuthUrl(state)
        break
      default:
        return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error(`Auth error for ${platform}:`, error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected server error while generating the OAuth URL",
      },
      { status: 500 },
    )
  }
}
