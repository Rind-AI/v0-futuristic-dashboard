"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentGenerator } from "@/components/content-generator"
import { Scheduler } from "@/components/scheduler"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, BarChart3, Brain, Target, TrendingUp, ExternalLink } from "lucide-react"
import { Toaster } from "sonner"
import { SocialAuth } from "@/components/social-auth"

export default function Home() {
  const [activeTab, setActiveTab] = useState("generator")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Social Automation
                </h1>
                <p className="text-sm text-gray-600">Create, Schedule & Analyze AI-Generated Content</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
              <Badge variant="outline">v2.0</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Content Generated</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <Brain className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Posts Scheduled</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Reach</p>
                  <p className="text-2xl font-bold">24.5K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Engagement Rate</p>
                  <p className="text-2xl font-bold">4.2%</p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Generator</span>
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Scheduler</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Prompts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <ContentGenerator />
          </TabsContent>

          <TabsContent value="scheduler" className="space-y-6">
            <Scheduler />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <SocialAuth />
          </TabsContent>

          <TabsContent value="prompts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  World-Class AI Prompts Library
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-900 text-slate-100 rounded-lg p-6 font-mono text-sm">
                  <h3 className="text-cyan-400 text-lg mb-4">🧠 Universal Social Media Content Prompt</h3>

                  <div className="space-y-4">
                    <div className="bg-slate-800 rounded-md p-4">
                      <h4 className="text-green-400 mb-2">📱 Base Prompt Template</h4>
                      <p className="text-slate-300 leading-relaxed">
                        Act as an expert social media strategist and content creator. Generate engaging,
                        platform-optimized content based on the following parameters:
                      </p>
                      <div className="mt-3 space-y-1 text-slate-400">
                        <p>
                          <strong className="text-cyan-300">Context:</strong> {"{brand/topic}"}
                        </p>
                        <p>
                          <strong className="text-cyan-300">Platform:</strong> {"{platform}"}
                        </p>
                        <p>
                          <strong className="text-cyan-300">Content Type:</strong> {"{contentType}"}
                        </p>
                        <p>
                          <strong className="text-cyan-300">Target Audience:</strong> {"{targetAudience}"}
                        </p>
                        <p>
                          <strong className="text-cyan-300">Tone:</strong> {"{tone}"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded-md p-4">
                      <h4 className="text-yellow-400 mb-2">🎯 Platform-Specific Optimizations</h4>
                      <div className="space-y-3 text-slate-300">
                        <div>
                          <strong className="text-blue-400">Twitter/X:</strong> Create viral threads with hooks,
                          strategic line breaks, under 280 chars per tweet
                        </div>
                        <div>
                          <strong className="text-blue-600">LinkedIn:</strong> Professional thought leadership, bullet
                          points, industry insights, engaging questions
                        </div>
                        <div>
                          <strong className="text-pink-400">Instagram:</strong> Story-driven captions, strategic emojis,
                          15-20 hashtags, visual descriptions
                        </div>
                        <div>
                          <strong className="text-blue-500">Facebook:</strong> Community-focused, conversational tone,
                          engagement-driving content
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded-md p-4">
                      <h4 className="text-purple-400 mb-2">🚀 Advanced Strategies</h4>
                      <div className="space-y-2 text-slate-300">
                        <p>
                          <strong className="text-green-400">AIDA Framework:</strong> Attention → Interest → Desire →
                          Action
                        </p>
                        <p>
                          <strong className="text-orange-400">Trend Jacking:</strong> Incorporate current trends
                          naturally
                        </p>
                        <p>
                          <strong className="text-red-400">A/B Testing:</strong> Generate multiple variations for
                          testing
                        </p>
                        <p>
                          <strong className="text-cyan-400">Engagement Triggers:</strong> Curiosity gaps, social proof,
                          reciprocity
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader>
                      <CardTitle className="text-purple-700">Viral Content Formula</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-purple-600">
                      <p>Hook + Value + Story + CTA = Viral potential</p>
                      <p className="mt-2">Use psychological triggers like FOMO, curiosity, and social proof</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader>
                      <CardTitle className="text-blue-700">Engagement Maximizer</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-blue-600">
                      <p>Questions + Controversial opinions + Personal stories</p>
                      <p className="mt-2">Drive comments, shares, and meaningful interactions</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
