import { type NextRequest, NextResponse } from "next/server"
import { AyrshareAPI } from "@/lib/ayrshare-api"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const ayrshare = new AyrshareAPI({
      apiKey: process.env.AYRSHARE_API_KEY!,
    })

    const result = await ayrshare.uploadMedia(file)

    return NextResponse.json({
      success: true,
      url: result.url,
    })
  } catch (error) {
    console.error("Ayrshare upload error:", error)
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 })
  }
}
