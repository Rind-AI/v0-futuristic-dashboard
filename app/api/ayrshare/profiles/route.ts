import { NextResponse } from "next/server"
import { AyrshareAPI } from "@/lib/ayrshare-api"

export async function GET() {
  try {
    const ayrshare = new AyrshareAPI({
      apiKey: process.env.AYRSHARE_API_KEY!,
    })

    const profiles = await ayrshare.getProfiles()

    return NextResponse.json({
      success: true,
      profiles,
    })
  } catch (error) {
    console.error("Ayrshare profiles error:", error)
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
  }
}
