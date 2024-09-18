import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { deadlines } from "~/server/db/schema";

export const deadlineRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const deadline = await ctx.db.query.deadlines.findMany({
    });

    return deadline ?? null;
  }),
});
