/**
 * Dual Project Savings Tracker - Google Apps Script
 * 
 * This script serves as a bridge between the Next.js frontend and Google Sheets.
 * Follow these steps to set it up:
 * 
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Copy all the code below into the script editor
 * 4. Replace the SPREADSHEET_ID with your actual Google Sheet ID
 * 5. Deploy as a web app:
 *    - Click "Deploy" > "New Deployment"
 *    - Select type "Web app"
 *    - Set "Execute as" to your Google account
 *    - Set "Who has access" to "Anyone"
 *    - Copy the deployment URL
 * 6. Add the deployment URL to your Next.js .env.local file as GOOGLE_APPS_SCRIPT_URL
 */

// Replace this with your actual Google Sheet ID
const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

/**
 * Main function to handle incoming requests
 * This is called by the frontend when making requests to the Apps Script deployment
 */
function doGet(e) {
  return handleRequest(e.parameter);
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  return handleRequest(params);
}

function handleRequest(params) {
  try {
    const action = params.action || 'getProjects';
    let result;

    switch (action) {
      case 'getProjects':
        result = getProjects();
        break;
      case 'createProject':
        result = createProject(params);
        break;
      case 'updateProject':
        result = updateProject(params);
        break;
      case 'deleteProject':
        result = deleteProject(params);
        break;
      case 'getTransactions':
        result = getTransactions();
        break;
      case 'createTransaction':
        result = createTransaction(params);
        break;
      case 'updateTransaction':
        result = updateTransaction(params);
        break;
      case 'deleteTransaction':
        result = deleteTransaction(params);
        break;
      case 'getDashboardData':
        result = getDashboardData();
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all projects from the spreadsheet
 */
function getProjects() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Projects');
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const projects = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) { // Check if project name exists
      projects.push({
        id: data[i][7] || i, // Use ID column if available
        name: data[i][0],
        target: parseFloat(data[i][1]) || 0,
        saved: parseFloat(data[i][2]) || 0,
        description: data[i][3] || '',
      });
    }
  }
  
  return { success: true, data: projects };
}

/**
 * Create a new project
 */
function createProject(params) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Projects');
  const newRow = [
    params.name,
    parseFloat(params.target) || 0,
    parseFloat(params.saved) || 0,
    params.description || '',
    new Date(),
    '',
    '',
    Date.now(), // ID
  ];
  
  sheet.appendRow(newRow);
  
  return {
    success: true,
    message: 'Project created successfully',
    id: Date.now(),
  };
}

/**
 * Update an existing project
 */
function updateProject(params) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Projects');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][7] == params.id) { // Match by ID
      sheet.getRange(i + 1, 1).setValue(params.name);
      sheet.getRange(i + 1, 2).setValue(parseFloat(params.target) || 0);
      sheet.getRange(i + 1, 3).setValue(parseFloat(params.saved) || 0);
      sheet.getRange(i + 1, 4).setValue(params.description || '');
      break;
    }
  }
  
  return { success: true, message: 'Project updated successfully' };
}

/**
 * Delete a project
 */
function deleteProject(params) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Projects');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][7] == params.id) { // Match by ID
      sheet.deleteRow(i + 1);
      break;
    }
  }
  
  return { success: true, message: 'Project deleted successfully' };
}

/**
 * Get all transactions from the spreadsheet
 */
function getTransactions() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const transactions = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) { // Check if project name exists
      transactions.push({
        id: data[i][7] || i,
        projectName: data[i][0],
        amount: parseFloat(data[i][1]) || 0,
        type: data[i][2] || 'deposit',
        date: formatDate(data[i][3]),
        description: data[i][4] || '',
      });
    }
  }
  
  return { success: true, data: transactions };
}

/**
 * Create a new transaction
 */
function createTransaction(params) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  const newRow = [
    params.projectName,
    parseFloat(params.amount) || 0,
    params.type || 'deposit',
    params.date,
    params.description || '',
    new Date(),
    '',
    Date.now(), // ID
  ];
  
  sheet.appendRow(newRow);
  
  // Update the project's saved amount
  updateProjectSavedAmount(params.projectName, params.amount, params.type);
  
  return {
    success: true,
    message: 'Transaction created successfully',
    id: Date.now(),
  };
}

/**
 * Update an existing transaction
 */
function updateTransaction(params) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][7] == params.id) { // Match by ID
      sheet.getRange(i + 1, 1).setValue(params.projectName);
      sheet.getRange(i + 1, 2).setValue(parseFloat(params.amount) || 0);
      sheet.getRange(i + 1, 3).setValue(params.type || 'deposit');
      sheet.getRange(i + 1, 4).setValue(params.date);
      sheet.getRange(i + 1, 5).setValue(params.description || '');
      break;
    }
  }
  
  return { success: true, message: 'Transaction updated successfully' };
}

/**
 * Delete a transaction
 */
function deleteTransaction(params) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][7] == params.id) { // Match by ID
      sheet.deleteRow(i + 1);
      break;
    }
  }
  
  return { success: true, message: 'Transaction deleted successfully' };
}

/**
 * Update the saved amount for a project based on transactions
 */
function updateProjectSavedAmount(projectName, amount, type) {
  const projectsSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Projects');
  const data = projectsSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === projectName) {
      const currentSaved = parseFloat(data[i][2]) || 0;
      const newSaved = type === 'deposit' 
        ? currentSaved + parseFloat(amount)
        : currentSaved - parseFloat(amount);
      
      projectsSheet.getRange(i + 1, 3).setValue(Math.max(0, newSaved));
      break;
    }
  }
}

/**
 * Get dashboard data (aggregated view)
 */
function getDashboardData() {
  const projects = getProjects().data;
  const transactions = getTransactions().data;
  
  const totalSaved = projects.reduce((sum, p) => sum + p.saved, 0);
  const totalTarget = projects.reduce((sum, p) => sum + p.target, 0);
  
  return {
    success: true,
    data: {
      projects,
      transactions,
      totalSaved,
      totalTarget,
      overallProgress: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
    },
  };
}

/**
 * Helper function to format dates
 */
function formatDate(date) {
  if (!date) return '';
  if (date instanceof Date) {
    return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return date.toString();
}

/**
 * Initialize the spreadsheet with the required sheets and columns
 * Run this function once to set up your spreadsheet
 */
function initializeSpreadsheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Create Projects sheet
  let sheet = ss.getSheetByName('Projects');
  if (!sheet) {
    sheet = ss.insertSheet('Projects');
    sheet.appendRow([
      'Project Name',
      'Target Amount',
      'Amount Saved',
      'Description',
      'Created Date',
      'Last Updated',
      'Notes',
      'ID',
    ]);
  }
  
  // Create Transactions sheet
  sheet = ss.getSheetByName('Transactions');
  if (!sheet) {
    sheet = ss.insertSheet('Transactions');
    sheet.appendRow([
      'Project Name',
      'Amount',
      'Type',
      'Date',
      'Description',
      'Created Date',
      'Notes',
      'ID',
    ]);
  }
  
  return { success: true, message: 'Spreadsheet initialized successfully' };
}
