"use client";
import React, { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";

interface HealthEntry {
	id: string;
	userId: string;
	type: "weight" | "activity" | "meal" | "other";
	value: string;
	date: string;
	images?: string[];
}

function HealthContent() {
		const [type, setType] = useState<HealthEntry["type"]>("weight");
		const [value, setValue] = useState("");
		const [date, setDate] = useState("");
		const [imageFiles, setImageFiles] = useState<File[]>([]);
		const [entries, setEntries] = useState<HealthEntry[]>([]);
		const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetch("/api/health")
			.then((res) => res.json())
			.then(setEntries);
	}, []);

		const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setLoading(true);
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
			const res = await fetch("/api/health", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type, value, date, userId: "demo-user", images: imageUrls }),
			});
			const newEntry = await res.json();
			setEntries((prev) => [newEntry, ...prev]);
			setType("weight");
			setValue("");
			setDate("");
			setImageFiles([]);
			setLoading(false);
		};

	return (
		<main className="p-8 max-w-xl mx-auto">
			<h1 className="text-3xl font-bold mb-4">Health Reports</h1>
			<p className="mb-6">View your health data and receive personalized recommendations.</p>
			<form onSubmit={handleSubmit} className="mb-6 space-y-4">
						<div>
							<label className="block mb-1 font-medium">Type</label>
							<select
								value={type}
								onChange={(e) => setType(e.target.value as HealthEntry["type"])}
								className="border rounded px-3 py-2 w-full"
								required
							>
								<option value="weight">Weight</option>
								<option value="activity">Activity</option>
								<option value="meal">Meal</option>
								<option value="other">Other</option>
							</select>
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
				<div>
					<label className="block mb-1 font-medium">Value</label>
					<input
						type="text"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className="border rounded px-3 py-2 w-full"
						placeholder="e.g. 70kg, Running, Salad"
						required
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
				<button
					type="submit"
					className="bg-primary text-white px-4 py-2 rounded"
					disabled={loading}
				>
					{loading ? "Saving..." : "Add Entry"}
				</button>
			</form>
			<h2 className="text-xl font-semibold mb-2">Health Entries</h2>
			<ul className="space-y-2">
						{entries.length === 0 && <li className="text-muted">No health data added yet.</li>}
						{entries.map((entry) => (
							<li key={entry.id} className="border rounded p-3 bg-muted">
								<div className="font-bold">{entry.type}: {entry.value}</div>
								<div className="text-sm text-muted">{new Date(entry.date).toLocaleDateString()}</div>
								{entry.images && entry.images.length > 0 && (
									<div className="flex gap-2 mt-2">
										{entry.images.map((img, idx) => (
											<img key={idx} src={img} alt="Health" className="w-16 h-16 object-cover rounded" />
										))}
									</div>
								)}
							</li>
						))}
			</ul>
		</main>
	);
}

export default function HealthPage() {
	return (
		<AuthGuard>
			<HealthContent />
		</AuthGuard>
	);
}
