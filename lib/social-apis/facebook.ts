interface FacebookConfig {
  appId: string
  appSecret: string
  redirectUri: string
}

interface FacebookTokens {
  accessToken: string
  expiresAt: number
}

export class FacebookAPI {
  private config: FacebookConfig

  constructor(config: FacebookConfig) {
    this.config = config
  }

  // Generate OAuth 2.0 authorization URL
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: "pages_manage_posts,pages_read_engagement,publish_to_groups",
      response_type: "code",
      state,
    })

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
  }

  // Exchange authorization code for access token
  async getAccessToken(code: string): Promise<FacebookTokens> {
    const response = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.config.appId,
        client_secret: this.config.appSecret,
        redirect_uri: this.config.redirectUri,
        code,
      }),
    })

    if (!response.ok) {
      throw new Error(`Facebook OAuth error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
  }

  // Get user pages
  async getUserPages(accessToken: string) {
    const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`)

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Post to Facebook page
  async createPost(content: string, pageId: string, pageAccessToken: string): Promise<{ id: string; url: string }> {
    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: content,
        access_token: pageAccessToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Facebook API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      url: `https://www.facebook.com/${data.id}`,
    }
  }
}
