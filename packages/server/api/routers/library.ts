import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc/trpc";
import { db } from "@/packages/db/client";

export const libraryRouter = createTRPCRouter({
  // Prompts
  createPrompt: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        prompt: z.string(),
        inputValues: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const prompt = await db.prompt.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          inputValues: {
            values: input.inputValues,
          },
        },
      });
      return prompt;
    }),

  getPrompts: protectedProcedure.query(async ({ ctx }) => {
    const prompts = await db.prompt.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return prompts;
  }),
});
