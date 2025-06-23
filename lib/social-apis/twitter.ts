interface TwitterConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

interface TwitterTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export class TwitterAPI {
  private config: TwitterConfig

  constructor(config: TwitterConfig) {
    this.config = config
  }

  // Generate OAuth 2.0 authorization URL
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: "tweet.read tweet.write users.read offline.access",
      state,
      code_challenge: "challenge",
      code_challenge_method: "plain",
    })

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`
  }

  // Exchange authorization code for access token
  async getAccessToken(code: string): Promise<TwitterTokens> {
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.config.redirectUri,
        code_verifier: "challenge",
      }),
    })

    if (!response.ok) {
      throw new Error(`Twitter OAuth error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
  }

  // Post a tweet
  async postTweet(content: string, accessToken: string): Promise<{ id: string; url: string }> {
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text: content,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Twitter API error: ${error.detail || response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.data.id,
      url: `https://twitter.com/user/status/${data.data.id}`,
    }
  }

  // Get user profile
  async getUserProfile(accessToken: string) {
    const response = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<TwitterTokens> {
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`Twitter refresh token error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
  }
}
