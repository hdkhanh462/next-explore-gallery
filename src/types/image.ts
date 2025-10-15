export type ImageItem = {
  id: string;
  title: string;
  url: string;
  tags: string[];
  likes: number;
  createdAt: string;
};

export type ImageParams = {
  q?: string;
  tag?: string;
  limit?: number;
  order?: string;
};

export type ImageResponse = {
  data: ImageItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    order: string;
    orderBy: string;
  };
};
