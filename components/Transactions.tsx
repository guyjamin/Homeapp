'use client'

import { useState } from 'react'
import { useApp, type Transaction } from '@/lib/context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, ReceiptText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function Transactions() {
  const { projects, transactions, addTransaction, updateTransaction, deleteTransaction } = useApp()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id ?? 0,
    amount: '',
    type: 'deposit' as 'deposit' | 'withdrawal',
    date: new Date().toISOString().split('T')[0],
    description: '',
  })

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalDeposits - totalWithdrawals

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const project = projects.find(p => p.id === Number(formData.projectId))
    if (!project) return

    const payload = {
      projectId: project.id,
      projectName: project.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: formData.date,
      description: formData.description,
    }

    if (editingId) {
      updateTransaction({ ...payload, id: editingId })
    } else {
      addTransaction(payload)
    }

    resetForm()
    setIsOpen(false)
  }

  const resetForm = () => {
    setFormData({
      projectId: projects[0]?.id ?? 0,
      amount: '',
      type: 'deposit',
      date: new Date().toISOString().split('T')[0],
      description: '',
    })
    setEditingId(null)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setFormData({
      projectId: transaction.projectId,
      amount: transaction.amount.toString(),
      type: transaction.type,
      date: transaction.date,
      description: transaction.description || '',
    })
    setIsOpen(true)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
          <p className="text-muted-foreground">Record and manage your savings transactions</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={resetForm}
              disabled={projects.length === 0}
            >
              <Plus size={20} className="mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingId ? 'Edit Transaction' : 'Record New Transaction'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Project
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  required
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as 'deposit' | 'withdrawal' })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Amount (KSh)
                </label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="2500"
                  className="bg-input border-border text-foreground"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description (Optional)
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a note"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {editingId ? 'Update' : 'Record'} Transaction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsOpen(false); resetForm() }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Deposited</p>
          <p className="text-2xl font-bold text-primary">
            KSh {totalDeposits.toLocaleString()}
          </p>
        </Card>
        <Card className="p-5 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Withdrawn</p>
          <p className="text-2xl font-bold text-destructive">
            KSh {totalWithdrawals.toLocaleString()}
          </p>
        </Card>
        <Card className="p-5 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            KSh {netBalance.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <Card className="p-16 bg-card border-border text-center">
          <ReceiptText className="mx-auto text-muted-foreground mb-4" size={48} />
          <p className="text-xl font-semibold text-foreground mb-2">No transactions yet</p>
          <p className="text-sm text-muted-foreground">
            {projects.length === 0
              ? 'Create a project first, then record your first transaction.'
              : 'Record your first deposit or withdrawal above.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="p-4 bg-card border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`p-3 rounded-lg ${
                      transaction.type === 'deposit' ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}
                  >
                    {transaction.type === 'deposit' ? (
                      <TrendingUp className="text-primary" size={20} />
                    ) : (
                      <TrendingDown className="text-destructive" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{transaction.projectName}</h4>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.date).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        transaction.type === 'deposit' ? 'text-primary' : 'text-destructive'
                      }`}
                    >
                      {transaction.type === 'deposit' ? '+' : '-'}KSh{' '}
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{transaction.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit2 size={18} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
