import { betterFetch } from "@better-fetch/fetch";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import UpdateImageCard from "@/components/update-image-card";
import type { ImageItem } from "@/types/image";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const res = await betterFetch<ImageItem>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/images/${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res.error) return notFound();

  return (
    <div className="container mx-auto h-dvh px-4">
      <main className="py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeftIcon className="size-6" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold leading-none">Image Details</h1>
          </div>
          <ModeToggle />
        </div>
        <UpdateImageCard image={res.data} />
      </main>
    </div>
  );
}
