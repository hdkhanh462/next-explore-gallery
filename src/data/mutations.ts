"use client";

import { betterFetch } from "@better-fetch/fetch";
import {
  type InfiniteData,
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useLocalStorage from "@/hooks/use-local-storage";
import type { ImageItem, ImageResponse } from "@/types/image";

type LikeImageParams = {
  id: string;
  liked?: boolean;
};

async function likeImage({ id, liked = true }: LikeImageParams) {
  const res = await betterFetch<ImageItem>(`/api/images/${id}`, {
    method: "PATCH",
    body: { liked },
  });

  if (res.error) {
    throw new Error(res.error.message || "Error liking image");
  }

  return res.data;
}

type Props = {
  img: ImageItem;
};

export function useToggleLikeImageMutation({ img }: Props) {
  const queryClient = useQueryClient();

  // Simulate user liked images with local storage
  const [likedImages, setLikedImages] = useLocalStorage<string[]>(
    "liked-images",
    [],
  );

  return useMutation({
    mutationFn: likeImage,
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: ["images"] });

      const queries = queryClient.getQueriesData<InfiniteData<ImageResponse>>({
        queryKey: ["images"],
        exact: false,
      });

      const previousData: [
        QueryKey,
        InfiniteData<ImageResponse> | undefined,
      ][] = queries.map(([key, data]) => [key, data]);
      const previousLikes = likedImages;

      for (const [key, data] of queries) {
        if (!data) continue;

        const newData: InfiniteData<ImageResponse> = {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((item) =>
              item.id === id
                ? { ...item, likes: Math.max(0, item.likes + (liked ? 1 : -1)) }
                : item,
            ),
          })),
        };

        queryClient.setQueryData(key, newData);
      }

      setLikedImages((prev) => {
        if (!prev) return liked ? [id] : [];
        if (liked && !prev.includes(id)) return [...prev, id];
        if (!liked && prev.includes(id))
          return prev.filter((existingId) => existingId !== id);
        return prev;
      });

      return { previousData, previousLikes };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;

      for (const [key, data] of ctx.previousData) {
        queryClient.setQueryData(key, data);
      }

      if (ctx.previousLikes) {
        setLikedImages(ctx.previousLikes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["image", img.id] });
      queryClient.invalidateQueries({ queryKey: ["images"], type: "active" });
    },
  });
}
