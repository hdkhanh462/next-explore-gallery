import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { imageFormSchema } from "@/schemas/image.schema";
import type { ImageItem } from "@/types/image";

export const DB: ImageItem[] = [];

function seedIfEmpty() {
  if (DB.length > 0) return;
  for (let i = 1; i <= 40; i++) {
    DB.push({
      id: String(i),
      title: `Sample Image ${i}`,
      url: `https://picsum.photos/seed/${i}/600/400`,
      tags: i % 2 === 0 ? ["nature"] : ["city"],
      likes: Math.floor(Math.random() * 100),
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
  const order = url.searchParams.get("order") || "desc";
  const orderBy = url.searchParams.get("orderBy") || "createdAt";

  let items = DB.slice();

  if (q) {
    const qq = q.toLowerCase();
    items = items.filter((i) => i.title.toLowerCase().includes(qq));
  }
  if (tag && tag !== "all") {
    items = items.filter((i) => i.tags?.includes(tag));
  }

  if (orderBy && (order === "asc" || order === "desc")) {
    items.sort((a, b) => {
      const aValue = a[orderBy as keyof ImageItem];
      const bValue = b[orderBy as keyof ImageItem];

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (order === "asc") return aValue.localeCompare(bValue);
        else return bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        if (order === "asc") return aValue - bValue;
        else return bValue - aValue;
      }
      return 0;
    });
  }

  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return NextResponse.json({
    data: paged,
    meta: { page, limit, total: items.length, order, orderBy },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = imageFormSchema.parse(await req.json());
    const newItem: ImageItem = {
      id: String(DB.length + 1),
      title: body.title || `Untitled ${DB.length + 1}`,
      url: body.url || `https://picsum.photos/seed/${Math.random()}/600/400`,
      tags: body.tags || [],
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    DB.unshift(newItem);
    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
