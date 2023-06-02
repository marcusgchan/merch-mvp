import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  about: z
    .object({
      id: z.string(),
      description: z.string(),
    })
    .array(),
});

export type AddProductInput = z.infer<typeof addProductSchema>;
