# Dual Project Savings Tracker - Integration Guide

This guide walks you through setting up the Google Sheets integration for the Savings Tracker application.

## Overview

The application uses Google Sheets as the backend database with Google Apps Script as the API layer. This architecture allows you to:
- Store all your savings data in Google Sheets (no additional database needed)
- Update data directly in the spreadsheet or through the app
- Automatically sync changes between the app and Google Sheets

## Prerequisites

- A Google Account
- Access to Google Sheets and Google Apps Script
- A Google Sheet created (you can create one at sheets.google.com)

## Step-by-Step Setup

### 1. Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create new spreadsheet"
3. Name it "Savings Tracker" (or your preferred name)
4. Copy the Sheet ID from the URL:
   - Example URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit#gid=0`
   - Copy the part after `/d/` and before `/edit`

### 2. Set Up the Spreadsheet Structure

The spreadsheet should have two sheets: "Projects" and "Transactions"

#### Projects Sheet
Create a sheet named "Projects" with these columns:
- A: Project Name
- B: Target Amount
- C: Amount Saved
- D: Description
- E: Created Date
- F: Last Updated
- G: Notes
- H: ID

#### Transactions Sheet
Create a sheet named "Transactions" with these columns:
- A: Project Name
- B: Amount
- C: Type (deposit/withdrawal)
- D: Date
- E: Description
- F: Created Date
- G: Notes
- H: ID

### 3. Create the Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "Create new project"
3. Copy the code from `/public/GOOGLE_APPS_SCRIPT_TEMPLATE.gs` and paste it into the script editor
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID (from Step 1)
5. Save the project

### 4. Initialize Your Spreadsheet

1. In the Apps Script editor, look for the function `initializeSpreadsheet`
2. Click the play button (▶) next to it to run the function
3. Authorize the script when prompted
4. This will create the "Projects" and "Transactions" sheets with headers

### 5. Deploy the Apps Script

1. In the Apps Script editor, click "Deploy" > "New Deployment"
2. Select type: "Web app"
3. Under "Execute as", select your Google Account
4. Under "Who has access", select "Anyone"
5. Click "Deploy"
6. A modal will appear with your deployment URL
7. Copy the URL (it looks like: `https://script.google.com/macros/s/{DEPLOYMENT_ID}/usleep`)

### 6. Configure the Next.js App

1. In your project root, create or edit `.env.local`
2. Add the following line:
   ```
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/{DEPLOYMENT_ID}/usleep
   ```
   Replace `{DEPLOYMENT_ID}` with the actual ID from your deployment URL

3. Save the file and restart your dev server

### 7. Test the Integration

1. Go to the Settings page in the app
2. Enter:
   - Google Sheet ID: Your Sheet ID from Step 1
   - Apps Script Deployment URL: Your URL from Step 5
3. Click "Save Configuration"
4. Try creating a new project or transaction
5. Check your Google Sheet to verify the data was saved

## API Endpoints

The application exposes these API endpoints (handled through Apps Script):

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction

### Dashboard
- `GET /api/dashboard` - Get aggregated dashboard data

## Example API Requests

### Create a Project
```javascript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Home Renovation',
    target: 50000,
    saved: 0,
    description: 'Kitchen and bathroom renovation'
  })
});
const data = await response.json();
```

### Create a Transaction
```javascript
const response = await fetch('/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectName: 'Home Renovation',
    amount: 2500,
    type: 'deposit',
    date: '2024-05-15',
    description: 'Monthly savings'
  })
});
const data = await response.json();
```

## Troubleshooting

### "Google Apps Script URL not configured"
- Make sure you added the `GOOGLE_APPS_SCRIPT_URL` to your `.env.local` file
- Restart your dev server after adding the environment variable

### "Failed to fetch projects"
- Verify the Apps Script deployment URL is correct
- Check that the Apps Script has permission to access your Google Sheet
- Make sure the deployment is set to "Anyone" under "Who has access"

### "Spreadsheet not found"
- Verify the `SPREADSHEET_ID` in the Apps Script is correct
- Make sure you're logged in to the Google account that owns the sheet

### Data not syncing
- Check the browser console for error messages
- Verify the sheet names are exactly "Projects" and "Transactions"
- Check that column letters match in both the Apps Script and your sheet

## Security Notes

⚠️ **Important**: The current setup is for personal/development use. For production:

1. Implement authentication in the Apps Script
2. Use service accounts instead of user authentication
3. Add input validation and rate limiting
4. Consider using Supabase or another database service instead

## Manual Data Entry

You can also enter data directly into your Google Sheet:

1. Go to your Google Sheet
2. Enter data in the "Projects" or "Transactions" sheet
3. Make sure to include the ID column (use timestamps or unique IDs)
4. The app will read this data when you refresh the page

## Advanced: Local Data Sync

The app stores data locally in the browser cache. To enable full sync:

1. The `Dashboard`, `Projects`, and `Transactions` components currently use mock data
2. Once the backend is fully connected, replace the mock data with API calls
3. Use React Query or SWR for automatic caching and sync

## Support

For issues with:
- **Google Sheets**: Visit [Google Sheets Help](https://support.google.com/docs/)
- **Google Apps Script**: Visit [Apps Script Documentation](https://developers.google.com/apps-script)
- **This App**: Check the Settings page for detailed instructions

---

**Last Updated**: May 2024
**App Version**: 1.0.0
