import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { addProductSchema } from "~/schemas/productManagement";

export const productManagement = createTRPCRouter({
  add: protectedProcedure
    .input(addProductSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          name: input.name,
          price: input.price,
          aboutProducts: {
            createMany: {
              data: input.about,
            },
          },
        },
      });

      return product;
    }),
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const products = await ctx.prisma.product.findMany();
      return products;
    }),
  get: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: {
          id: input,
        },
        include: {
          aboutProducts: true,
          availableSizes: true,
        },
      });

      return product;
    }),
});
