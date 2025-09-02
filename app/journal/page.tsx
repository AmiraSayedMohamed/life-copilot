
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useToast } from "@/hooks/use-toast";

  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [entries, setEntries] = useState<Array<{ id: string; userId: string; content: string; date: string; images?: string[] }>>([]);
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your journal entry...</p>",
  });

  useEffect(() => {
    fetch("/api/journal/get-all")
      .then((res) => res.json())
      .then(setEntries);
  }, []);

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
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
    const content = editor.getHTML();
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demo-user", // Replace with actual user ID from context if available
        content,
        date: new Date().toISOString(),
        images: imageUrls,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast({ title: "Journal saved!", description: "Your entry was saved successfully." });
      setImageFiles([]);
      // Refresh entries
      fetch("/api/journal/get-all")
        .then((r) => r.json())
        .then(setEntries);
    } else {
      toast({ title: "Error", description: "Failed to save journal entry." });
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Journal & Notes</h1>
      <p className="mb-6">Write and edit your personal notes and journal entries with rich text formatting.</p>
      <div className="border rounded p-4 bg-muted mb-4">
        <EditorContent editor={editor} />
      </div>
      <div className="mb-4">
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
        className="bg-primary text-white px-4 py-2 rounded"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Entry"}
      </button>
      <h2 className="text-xl font-semibold mt-8 mb-2">Journal Entries</h2>
      <ul className="space-y-4">
        {entries.length === 0 && <li className="text-muted">No journal entries yet.</li>}
        {entries.map((entry) => (
          <li key={entry.id} className="border rounded p-3 bg-muted">
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
            <div className="text-sm text-muted mb-2">{new Date(entry.date).toLocaleDateString()}</div>
            {entry.images && entry.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {entry.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Journal" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
