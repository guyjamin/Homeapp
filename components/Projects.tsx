'use client'

import { useState } from 'react'
import { useApp, type Project } from '@/lib/context'
import { formatCompactNumber } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit2, FolderOpen } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const PROJECT_COLORS = [
  '#6366f1', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
]

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useApp()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    saved: '',
    color: PROJECT_COLORS[0],
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      const existing = projects.find(p => p.id === editingId)
      if (!existing) return
      updateProject({
        ...existing,
        name: formData.name,
        target: parseFloat(formData.target),
        saved: parseFloat(formData.saved) || existing.saved,
        color: formData.color,
        description: formData.description,
      })
    } else {
      addProject({
        name: formData.name,
        target: parseFloat(formData.target),
        saved: parseFloat(formData.saved) || 0,
        color: formData.color,
        description: formData.description,
      })
    }

    setFormData({ name: '', target: '', saved: '', color: PROJECT_COLORS[0], description: '' })
    setEditingId(null)
    setIsOpen(false)
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setFormData({
      name: project.name,
      target: project.target.toString(),
      saved: project.saved.toString(),
      color: project.color,
      description: project.description || '',
    })
    setIsOpen(true)
  }

  const handleOpenNew = () => {
    setEditingId(null)
    setFormData({ name: '', target: '', saved: '', color: PROJECT_COLORS[0], description: '' })
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage your savings projects</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleOpenNew}
            >
              <Plus size={20} className="mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingId ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Project Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Project 3 Bedroom"
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Target Amount (KSh)
                </label>
                <Input
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="50000"
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Starting Balance (KSh)
                </label>
                <Input
                  type="number"
                  value={formData.saved}
                  onChange={(e) => setFormData({ ...formData, saved: e.target.value })}
                  placeholder="0"
                  className="bg-input border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Amount already saved before using this app. Transactions will add to this.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Colour
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PROJECT_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        formData.color === color
                          ? 'border-foreground scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description (Optional)
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a description for this project"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {editingId ? 'Update' : 'Create'} Project
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsOpen(false); setEditingId(null) }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="p-16 bg-card border-border text-center">
          <FolderOpen className="mx-auto text-muted-foreground mb-4" size={48} />
          <p className="text-xl font-semibold text-foreground mb-2">No projects yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first savings goal to get started.
          </p>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => { handleOpenNew(); setIsOpen(true) }}
          >
            <Plus size={20} className="mr-2" />
            Create First Project
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => {
            const progress = project.target > 0 ? (project.saved / project.target) * 100 : 0
            return (
              <Card key={project.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-3 ml-6">{project.description}</p>
                    )}
                    <div className="space-y-2 ml-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">
                          KSh {formatCompactNumber(project.saved)} / KSh {formatCompactNumber(project.target)}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: project.color,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{progress.toFixed(1)}% complete</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit2 size={18} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
