# 🚀 One-Click Deployment Guide

## **🌟 Option 1: Vercel (Easiest) - Complete Setup**

### **Step 1: Add Deploy Button to Your GitHub Repo**

Add this to your `README.md`:

\`\`\`markdown
## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME&env=OPENAI_API_KEY,AYRSHARE_API_KEY,NEXT_PUBLIC_BASE_URL&envDescription=Required%20API%20keys%20for%20the%20application&envLink=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME%23environment-variables&project-name=ai-social-automation&repository-name=ai-social-automation)
\`\`\`

### **Step 2: Environment Variables Setup**

When you click the deploy button, Vercel will ask for these environment variables:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key for content generation | [Get here](https://platform.openai.com/api-keys) |
| `AYRSHARE_API_KEY` | Ayrshare API key for social posting | [Get here](https://app.ayrshare.com) |
| `NEXT_PUBLIC_BASE_URL` | Your app URL | `https://your-app-name.vercel.app` |

### **Step 3: Complete Deployment Process**

1. **Click the Deploy Button** above
2. **Sign in to Vercel** with GitHub
3. **Import Repository**:
   - Repository Name: `ai-social-automation`
   - Framework: Next.js (auto-detected)
4. **Configure Environment Variables**:
   \`\`\`
   OPENAI_API_KEY=sk-your-openai-key-here
   AYRSHARE_API_KEY=your-ayrshare-key-here
   NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
   \`\`\`
5. **Click Deploy** 🚀

### **Step 4: Post-Deployment Setup**

After deployment:
1. **Get your app URL** from Vercel dashboard
2. **Update NEXT_PUBLIC_BASE_URL** in Vercel settings
3. **Connect social accounts** in Ayrshare dashboard
4. **Test the application**

---

## **🔧 Alternative: Manual Vercel Setup**

If you prefer manual setup:

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add AYRSHARE_API_KEY
vercel env add NEXT_PUBLIC_BASE_URL
\`\`\`

---

## **📱 Mobile-Optimized Deploy Button**

For mobile users, add this compact version:

\`\`\`markdown
**🚀 [Deploy Now](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME&env=OPENAI_API_KEY,AYRSHARE_API_KEY,NEXT_PUBLIC_BASE_URL)**
