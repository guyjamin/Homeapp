'use client'

import { useState } from 'react'
import { AppProvider } from '@/lib/context'
import Dashboard from '@/components/Dashboard'
import Projects from '@/components/Projects'
import Transactions from '@/components/Transactions'
import Settings from '@/components/Settings'
import Navigation from '@/components/Navigation'
import { PinGate } from '@/components/PinGate'
import { Menu } from 'lucide-react'

type Page = 'dashboard' | 'projects' | 'transactions' | 'settings'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':    return <Dashboard />
      case 'projects':    return <Projects />
      case 'transactions': return <Transactions />
      case 'settings':    return <Settings />
      default:            return <Dashboard />
    }
  }

  return (
    <PinGate>
      <AppProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          <Navigation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <main className="flex-1 overflow-auto">
            {/* Mobile top bar */}
            <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur border-b border-border md:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} className="text-foreground" />
              </button>
              <span className="font-semibold text-foreground text-sm">The Kairu's Vault</span>
            </div>

            {renderPage()}
          </main>
        </div>
      </AppProvider>
    </PinGate>
  )
}
