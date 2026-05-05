# Dual Project Savings Tracker

A beautiful, modern web application for tracking savings progress across two personal projects. Built with Next.js, React, and Tailwind CSS, with Google Sheets as the backend.

## Features

- 📊 **Dashboard**: Real-time overview of your savings progress across all projects
- 💼 **Project Management**: Create, edit, and delete savings projects with targets
- 💰 **Transaction Tracking**: Record deposits and withdrawals for each project
- 📈 **Progress Visualization**: Charts and progress bars to track your journey
- ⚙️ **Settings**: Easy configuration for Google Sheets integration
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 14+, React 19+, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Backend**: Google Sheets + Google Apps Script
- **Deployment**: Vercel

## Quick Start

### 1. Installation

```bash
# Clone or download this repository
cd savings-tracker

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local
```

### 2. Setup Google Sheets Integration

Follow the detailed guide in [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) to:
- Create a Google Sheet
- Set up Google Apps Script
- Deploy the web app
- Configure environment variables

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/
│   ├── api/                 # API routes for backend communication
│   │   ├── projects/
│   │   └── transactions/
│   ├── layout.tsx          # Root layout with dark mode support
│   ├── globals.css         # Global styles and design tokens
│   └── page.tsx            # Main app entry point
├── components/
│   ├── Dashboard.tsx       # Dashboard overview page
│   ├── Projects.tsx        # Projects management page
│   ├── Transactions.tsx    # Transactions list page
│   ├── Settings.tsx        # Settings and configuration page
│   ├── Navigation.tsx      # Sidebar navigation
│   └── ui/                 # shadcn/ui components
├── public/
│   └── GOOGLE_APPS_SCRIPT_TEMPLATE.gs  # Apps Script template
├── INTEGRATION_GUIDE.md    # Detailed setup guide
└── README.md              # This file
```

## Key Pages

### Dashboard
- View overall savings progress
- See total saved and target amounts
- Individual project progress bars
- Savings trend chart over time

### Projects
- Create new savings projects
- Edit project details
- Delete projects
- View progress for each project

### Transactions
- Record new deposits and withdrawals
- Edit past transactions
- Delete transactions
- View transaction history

### Settings
- Configure Google Sheets integration
- View spreadsheet structure
- Access Apps Script setup guide
- Copy template configurations

## Customization

### Colors & Theme
The app uses a modern purple and teal color scheme. Customize in `/app/globals.css`:

```css
:root {
  --primary: oklch(0.55 0.29 259);      /* Purple */
  --accent: oklch(0.72 0.25 145);       /* Teal */
  --background: oklch(0.99 0 0);        /* Off-white */
  /* ... more tokens ... */
}
```

### Adding Projects
The app supports any number of projects. By default, it includes:
1. Home Renovation
2. Vacation Fund

Edit `/components/Dashboard.tsx` to modify project names and targets.

### Dark Mode
The app automatically supports dark mode. Colors are defined for both light and dark themes in `globals.css`.

## Google Sheets Structure

The integration expects two sheets:

### Projects Sheet
| Column | Type | Example |
|--------|------|---------|
| Project Name | Text | Home Renovation |
| Target Amount | Number | 50000 |
| Amount Saved | Number | 18500 |
| Description | Text | Kitchen and bathroom |
| Created Date | Date | 2024-01-15 |
| Last Updated | Date | 2024-05-15 |
| Notes | Text | On track |
| ID | Number | 1234567890 |

### Transactions Sheet
| Column | Type | Example |
|--------|------|---------|
| Project Name | Text | Home Renovation |
| Amount | Number | 2500 |
| Type | Text | deposit/withdrawal |
| Date | Date | 2024-05-15 |
| Description | Text | Monthly savings |
| Created Date | Date | 2024-05-15 |
| Notes | Text | From bonus |
| ID | Number | 1234567890 |

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `GOOGLE_APPS_SCRIPT_URL`: Your Apps Script deployment URL
6. Click "Deploy"

### Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usleep
```

## API Reference

### GET /api/projects
Fetch all projects from Google Sheets

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Home Renovation",
      "target": 50000,
      "saved": 18500,
      "description": "..."
    }
  ]
}
```

### POST /api/projects
Create a new project

**Request:**
```json
{
  "name": "New Project",
  "target": 10000,
  "saved": 0,
  "description": "Description"
}
```

### GET /api/transactions
Fetch all transactions

### POST /api/transactions
Create a new transaction

## Troubleshooting

### Data not appearing
1. Check that the Apps Script deployment URL is correct in `.env.local`
2. Verify the Google Sheet ID is correct
3. Ensure the "Projects" and "Transactions" sheets exist
4. Check browser console for error messages

### Changes not syncing
1. Refresh the page to reload data
2. Check that the Apps Script has proper permissions
3. Verify the transaction data is correctly formatted in Google Sheets

### 404 errors on API routes
1. Ensure you're running `pnpm dev` in the project root
2. Check that the API route files are in `/app/api/`
3. Restart the dev server

## Contributing

Feel free to customize this app for your needs:
1. Modify components in `/components/`
2. Add new pages in `/app/`
3. Customize styles in `/app/globals.css`
4. Extend the Apps Script to add more features

## License

This project is open source and available for personal and commercial use.

## Support

For detailed setup instructions, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

---

**Made with ❤️ using Next.js and Tailwind CSS**

Happy saving! 🎯💰
