import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Recommendation } from "@/lib/types"

// In-memory store for demo purposes
const recommendations: Recommendation[] = []

export async function GET() {
  // Mocked AI/ML recommendations
  const recommendations = [
    {
      id: "1",
      userId: "demo-user",
      type: "health",
      content: "Try a 10-minute walk after lunch for better digestion.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      userId: "demo-user",
      type: "productivity",
      content: "Set a daily priority to boost your focus.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      userId: "demo-user",
      type: "emotion",
      content: "Reflect on your mood each evening for better self-awareness.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      userId: "demo-user",
      type: "expense",
      content: "Review your weekly spending to spot savings opportunities.",
      createdAt: new Date().toISOString(),
    },
  ];
  return NextResponse.json(recommendations);
}

export async function POST(req: NextRequest) {
  const { type, content, userId } = await req.json()
  const newRecommendation: Recommendation = {
    id: uuidv4(),
    userId,
    type,
    content,
    createdAt: new Date().toISOString(),
  }
  recommendations.push(newRecommendation)
  return NextResponse.json(newRecommendation)
}
