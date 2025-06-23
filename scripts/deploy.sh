#!/bin/bash

echo "🚀 AI Social Media Platform - One-Click Deploy Script"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Clone repository (if not already cloned)
if [ ! -d ".git" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/yourusername/ai-social-platform.git .
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run setup script
echo "⚙️ Running setup..."
npm run setup

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "🔗 Get API keys:"
echo "• OpenAI: https://platform.openai.com/api-keys"
echo "• Ayrshare: https://app.ayrshare.com"
echo ""
echo "🚀 Deploy options:"
echo "• Vercel: npm run deploy:vercel"
echo "• Docker: docker-compose up -d"
echo ""
