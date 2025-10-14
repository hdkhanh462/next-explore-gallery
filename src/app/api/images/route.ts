import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ImageItem } from "@/types/image";

const DB: ImageItem[] = [];

function seedIfEmpty() {
  if (DB.length > 0) return;
  for (let i = 1; i <= 40; i++) {
    DB.push({
      id: String(i),
      title: `Sample Image ${i}`,
      url: `https://picsum.photos/seed/${i}/600/400`,
      tags: i % 2 === 0 ? ["nature"] : ["city"],
      createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    });
  }
}
seedIfEmpty();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Number(url.searchParams.get("limit") || "10"));
  const tag = url.searchParams.get("tag") || "";

  let items = DB.slice();

  if (q) {
    const qq = q.toLowerCase();
    items = items.filter((i) => i.title.toLowerCase().includes(qq));
  }
  if (tag && tag !== "all") {
    items = items.filter((i) => i.tags?.includes(tag));
  }

  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return NextResponse.json({
    data: paged,
    meta: { page, limit, total: items.length },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newItem: ImageItem = {
      id: String(DB.length + 1),
      title: body.title || `Untitled ${DB.length + 1}`,
      url: body.url || `https://picsum.photos/seed/${Math.random()}/600/400`,
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
    };
    DB.unshift(newItem);
    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
