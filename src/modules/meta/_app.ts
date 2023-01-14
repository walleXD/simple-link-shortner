import { initTRPC } from "@trpc/server";

export const t = initTRPC.context().create();

export const router = t.router;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
