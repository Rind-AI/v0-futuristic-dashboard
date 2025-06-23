# 🚀 AI Social Media Automation Platform

A powerful Next.js application that generates AI-powered social media content and posts to multiple platforms simultaneously.

## ⚡ One-Click Deployment Options

### 🌟 Option 1: Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-social-platform&env=OPENAI_API_KEY,AYRSHARE_API_KEY,NEXT_PUBLIC_BASE_URL)

1. Click the deploy button above
2. Connect your GitHub account
3. Add environment variables:
   - `OPENAI_API_KEY`: Get from [OpenAI](https://platform.openai.com/api-keys)
   - `AYRSHARE_API_KEY`: Get from [Ayrshare](https://app.ayrshare.com)
   - `NEXT_PUBLIC_BASE_URL`: Your Vercel app URL
4. Deploy!

### 🐳 Option 2: Docker (One Command)

\`\`\`bash
# Clone and run with Docker Compose
git clone https://github.com/yourusername/ai-social-platform.git
cd ai-social-platform
cp .env.example .env.local
# Edit .env.local with your API keys
docker-compose up -d
\`\`\`

### 🔧 Option 3: Local Development

\`\`\`bash
# Quick setup
git clone https://github.com/yourusername/ai-social-platform.git
cd ai-social-platform
npm install
npm run setup  # Creates .env.local and guides you through setup
npm run dev    # Starts development server
\`\`\`

### ☁️ Option 4: Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/ai-social-platform)

### 🚀 Option 5: Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/your-template-id)

## 🔑 Required API Keys

### 1. OpenAI API Key (Required)
- Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
- Create a new API key
- Add to `OPENAI_API_KEY` in your environment

### 2. Ayrshare API Key (Required for posting)
- Sign up at [Ayrshare](https://app.ayrshare.com)
- Get your API key from the dashboard
- Add to `AYRSHARE_API_KEY` in your environment
- Connect your social media accounts in Ayrshare dashboard

## 🎯 Features

- ✅ **AI Content Generation** - GPT-4 powered content creation
- ✅ **Multi-Platform Posting** - Twitter, LinkedIn, Facebook, Instagram, TikTok
- ✅ **Smart Scheduling** - Optimal timing suggestions
- ✅ **Real-time Analytics** - Engagement tracking and insights
- ✅ **Media Upload** - Images and videos support
- ✅ **Batch Generation** - Create multiple posts at once
- ✅ **Platform Optimization** - Content tailored for each platform
- ✅ **Team Collaboration** - Multi-user support (coming soon)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Functions
- **AI**: OpenAI GPT-4, AI SDK
- **Social APIs**: Ayrshare (unified social media API)
- **UI**: shadcn/ui, Radix UI, Lucide Icons
- **Database**: PostgreSQL (optional)
- **Deployment**: Vercel, Netlify, Docker

## 📱 Supported Platforms

- 🐦 **Twitter/X** - Tweets, threads, media
- 💼 **LinkedIn** - Posts, articles, company pages
- 📘 **Facebook** - Posts, pages, groups
- 📸 **Instagram** - Posts, stories, reels
- 🎵 **TikTok** - Videos, captions
- 📺 **YouTube** - Community posts (coming soon)

## 🚀 Quick Start Guide

1. **Deploy** using any option above
2. **Add API Keys** in your environment variables
3. **Connect Social Accounts** in Ayrshare dashboard
4. **Generate Content** with AI
5. **Post & Schedule** across platforms
6. **Track Performance** with analytics

## 🔧 Environment Variables

\`\`\`env
# Required
OPENAI_API_KEY=sk-...
AYRSHARE_API_KEY=...
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app

# Optional (for direct API integration)
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
\`\`\`

## 📊 Analytics & Insights

- Real-time engagement metrics
- Platform performance comparison
- Best time to post analysis
- Follower growth tracking
- Content performance insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our community](https://discord.gg/your-invite)
- 📖 Docs: [Full documentation](https://docs.yourdomain.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-social-platform/issues)

## 🎉 What's Next?

- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Content calendar view
- [ ] A/B testing for posts
- [ ] Custom AI model training
- [ ] White-label solutions

---

**Made with ❤️ by [Your Name]**

⭐ Star this repo if you found it helpful!
