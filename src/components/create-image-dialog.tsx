"use client";

import { betterFetch } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ImageForm from "@/components/image-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type ImageFormInput, imageFormSchema } from "@/schemas/image.schema";

export default function CreateImageDialog() {
  const [open, setOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const form = useForm<ImageFormInput>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      title: "",
      url: "",
      tags: [],
    },
  });

  async function onSubmit(values: ImageFormInput) {
    const res = await betterFetch("/api/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        tags: values.tags?.map((tag) => tag.toLowerCase().trim()) ?? [],
      }),
    });

    if (res.error) {
      toast.error(res.error.message || "Something went wrong.");
      return;
    }

    setOpen(false);
    toast.success("Image created successfully!");
    queryClient.invalidateQueries({ queryKey: ["images"], type: "active" });
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Image</DialogTitle>
          <DialogDescription>
            Fill the form to create a new image.
          </DialogDescription>
        </DialogHeader>

        <ImageForm form={form} onSubmit={onSubmit} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-create-image">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
