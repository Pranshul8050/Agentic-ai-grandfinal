# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### 1. Deploy Your Code
\`\`\`bash
# If using Vercel CLI
vercel

# Or connect your GitHub repo to Vercel Dashboard
\`\`\`

### 2. Add Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

#### 🤖 OpenAI Configuration (Required for AI Analysis)
\`\`\`
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4
\`\`\`

#### 📺 YouTube API (Required for YouTube Integration)
\`\`\`
YOUTUBE_API_KEY=your-youtube-api-key-here
\`\`\`

#### 📸 Instagram API (Required for Instagram Integration)
\`\`\`
IG_ACCESS_TOKEN=your-instagram-access-token-here
IG_USER_ID=your-instagram-user-id-here
\`\`\`

#### ⚙️ Optional Configuration
\`\`\`
LOG_LEVEL=info
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
\`\`\`

### 3. Redeploy
After adding environment variables, redeploy your application:
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment

### 4. Test Your APIs
Visit: `https://your-app.vercel.app/api/test-apis`

---

## 🔑 How to Get API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to Vercel as `OPENAI_API_KEY`

### YouTube API Key
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key
5. Copy the API key
6. Add to Vercel as `YOUTUBE_API_KEY`

### Instagram API Credentials
1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create a new app
3. Add "Instagram Basic Display" product
4. Follow the setup wizard to get:
   - Access Token (`IG_ACCESS_TOKEN`)
   - User ID (`IG_USER_ID`)
5. Add both to Vercel environment variables

---

## 🧪 Testing Your Deployment

### Test All APIs
\`\`\`bash
curl https://your-app.vercel.app/api/test-apis
\`\`\`

### Test Individual APIs
\`\`\`bash
# Test YouTube only
curl https://your-app.vercel.app/api/test-youtube

# Test Instagram only  
curl https://your-app.vercel.app/api/test-instagram

# Test health
curl https://your-app.vercel.app/api/health
\`\`\`

### Expected Response (All APIs Configured)
\`\`\`json
{
  "success": true,
  "message": "🎉 All 3 configured API(s) working successfully!",
  "youtube": {
    "success": true,
    "status": 200,
    "responseTime": "245ms",
    "itemsCount": 5
  },
  "instagram": {
    "success": true,
    "status": 200,
    "responseTime": "312ms",
    "itemsCount": 5
  },
  "openai": {
    "success": true,
    "status": 200,
    "responseTime": "890ms",
    "model": "gpt-4"
  }
}
\`\`\`

### Expected Response (No APIs Configured)
\`\`\`json
{
  "success": false,
  "message": "⚠️ No API keys configured. Please add environment variables in Vercel.",
  "configuration": {
    "youtubeConfigured": false,
    "instagramConfigured": false,
    "openaiConfigured": false
  },
  "deploymentGuide": {
    "vercelEnvironmentVariables": [
      "YOUTUBE_API_KEY",
      "IG_ACCESS_TOKEN", 
      "IG_USER_ID",
      "OPENAI_API_KEY"
    ]
  }
}
\`\`\`

---

## 🔧 Troubleshooting

### Common Issues

#### "No API keys configured"
- **Solution**: Add environment variables in Vercel Dashboard
- **Check**: Settings → Environment Variables

#### "YouTube API quota exceeded"
- **Solution**: Check Google Cloud Console quota
- **Check**: APIs & Services → YouTube Data API v3 → Quotas

#### "Instagram token expired"
- **Solution**: Regenerate access token
- **Check**: Facebook Developers → Your App → Instagram Basic Display

#### "OpenAI API error"
- **Solution**: Check API key and billing
- **Check**: OpenAI Platform → Usage & Billing

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages.

---

## 📊 Monitoring

### Health Check Endpoints
- **Basic**: `/api/health`
- **Detailed**: `/api/health/detailed`
- **API Test**: `/api/test-apis`

### Logs
Check Vercel Function logs in Dashboard → Functions tab.

---

## 🚀 Next Steps

1. **Configure APIs**: Add your API keys to Vercel
2. **Test Integration**: Visit `/api/test-apis`
3. **Monitor Usage**: Check API quotas regularly
4. **Scale**: Add more social media platforms
5. **Secure**: Rotate API keys periodically

Your AI-powered influencer monitoring dashboard is ready to deploy! 🎉
