import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { eq, gt, asc } from "drizzle-orm/expressions";
import { deadlines } from "~/server/db/schema";

export const deadlineRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.deadlines.findMany({
      where: (deadlines) =>
        eq(deadlines.completed, false) && gt(deadlines.deadline, new Date()),
      orderBy: asc(deadlines.deadline),
    });
  }),

  delete: publicProcedure
    .input(z.object({ name: z.string(), deadline: z.date() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(deadlines).where(eq(deadlines.name, input.name) && eq(deadlines.deadline, input.deadline));
    }),

  create: publicProcedure
    .input(z.object({ name: z.string(), deadline: z.date() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(deadlines).values({ name: input.name, deadline: input.deadline, completed: false });
    }),
});
