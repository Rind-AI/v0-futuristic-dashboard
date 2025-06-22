"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, MessageCircle, Heart, Share2, Eye, BarChart3, Calendar, Target } from "lucide-react"

interface AnalyticsData {
  totalReach: number
  totalEngagements: number
  postsThisMonth: number
  engagementRate: number
  platformPerformance: {
    platform: string
    engagement: number
    reach: number
    posts: number
    color: string
  }[]
  recentPosts: {
    id: string
    platform: string
    content: string
    engagement: number
    reach: number
    timestamp: string
  }[]
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalReach: 24500,
    totalEngagements: 1856,
    postsThisMonth: 42,
    engagementRate: 4.2,
    platformPerformance: [
      { platform: "LinkedIn", engagement: 78, reach: 8500, posts: 12, color: "bg-blue-700" },
      { platform: "Twitter", engagement: 65, reach: 12000, posts: 18, color: "bg-blue-500" },
      { platform: "Instagram", engagement: 52, reach: 3500, posts: 8, color: "bg-pink-500" },
      { platform: "Facebook", engagement: 45, reach: 500, posts: 4, color: "bg-blue-600" },
    ],
    recentPosts: [
      {
        id: "1",
        platform: "LinkedIn",
        content: "The future of AI in social media automation is here...",
        engagement: 89,
        reach: 2400,
        timestamp: "2 hours ago",
      },
      {
        id: "2",
        platform: "Twitter",
        content: "🚀 Just launched our new AI content generator...",
        engagement: 156,
        reach: 3200,
        timestamp: "4 hours ago",
      },
      {
        id: "3",
        platform: "Instagram",
        content: "Behind the scenes of building an AI platform...",
        engagement: 234,
        reach: 1800,
        timestamp: "6 hours ago",
      },
    ],
  })

  const [timeRange, setTimeRange] = useState("7d")

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics((prev) => ({
        ...prev,
        totalEngagements: prev.totalEngagements + Math.floor(Math.random() * 5),
        totalReach: prev.totalReach + Math.floor(Math.random() * 50),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.totalReach)}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-gray-500 ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagements</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.totalEngagements)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+8.2%</span>
              <span className="text-gray-500 ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Posts This Month</p>
                <p className="text-2xl font-bold">{analytics.postsThisMonth}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+15.3%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{analytics.engagementRate}%</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+2.1%</span>
              <span className="text-gray-500 ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.platformPerformance.map((platform) => (
              <div key={platform.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                    <span className="font-medium">{platform.platform}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {platform.engagement}% engagement • {formatNumber(platform.reach)} reach
                  </div>
                </div>
                <Progress value={platform.engagement} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{platform.posts} posts</span>
                  <span>{platform.engagement}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Posts Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.recentPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{post.platform}</Badge>
                  <span className="text-xs text-gray-500">{post.timestamp}</span>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatNumber(post.reach)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {post.engagement}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    {Math.floor(post.engagement * 0.3)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Interactive chart would be rendered here</p>
              <p className="text-sm">Integration with Chart.js or Recharts recommended</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
