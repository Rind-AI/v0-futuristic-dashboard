"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, Trash2, Send, Plus, Zap } from "lucide-react"
import { toast } from "sonner"

interface ScheduledPost {
  id: string
  platform: string
  content: string
  scheduledTime: Date
  status: "scheduled" | "published" | "failed"
  engagement?: number
}

export function Scheduler() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: "1",
      platform: "Twitter",
      content: "🚀 Exciting news! Our AI platform just got smarter with advanced content generation capabilities...",
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: "scheduled",
    },
    {
      id: "2",
      platform: "LinkedIn",
      content:
        "The future of social media automation is here. Our latest AI-powered features are transforming how businesses create and manage their social presence...",
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      status: "scheduled",
    },
    {
      id: "3",
      platform: "Instagram",
      content: "✨ Behind the scenes of building an AI social media platform! The journey has been incredible...",
      scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "published",
      engagement: 156,
    },
  ])

  const [bulkScheduleType, setBulkScheduleType] = useState("optimal")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostPlatform, setNewPostPlatform] = useState("twitter")
  const [newPostTime, setNewPostTime] = useState("")

  const handleDeletePost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((post) => post.id !== id))
    toast.success("Scheduled post deleted")
  }

  const handleEditPost = (id: string) => {
    toast.info("Edit functionality would open a modal here")
  }

  const handlePublishNow = (id: string) => {
    setScheduledPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: "published" as const, scheduledTime: new Date() } : post,
      ),
    )
    toast.success("Post published successfully!")
  }

  const createBulkSchedule = () => {
    const scheduleTypes = {
      daily: "Daily posting schedule created! Posts will be published at optimal times each day.",
      weekly: "Weekly posting schedule created! Posts scheduled for peak engagement days.",
      optimal: "AI-optimized schedule created! Posts timed for maximum reach and engagement.",
      custom: "Custom schedule builder opened! Define your own posting pattern.",
    }

    toast.success(scheduleTypes[bulkScheduleType as keyof typeof scheduleTypes])
  }

  const optimizeSchedule = () => {
    toast.success("AI has optimized your posting schedule based on audience behavior patterns!")
  }

  const addNewPost = () => {
    if (!newPostContent.trim() || !newPostTime) {
      toast.error("Please fill in all fields")
      return
    }

    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      platform: newPostPlatform,
      content: newPostContent,
      scheduledTime: new Date(newPostTime),
      status: "scheduled",
    }

    setScheduledPosts((prev) => [...prev, newPost])
    setNewPostContent("")
    setNewPostTime("")
    toast.success("Post scheduled successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "published":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Bulk Scheduling Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bulk Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="bulkSchedule">Schedule Type</Label>
              <Select value={bulkScheduleType} onValueChange={setBulkScheduleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Posts</SelectItem>
                  <SelectItem value="weekly">Weekly Posts</SelectItem>
                  <SelectItem value="optimal">Optimal Times</SelectItem>
                  <SelectItem value="custom">Custom Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={createBulkSchedule}>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
            <Button variant="secondary" onClick={optimizeSchedule}>
              <Zap className="h-4 w-4 mr-2" />
              AI Optimize
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Schedule New Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={newPostPlatform} onValueChange={setNewPostPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheduleTime">Schedule Time</Label>
              <Input
                id="scheduleTime"
                type="datetime-local"
                value={newPostTime}
                onChange={(e) => setNewPostTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              className="w-full p-3 border rounded-md resize-none"
              rows={4}
              placeholder="Enter your post content..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </div>

          <Button onClick={addNewPost} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled Posts
            </div>
            <Badge variant="secondary">{scheduledPosts.length} posts</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scheduled posts yet</p>
              <p className="text-sm">Create your first scheduled post above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{post.platform}</Badge>
                      <Badge className={`${getStatusColor(post.status)} text-white`}>{post.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">{formatDateTime(post.scheduledTime)}</div>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 text-sm">
                    {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                  </div>

                  {post.engagement && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{post.engagement}</span> engagements
                    </div>
                  )}

                  <div className="flex gap-2">
                    {post.status === "scheduled" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEditPost(post.id)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" onClick={() => handlePublishNow(post.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          Publish Now
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDeletePost(post.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
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
