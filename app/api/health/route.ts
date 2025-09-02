import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { HealthEntry } from "@/lib/types"

// In-memory store for demo purposes
const healthEntries: HealthEntry[] = []

export async function GET(req: NextRequest) {
  return NextResponse.json(healthEntries)
}

export async function POST(req: NextRequest) {
  const { type, value, userId, date } = await req.json()
  const newEntry: HealthEntry = {
    id: uuidv4(),
    userId,
    type,
    value,
    date,
  }
  healthEntries.push(newEntry)
  return NextResponse.json(newEntry)
}
