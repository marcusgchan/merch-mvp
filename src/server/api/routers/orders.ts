import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { addOrderSchema } from "~/schemas/order";

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({
      include: { _count: { select: { orderedItems: true } } },
    });

    return [...orders].map((order) => ({
      ...order,
      count: order._count.orderedItems as number,
    }));
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: {
        id: input,
      },
      include: {
        orderedItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }),
  add: publicProcedure
    .input(addOrderSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Verify size
      const order = await ctx.prisma.order.create({
        data: {
          name: input.name,
          email: input.email,
          orderedItems: {
            createMany: {
              data: input.products.map((product) => ({
                productId: product.id,
                quantity: product.quantity,
                size: product.size,
              })),
            },
          },
        },
      });

      return order;
    }),
});
