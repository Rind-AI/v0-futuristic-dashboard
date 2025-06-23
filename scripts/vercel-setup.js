#!/usr/bin/env node

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🚀 Setting up Vercel deployment...\n")

// Check if Vercel CLI is installed
try {
  execSync("vercel --version", { stdio: "ignore" })
  console.log("✅ Vercel CLI is installed")
} catch (error) {
  console.log("📦 Installing Vercel CLI...")
  execSync("npm install -g vercel", { stdio: "inherit" })
}

// Check if user is logged in
try {
  execSync("vercel whoami", { stdio: "ignore" })
  console.log("✅ Logged in to Vercel")
} catch (error) {
  console.log("🔐 Please login to Vercel...")
  execSync("vercel login", { stdio: "inherit" })
}

// Create vercel.json if it doesn't exist
const vercelConfigPath = path.join(process.cwd(), "vercel.json")
if (!fs.existsSync(vercelConfigPath)) {
  const vercelConfig = {
    framework: "nextjs",
    functions: {
      "app/api/**/*.ts": {
        maxDuration: 30,
      },
    },
  }

  fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2))
  console.log("✅ Created vercel.json configuration")
}

// Deploy to Vercel
console.log("\n🚀 Deploying to Vercel...")
try {
  execSync("vercel --prod", { stdio: "inherit" })
  console.log("\n✅ Deployment successful!")

  console.log("\n📋 Next steps:")
  console.log("1. Add environment variables in Vercel dashboard")
  console.log("2. Update NEXT_PUBLIC_BASE_URL with your Vercel URL")
  console.log("3. Connect social accounts in Ayrshare")
  console.log("4. Test your application")
} catch (error) {
  console.error("❌ Deployment failed:", error.message)
  process.exit(1)
}
