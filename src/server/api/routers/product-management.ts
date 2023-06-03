import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  addProductSchema,
  editProductSchema,
} from "~/schemas/productManagement";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
  edit: protectedProcedure
    .input(editProductSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedProduct = await ctx.prisma.$transaction(
        async (prisma) => {
          // Check if has be updated by someone else while viewing
          const product = await prisma.product.findUnique({
            where: { id: input.id },
          });

          if (product?.updatedAt.getTime() !== input.updatedAt.getTime()) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Product has been updated by someone else.",
            });
          }

          const updatedProduct = await ctx.prisma.product.update({
            where: {
              id: input.id,
            },
            data: {
              name: input.name,
              price: input.price,
            },
          });

          const upsertPromises = input.about.map(({ description, id }) => {
            return ctx.prisma.aboutProduct.upsert({
              where: {
                id: id,
              },
              update: {
                description: description,
              },
              create: {
                description: description,
                productId: input.id,
              },
            });
          });

          await Promise.all(upsertPromises);

          return updatedProduct;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
      );

      return updatedProduct;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany();
    return products;
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
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
