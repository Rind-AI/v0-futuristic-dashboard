interface InstagramConfig {
  appId: string
  appSecret: string
  redirectUri: string
}

interface InstagramTokens {
  accessToken: string
  expiresAt: number
}

export class InstagramAPI {
  private config: InstagramConfig

  constructor(config: InstagramConfig) {
    this.config = config
  }

  // Generate OAuth 2.0 authorization URL
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: "user_profile,user_media",
      response_type: "code",
      state,
    })

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`
  }

  // Exchange authorization code for access token
  async getAccessToken(code: string): Promise<InstagramTokens> {
    const response = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.config.appId,
        client_secret: this.config.appSecret,
        grant_type: "authorization_code",
        redirect_uri: this.config.redirectUri,
        code,
      }),
    })

    if (!response.ok) {
      throw new Error(`Instagram OAuth error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + 3600 * 1000, // Instagram tokens expire in 1 hour by default
    }
  }

  // Get user profile
  async getUserProfile(accessToken: string) {
    const response = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`)

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Create Instagram media (for Business accounts via Facebook Graph API)
  async createMedia(caption: string, imageUrl: string, accessToken: string, instagramBusinessAccountId: string) {
    // First create the media container
    const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken,
      }),
    })

    if (!containerResponse.ok) {
      const error = await containerResponse.json()
      throw new Error(`Instagram media creation error: ${error.error?.message || containerResponse.statusText}`)
    }

    const containerData = await containerResponse.json()

    // Then publish the media
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: accessToken,
        }),
      },
    )

    if (!publishResponse.ok) {
      const error = await publishResponse.json()
      throw new Error(`Instagram publish error: ${error.error?.message || publishResponse.statusText}`)
    }

    const publishData = await publishResponse.json()
    return {
      id: publishData.id,
      url: `https://www.instagram.com/p/${publishData.id}`,
    }
  }
}
