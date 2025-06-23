interface AyrshareConfig {
  apiKey: string
  baseUrl?: string
}

interface AyrsharePostRequest {
  post: string
  platforms: string[]
  mediaUrls?: string[]
  scheduleDate?: string
  shortenLinks?: boolean
  facebookOptions?: {
    pageId?: string
  }
  linkedInOptions?: {
    commentOk?: boolean
  }
  instagramOptions?: {
    imageUrl?: string
  }
  twitterOptions?: {
    poll?: {
      options: string[]
      duration: number
    }
  }
}

interface AyrsharePostResponse {
  status: string
  id: string
  postIds: {
    [platform: string]: string
  }
  postUrls: {
    [platform: string]: string
  }
  errors?: {
    [platform: string]: string
  }
}

interface AyrshareProfile {
  platform: string
  profileId: string
  username: string
  verified: boolean
  type: string
}

export class AyrshareAPI {
  private config: AyrshareConfig

  constructor(config: AyrshareConfig) {
    this.config = {
      baseUrl: "https://app.ayrshare.com/api",
      ...config,
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(`Ayrshare API Error: ${error.message || response.statusText}`)
    }

    return response.json()
  }

  // Get connected social media profiles
  async getProfiles(): Promise<AyrshareProfile[]> {
    const response = await this.makeRequest("/profiles")
    return response.profiles || []
  }

  // Post to social media platforms
  async createPost(postData: AyrsharePostRequest): Promise<AyrsharePostResponse> {
    return this.makeRequest("/post", {
      method: "POST",
      body: JSON.stringify(postData),
    })
  }

  // Schedule a post
  async schedulePost(postData: AyrsharePostRequest): Promise<AyrsharePostResponse> {
    if (!postData.scheduleDate) {
      throw new Error("Schedule date is required for scheduled posts")
    }

    return this.makeRequest("/post", {
      method: "POST",
      body: JSON.stringify(postData),
    })
  }

  // Get post analytics
  async getPostAnalytics(postId: string) {
    return this.makeRequest(`/analytics/post/${postId}`)
  }

  // Get account analytics
  async getAnalytics(platforms?: string[], lastDays?: number) {
    const params = new URLSearchParams()
    if (platforms?.length) {
      params.append("platforms", platforms.join(","))
    }
    if (lastDays) {
      params.append("lastDays", lastDays.toString())
    }

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.makeRequest(`/analytics${query}`)
  }

  // Delete a scheduled post
  async deletePost(postId: string) {
    return this.makeRequest(`/delete/${postId}`, {
      method: "DELETE",
    })
  }

  // Get post history
  async getHistory(lastDays?: number, platform?: string) {
    const params = new URLSearchParams()
    if (lastDays) {
      params.append("lastDays", lastDays.toString())
    }
    if (platform) {
      params.append("platform", platform)
    }

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.makeRequest(`/history${query}`)
  }

  // Upload media (images/videos)
  async uploadMedia(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${this.config.baseUrl}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Get available platforms
  async getPlatforms() {
    return this.makeRequest("/platforms")
  }

  // Generate social media link preview
  async getLinkPreview(url: string) {
    return this.makeRequest("/link-preview", {
      method: "POST",
      body: JSON.stringify({ url }),
    })
  }

  // Shorten URLs
  async shortenUrl(url: string) {
    return this.makeRequest("/shorten", {
      method: "POST",
      body: JSON.stringify({ url }),
    })
  }

  // Get user information
  async getUser() {
    return this.makeRequest("/user")
  }

  // Auto-hashtag suggestions
  async getHashtagSuggestions(text: string) {
    return this.makeRequest("/auto-hashtags", {
      method: "POST",
      body: JSON.stringify({ text }),
    })
  }

  // Best time to post analysis
  async getBestTimeToPost(platform?: string) {
    const params = platform ? `?platform=${platform}` : ""
    return this.makeRequest(`/analytics/best-time${params}`)
  }
}
