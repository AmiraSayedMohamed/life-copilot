import { NextResponse } from "next/server";

let journals: Array<{ id: string; userId: string; content: string; date: string }> = [];

export async function GET() {
  return NextResponse.json(journals);
}

export async function POST(req: Request) {
  const { userId, content, date } = await req.json();
  const journal = { id: Date.now().toString(), userId, content, date };
  journals.unshift(journal);
  return NextResponse.json(journal);
}
