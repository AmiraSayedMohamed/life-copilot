import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Expense } from "@/lib/types"

// In-memory store for demo purposes
const expenses: Expense[] = []

export async function GET(req: NextRequest) {
  return NextResponse.json(expenses)
}

export async function POST(req: NextRequest) {
  const { amount, category, description, userId, date } = await req.json()
  const newExpense: Expense = {
    id: uuidv4(),
    userId,
    amount,
    category,
    description,
    date,
  }
  expenses.push(newExpense)
  return NextResponse.json(newExpense)
}
