import { z } from "zod";

export const addOrderSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  products: z
    .object({
      id: z.string(),
      quantity: z.number().min(1),
      size: z.enum(["xxs", "xs", "s", "m", "l", "xl", "xxl"]).optional(),
    })
    .array()
    .min(1),
});
