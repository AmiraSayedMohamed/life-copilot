"use client"
import React, { useState, useEffect } from "react"

interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  images?: string[];
}

export default function ExpensesPage() {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then(setExpenses)
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
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), category, description, date, userId: "demo-user", images: imageUrls })
    })
    const newExpense = await res.json()
    setExpenses((prev) => [newExpense, ...prev])
    setAmount("")
    setCategory("")
    setDescription("")
    setDate("")
    setImageFiles([])
    setLoading(false)
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Expenses & Budget</h1>
      <p className="mb-6">Log your expenses and view smart budgeting recommendations.</p>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Expense amount"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Expense category"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Expense details..."
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
          {loading ? "Saving..." : "Add Expense"}
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Expense List</h2>
      <ul className="space-y-2">
        {expenses.length === 0 && <li className="text-muted">No expenses added yet.</li>}
        {expenses.map((expense) => (
          <li key={expense.id} className="border rounded p-3 bg-muted">
            <div className="font-bold">{expense.category} - ${expense.amount.toFixed(2)}</div>
            <div className="text-sm text-muted">{new Date(expense.date).toLocaleDateString()}</div>
            {expense.description && <div className="mt-1">{expense.description}</div>}
            {expense.images && expense.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {expense.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Expense" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
