"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Calendar, CheckCircle, AlertCircle, ExternalLink, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface AyrshareProfile {
  platform: string
  profileId: string
  username: string
  verified: boolean
  type: string
}

interface PostResult {
  platform: string
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
}

interface AyrsharePublisherProps {
  content: string
  platforms: string[]
  onPostComplete?: (results: PostResult[]) => void
}

export function AyrsharePublisher({ content, platforms, onPostComplete }: AyrsharePublisherProps) {
  const [isPosting, setIsPosting] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleTime, setScheduleTime] = useState("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [postResults, setPostResults] = useState<PostResult[]>([])
  const [profiles, setProfiles] = useState<AyrshareProfile[]>([])
  const [facebookPageId, setFacebookPageId] = useState("")

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      const response = await fetch("/api/ayrshare/profiles")
      const data = await response.json()

      if (data.success) {
        setProfiles(data.profiles)
      }
    } catch (error) {
      console.error("Failed to load profiles:", error)
    }
  }

  const uploadMedia = async () => {
    if (mediaFiles.length === 0) return []

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of mediaFiles) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/ayrshare/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()
        if (data.success) {
          uploadedUrls.push(data.url)
        }
      }

      setMediaUrls(uploadedUrls)
      toast.success(`Uploaded ${uploadedUrls.length} media file(s)`)
      return uploadedUrls
    } catch (error) {
      toast.error("Failed to upload media")
      return []
    } finally {
      setIsUploading(false)
    }
  }

  const postNow = async () => {
    setIsPosting(true)
    setPostResults([])

    try {
      // Upload media first if any
      const uploadedUrls = await uploadMedia()

      const postData = {
        content,
        platforms,
        mediaUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        facebookPageId: facebookPageId || undefined,
        instagramImageUrl: uploadedUrls[0] || undefined, // Instagram requires image
      }

      const response = await fetch("/api/ayrshare/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (data.success) {
        // Convert Ayrshare response to our format
        const results: PostResult[] = platforms.map((platform) => ({
          platform,
          success: !data.errors?.[platform],
          postId: data.postIds?.[platform],
          postUrl: data.postUrls?.[platform],
          error: data.errors?.[platform],
        }))

        setPostResults(results)

        const successCount = results.filter((r) => r.success).length
        if (successCount > 0) {
          toast.success(`Posted to ${successCount} platform(s) successfully!`)
        }

        if (data.errors && Object.keys(data.errors).length > 0) {
          toast.error(`Some posts failed: ${Object.values(data.errors).join(", ")}`)
        }

        onPostComplete?.(results)
      } else {
        toast.error(data.error || "Failed to create post")
      }
    } catch (error) {
      toast.error("Error posting content")
      console.error("Post error:", error)
    } finally {
      setIsPosting(false)
    }
  }

  const schedulePost = async () => {
    if (!scheduleTime) {
      toast.error("Please select a schedule time")
      return
    }

    setIsScheduling(true)

    try {
      const uploadedUrls = await uploadMedia()

      const postData = {
        content,
        platforms,
        scheduleDate: scheduleTime,
        mediaUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        facebookPageId: facebookPageId || undefined,
        instagramImageUrl: uploadedUrls[0] || undefined,
      }

      const response = await fetch("/api/ayrshare/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Post scheduled successfully!")

        const results: PostResult[] = platforms.map((platform) => ({
          platform,
          success: !data.errors?.[platform],
          postId: data.postIds?.[platform],
          error: data.errors?.[platform],
        }))

        setPostResults(results)
        onPostComplete?.(results)
      } else {
        toast.error(data.error || "Failed to schedule post")
      }
    } catch (error) {
      toast.error("Error scheduling post")
    } finally {
      setIsScheduling(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setMediaFiles(files)
  }

  const connectedPlatforms = profiles.map((p) => p.platform)
  const availablePlatforms = platforms.filter((platform) => connectedPlatforms.includes(platform))
  const missingPlatforms = platforms.filter((platform) => !connectedPlatforms.includes(platform))

  const facebookPages = profiles.filter((p) => p.platform === "facebook")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Publish via Ayrshare
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {missingPlatforms.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your {missingPlatforms.join(", ")} account(s) in Ayrshare to enable posting.
              <a
                href="https://app.ayrshare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline"
              >
                Manage Accounts →
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* Media Upload */}
        <div className="space-y-2">
          <Label htmlFor="media">Media Files (Optional)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="media"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="flex-1"
            />
            {mediaFiles.length > 0 && (
              <Badge variant="secondary">
                <ImageIcon className="h-3 w-3 mr-1" />
                {mediaFiles.length} file(s)
              </Badge>
            )}
          </div>
        </div>

        {/* Facebook Page Selection */}
        {platforms.includes("facebook") && facebookPages.length > 1 && (
          <div className="space-y-2">
            <Label htmlFor="facebookPage">Facebook Page</Label>
            <Select value={facebookPageId} onValueChange={setFacebookPageId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Facebook page" />
              </SelectTrigger>
              <SelectContent>
                {facebookPages.map((page) => (
                  <SelectItem key={page.profileId} value={page.profileId}>
                    {page.username} {page.verified && "✓"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Schedule Time */}
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={postNow}
            disabled={isPosting || isUploading || availablePlatforms.length === 0}
            className="flex-1"
          >
            {isPosting || isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {isUploading ? "Uploading..." : "Posting..."}
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
            disabled={isScheduling || isUploading || !scheduleTime || availablePlatforms.length === 0}
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

        {/* Connected Platforms */}
        {availablePlatforms.length > 0 && (
          <div className="space-y-2">
            <Label>Connected platforms:</Label>
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map((platform) => {
                const profile = profiles.find((p) => p.platform === platform)
                return (
                  <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                    {platform}
                    {profile?.verified && <CheckCircle className="h-3 w-3" />}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {/* Post Results */}
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
                    {result.error && <span className="text-xs text-red-600">({result.error})</span>}
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

        {/* Ayrshare Info */}
        <div className="text-xs text-gray-500 border-t pt-2">
          Powered by Ayrshare API •
          <a
            href="https://app.ayrshare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-blue-600 hover:underline"
          >
            Manage your social accounts
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
