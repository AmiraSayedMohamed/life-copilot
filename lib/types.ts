export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  passwordHash?: string
  avatar?: string
  bio?: string
  phone?: string
  timezone?: string
  preferences?: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    emailUpdates: boolean
  }
}

// Schedule/Task schema
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  images?: string[]; // Array of image filenames or URLs
}

// Health schema
export interface HealthEntry {
  id: string;
  userId: string;
  type: "weight" | "activity" | "meal" | "other";
  value: string;
  date: string;
  images?: string[];
}

// Expense schema
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  images?: string[];
}

// Emotion schema
export interface Emotion {
  id: string;
  userId: string;
  mood: string;
  note?: string;
  date: string;
  images?: string[];
}

// Recommendation schema
export interface Recommendation {
  id: string;
  userId: string;
  type: string;
  content: string;
  createdAt: string;
  images?: string[];
}

// Notes schema
export interface Note {
  id: string;
  userId: string;
  content: string;
  date: string;
  images?: string[];
}

// Journal schema
export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  date: string;
  images?: string[];
}
