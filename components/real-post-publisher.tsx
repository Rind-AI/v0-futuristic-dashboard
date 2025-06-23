"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Calendar, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface PostResult {
  platform: string
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
}

interface RealPostPublisherProps {
  content: string
  platforms: string[]
  onPostComplete?: (results: PostResult[]) => void
}

export function RealPostPublisher({ content, platforms, onPostComplete }: RealPostPublisherProps) {
  const [isPosting, setIsPosting] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleTime, setScheduleTime] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [postResults, setPostResults] = useState<PostResult[]>([])

  // Get connected accounts from localStorage
  const getConnectedAccounts = () => {
    const stored = localStorage.getItem("connectedAccounts")
    return stored ? JSON.parse(stored) : []
  }

  const getAccessToken = (platform: string) => {
    // In production, retrieve from secure storage
    const stored = localStorage.getItem(`${platform}_token`)
    return stored ? JSON.parse(stored) : null
  }

  const postNow = async () => {
    setIsPosting(true)
    setPostResults([])

    const connectedAccounts = getConnectedAccounts()
    const results: PostResult[] = []

    for (const platform of platforms) {
      const account = connectedAccounts.find((acc: any) => acc.platform === platform && acc.isConnected)

      if (!account) {
        results.push({
          platform,
          success: false,
          error: `${platform} account not connected`,
        })
        continue
      }

      try {
        const accessToken = getAccessToken(platform)
        if (!accessToken) {
          results.push({
            platform,
            success: false,
            error: `No access token for ${platform}`,
          })
          continue
        }

        const postData: any = {
          platform,
          content,
          accessToken: accessToken.accessToken,
        }

        // Add platform-specific data
        if (platform === "facebook") {
          // For Facebook, you'd need to select a page
          postData.pageId = accessToken.pageId || "me"
        }

        if (platform === "instagram") {
          if (!imageUrl) {
            results.push({
              platform,
              success: false,
              error: "Instagram requires an image URL",
            })
            continue
          }
          postData.imageUrl = imageUrl
          postData.instagramBusinessAccountId = accessToken.instagramBusinessAccountId
        }

        const response = await fetch("/api/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })

        const data = await response.json()

        if (data.success) {
          results.push({
            platform,
            success: true,
            postId: data.postId,
            postUrl: data.postUrl,
          })
          toast.success(`Posted to ${platform} successfully!`)
        } else {
          results.push({
            platform,
            success: false,
            error: data.error,
          })
          toast.error(`Failed to post to ${platform}: ${data.error}`)
        }
      } catch (error) {
        results.push({
          platform,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
        toast.error(`Error posting to ${platform}`)
      }
    }

    setPostResults(results)
    setIsPosting(false)
    onPostComplete?.(results)
  }

  const schedulePost = async () => {
    if (!scheduleTime) {
      toast.error("Please select a schedule time")
      return
    }

    setIsScheduling(true)

    try {
      const connectedAccounts = getConnectedAccounts()
      const results: PostResult[] = []

      for (const platform of platforms) {
        const account = connectedAccounts.find((acc: any) => acc.platform === platform && acc.isConnected)

        if (!account) {
          results.push({
            platform,
            success: false,
            error: `${platform} account not connected`,
          })
          continue
        }

        const accessToken = getAccessToken(platform)
        if (!accessToken) {
          results.push({
            platform,
            success: false,
            error: `No access token for ${platform}`,
          })
          continue
        }

        const scheduleData: any = {
          platform,
          content,
          scheduledTime: scheduleTime,
          accessToken: accessToken.accessToken,
        }

        if (platform === "instagram" && imageUrl) {
          scheduleData.imageUrl = imageUrl
          scheduleData.instagramBusinessAccountId = accessToken.instagramBusinessAccountId
        }

        const response = await fetch("/api/schedule-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scheduleData),
        })

        const data = await response.json()

        if (data.success) {
          results.push({
            platform,
            success: true,
            postId: data.postId,
          })
        } else {
          results.push({
            platform,
            success: false,
            error: data.error,
          })
        }
      }

      const successCount = results.filter((r) => r.success).length
      if (successCount > 0) {
        toast.success(`Scheduled ${successCount} post(s) successfully!`)
      }

      setPostResults(results)
    } catch (error) {
      toast.error("Failed to schedule posts")
    } finally {
      setIsScheduling(false)
    }
  }

  const connectedAccounts = getConnectedAccounts()
  const availablePlatforms = platforms.filter((platform) =>
    connectedAccounts.some((acc: any) => acc.platform === platform && acc.isConnected),
  )
  const missingPlatforms = platforms.filter(
    (platform) => !connectedAccounts.some((acc: any) => acc.platform === platform && acc.isConnected),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Publish to Social Media
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {missingPlatforms.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your {missingPlatforms.join(", ")} account(s) in the Social Accounts tab to enable posting.
            </AlertDescription>
          </Alert>
        )}

        {platforms.includes("instagram") && (
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Required for Instagram)</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Instagram posts require an image. Provide a publicly accessible image URL.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="scheduleTime">Schedule for Later (Optional)</Label>
          <Input
            id="scheduleTime"
            type="datetime-local"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={postNow} disabled={isPosting || availablePlatforms.length === 0} className="flex-1">
            {isPosting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post Now
              </>
            )}
          </Button>

          <Button
            onClick={schedulePost}
            disabled={isScheduling || !scheduleTime || availablePlatforms.length === 0}
            variant="secondary"
            className="flex-1"
          >
            {isScheduling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Post
              </>
            )}
          </Button>
        </div>

        {availablePlatforms.length > 0 && (
          <div className="space-y-2">
            <Label>Will post to:</Label>
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map((platform) => (
                <Badge key={platform} variant="secondary">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {postResults.length > 0 && (
          <div className="space-y-2">
            <Label>Post Results:</Label>
            <div className="space-y-2">
              {postResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="capitalize">{result.platform}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <>
                        <Badge className="bg-green-100 text-green-700">Success</Badge>
                        {result.postUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={result.postUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </a>
                          </Button>
                        )}
                      </>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
