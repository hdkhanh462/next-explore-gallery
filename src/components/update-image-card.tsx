"use client";

import { betterFetch } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ImageForm from "@/components/image-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ImageFormInput, imageFormSchema } from "@/schemas/image.schema";
import type { ImageItem } from "@/types/image";

type Props = {
  image: ImageItem;
};

export default function UpdateImageCard({ image }: Props) {
  const queryClient = useQueryClient();
  const form = useForm<ImageFormInput>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      title: image.title,
      url: image.url,
      tags: image.tags,
    },
  });

  const onSubmit = async (values: ImageFormInput) => {
    const res = await betterFetch(`/api/images/${image.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.error) {
      toast.error(res.error.message || "Something went wrong.");
      return;
    }
    toast.success("Image updated successfully!");
    queryClient.invalidateQueries({ queryKey: ["images"] });
    form.reset(form.getValues());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{image.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageForm form={form} onSubmit={onSubmit} />
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="form-create-image"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
