"use client"
import React, { useState, useEffect } from "react"

interface Task {
  id: string
  userId: string
  title: string
  description?: string
  date: string
  completed: boolean
  images?: string[]
}

export default function TasksPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setTasks)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) imageUrls.push(data.url);
      }
    }
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, date, userId: "demo-user", images: imageUrls })
    })
    const newTask = await res.json()
    setTasks((prev) => [newTask, ...prev])
    setTitle("")
    setDescription("")
    setDate("")
    setImageFiles([])
    setLoading(false)
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Tasks & Schedule</h1>
      <p className="mb-6">Manage your daily tasks and schedule efficiently.</p>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Enter task title"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Task details..."
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => setImageFiles(Array.from(e.target.files || []))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Task"}
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Task List</h2>
      <ul className="space-y-2">
        {tasks.length === 0 && <li className="text-muted">No tasks added yet.</li>}
        {tasks.map((task) => (
          <li key={task.id} className="border rounded p-3 bg-muted">
            <div className="font-bold">{task.title}</div>
            <div className="text-sm text-muted">{new Date(task.date).toLocaleDateString()}</div>
            {task.description && <div className="mt-1">{task.description}</div>}
            <div className="mt-1 text-xs">{task.completed ? "Completed" : "Pending"}</div>
            {task.images && task.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {task.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Task" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
