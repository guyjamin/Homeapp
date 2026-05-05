'use client'

import { BarChart3, Settings, Wallet, Zap, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface NavigationProps {
  currentPage: 'dashboard' | 'projects' | 'transactions' | 'settings'
  setCurrentPage: (page: 'dashboard' | 'projects' | 'transactions' | 'settings') => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: Zap },
  { id: 'transactions', label: 'Transactions', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

export default function Navigation({
  currentPage,
  setCurrentPage,
  mobileOpen,
  setMobileOpen,
}: NavigationProps) {
  const handleNav = (id: typeof navItems[number]['id']) => {
    setCurrentPage(id)
    setMobileOpen(false)
  }

  const sidebarContent = (
    <nav className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0" />
          The Kairu's Vault
        </h1>
        {/* Close button — mobile only */}
        <button
          className="md:hidden p-1 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav items */}
      <div className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-sidebar-foreground/60">Theme</p>
          <ThemeToggle />
        </div>
        <p className="text-xs text-sidebar-foreground/50">
          © 2026 KagecheDev Inc.{' '}
          <a
            href="https://jamin-kairu.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sidebar-foreground/80 transition-colors"
          >
            kagechedev.com
          </a>
        </p>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="hidden md:block h-screen flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar — slide-in overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 z-50 md:hidden animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  )
}
