# Environment Configuration Guide

This project supports multiple environments for different branches and deployment stages.

## Available Environments

- **Development** (`dev` branch) - `https://13.60.69.186/api/`
- **Staging** (`staging` branch) - `https://13.60.69.186/api/`
- **Production** (`main` branch) - `https://api.tawsilet.com/api/`

## Quick Setup

### Method 1: Using NPM Scripts (Recommended)

```bash
# Switch to development environment
npm run env:dev

# Switch to production environment
npm run env:prod

# Switch to staging environment
npm run env:staging
```

### Method 2: Using Shell Script Directly

```bash
# Switch to development environment
./switch-env.sh development

# Switch to production environment
./switch-env.sh production

# Switch to staging environment
./switch-env.sh staging
```

## Manual Setup

If you prefer to manually manage environments:

1. **Copy the appropriate environment file:**
   ```bash
   # For development
   cp env.development .env
   
   # For production
   cp env.production .env
   
   # For staging
   cp env.staging .env
   ```

2. **Restart your development server:**
   ```bash
   npm start
   ```

## Environment Variables

Each environment file contains:

- `REACT_APP_BACKUP_URL` - The API base URL
- `REACT_APP_ENV` - Environment identifier

## Branch Strategy

- **`dev` branch** → Uses development API
- **`staging` branch** → Uses staging API  
- **`main` branch** → Uses production API

## CI/CD Integration

For automated deployments, you can set environment variables in your CI/CD pipeline:

```yaml
# Example for GitHub Actions
env:
  REACT_APP_BACKUP_URL: ${{ secrets.API_URL }}
  REACT_APP_ENV: ${{ secrets.ENVIRONMENT }}
```

## Important Notes

- Always restart your development server after changing environments
- The `.env` file is ignored by git for security
- Environment files (`env.*`) are tracked in git for team sharing
- Never commit sensitive API keys or credentials

## Troubleshooting

If environment changes don't take effect:

1. Stop the development server (`Ctrl+C`)
2. Clear the build cache: `npm run cleanBuild`
3. Restart: `npm start`

## Customizing URLs

Edit the environment files to use your actual API URLs:

- `env.development` - Your development API
- `env.staging` - Your staging API  
- `env.production` - Your production API 