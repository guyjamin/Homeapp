'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Check, RefreshCw, Lock, AlertCircle } from 'lucide-react'

export default function Settings() {
  const { isSyncing, syncError, syncWithSheets } = useApp()
  const [sheetId, setSheetId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  // PIN State
  const [pin, setPin] = useState('')
  const [pinSaved, setPinSaved] = useState(false)
  const [hasPin, setHasPin] = useState(false)

  useEffect(() => {
    setSheetId(localStorage.getItem('googleSheetId') || '')
    setApiKey(localStorage.getItem('googleApiKey') || '')
    setHasPin(!!localStorage.getItem('vault_pin'))
  }, [])

  const handleSave = () => {
    localStorage.setItem('googleSheetId', sheetId)
    localStorage.setItem('googleApiKey', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePinSave = () => {
    if (pin.length < 4) return
    localStorage.setItem('vault_pin', pin)
    setPinSaved(true)
    setHasPin(true)
    setPin('')
    setTimeout(() => setPinSaved(false), 2000)
  }

  const handlePinRemove = () => {
    localStorage.removeItem('vault_pin')
    setHasPin(false)
  }

  const handleSync = async () => {
    await syncWithSheets()
  }

  const copyTemplateStructure = () => {
    const headers = "Project Name\tTarget Amount\tAmount Saved\tTrans. Date\tTrans. Amount\tType\tDescription\n"
    navigator.clipboard.writeText(headers)
  }

  const copyGasCode = () => {
    const code = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  // Add logic to parse data.projects and data.transactions
  // and write them to the sheet
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Read logic here
  return ContentService.createTextOutput(JSON.stringify({ projects: [], transactions: [] }))
    .setMimeType(ContentService.MimeType.JSON);
}`
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure security and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Section */}
        <Card className="p-6 bg-card border-border h-fit">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Security (PIN Lock)
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Require a PIN to access the app. Since this is financial data, it's highly recommended.
            </p>
            {hasPin ? (
              <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <span className="text-sm font-medium text-foreground">PIN Protection is Active</span>
                <Button variant="destructive" size="sm" onClick={handlePinRemove}>
                  Remove PIN
                </Button>
              </div>
            ) : (
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Set New PIN
                  </label>
                  <Input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4+ digits"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <Button
                  onClick={handlePinSave}
                  disabled={pin.length < 4}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {pinSaved ? <Check size={20} className="mr-2" /> : <Save size={20} className="mr-2" />}
                  {pinSaved ? 'Saved' : 'Save PIN'}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Configuration Section */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Google Sheets Integration</h2>
            <Button
              onClick={handleSync}
              disabled={isSyncing || !apiKey}
              variant="outline"
              size="sm"
              className={isSyncing ? 'animate-pulse' : ''}
            >
              <RefreshCw size={16} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
          
          {syncError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2 text-destructive text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{syncError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Google Sheet ID
              </label>
              <Input
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="Paste your Google Sheet ID"
                className="bg-input border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Found in the URL: https://docs.google.com/spreadsheets/d/{'{SHEET_ID}'}/edit
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Apps Script Deployment URL
              </label>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Apps Script deployment URL"
                className="bg-input border-border text-foreground"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saved ? (
                <>
                  <Check size={20} className="mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Instructions Section */}
        <Card className="p-6 bg-card border-border lg:col-span-2">
          <h2 className="text-xl font-semibold text-foreground mb-4">Setup Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Google Sheets Template</h3>
              <p className="mb-4">Create a new Google Sheet and set up the following column headers.</p>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={copyTemplateStructure}
              >
                Copy Headers to Clipboard
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Apps Script Setup</h3>
              <p className="mb-4">Go to Extensions &gt; Apps Script. Paste this code and deploy as a Web App.</p>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={copyGasCode}
              >
                Copy Apps Script Code
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
