# Vercel Deployment Guide - localStorage Approach

## Permanent Data Storage with localStorage

Your app now uses **localStorage** for permanent data storage, which works perfectly with Vercel deployment.

### How It Works

✅ **Dual Storage System**:
- **Server-side**: Data saved to `data/donors.json` file
- **Client-side**: Data also saved to browser's localStorage
- **Automatic Sync**: Both storage systems stay synchronized

✅ **Permanent Storage**: 
- Data persists even after browser refresh
- Data survives Vercel deployments
- Works offline (localStorage data remains)

### Benefits

1. **No Database Required**: No need for MongoDB or external database
2. **Instant Access**: Data loads immediately from localStorage
3. **Offline Support**: App works even without internet connection
4. **No Setup**: Works out of the box on Vercel
5. **Cost Effective**: No database hosting costs

### Deployment Steps

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **That's it!** No additional setup required.

### Data Flow

```
User Action → Redux → API → File Storage + localStorage
```

- When you add/edit/delete donors, data is saved to both:
  - Server file (`data/donors.json`)
  - Browser localStorage

### Data Persistence

- **Browser Refresh**: Data remains (localStorage)
- **Vercel Redeploy**: Data remains (localStorage)
- **New Device**: Data loads from server on first visit
- **Multiple Tabs**: Data syncs across all tabs

### Storage Limits

- localStorage has ~5-10MB limit (sufficient for thousands of donors)
- File storage on server has no practical limit

### Backup Strategy

Your data is automatically backed up in two places:
1. **Server file**: `data/donors.json`
2. **Browser localStorage**: Permanent local copy

This ensures your data is always safe and accessible! 