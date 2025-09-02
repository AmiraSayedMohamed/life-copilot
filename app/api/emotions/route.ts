import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Emotion } from "@/lib/types"

// In-memory store for demo purposes
const emotions: Emotion[] = []

export async function GET(req: NextRequest) {
  return NextResponse.json(emotions)
}

export async function POST(req: NextRequest) {
  const { mood, note, userId } = await req.json()
  const newEmotion: Emotion = {
    id: uuidv4(),
    userId,
    mood,
    note,
    date: new Date().toISOString(),
  }
  emotions.push(newEmotion)
  return NextResponse.json(newEmotion)
}
