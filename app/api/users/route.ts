import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { User } from "@/lib/types"

// In-memory store for demo purposes
const users: User[] = []

export async function GET(req: NextRequest) {
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const { name, email, passwordHash } = await req.json()
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  return NextResponse.json(newUser)
}
