"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "@/components/ui/tags-input";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Image title must be at least 5 characters.")
    .max(32, "Image title must be at most 32 characters."),
  url: z.url("Please enter a valid URL.").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
});

type Props = {
  onCreated?: () => void;
};

export default function CreateImageDialog({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      tags: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          tags: values.tags?.map((tag) => tag.toLowerCase().trim()) ?? [],
        }),
      });
      form.reset();
      onCreated?.();
      setOpen(false);
      toast.success?.("Image created successfully!");
    } catch {
      toast.error?.("Failed to create image");
    }
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

        <form
          id="form-create-image"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-image-title">
                    Image Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-image-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="A beautiful sunrise"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-image-url">
                    Image Tags
                  </FieldLabel>
                  <TagsInput
                    value={field.value ?? []}
                    onValueChange={(value) => field.onChange(value)}
                    editable
                    addOnPaste
                  >
                    <TagsInputList
                      className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      )}
                    >
                      {field.value?.map((tag) => (
                        <TagsInputItem
                          key={tag}
                          value={tag}
                          className="px-2 py-0.5 capitalize"
                        >
                          {tag}
                        </TagsInputItem>
                      ))}
                      <TagsInputInput placeholder="Add tag..." />
                    </TagsInputList>
                  </TagsInput>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-image-url">
                    Image URL
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-image-url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com/image.jpg"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

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
