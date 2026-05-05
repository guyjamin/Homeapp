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

      {/* Per-Project Stat Cards */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => {
            const progress = project.target > 0 ? (project.saved / project.target) * 100 : 0
            const remaining = Math.max(0, project.target - project.saved)
            return (
              <Card key={project.id} className="p-6 bg-card border-border">
                {/* Project colour accent bar */}
                <div
                  className="h-1 w-full rounded-full mb-4"
                  style={{ backgroundColor: project.color }}
                />
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <p className="text-sm font-semibold text-foreground truncate">{project.name}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Saved</span>
                    <span className="text-xl font-bold text-primary">
                      KSh {formatCompactNumber(project.saved)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Target</span>
                    <span className="text-xl font-bold text-foreground">
                      KSh {formatCompactNumber(project.target)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Remaining</span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      KSh {formatCompactNumber(remaining)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {progress.toFixed(1)}% complete
                  </p>
                </div>
              </Card>
            )
          })}

          {/* Summary totals card */}
          <Card className="p-6 bg-card border-border border-dashed flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Banknote className="text-primary" size={18} />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">All Projects</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Total Saved</span>
                <span className="text-lg font-bold text-primary">
                  KSh {formatCompactNumber(totalSaved)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Total Target</span>
                <span className="text-lg font-bold text-foreground">
                  KSh {formatCompactNumber(totalTarget)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Overall</span>
                <span className="text-lg font-bold text-accent">
                  {overallProgress.toFixed(0)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

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
