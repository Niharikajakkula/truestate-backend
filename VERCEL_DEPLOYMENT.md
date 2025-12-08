# Vercel Frontend Deployment Guide

## ✅ Frontend Optimized for Vercel

Your frontend has been configured for Vercel deployment with:
- ✅ Node.js version requirement (>=18)
- ✅ Vercel build script
- ✅ Proper build configuration
- ✅ SPA routing support

## Updated Files

### `frontend/package.json`
```json
{
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "vercel-build": "npm install && vite build"
  }
}
```

### `frontend/vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure frontend for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   
   ⚠️ **Important**: Replace with your actual Render backend URL!

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? truestate-frontend (or your choice)
# - Directory? ./ (current directory)
# - Override settings? No

# Add environment variable
vercel env add VITE_API_URL
# Enter: https://your-backend-url.onrender.com/api

# Deploy to production
vercel --prod
```

## Environment Variables

### Required:
- **`VITE_API_URL`**: Your backend API URL from Render
  - Example: `https://truestate-backend.onrender.com/api`
  - ⚠️ Must include `/api` at the end
  - ⚠️ No trailing slash

### How to Add in Vercel Dashboard:
1. Go to your project
2. Click "Settings"
3. Click "Environment Variables"
4. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - **Environment**: Production, Preview, Development (select all)
5. Click "Save"
6. Redeploy (Deployments → Latest → Redeploy)

## Expected Build Output

```
Running "npm run build"

> retail-sales-frontend@1.0.0 build
> vite build

vite v5.4.2 building for production...
✓ 1234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.45 kB
dist/assets/index-def456.js     145.67 kB │ gzip: 45.67 kB
✓ built in 3.45s

Build Completed
Output Directory: dist
```

## Vercel Configuration Details

### Build Settings
- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x (from engines field)

### Routing
- SPA routing enabled via `vercel.json`
- All routes redirect to `index.html`
- Supports React Router (if added later)

## Testing Deployment

After deployment, Vercel will provide a URL like:
- **Production**: `https://truestate-frontend.vercel.app`
- **Preview**: `https://truestate-frontend-git-main-yourname.vercel.app`

### Test These Features:
1. ✅ Page loads
2. ✅ Search functionality
3. ✅ All filters work
4. ✅ Sorting works
5. ✅ Pagination works
6. ✅ Data loads from backend API

### Check Browser Console:
- No CORS errors
- API calls succeed
- No 404 errors

## Troubleshooting

### "API calls failing" / CORS errors

**Problem**: Frontend can't connect to backend

**Solution**:
1. Check `VITE_API_URL` is set correctly
2. Verify backend URL is accessible
3. Check backend CORS settings allow your Vercel domain
4. Add Vercel domain to backend CORS:
   ```javascript
   // backend/src/index.js
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://truestate-frontend.vercel.app',
       'https://*.vercel.app'
     ]
   }));
   ```

### "Build failed" errors

**Problem**: Build command fails

**Solutions**:
- Check all dependencies are in `package.json`
- Verify Node version is >=18
- Check build logs for specific errors
- Try building locally: `npm run build`

### "Page not found" on refresh

**Problem**: Routes return 404

**Solution**: Already fixed with `vercel.json` rewrites!

### Environment variable not working

**Problem**: `VITE_API_URL` is undefined

**Solutions**:
1. Verify variable name starts with `VITE_`
2. Check it's added in Vercel dashboard
3. Redeploy after adding variables
4. Check in code: `console.log(import.meta.env.VITE_API_URL)`

## Custom Domain (Optional)

### Add Custom Domain:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `sales.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

## Automatic Deployments

Vercel automatically deploys:
- ✅ **Production**: Every push to `main` branch
- ✅ **Preview**: Every pull request
- ✅ **Rollback**: One-click rollback to previous versions

## Performance Optimizations

Already included:
- ✅ Code splitting (Vite default)
- ✅ Tree shaking
- ✅ Minification
- ✅ Gzip compression
- ✅ CDN distribution
- ✅ HTTP/2 support

## Monitoring

### Vercel Analytics (Optional):
1. Go to Project → Analytics
2. Enable Web Analytics
3. View:
   - Page views
   - Unique visitors
   - Performance metrics
   - Real User Monitoring

## Complete Deployment Checklist

### Backend (Render):
- [ ] CSV files split and uploaded
- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Backend is responding to requests

### Frontend (Vercel):
- [ ] `package.json` updated with engines and vercel-build
- [ ] `vercel.json` created
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Root directory set to `frontend`
- [ ] `VITE_API_URL` environment variable added
- [ ] Deployment successful
- [ ] Frontend loads in browser
- [ ] API calls work (check Network tab)
- [ ] All features tested

## URLs to Update

After deployment, update these:

### In `README.md`:
```markdown
## Live Demo

**Frontend**: https://your-app.vercel.app
**Backend API**: https://your-backend.onrender.com/api
```

### Share with Evaluators:
1. **Live Application URL**: `https://your-app.vercel.app`
2. **GitHub Repository URL**: `https://github.com/yourusername/truestate-assignment`

## Cost

Vercel Free Tier includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Analytics (basic)

**Your frontend deployment is FREE!** 🎉

## Support

### Vercel Documentation:
- https://vercel.com/docs
- https://vitejs.dev/guide/

### Common Issues:
- Check Vercel deployment logs
- Verify environment variables
- Test API endpoint directly
- Check browser console for errors

## Next Steps

1. ✅ Deploy backend to Render first
2. ✅ Get backend URL
3. ✅ Deploy frontend to Vercel
4. ✅ Add backend URL as environment variable
5. ✅ Test all features
6. ✅ Update README with live URLs
7. ✅ Submit assignment

Your frontend is now ready for Vercel deployment! 🚀
