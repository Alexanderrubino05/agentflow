import { createTRPCRouter } from "../trpc/trpc";
import { adminRouter } from "./routers/admin";
import { userRouter } from "./routers/user";
import { libraryRouter } from "./routers/library";
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  user: userRouter,
  library: libraryRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
