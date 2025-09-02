export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  category: string
  createdAt: string
  userId: string
}

export interface HealthEntry {
  id: string
  date: string
  weight?: number
  steps?: number
  sleep?: number
  water?: number
  exercise?: string
  mood: number // 1-10 scale
  notes?: string
  userId: string
}

export interface FinanceEntry {
  id: string
  amount: number
  category: string
  description: string
  type: "income" | "expense"
  date: string
  userId: string
}

export interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetDate: string
  progress: number // 0-100
  milestones: string[]
  userId: string
  createdAt: string
}

// Simple localStorage-based data store
export const dataStore = {
  // Tasks
  getTasks: (userId: string): Task[] => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    return tasks.filter((task: Task) => task.userId === userId)
  },

  addTask: (task: Omit<Task, "id" | "createdAt">): Task => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    tasks.push(newTask)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    return newTask
  },

  updateTask: (taskId: string, updates: Partial<Task>): Task | null => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const taskIndex = tasks.findIndex((t: Task) => t.id === taskId)
    if (taskIndex === -1) return null

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
    localStorage.setItem("tasks", JSON.stringify(tasks))
    return tasks[taskIndex]
  },

  deleteTask: (taskId: string): boolean => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const filteredTasks = tasks.filter((t: Task) => t.id !== taskId)
    localStorage.setItem("tasks", JSON.stringify(filteredTasks))
    return filteredTasks.length < tasks.length
  },

  // Health entries
  getHealthEntries: (userId: string): HealthEntry[] => {
    const entries = JSON.parse(localStorage.getItem("healthEntries") || "[]")
    return entries.filter((entry: HealthEntry) => entry.userId === userId)
  },

  addHealthEntry: (entry: Omit<HealthEntry, "id">): HealthEntry => {
    const entries = JSON.parse(localStorage.getItem("healthEntries") || "[]")
    const newEntry: HealthEntry = {
      ...entry,
      id: Date.now().toString(),
    }
    entries.push(newEntry)
    localStorage.setItem("healthEntries", JSON.stringify(entries))
    return newEntry
  },

  // Finance entries
  getFinanceEntries: (userId: string): FinanceEntry[] => {
    const entries = JSON.parse(localStorage.getItem("financeEntries") || "[]")
    return entries.filter((entry: FinanceEntry) => entry.userId === userId)
  },

  addFinanceEntry: (entry: Omit<FinanceEntry, "id">): FinanceEntry => {
    const entries = JSON.parse(localStorage.getItem("financeEntries") || "[]")
    const newEntry: FinanceEntry = {
      ...entry,
      id: Date.now().toString(),
    }
    entries.push(newEntry)
    localStorage.setItem("financeEntries", JSON.stringify(entries))
    return newEntry
  },

  // Goals
  getGoals: (userId: string): Goal[] => {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]")
    return goals.filter((goal: Goal) => goal.userId === userId)
  },

  addGoal: (goal: Omit<Goal, "id" | "createdAt">): Goal => {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]")
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    goals.push(newGoal)
    localStorage.setItem("goals", JSON.stringify(goals))
    return newGoal
  },

  updateGoal: (goalId: string, updates: Partial<Goal>): Goal | null => {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]")
    const goalIndex = goals.findIndex((g: Goal) => g.id === goalId)
    if (goalIndex === -1) return null

    goals[goalIndex] = { ...goals[goalIndex], ...updates }
    localStorage.setItem("goals", JSON.stringify(goals))
    return goals[goalIndex]
  },
}
