import { NextResponse } from "next/server";

// In-memory store for demo purposes
let journals: Array<{ id: string; userId: string; content: string; date: string; images?: string[] }> = [];

export async function GET() {
  return NextResponse.json(journals);
}

export async function POST(req: Request) {
  const { userId, content, date, images } = await req.json();
  const journal = { id: Date.now().toString(), userId, content, date, images };
  journals.unshift(journal);
  return NextResponse.json(journal);
}
