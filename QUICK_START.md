# Quick Start - Deploy in 10 Minutes

## 🚀 Fast Track Deployment

### 1. Split CSV (2 minutes)
```bash
cd backend
npm run split-csv
cd ..
```

### 2. Commit & Push (1 minute)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Deploy Backend - Render (3 minutes)
1. Go to https://render.com → New Web Service
2. Connect GitHub repo
3. Settings:
   - Root: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Click "Create Web Service"
5. **Copy URL**: `https://your-app.onrender.com`

### 4. Deploy Frontend - Vercel (3 minutes)
1. Go to https://vercel.com → New Project
2. Import GitHub repo
3. Settings:
   - Root: `frontend`
   - Framework: Vite (auto-detected)
4. Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-app.onrender.com/api` ⚠️ Add `/api`
5. Click "Deploy"
6. **Copy URL**: `https://your-app.vercel.app`

### 5. Test (1 minute)
Open `https://your-app.vercel.app` and verify:
- ✅ Page loads
- ✅ Search works
- ✅ Filters work
- ✅ Data displays

### 6. Update README
Add to `README.md`:
```markdown
## Live Demo
**Frontend**: https://your-app.vercel.app
**Backend**: https://your-app.onrender.com/api
```

## ✅ Done!

Submit:
1. Live URL: `https://your-app.vercel.app`
2. GitHub: `https://github.com/yourusername/truestate-assignment`

---

**Need help?** See `FINAL_DEPLOYMENT_CHECKLIST.md` for detailed steps.
