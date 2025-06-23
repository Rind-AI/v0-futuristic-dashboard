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
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=${error}`)
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=no_code`)
  }

  try {
    let tokens: any
    let userProfile: any

    switch (platform) {
      case "twitter":
        const twitterAPI = new TwitterAPI(configs.twitter)
        tokens = await twitterAPI.getAccessToken(code)
        userProfile = await twitterAPI.getUserProfile(tokens.accessToken)
        break
      case "linkedin":
        const linkedinAPI = new LinkedInAPI(configs.linkedin)
        tokens = await linkedinAPI.getAccessToken(code)
        userProfile = await linkedinAPI.getUserProfile(tokens.accessToken)
        break
      case "facebook":
        const facebookAPI = new FacebookAPI(configs.facebook)
        tokens = await facebookAPI.getAccessToken(code)
        // Get user pages for Facebook
        userProfile = await facebookAPI.getUserPages(tokens.accessToken)
        break
      case "instagram":
        const instagramAPI = new InstagramAPI(configs.instagram)
        tokens = await instagramAPI.getAccessToken(code)
        userProfile = await instagramAPI.getUserProfile(tokens.accessToken)
        break
      default:
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=unsupported_platform`)
    }

    // Store tokens securely (in production, use encrypted database storage)
    // For demo purposes, we'll redirect with success
    const successUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`)
    successUrl.searchParams.set("auth_success", platform)
    successUrl.searchParams.set("user_id", userProfile.id || userProfile.data?.[0]?.id)

    return NextResponse.redirect(successUrl.toString())
  } catch (error) {
    console.error(`Callback error for ${platform}:`, error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}?error=auth_failed`)
  }
}
