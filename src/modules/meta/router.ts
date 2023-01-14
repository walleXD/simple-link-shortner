import { z } from "zod";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router, publicProcedure } from "./trpc";
import { linkShortnerRouter as linkShortner } from "@/linkShortner";

export const testRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    }),
});

export const appRouter = router({
  test: testRouter,
  linkShortner,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
