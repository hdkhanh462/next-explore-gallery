/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/performance/noImgElement: <> */

"use client";

import { betterFetch } from "@better-fetch/fetch";
import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { useInView } from "react-intersection-observer";
import { DEFAULT_LIMIT } from "@/components/limit-selector";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import type { ImageItem } from "@/types/image";

type ImageResponse = {
  data: ImageItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

type ImageParams = {
  q?: string;
  tag?: string;
  limit?: number;
};

type FetchImagesParams = {
  pageParam?: number;
  queryKey: ImageParams;
};

async function fetchImages({
  pageParam = 1,
  queryKey: { q = "", tag = "", limit = DEFAULT_LIMIT },
}: FetchImagesParams) {
  const res = await betterFetch<ImageResponse>(
    `/api/images?page=${pageParam}&limit=${limit}&q=${encodeURIComponent(q)}&tag=${encodeURIComponent(tag)}`,
  );

  return res.data ?? { data: [], meta: { page: 1, total: 0, limit } };
}

export default function ImageFeed({
  q = "",
  tag = "",
  limit = DEFAULT_LIMIT,
}: ImageParams) {
  const { ref: bottomRef, inView } = useInView({
    threshold: 0.1,
  });
  const query = useInfiniteQuery<
    ImageResponse,
    Error,
    InfiniteData<ImageResponse>,
    QueryKey,
    number
  >({
    queryKey: ["images", { q, tag, limit }],
    queryFn: ({ pageParam = 1 }) =>
      fetchImages({ pageParam, queryKey: { q, tag, limit } }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.meta;
      const nextPage = page + 1;
      return (nextPage - 1) * limit < total ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

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
      <ItemGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

export function ImageItemCard({ img }: { img: ImageItem }) {
  return (
    <Item variant="outline">
      <ItemHeader>
        <div className="relative aspect-[4/3] bg-muted w-full">
          <Image
            src={img.url}
            alt={img.title}
            fill
            className="object-cover rounded-sm"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </ItemHeader>
      <ItemContent>
        <ItemTitle>{img.title}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

export function ImageFeedSkeleton() {
  const placeholders = Array.from({ length: 8 });

  return (
    <ItemGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {placeholders.map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <>
        <Item key={index} variant="outline">
          <ItemHeader>
            <div className="relative aspect-[4/3] w-full">
              <Skeleton className="absolute inset-0 w-full h-full rounded-sm" />
            </div>
          </ItemHeader>
          <ItemContent>
            <Skeleton className="h-4 w-3/4" />
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
