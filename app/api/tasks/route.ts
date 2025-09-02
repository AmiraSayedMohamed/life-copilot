import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Task } from "@/lib/types"

// In-memory store for demo purposes
const tasks: Task[] = []

export async function GET(req: NextRequest) {
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const { title, description, userId, date } = await req.json()
  const newTask: Task = {
    id: uuidv4(),
    userId,
    title,
    description,
    date,
    completed: false,
  }
  tasks.push(newTask)
  return NextResponse.json(newTask)
}
