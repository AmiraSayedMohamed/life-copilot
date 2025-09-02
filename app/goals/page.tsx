"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { dataStore, type Goal } from "@/lib/data-store"
import { useState, useEffect } from "react"
import { Plus, Target, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function GoalsContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal",
    targetDate: "",
    milestones: [""],
  })

  useEffect(() => {
    if (user) {
      setGoals(dataStore.getGoals(user.id))
    }
  }, [user])

  const handleAddGoal = () => {
    if (!user || !newGoal.title.trim()) return

    const goal = dataStore.addGoal({
      ...newGoal,
      progress: 0,
      milestones: newGoal.milestones.filter((m) => m.trim()),
      userId: user.id,
    })

    setGoals((prev) => [goal, ...prev])
    setNewGoal({
      title: "",
      description: "",
      category: "personal",
      targetDate: "",
      milestones: [""],
    })
    setShowAddForm(false)
    toast({
      title: "Goal created",
      description: "Your new goal has been added.",
    })
  }

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    const updatedGoal = dataStore.updateGoal(goalId, { progress: newProgress })
    if (updatedGoal) {
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)))
    }
  }

  const addMilestone = () => {
    setNewGoal((prev) => ({ ...prev, milestones: [...prev.milestones, ""] }))
  }

  const updateMilestone = (index: number, value: string) => {
    setNewGoal((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => (i === index ? value : m)),
    }))
  }

  const removeMilestone = (index: number) => {
    setNewGoal((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  const getGoalStats = () => {
    const completed = goals.filter((g) => g.progress === 100).length
    const inProgress = goals.filter((g) => g.progress > 0 && g.progress < 100).length
    const notStarted = goals.filter((g) => g.progress === 0).length

    return { completed, inProgress, notStarted, total: goals.length }
  }

  const stats = getGoalStats()

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Goal Setting</h1>
            <p className="text-muted-foreground">Set and achieve your personal objectives</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
            </CardContent>
          </Card>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Goal</CardTitle>
              <CardDescription>Set a new objective to work towards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your goal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., health, career, personal"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your goal in detail"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Milestones</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                    Add Milestone
                  </Button>
                </div>
                {newGoal.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={milestone}
                      onChange={(e) => updateMilestone(index, e.target.value)}
                      placeholder={`Milestone ${index + 1}`}
                    />
                    {newGoal.milestones.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeMilestone(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddGoal}>Create Goal</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.length === 0 ? (
            <Card className="lg:col-span-2">
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first goal to track your progress</p>
                <Button onClick={() => setShowAddForm(true)}>Create Your First Goal</Button>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {goal.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{goal.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{goal.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  {goal.targetDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  )}

                  {goal.milestones.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Milestones</h4>
                      <ul className="space-y-1">
                        {goal.milestones.map((milestone, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => updateGoalProgress(goal.id, Number.parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">% complete</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function GoalsPage() {
  return (
    <AuthGuard>
      <GoalsContent />
    </AuthGuard>
  )
}
