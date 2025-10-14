import { betterFetch } from "@better-fetch/fetch";
import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/components/limit-selector";
import { DEFAULT_ORDER } from "@/components/order-selector";
import type { ImageParams, ImageResponse } from "@/types/image";

type FetchImagesParams = {
  pageParam?: number;
  queryKey: ImageParams;
};

async function fetchImages({
  pageParam = 1,
  queryKey: { q = "", tag = "", limit = DEFAULT_LIMIT, order = DEFAULT_ORDER },
}: FetchImagesParams) {
  const url = new URL("/api/images", window.location.origin);
  if (pageParam) url.searchParams.append("page", pageParam.toString());
  if (q) url.searchParams.append("q", q);
  if (tag) url.searchParams.append("tag", tag);
  if (limit) url.searchParams.append("limit", limit.toString());
  if (order) {
    const [by, ord] = order.split("|");
    if (by && ord) {
      url.searchParams.append("orderBy", by);
      url.searchParams.append("order", ord);
    }
  }

  const res = await betterFetch<ImageResponse>(url.toString());
  return (
    res.data ?? {
      data: [],
      meta: { page: 1, total: 0, limit, order: "", orderBy: "" },
    }
  );
}

export function useInfiniteImages({ q, tag, limit, order }: ImageParams) {
  return useInfiniteQuery<
    ImageResponse,
    Error,
    InfiniteData<ImageResponse>,
    QueryKey,
    number
  >({
    queryKey: ["images", { q, tag, limit, order }],
    queryFn: ({ pageParam = 1 }) =>
      fetchImages({ pageParam, queryKey: { q, tag, limit, order } }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.meta;
      const nextPage = page + 1;
      return (nextPage - 1) * limit < total ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}
