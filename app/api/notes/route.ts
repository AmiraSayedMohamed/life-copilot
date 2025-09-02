import { NextResponse } from "next/server";

let notes: Array<{ id: string; userId: string; content: string; date: string }> = [];

export async function GET() {
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const { userId, content, date } = await req.json();
  const note = { id: Date.now().toString(), userId, content, date };
  notes.unshift(note);
  return NextResponse.json(note);
}
