"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { dataStore, type FinanceEntry } from "@/lib/data-store"
import { useState, useEffect } from "react"
import { Plus, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function FinancesContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [entries, setEntries] = useState<FinanceEntry[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState({
    amount: "",
    category: "food",
    description: "",
    type: "expense" as const,
  })

  useEffect(() => {
    if (user) {
      setEntries(dataStore.getFinanceEntries(user.id))
    }
  }, [user])

  const handleAddEntry = () => {
    if (!user || !newEntry.amount || !newEntry.description) return

    const entry = dataStore.addFinanceEntry({
      amount: Number.parseFloat(newEntry.amount),
      category: newEntry.category,
      description: newEntry.description,
      type: newEntry.type,
      date: new Date().toISOString().split("T")[0],
      userId: user.id,
    })

    setEntries((prev) => [entry, ...prev])
    setNewEntry({
      amount: "",
      category: "food",
      description: "",
      type: "expense",
    })
    setShowAddForm(false)
    toast({
      title: "Transaction added",
      description: "Your financial entry has been recorded.",
    })
  }

  const getFinancialSummary = () => {
    const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const monthlyEntries = entries.filter((e) => e.date.startsWith(thisMonth))

    const income = monthlyEntries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)

    const expenses = monthlyEntries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)

    return { income, expenses, balance: income - expenses }
  }

  const getCategoryBreakdown = () => {
    const thisMonth = new Date().toISOString().slice(0, 7)
    const monthlyExpenses = entries.filter((e) => e.date.startsWith(thisMonth) && e.type === "expense")

    const breakdown: Record<string, number> = {}
    monthlyExpenses.forEach((entry) => {
      breakdown[entry.category] = (breakdown[entry.category] || 0) + entry.amount
    })

    return Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  const summary = getFinancialSummary()
  const categoryBreakdown = getCategoryBreakdown()

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Management</h1>
            <p className="text-muted-foreground">Track your income, expenses, and budget</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${summary.income.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${summary.expenses.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${summary.balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
              <CardDescription>Record a new income or expense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newEntry.type}
                    onValueChange={(value: any) => setNewEntry((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newEntry.category}
                    onValueChange={(value) => setNewEntry((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="bills">Bills & Utilities</SelectItem>
                      <SelectItem value="health">Health & Fitness</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Transaction description"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddEntry}>Add Transaction</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
              <CardDescription>This month's expense breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryBreakdown.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No expenses recorded this month</p>
                ) : (
                  categoryBreakdown.map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize">{category}</span>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No transactions yet. Add your first entry!</p>
                ) : (
                  entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{entry.description}</span>
                          <Badge variant={entry.type === "income" ? "default" : "secondary"}>{entry.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.category} • {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`font-bold ${entry.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {entry.type === "income" ? "+" : "-"}${entry.amount.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function FinancesPage() {
  return (
    <AuthGuard>
      <FinancesContent />
    </AuthGuard>
  )
}
