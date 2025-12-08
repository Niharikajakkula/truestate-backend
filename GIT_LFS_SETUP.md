# Git LFS Setup for Large CSV Files

## What is Git LFS?
Git Large File Storage (LFS) replaces large files with text pointers inside Git, while storing the file contents on a remote server.

## Installation

### Windows
```bash
# Download from: https://git-lfs.github.com/
# Or use chocolatey:
choco install git-lfs

# Initialize
git lfs install
```

### Mac
```bash
brew install git-lfs
git lfs install
```

### Linux
```bash
sudo apt-get install git-lfs
git lfs install
```

## Setup for This Project

### Step 1: Split the CSV
```bash
cd backend
npm run split-csv
```

This will create:
- `data/sales_data_part1.csv`
- `data/sales_data_part2.csv`
- `data/sales_data_part3.csv`
- etc.

### Step 2: Track CSV files with Git LFS
```bash
# From project root
git lfs track "backend/data/sales_data_part*.csv"
git lfs track "backend/data/sales_data.csv"
```

This creates/updates `.gitattributes` file.

### Step 3: Add and commit
```bash
# Add the .gitattributes file
git add .gitattributes

# Add the CSV files
git add backend/data/sales_data_part*.csv

# Commit
git commit -m "Add chunked CSV files with Git LFS"
```

### Step 4: Push to GitHub
```bash
git push origin main
```

## Verify LFS is Working

```bash
# Check LFS status
git lfs ls-files

# Should show your CSV files
```

## For Render Deployment

Render automatically supports Git LFS. No additional configuration needed!

The CSV files will be downloaded during deployment.

## Alternative: Without Git LFS

If you don't want to use Git LFS, you can:

1. **Option A**: Upload CSV files directly to Render using environment variables or external storage
2. **Option B**: Use a cloud storage service (S3, Google Cloud Storage) and download on startup
3. **Option C**: Keep files small enough (<100MB each) to commit directly

## Troubleshooting

### "This exceeds GitHub's file size limit"
- Make sure Git LFS is installed: `git lfs install`
- Make sure files are tracked: `git lfs track "*.csv"`
- Check `.gitattributes` exists and has the pattern

### "Git LFS not found"
- Install Git LFS first (see Installation section)
- Run `git lfs install` in your repository

### Files still too large
- Reduce `CHUNK_SIZE` in `split-csv.js` (e.g., 50000 instead of 100000)
- Run `npm run split-csv` again

## Memory Optimization for Render Free Tier

The chunked loading approach:
- Loads files sequentially (not all at once)
- Allows garbage collection between chunks
- Reduces peak memory usage
- Fits within Render's 512MB limit

## Commands Summary

```bash
# 1. Install Git LFS
git lfs install

# 2. Split CSV
cd backend
npm run split-csv
cd ..

# 3. Track with LFS
git lfs track "backend/data/sales_data_part*.csv"

# 4. Commit and push
git add .gitattributes
git add backend/data/sales_data_part*.csv
git commit -m "Add chunked CSV files with Git LFS"
git push origin main
```
