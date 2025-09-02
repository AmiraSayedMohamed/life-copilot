"use client"
import React, { useState, useEffect } from "react"

interface Emotion {
  id: string
  userId: string
  mood: string
  note?: string
  date: string
  images?: string[]
}

export default function EmotionsPage() {
  const [mood, setMood] = useState("")
  const [note, setNote] = useState("")
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/emotions")
      .then((res) => res.json())
      .then(setEmotions)
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
    const res = await fetch("/api/emotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, note, userId: "demo-user", images: imageUrls })
    })
    const newEmotion = await res.json()
    setEmotions((prev) => [newEmotion, ...prev])
    setMood("")
    setNote("")
    setImageFiles([])
    setLoading(false)
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Emotions Tracker</h1>
      <p className="mb-6">Log and review your daily emotions to gain insights into your well-being.</p>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Mood</label>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="How do you feel today?"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Add details about your mood..."
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
          {loading ? "Saving..." : "Log Emotion"}
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Emotion History</h2>
      <ul className="space-y-2">
        {emotions.length === 0 && <li className="text-muted">No emotions logged yet.</li>}
        {emotions.map((emotion) => (
          <li key={emotion.id} className="border rounded p-3 bg-muted">
            <div className="font-bold">{emotion.mood}</div>
            <div className="text-sm text-muted">{new Date(emotion.date).toLocaleString()}</div>
            {emotion.note && <div className="mt-1">{emotion.note}</div>}
            {emotion.images && emotion.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {emotion.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Emotion" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
