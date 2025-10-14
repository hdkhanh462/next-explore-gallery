import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DB } from "@/app/api/images/route";

type Params = Promise<{ id: string }>;

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const item = DB.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  // throw new Error("Simulated error"); // For testing rollback

  const { id } = await params;
  const body = await req.json();
  const item = DB.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  item.likes = Math.max(0, item.likes + (body.liked ? 1 : -1));

  return NextResponse.json(item);
}
