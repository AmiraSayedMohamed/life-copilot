"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Heart, Brain, DollarSign, Target, BarChart3, Plus, TrendingUp } from "lucide-react"

function DashboardContent() {
  const stats = [
    {
      title: "Tasks Completed",
      value: "12",
      description: "Today",
      icon: Calendar,
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Health Score",
      value: "85%",
      description: "Overall wellness",
      icon: Heart,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Mood Rating",
      value: "7.2",
      description: "This week average",
      icon: Brain,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Budget Status",
      value: "$2,340",
      description: "Remaining this month",
      icon: DollarSign,
      trend: { value: 3, isPositive: false },
    },
  ]

  const recentActivities = [
    { title: "Morning workout completed", time: "2 hours ago", type: "health" },
    { title: "Budget review scheduled", time: "4 hours ago", type: "finance" },
    { title: "Meditation session logged", time: "6 hours ago", type: "emotion" },
    { title: "Weekly goals updated", time: "1 day ago", type: "goal" },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your life overview.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Quick Add
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest life management activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "health"
                          ? "bg-red-500"
                          : activity.type === "finance"
                            ? "bg-green-500"
                            : activity.type === "emotion"
                              ? "bg-purple-500"
                              : "bg-orange-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                Add Task
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Heart className="h-4 w-4" />
                Log Health Data
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Brain className="h-4 w-4" />
                Record Mood
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <DollarSign className="h-4 w-4" />
                Add Expense
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Target className="h-4 w-4" />
                Update Goals
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Insights & Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Schedule Optimization</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Consider moving your workout to 7 AM for better energy levels throughout the day.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Budget Alert</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You're on track to save $200 more this month by reducing dining out expenses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
