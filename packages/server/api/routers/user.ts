import { db } from "@/packages/db/client";
import { createTRPCRouter, publicProcedure } from "../../trpc/trpc";
import { z } from "zod";
import { hashPassword } from "@/packages/lib/hash";

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      let user = await db.user.findFirst({
        where: {
          email: {
            equals: input.email.toLowerCase(),
          },
        },
      });

      if (user) {
        return "USER_ALREADY_EXISTS";
      }

      user = await db.user.create({
        data: {
          email: input.email,
          password: await hashPassword(input.password),
          name: input.name,
        },
      });
      return user;
    }),
});
