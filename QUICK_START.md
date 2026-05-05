# Quick Start Guide

Get your Dual Project Savings Tracker running in minutes!

## 5-Minute Setup

### Step 1: Start the App (30 seconds)
```bash
cd /path/to/savings-tracker
pnpm dev
```
Open http://localhost:3000 and explore the app with mock data.

### Step 2: Create Your Google Sheet (1 minute)
1. Go to [sheets.google.com](https://sheets.google.com)
2. Click "Create new spreadsheet"
3. Copy the Sheet ID from the URL
4. Create two sheets named "Projects" and "Transactions"

### Step 3: Set Up Google Apps Script (2 minutes)
1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Copy code from `/public/GOOGLE_APPS_SCRIPT_TEMPLATE.gs`
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID
5. Click "Deploy" > "New Deployment"
6. Select "Web app" and deploy
7. Copy the deployment URL

### Step 4: Configure the App (1 minute)
1. Create `.env.local` in the project root
2. Add: `GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/{YOUR_DEPLOYMENT_ID}/usleep`
3. Restart the dev server (`pnpm dev`)

### Step 5: Test (30 seconds)
1. Go to Settings page
2. Enter your Sheet ID and Apps Script URL
3. Click "Save Configuration"
4. Create a new project
5. Check your Google Sheet - it should be there!

## What You Get

✅ Beautiful dashboard with charts and progress bars  
✅ Project management with targets and saved amounts  
✅ Transaction tracking with deposits and withdrawals  
✅ Full synchronization with Google Sheets  
✅ Responsive design for all devices  
✅ Dark mode support  

## Main Features

| Feature | Location |
|---------|----------|
| View savings progress | Dashboard page |
| Create/edit projects | Projects page |
| Record transactions | Transactions page |
| Configure Google Sheets | Settings page |

## File Structure

```
📦 savings-tracker
├── 📄 app/
│   ├── 📄 page.tsx          ← Main app (starts here)
│   ├── 📄 layout.tsx        ← Root layout
│   └── 📄 globals.css       ← Design tokens
├── 📄 components/
│   ├── 📄 Dashboard.tsx     ← Overview page
│   ├── 📄 Projects.tsx      ← Project management
│   ├── 📄 Transactions.tsx  ← Transaction tracking
│   └── 📄 Settings.tsx      ← Configuration
├── 📄 INTEGRATION_GUIDE.md  ← Full setup guide
├── 📄 README.md             ← Detailed documentation
└── 📄 QUICK_START.md        ← This file
```

## Common Errors & Solutions

### "Google Apps Script URL not configured"
- Check `.env.local` exists and has the correct URL
- Restart dev server: `pnpm dev`

### "Failed to fetch projects"
- Verify Apps Script deployment URL is correct
- Make sure Apps Script is deployed as "Anyone" can access
- Check that Sheet ID in Apps Script matches your sheet

### Data not showing in Google Sheet
- Click "Initialize Spreadsheet" in Settings (if available)
- Verify column names match the template
- Check that sheets are named exactly "Projects" and "Transactions"

## Next Steps

1. **Customize Projects**: Edit `/components/Dashboard.tsx` to change project names
2. **Change Colors**: Modify `/app/globals.css` to customize the color scheme
3. **Add Features**: Extend `/components/` with new functionality
4. **Deploy**: Push to GitHub and deploy on [Vercel](https://vercel.com)

## Useful Links

- [Full Integration Guide](./INTEGRATION_GUIDE.md)
- [Complete Documentation](./README.md)
- [Google Sheets Help](https://support.google.com/docs/)
- [Google Apps Script Docs](https://developers.google.com/apps-script)

## Example Data

The app comes with sample data:
- **Project 1**: Home Renovation ($50,000 target, $18,500 saved)
- **Project 2**: Vacation Fund ($15,000 target, $9,200 saved)

Create your own projects from the Projects page!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_APPS_SCRIPT_URL` | Your Google Apps Script deployment URL |

See `.env.example` for template.

---

**You're all set!** 🎉

Start tracking your savings and watch your progress grow. For detailed guidance, check [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).

Happy saving! 💰
