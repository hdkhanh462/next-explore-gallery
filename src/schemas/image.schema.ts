import z from "zod";

export const imageFormSchema = z.object({
  title: z
    .string()
    .min(5, "Image title must be at least 5 characters.")
    .max(32, "Image title must be at most 32 characters."),
  url: z.url("Please enter a valid URL.").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
});

export type ImageFormInput = z.infer<typeof imageFormSchema>;
