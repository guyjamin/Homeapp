'use client'

import { useApp } from '@/lib/context'
import { Card } from '@/components/ui/card'
import { formatCompactNumber, formatFullNumber } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Banknote } from 'lucide-react'

export default function Dashboard() {
  const { projects, transactions } = useApp()

  const totalSaved = projects.reduce((sum, p) => sum + p.saved, 0)
  const totalTarget = projects.reduce((sum, p) => sum + p.target, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  // Build savings trend: last 6 months of net deposits per project
  const savingsHistory = (() => {
    const now = new Date()
    const months: { month: string; [key: string]: number | string }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString('default', { month: 'short' })
      const entry: { month: string; [key: string]: number | string } = { month: label }
      projects.forEach(p => { entry[`p_${p.id}`] = 0 })
      months.push(entry)
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.date)
      const monthLabel = txDate.toLocaleString('default', { month: 'short' })
      const entry = months.find(m => m.month === monthLabel)
      if (!entry) return
      const key = `p_${tx.projectId}`
      const delta = tx.type === 'deposit' ? tx.amount : -tx.amount
      entry[key] = ((entry[key] as number) || 0) + delta
    })

    return months
  })()

  const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)']

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track your savings progress across all projects</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
              <p className="text-3xl font-bold text-primary">
                KSh {formatCompactNumber(totalSaved)}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Banknote className="text-primary" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Target</p>
              <p className="text-3xl font-bold text-secondary">
                KSh {formatCompactNumber(totalTarget)}
              </p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <TrendingUp className="text-secondary" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
              <p className="text-3xl font-bold text-accent">{overallProgress.toFixed(0)}%</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <TrendingUp className="text-accent" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Projects Overview */}
      {projects.length === 0 ? (
        <Card className="p-12 bg-card border-border text-center">
          <Banknote className="mx-auto text-muted-foreground mb-3" size={40} />
          <p className="text-lg font-semibold text-foreground mb-1">No projects yet</p>
          <p className="text-sm text-muted-foreground">Go to Projects to create your first savings goal.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => {
            const progress = project.target > 0 ? (project.saved / project.target) * 100 : 0
            return (
              <Card key={project.id} className="p-6 bg-card border-border">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{project.name}</h3>
                    <span className="text-2xl font-bold text-primary">
                      KSh {formatCompactNumber(project.saved)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    of KSh {formatCompactNumber(project.target)} target
                  </p>
                </div>
                <Progress value={progress} className="h-2 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  {progress.toFixed(1)}% complete
                </p>
              </Card>
            )
          })}
        </div>
      )}

      {/* Savings Trend */}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold text-foreground text-lg mb-4">Savings Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={savingsHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
            <YAxis
              stroke="var(--color-muted-foreground)"
              tickFormatter={(v: number) => `KSh ${formatCompactNumber(v)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`KSh ${formatFullNumber(value)}`, '']}
            />
            <Legend />
            {projects.map((p, i) => (
              <Line
                key={p.id}
                type="monotone"
                dataKey={`p_${p.id}`}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                name={p.name}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
