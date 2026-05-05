'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'

export function PinGate({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState('')
  const [isLocked, setIsLocked] = useState(true)
  const [savedPin, setSavedPin] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('vault_pin')
    if (stored) {
      setSavedPin(stored)
    } else {
      setIsLocked(false) // No PIN set, allow access
    }
  }, [])

  if (!mounted) return null // Avoid hydration mismatch

  if (!isLocked) return <>{children}</>

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === savedPin) {
      setIsLocked(false)
    } else {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur">
      <Card className="p-8 max-w-md w-full mx-4 border-border shadow-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="text-primary w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Enter PIN</h2>
            <p className="text-sm text-muted-foreground">
              Please enter your PIN to access The Kairu's Vault
            </p>
          </div>
          <form onSubmit={handlePinSubmit} className="w-full space-y-4 pt-4">
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className={`text-center text-2xl tracking-widest ${
                error ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                Incorrect PIN
              </p>
            )}
          </form>
        </div>
      </Card>
    </div>
  )
}
