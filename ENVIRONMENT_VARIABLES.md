# 🔐 Environment Variables Setup Guide

## Required Variables

### 1. OPENAI_API_KEY
**Purpose**: Powers AI content generation
**How to get**:
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to Vercel: `OPENAI_API_KEY=sk-your-key-here`

**Cost**: $5 credit gets you started (~1000 content generations)

### 2. AYRSHARE_API_KEY
**Purpose**: Posts content to social media platforms
**How to get**:
1. Go to [Ayrshare](https://app.ayrshare.com)
2. Sign up for free account
3. Go to "API Keys" in dashboard
4. Copy your API key
5. Add to Vercel: `AYRSHARE_API_KEY=your-key-here`

**Cost**: Free tier includes 30 posts/month

### 3. NEXT_PUBLIC_BASE_URL
**Purpose**: App URL for OAuth redirects
**Value**: Your Vercel app URL
**Example**: `https://ai-social-automation.vercel.app`

## Adding Variables in Vercel

### Method 1: During Deployment
1. Click deploy button
2. Fill in environment variables form
3. Deploy

### Method 2: After Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add each variable:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-your-key-here`
   - Environment: Production
5. Click "Save"
6. Redeploy your app

### Method 3: Using Vercel CLI
\`\`\`bash
vercel env add OPENAI_API_KEY
vercel env add AYRSHARE_API_KEY
vercel env add NEXT_PUBLIC_BASE_URL
\`\`\`

## Optional Variables (Advanced)

\`\`\`env
# Database (for production scaling)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis (for job queues)
REDIS_URL=redis://localhost:6379

# Direct Social API Keys (if not using Ayrshare)
TWITTER_CLIENT_ID=your_twitter_id
TWITTER_CLIENT_SECRET=your_twitter_secret
LINKEDIN_CLIENT_ID=your_linkedin_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
FACEBOOK_APP_ID=your_facebook_id
FACEBOOK_APP_SECRET=your_facebook_secret
\`\`\`

## Security Best Practices

✅ **Do**:
- Use environment variables for all secrets
- Rotate API keys regularly
- Use different keys for development/production
- Monitor API usage

❌ **Don't**:
- Commit API keys to Git
- Share keys in public channels
- Use production keys in development
- Hardcode secrets in your code

## Troubleshooting

### "Invalid API Key" Error
- Check key is copied correctly (no extra spaces)
- Verify key hasn't expired
- Ensure sufficient credits/quota

### "Environment Variable Not Found"
- Check variable name spelling
- Verify it's set in correct environment (production)
- Redeploy after adding variables

### OAuth Redirect Errors
- Ensure `NEXT_PUBLIC_BASE_URL` matches your actual domain
- Check for trailing slashes
- Verify HTTPS in production
