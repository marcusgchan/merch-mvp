import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      select: { id: true, name: true, price: true },
      where: { archived: false },
    });

    return products;
  }),
  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findFirst({
      where: {
        id: input,
        archived: false,
      },
      include: {
        aboutProducts: {
          include: {
            product: true,
          },
        },
        availableSizes: {
          include: {
            productSize: true,
          },
        },
      },
    });

    return product;
  }),
});
