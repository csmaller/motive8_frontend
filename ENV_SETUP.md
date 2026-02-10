# Environment Configuration

This project uses environment variables to configure the API base URL for different environments.

## Setup

1. Copy `.env.example` to create your environment file:
   ```bash
   cp .env.example .env.development
   ```

2. Update the `VITE_API_BASE_URL` value in your environment file:
   - **Development**: `.env.development` (already configured for local development)
   - **Production**: `.env.production` (update with your production API URL)

## Environment Files

- `.env.development` - Used during `npm run dev`
- `.env.production` - Used during `npm run build`
- `.env.example` - Template file (committed to git)

## Configuration

### Development
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Production
Update `.env.production` with your production API URL:
```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

## Usage in Code

The API base URL is centralized in `src/config/api.ts`:

```typescript
import { API_BASE_URL } from '../config/api';

// Use in your API calls
fetch(`${API_BASE_URL}/endpoint`)
```

## Important Notes

- Environment files (`.env`, `.env.local`, etc.) are gitignored for security
- Only `.env.example` is committed to the repository
- Vite requires environment variables to be prefixed with `VITE_`
- Changes to environment files require restarting the dev server
