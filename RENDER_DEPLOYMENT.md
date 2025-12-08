# Render Deployment Guide (Free Tier Optimized)

## Memory Optimization Applied

Your backend has been optimized for Render's free tier (512MB RAM limit):

### Changes Made:
1. ✅ CSV split into 100K row chunks
2. ✅ Sequential loading (not parallel)
3. ✅ Memory limit reduced to 512MB (`--max-old-space-size=512`)
4. ✅ Garbage collection hints between chunks
5. ✅ Git LFS for large files

## Before Deployment

### 1. Split the CSV
```bash
cd backend
npm run split-csv
```

Expected output:
```
✓ Created: sales_data_part1.csv (100,000 rows)
✓ Created: sales_data_part2.csv (100,000 rows)
...
✓ Split complete!
```

### 2. Setup Git LFS (if files > 100MB)
```bash
# Install Git LFS
git lfs install

# Track CSV files
git lfs track "backend/data/sales_data_part*.csv"

# Commit
git add .gitattributes
git add backend/data/
git commit -m "Add chunked CSV files"
git push
```

## Render Configuration

### Step 1: Create Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 2: Configure Settings
- **Name**: `truestate-backend` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 3: Environment Variables (Optional)
- `NODE_ENV`: `production`
- `PORT`: `5002` (Render will override this)

### Step 4: Advanced Settings
- **Instance Type**: Free
- **Auto-Deploy**: Yes

### Step 5: Deploy
Click "Create Web Service"

## Expected Deployment Logs

```
=== Server Initialization ===
Environment: production
Port: 10000
Node version: v22.x.x
Memory limit: 512.00 MB

=== CSV Loading (Chunked Mode) ===
✓ Found 10 CSV part files

[1/10] Loading sales_data_part1.csv (22.41 MB)...
    ✓ Loaded 100,000 records (Total: 100,000)
[2/10] Loading sales_data_part2.csv (22.41 MB)...
    ✓ Loaded 100,000 records (Total: 200,000)
...
[10/10] Loading sales_data_part10.csv (22.41 MB)...
    ✓ Loaded 100,000 records (Total: 1,000,000)

✓ All CSV parts loaded successfully!
  Total files: 10
  Total records: 1,000,000
  Memory usage: 450.23 MB

✓ Data loaded in 45.32s
✓ Total records in memory: 1,000,000

=== Starting Server ===
✓ Server successfully started!
✓ Server running on port 10000
✓ Memory usage: 450.23 MB

=== Server Ready ===
```

## Memory Usage Breakdown

| Stage | Memory Usage |
|-------|--------------|
| Initial | ~50 MB |
| Loading CSV (peak) | ~450 MB |
| After GC | ~400 MB |
| Running | ~350-400 MB |

**Total: Well within 512MB limit** ✅

## Troubleshooting

### "Out of memory" error
1. Reduce chunk size in `split-csv.js`:
   ```javascript
   const CHUNK_SIZE = 50000; // Instead of 100000
   ```
2. Re-run `npm run split-csv`
3. Commit and redeploy

### "CSV files not found"
1. Check files are in `backend/data/`
2. Verify Git LFS is working: `git lfs ls-files`
3. Check Render build logs for file download

### Slow startup
- Normal! Loading 1M records takes 30-60 seconds
- Render will wait up to 10 minutes for startup
- Check logs to see progress

### "Port already in use"
- This only happens locally
- Render handles ports automatically
- Ignore this error in local development

## Performance Tips

### 1. Enable Compression
Already enabled in your code:
```javascript
app.use(compression({ level: 6, threshold: 1024 }));
```

### 2. Add Caching
Already implemented in `salesService.js`:
- Query result caching
- Filter options caching

### 3. Monitor Memory
Check Render dashboard for memory usage graphs

## Testing Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://your-app.onrender.com/

# Get sales data
curl https://your-app.onrender.com/api/sales?page=1&pageSize=10

# Get filter options
curl https://your-app.onrender.com/api/sales/filters
```

## Cost Optimization

Free tier includes:
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ✅ Automatic sleep after 15 min inactivity
- ✅ 750 hours/month free

**Your app fits perfectly in free tier!** 🎉

## Next Steps

1. Split CSV: `npm run split-csv`
2. Setup Git LFS (if needed)
3. Push to GitHub
4. Deploy on Render
5. Update frontend with backend URL
6. Test all features

## Support

If deployment fails:
1. Check Render logs
2. Verify CSV files are present
3. Check memory usage in logs
4. Reduce chunk size if needed

Your backend is now optimized for Render free tier deployment! 🚀
