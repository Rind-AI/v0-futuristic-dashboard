"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, Save, Send, Sparkles, Zap } from "lucide-react"
import { toast } from "sonner"
import { AyrsharePublisher } from "./ayrshare-publisher"

interface GeneratedContent {
  platform: string
  content: string
  characterCount: number
  wordCount: number
}

interface ContentSettings {
  contentType: string
  brandTopic: string
  targetAudience: string
  tone: string
  platforms: string[]
  includeHashtags: boolean
  includeCTA: boolean
  creativity: number
  customInstructions: string
}

const platforms = [
  { id: "twitter", name: "Twitter/X", color: "bg-blue-500" },
  { id: "linkedin", name: "LinkedIn", color: "bg-blue-700" },
  { id: "instagram", name: "Instagram", color: "bg-pink-500" },
  { id: "facebook", name: "Facebook", color: "bg-blue-600" },
  { id: "tiktok", name: "TikTok", color: "bg-black" },
]

export function ContentGenerator() {
  const [settings, setSettings] = useState<ContentSettings>({
    contentType: "promotional",
    brandTopic: "",
    targetAudience: "",
    tone: "professional",
    platforms: ["twitter"],
    includeHashtags: true,
    includeCTA: true,
    creativity: 70,
    customInstructions: "",
  })

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isBatchGenerating, setIsBatchGenerating] = useState(false)
  const [batchContent, setBatchContent] = useState<any[]>([])

  const handlePlatformToggle = (platformId: string) => {
    setSettings((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }))
  }

  const generateContent = async () => {
    if (!settings.brandTopic.trim()) {
      toast.error("Please enter a brand or topic")
      return
    }

    if (settings.platforms.length === 0) {
      toast.error("Please select at least one platform")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedContent(data.results)
        toast.success("Content generated successfully!")
      } else {
        toast.error(data.error || "Failed to generate content")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateBatch = async () => {
    if (!settings.brandTopic.trim()) {
      toast.error("Please enter a brand or topic")
      return
    }

    setIsBatchGenerating(true)

    try {
      const response = await fetch("/api/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, batchSize: 10 }),
      })

      const data = await response.json()

      if (data.success) {
        setBatchContent(data.posts)
        toast.success(`Generated ${data.posts.length} posts successfully!`)
      } else {
        toast.error(data.error || "Failed to generate batch content")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsBatchGenerating(false)
    }
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success("Content copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy content")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Settings Panel */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Content Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select
              value={settings.contentType}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, contentType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="entertaining">Entertaining</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="news">News/Updates</SelectItem>
                <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandTopic">Brand/Topic *</Label>
            <Input
              id="brandTopic"
              placeholder="Enter your brand or topic"
              value={settings.brandTopic}
              onChange={(e) => setSettings((prev) => ({ ...prev, brandTopic: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Tech enthusiasts, millennials"
              value={settings.targetAudience}
              onChange={(e) => setSettings((prev) => ({ ...prev, targetAudience: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={settings.tone} onValueChange={(value) => setSettings((prev) => ({ ...prev, tone: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
                <SelectItem value="inspiring">Inspiring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <Badge
                  key={platform.id}
                  variant={settings.platforms.includes(platform.id) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    settings.platforms.includes(platform.id) ? `${platform.color} text-white` : "hover:bg-gray-100"
                  }`}
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  {platform.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Creativity Level: {settings.creativity}%</Label>
            <Slider
              value={[settings.creativity]}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, creativity: value[0] }))}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hashtags"
              checked={settings.includeHashtags}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, includeHashtags: checked as boolean }))}
            />
            <Label htmlFor="hashtags">Include Hashtags</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cta"
              checked={settings.includeCTA}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, includeCTA: checked as boolean }))}
            />
            <Label htmlFor="cta">Include Call-to-Action</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customInstructions">Custom Instructions</Label>
            <Textarea
              id="customInstructions"
              placeholder="Any specific requirements..."
              value={settings.customInstructions}
              onChange={(e) => setSettings((prev) => ({ ...prev, customInstructions: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={generateContent} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>

            <Button onClick={generateBatch} disabled={isBatchGenerating} variant="secondary" className="w-full">
              {isBatchGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Batch...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Batch (10)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content Panel */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-500" />
            Generated Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generatedContent.length > 0 ? (
            <div className="space-y-4">
              {generatedContent.map((content, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={platforms.find((p) => p.id === content.platform)?.color}>
                      {platforms.find((p) => p.id === content.platform)?.name}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {content.characterCount} chars • {content.wordCount} words
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 font-mono text-sm whitespace-pre-wrap">
                    {content.content}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(content.content)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <Save className="h-4 w-4 mr-1" />
                      Save Draft
                    </Button>
                  </div>

                  {/* Ayrshare Publisher */}
                  <AyrsharePublisher
                    content={content.content}
                    platforms={[content.platform]}
                    onPostComplete={(results) => {
                      console.log("Post results:", results)
                    }}
                  />
                </div>
              ))}
            </div>
          ) : batchContent.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Batch Generated Content</h3>
                <Badge variant="secondary">{batchContent.length} posts</Badge>
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {batchContent.map((post, index) => (
                  <div key={post.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Post {index + 1}</span>
                      <div className="text-xs text-gray-500">{post.characterCount} chars</div>
                    </div>

                    <div className="bg-gray-50 rounded-md p-2 text-sm">
                      {post.content.substring(0, 150)}
                      {post.content.length > 150 && "..."}
                    </div>

                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(post.content)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <AyrsharePublisher
                content={batchContent.map((p) => p.content).join("\n\n---\n\n")}
                platforms={settings.platforms}
                onPostComplete={(results) => {
                  console.log("Batch post results:", results)
                }}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Generated content will appear here...</p>
              <p className="text-sm">Configure your settings and click "Generate Content" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
