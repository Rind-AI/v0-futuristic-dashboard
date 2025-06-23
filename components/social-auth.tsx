"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Twitter, Linkedin, Facebook, Instagram, CheckCircle, AlertCircle, ExternalLink, Unlink } from "lucide-react"
import { toast } from "sonner"

interface ConnectedAccount {
  platform: string
  userId: string
  username?: string
  isConnected: boolean
  connectedAt?: string
}

const platformConfig = {
  twitter: {
    name: "Twitter/X",
    icon: Twitter,
    color: "bg-blue-500",
    description: "Post tweets and threads",
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    description: "Share professional content",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    description: "Post to pages and groups",
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "bg-pink-500",
    description: "Share photos and stories",
  },
}

export function SocialAuth() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  useEffect(() => {
    // Check URL params for auth success/error
    const urlParams = new URLSearchParams(window.location.search)
    const authSuccess = urlParams.get("auth_success")
    const authError = urlParams.get("error")
    const userId = urlParams.get("user_id")

    if (authSuccess && userId) {
      handleAuthSuccess(authSuccess, userId)
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname)
    }

    if (authError) {
      handleAuthError(authError)
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname)
    }

    // Load connected accounts from localStorage (in production, use secure storage)
    loadConnectedAccounts()
  }, [])

  const loadConnectedAccounts = () => {
    const stored = localStorage.getItem("connectedAccounts")
    if (stored) {
      setConnectedAccounts(JSON.parse(stored))
    }
  }

  const saveConnectedAccounts = (accounts: ConnectedAccount[]) => {
    localStorage.setItem("connectedAccounts", JSON.stringify(accounts))
    setConnectedAccounts(accounts)
  }

  const handleAuthSuccess = (platform: string, userId: string) => {
    const newAccount: ConnectedAccount = {
      platform,
      userId,
      isConnected: true,
      connectedAt: new Date().toISOString(),
    }

    const updated = connectedAccounts.filter((acc) => acc.platform !== platform)
    updated.push(newAccount)

    saveConnectedAccounts(updated)
    toast.success(`${platformConfig[platform as keyof typeof platformConfig]?.name} connected successfully!`)
  }

  const handleAuthError = (error: string) => {
    const errorMessages: Record<string, string> = {
      access_denied: "Access was denied. Please try again.",
      no_code: "Authorization failed. Please try again.",
      auth_failed: "Authentication failed. Please check your credentials.",
      unsupported_platform: "Platform not supported.",
    }

    toast.error(errorMessages[error] || "Authentication failed")
  }

  const connectPlatform = async (platform: string) => {
    setIsConnecting(platform)

    try {
      // Redirect to OAuth flow
      window.location.href = `/api/auth/${platform}`
    } catch (error) {
      toast.error(`Failed to connect to ${platform}`)
      setIsConnecting(null)
    }
  }

  const disconnectPlatform = (platform: string) => {
    const updated = connectedAccounts.filter((acc) => acc.platform !== platform)
    saveConnectedAccounts(updated)
    toast.success(`${platformConfig[platform as keyof typeof platformConfig]?.name} disconnected`)
  }

  const isConnected = (platform: string) => {
    return connectedAccounts.some((acc) => acc.platform === platform && acc.isConnected)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Social Media Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your social media accounts to enable real posting functionality. Your credentials are stored
              securely and only used for posting content you create.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(platformConfig).map(([platform, config]) => {
              const connected = isConnected(platform)
              const connecting = isConnecting === platform
              const Icon = config.icon

              return (
                <Card key={platform} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{config.name}</h3>
                          <p className="text-sm text-gray-600">{config.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {connected ? (
                          <>
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => disconnectPlatform(platform)}>
                              <Unlink className="h-4 w-4 mr-1" />
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => connectPlatform(platform)}
                            disabled={connecting}
                            className={config.color}
                          >
                            {connecting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Connect
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {connected && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-gray-500">
                          Connected:{" "}
                          {new Date(
                            connectedAccounts.find((acc) => acc.platform === platform)?.connectedAt || "",
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Create developer accounts for each platform</li>
              <li>2. Set up OAuth applications with proper redirect URIs</li>
              <li>3. Add your API keys to environment variables</li>
              <li>4. Connect your accounts using the buttons above</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
