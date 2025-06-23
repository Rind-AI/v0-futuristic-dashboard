#!/usr/bin/env node

const requiredEnvVars = ["OPENAI_API_KEY", "AYRSHARE_API_KEY", "NEXT_PUBLIC_BASE_URL"]

const optionalEnvVars = ["DATABASE_URL", "REDIS_URL", "TWITTER_CLIENT_ID", "LINKEDIN_CLIENT_ID", "FACEBOOK_APP_ID"]

console.log("🔍 Checking environment variables...\n")

let allGood = true

// Check required variables
console.log("📋 Required Variables:")
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: Set`)
  } else {
    console.log(`❌ ${varName}: Missing`)
    allGood = false
  }
})

console.log("\n📋 Optional Variables:")
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: Set`)
  } else {
    console.log(`⚪ ${varName}: Not set (optional)`)
  }
})

console.log("\n" + "=".repeat(50))

if (allGood) {
  console.log("🎉 All required environment variables are set!")
  console.log("🚀 Your app should work correctly.")
} else {
  console.log("⚠️  Some required environment variables are missing.")
  console.log("📖 Check ENVIRONMENT_VARIABLES.md for setup guide.")
  console.log("🔗 Quick links:")
  console.log("   • OpenAI API: https://platform.openai.com/api-keys")
  console.log("   • Ayrshare: https://app.ayrshare.com")
}

console.log('\n💡 Run "npm run setup" for guided setup.')
