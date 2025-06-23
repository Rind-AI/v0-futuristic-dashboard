"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2, RefreshCw } from "lucide-react"

interface AnalyticsData {
  platform: string
  posts: number
  impressions: number
  engagements: number
  clicks: number
  likes: number
  comments: number
  shares: number
  followers: number
}

export function AyrshareAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("7")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/ayrshare/analytics?lastDays=${timeRange}`)
      const data = await response.json()

      if (data.success && data.analytics) {
        // Transform Ayrshare analytics data to our format
        const transformedData = Object.entries(data.analytics).map(([platform, stats]: [string, any]) => ({
          platform,
          posts: stats.posts || 0,
          impressions: stats.impressions || 0,
          engagements: stats.engagements || 0,
          clicks: stats.clicks || 0,
          likes: stats.likes || 0,
          comments: stats.comments || 0,
          shares: stats.shares || 0,
          followers: stats.followers || 0,
        }))

        setAnalytics(transformedData)
      }
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const totalStats = analytics.reduce(
    (acc, curr) => ({
      posts: acc.posts + curr.posts,
      impressions: acc.impressions + curr.impressions,
      engagements: acc.engagements + curr.engagements,
      clicks: acc.clicks + curr.clicks,
    }),
    { posts: 0, impressions: 0, engagements: 0, clicks: 0 },
  )

  const engagementRate =
    totalStats.impressions > 0 ? ((totalStats.engagements / totalStats.impressions) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalytics} disabled={isLoading} size="sm">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold">{totalStats.posts}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold">{formatNumber(totalStats.impressions)}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagements</p>
                <p className="text-2xl font-bold">{formatNumber(totalStats.engagements)}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{engagementRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {isLoading ? "Loading analytics..." : "No analytics data available"}
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.map((platform) => (
                <div key={platform.platform} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {platform.platform}
                      </Badge>
                      <span className="text-sm text-gray-600">{platform.posts} posts</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {platform.impressions > 0
                        ? `${((platform.engagements / platform.impressions) * 100).toFixed(1)}% engagement`
                        : "No data"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span>{formatNumber(platform.impressions)} reach</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>{formatNumber(platform.likes)} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span>{formatNumber(platform.comments)} comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-green-500" />
                      <span>{formatNumber(platform.shares)} shares</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
