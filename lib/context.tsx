'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchSheetData, saveSheetData } from './sheets'

export interface Project {
  id: number
  name: string
  target: number
  saved: number
  color: string
  description?: string
}

export interface Transaction {
  id: number
  projectId: number
  projectName: string
  amount: number
  type: 'deposit' | 'withdrawal'
  date: string
  description?: string
}

interface AppContextType {
  projects: Project[]
  transactions: Transaction[]
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (project: Project) => void
  deleteProject: (id: number) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (updated: Transaction) => void
  deleteTransaction: (id: number) => void
  isSyncing: boolean
  syncError: string | null
  syncWithSheets: () => Promise<void>
}

const defaultProjects: Project[] = [
  {
    id: 1,
    name: 'Project 3 Bedroom',
    target: 50000,
    saved: 18500,
    color: '#6366f1',
    description: 'Kitchen and bathroom renovation project',
  },
  {
    id: 2,
    name: 'The Mutonyi Project',
    target: 15000,
    saved: 9200,
    color: '#06b6d4',
    description: '',
  },
]

const defaultTransactions: Transaction[] = [
  {
    id: 1,
    projectId: 1,
    projectName: 'Project 3 Bedroom',
    amount: 2500,
    type: 'deposit',
    date: '2024-05-15',
    description: 'Monthly savings',
  },
  {
    id: 2,
    projectId: 2,
    projectName: 'The Mutonyi Project',
    amount: 1200,
    type: 'deposit',
    date: '2024-05-14',
    description: 'Bonus deposit',
  },
  {
    id: 3,
    projectId: 1,
    projectName: 'Project 3 Bedroom',
    amount: 500,
    type: 'withdrawal',
    date: '2024-05-10',
    description: 'Plan change adjustment',
  },
]

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage('vault_projects', defaultProjects)
  )
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage('vault_transactions', defaultTransactions)
  )
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('vault_projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('vault_transactions', JSON.stringify(transactions))
  }, [transactions])

  const syncWithSheets = useCallback(async () => {
    const scriptUrl = localStorage.getItem('googleApiKey')
    if (!scriptUrl) {
      setSyncError('No Apps Script URL configured')
      return
    }

    setIsSyncing(true)
    setSyncError(null)

    try {
      // For now, we'll implement a 1-way push/pull mechanism based on user actions.
      // A more robust implementation would require conflict resolution.
      await saveSheetData(scriptUrl, { projects, transactions })
      setIsSyncing(false)
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : String(err))
      setIsSyncing(false)
    }
  }, [projects, transactions])

  const addProject = (project: Omit<Project, 'id'>) => {
    setProjects(prev => [...prev, { ...project, id: Date.now() }])
  }

  const updateProject = (project: Project) => {
    setProjects(prev => prev.map(p => (p.id === project.id ? project : p)))
  }

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    // Cascade-delete transactions belonging to this project
    setTransactions(prev => prev.filter(t => t.projectId !== id))
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...transaction, id: Date.now() }
    setTransactions(prev => [newTx, ...prev])
    // Update the project's saved amount
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== transaction.projectId) return p
        const delta =
          transaction.type === 'deposit' ? transaction.amount : -transaction.amount
        return { ...p, saved: Math.max(0, p.saved + delta) }
      })
    )
  }

  const updateTransaction = (updated: Transaction) => {
    const old = transactions.find(t => t.id === updated.id)
    if (!old) return

    setTransactions(prev => prev.map(t => (t.id === updated.id ? updated : t)))

    // Reverse old effect and apply new effect on affected projects
    setProjects(prev =>
      prev.map(p => {
        const isSameProject = old.projectId === updated.projectId && p.id === old.projectId
        if (isSameProject) {
          const oldDelta = old.type === 'deposit' ? old.amount : -old.amount
          const newDelta = updated.type === 'deposit' ? updated.amount : -updated.amount
          return { ...p, saved: Math.max(0, p.saved - oldDelta + newDelta) }
        }
        if (p.id === old.projectId) {
          const oldDelta = old.type === 'deposit' ? old.amount : -old.amount
          return { ...p, saved: Math.max(0, p.saved - oldDelta) }
        }
        if (p.id === updated.projectId) {
          const newDelta = updated.type === 'deposit' ? updated.amount : -updated.amount
          return { ...p, saved: Math.max(0, p.saved + newDelta) }
        }
        return p
      })
    )
  }

  const deleteTransaction = (id: number) => {
    const tx = transactions.find(t => t.id === id)
    setTransactions(prev => prev.filter(t => t.id !== id))
    if (tx) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id !== tx.projectId) return p
          const delta = tx.type === 'deposit' ? tx.amount : -tx.amount
          return { ...p, saved: Math.max(0, p.saved - delta) }
        })
      )
    }
  }

  return (
    <AppContext.Provider
      value={{
        projects,
        transactions,
        addProject,
        updateProject,
        deleteProject,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isSyncing,
        syncError,
        syncWithSheets,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
