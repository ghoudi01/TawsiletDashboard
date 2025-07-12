#!/bin/bash

# Environment switcher script
# Usage: ./switch-env.sh [production|development|staging]

ENV=${1:-development}

case $ENV in
  "production")
    echo "Switching to PRODUCTION environment..."
    cp env.production .env
    echo "✅ Production environment activated"
    echo "API URL: https://api.production.com/"
    ;;
  "development")
    echo "Switching to DEVELOPMENT environment..."
    cp env.development .env
    echo "✅ Development environment activated"
    echo "API URL: https://api.development.com/"
    ;;
  "staging")
    echo "Switching to STAGING environment..."
    cp env.staging .env
    echo "✅ Staging environment activated"
    echo "API URL: https://api.staging.com/"
    ;;
  *)
    echo "❌ Invalid environment. Use: production, development, or staging"
    echo "Usage: ./switch-env.sh [production|development|staging]"
    exit 1
    ;;
esac

echo ""
echo "🔄 Restart your development server to apply changes:"
echo "   npm start" 