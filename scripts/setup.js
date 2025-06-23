#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🚀 Setting up AI Social Media Automation Platform...\n")

// Check if .env file exists
const envPath = path.join(process.cwd(), ".env.local")
const envExamplePath = path.join(process.cwd(), ".env.example")

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log("✅ Created .env.local from .env.example")
  } else {
    // Create basic .env.local
    const envContent = `# AI Social Media Automation Platform Environment Variables
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# OpenAI API Key (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Ayrshare API Key (Required for social media posting)
AYRSHARE_API_KEY=your_ayrshare_api_key_here

# Twitter API Credentials (Optional - for direct integration)
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# LinkedIn API Credentials (Optional)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Facebook API Credentials (Optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Instagram API Credentials (Optional)
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret

# Database (Optional - for production)
DATABASE_URL=postgresql://username:password@localhost:5432/social_ai

# Redis (Optional - for job queues)
REDIS_URL=redis://localhost:6379
`
    fs.writeFileSync(envPath, envContent)
    console.log("✅ Created .env.local with template")
  }
} else {
  console.log("✅ .env.local already exists")
}

console.log("\n📋 Next Steps:")
console.log("1. Edit .env.local and add your API keys")
console.log("2. Get OpenAI API key: https://platform.openai.com/api-keys")
console.log("3. Get Ayrshare API key: https://app.ayrshare.com")
console.log("4. Run: npm run dev")
console.log("5. Open: http://localhost:3000\n")

console.log("🔗 Quick Links:")
console.log("• OpenAI API Keys: https://platform.openai.com/api-keys")
console.log("• Ayrshare Dashboard: https://app.ayrshare.com")
console.log("• Documentation: README.md")
console.log("• Deploy to Vercel: npm run deploy:vercel\n")

console.log("✨ Setup complete! Happy coding!")
