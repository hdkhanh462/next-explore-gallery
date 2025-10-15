/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/performance/noImgElement: <> */

"use client";

import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useInView } from "react-intersection-observer";
import { DEFAULT_LIMIT } from "@/components/limit-selector";
import { DEFAULT_ORDER } from "@/components/order-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useToggleLikeImageMutation } from "@/data/mutations";
import { useInfiniteImages } from "@/data/queries";
import useLocalStorage from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import type { ImageItem, ImageParams } from "@/types/image";

export default function ImageFeed({
  q = "",
  tag = "",
  limit = DEFAULT_LIMIT,
  order = DEFAULT_ORDER,
}: ImageParams) {
  const { ref: bottomRef, inView } = useInView({
    threshold: 0.1,
  });
  const query = useInfiniteImages({ q, tag, limit, order });

  React.useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [
    inView,
    query.hasNextPage,
    query.isFetchingNextPage,
    query.fetchNextPage,
  ]);

  if (query.status === "pending") return <ImageFeedSkeleton />;
  if (query.status === "error") return <div>Error loading images</div>;

  return (
    <div>
      <ItemGroup
        data-testid="image-feed"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {query.data?.pages
          .flatMap((p) => p.data)
          .map((img) => (
            <ImageItemCard key={img.id} img={img} />
          ))}
      </ItemGroup>

      <div ref={bottomRef} className="mt-4 text-center">
        {query.isFetchingNextPage ? (
          <div>Loading more...</div>
        ) : (
          <div>No more images</div>
        )}
      </div>
    </div>
  );
}

type ImageItemCard = {
  img: ImageItem;
  priority?: boolean;
};

export function ImageItemCard({ img, priority }: ImageItemCard) {
  const toggleLikeMutation = useToggleLikeImageMutation({ img });
  const [likedImages] = useLocalStorage<string[]>("liked-images", []);
  return (
    <Item variant="outline">
      <ItemHeader>
        <div className="relative aspect-video bg-muted w-full">
          <Image
            src={img.url}
            alt={img.title}
            className="object-cover rounded-sm size-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={50}
            priority={priority}
            fill
          />
        </div>
      </ItemHeader>
      <ItemContent>
        <ItemTitle className="justify-between flex w-full">
          <Link href={`/images/${img.id}`} className="hover:underline">
            {img.title}
          </Link>

          <Button
            onClick={() =>
              toggleLikeMutation.mutate({
                id: img.id,
                liked: !likedImages?.includes(img.id),
              })
            }
            variant="ghost"
            size="sm"
            className={cn(
              "hover:text-destructive",
              likedImages?.includes(img.id) && "text-destructive",
            )}
          >
            {img.likes}
            <HeartIcon />
          </Button>
        </ItemTitle>
        <ItemDescription>
          {img.tags.length > 0 &&
            img.tags.map((tag) => (
              <Badge key={tag} className="mr-1 capitalize leading-none">
                {tag}
              </Badge>
            ))}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

export function ImageFeedSkeleton() {
  const placeholders = Array.from({ length: 8 });

  return (
    <ItemGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {placeholders.map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <>
        <Item key={index} variant="outline">
          <ItemHeader>
            <div className="relative aspect-video w-full">
              <Skeleton className="absolute inset-0 w-full h-full rounded-sm" />
            </div>
          </ItemHeader>
          <ItemContent>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
