# Social Media API Setup Guide

This guide will help you set up API credentials for each social media platform.

## 🐦 Twitter/X API Setup

1. **Create a Twitter Developer Account**
   - Go to [developer.twitter.com](https://developer.twitter.com)
   - Apply for a developer account
   - Create a new project/app

2. **Configure OAuth 2.0**
   - In your app settings, enable OAuth 2.0
   - Set redirect URI: `http://localhost:3000/api/auth/twitter/callback`
   - For production: `https://yourdomain.com/api/auth/twitter/callback`

3. **Get Credentials**
   - Copy Client ID and Client Secret
   - Add to your `.env` file

4. **Required Scopes**
   - `tweet.read`
   - `tweet.write`
   - `users.read`
   - `offline.access`

## 💼 LinkedIn API Setup

1. **Create LinkedIn App**
   - Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
   - Create a new app
   - Verify your company page

2. **Configure OAuth**
   - Add redirect URI: `http://localhost:3000/api/auth/linkedin/callback`
   - Request access to Marketing Developer Platform

3. **Required Products**
   - Sign In with LinkedIn
   - Share on LinkedIn
   - Marketing Developer Platform (for posting)

## 📘 Facebook API Setup

1. **Create Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Create a new app (Business type)
   - Add Facebook Login product

2. **Configure OAuth**
   - Set redirect URI: `http://localhost:3000/api/auth/facebook/callback`
   - Add required permissions

3. **Required Permissions**
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `publish_to_groups`

## 📸 Instagram API Setup

1. **Use Facebook App**
   - Instagram uses Facebook's Graph API
   - Add Instagram Basic Display product to your Facebook app

2. **Business Account Required**
   - Convert your Instagram account to Business
   - Connect it to a Facebook Page

3. **Required Permissions**
   - `user_profile`
   - `user_media`

## 🔧 Environment Variables

Create a `.env.local` file with:

\`\`\`env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_key

TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
\`\`\`

## 🚀 Testing

1. Start your development server: `npm run dev`
2. Go to the "Social Accounts" tab
3. Click "Connect" for each platform
4. Complete the OAuth flow
5. Test posting functionality

## 📝 Important Notes

- **Rate Limits**: Each platform has different rate limits
- **Content Policies**: Follow each platform's content guidelines
- **Business Verification**: Some features require business verification
- **Webhooks**: Set up webhooks for real-time post status updates
- **Token Refresh**: Implement token refresh logic for long-lived access

## 🔒 Security Best Practices

1. **Never expose API secrets** in client-side code
2. **Use HTTPS** in production
3. **Implement proper token storage** (encrypted database)
4. **Set up proper CORS** policies
5. **Validate all inputs** before posting
6. **Implement rate limiting** to prevent abuse

## 🛠️ Production Deployment

For production deployment:

1. Update redirect URIs to your production domain
2. Set up proper database for token storage
3. Implement job queues for scheduled posts
4. Set up monitoring and error tracking
5. Configure proper logging
6. Implement user authentication and authorization
