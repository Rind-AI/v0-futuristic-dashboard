import { type NextRequest, NextResponse } from "next/server"
import { AyrshareAPI } from "@/lib/ayrshare-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platforms = searchParams.get("platforms")?.split(",")
    const lastDays = searchParams.get("lastDays") ? Number.parseInt(searchParams.get("lastDays")!) : undefined

    const ayrshare = new AyrshareAPI({
      apiKey: process.env.AYRSHARE_API_KEY!,
    })

    const analytics = await ayrshare.getAnalytics(platforms, lastDays)

    return NextResponse.json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error("Ayrshare analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
