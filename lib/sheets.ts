import { Project, Transaction } from './context'

export interface SyncData {
  projects: Project[]
  transactions: Transaction[]
}

export async function fetchSheetData(scriptUrl: string): Promise<SyncData> {
  const res = await fetch('/api/sheets', {
    headers: {
      'x-script-url': scriptUrl,
    },
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch data from Sheets')
  }
  return res.json()
}

export async function saveSheetData(scriptUrl: string, data: SyncData): Promise<void> {
  const res = await fetch('/api/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-script-url': scriptUrl,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to save data to Sheets')
  }
}
