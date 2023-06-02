import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1),
  price: z
    .string()
    .min(1)
    .regex(new RegExp("^\\d*(\\.\\d{0,2})?$"))
    .transform((v) => parseFloat(v)).or(z.number().refine((val) => {
      const str = val.toString();
      return str.match(new RegExp("^\\d*(\\.\\d{0,2})?$"));
    })),
  about: z
    .object({
      id: z.string(),
      description: z.string().min(1),
    })
    .array(),
});

export type AddProductInput = z.infer<typeof addProductSchema>;
