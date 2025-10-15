"use client";

import React from "react";
import CreateImageDialog from "@/components/create-image-dialog";
import ImageFeed from "@/components/image-feed";
import ImageSearchBar from "@/components/image-search-bar";
import LimitSelector, { DEFAULT_LIMIT } from "@/components/limit-selector";
import OrderSelector, { DEFAULT_ORDER } from "@/components/order-selector";
import TagFilter from "@/components/tag-filter";

export default function Gallery() {
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState("all");
  const [limit, setLimit] = React.useState(DEFAULT_LIMIT);
  const [order, setOrder] = React.useState(DEFAULT_ORDER);

  return (
    <>
      <div className="flex gap-2 items-center w-full">
        <ImageSearchBar onSearch={(q) => setQuery(q)} />
        <CreateImageDialog />
      </div>
      <div className="flex justify-between w-full max-sm:flex-col gap-y-6">
        <TagFilter selected={tag} onChange={setTag} />
        <div className="flex gap-2 items-center">
          <OrderSelector onChange={setOrder} />
          <LimitSelector onChange={(value) => setLimit(Number(value))} />
        </div>
      </div>
      <ImageFeed q={query} tag={tag} limit={limit} order={order} />
    </>
  );
}
