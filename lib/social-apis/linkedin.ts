interface LinkedInConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

interface LinkedInTokens {
  accessToken: string
  expiresAt: number
}

export class LinkedInAPI {
  private config: LinkedInConfig

  constructor(config: LinkedInConfig) {
    this.config = config
  }

  // Generate OAuth 2.0 authorization URL
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: "w_member_social",
      state,
    })

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  }

  // Exchange authorization code for access token
  async getAccessToken(code: string): Promise<LinkedInTokens> {
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error(`LinkedIn OAuth error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
  }

  // Get user profile
  async getUserProfile(accessToken: string) {
    const response = await fetch("https://api.linkedin.com/v2/people/~", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Post to LinkedIn
  async createPost(content: string, accessToken: string): Promise<{ id: string; url: string }> {
    // First get user profile to get the person URN
    const profile = await this.getUserProfile(accessToken)
    const personUrn = profile.id

    const postData = {
      author: `urn:li:person:${personUrn}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`LinkedIn API error: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      url: `https://www.linkedin.com/feed/update/${data.id}`,
    }
  }
}
